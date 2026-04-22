import Fuse from 'fuse.js';
import { InventoryItem, SPIRIT_TYPE_CANONICAL } from '../types';
import { getCanonicalIds } from './brandMap';
import { PANTRY_CATEGORIES } from '../data/pantryItems';

const FILLER_RE = /\b(fresh|squeezed|homemade|house|pure|quality)\b/gi;

function normalize(str: string): string {
  return str.toLowerCase().replace(FILLER_RE, '').replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ').trim();
}

// Garnish/non-alcoholic ingredient IDs that shouldn't count as "missing"
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

  // Build canonical ID set — same logic as useInventory's inStockIds
  const canonicalIds = new Set<string>();
  inStock.forEach(item => {
    canonicalIds.add(item.ingredientId);
    getCanonicalIds(item.name).forEach(id => canonicalIds.add(id));
    if (item.spiritType) {
      (SPIRIT_TYPE_CANONICAL[item.spiritType] ?? []).forEach(id => canonicalIds.add(id));
    }
  });

  // Fuse.js index on normalized inventory names — fallback for unrecognized bottles
  const fuseData = inStock.map(item => ({ name: normalize(item.name) }));
  const fuse = new Fuse(fuseData, { keys: ['name'], threshold: 0.35, includeScore: true });

  // Build pantry satisfies set — normalized strings from checked pantry items
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
      // Tier 1: exact canonical ID lookup (covers brand-expanded inventory)
      if (canonicalIds.has(ingredientId)) return true;

      // Tier 2: Fuse.js fuzzy name match (handles unrecognized bottle names)
      if (ingredientName) {
        const results = fuse.search(normalize(ingredientName));
        if (results.length > 0) return true;
      }

      // Tier 3: pantry satisfies match (fresh citrus, eggs, syrups, etc.)
      if (pantryNormalized.size > 0) {
        const normalizedId = normalize(ingredientId.replace(/-/g, ' '));
        if (pantryNormalized.has(normalizedId)) return true;
        if (ingredientName && pantryNormalized.has(normalize(ingredientName))) return true;
      }

      return false;
    },
  };
}
