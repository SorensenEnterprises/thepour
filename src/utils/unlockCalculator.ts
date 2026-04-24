import { Recipe, InventoryItem } from '../types';
import { buildInventoryMatcher, isGarnish, getRecipeCanonicalType } from './ingredientMatcher';

export interface UnlockSuggestion {
  ingredientCanonicalType: string;
  ingredientDisplayName: string;
  ingredientCategory: 'spirit' | 'liqueur' | 'mixer' | 'fresh' | 'pantry';
  unlockCount: number;
  recipes: Array<{ id: string; name: string }>;
  howToGet?: string;
  vesperQuip: string;
}

// ── Display names ──────────────────────────────────────────────────────────────

const DISPLAY_NAMES: Record<string, string> = {
  SWEET_VERMOUTH:       'Sweet Vermouth',
  DRY_VERMOUTH:         'Dry Vermouth',
  CAMPARI:              'Campari',
  APEROL:               'Aperol',
  GINGER_BEER:          'Ginger Beer',
  COCONUT_CREAM:        'Coconut Cream',
  ORGEAT:               'Orgeat Syrup',
  GRENADINE:            'Grenadine',
  SIMPLE_SYRUP:         'Simple Syrup',
  LIME_JUICE:           'Fresh Limes or Lime Juice',
  LEMON_JUICE:          'Fresh Lemons or Lemon Juice',
  ORANGE_JUICE:         'Orange Juice',
  PINEAPPLE_JUICE:      'Pineapple Juice',
  CRANBERRY_JUICE:      'Cranberry Juice',
  EGG_WHITE:            'Egg Whites',
  EGG:                  'Eggs',
  HEAVY_CREAM:          'Heavy Cream',
  ABSINTHE:             'Absinthe',
  PEACH_SCHNAPPS:       'Peach Schnapps or Peach Liqueur',
  RASPBERRY_LIQUEUR:    'Raspberry Liqueur',
  MARASCHINO_LIQUEUR:   'Maraschino Liqueur',
  GREEN_CHARTREUSE:     'Green Chartreuse',
  COFFEE_LIQUEUR:       'Coffee Liqueur (Kahlúa or Mr. Black)',
  TRIPLE_SEC:           'Triple Sec or Cointreau',
  ELDERFLOWER_LIQUEUR:  'St-Germain or Elderflower Liqueur',
  ELDERFLOWER_CORDIAL:  'Elderflower Cordial',
  AMARETTO:             'Amaretto',
  CHAMPAGNE:            'Champagne or Prosecco',
  PROSECCO:             'Prosecco or Champagne',
  HONEY_SYRUP:          'Honey Syrup',
  HONEY:                'Honey',
  AGAVE_SYRUP:          'Agave Syrup',
  GINGER_ALE:           'Ginger Ale',
  TONIC_WATER:          'Tonic Water',
  SODA_WATER:           'Soda Water or Club Soda',
  COLA:                 'Cola (Coke or Pepsi)',
  PASSION_FRUIT_PUREE:  'Passion Fruit Purée',
  PEACH_PUREE:          'Peach Purée or Nectar',
  MANGO_JUICE:          'Mango Juice',
  LILLET_BLANC:         'Lillet Blanc',
  BLUE_CURACAO:         'Blue Curaçao',
  FALERNUM:             'Falernum',
  IRISH_CREAM:          'Irish Cream (Baileys or similar)',
  ESPRESSO:             'Espresso or Strong Coffee',
  COLD_BREW:            'Cold Brew Coffee',
  MIDORI:               'Midori (Melon Liqueur)',
  BANANA_LIQUEUR:       'Banana Liqueur',
  RYE_WHISKEY:          'Rye Whiskey',
  BOURBON:              'Bourbon',
  SCOTCH:               'Scotch Whisky',
  ISLAY_SCOTCH:         'Islay Scotch (Laphroaig or Ardbeg)',
  IRISH_WHISKEY:        'Irish Whiskey',
  COGNAC:               'Cognac or Brandy',
  BRANDY:               'Brandy',
  MEZCAL:               'Mezcal',
  TEQUILA:              'Tequila',
  GIN:                  'Gin',
  VODKA:                'Vodka',
  RUM_WHITE:            'White Rum',
  RUM_DARK:             'Dark Rum',
  RUM_AGED:             'Aged Rum',
  CREME_DE_CASSIS:      'Crème de Cassis',
  CREME_DE_CACAO:       'Crème de Cacao',
  CREME_DE_VIOLETTE:    'Crème de Violette',
  CREME_DE_MENTHE:      'Crème de Menthe',
  PEPPERMINT_SCHNAPPS:  'Peppermint Schnapps',
  CHERRY_LIQUEUR:       'Cherry Liqueur',
  BLACKBERRY_LIQUEUR:   'Blackberry Liqueur',
  DRAMBUIE:             'Drambuie',
  BENEDICTINE:          'Bénédictine',
  FERNET_BRANCA:        'Fernet-Branca',
  JAGERMEISTER:         'Jägermeister',
  AMARO_NONINO:         'Amaro Nonino',
  AMARO_AVERNA:         'Amaro Averna',
  SAMBUCA:              'Sambuca',
  GALLIANO:             'Galliano',
  ANGOSTURA_BITTERS:    'Angostura Bitters',
  PEYCHAUDS_BITTERS:    "Peychaud's Bitters",
  ORANGE_BITTERS:       'Orange Bitters',
  APPLE_BRANDY:         'Apple Brandy or Calvados',
  PISCO:                'Pisco',
  CACHACA:              'Cachaça',
  SAKE:                 'Sake',
  SOUTHERN_COMFORT:     'Southern Comfort',
  PIMMS:                "Pimm's No. 1",
  RED_WINE:             'Red Wine',
  DRY_SHERRY:           'Dry Sherry',
  TOMATO_JUICE:         'Tomato Juice',
  GRAPEFRUIT_JUICE:     'Grapefruit Juice',
  WHISKEY:              'Whiskey',
  CHARTREUSE:           'Chartreuse',
  YELLOW_CHARTREUSE:    'Yellow Chartreuse',
  LYCHEE_JUICE:         'Lychee Juice',
  COCONUT_WATER:        'Coconut Water',
  BITTERS:              'Cocktail Bitters',
  APPLE_JUICE:          'Apple Juice',
  APPLE_CIDER:          'Apple Cider',
  WATERMELON_JUICE:     'Watermelon Juice',
  POMEGRANATE_JUICE:    'Pomegranate Juice',
};

