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

export type BottleSize = 50 | 375 | 750 | 1000 | 1750;

export const BOTTLE_SIZES: { value: BottleSize; label: string }[] = [
  { value: 50,   label: '50ml (mini)' },
  { value: 375,  label: '375ml (half bottle)' },
  { value: 750,  label: '750ml (standard)' },
  { value: 1000, label: '1L' },
  { value: 1750, label: '1.75L (handle)' },
];

export interface InventoryItem {
  ingredientId: string;
  name: string;
  category: Ingredient['category'];
  quantity: QuantityLevel;
  size?: BottleSize;
  notes?: string;
}
