# Drink of the Week / Weekend — Operations Guide

The featured drink is driven entirely by the `featured_drink` table in Supabase.
**No code deploy is needed to change or add a featured drink.**

## How to update each week

Run this INSERT in the Supabase SQL editor (Dashboard → SQL Editor):

```sql
insert into featured_drink (
  drink_name,
  vesper_description,
  occasion,
  recipe_teaser,
  active_from,
  active_to
  -- sponsor_name, sponsor_url  ← optional, omit if no sponsor
) values (
  'Aperol Spritz',
  'Three ingredients, no apologies. Aperol, prosecco, soda — over ice, in a wine glass, with an orange slice. It is the drink of every good patio ever.',
  'Memorial Day Weekend',
  '3 oz Prosecco · 2 oz Aperol · 1 oz Soda Water',
  '2026-05-23',
  '2026-05-25'
);
```

## Fields

| Field | Required | Notes |
|-------|----------|-------|
| `drink_name` | ✓ | Must match the recipe name exactly in the app for "Ready ✓" to work |
| `vesper_description` | ✓ | Vesper's full voice description. First sentence shown in-app banner. |
| `occasion` | — | Label shown above the drink name ("KENTUCKY DERBY WEEKEND") |
| `recipe_teaser` | — | Ingredient shorthand shown on landing page card (`2 oz X · Y · Z`) |
| `active_from` | ✓ | Date the feature goes live (inclusive) |
| `active_to` | ✓ | Last active date (inclusive) — typically a 3-day weekend window |
| `sponsor_name` | — | If present, shows "Featured" badge in-app and sponsor credit on landing page |
| `sponsor_url` | — | URL for sponsor link (requires `sponsor_name`) |

## How the system works

- **Edge function** `get-featured-drink` queries for a row where today falls between `active_from` and `active_to`.
- If nothing is active, it falls back to the **most recently expired** row so the landing page is never empty.
- **Landing page**: Featured section appears whenever the function returns a row.
- **In-app banner**: Appears only **Friday–Sunday** (`getDay() === 5 || 6 || 0`). Users can dismiss it per session.

## Deactivating a feature early

Set `active_to` to yesterday's date:

```sql
update featured_drink
set active_to = current_date - interval '1 day'
where drink_name = 'Mint Julep'
  and active_from = '2026-05-01';
```
