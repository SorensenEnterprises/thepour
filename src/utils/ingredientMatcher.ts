import Fuse from 'fuse.js';
import { InventoryItem, SPIRIT_TYPE_CANONICAL } from '../types';
import { getCanonicalIds } from './brandMap';

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

export function buildInventoryMatcher(items: InventoryItem[]): InventoryMatcher {
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

  return {
    isSatisfied(ingredientId: string, ingredientName?: string): boolean {
      // Tier 1: exact canonical ID lookup
      if (canonicalIds.has(ingredientId)) return true;

      // Tier 2: fuzzy name match (handles unrecognized brand names)
      if (ingredientName) {
        const results = fuse.search(normalize(ingredientName));
        if (results.length > 0) return true;
      }

      return false;
    },
  };
}
