-- Drink of the Week / Weekend feature
create table if not exists featured_drink (
  id              uuid        default gen_random_uuid() primary key,
  drink_name      text        not null,
  vesper_description text     not null,
  occasion        text,
  recipe_teaser   text,
  sponsor_name    text,
  sponsor_url     text,
  active_from     date        not null,
  active_to       date        not null,
  created_at      timestamptz default now()
);

-- Index for the date-range query in the edge function
create index if not exists featured_drink_dates_idx
  on featured_drink (active_from, active_to);

-- vesper_intro: one-liner in Vesper's voice, shown above the drink name (max ~80 chars)
alter table featured_drink add column if not exists vesper_intro text;

-- Seed: Kentucky Derby Weekend 2026
insert into featured_drink (
  drink_name,
  vesper_description,
  vesper_intro,
  occasion,
  recipe_teaser,
  active_from,
  active_to
) values (
  'Mint Julep',
  'Once a year, everyone becomes a bourbon person. The Mint Julep is cold, sweet, and unapologetically Southern — crushed ice, fresh mint, a good bourbon, and nothing else. Make it in a silver cup if you have one. Make it anyway if you don''t.',
  'Derby weekend. There''s only one drink.',
  'Kentucky Derby Weekend',
  '2 oz Bourbon · Fresh Mint · Simple Syrup · Crushed Ice',
  '2026-05-01',
  '2026-05-03'
);
