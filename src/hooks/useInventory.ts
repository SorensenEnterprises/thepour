import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { InventoryItem, QuantityLevel } from '../types';
import { sampleInventory } from '../data/sampleInventory';
import { supabase, supabaseConfigured } from '../lib/supabase';

const LS_KEY = 'thepour_inventory';

// ── localStorage helpers ──────────────────────────────────────────────────────

function loadFromLocalStorage(): InventoryItem[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return sampleInventory;
    const saved: InventoryItem[] = JSON.parse(raw);
    // Ensure all sampleInventory items exist (app updates may add new ones)
    const savedMap = new Map(saved.map(i => [i.ingredientId, i]));
    const merged = sampleInventory.map(item => savedMap.get(item.ingredientId) ?? item);
    // Append custom bottles not in sampleInventory
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

// ── Hook ─────────────────────────────────────────────────────────────────────

export function useInventory(userId?: string) {
  const [inventory, setInventory] = useState<InventoryItem[]>(sampleInventory);
  const [ready, setReady] = useState(false);
  const userIdRef = useRef(userId);
  userIdRef.current = userId;

  // Initial load
  useEffect(() => {
    setReady(false);
    if (userId) {
      loadFromSupabase(userId).then(inv => {
        setInventory(inv);
        setReady(true);
      });
    } else {
      setInventory(loadFromLocalStorage());
      setReady(true);
    }
  }, [userId]);

  // Persist to localStorage on every change (both guest and signed-in)
  useEffect(() => {
    if (!ready) return;
    saveToLocalStorage(inventory);
  }, [inventory, ready]);

  const setQuantity = useCallback((ingredientId: string, quantity: QuantityLevel) => {
    setInventory(prev =>
      prev.map(item =>
        item.ingredientId === ingredientId ? { ...item, quantity } : item
      )
    );
    if (userIdRef.current) {
      upsertToSupabase(userIdRef.current, ingredientId, quantity);
    }
  }, []);

  const addItem = useCallback((item: InventoryItem) => {
    setInventory(prev => [...prev, item]);
  }, []);

  const removeItem = useCallback((ingredientId: string) => {
    setInventory(prev => prev.filter(item => item.ingredientId !== ingredientId));
  }, []);

  const inStockIds = useMemo(
    () => new Set(inventory.filter(i => i.quantity !== 'out').map(i => i.ingredientId)),
    [inventory]
  );

  const splashIds = useMemo(
    () => new Set(inventory.filter(i => i.quantity === 'splash').map(i => i.ingredientId)),
    [inventory]
  );

  return { inventory, inStockIds, splashIds, setQuantity, addItem, removeItem, ready };
}
