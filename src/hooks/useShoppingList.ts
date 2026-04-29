import { useMemo } from 'react';
import { RecipeMatch } from '../utils/recipeUtils';
import { isGarnish, getRecipeCanonicalType } from '../utils/ingredientMatcher';
import { getDisplayName, getIngredientCategory } from '../utils/unlockCalculator';

export interface ShoppingItem {
  ingredientId: string;
  name: string;
  category: 'spirit' | 'liqueur' | 'mixer' | 'pantry' | 'other';
  unlocksCount: number;
  recipes: string[];
}

const CATEGORY_ORDER: Record<ShoppingItem['category'], number> = {
  spirit: 0, liqueur: 1, mixer: 2, pantry: 3, other: 4,
};

function mapCategory(cat: string): ShoppingItem['category'] {
  if (cat === 'spirit') return 'spirit';
  if (cat === 'liqueur') return 'liqueur';
  if (cat === 'mixer') return 'mixer';
  if (cat === 'fresh' || cat === 'pantry') return 'pantry';
  return 'other';
}

export function useShoppingList(matches: RecipeMatch[]): ShoppingItem[] {
  return useMemo(() => {
    type Entry = { name: string; category: ShoppingItem['category']; unlocksCount: number; recipes: string[] };
    const itemMap = new Map<string, Entry>();

    for (const match of matches) {
      if (match.canMake) continue;

      const { recipe, missingIngredients, missingCount } = match;
      const missingNameSet = new Set(missingIngredients);
      const missingObjs = recipe.ingredients.filter(
        i => !i.optional && !isGarnish(i.ingredientId) && missingNameSet.has(i.name)
      );

      for (const mi of missingObjs) {
        const key = getRecipeCanonicalType(mi.ingredientId) ?? mi.ingredientId;

        if (!itemMap.has(key)) {
          itemMap.set(key, {
            name: getDisplayName(key),
            category: mapCategory(getIngredientCategory(key)),
            unlocksCount: 0,
            recipes: [],
          });
        }

        if (missingCount === 1) {
          const entry = itemMap.get(key)!;
          entry.unlocksCount++;
          if (!entry.recipes.includes(recipe.name)) {
            entry.recipes.push(recipe.name);
          }
        }
      }
    }

    return Array.from(itemMap.entries())
      .map(([id, entry]) => ({
        ingredientId: id,
        name: entry.name,
        category: entry.category,
        unlocksCount: entry.unlocksCount,
        recipes: entry.recipes.slice().sort(),
      }))
      .sort((a, b) => {
        if (b.unlocksCount !== a.unlocksCount) return b.unlocksCount - a.unlocksCount;
        return CATEGORY_ORDER[a.category] - CATEGORY_ORDER[b.category];
      });
  }, [matches]);
}
