import { RecipeIngredient } from '../types';

// ── Category sets by ingredient ID ───────────────────────────────────────────

const SPIRIT_IDS = new Set([
  'absinthe','amaretto','amaro-nonino','aperol','apple-brandy','apricot-brandy',
  'baileys','banana-liqueur','benedictine','blue-curacao','bourbon','brandy',
  'butterscotch-schnapps','cachaca','campari','canadian-whisky','chambord',
  'chartreuse','cherry-brandy','cherry-liqueur','cinnamon-whisky','coffee-liqueur',
  'cointreau','cognac','creme-de-cassis','dry-vermouth','elderflower-liqueur',
  'fernet-branca','gin','grand-marnier','green-chartreuse','irish-cream',
  'irish-whiskey','islay-scotch','japanese-whisky','kahlua','limoncello',
  'lyres-bitter','lyres-vermouth','maraschino-liqueur','mezcal','midori',
  'passoa','peach-schnapps','peppermint-schnapps','pimms','pisco',
  'rum-aged','rum-dark','rum-overproof','rum-spiced','rum-white','rye-whiskey',
  'sake','scotch','select-aperitivo','sloe-gin','sour-apple-schnapps',
  'southern-comfort','sweet-vermouth','tequila','triple-sec','vodka',
  'whiskey','yellow-chartreuse','sambuca','seedlip','seedlip-garden',
]);

const WINE_IDS = new Set([
  'champagne','prosecco','red-wine','white-wine','amontillado-sherry',
  'sparkling-grape-juice',
]);

const BEER_IDS = new Set(['beer','stout-beer']);

const SYRUP_IDS = new Set([
  'agave-syrup','almond-syrup','amaretto-syrup','blackberry-syrup',
  'brown-sugar-syrup','caramel-syrup','cardamom-syrup','cherry-syrup',
  'chocolate-syrup','cinnamon-syrup','coconut-syrup','grenadine',
  'honey-ginger-syrup','lavender-syrup','lychee-syrup','mango-syrup',
  'marshmallow-syrup','matcha-syrup','orgeat','passion-fruit-syrup',
  'passionfruit-syrup','peach-syrup','peppermint-syrup','raspberry-syrup',
  'rosemary-syrup','simple-syrup','strawberry-syrup','thyme-syrup',
  'turmeric-syrup','vanilla-syrup','watermelon-syrup','brown-sugar',
  'sugar','honey',
]);

const JUICE_IDS = new Set([
  'apple-juice','beet-juice','blood-orange-juice','cranberry-juice',
  'grapefruit-juice','lemon-juice','lime-juice','lychee-juice',
  'mango-juice','mango-puree','orange-juice','passion-fruit-puree',
  'passionfruit-puree','peach-nectar','peach-puree','pear-juice',
  'pineapple-juice','pomegranate-juice','tart-cherry-juice','tomato-juice',
  'watermelon-juice','yuzu-juice','kefir',
]);

const SODA_IDS = new Set([
  '7up','apple-cider','blue-raspberry-soda','cherry-soda','coca-cola',
  'cola','ginger-beer','lemonade','mango-soda','orange-fanta',
  'soda-water','sparkling-water','sprite','sweet-tea','tonic-water',
  'oolong-tea','pickle-brine',
]);

const CREAM_IDS = new Set([
  'coconut-cream','cream','heavy-cream','oat-milk','yogurt',
  'vanilla-ice-cream','butter',
]);

const ZERO_IDS = new Set([
  'angostura-bitters','orange-bitters','peychauds-bitters','mole-bitters',
  'salt','celery-salt','chili-lime-salt','chili-powder','rose-water',
  'worcestershire','sugar-cube','cinnamon-stick','star-anise',
  'absinthe-rinse',
]);

const GARNISH_IDS = new Set([
  'basil','blackberry','blueberry','cucumber','grapefruit-peel',
  'jalapeño','lemon-peel','lime-wedge','lime-slice','maraschino-cherry',
  'mint','orange-peel','orange-slice','raspberries','rosemary','sage',
  'strawberries','strawberry','thai-basil','banana','mixed-berries',
  'tamarind-paste',
]);

// ── Unit conversion to oz ─────────────────────────────────────────────────────

function toOz(amount: number, unit: string): number {
  switch (unit.toLowerCase()) {
    case 'oz':      return amount;
    case 'ml':      return amount / 29.574;
    case 'splash':  return amount * 0.5;
    case 'tsp':     return amount * 0.1667;
    case 'tbsp':    return amount * 0.5;
    // negligible / garnish units
    case 'dash':
    case 'dashes':
    case 'drop':
    case 'drops':
    case 'pinch':
    case 'piece':
    case 'pieces':
    case 'leaves':
    case 'slice':
    case 'slices':
    case 'wedge':
    case 'scoop':
    case 'rinse':
    default:        return 0;
  }
}

