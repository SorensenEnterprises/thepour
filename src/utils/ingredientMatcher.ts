import Fuse from 'fuse.js';
import { InventoryItem, SPIRIT_TYPE_CANONICAL } from '../types';
import { getCanonicalIds } from './brandMap';
import { PANTRY_CATEGORIES } from '../data/pantryItems';

const FILLER_RE = /\b(fresh|squeezed|homemade|house|pure|quality)\b/gi;

function normalize(str: string): string {
  return str.toLowerCase().replace(FILLER_RE, '').replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ').trim();
}

// ── Tier 0: Brand / product name → ingredient ID mapping ─────────────────────
// Keys are lowercase substrings to look for in the bottle name.
// Values are the ingredient names/IDs that bottle satisfies.

const BRAND_MAP: Record<string, string[]> = {
  // Orange liqueurs
  'cointreau':            ['cointreau', 'triple sec', 'orange liqueur', 'orange curacao'],
  'grand marnier':        ['grand marnier', 'triple sec', 'orange liqueur', 'cointreau'],
  'blue curacao':         ['blue curacao', 'curacao', 'orange liqueur', 'triple sec'],
  'orange curacao':       ['curacao', 'orange liqueur', 'triple sec'],

  // Coffee liqueurs
  'mr. black':            ['coffee liqueur', 'kahlua', 'mr black'],
  'mr black':             ['coffee liqueur', 'kahlua'],
  'kahlua':               ['kahlua', 'coffee liqueur'],
  'era negra':            ['coffee liqueur', 'kahlua'],
  'patron xo':            ['coffee liqueur', 'kahlua', 'tequila liqueur'],

  // Berry / fruit liqueurs
  'chambord':             ['chambord', 'raspberry liqueur', 'black raspberry liqueur'],
  'heering':              ['cherry liqueur', 'cherry brandy'],
  'cherry liqueur':       ['cherry liqueur', 'cherry brandy'],
  'disaronno':            ['amaretto', 'disaronno', 'almond liqueur'],
  'amaretto':             ['amaretto', 'almond liqueur'],
  'pomegranate liqueur':  ['pomegranate liqueur', 'grenadine', 'pomegranate'],
  'peach schnapps':       ['peach schnapps', 'peach liqueur', 'peach'],
  'peppermint schnapps':  ['peppermint schnapps', 'creme de menthe', 'mint liqueur'],
  'creme de menthe':      ['creme de menthe', 'mint liqueur', 'peppermint schnapps'],
  'goldschlager':         ['cinnamon schnapps', 'goldschlager'],
  'buttershots':          ['butterscotch schnapps', 'buttershots'],
  'malibu':               ['malibu', 'coconut rum', 'coconut liqueur', 'rum'],
  'st-germain':           ['st germain', 'elderflower liqueur', 'elderflower'],
  'st germain':           ['st germain', 'elderflower liqueur', 'elderflower'],
  'elderflower':          ['elderflower liqueur', 'elderflower', 'st germain'],

  // Aperitifs
  'aperol':               ['aperol', 'aperitivo'],
  'campari':              ['campari', 'aperitivo'],

  // Whiskey brands
  'jim beam':             ['bourbon', 'whiskey', 'american whiskey'],
  'jack daniel':          ['tennessee whiskey', 'whiskey', 'bourbon'],
  'crown royal':          ['canadian whisky', 'whisky', 'whiskey'],
  'chivas regal':         ['scotch', 'scotch whisky', 'blended scotch'],
  'old bardstown':        ['bourbon', 'kentucky bourbon', 'whiskey'],
  '1837 bourbon':         ['bourbon', 'whiskey', 'american whiskey'],
  'dragged bourbon':      ['bourbon', 'whiskey'],
  'blackberry flavored whiskey': ['whiskey', 'flavored whiskey'],
  'paddy':                ['irish whiskey', 'whiskey'],
  'michter':              ['bourbon', 'whiskey', 'american whiskey'],

  // Gin brands
  'bombay':               ['gin', 'london dry gin', 'dry gin'],
  'hendrick':             ['gin', 'scottish gin'],
  'tanqueray':            ['gin', 'london dry gin'],
  'empress':              ['gin', 'purple gin'],
  'islay dry gin':        ['gin', 'dry gin', 'london dry gin'],
  'indigo gin':           ['gin'],
  'elderflower rose gin': ['gin', 'flavored gin'],
  'cucumber lemon gin':   ['gin', 'flavored gin'],
  'london dry gin':       ['gin', 'london dry gin', 'dry gin'],

  // Tequila brands
  'hornitos':             ['tequila', 'blanco tequila'],
  'especial blue agave':  ['tequila', 'blanco tequila', 'agave spirit'],
  'patron':               ['tequila', 'silver tequila'],

  // Vodka brands
  'ketel one':            ['vodka'],
  'handmade vodka':       ['vodka'],
  'grapefruit flavored vodka': ['vodka', 'flavored vodka'],
  'vanilla flavored vodka':    ['vodka', 'vanilla vodka', 'flavored vodka'],
  'absolut':              ['vodka'],

  // Rum
  'black spiced rum':     ['spiced rum', 'rum', 'dark rum'],
  'original dark rum':    ['dark rum', 'rum'],
  'rum with coffee':      ['rum', 'coffee rum', 'dark rum'],

  // Brandy / Cognac
  'christian brothers':   ['brandy', 'american brandy'],
  'cognac':               ['cognac', 'brandy'],
  'jezynowka':            ['blackberry brandy', 'flavored brandy', 'brandy'],

  // Vermouth
  'sweet vermouth':       ['sweet vermouth', 'vermouth rosso', 'red vermouth'],
  'dry vermouth':         ['dry vermouth', 'french vermouth'],
  'madeira':              ['madeira', 'fortified wine', 'wine'],

  // Mixers, juices, and non-alcoholic
  '100% lime juice':      ['lime juice', 'fresh lime juice', 'lime'],
  'lime juice':           ['lime juice', 'fresh lime juice', 'lime'],
  'grenadine':            ['grenadine', 'pomegranate syrup'],
  'aromatic bitters':     ['bitters', 'angostura bitters', 'aromatic bitters'],
  'orange bitters':       ['orange bitters', 'bitters'],
  'peychaud':             ['peychauds bitters', 'bitters'],
  'elderflower tonic water':           ['tonic water', 'tonic'],
  'elderflower tonic':                 ['tonic water', 'tonic', 'elderflower tonic'],
  'premium indian tonic':              ['tonic water', 'tonic', 'indian tonic'],
  'refreshingly light cucumber tonic': ['tonic water', 'tonic', 'cucumber tonic'],
  'tonic water':          ['tonic water', 'tonic'],
  'original seltzer water': ['soda water', 'club soda', 'sparkling water', 'seltzer'],

  // Other spirits
  'jagermeister':         ['jagermeister', 'herbal liqueur'],
  'jager':                ['jagermeister', 'herbal liqueur'],
  'ouzo':                 ['ouzo', 'anise liqueur', 'pastis'],
  'sake':                 ['sake', 'rice wine'],
  'fine ruby porto':      ['port', 'ruby port', 'fortified wine'],
  'parcha maracuya':      ['passion fruit liqueur', 'tropical liqueur'],
  'winter jack':          ['apple whiskey', 'flavored whiskey', 'cider whiskey'],
};

