// MIGRATION REQUIRED: Run this SQL in Supabase dashboard before deploying:
// CREATE TABLE IF NOT EXISTS user_pantry (
//   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
//   user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
//   item_id TEXT NOT NULL,
//   UNIQUE(user_id, item_id)
// );
// ALTER TABLE user_pantry ENABLE ROW LEVEL SECURITY;
// CREATE POLICY "Users can only access their own pantry"
//   ON user_pantry FOR ALL USING (auth.uid() = user_id);

import { useState, useCallback, useEffect } from 'react';
import { supabase, supabaseConfigured } from '../lib/supabase';

const LS_KEY = 'thepour_pantry';

function lsLoad(): Set<string> {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return new Set();
    return new Set(JSON.parse(raw) as string[]);
  } catch {
    return new Set();
  }
}

function lsSave(ids: Set<string>) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(Array.from(ids))); } catch {}
}

async function dbLoad(userId: string): Promise<Set<string>> {
  const { data, error } = await supabase
    .from('user_pantry')
    .select('item_id')
    .eq('user_id', userId);
  if (error || !data) return new Set();
  return new Set((data as { item_id: string }[]).map(r => r.item_id));
}

async function dbAdd(userId: string, itemId: string): Promise<void> {
  await supabase
    .from('user_pantry')
    .insert({ user_id: userId, item_id: itemId });
}

async function dbRemove(userId: string, itemId: string): Promise<void> {
  await supabase
    .from('user_pantry')
    .delete()
    .eq('user_id', userId)
    .eq('item_id', itemId);
}

export function usePantry(userId?: string) {
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!userId) {
      setCheckedIds(lsLoad());
      return;
    }
    if (!supabaseConfigured) {
      setCheckedIds(lsLoad());
      return;
    }
    dbLoad(userId).then(ids => setCheckedIds(ids));
  }, [userId]);

  // Guest mode — keep localStorage in sync
  useEffect(() => {
    if (userId) return;
    lsSave(checkedIds);
  }, [checkedIds, userId]);

  const togglePantry = useCallback(async (itemId: string) => {
    const uid = userId;
    const isChecked = checkedIds.has(itemId);

    const next = new Set(checkedIds);
    if (isChecked) next.delete(itemId);
    else next.add(itemId);
    setCheckedIds(next);

    if (!uid || !supabaseConfigured) return;
    if (isChecked) {
      await dbRemove(uid, itemId);
    } else {
      await dbAdd(uid, itemId);
    }
  }, [checkedIds, userId]);

  return {
    checkedPantryIds: checkedIds,
    togglePantry,
  };
}
