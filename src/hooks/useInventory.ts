import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { InventoryItem, QuantityLevel } from '../types';
import { sampleInventory } from '../data/sampleInventory';
import { supabase, supabaseConfigured } from '../lib/supabase';
import { getCanonicalIds } from '../utils/brandMap';

const LS_KEY = 'thepour_inventory';

// ── Low-stock detection ───────────────────────────────────────────────────────
// Factors in bottle size so a 375ml at ¼ triggers the same warning as a splash

const QUANTITY_FRACTION: Record<QuantityLevel, number> = {
  'full':           0.95,
  'three-quarters': 0.75,
  'half':           0.50,
  'quarter':        0.25,
  'splash':         0.08,
  'out':            0,
};

// ~4 oz — enough for roughly 2 standard pours
const LOW_STOCK_ML = 120;

function isLowStock(item: InventoryItem): boolean {
  if (item.quantity === 'out') return false;
  if (item.quantity === 'splash') return true;
  const ml = (item.size ?? 750) * QUANTITY_FRACTION[item.quantity];
  return ml < LOW_STOCK_ML;
}

// ── localStorage helpers ──────────────────────────────────────────────────────

function loadFromLocalStorage(): InventoryItem[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return sampleInventory;
    const saved: InventoryItem[] = JSON.parse(raw);
    const savedMap = new Map(saved.map(i => [i.ingredientId, i]));
    const merged = sampleInventory.map(item => savedMap.get(item.ingredientId) ?? item);
    const sampleIds = new Set(sampleInventory.map(i => i.ingredientId));
    const custom = saved.filter(i => !sampleIds.has(i.ingredientId));
    return [...merged, ...custom];
  } catch {
    return sampleInventory;
  }
}

function saveToLocalStorage(inventory: InventoryItem[]) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(inventory));
  } catch { /* storage full — silently skip */ }
}

// ── Supabase helpers ──────────────────────────────────────────────────────────

type SupabaseRow = { ingredient_id: string; quantity_level: string };

async function loadFromSupabase(userId: string): Promise<InventoryItem[]> {
  const base = loadFromLocalStorage();
  if (!supabaseConfigured) return base;

  const { data, error } = await supabase
    .from('inventory')
    .select('ingredient_id, quantity_level')
    .eq('user_id', userId);

  if (error || !data || data.length === 0) return base;

  const remote = new Map<string, QuantityLevel>(
    (data as SupabaseRow[]).map(r => [r.ingredient_id, r.quantity_level as QuantityLevel])
  );

  return base.map(item =>
    remote.has(item.ingredientId)
      ? { ...item, quantity: remote.get(item.ingredientId)! }
      : item
  );
}

function upsertToSupabase(userId: string, ingredientId: string, quantity: QuantityLevel) {
  if (!supabaseConfigured) return;
  supabase
    .from('inventory')
    .upsert(
      { user_id: userId, ingredient_id: ingredientId, quantity_level: quantity, updated_at: new Date().toISOString() },
      { onConflict: 'user_id,ingredient_id' }
    )
    .then(({ error }) => {
      if (error) console.error('Supabase upsert error:', error.message);
    });
}

function deleteFromSupabase(userId: string, ingredientId: string) {
  if (!supabaseConfigured) return;
  supabase
    .from('inventory')
    .delete()
    .eq('user_id', userId)
    .eq('ingredient_id', ingredientId)
    .then(({ error }) => {
      if (error) console.error('Supabase delete error:', error.message);
    });
}

// ── Hook ─────────────────────────────────────────────────────────────────────

export function useInventory(userId?: string) {
  const [inventory, setInventory] = useState<InventoryItem[]>(sampleInventory);
  const [ready, setReady] = useState(false);
  const userIdRef = useRef(userId);
  userIdRef.current = userId;

  useEffect(() => {
    setReady(false);
    if (userId) {
      loadFromSupabase(userId).then(inv => { setInventory(inv); setReady(true); });
    } else {
      setInventory(loadFromLocalStorage());
      setReady(true);
    }
  }, [userId]);

  useEffect(() => {
    if (!ready) return;
    saveToLocalStorage(inventory);
  }, [inventory, ready]);

  const setQuantity = useCallback((ingredientId: string, quantity: QuantityLevel) => {
    setInventory(prev => prev.map(item =>
      item.ingredientId === ingredientId ? { ...item, quantity } : item
    ));
    if (userIdRef.current) upsertToSupabase(userIdRef.current, ingredientId, quantity);
  }, []);

  const addItem = useCallback((item: InventoryItem) => {
    setInventory(prev => [...prev, item]);
  }, []);

  const editItem = useCallback((updated: InventoryItem) => {
    setInventory(prev => prev.map(item =>
      item.ingredientId === updated.ingredientId ? updated : item
    ));
    if (userIdRef.current) upsertToSupabase(userIdRef.current, updated.ingredientId, updated.quantity);
  }, []);

  const removeItem = useCallback((ingredientId: string) => {
    setInventory(prev => prev.filter(item => item.ingredientId !== ingredientId));
    if (userIdRef.current) deleteFromSupabase(userIdRef.current, ingredientId);
  }, []);

  const inStockIds = useMemo(() => {
    const ids = new Set<string>();
    inventory.forEach(item => {
      if (item.quantity === 'out') return;
      ids.add(item.ingredientId);
      // Expand brand/keyword matches to canonical ingredient IDs
      getCanonicalIds(item.name).forEach(id => ids.add(id));
    });
    return ids;
  }, [inventory]);

  // splashIds = "low stock" — factors in bottle size, also expands via brand map
  const splashIds = useMemo(() => {
    const ids = new Set<string>();
    inventory.forEach(item => {
      if (!isLowStock(item)) return;
      ids.add(item.ingredientId);
      getCanonicalIds(item.name).forEach(id => ids.add(id));
    });
    return ids;
  }, [inventory]);

  return { inventory, inStockIds, splashIds, setQuantity, addItem, editItem, removeItem, ready };
}
