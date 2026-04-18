import { Recipe } from '../types';

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
  inStockIds: Set<string>,
  splashIds: Set<string>
): RecipeMatch[] {
  return recipes
    .map(recipe => {
      const required = recipe.ingredients.filter(i => !i.optional);
      const missing = required.filter(i => !inStockIds.has(i.ingredientId));
      const splashWarnings = required
        .filter(i => inStockIds.has(i.ingredientId) && splashIds.has(i.ingredientId))
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
}
