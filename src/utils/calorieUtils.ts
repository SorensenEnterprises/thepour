import { RecipeIngredient } from '../types';

// ── Category sets by ingredient ID ───────────────────────────────────────────

const SPIRIT_IDS = new Set([
  // Whiskeys
  'bourbon','rye-whiskey','scotch','islay-scotch','irish-whiskey','japanese-whisky',
  'canadian-whisky','whiskey',
  // Gin & vodka
  'gin','sloe-gin','vodka',
  // Rum
  'rum-white','rum-dark','rum-aged','rum-spiced','rum-overproof','cachaca',
  // Agave
  'tequila','mezcal','pisco',
  // Brandy
  'brandy','cognac','apple-brandy','apricot-brandy','cherry-brandy',
  // Liqueurs (counted as spirits per spec)
  'amaretto','amaro-nonino','aperol','baileys','banana-liqueur','benedictine',
  'blue-curacao','butterscotch-schnapps','campari','chambord','chartreuse',
  'cherry-liqueur','cinnamon-whisky','coffee-liqueur','cointreau',
  'creme-de-cassis','creme-de-cacao','creme-de-cacao-white','creme-de-menthe',
  'creme-de-mure','creme-de-violette','drambuie','dry-vermouth','elderflower-liqueur',
  'falernum','fernet-branca','fireball','galliano','goldschlager','grand-marnier',
  'green-chartreuse','irish-cream','jagermeister','kahlua','licor-43','lillet-blanc',
  'limoncello','lyres-bitter','lyres-vermouth','maraschino-liqueur','mezcal','midori',
  'passoa','peach-schnapps','peppermint-schnapps','pimms','sambuca','sake',
  'scotch','select-aperitivo','sloe-gin','sour-apple-schnapps','southern-comfort',
  'sweet-vermouth','triple-sec','yellow-chartreuse','blackberry-liqueur',
  'high-proof-spirit','absinthe',
]);

const WINE_IDS = new Set([
  'champagne','prosecco','red-wine','white-wine','amontillado-sherry','dry-sherry',
  'sparkling-grape-juice',
]);

const BEER_IDS = new Set([
  'beer','stout-beer','guinness','lager-beer','japanese-beer',
]);

const SYRUP_IDS = new Set([
  'agave-syrup','almond-syrup','amaretto-syrup','blackberry-syrup',
  'blue-raspberry-syrup','brown-sugar-syrup','caramel-syrup','cardamom-syrup',
  'cherry-syrup','chocolate-syrup','cinnamon-syrup','coconut-syrup',
  'cotton-candy-syrup','elderflower-cordial','espresso-syrup','grenadine',
  'hibiscus-syrup','honey','honey-ginger-syrup','honey-syrup','horchata-syrup',
  'lavender-syrup','lemongrass-syrup','lychee-syrup','mango-syrup',
  'marshmallow-syrup','matcha-syrup','mixed-berry-shrub','orgeat',
  'passion-fruit-syrup','passionfruit-syrup','peach-syrup','peppermint-syrup',
  'raspberry-shrub','raspberry-syrup','rosemary-syrup','simple-syrup',
  'strawberry-shrub','strawberry-syrup','sugar','brown-sugar','thyme-syrup',
  'turmeric-syrup','vanilla-syrup','watermelon-syrup',
]);

const JUICE_IDS = new Set([
  'apple-juice','beet-juice','blood-orange-juice','coconut-water','cranberry-juice',
  'cucumber-juice','eggnog','grapefruit-juice','lemon-juice','lime-juice',
  'lychee-juice','mango-juice','mango-puree','orange-juice','passion-fruit-puree',
  'passionfruit-puree','peach-nectar','peach-puree','pear-juice','pineapple-juice',
  'pomegranate-juice','tart-cherry-juice','tomato-juice','watermelon-juice',
  'yuzu-juice','kefir','ginger-juice','lime',
]);

const SODA_IDS = new Set([
  '7up','apple-cider','blue-raspberry-soda','cherry-soda','coca-cola','cola',
  'cold-brew-tea','cream-soda','dr-pepper','elderflower-tonic','energy-drink',
  'ginger-ale','ginger-beer','grapefruit-soda','hibiscus-tea','iced-tea',
  'lemonade','mango-soda','oolong-tea','orange-fanta','soda-water',
  'sparkling-water','sprite','sweet-tea','tonic-water',
]);

const CREAM_IDS = new Set([
  'butter','coconut-cream','cream','cream-of-coconut','heavy-cream',
  'hot-milk','oat-milk','vanilla-ice-cream','yogurt',
]);

