import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { InventoryItem, QuantityLevel, BottleSize, SPIRIT_TYPE_CANONICAL } from '../types';
import type { Ingredient } from '../types';
import { sampleInventory } from '../data/sampleInventory';
import { supabase, supabaseConfigured } from '../lib/supabase';
import { getCanonicalIds } from '../utils/brandMap';

const LS_KEY = 'thepour_inventory';

// ── Low-stock detection ───────────────────────────────────────────────────────

const QUANTITY_FRACTION: Record<QuantityLevel, number> = {
  'full':           0.95,
  'three-quarters': 0.75,
  'half':           0.50,
  'quarter':        0.25,
  'splash':         0.08,
  'out':            0,
};

const LOW_STOCK_ML = 120;

function isLowStock(item: InventoryItem): boolean {
  if (item.quantity === 'out') return false;
  if (item.quantity === 'splash') return true;
  const ml = (item.size ?? 750) * QUANTITY_FRACTION[item.quantity];
  return ml < LOW_STOCK_ML;
}

// ── localStorage helpers (guest mode only) ────────────────────────────────────

function lsLoad(): InventoryItem[] {
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

function lsSave(inventory: InventoryItem[]) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(inventory)); } catch {}
}

// ── Supabase row types ────────────────────────────────────────────────────────

interface DbRow {
  ingredient_id: string;
  name:          string;
  category:      string;
  spirit_type:   string | null;
  quantity:      string;
  size_ml:       number;
}

function rowToItem(row: DbRow): InventoryItem {
  return {
    ingredientId: row.ingredient_id,
    name:         row.name,
    category:     row.category as Ingredient['category'],
    spiritType:   row.spirit_type ?? undefined,
    quantity:     row.quantity as QuantityLevel,
    size:         (row.size_ml as BottleSize) ?? 750,
  };
}

function itemToRow(userId: string, item: InventoryItem) {
  return {
    user_id:       userId,
    ingredient_id: item.ingredientId,
    name:          item.name,
    category:      item.category,
    spirit_type:   item.spiritType ?? null,
    quantity:      item.quantity,
    size_ml:       item.size ?? 750,
    updated_at:    new Date().toISOString(),
  };
}

// Returns true if the error indicates the row simply wasn't found (not a real failure)
function isNotFoundError(msg: string): boolean {
  return msg.includes('0 rows') || msg.includes('PGRST116') || msg === '';
}

// ── Supabase CRUD ─────────────────────────────────────────────────────────────

async function dbFetch(userId: string): Promise<{ rows: InventoryItem[] | null; error: string | null }> {
  const { data, error } = await supabase
    .from('user_inventory')
    .select('ingredient_id, name, category, spirit_type, quantity, size_ml')
    .eq('user_id', userId)
    .order('created_at');

  if (error) return { rows: null, error: error.message };
  return { rows: (data as DbRow[]).map(rowToItem), error: null };
}

async function dbUpsert(userId: string, item: InventoryItem): Promise<string | null> {
  const { error } = await supabase
    .from('user_inventory')
    .upsert(itemToRow(userId, item), { onConflict: 'user_id,ingredient_id' });
  return error ? error.message : null;
}


async function dbDelete(userId: string, ingredientId: string): Promise<string | null> {
  const { error } = await supabase
    .from('user_inventory')
    .delete()
    .eq('user_id', userId)
    .eq('ingredient_id', ingredientId);
  return error ? error.message : null;
}

// ── Hook ─────────────────────────────────────────────────────────────────────

