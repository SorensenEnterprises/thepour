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

// ── Supabase row type (actual table schema — no ingredient_id column) ─────────

interface DbRow {
  id:          string;
  name:        string;
  category:    string;
  spirit_type: string | null;
  quantity:    string;
  size_ml:     number;
}

function rowToItem(row: DbRow): InventoryItem {
  return {
    id:           row.id,
    ingredientId: row.id, // UUID used as the app identifier for DB-loaded items
    name:         row.name,
    category:     row.category as Ingredient['category'],
    spiritType:   row.spirit_type ?? undefined,
    quantity:     row.quantity as QuantityLevel,
    size:         (row.size_ml as BottleSize) ?? 750,
  };
}

// ── Supabase CRUD ─────────────────────────────────────────────────────────────

async function dbFetch(userId: string): Promise<{ rows: InventoryItem[] | null; error: string | null }> {
  const { data, error } = await supabase
    .from('user_inventory')
    .select('id, name, category, spirit_type, quantity, size_ml')
    .eq('user_id', userId)
    .order('created_at');

  if (error) return { rows: null, error: error.message };

  const items = (data as DbRow[]).map(rowToItem);

  // Deduplicate by name (case-insensitive). Ordered by created_at ASC so later
  // entries are newer — Map.set overwrites so the last occurrence (newest) wins.
  const seenByName = new Map<string, InventoryItem>();
  items.forEach(item => seenByName.set(item.name.toLowerCase().trim(), item));

  const keptIds = new Set(Array.from(seenByName.values()).map(i => i.id));
  const dupIds  = items.map(i => i.id!).filter(id => id && !keptIds.has(id));

  if (dupIds.length > 0) {
    supabase.from('user_inventory').delete().in('id', dupIds).eq('user_id', userId)
      .then(({ error: e }) => { if (e) console.error('[useInventory] dedup:', e.message); });
  }

  return { rows: items.filter(i => keptIds.has(i.id)), error: null };
}

// Check if a row exists by id, then UPDATE; if not, INSERT.
// Returns the row's id (may differ from item.id if a new UUID was assigned by DB).
async function dbSave(userId: string, item: InventoryItem): Promise<{ id: string | null; error: string | null }> {
  // If item has a DB id, check whether the row still exists
  if (item.id) {
    const { data: existing } = await supabase
      .from('user_inventory')
      .select('id')
      .eq('id', item.id)
      .eq('user_id', userId)
      .single();

    if (existing) {
      const { error } = await supabase
        .from('user_inventory')
        .update({
          name:        item.name,
          category:    item.category,
          spirit_type: item.spiritType ?? null,
          quantity:    item.quantity,
          size_ml:     item.size ?? 750,
          updated_at:  new Date().toISOString(),
        })
        .eq('id', item.id)
        .eq('user_id', userId);
      return { id: item.id, error: error?.message ?? null };
    }
  }

  // INSERT — let Supabase generate the UUID
  const { data, error } = await supabase
    .from('user_inventory')
    .insert({
      user_id:     userId,
      name:        item.name,
      category:    item.category,
      spirit_type: item.spiritType ?? null,
      quantity:    item.quantity,
      size_ml:     item.size ?? 750,
    })
    .select('id')
    .single();

  return { id: (data as { id: string } | null)?.id ?? null, error: error?.message ?? null };
}

// Quantity-only update path — faster than full dbSave when the row is known to exist.
// Falls back to full dbSave if the row is missing.
async function dbUpdateQuantity(userId: string, item: InventoryItem, quantity: QuantityLevel): Promise<{ id: string | null; error: string | null }> {
  if (item.id) {
    const { data: existing } = await supabase
      .from('user_inventory')
      .select('id')
      .eq('id', item.id)
      .eq('user_id', userId)
      .single();

    if (existing) {
      const { error } = await supabase
        .from('user_inventory')
        .update({ quantity, updated_at: new Date().toISOString() })
        .eq('id', item.id)
        .eq('user_id', userId);
      return { id: item.id, error: error?.message ?? null };
    }
  }

  // Row doesn't exist yet — insert full item with new quantity
  return dbSave(userId, { ...item, quantity });
}

async function dbDelete(userId: string, item: InventoryItem): Promise<string | null> {
  if (!item.id) return null; // never persisted — nothing to delete

  const { error } = await supabase
    .from('user_inventory')
    .delete()
    .eq('id', item.id)
    .eq('user_id', userId);

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
        setInventory([]);
        setLoading(false);
        return;
      }
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

    // Apply locally immediately — never blocked by network
    setInventory(prev => prev.map(i =>
      i.ingredientId === ingredientId ? { ...i, quantity } : i
    ));

    if (!uid || !supabaseConfigured) return;

    const target = inventoryRef.current.find(i => i.ingredientId === ingredientId);
    if (!target) return;

    const { id: returnedId, error: err } = await dbUpdateQuantity(uid, target, quantity);
    if (err) {
      console.error('[useInventory] setQuantity error:', err);
      return;
    }
    // If a new DB row was created, backfill its id into local state
    if (returnedId && returnedId !== target.id) {
      setInventory(prev => prev.map(i =>
        i.ingredientId === ingredientId ? { ...i, id: returnedId, ingredientId: returnedId } : i
      ));
    }
  }, []);

  // ── addItem ────────────────────────────────────────────────────────────────
  const addItem = useCallback(async (item: InventoryItem) => {
    const uid = userIdRef.current;

    if (!uid || !supabaseConfigured) {
      setInventory(prev => [...prev, item]);
      return;
    }

    const { id: newId, error: err } = await dbSave(uid, item);
    if (err) {
      setError('Couldn\'t save bottle — please try again.');
      return;
    }
    // Store the DB-assigned id so future edits/deletes can find the row
    const saved: InventoryItem = newId
      ? { ...item, id: newId, ingredientId: newId }
      : item;
    setInventory(prev => [...prev, saved]);
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

    const { id: returnedId, error: err } = await dbSave(uid, updated);
    if (err) {
      setError('Couldn\'t save changes — please try again.');
      return;
    }
    const saved: InventoryItem = returnedId
      ? { ...updated, id: returnedId, ingredientId: returnedId }
      : updated;
    setInventory(prev => prev.map(i =>
      i.ingredientId === updated.ingredientId ? saved : i
    ));
  }, []);

  // ── removeItem ─────────────────────────────────────────────────────────────
  const removeItem = useCallback(async (ingredientId: string) => {
    const uid = userIdRef.current;

    const target = inventoryRef.current.find(i => i.ingredientId === ingredientId);
    const snapshot = inventoryRef.current;
    setInventory(prev => prev.filter(i => i.ingredientId !== ingredientId));

    if (!uid || !supabaseConfigured || !target) return;

    const err = await dbDelete(uid, target);
    if (err) {
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
    // Map each canonical ID → all in-stock items that provide it
    const providedBy = new Map<string, InventoryItem[]>();
    inventory.forEach(item => {
      if (item.quantity === 'out') return;
      const ids: string[] = [item.ingredientId, ...getCanonicalIds(item.name)];
      if (item.spiritType) ids.push(...(SPIRIT_TYPE_CANONICAL[item.spiritType] ?? []));
      ids.forEach(id => {
        if (!providedBy.has(id)) providedBy.set(id, []);
        providedBy.get(id)!.push(item);
      });
    });
    // An ID is "splash" only if every item providing it is low stock
    const ids = new Set<string>();
    providedBy.forEach((items, id) => {
      if (items.every(item => isLowStock(item))) ids.add(id);
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
