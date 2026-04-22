-- Full-fidelity inventory table — stores complete bottle data per user.
-- Run this in the Supabase SQL editor:
-- https://supabase.com/dashboard/project/ctwwbnrkvzlwkhefzodu/sql

CREATE TABLE IF NOT EXISTS user_inventory (
  id            UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       UUID        REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  ingredient_id TEXT        NOT NULL,
  name          TEXT        NOT NULL,
  category      TEXT        NOT NULL,
  spirit_type   TEXT,
  quantity      TEXT        NOT NULL DEFAULT 'full',
  size_ml       INTEGER     NOT NULL DEFAULT 750,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, ingredient_id)
);

ALTER TABLE user_inventory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only access their own inventory"
  ON user_inventory FOR ALL
  USING (auth.uid() = user_id);