export function useInventory(userId?: string) {
  const [inventory, setInventory] = useState<InventoryItem[]>(userId ? [] : sampleInventory);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState<string | null>(null);

  const inventoryRef = useRef(inventory);
  const userIdRef    = useRef(userId);
  inventoryRef.current = inventory;
  userIdRef.current    = userId;

  // ── Load on auth change ────────────────────────────────────────────────────
  useEffect(() => {
    if (!userId) {
      setInventory(lsLoad());
      setLoading(false);
      return;
    }

    if (!supabaseConfigured) {
      setInventory(lsLoad());
      setLoading(false);
      return;
    }

    setLoading(true);

    dbFetch(userId).then(({ rows, error: fetchErr }) => {
      if (fetchErr) {
        console.error('[useInventory] fetch error:', fetchErr);
        // Table may not exist yet — start empty rather than showing sample data
        setInventory([]);
        setLoading(false);
        return;
      }

      // Supabase is source of truth — empty means empty
      setInventory(rows ?? []);
      setLoading(false);
    });
  }, [userId]);

  // Guest mode — keep localStorage in sync
  useEffect(() => {
    if (userId || loading) return;
    lsSave(inventory);
  }, [inventory, userId, loading]);

  const clearError = useCallback(() => setError(null), []);

  // ── setQuantity ────────────────────────────────────────────────────────────
  const setQuantity = useCallback(async (ingredientId: string, quantity: QuantityLevel) => {
    const uid = userIdRef.current;

    // Update local state immediately regardless — this is always correct
    setInventory(prev => prev.map(i =>
      i.ingredientId === ingredientId ? { ...i, quantity } : i
    ));

    if (!uid || !supabaseConfigured) return;

    const target = inventoryRef.current.find(i => i.ingredientId === ingredientId);
    if (!target) return;

    // Full upsert — inserts if row doesn't exist, updates if it does
    const err = await dbUpsert(uid, { ...target, quantity });
    if (err) {
      console.error('[useInventory] setQuantity upsert error:', err);
      // Don't rollback — the local change is intentional. Sync will retry on next write.
    }
  }, []);

  // ── addItem ────────────────────────────────────────────────────────────────
  const addItem = useCallback(async (item: InventoryItem) => {
    const uid = userIdRef.current;

    if (!uid || !supabaseConfigured) {
      setInventory(prev => [...prev, item]);
      return;
    }

    // Write first, then update local state on success
    const err = await dbUpsert(uid, item);
    if (err) {
      setError('Couldn\'t save bottle — please try again.');
      return;
    }
    setInventory(prev => [...prev, item]);
  }, []);

  // ── editItem ───────────────────────────────────────────────────────────────
  const editItem = useCallback(async (updated: InventoryItem) => {
    const uid = userIdRef.current;

    if (!uid || !supabaseConfigured) {
      setInventory(prev => prev.map(i =>
        i.ingredientId === updated.ingredientId ? updated : i
      ));
      return;
    }

    const err = await dbUpsert(uid, updated);
    if (err) {
      setError('Couldn\'t save changes — please try again.');
      return;
    }
    setInventory(prev => prev.map(i =>
      i.ingredientId === updated.ingredientId ? updated : i
    ));
  }, []);

  // ── removeItem ─────────────────────────────────────────────────────────────
  const removeItem = useCallback(async (ingredientId: string) => {
    const uid = userIdRef.current;

    // Remove from local state immediately
    const snapshot = inventoryRef.current;
    setInventory(prev => prev.filter(i => i.ingredientId !== ingredientId));

    if (!uid || !supabaseConfigured) return;

    const err = await dbDelete(uid, ingredientId);
    if (err && !isNotFoundError(err)) {
      // Real error (not just "row didn't exist") — rollback
      setInventory(snapshot);
      setError('Couldn\'t delete item — please try again.');
    }
  }, []);

  // ── Derived sets ──────────────────────────────────────────────────────────
  const inStockIds = useMemo(() => {
    const ids = new Set<string>();
    inventory.forEach(item => {
      if (item.quantity === 'out') return;
      ids.add(item.ingredientId);
      getCanonicalIds(item.name).forEach(id => ids.add(id));
      if (item.spiritType) {
        (SPIRIT_TYPE_CANONICAL[item.spiritType] ?? []).forEach(id => ids.add(id));
      }
    });
    return ids;
  }, [inventory]);

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

  return {
    inventory,
    inStockIds,
    splashIds,
    loading,
    error,
    clearError,
    setQuantity,
    addItem,
    editItem,
    removeItem,
  };
}
