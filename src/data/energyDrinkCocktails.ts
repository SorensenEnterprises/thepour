import { Recipe } from '../types';

export const energyDrinkCocktails: Recipe[] = [

  {
    id: '361',
    name: 'Vodka Red Bull',
    description: 'The club staple — vodka meets the iconic energy drink for a fast-moving, buzzy long drink.',
    ingredients: [
      { ingredientId: 'vodka', name: 'Vodka', amount: 1.5, unit: 'oz' },
      { ingredientId: 'red-bull', name: 'Red Bull', amount: 8.4, unit: 'oz' },
    ],
    instructions: [
      'Fill a highball glass with ice.',
      'Pour vodka over ice.',
      'Top with Red Bull — pour slowly to preserve carbonation.',
      'Do not stir.',
    ],
    glassType: 'Highball',
    tags: ['vodka', 'energy', 'built', 'highball', 'easy'],
    difficulty: 'easy',
  },

  {
    id: '362',
    name: 'Jager Bomb',
    description: 'Drop a shot of Jägermeister into a glass of Red Bull — the bomb shot that defined a generation.',
    ingredients: [
      { ingredientId: 'jagermeister', name: 'Jägermeister', amount: 1.5, unit: 'oz' },
      { ingredientId: 'red-bull', name: 'Red Bull', amount: 8.4, unit: 'oz' },
    ],
    instructions: [
      'Pour Red Bull into a pint glass, filling it about halfway.',
      'Fill a shot glass with Jägermeister.',
      'Drop the shot glass into the pint glass.',
      'Drink immediately.',
    ],
    glassType: 'Pint (Bomb-style)',
    tags: ['liqueur', 'energy', 'bomb', 'shot', 'energy'],
    difficulty: 'easy',
  },

  {
    id: '363',
    name: 'Tequila Red Bull',
    description: 'A Latinx spin on the energy drink cocktail — blanco tequila with Red Bull for a bright, agave-forward boost.',
    ingredients: [
      { ingredientId: 'tequila', name: 'Tequila Blanco', amount: 1.5, unit: 'oz' },
      { ingredientId: 'red-bull', name: 'Red Bull', amount: 8.4, unit: 'oz' },
      { ingredientId: 'lime-juice', name: 'Fresh Lime Juice', amount: 0.5, unit: 'oz', optional: true },
    ],
    instructions: [
      'Fill a highball glass with ice.',
      'Pour tequila and lime juice (if using) over ice.',
      'Top with Red Bull.',
      'Garnish with a lime wedge.',
    ],
    glassType: 'Highball',
    garnish: 'Lime wedge',
    tags: ['tequila', 'energy', 'built', 'highball', 'citrus'],
    difficulty: 'easy',
  },

  {
    id: '364',
    name: 'Rum and Monster',
    description: 'Dark rum and Monster Energy — a bold, tropical-leaning energy cocktail with deep molasses notes.',
    ingredients: [
      { ingredientId: 'rum-dark', name: 'Dark Rum', amount: 1.5, unit: 'oz' },
      { ingredientId: 'monster-energy', name: 'Monster Energy', amount: 8, unit: 'oz' },
    ],
    instructions: [
      'Fill a highball glass with ice.',
      'Pour dark rum over ice.',
      'Top with Monster Energy — pour gently.',
      'Garnish with a lime wheel.',
    ],
    glassType: 'Highball',
    garnish: 'Lime wheel',
    tags: ['rum', 'energy', 'built', 'highball'],
    difficulty: 'easy',
  },

  {
    id: '365',
    name: 'Gin and Fever-Tree Tonic',
    description: 'The premium G&T — a quality gin paired with Fever-Tree tonic for botanical clarity and crisp refreshment.',
    ingredients: [
      { ingredientId: 'gin', name: 'Gin', amount: 2, unit: 'oz' },
      { ingredientId: 'fever-tree-tonic', name: 'Fever-Tree Tonic Water', amount: 4, unit: 'oz' },
      { ingredientId: 'lime-juice', name: 'Lime Wedge', amount: 1, unit: 'wedge', optional: true },
    ],
    instructions: [
      'Fill a highball or copa glass with ice.',
      'Pour gin over ice.',
      'Top with Fever-Tree tonic — pour over the back of a spoon to preserve bubbles.',
      'Squeeze and drop in a lime wedge.',
      'Stir gently once.',
    ],
    glassType: 'Copa',
    garnish: 'Lime wedge, cucumber ribbon',
    tags: ['gin', 'energy', 'tonic', 'highball', 'built', 'refreshing'],
    difficulty: 'easy',
  },

  {
    id: '366',
    name: 'Vodka Celsius',
    description: 'Vodka meets the peach-mango Celsius — the gym crowd\'s after-workout cocktail: clean, light, and refreshing.',
    ingredients: [
      { ingredientId: 'vodka', name: 'Vodka', amount: 1.5, unit: 'oz' },
      { ingredientId: 'celsius-energy', name: 'Celsius Energy Drink', amount: 12, unit: 'oz' },
    ],
    instructions: [
      'Fill a large glass or tumbler with ice.',
      'Pour vodka over ice.',
      'Top with Celsius energy drink.',
      'Stir gently.',
    ],
    glassType: 'Highball',
    tags: ['vodka', 'energy', 'built', 'low-cal', 'refreshing'],
    difficulty: 'easy',
  },

  {
    id: '367',
    name: 'Dirty Shirley Energy',
    description: 'A grown-up Shirley Temple with a Red Bull twist — vodka, grenadine, and energy drink for a nostalgic buzz.',
    ingredients: [
      { ingredientId: 'vodka', name: 'Vodka', amount: 1.5, unit: 'oz' },
      { ingredientId: 'grenadine', name: 'Grenadine', amount: 0.5, unit: 'oz' },
      { ingredientId: 'red-bull', name: 'Red Bull', amount: 8.4, unit: 'oz' },
      { ingredientId: 'maraschino-cherry', name: 'Maraschino Cherry', amount: 1, unit: 'piece', optional: true },
    ],
    instructions: [
      'Fill a highball glass with ice.',
      'Pour vodka and grenadine over ice.',
      'Top with Red Bull.',
      'Garnish with a maraschino cherry.',
    ],
    glassType: 'Highball',
    garnish: 'Maraschino cherry',
    tags: ['vodka', 'energy', 'built', 'fruity', 'highball'],
    difficulty: 'easy',
  },
];
