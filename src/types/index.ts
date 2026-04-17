export type QuantityLevel = 'full' | 'three-quarters' | 'half' | 'quarter' | 'splash' | 'out';

export const QUANTITY_LEVELS: QuantityLevel[] = [
  'full', 'three-quarters', 'half', 'quarter', 'splash', 'out',
];

export const QUANTITY_LABELS: Record<QuantityLevel, string> = {
  'full':           'Full',
  'three-quarters': '¾',
  'half':           '½',
  'quarter':        '¼',
  'splash':         'Splash',
  'out':            'Out',
};

export interface Ingredient {
  id: string;
  name: string;
  category: 'spirit' | 'liqueur' | 'mixer' | 'garnish' | 'syrup' | 'bitters' | 'other';
}

export interface RecipeIngredient {
  ingredientId: string;
  name: string;
  amount: number;
  unit: string;
  optional?: boolean;
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  ingredients: RecipeIngredient[];
  instructions: string[];
  glassType: string;
  garnish?: string;
  tags: string[];
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface InventoryItem {
  ingredientId: string;
  name: string;
  category: Ingredient['category'];
  quantity: QuantityLevel;
  notes?: string;
}