function toTitleCase(s: string): string {
  return s.replace(/\w\S*/g, w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
}

function getDisplayName(canonicalType: string): string {
  return DISPLAY_NAMES[canonicalType] ?? toTitleCase(canonicalType.replace(/_/g, ' '));
}

// ── Category assignment ────────────────────────────────────────────────────────

const SPIRIT_CANONICAL = new Set([
  'BOURBON', 'RYE_WHISKEY', 'SCOTCH', 'ISLAY_SCOTCH', 'IRISH_WHISKEY', 'CANADIAN_WHISKY',
  'JAPANESE_WHISKY', 'WHISKEY', 'GIN', 'SLOE_GIN', 'VODKA', 'TEQUILA', 'MEZCAL',
  'RUM', 'RUM_WHITE', 'RUM_DARK', 'RUM_AGED', 'RUM_OVERPROOF', 'SPICED_RUM',
  'COGNAC', 'BRANDY', 'APPLE_BRANDY', 'APRICOT_BRANDY', 'CHERRY_BRANDY',
  'PISCO', 'CACHACA', 'ABSINTHE', 'SAKE', 'SOUTHERN_COMFORT', 'HIGH_PROOF_SPIRIT',
]);

const MIXER_CANONICAL = new Set([
  'GINGER_BEER', 'GINGER_ALE', 'TONIC_WATER', 'ELDERFLOWER_TONIC', 'SODA_WATER',
  'SPARKLING_WATER', 'COLA', 'SPRITE', 'DR_PEPPER', 'CREAM_SODA', 'LEMONADE',
  'COCONUT_CREAM', 'GRENADINE', 'ORGEAT', 'PINEAPPLE_JUICE', 'CRANBERRY_JUICE',
  'ORANGE_JUICE', 'BLOOD_ORANGE_JUICE', 'TOMATO_JUICE', 'APPLE_JUICE', 'APPLE_CIDER',
  'MANGO_JUICE', 'PEACH_PUREE', 'PASSION_FRUIT_PUREE', 'GRAPEFRUIT_JUICE',
  'WATERMELON_JUICE', 'POMEGRANATE_JUICE', 'COCONUT_WATER', 'LYCHEE_JUICE',
  'ENERGY_DRINK', 'RED_BULL', 'BEER', 'STOUT', 'RED_WINE', 'DRY_SHERRY',
  'AMONTILLADO_SHERRY', 'CHAMPAGNE', 'PROSECCO', 'SPARKLING_WINE',
  'BITTERS', 'ANGOSTURA_BITTERS', 'PEYCHAUDS_BITTERS', 'ORANGE_BITTERS', 'MOLE_BITTERS',
]);

const FRESH_CANONICAL = new Set(['LIME_JUICE', 'LEMON_JUICE']);

const PANTRY_CANONICAL = new Set([
  'SIMPLE_SYRUP', 'DEMERARA_SYRUP', 'EGG_WHITE', 'EGG', 'HEAVY_CREAM', 'HOT_MILK',
  'OAT_MILK', 'HONEY_SYRUP', 'HONEY', 'AGAVE_SYRUP', 'SUGAR', 'SALT', 'CELERY_SALT',
  'ESPRESSO', 'COFFEE', 'COLD_BREW', 'HOT_SAUCE', 'WORCESTERSHIRE', 'HORSERADISH',
  'PICKLE_BRINE', 'MINT', 'BASIL', 'CUCUMBER',
]);

function getCategory(canonicalType: string): UnlockSuggestion['ingredientCategory'] {
  if (SPIRIT_CANONICAL.has(canonicalType)) return 'spirit';
  if (MIXER_CANONICAL.has(canonicalType)) return 'mixer';
  if (FRESH_CANONICAL.has(canonicalType)) return 'fresh';
  if (PANTRY_CANONICAL.has(canonicalType)) return 'pantry';
  return 'liqueur';
}

// ── howToGet hints ─────────────────────────────────────────────────────────────

const HOW_TO_GET: Record<string, string> = {
  SIMPLE_SYRUP:    'Equal parts sugar and hot water, stir until dissolved. 2 minutes.',
  DEMERARA_SYRUP:  'Equal parts demerara sugar and hot water, stir until dissolved.',
  EGG_WHITE:       'Separate one egg — just the white. Shake hard.',
  EGG:             'Any egg from your fridge works.',
  LIME_JUICE:      '2–3 fresh limes, juiced. Or check your pantry.',
  LEMON_JUICE:     '1–2 fresh lemons, juiced.',
  HEAVY_CREAM:     'Any heavy or whipping cream works.',
  HONEY_SYRUP:     'Make it yourself — 5 min. 2 parts honey, 1 part hot water.',
  HONEY:           'Any plain honey from your cupboard works.',
  AGAVE_SYRUP:     'Make it yourself — 5 min. 2 parts agave nectar, 1 part warm water.',
  GRENADINE:       'Make it yourself — 15 min. Fresh pomegranate juice + sugar. Not the red dye stuff.',
  ORGEAT:          'Make it yourself — 45 min. Or buy BG Reynolds / Small Hand Foods.',
  FALERNUM:        'Make it yourself — 24 hr infusion. Or buy John D. Taylor\'s Velvet Falernum.',
};

// ── Vesper quips ───────────────────────────────────────────────────────────────

const HIGH_QUIPS = [
  (name: string, count: number) =>
    `You're one bottle away from a serious upgrade. ${name}. I'm not asking, I'm telling.`,
  (name: string, count: number) =>
    `${name}. Get it. Unlock ${count} recipes. You'll thank me.`,
  (name: string, count: number) =>
    `The single most impactful thing you can add to your bar right now is ${name}. ${count} recipes waiting.`,
];

const MEDIUM_QUIPS = [
  (name: string, count: number) =>
    `Add ${name} and suddenly ${count} more recipes make sense tonight.`,
  (name: string, count: number) =>
    `${name} is doing a lot of work in ${count} recipes you're currently missing.`,
  (name: string, count: number) =>
    `Grab ${name}. ${count} cocktails open up immediately.`,
];

const LOW_QUIPS = [
  (name: string, count: number) =>
    `${name} is the missing piece in ${count} recipes worth making.`,
  (name: string, count: number) =>
    `You're almost there on ${count} drinks. ${name} is all you need.`,
];

function getVesperQuip(
  displayName: string,
  count: number,
  category: UnlockSuggestion['ingredientCategory'],
  canonicalType: string,
  howToGet?: string,
): string {
  // Deterministic quip selection: vary by canonical type name to avoid monotony
  const idx = canonicalType.charCodeAt(0) % 3;

  if (category === 'pantry' || category === 'fresh') {
    if (howToGet && howToGet.startsWith('Make it yourself')) {
      return `${displayName} would unlock ${count} recipes. ${howToGet}.`;
    }
    if (howToGet) {
      return `${displayName}. If you don't have it, ${howToGet} Problem solved, ${count} recipes unlocked.`;
    }
    return `Check your pantry — if you have ${displayName}, you just unlocked ${count} recipes.`;
  }
  if (count >= 10) return HIGH_QUIPS[idx % HIGH_QUIPS.length](displayName, count);
  if (count >= 5)  return MEDIUM_QUIPS[idx % MEDIUM_QUIPS.length](displayName, count);
  return LOW_QUIPS[idx % LOW_QUIPS.length](displayName, count);
}

// ── Main export ────────────────────────────────────────────────────────────────

export function calculateUnlocks(
  recipes: Recipe[],
  inventory: InventoryItem[],
  checkedPantryIds: Set<string>,
  topN = 8,
): UnlockSuggestion[] {
  const matcher = buildInventoryMatcher(inventory, checkedPantryIds);

  // For each recipe, find the required ingredients that are not satisfied
  const unlockMap = new Map<string, { recipes: Array<{ id: string; name: string }> }>();

  for (const recipe of recipes) {
    const required = recipe.ingredients.filter(i => !i.optional && !isGarnish(i.ingredientId));
    const missing  = required.filter(i => !matcher.isSatisfied(i.ingredientId, i.name));

    if (missing.length !== 1) continue;

    const mi = missing[0];
    // Resolve to canonical type for grouping
    const canonicalType = getRecipeCanonicalType(mi.ingredientId) ?? mi.ingredientId;

    if (!unlockMap.has(canonicalType)) {
      unlockMap.set(canonicalType, { recipes: [] });
    }
    unlockMap.get(canonicalType)!.recipes.push({ id: recipe.id, name: recipe.name });
  }

  const suggestions: UnlockSuggestion[] = [];
  unlockMap.forEach(({ recipes: recipeList }, canonicalType) => {
    const displayName = getDisplayName(canonicalType);
    const category    = getCategory(canonicalType);
    const howToGet    = HOW_TO_GET[canonicalType];
    const count       = recipeList.length;

    suggestions.push({
      ingredientCanonicalType: canonicalType,
      ingredientDisplayName:   displayName,
      ingredientCategory:      category,
      unlockCount:             count,
      recipes:                 recipeList.sort((a, b) => a.name.localeCompare(b.name)),
      howToGet,
      vesperQuip: getVesperQuip(displayName, count, category, canonicalType, howToGet),
    });
  });

  suggestions.sort((a, b) => b.unlockCount - a.unlockCount);
  return suggestions.slice(0, topN);
}
