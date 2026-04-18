# Supabase Migrations

Run these in the Supabase dashboard → SQL Editor.

---

## 001 — Add spirit_type to inventory (required for spirit subtype matching)

```sql
ALTER TABLE inventory
  ADD COLUMN IF NOT EXISTS spirit_type TEXT;
```

This column stores the user-selected spirit subtype (e.g. `'irish-whiskey'`, `'scotch-peated'`, `'mezcal'`).
It is optional — existing rows without a value will have `NULL` and will continue matching via ingredient ID
and brand-name pattern matching as before.

After running this migration, new bottles added or edited through the app will persist their spirit type
to Supabase and use it for precise recipe matching.