// ── Cal/oz lookup ──────────────────────────────────────────────────────────────

function calPerOz(ingredientId: string, name: string): number {
  if (SPIRIT_IDS.has(ingredientId))  return 65;
  if (WINE_IDS.has(ingredientId))    return 25;
  if (BEER_IDS.has(ingredientId))    return 15;
  if (SYRUP_IDS.has(ingredientId))   return 50;
  if (JUICE_IDS.has(ingredientId))   return 15;
  if (SODA_IDS.has(ingredientId))    return 10;
  if (CREAM_IDS.has(ingredientId))   return 50;
  if (ZERO_IDS.has(ingredientId) || GARNISH_IDS.has(ingredientId)) return 0;

  // name-based fallback
  const n = name.toLowerCase();
  if (/syrup|orgeat|grenadine|honey|agave/.test(n)) return 50;
  if (/juice|puree|nectar/.test(n)) return 15;
  if (/soda|tonic|cola|ginger beer|lemonade|sparkling/.test(n)) return 10;
  if (/cream|milk|butter/.test(n)) return 50;
  if (/wine|champagne|prosecco|cava|sherry/.test(n)) return 25;
  if (/beer|stout|ale/.test(n)) return 15;
  if (/whiskey|whisky|rum|gin|vodka|tequila|mezcal|brandy|cognac|liqueur|schnapps|vermouth|campari|aperol|chartreuse|amaro|fernet|pisco|cachaca/.test(n)) return 65;
  return 20;
}

// ── Public API ────────────────────────────────────────────────────────────────

export function calculateCalories(ingredients: RecipeIngredient[]): number {
  let total = 0;
  for (const ing of ingredients) {
    if (ing.optional) continue;
    if (ing.ingredientId === 'egg-white' || ing.name.toLowerCase().includes('egg white')) {
      total += ing.amount * 15;
      continue;
    }
    const oz = toOz(ing.amount, ing.unit);
    total += oz * calPerOz(ing.ingredientId, ing.name);
  }
  return Math.round(total);
}

// ── Fraction parsing for string ingredient lines ───────────────────────────────

const FRACTION_MAP: Record<string, number> = {
  '¼': 0.25, '½': 0.5, '¾': 0.75,
  '⅓': 0.333, '⅔': 0.667,
  '⅛': 0.125, '⅜': 0.375, '⅝': 0.625, '⅞': 0.875,
};

function parseFraction(s: string): number {
  for (const [frac, val] of Object.entries(FRACTION_MAP)) {
    if (s.endsWith(frac)) {
      const whole = s.slice(0, -frac.length);
      return (whole ? parseFloat(whole) : 0) + val;
    }
  }
  return parseFloat(s) || 0;
}

// Parses strings like "2 oz Bourbon", "¾ oz Simple Syrup", "Egg white (optional)"
export function calculateCaloriesFromStrings(ingredients: string[]): number {
  let total = 0;
  const unitPat = 'oz|ml|dashes?|tsp|tbsp|splash|pieces?|leaves?|pinch|drops?|slice|slices|wedge|scoop|rinse';
  const fracChars = '[¼½¾⅓⅔⅛⅜⅝⅞]';
  const amtPat = `(\\d+(?:\\.\\d+)?${fracChars}?|${fracChars})`;
  const re = new RegExp(`^${amtPat}\\s+(${unitPat})\\s+(.+)$`, 'i');

  for (const line of ingredients) {
    if (/egg white/i.test(line)) {
      total += 15;
      continue;
    }
    const m = line.match(re);
    if (!m) continue;
    const [, amtStr, unit, name] = m;
    const amount = parseFraction(amtStr);
    const oz = toOz(amount, unit);
    if (oz === 0) continue;
    const n = name.toLowerCase();
    let cpo = 20;
    if (/syrup|orgeat|grenadine|honey|agave/.test(n)) cpo = 50;
    else if (/juice|puree|nectar/.test(n)) cpo = 15;
    else if (/soda|tonic|cola|ginger beer|lemonade|sparkling water/.test(n)) cpo = 10;
    else if (/cream|milk/.test(n)) cpo = 50;
    else if (/wine|champagne|prosecco|sherry/.test(n)) cpo = 25;
    else if (/beer|stout|ale/.test(n)) cpo = 15;
    else if (/whiskey|whisky|rum|gin|vodka|tequila|mezcal|brandy|cognac|liqueur|schnapps|vermouth|campari|aperol|chartreuse|amaro|fernet|pisco|cachaca/.test(n)) cpo = 65;
    else if (/bitters|peel|garnish|twist|salt/.test(n)) cpo = 0;
    total += oz * cpo;
  }
  return Math.round(total);
}