const ZERO_IDS = new Set([
  'absinthe-rinse','angostura-bitters','apple-cider-vinegar','butter-extract',
  'celery-salt','chili-lime-salt','chili-powder','cinnamon-stick','cloves',
  'coffee','cold-brew-coffee','espresso','horseradish','hot-coffee','hot-sauce',
  'hot-water','mole-bitters','orange-bitters','peychauds-bitters','pickle-brine',
  'rose-water','salt','star-anise','sugar-cube','worcestershire',
]);

const GARNISH_IDS = new Set([
  'banana','basil','blackberry','blueberry','cucumber','fresh-raspberries',
  'grapefruit-peel','jalapeno','jalapeño','lemon-peel','lime-slice','lime-wedge',
  'maraschino-cherry','mint','mixed-berries','orange-peel','orange-slice',
  'raspberries','rosemary','sage','star-anise','strawberries','strawberry',
  'tamarind-paste','thai-basil',
]);

// ── Unit conversion to oz ─────────────────────────────────────────────────────

function toOz(amount: number, unit: string): number {
  switch (unit.toLowerCase()) {
    case 'oz':      return amount;
    case 'ml':      return amount / 29.574;
    case 'splash':  return amount * 0.5;
    case 'tsp':     return amount * 0.1667;
    case 'tbsp':    return amount * 0.5;
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

// ── Cal/oz lookup ─────────────────────────────────────────────────────────────

function calPerOz(ingredientId: string, name: string): number {
  if (SPIRIT_IDS.has(ingredientId))  return 65;
  if (WINE_IDS.has(ingredientId))    return 25;
  if (BEER_IDS.has(ingredientId))    return 15;
  if (SYRUP_IDS.has(ingredientId))   return 50;
  if (JUICE_IDS.has(ingredientId))   return 15;
  if (SODA_IDS.has(ingredientId))    return 10;
  if (CREAM_IDS.has(ingredientId))   return 50;
  if (ZERO_IDS.has(ingredientId) || GARNISH_IDS.has(ingredientId)) return 0;

  // name-based fallback when ID not in any set
  const n = name.toLowerCase();
  if (/syrup|orgeat|grenadine|honey|agave|shrub/.test(n)) return 50;
  if (/juice|puree|nectar|cider/.test(n)) return 15;
  if (/soda|tonic|cola|ginger.?beer|lemonade|sparkling|energy drink/.test(n)) return 10;
  if (/cream|milk|butter/.test(n)) return 50;
  if (/wine|champagne|prosecco|cava|sherry/.test(n)) return 25;
  if (/beer|stout|ale|lager/.test(n)) return 15;
  if (/whiskey|whisky|rum|gin|vodka|tequila|mezcal|brandy|cognac|liqueur|schnapps|vermouth|campari|aperol|chartreuse|amaro|fernet|pisco|cachaca|bitters.*\d/.test(n)) return 65;
  if (/bitters|peel|garnish|twist|salt|water$/.test(n)) return 0;
  return 20;
}

// ── Public API ────────────────────────────────────────────────────────────────

const FALLBACK_CALORIES = 120;

export function calculateCalories(ingredients: RecipeIngredient[]): number {
  let total = 0;
  for (const ing of ingredients) {
    if (ing.optional) continue;
    // Egg white: ~15 cal per egg regardless of unit
    if (ing.ingredientId === 'egg-white' || ing.name.toLowerCase().includes('egg white')) {
      total += ing.amount * 15;
      continue;
    }
    const oz = toOz(ing.amount, ing.unit);
    total += oz * calPerOz(ing.ingredientId, ing.name);
  }
  const result = Math.round(total);
  return result > 0 ? result : FALLBACK_CALORIES;
}

// ── Fraction parsing for string ingredient lines (BartenderModal) ─────────────

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
    if (/syrup|orgeat|grenadine|honey|agave|shrub/.test(n))      cpo = 50;
    else if (/juice|puree|nectar|cider/.test(n))                   cpo = 15;
    else if (/soda|tonic|cola|ginger.?beer|lemonade|sparkling water/.test(n)) cpo = 10;
    else if (/cream|milk/.test(n))                                 cpo = 50;
    else if (/wine|champagne|prosecco|sherry/.test(n))             cpo = 25;
    else if (/beer|stout|ale|lager/.test(n))                       cpo = 15;
    else if (/whiskey|whisky|rum|gin|vodka|tequila|mezcal|brandy|cognac|liqueur|schnapps|vermouth|campari|aperol|chartreuse|amaro|fernet|pisco|cachaca/.test(n)) cpo = 65;
    else if (/bitters|peel|garnish|twist|salt|water$/.test(n))    cpo = 0;
    total += oz * cpo;
  }
  const result = Math.round(total);
  return result > 0 ? result : FALLBACK_CALORIES;
}
