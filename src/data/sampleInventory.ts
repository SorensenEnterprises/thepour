import { InventoryItem } from '../types';

export const sampleInventory: InventoryItem[] = [
  // Spirits
  { ingredientId: 'bourbon',      name: 'Bourbon',           category: 'spirit',  quantity: 'half' },
  { ingredientId: 'rye-whiskey',  name: 'Rye Whiskey',       category: 'spirit',  quantity: 'out' },
  { ingredientId: 'scotch',       name: 'Blended Scotch',    category: 'spirit',  quantity: 'out' },
  { ingredientId: 'islay-scotch', name: 'Islay Scotch',      category: 'spirit',  quantity: 'out' },
  { ingredientId: 'gin',          name: 'Gin',               category: 'spirit',  quantity: 'full' },
  { ingredientId: 'tequila',      name: 'Tequila Blanco',    category: 'spirit',  quantity: 'three-quarters' },
  { ingredientId: 'rum-white',    name: 'White Rum',         category: 'spirit',  quantity: 'out' },
  { ingredientId: 'rum-dark',     name: 'Dark Rum',          category: 'spirit',  quantity: 'out' },
  { ingredientId: 'rum-aged',     name: 'Aged Rum',          category: 'spirit',  quantity: 'out' },
  { ingredientId: 'vodka',        name: 'Vodka',             category: 'spirit',  quantity: 'full' },
  { ingredientId: 'cognac',       name: 'Cognac',            category: 'spirit',  quantity: 'out' },
  { ingredientId: 'brandy',       name: 'Brandy',            category: 'spirit',  quantity: 'out' },

  // Liqueurs & Fortified
  { ingredientId: 'campari',           name: 'Campari',                  category: 'liqueur', quantity: 'full' },
  { ingredientId: 'triple-sec',        name: 'Triple Sec',               category: 'liqueur', quantity: 'quarter' },
  { ingredientId: 'aperol',            name: 'Aperol',                   category: 'liqueur', quantity: 'out' },
  { ingredientId: 'sweet-vermouth',    name: 'Sweet Vermouth',           category: 'liqueur', quantity: 'half' },
  { ingredientId: 'dry-vermouth',      name: 'Dry Vermouth',             category: 'liqueur', quantity: 'out' },
  { ingredientId: 'coffee-liqueur',    name: 'Coffee Liqueur (Kahlúa)',  category: 'liqueur', quantity: 'out' },
  { ingredientId: 'green-chartreuse',  name: 'Green Chartreuse',         category: 'liqueur', quantity: 'out' },
  { ingredientId: 'maraschino-liqueur',name: 'Maraschino Liqueur',       category: 'liqueur', quantity: 'out' },
  { ingredientId: 'amaro-nonino',      name: 'Amaro Nonino',             category: 'liqueur', quantity: 'out' },
  { ingredientId: 'fernet-branca',     name: 'Fernet-Branca',            category: 'liqueur', quantity: 'out' },
  { ingredientId: 'creme-de-cassis',   name: 'Crème de Cassis',          category: 'liqueur', quantity: 'out' },

  // Syrups & Sweeteners
  { ingredientId: 'simple-syrup',       name: 'Simple Syrup',        category: 'syrup', quantity: 'full' },
  { ingredientId: 'agave-syrup',        name: 'Agave Syrup',         category: 'syrup', quantity: 'out' },
  { ingredientId: 'honey-ginger-syrup', name: 'Honey-Ginger Syrup',  category: 'syrup', quantity: 'out' },
  { ingredientId: 'grenadine',          name: 'Grenadine',           category: 'syrup', quantity: 'out' },
  { ingredientId: 'orgeat',             name: 'Orgeat Syrup',        category: 'syrup', quantity: 'out' },

  // Bitters
  { ingredientId: 'angostura-bitters', name: 'Angostura Bitters', category: 'bitters', quantity: 'splash' },

  // Mixers & Juice
  { ingredientId: 'lime-juice',      name: 'Fresh Lime Juice',        category: 'mixer', quantity: 'full' },
  { ingredientId: 'lemon-juice',     name: 'Fresh Lemon Juice',       category: 'mixer', quantity: 'out' },
  { ingredientId: 'orange-juice',    name: 'Orange Juice',            category: 'mixer', quantity: 'out' },
  { ingredientId: 'grapefruit-juice',name: 'Fresh Grapefruit Juice',  category: 'mixer', quantity: 'out' },
  { ingredientId: 'cranberry-juice', name: 'Cranberry Juice',         category: 'mixer', quantity: 'out' },
  { ingredientId: 'pineapple-juice', name: 'Pineapple Juice',         category: 'mixer', quantity: 'out' },
  { ingredientId: 'coconut-cream',   name: 'Coconut Cream',           category: 'mixer', quantity: 'out' },
  { ingredientId: 'peach-puree',     name: 'White Peach Purée',       category: 'mixer', quantity: 'out' },
  { ingredientId: 'espresso',        name: 'Fresh Espresso',          category: 'mixer', quantity: 'out' },
  { ingredientId: 'ginger-beer',     name: 'Ginger Beer',             category: 'mixer', quantity: 'out' },
  { ingredientId: 'tonic-water',     name: 'Tonic Water',             category: 'mixer', quantity: 'full' },
  { ingredientId: 'soda-water',      name: 'Soda Water',              category: 'mixer', quantity: 'full' },
  { ingredientId: 'prosecco',        name: 'Prosecco',                category: 'mixer', quantity: 'out' },
  { ingredientId: 'champagne',       name: 'Champagne',               category: 'mixer', quantity: 'out' },
  { ingredientId: 'red-wine',        name: 'Red Wine',                category: 'mixer', quantity: 'out' },

  // Garnishes & Other
  { ingredientId: 'orange-peel',      name: 'Orange Peel',       category: 'garnish', quantity: 'full' },
  { ingredientId: 'maraschino-cherry',name: 'Maraschino Cherry', category: 'garnish', quantity: 'out' },
  { ingredientId: 'mint',             name: 'Fresh Mint',        category: 'garnish', quantity: 'out' },
  { ingredientId: 'egg-white',        name: 'Egg White',         category: 'other',   quantity: 'out' },
];
