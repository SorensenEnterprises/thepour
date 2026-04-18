import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { InventoryItem, QuantityLevel, SPIRIT_TYPE_CANONICAL } from '../types';
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

type SupabaseRow = { ingredient_id: string; quantity_level: string; spirit_type: string | null };

async function loadFromSupabase(userId: string): Promise<InventoryItem[]> {
  const base = loadFromLocalStorage();
  if (!supabaseConfigured) return base;

  const { data, error } = await supabase
    .from('inventory')
    .select('ingredient_id, quantity_level, spirit_type')
    .eq('user_id', userId);

  if (error || !data || data.length === 0) return base;

  const remote = new Map<string, { quantity: QuantityLevel; spiritType?: string }>(
    (data as SupabaseRow[]).map(r => [
      r.ingredient_id,
      { quantity: r.quantity_level as QuantityLevel, spiritType: r.spirit_type ?? undefined },
    ])
  );

  return base.map(item => {
    const r = remote.get(item.ingredientId);
    if (!r) return item;
    return { ...item, quantity: r.quantity, spiritType: r.spiritType ?? item.spiritType };
  });
}

function upsertToSupabase(userId: string, ingredientId: string, quantity: QuantityLevel, spiritType?: string) {
  if (!supabaseConfigured) return;
  supabase
    .from('inventory')
    .upsert(
      {
        user_id:       userId,
        ingredient_id: ingredientId,
        quantity_level: quantity,
        spirit_type:   spiritType ?? null,
        updated_at:    new Date().toISOString(),
      },
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
  const userIdRef   = useRef(userId);
  const inventoryRef = useRef(inventory);
  userIdRef.current   = userId;
  inventoryRef.current = inventory;

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
    if (userIdRef.current) {
      const item = inventoryRef.current.find(i => i.ingredientId === ingredientId);
      upsertToSupabase(userIdRef.current, ingredientId, quantity, item?.spiritType);
    }
  }, []);

  const addItem = useCallback((item: InventoryItem) => {
    setInventory(prev => [...prev, item]);
    if (userIdRef.current) upsertToSupabase(userIdRef.current, item.ingredientId, item.quantity, item.spiritType);
  }, []);

  const editItem = useCallback((updated: InventoryItem) => {
    setInventory(prev => prev.map(item =>
      item.ingredientId === updated.ingredientId ? updated : item
    ));
    if (userIdRef.current) upsertToSupabase(userIdRef.current, updated.ingredientId, updated.quantity, updated.spiritType);
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
      // Brand/keyword name expansion
      getCanonicalIds(item.name).forEach(id => ids.add(id));
      // Explicit spiritType expansion (most precise — user-selected or form-derived)
      if (item.spiritType) {
        (SPIRIT_TYPE_CANONICAL[item.spiritType] ?? []).forEach(id => ids.add(id));
      }
    });
    return ids;
  }, [inventory]);

  // splashIds = "low stock" — factors in bottle size, also expands via brand map + spiritType
  const splashIds = useMemo(() => {
    const ids = new Set<string>();
    inventory.forEach(item => {
      if (!isLowStock(item)) return;
      ids.add(item.ingredientId);
      getCanonicalIds(item.name).forEach(id => ids.add(id));
      if (item.spiritType) {
        (SPIRIT_TYPE_CANONICAL[item.spiritType] ?? []).forEach(id => ids.add(id));
      }
    });
    return ids;
  }, [inventory]);

  return { inventory, inStockIds, splashIds, setQuantity, addItem, editItem, removeItem, ready };
}
