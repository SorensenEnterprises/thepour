export type QuantityLevel = 'full' | 'three-quarters' | 'half' | 'quarter' | 'splash' | 'out';

// ── Spirit / Liqueur type metadata ────────────────────────────────────────────

export interface SpiritTypeOption {
  value: string;
  label: string;
  canonicalIds: string[]; // ingredient IDs this type satisfies in recipes
}

export const SPIRIT_TYPES: SpiritTypeOption[] = [
  { value: 'bourbon',          label: 'Bourbon',               canonicalIds: ['bourbon'] },
  { value: 'rye-whiskey',      label: 'Rye Whiskey',           canonicalIds: ['rye-whiskey'] },
  { value: 'irish-whiskey',    label: 'Irish Whiskey',         canonicalIds: ['irish-whiskey'] },
  { value: 'scotch-blended',   label: 'Scotch (Blended)',      canonicalIds: ['scotch'] },
  { value: 'scotch-peated',    label: 'Scotch (Peated/Islay)', canonicalIds: ['islay-scotch', 'scotch'] },
  { value: 'japanese-whisky',  label: 'Japanese Whisky',       canonicalIds: ['japanese-whisky'] },
  { value: 'tequila-blanco',   label: 'Blanco Tequila',        canonicalIds: ['tequila'] },
  { value: 'tequila-reposado', label: 'Reposado Tequila',      canonicalIds: ['tequila-reposado', 'tequila'] },
  { value: 'tequila-anejo',    label: 'Añejo Tequila',         canonicalIds: ['tequila-anejo', 'tequila'] },
  { value: 'mezcal',           label: 'Mezcal',                canonicalIds: ['mezcal'] },
  { value: 'gin-london-dry',   label: 'London Dry Gin',        canonicalIds: ['gin'] },
  { value: 'gin-old-tom',      label: 'Old Tom Gin',           canonicalIds: ['gin'] },
  { value: 'gin-navy',         label: 'Navy Strength Gin',     canonicalIds: ['gin'] },
  { value: 'rum-white',        label: 'White Rum',             canonicalIds: ['rum-white'] },
  { value: 'rum-dark',         label: 'Dark Rum',              canonicalIds: ['rum-dark'] },
  { value: 'rum-aged',         label: 'Aged Rum',              canonicalIds: ['rum-aged', 'rum-dark'] },
  { value: 'rum-spiced',       label: 'Spiced Rum',            canonicalIds: ['rum-spiced', 'rum-dark'] },
  { value: 'vodka',            label: 'Vodka',                 canonicalIds: ['vodka'] },
  { value: 'cognac-brandy',    label: 'Cognac/Brandy',         canonicalIds: ['cognac', 'brandy'] },
  { value: 'other-spirit',     label: 'Other Spirit',          canonicalIds: [] },
];

export const LIQUEUR_TYPES: SpiritTypeOption[] = [
  { value: 'triple-sec',      label: 'Triple Sec/Cointreau', canonicalIds: ['triple-sec'] },
  { value: 'coffee-liqueur',  label: 'Coffee Liqueur',       canonicalIds: ['coffee-liqueur'] },
  { value: 'irish-cream',     label: 'Irish Cream',          canonicalIds: ['irish-cream', 'coffee-liqueur'] },
  { value: 'amaretto',        label: 'Amaretto',             canonicalIds: ['amaretto'] },
  { value: 'elderflower',     label: 'Elderflower',          canonicalIds: ['elderflower-liqueur'] },
  { value: 'peach-schnapps',  label: 'Peach Schnapps',       canonicalIds: ['peach-schnapps'] },
  { value: 'campari-l',       label: 'Campari',              canonicalIds: ['campari'] },
  { value: 'aperol-l',        label: 'Aperol',               canonicalIds: ['aperol'] },
  { value: 'chambord',        label: 'Chambord',             canonicalIds: ['chambord'] },
  { value: 'other-liqueur',   label: 'Other Liqueur',        canonicalIds: [] },
];

export const FORTIFIED_TYPES: SpiritTypeOption[] = [
  { value: 'sweet-vermouth',   label: 'Sweet Vermouth',              canonicalIds: ['sweet-vermouth'] },
  { value: 'dry-vermouth',     label: 'Dry Vermouth',                canonicalIds: ['dry-vermouth'] },
  { value: 'blanc-vermouth',   label: 'Blanc/Bianco Vermouth',       canonicalIds: ['dry-vermouth', 'sweet-vermouth'] },
  { value: 'dry-sherry',       label: 'Dry Sherry (Fino/Manzanilla)',canonicalIds: ['dry-sherry', 'amontillado-sherry'] },
  { value: 'cream-sherry',     label: 'Cream Sherry',                canonicalIds: ['dry-sherry'] },
  { value: 'port',             label: 'Port',                        canonicalIds: ['port'] },
  { value: 'other-fortified',  label: 'Other Fortified Wine',        canonicalIds: [] },
];

// Flat lookup: spiritType value → canonical ingredient IDs
export const SPIRIT_TYPE_CANONICAL: Record<string, string[]> = Object.fromEntries(
  [...SPIRIT_TYPES, ...LIQUEUR_TYPES, ...FORTIFIED_TYPES].map(({ value, canonicalIds }) => [value, canonicalIds])
);

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
  parentRecipeId?: string;
  variationLabel?: string;
  variations?: string[];
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
  id?: string;          // Supabase UUID — present for rows loaded from DB
  ingredientId: string; // app-level identifier used for recipe matching
  name: string;
  category: Ingredient['category'];
  quantity: QuantityLevel;
  size?: BottleSize;
  notes?: string;
  spiritType?: string; // value from SPIRIT_TYPES | LIQUEUR_TYPES | FORTIFIED_TYPES
}
