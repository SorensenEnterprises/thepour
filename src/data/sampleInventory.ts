import { InventoryItem } from '../types';

export const sampleInventory: InventoryItem[] = [
  // ── Spirits ───────────────────────────────────────────────────────────────────
  { ingredientId: 'bourbon',         name: 'Bourbon',           category: 'spirit',  quantity: 'half',          spiritType: 'bourbon' },
  { ingredientId: 'rye-whiskey',     name: 'Rye Whiskey',       category: 'spirit',  quantity: 'out',           spiritType: 'rye-whiskey' },
  { ingredientId: 'irish-whiskey',   name: 'Irish Whiskey',     category: 'spirit',  quantity: 'out',           spiritType: 'irish-whiskey' },
  { ingredientId: 'scotch',          name: 'Blended Scotch',    category: 'spirit',  quantity: 'out',           spiritType: 'scotch-blended' },
  { ingredientId: 'islay-scotch',    name: 'Islay Scotch',      category: 'spirit',  quantity: 'out',           spiritType: 'scotch-peated' },
  { ingredientId: 'japanese-whisky', name: 'Japanese Whisky',   category: 'spirit',  quantity: 'out',           spiritType: 'japanese-whisky' },
  { ingredientId: 'gin',             name: 'Gin',               category: 'spirit',  quantity: 'full',          spiritType: 'gin-london-dry' },
  { ingredientId: 'tequila',         name: 'Tequila Blanco',    category: 'spirit',  quantity: 'three-quarters',spiritType: 'tequila-blanco' },
  { ingredientId: 'mezcal',          name: 'Mezcal',            category: 'spirit',  quantity: 'out',           spiritType: 'mezcal' },
  { ingredientId: 'rum-white',       name: 'White Rum',         category: 'spirit',  quantity: 'out',           spiritType: 'rum-white' },
  { ingredientId: 'rum-dark',        name: 'Dark Rum',          category: 'spirit',  quantity: 'out',           spiritType: 'rum-dark' },
  { ingredientId: 'rum-aged',        name: 'Aged Rum',          category: 'spirit',  quantity: 'out',           spiritType: 'rum-aged' },
  { ingredientId: 'rum-spiced',      name: 'Spiced Rum',        category: 'spirit',  quantity: 'out',           spiritType: 'rum-spiced' },
  { ingredientId: 'vodka',           name: 'Vodka',             category: 'spirit',  quantity: 'full',          spiritType: 'vodka' },
  { ingredientId: 'cognac',          name: 'Cognac',            category: 'spirit',  quantity: 'out',           spiritType: 'cognac-brandy' },
  { ingredientId: 'brandy',          name: 'Brandy',            category: 'spirit',  quantity: 'out',           spiritType: 'cognac-brandy' },
  { ingredientId: 'cachaca',         name: 'Cachaça',           category: 'spirit',  quantity: 'out' },
  { ingredientId: 'pisco',           name: 'Pisco',             category: 'spirit',  quantity: 'out' },

  // ── Liqueurs ──────────────────────────────────────────────────────────────────
  { ingredientId: 'campari',            name: 'Campari',                 category: 'liqueur', quantity: 'full',    spiritType: 'campari-l' },
  { ingredientId: 'triple-sec',         name: 'Triple Sec',              category: 'liqueur', quantity: 'quarter', spiritType: 'triple-sec' },
  { ingredientId: 'aperol',             name: 'Aperol',                  category: 'liqueur', quantity: 'out',     spiritType: 'aperol-l' },
  { ingredientId: 'coffee-liqueur',     name: 'Coffee Liqueur (Kahlúa)', category: 'liqueur', quantity: 'out',     spiritType: 'coffee-liqueur' },
  { ingredientId: 'green-chartreuse',   name: 'Green Chartreuse',        category: 'liqueur', quantity: 'out' },
  { ingredientId: 'maraschino-liqueur', name: 'Maraschino Liqueur',      category: 'liqueur', quantity: 'out' },
  { ingredientId: 'amaro-nonino',       name: 'Amaro Nonino',            category: 'liqueur', quantity: 'out' },
  { ingredientId: 'fernet-branca',      name: 'Fernet-Branca',           category: 'liqueur', quantity: 'out' },
  { ingredientId: 'creme-de-cassis',    name: 'Crème de Cassis',         category: 'liqueur', quantity: 'out' },

  // ── Fortified Wine ────────────────────────────────────────────────────────────
  { ingredientId: 'sweet-vermouth',  name: 'Sweet Vermouth', category: 'liqueur', quantity: 'half', spiritType: 'sweet-vermouth' },
  { ingredientId: 'dry-vermouth',    name: 'Dry Vermouth',   category: 'liqueur', quantity: 'out',  spiritType: 'dry-vermouth' },

  // ── Syrups & Sweeteners ───────────────────────────────────────────────────────
  { ingredientId: 'simple-syrup',       name: 'Simple Syrup',       category: 'syrup', quantity: 'full' },
  { ingredientId: 'agave-syrup',        name: 'Agave Syrup',        category: 'syrup', quantity: 'out' },
  { ingredientId: 'honey-ginger-syrup', name: 'Honey-Ginger Syrup', category: 'syrup', quantity: 'out' },
  { ingredientId: 'grenadine',          name: 'Grenadine',          category: 'syrup', quantity: 'out' },
  { ingredientId: 'orgeat',             name: 'Orgeat Syrup',       category: 'syrup', quantity: 'out' },

  // ── Bitters ───────────────────────────────────────────────────────────────────
  { ingredientId: 'angostura-bitters', name: 'Angostura Bitters', category: 'bitters', quantity: 'splash' },

  // ── Mixers & Juice ────────────────────────────────────────────────────────────
  { ingredientId: 'lime-juice',       name: 'Fresh Lime Juice',       category: 'mixer', quantity: 'full' },
  { ingredientId: 'lemon-juice',      name: 'Fresh Lemon Juice',      category: 'mixer', quantity: 'out' },
  { ingredientId: 'orange-juice',     name: 'Orange Juice',           category: 'mixer', quantity: 'out' },
  { ingredientId: 'grapefruit-juice', name: 'Fresh Grapefruit Juice', category: 'mixer', quantity: 'out' },
  { ingredientId: 'cranberry-juice',  name: 'Cranberry Juice',        category: 'mixer', quantity: 'out' },
  { ingredientId: 'pineapple-juice',  name: 'Pineapple Juice',        category: 'mixer', quantity: 'out' },
  { ingredientId: 'coconut-cream',    name: 'Coconut Cream',          category: 'mixer', quantity: 'out' },
  { ingredientId: 'peach-puree',      name: 'White Peach Purée',      category: 'mixer', quantity: 'out' },
  { ingredientId: 'espresso',         name: 'Fresh Espresso',         category: 'mixer', quantity: 'out' },
  { ingredientId: 'ginger-beer',      name: 'Ginger Beer',            category: 'mixer', quantity: 'out' },
  { ingredientId: 'tonic-water',      name: 'Tonic Water',            category: 'mixer', quantity: 'full' },
  { ingredientId: 'soda-water',       name: 'Soda Water',             category: 'mixer', quantity: 'full' },
  { ingredientId: 'prosecco',         name: 'Prosecco',               category: 'mixer', quantity: 'out' },
  { ingredientId: 'champagne',        name: 'Champagne',              category: 'mixer', quantity: 'out' },
  { ingredientId: 'red-wine',         name: 'Red Wine',               category: 'mixer', quantity: 'out' },

  // ── Garnishes & Other ─────────────────────────────────────────────────────────
  { ingredientId: 'orange-peel',       name: 'Orange Peel',       category: 'garnish', quantity: 'full' },
  { ingredientId: 'maraschino-cherry', name: 'Maraschino Cherry', category: 'garnish', quantity: 'out' },
  { ingredientId: 'mint',              name: 'Fresh Mint',        category: 'garnish', quantity: 'out' },
  { ingredientId: 'egg-white',         name: 'Egg White',         category: 'other',   quantity: 'out' },
];
