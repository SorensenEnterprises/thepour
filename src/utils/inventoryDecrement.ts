import { Recipe, InventoryItem, QuantityLevel } from '../types';
import { buildInventoryMatcher, isGarnish } from './ingredientMatcher';

const ML_PER_OZ = 29.5735;

const QUANTITY_FRACTION: Record<QuantityLevel, number> = {
  'full':           1.00,
  'three-quarters': 0.75,
  'half':           0.50,
  'quarter':        0.25,
  'splash':         0.08,
  'out':            0.00,
};

function fractionToLevel(fraction: number): QuantityLevel {
  if (fraction <= 0)     return 'out';
  if (fraction < 0.165)  return 'splash';
  if (fraction < 0.375)  return 'quarter';
  if (fraction < 0.625)  return 'half';
  if (fraction < 0.875)  return 'three-quarters';
  return 'full';
}

export interface DecrementResult {
  updated:        InventoryItem[];
  lowBottles:     string[];   // names of bottles that hit splash or out
  adjustedCount:  number;     // how many distinct bottles were decremented
}

export function decrementInventory(
  inventory:     InventoryItem[],
  recipe:        Recipe,
  servingsCount: number,
): DecrementResult {
  // Work on a shallow-copy array so callers see no mutation
  const updated = inventory.map(i => ({ ...i }));
  const lowBottles:    string[] = [];
  let   adjustedCount           = 0;

  // Only decrement oz-measured, non-garnish, non-optional ingredients
  const toDecrement = recipe.ingredients.filter(
    ing => !ing.optional && !isGarnish(ing.ingredientId) && ing.unit === 'oz',
  );

  for (const ing of toDecrement) {
    const ozUsed = ing.amount * servingsCount;

    // Find every in-stock inventory item that satisfies this ingredient
    const candidates = updated.filter(item => {
      if (item.quantity === 'out') return false;
      const matcher = buildInventoryMatcher([item], new Set());
      return matcher.isSatisfied(ing.ingredientId, ing.name);
    });

    if (candidates.length === 0) continue;

    // Use up nearly-empty bottles first (lowest fraction first)
    candidates.sort(
      (a, b) => QUANTITY_FRACTION[a.quantity] - QUANTITY_FRACTION[b.quantity],
    );
    const target = candidates[0];

    const totalOz      = (target.size ?? 750) / ML_PER_OZ;
    const currentOz    = totalOz * QUANTITY_FRACTION[target.quantity];
    const newFraction  = Math.max(0, (currentOz - ozUsed) / totalOz);
    const newLevel     = fractionToLevel(newFraction);

    const idx = updated.findIndex(i => i.ingredientId === target.ingredientId);
    if (idx !== -1) {
      updated[idx] = { ...updated[idx], quantity: newLevel };
      adjustedCount++;
      if (newLevel === 'splash' || newLevel === 'out') {
        lowBottles.push(target.name);
      }
    }
  }

  return { updated, lowBottles, adjustedCount };
}
