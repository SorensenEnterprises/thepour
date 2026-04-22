import { Recipe } from '../types';

export const energyDrinkCocktails: Recipe[] = [

  // ── Classic French Connection ─────────────────────────────────────────────

  {
    id: '368',
    name: 'French Connection',
    description: 'The original. Cognac and amaretto over ice — rich, nutty, and completely no-fuss. The one that started the French Connection name.',
    ingredients: [
      { ingredientId: 'cognac', name: 'Cognac or Brandy', amount: 1.5, unit: 'oz' },
      { ingredientId: 'amaretto', name: 'Amaretto (Disaronno)', amount: 1, unit: 'oz' },
    ],
    instructions: [
      'Fill a rocks glass with ice.',
      'Pour cognac over ice.',
      'Add amaretto and stir once to combine.',
      'No garnish needed.',
    ],
    glassType: 'Rocks',
    tags: ['cognac', 'classic', 'simple', 'sweet', 'stirred'],
    difficulty: 'easy',
  },

  // ── Red Bull cocktails ────────────────────────────────────────────────────

  {
    id: '361',
    name: 'Vodka Red Bull',
    description: 'The club staple — vodka meets the iconic energy drink for a fast-moving, buzzy long drink.',
    ingredients: [
      { ingredientId: 'vodka', name: 'Vodka', amount: 1.5, unit: 'oz' },
      { ingredientId: 'red-bull', name: 'Red Bull Original', amount: 8.4, unit: 'oz' },
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
      { ingredientId: 'red-bull', name: 'Red Bull Original', amount: 8.4, unit: 'oz' },
    ],
    instructions: [
      'Pour Red Bull into a pint glass, filling it about halfway.',
      'Fill a shot glass with Jägermeister.',
      'Drop the shot glass into the pint glass.',
      'Drink immediately.',
    ],
    glassType: 'Pint (Bomb-style)',
    tags: ['liqueur', 'energy', 'bomb', 'shot'],
    difficulty: 'easy',
  },

  {
    id: '363',
    name: 'Tequila Red Bull',
    description: 'A Latinx spin on the energy drink cocktail — blanco tequila with Red Bull for a bright, agave-forward boost.',
    ingredients: [
      { ingredientId: 'tequila', name: 'Tequila Blanco', amount: 1.5, unit: 'oz' },
      { ingredientId: 'red-bull', name: 'Red Bull Original', amount: 8.4, unit: 'oz' },
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
    id: '369',
    name: 'French Connection Bull',
    description: 'Amaretto and Red Bull — the sweeter, buzzier cousin of the classic French Connection. Nutty, fruity, and dangerously drinkable.',
    ingredients: [
      { ingredientId: 'amaretto', name: 'Amaretto (Disaronno)', amount: 1.5, unit: 'oz' },
      { ingredientId: 'red-bull', name: 'Red Bull Original', amount: 8.4, unit: 'oz' },
    ],
    instructions: [
      'Fill a highball glass with ice.',
      'Pour amaretto over ice.',
      'Top with Red Bull — pour slowly to preserve carbonation.',
      'Stir gently once.',
    ],
    glassType: 'Highball',
    tags: ['liqueur', 'energy', 'sweet', 'easy', 'highball'],
    difficulty: 'easy',
  },

  {
    id: '370',
    name: 'Red Bull Sunrise',
    description: 'Tequila and grenadine under a Red Bull top — the agave Tequila Sunrise you didn\'t know you needed.',
    ingredients: [
      { ingredientId: 'tequila', name: 'Tequila Blanco', amount: 1.5, unit: 'oz' },
      { ingredientId: 'grenadine', name: 'Grenadine', amount: 0.5, unit: 'oz' },
      { ingredientId: 'red-bull', name: 'Red Bull Original', amount: 8.4, unit: 'oz' },
    ],
    instructions: [
      'Fill a highball glass with ice.',
      'Pour grenadine into the glass first — it will sink to the bottom.',
      'Add tequila over the ice.',
      'Top slowly with Red Bull to create a sunrise gradient.',
      'Do not stir — let the layers speak for themselves.',
    ],
    glassType: 'Highball',
    tags: ['tequila', 'energy', 'fruity', 'highball', 'layered'],
    difficulty: 'easy',
  },

  {
    id: '371',
    name: 'Flügel',
    description: 'Vodka, raspberry liqueur, and Red Bull in a glass — the shot that gave an entire generation wings.',
    ingredients: [
      { ingredientId: 'vodka', name: 'Vodka', amount: 1, unit: 'oz' },
      { ingredientId: 'chambord', name: 'Raspberry Liqueur (Chambord)', amount: 0.5, unit: 'oz' },
      { ingredientId: 'red-bull', name: 'Red Bull Original', amount: 8.4, unit: 'oz' },
    ],
    instructions: [
      'Fill a highball glass with ice.',
      'Pour vodka and raspberry liqueur over ice.',
      'Top with Red Bull.',
      'Stir gently.',
    ],
    glassType: 'Highball',
    tags: ['vodka', 'energy', 'sweet', 'highball', 'fruity'],
    difficulty: 'easy',
  },

  {
    id: '372',
    name: 'Hype Man',
    description: 'Gin, elderflower, and Red Bull Sugar Free — the craft bartender\'s energy cocktail. Botanical, floral, and surprisingly civilized.',
    ingredients: [
      { ingredientId: 'gin', name: 'Gin', amount: 1.5, unit: 'oz' },
      { ingredientId: 'elderflower-liqueur', name: 'St-Germain Elderflower Liqueur', amount: 0.5, unit: 'oz' },
      { ingredientId: 'red-bull-sugar-free', name: 'Red Bull Sugar Free', amount: 8.4, unit: 'oz' },
    ],
    instructions: [
      'Fill a highball glass with ice.',
      'Pour gin and St-Germain over ice.',
      'Top with Red Bull Sugar Free.',
      'Garnish with a cucumber ribbon.',
    ],
    glassType: 'Highball',
    garnish: 'Cucumber ribbon',
    tags: ['gin', 'energy', 'light', 'craft', 'highball', 'floral'],
    difficulty: 'easy',
  },

  {
    id: '373',
    name: 'Bull Frog',
    description: 'Equal parts vodka, rum, gin, and tequila topped with Blue Curacao and Red Bull. The Long Island Ice Tea got wings.',
    ingredients: [
      { ingredientId: 'vodka', name: 'Vodka', amount: 0.5, unit: 'oz' },
      { ingredientId: 'rum-white', name: 'White Rum', amount: 0.5, unit: 'oz' },
      { ingredientId: 'gin', name: 'Gin', amount: 0.5, unit: 'oz' },
      { ingredientId: 'tequila', name: 'Tequila', amount: 0.5, unit: 'oz' },
      { ingredientId: 'blue-curacao', name: 'Blue Curacao', amount: 0.5, unit: 'oz' },
      { ingredientId: 'red-bull', name: 'Red Bull Original', amount: 8.4, unit: 'oz' },
    ],
    instructions: [
      'Fill a highball glass with ice.',
      'Add vodka, rum, gin, tequila, and blue curacao.',
      'Top with Red Bull.',
      'Stir gently and serve immediately.',
    ],
    glassType: 'Highball',
    tags: ['vodka', 'rum', 'gin', 'tequila', 'energy', 'strong', 'party', 'highball'],
    difficulty: 'easy',
  },

  {
    id: '374',
    name: 'Whiskey Bull',
    description: 'Bourbon and Red Bull over ice — warming meets buzzing. For when you can\'t decide between a whiskey night and a late one.',
    ingredients: [
      { ingredientId: 'bourbon', name: 'Bourbon', amount: 1.5, unit: 'oz' },
      { ingredientId: 'red-bull', name: 'Red Bull Original', amount: 8.4, unit: 'oz' },
    ],
    instructions: [
      'Fill a highball glass with ice.',
      'Pour bourbon over ice.',
      'Top with Red Bull — pour slowly.',
      'Stir once and serve.',
    ],
    glassType: 'Highball',
    tags: ['whiskey', 'bourbon', 'energy', 'built', 'highball'],
    difficulty: 'easy',
  },

  {
    id: '375',
    name: 'Peach Bull',
    description: 'Peach schnapps and Red Bull Peach Edition — double the peach, all the energy. The summer party starter.',
    ingredients: [
      { ingredientId: 'peach-schnapps', name: 'Peach Schnapps', amount: 1.5, unit: 'oz' },
      { ingredientId: 'red-bull-peach', name: 'Red Bull Peach Edition', amount: 8.4, unit: 'oz' },
    ],
    instructions: [
      'Fill a highball glass with ice.',
      'Pour peach schnapps over ice.',
      'Top with Red Bull Peach Edition.',
      'Garnish with a peach slice.',
    ],
    glassType: 'Highball',
    garnish: 'Peach slice',
    tags: ['energy', 'sweet', 'fruity', 'highball', 'easy'],
    difficulty: 'easy',
  },

  {
    id: '376',
    name: 'Cherry Bomb',
    description: 'A vodka and grenadine shot dropped into Red Bull — the bomb shot with a cherry twist.',
    ingredients: [
      { ingredientId: 'vodka', name: 'Vodka', amount: 1.5, unit: 'oz' },
      { ingredientId: 'grenadine', name: 'Grenadine', amount: 0.5, unit: 'oz' },
      { ingredientId: 'red-bull', name: 'Red Bull Original', amount: 8.4, unit: 'oz' },
    ],
    instructions: [
      'Pour Red Bull into a pint glass, filling it about halfway.',
      'Combine vodka and grenadine in a shot glass.',
      'Drop the shot glass into the pint glass.',
      'Drink immediately.',
    ],
    glassType: 'Pint (Bomb-style)',
    tags: ['vodka', 'energy', 'shot', 'bomb', 'party', 'fruity'],
    difficulty: 'easy',
  },

  // ── Dirty Shirley Energy (existing) ────────────────────────────────────────

  {
    id: '367',
    name: 'Dirty Shirley Energy',
    description: 'A grown-up Shirley Temple with a Red Bull twist — vodka, grenadine, and energy drink for a nostalgic buzz.',
    ingredients: [
      { ingredientId: 'vodka', name: 'Vodka', amount: 1.5, unit: 'oz' },
      { ingredientId: 'grenadine', name: 'Grenadine', amount: 0.5, unit: 'oz' },
      { ingredientId: 'red-bull', name: 'Red Bull Original', amount: 8.4, unit: 'oz' },
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

  // ── Monster cocktails ─────────────────────────────────────────────────────

  {
    id: '364',
    name: 'Rum and Monster',
    description: 'Dark rum and Monster Energy — a bold, tropical-leaning energy cocktail with deep molasses notes.',
    ingredients: [
      { ingredientId: 'rum-dark', name: 'Dark Rum', amount: 1.5, unit: 'oz' },
      { ingredientId: 'monster-energy', name: 'Monster Energy Original', amount: 8, unit: 'oz' },
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
    id: '377',
    name: 'Monster Mash',
    description: 'Dark rum, lime, and Monster Original — a twisted Dark & Stormy with an energy kick.',
    ingredients: [
      { ingredientId: 'rum-dark', name: 'Dark Rum', amount: 1.5, unit: 'oz' },
      { ingredientId: 'lime-juice', name: 'Lime Juice', amount: 0.5, unit: 'oz' },
      { ingredientId: 'monster-energy', name: 'Monster Energy Original', amount: 8, unit: 'oz' },
    ],
    instructions: [
      'Fill a highball glass with ice.',
      'Pour dark rum and lime juice over ice.',
      'Top with Monster Energy.',
      'Stir once and garnish with a lime wedge.',
    ],
    glassType: 'Highball',
    garnish: 'Lime wedge',
    tags: ['rum', 'energy', 'strong', 'highball', 'citrus'],
    difficulty: 'easy',
  },

  {
    id: '378',
    name: 'Green Monster',
    description: 'Midori, vodka, and Monster Ultra White — chartreuse color, clean taste, very bad decision.',
    ingredients: [
      { ingredientId: 'midori', name: 'Midori Melon Liqueur', amount: 1.5, unit: 'oz' },
      { ingredientId: 'vodka', name: 'Vodka', amount: 1, unit: 'oz' },
      { ingredientId: 'monster-ultra-white', name: 'Monster Ultra White', amount: 8, unit: 'oz' },
    ],
    instructions: [
      'Fill a highball glass with ice.',
      'Pour Midori and vodka over ice.',
      'Top with Monster Ultra White.',
      'Stir gently.',
    ],
    glassType: 'Highball',
    tags: ['vodka', 'energy', 'sweet', 'party', 'highball', 'fruity'],
    difficulty: 'easy',
  },

  // ── Celsius cocktails ─────────────────────────────────────────────────────

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
    id: '379',
    name: 'Celsius Sunrise',
    description: 'Vodka and grenadine under Celsius — a lighter energy sunrise for the fitness crowd.',
    ingredients: [
      { ingredientId: 'vodka', name: 'Vodka', amount: 1.5, unit: 'oz' },
      { ingredientId: 'grenadine', name: 'Grenadine', amount: 0.5, unit: 'oz' },
      { ingredientId: 'celsius-energy', name: 'Celsius (any citrus flavor)', amount: 12, unit: 'oz' },
    ],
    instructions: [
      'Fill a highball glass with ice.',
      'Pour grenadine into the glass first.',
      'Add vodka over ice.',
      'Top slowly with Celsius to create a sunrise effect.',
    ],
    glassType: 'Highball',
    tags: ['vodka', 'energy', 'light', 'fruity', 'highball', 'low-cal'],
    difficulty: 'easy',
  },

  // ── Sparkling Water cocktails ─────────────────────────────────────────────

  {
    id: '380',
    name: 'Sparkling Gin Garden',
    description: 'Gin, elderflower, lime, and Liquid Death Sparkling Water — the cocktail that says you have good taste and a sense of humor.',
    ingredients: [
      { ingredientId: 'gin', name: 'Gin', amount: 2, unit: 'oz' },
      { ingredientId: 'elderflower-liqueur', name: 'St-Germain Elderflower Liqueur', amount: 0.5, unit: 'oz' },
      { ingredientId: 'lime-juice', name: 'Lime Juice', amount: 0.5, unit: 'oz' },
      { ingredientId: 'liquid-death', name: 'Liquid Death Sparkling Water', amount: 12, unit: 'oz' },
    ],
    instructions: [
      'Fill a highball glass with ice.',
      'Pour gin, St-Germain, and lime juice over ice.',
      'Top with Liquid Death Sparkling Water.',
      'Stir gently and garnish with a cucumber ribbon.',
    ],
    glassType: 'Highball',
    garnish: 'Cucumber ribbon',
    tags: ['gin', 'craft', 'light', 'sparkling', 'floral', 'highball'],
    difficulty: 'easy',
  },

  // ── Tonic cocktails ───────────────────────────────────────────────────────

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
    tags: ['gin', 'tonic', 'highball', 'built', 'refreshing', 'classic'],
    difficulty: 'easy',
  },
];
