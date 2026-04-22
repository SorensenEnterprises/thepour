import { Recipe, InventoryItem } from '../types';
import { buildInventoryMatcher, isGarnish } from './ingredientMatcher';

export type RecipeMatch = {
  recipe: Recipe;
  canMake: boolean;
  missingIngredients: string[];
  missingCount: number;
  splashWarnings: string[];
  haveCount: number;   // required ingredients currently in stock
  totalCount: number;  // total required ingredients
};

export function matchRecipesToInventory(
  recipes: Recipe[],
  inventory: InventoryItem[],
  splashIds: Set<string>,
  checkedPantryIds: Set<string> = new Set(),
): RecipeMatch[] {
  const matcher = buildInventoryMatcher(inventory, checkedPantryIds);
  const results = recipes
    .map(recipe => {
      const required = recipe.ingredients.filter(i => !i.optional && !isGarnish(i.ingredientId));
      const missing = required.filter(i => !matcher.isSatisfied(i.ingredientId, i.name));
      const splashWarnings = required
        .filter(i => matcher.isSatisfied(i.ingredientId, i.name) && splashIds.has(i.ingredientId))
        .map(i => i.name);
      return {
        recipe,
        canMake: missing.length === 0,
        missingIngredients: missing.map(i => i.name),
        missingCount: missing.length,
        splashWarnings,
        haveCount: required.length - missing.length,
        totalCount: required.length,
      };
    })
    .sort((a, b) => a.missingCount - b.missingCount);

  if (process.env.NODE_ENV === 'development') {
    const ready = results.filter(r => r.canMake).length;
    const oneAway = results.filter(r => r.missingCount === 1).length;
    console.log(`[recipeMatch] ${recipes.length} recipes → ${ready} ready, ${oneAway} one-away`);
  }

  return results;
}