// ── Garnish IDs that never count as "missing" ─────────────────────────────────

const GARNISH_IDS = new Set([
  'lime-wedge', 'lime-wheel', 'lime-peel', 'lime-slice',
  'lemon-wedge', 'lemon-wheel', 'lemon-twist', 'lemon-peel', 'lemon-slice',
  'orange-peel', 'orange-wheel', 'orange-twist', 'orange-slice',
  'grapefruit-peel', 'grapefruit-wheel',
  'cherry', 'maraschino-cherry', 'cocktail-cherry',
  'olive', 'cocktail-olive', 'blue-cheese-olive',
  'mint-sprig', 'mint-leaves', 'mint',
  'celery-stalk', 'celery',
  'cucumber-slice', 'cucumber-ribbon', 'cucumber',
  'salt-rim', 'sugar-rim', 'chili-lime-rim',
  'ice', 'large-ice-cube', 'crushed-ice',
  'cocktail-onion', 'pickled-onion',
  'candied-ginger', 'ginger-slice',
  'coffee-beans', 'nutmeg',
]);

export function isGarnish(ingredientId: string): boolean {
  return GARNISH_IDS.has(ingredientId);
}

export interface InventoryMatcher {
  isSatisfied(ingredientId: string, ingredientName?: string): boolean;
}

export function buildInventoryMatcher(
  items: InventoryItem[],
  checkedPantryIds: Set<string> = new Set(),
): InventoryMatcher {
  const inStock = items.filter(i => i.quantity !== 'out');

  // Tier 1: canonical ID set — getCanonicalIds covers well-known spirit brands via regex
  const canonicalIds = new Set<string>();
  inStock.forEach(item => {
    canonicalIds.add(item.ingredientId);
    getCanonicalIds(item.name).forEach(id => canonicalIds.add(id));
    if (item.spiritType) {
      (SPIRIT_TYPE_CANONICAL[item.spiritType] ?? []).forEach(id => canonicalIds.add(id));
    }
  });

  // Tier 2: Fuse.js index on normalized inventory names — catches unrecognized bottles
  const fuseData = inStock.map(item => ({ name: normalize(item.name) }));
  const fuse = new Fuse(fuseData, { keys: ['name'], threshold: 0.35, includeScore: true });

  // Tier 3: pantry satisfies set
  const pantryNormalized = new Set<string>();
  if (checkedPantryIds.size > 0) {
    PANTRY_CATEGORIES.forEach(cat => {
      cat.items.forEach(item => {
        if (checkedPantryIds.has(item.id)) {
          item.satisfies.forEach(s => pantryNormalized.add(normalize(s)));
        }
      });
    });
  }

  return {
    isSatisfied(ingredientId: string, ingredientName?: string): boolean {
      const normalizedIngredient = normalize(ingredientName || ingredientId.replace(/-/g, ' '));

      // Tier 0: brand map — substring match on each inventory item name
      for (const item of inStock) {
        const itemNameLower = item.name.toLowerCase();
        for (const [brandKey, satisfiedIngredients] of Object.entries(BRAND_MAP)) {
          if (itemNameLower.includes(brandKey)) {
            if (satisfiedIngredients.some(si => {
              const nsi = normalize(si);
              return nsi.includes(normalizedIngredient) || normalizedIngredient.includes(nsi);
            })) {
              return true;
            }
          }
        }
      }

      // Tier 1: exact canonical ID lookup (spirits covered by brandMap.ts regexes)
      if (canonicalIds.has(ingredientId)) return true;

      // Tier 2: Fuse.js fuzzy name match
      if (ingredientName) {
        const results = fuse.search(normalize(ingredientName));
        if (results.length > 0) return true;
      }

      // Tier 3: pantry satisfies match
      if (pantryNormalized.size > 0) {
        const normalizedId = normalize(ingredientId.replace(/-/g, ' '));
        if (pantryNormalized.has(normalizedId)) return true;
        if (ingredientName && pantryNormalized.has(normalize(ingredientName))) return true;
      }

      return false;
    },
  };
}
