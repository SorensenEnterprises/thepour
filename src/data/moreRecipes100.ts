import { Recipe } from '../types';

export const moreRecipes100: Recipe[] = [

  // ── New Orleans Classics ─────────────────────────────────────────────────────

  {
    id: 'r751',
    name: 'Brandy Crusta',
    description: 'The original craft cocktail — cognac, maraschino, and citrus in a sugar-rimmed glass.',
    ingredients: [
      { ingredientId: 'cognac', name: 'Cognac', amount: 2, unit: 'oz' },
      { ingredientId: 'maraschino-liqueur', name: 'Maraschino Liqueur', amount: 0.25, unit: 'oz' },
      { ingredientId: 'triple-sec', name: 'Orange Curaçao', amount: 0.25, unit: 'oz' },
      { ingredientId: 'lemon-juice', name: 'Fresh Lemon Juice', amount: 0.5, unit: 'oz' },
      { ingredientId: 'angostura-bitters', name: 'Angostura Bitters', amount: 2, unit: 'dashes' },
    ],
    instructions: [
      'Rim a wine glass with sugar and line with a long lemon peel spiral.',
      'Stir all ingredients with ice until chilled.',
      'Strain into the prepared glass.',
    ],
    glassType: 'Wine',
    garnish: 'Sugar rim, lemon peel spiral',
    tags: ['cognac', 'brandy', 'new-orleans', 'classic', 'stirred', 'spirit-forward'],
    difficulty: 'medium',
  },

  {
    id: 'r752',
    name: 'Chrysanthemum',
    description: 'An elegant Prohibition-era aperitif — dry vermouth, Bénédictine, and a whisper of absinthe.',
    ingredients: [
      { ingredientId: 'dry-vermouth', name: 'Dry Vermouth', amount: 2.25, unit: 'oz' },
      { ingredientId: 'benedictine', name: 'Bénédictine', amount: 0.75, unit: 'oz' },
      { ingredientId: 'absinthe', name: 'Absinthe', amount: 1, unit: 'tsp' },
    ],
    instructions: [
      'Stir all ingredients with ice until well chilled.',
      'Strain into a chilled coupe.',
      'Express an orange peel over the glass and discard.',
    ],
    glassType: 'Coupe',
    garnish: 'Orange peel',
    tags: ['low-abv', 'aperitivo', 'stirred', 'classic', 'herbal'],
    difficulty: 'easy',
  },

  {
    id: 'r753',
    name: 'La Louisiana',
    description: 'New Orleans in a glass — rye, Bénédictine, sweet vermouth, absinthe, and Peychaud\'s.',
    ingredients: [
      { ingredientId: 'rye-whiskey', name: 'Rye Whiskey', amount: 1.5, unit: 'oz' },
      { ingredientId: 'sweet-vermouth', name: 'Sweet Vermouth', amount: 0.75, unit: 'oz' },
      { ingredientId: 'benedictine', name: 'Bénédictine', amount: 0.75, unit: 'oz' },
      { ingredientId: 'peychauds-bitters', name: "Peychaud's Bitters", amount: 3, unit: 'dashes' },
      { ingredientId: 'absinthe', name: 'Absinthe', amount: 3, unit: 'dashes' },
    ],
    instructions: [
      'Stir all ingredients with ice until chilled.',
      'Strain into a chilled coupe.',
      'Garnish with a maraschino cherry.',
    ],
    glassType: 'Coupe',
    garnish: 'Maraschino cherry',
    tags: ['whiskey', 'rye', 'new-orleans', 'classic', 'stirred', 'spirit-forward'],
    difficulty: 'medium',
  },

  {
    id: 'r754',
    name: 'Twelve Mile Limit',
    description: 'A Prohibition-era blend of rum, rye, brandy, lemon, and grenadine — ambitious and balanced.',
    ingredients: [
      { ingredientId: 'rum-white', name: 'White Rum', amount: 0.75, unit: 'oz' },
      { ingredientId: 'rye-whiskey', name: 'Rye Whiskey', amount: 0.75, unit: 'oz' },
      { ingredientId: 'brandy', name: 'Brandy', amount: 0.5, unit: 'oz' },
      { ingredientId: 'lemon-juice', name: 'Fresh Lemon Juice', amount: 0.5, unit: 'oz' },
      { ingredientId: 'grenadine', name: 'Grenadine', amount: 0.25, unit: 'oz' },
    ],
    instructions: [
      'Shake all ingredients with ice.',
      'Strain into a chilled coupe.',
    ],
    glassType: 'Coupe',
    tags: ['rum', 'whiskey', 'brandy', 'classic', 'shaken', 'prohibition'],
    difficulty: 'medium',
  },

  {
    id: 'r755',
    name: 'Seelbach Variation',
    description: 'Bourbon, Cointreau, and two bitters topped with Champagne — the Louisville classic.',
    ingredients: [
      { ingredientId: 'bourbon', name: 'Bourbon', amount: 1, unit: 'oz' },
      { ingredientId: 'triple-sec', name: 'Cointreau', amount: 0.5, unit: 'oz' },
      { ingredientId: 'angostura-bitters', name: 'Angostura Bitters', amount: 7, unit: 'dashes' },
      { ingredientId: 'peychauds-bitters', name: "Peychaud's Bitters", amount: 7, unit: 'dashes' },
      { ingredientId: 'champagne', name: 'Champagne', amount: 4, unit: 'oz' },
    ],
    instructions: [
      'Combine bourbon, Cointreau, and both bitters in a flute.',
      'Top with Champagne.',
      'Garnish with an orange twist.',
    ],
    glassType: 'Flute',
    garnish: 'Orange twist',
    tags: ['bourbon', 'whiskey', 'bubbly', 'new-orleans', 'classic', 'stirred'],
    difficulty: 'easy',
  },

  // ── Scotch & Whisky ───────────────────────────────────────────────────────────

  {
    id: 'r756',
    name: "Cameron's Kick",
    description: 'Scotch and Irish whiskey united by lemon and orgeat — surprisingly harmonious.',
    ingredients: [
      { ingredientId: 'scotch', name: 'Blended Scotch', amount: 1, unit: 'oz' },
      { ingredientId: 'irish-whiskey', name: 'Irish Whiskey', amount: 1, unit: 'oz' },
      { ingredientId: 'lemon-juice', name: 'Fresh Lemon Juice', amount: 0.75, unit: 'oz' },
      { ingredientId: 'orgeat', name: 'Orgeat', amount: 0.5, unit: 'oz' },
    ],
    instructions: [
      'Shake all ingredients vigorously with ice.',
      'Strain into a chilled coupe.',
    ],
    glassType: 'Coupe',
    tags: ['scotch', 'whiskey', 'irish-whiskey', 'classic', 'shaken', 'citrus'],
    difficulty: 'easy',
  },

  {
    id: 'r757',
    name: 'Mamie Taylor',
    description: 'Scotch, lime, and ginger beer — the Buck format at its most refreshing.',
    ingredients: [
      { ingredientId: 'scotch', name: 'Blended Scotch', amount: 2, unit: 'oz' },
      { ingredientId: 'lime-juice', name: 'Fresh Lime Juice', amount: 0.5, unit: 'oz' },
      { ingredientId: 'ginger-beer', name: 'Ginger Beer', amount: 4, unit: 'oz' },
    ],
    instructions: [
      'Fill a highball glass with ice.',
      'Add Scotch and lime juice.',
      'Top with ginger beer and stir gently.',
      'Garnish with a lime wedge.',
    ],
    glassType: 'Highball',
    garnish: 'Lime wedge',
    tags: ['scotch', 'whiskey', 'highball', 'bubbly', 'easy', 'refreshing'],
    difficulty: 'easy',
  },

  {
    id: 'r758',
    name: 'Whisky Affinity',
    description: 'Scotch split evenly with both vermouths — balanced, complex, and underrated.',
    ingredients: [
      { ingredientId: 'scotch', name: 'Blended Scotch', amount: 1.5, unit: 'oz' },
      { ingredientId: 'sweet-vermouth', name: 'Sweet Vermouth', amount: 0.75, unit: 'oz' },
      { ingredientId: 'dry-vermouth', name: 'Dry Vermouth', amount: 0.75, unit: 'oz' },
      { ingredientId: 'angostura-bitters', name: 'Angostura Bitters', amount: 2, unit: 'dashes' },
    ],
    instructions: [
      'Stir all ingredients with ice until well chilled.',
      'Strain into a chilled coupe.',
      'Express a lemon peel over the glass.',
    ],
    glassType: 'Coupe',
    garnish: 'Lemon peel',
    tags: ['scotch', 'whiskey', 'stirred', 'spirit-forward', 'classic'],
    difficulty: 'easy',
  },

  {
    id: 'r759',
    name: 'Rusty Nail Sour',
    description: 'The Rusty Nail gets lemon and egg white — smoother, more structured, still very Scotch.',
    ingredients: [
      { ingredientId: 'scotch', name: 'Blended Scotch', amount: 1.5, unit: 'oz' },
      { ingredientId: 'drambuie', name: 'Drambuie', amount: 0.75, unit: 'oz' },
      { ingredientId: 'lemon-juice', name: 'Fresh Lemon Juice', amount: 0.75, unit: 'oz' },
      { ingredientId: 'egg-white', name: 'Egg White', amount: 1, unit: 'piece' },
    ],
    instructions: [
      'Dry-shake all ingredients without ice for 15 seconds.',
      'Add ice and shake hard for another 15 seconds.',
      'Double-strain into a chilled coupe.',
    ],
    glassType: 'Coupe',
    tags: ['scotch', 'whiskey', 'sour', 'shaken', 'citrus', 'silky'],
    difficulty: 'medium',
  },

  {
    id: 'r760',
    name: 'Smoky Buck',
    description: 'Islay Scotch, lemon, and ginger beer — the peat hits first, the ginger finishes.',
    ingredients: [
      { ingredientId: 'islay-scotch', name: 'Islay Scotch', amount: 2, unit: 'oz' },
      { ingredientId: 'lemon-juice', name: 'Fresh Lemon Juice', amount: 0.5, unit: 'oz' },
      { ingredientId: 'ginger-beer', name: 'Ginger Beer', amount: 4, unit: 'oz' },
    ],
    instructions: [
      'Fill a highball glass with ice.',
      'Add Scotch and lemon juice.',
      'Top with ginger beer and stir gently.',
      'Garnish with a lemon wedge.',
    ],
    glassType: 'Highball',
    garnish: 'Lemon wedge',
    tags: ['scotch', 'peated', 'highball', 'bubbly', 'easy', 'smoky'],
    difficulty: 'easy',
  },

  // ── Brandy & Cognac ──────────────────────────────────────────────────────────

  {
    id: 'r761',
    name: 'Deauville',
    description: 'Cognac and apple brandy with Cointreau and lemon — Normandy in cocktail form.',
    ingredients: [
      { ingredientId: 'cognac', name: 'Cognac', amount: 0.75, unit: 'oz' },
      { ingredientId: 'apple-brandy', name: 'Apple Brandy', amount: 0.75, unit: 'oz' },
      { ingredientId: 'triple-sec', name: 'Cointreau', amount: 0.75, unit: 'oz' },
      { ingredientId: 'lemon-juice', name: 'Fresh Lemon Juice', amount: 0.75, unit: 'oz' },
    ],
    instructions: [
      'Shake all ingredients vigorously with ice.',
      'Strain into a chilled coupe.',
    ],
    glassType: 'Coupe',
    tags: ['cognac', 'brandy', 'apple-brandy', 'classic', 'shaken', 'citrus'],
    difficulty: 'easy',
  },

  {
    id: 'r762',
    name: 'Brandy Milk Punch',
    description: 'New Orleans brunch staple — cognac, vanilla, and milk, silky and restorative.',
    ingredients: [
      { ingredientId: 'cognac', name: 'Cognac', amount: 2, unit: 'oz' },
      { ingredientId: 'simple-syrup', name: 'Simple Syrup', amount: 0.5, unit: 'oz' },
      { ingredientId: 'vanilla-syrup', name: 'Vanilla Extract', amount: 0.25, unit: 'oz' },
    ],
    instructions: [
      'Combine cognac, simple syrup, and vanilla in a shaker with ice.',
      'Add 4 oz whole milk.',
      'Shake briefly and strain into a rocks glass over ice.',
      'Grate nutmeg over the top.',
    ],
    glassType: 'Rocks',
    garnish: 'Freshly grated nutmeg',
    tags: ['cognac', 'brandy', 'brunch', 'new-orleans', 'easy', 'creamy'],
    difficulty: 'easy',
  },

  {
    id: 'r763',
    name: 'B&B',
    description: 'Bénédictine and brandy — two ingredients, no fuss, one of the best digestifs ever conceived.',
    ingredients: [
      { ingredientId: 'brandy', name: 'Brandy', amount: 1, unit: 'oz' },
      { ingredientId: 'benedictine', name: 'Bénédictine', amount: 1, unit: 'oz' },
    ],
    instructions: [
      'Pour brandy into a snifter.',
      'Float Bénédictine on top by pouring over the back of a spoon.',
      'Serve neat.',
    ],
    glassType: 'Snifter',
    tags: ['brandy', 'digestif', 'after-dinner', 'stirred', 'herbal', 'easy'],
    difficulty: 'easy',
  },

  {
    id: 'r764',
    name: 'Fancy Free',
    description: 'Bourbon, maraschino, and two bitters — a cleaner, spirit-forward alternative to the Old Fashioned.',
    ingredients: [
      { ingredientId: 'bourbon', name: 'Bourbon', amount: 2, unit: 'oz' },
      { ingredientId: 'maraschino-liqueur', name: 'Maraschino Liqueur', amount: 0.25, unit: 'oz' },
      { ingredientId: 'angostura-bitters', name: 'Angostura Bitters', amount: 2, unit: 'dashes' },
      { ingredientId: 'orange-bitters', name: 'Orange Bitters', amount: 1, unit: 'dash' },
    ],
    instructions: [
      'Stir all ingredients with ice until chilled.',
      'Strain into a rocks glass over a large ice cube.',
      'Express an orange peel over the glass.',
    ],
    glassType: 'Rocks',
    garnish: 'Orange peel',
    tags: ['bourbon', 'whiskey', 'stirred', 'spirit-forward', 'classic'],
    difficulty: 'easy',
  },

  {
    id: 'r765',
    name: 'Monte Carlo',
    description: 'Rye, Bénédictine, and Angostura — a two-ingredient twist on the Manhattan.',
    ingredients: [
      { ingredientId: 'rye-whiskey', name: 'Rye Whiskey', amount: 2, unit: 'oz' },
      { ingredientId: 'benedictine', name: 'Bénédictine', amount: 0.5, unit: 'oz' },
      { ingredientId: 'angostura-bitters', name: 'Angostura Bitters', amount: 2, unit: 'dashes' },
    ],
    instructions: [
      'Stir all ingredients with ice until well chilled.',
      'Strain into a chilled coupe or rocks glass.',
      'Express a lemon peel over the glass.',
    ],
    glassType: 'Coupe',
    garnish: 'Lemon peel',
    tags: ['whiskey', 'rye', 'stirred', 'spirit-forward', 'classic', 'herbal'],
    difficulty: 'easy',
  },

  {
    id: 'r766',
    name: 'Corpse Reviver #1',
    description: 'The morning-after cure that predates #2 — brandy, apple brandy, and sweet vermouth.',
    ingredients: [
      { ingredientId: 'brandy', name: 'Brandy', amount: 1.5, unit: 'oz' },
      { ingredientId: 'apple-brandy', name: 'Apple Brandy', amount: 0.75, unit: 'oz' },
      { ingredientId: 'sweet-vermouth', name: 'Sweet Vermouth', amount: 0.75, unit: 'oz' },
    ],
    instructions: [
      'Stir all ingredients with ice until chilled.',
      'Strain into a chilled coupe.',
    ],
    glassType: 'Coupe',
    tags: ['brandy', 'apple-brandy', 'classic', 'stirred', 'spirit-forward', 'pre-prohibition'],
    difficulty: 'easy',
  },

  // ── Low ABV & Aperitivo ──────────────────────────────────────────────────────

  {
    id: 'r767',
    name: 'Campari Soda',
    description: 'Campari and soda water over ice — the original aperitivo, unchanged and unchallengeable.',
    ingredients: [
      { ingredientId: 'campari', name: 'Campari', amount: 1.5, unit: 'oz' },
      { ingredientId: 'soda-water', name: 'Soda Water', amount: 3, unit: 'oz' },
    ],
    instructions: [
      'Fill a rocks glass with ice.',
      'Pour Campari over ice.',
      'Top with soda water and stir gently.',
      'Express an orange peel over the glass.',
    ],
    glassType: 'Rocks',
    garnish: 'Orange peel',
    tags: ['low-abv', 'aperitivo', 'campari', 'bubbly', 'easy', 'bitter'],
    difficulty: 'easy',
  },

  {
    id: 'r768',
    name: 'Aperol Tonic',
    description: 'Aperol and tonic — lighter than the Spritz, sharper, and just as Italian.',
    ingredients: [
      { ingredientId: 'aperol', name: 'Aperol', amount: 2, unit: 'oz' },
      { ingredientId: 'tonic-water', name: 'Tonic Water', amount: 4, unit: 'oz' },
    ],
    instructions: [
      'Fill a wine glass or highball with ice.',
      'Pour Aperol over ice.',
      'Top with tonic water and stir gently.',
      'Garnish with an orange slice.',
    ],
    glassType: 'Highball',
    garnish: 'Orange slice',
    tags: ['low-abv', 'aperitivo', 'aperol', 'bubbly', 'easy', 'bitter'],
    difficulty: 'easy',
  },

  {
    id: 'r769',
    name: 'Vermouth Cassis',
    description: 'Dry vermouth and crème de cassis — the original Kir before wine took over.',
    ingredients: [
      { ingredientId: 'dry-vermouth', name: 'Dry Vermouth', amount: 3, unit: 'oz' },
      { ingredientId: 'creme-de-cassis', name: 'Crème de Cassis', amount: 0.5, unit: 'oz' },
      { ingredientId: 'soda-water', name: 'Soda Water', amount: 1, unit: 'oz' },
    ],
    instructions: [
      'Fill a wine glass with ice.',
      'Pour crème de cassis, then dry vermouth.',
      'Top with a splash of soda water.',
      'Stir gently and garnish with a lemon twist.',
    ],
    glassType: 'Wine',
    garnish: 'Lemon twist',
    tags: ['low-abv', 'aperitivo', 'bubbly', 'easy', 'fruity'],
    difficulty: 'easy',
  },

  {
    id: 'r770',
    name: 'Americano Highball',
    description: 'Campari, sweet vermouth, and soda — the drink that led to the Negroni. Less is sometimes everything.',
    ingredients: [
      { ingredientId: 'campari', name: 'Campari', amount: 1.5, unit: 'oz' },
      { ingredientId: 'sweet-vermouth', name: 'Sweet Vermouth', amount: 1.5, unit: 'oz' },
      { ingredientId: 'soda-water', name: 'Soda Water', amount: 3, unit: 'oz' },
    ],
    instructions: [
      'Fill a highball glass with ice.',
      'Add Campari and sweet vermouth.',
      'Top with soda water and stir gently.',
      'Garnish with an orange slice and a lemon twist.',
    ],
    glassType: 'Highball',
    garnish: 'Orange slice, lemon twist',
    tags: ['low-abv', 'aperitivo', 'campari', 'bubbly', 'easy', 'bitter', 'classic'],
    difficulty: 'easy',
  },

  {
    id: 'r771',
    name: 'Dry Vermouth Spritz',
    description: 'Fino-style vermouth, soda, and olive — the bartender\'s day-off drink.',
    ingredients: [
      { ingredientId: 'dry-vermouth', name: 'Dry Vermouth', amount: 3, unit: 'oz' },
      { ingredientId: 'soda-water', name: 'Soda Water', amount: 2, unit: 'oz' },
    ],
    instructions: [
      'Fill a wine glass with ice.',
      'Pour dry vermouth over ice.',
      'Top with soda water.',
      'Garnish with a lemon twist and a green olive.',
    ],
    glassType: 'Wine',
    garnish: 'Lemon twist, green olive',
    tags: ['low-abv', 'aperitivo', 'bubbly', 'easy', 'dry', 'savory'],
    difficulty: 'easy',
  },

  {
    id: 'r772',
    name: 'Lillet Blanc Spritz',
    description: 'Lillet Blanc over ice with soda and orange — the easy aperitif that outperforms its effort.',
    ingredients: [
      { ingredientId: 'lillet-blanc', name: 'Lillet Blanc', amount: 3, unit: 'oz' },
      { ingredientId: 'soda-water', name: 'Soda Water', amount: 2, unit: 'oz' },
    ],
    instructions: [
      'Fill a wine glass with ice.',
      'Pour Lillet Blanc over ice.',
      'Top with soda water.',
      'Garnish with an orange slice.',
    ],
    glassType: 'Wine',
    garnish: 'Orange slice',
    tags: ['low-abv', 'aperitivo', 'bubbly', 'easy', 'floral'],
    difficulty: 'easy',
  },

  {
    id: 'r773',
    name: 'Elderflower Spritz',
    description: 'St-Germain, prosecco, and soda — light, fragrant, and completely addictive.',
    ingredients: [
      { ingredientId: 'elderflower-liqueur', name: 'Elderflower Liqueur', amount: 1.5, unit: 'oz' },
      { ingredientId: 'prosecco', name: 'Prosecco', amount: 3, unit: 'oz' },
      { ingredientId: 'soda-water', name: 'Soda Water', amount: 1, unit: 'oz' },
    ],
    instructions: [
      'Fill a wine glass with ice.',
      'Pour elderflower liqueur over ice.',
      'Add prosecco, then a splash of soda water.',
      'Garnish with a cucumber slice and a lemon wheel.',
    ],
    glassType: 'Wine',
    garnish: 'Cucumber slice, lemon wheel',
    tags: ['low-abv', 'bubbly', 'easy', 'floral', 'light', 'spritz'],
    difficulty: 'easy',
  },

  {
    id: 'r774',
    name: 'Sherry Sour',
    description: 'Amontillado sherry with lemon and egg white — nutty, complex, and almost unfairly good.',
    ingredients: [
      { ingredientId: 'amontillado-sherry', name: 'Amontillado Sherry', amount: 2, unit: 'oz' },
      { ingredientId: 'lemon-juice', name: 'Fresh Lemon Juice', amount: 0.75, unit: 'oz' },
      { ingredientId: 'simple-syrup', name: 'Simple Syrup', amount: 0.5, unit: 'oz' },
      { ingredientId: 'egg-white', name: 'Egg White', amount: 1, unit: 'piece' },
    ],
    instructions: [
      'Dry-shake all ingredients without ice for 15 seconds.',
      'Add ice and shake hard.',
      'Double-strain into a chilled coupe.',
      'Express a lemon peel over the glass.',
    ],
    glassType: 'Coupe',
    garnish: 'Lemon peel',
    tags: ['low-abv', 'sherry', 'sour', 'shaken', 'citrus', 'silky'],
    difficulty: 'medium',
  },

  // ── Gin Variations ────────────────────────────────────────────────────────────

  {
    id: 'r775',
    name: 'Alaska',
    description: 'Gin and Yellow Chartreuse with a dash of orange bitters — crisp, herbal, uncompromising.',
    ingredients: [
      { ingredientId: 'gin', name: 'Gin', amount: 2, unit: 'oz' },
      { ingredientId: 'yellow-chartreuse', name: 'Yellow Chartreuse', amount: 0.75, unit: 'oz' },
      { ingredientId: 'orange-bitters', name: 'Orange Bitters', amount: 2, unit: 'dashes' },
    ],
    instructions: [
      'Stir all ingredients with ice until chilled.',
      'Strain into a chilled coupe.',
      'Express a lemon peel over the glass and discard.',
    ],
    glassType: 'Coupe',
    garnish: 'Lemon peel',
    tags: ['gin', 'stirred', 'spirit-forward', 'herbal', 'classic', 'chartreuse'],
    difficulty: 'easy',
  },

  {
    id: 'r776',
    name: 'Income Tax',
    description: 'A Prohibition-era Martini variant — gin, both vermouths, orange juice, and bitters.',
    ingredients: [
      { ingredientId: 'gin', name: 'Gin', amount: 1.5, unit: 'oz' },
      { ingredientId: 'sweet-vermouth', name: 'Sweet Vermouth', amount: 0.5, unit: 'oz' },
      { ingredientId: 'dry-vermouth', name: 'Dry Vermouth', amount: 0.5, unit: 'oz' },
      { ingredientId: 'orange-juice', name: 'Fresh Orange Juice', amount: 0.5, unit: 'oz' },
      { ingredientId: 'angostura-bitters', name: 'Angostura Bitters', amount: 1, unit: 'dash' },
    ],
    instructions: [
      'Shake all ingredients with ice.',
      'Strain into a chilled coupe.',
    ],
    glassType: 'Coupe',
    tags: ['gin', 'classic', 'shaken', 'citrus', 'pre-prohibition'],
    difficulty: 'easy',
  },

  {
    id: 'r777',
    name: 'Jasmine',
    description: 'Gin, Campari, Cointreau, and lemon — a modern classic that earns its place.',
    ingredients: [
      { ingredientId: 'gin', name: 'Gin', amount: 1.5, unit: 'oz' },
      { ingredientId: 'campari', name: 'Campari', amount: 0.25, unit: 'oz' },
      { ingredientId: 'triple-sec', name: 'Cointreau', amount: 0.25, unit: 'oz' },
      { ingredientId: 'lemon-juice', name: 'Fresh Lemon Juice', amount: 0.75, unit: 'oz' },
    ],
    instructions: [
      'Shake all ingredients vigorously with ice.',
      'Strain into a chilled coupe.',
      'Express a lemon peel over the glass.',
    ],
    glassType: 'Coupe',
    garnish: 'Lemon peel',
    tags: ['gin', 'modern-classic', 'shaken', 'citrus', 'bitter'],
    difficulty: 'easy',
  },

  {
    id: 'r778',
    name: 'Twentieth Century',
    description: 'Gin, Lillet Blanc, crème de cacao, and lemon — a named train, a stranger cocktail.',
    ingredients: [
      { ingredientId: 'gin', name: 'Gin', amount: 1.5, unit: 'oz' },
      { ingredientId: 'lillet-blanc', name: 'Lillet Blanc', amount: 0.75, unit: 'oz' },
      { ingredientId: 'creme-de-cacao-white', name: 'White Crème de Cacao', amount: 0.5, unit: 'oz' },
      { ingredientId: 'lemon-juice', name: 'Fresh Lemon Juice', amount: 0.75, unit: 'oz' },
    ],
    instructions: [
      'Shake all ingredients with ice.',
      'Double-strain into a chilled coupe.',
    ],
    glassType: 'Coupe',
    tags: ['gin', 'classic', 'shaken', 'citrus', 'floral', 'chocolate'],
    difficulty: 'medium',
  },

  {
    id: 'r779',
    name: 'Gin Buck',
    description: 'Gin, lemon, and ginger beer — simple template, endlessly satisfying.',
    ingredients: [
      { ingredientId: 'gin', name: 'Gin', amount: 2, unit: 'oz' },
      { ingredientId: 'lemon-juice', name: 'Fresh Lemon Juice', amount: 0.5, unit: 'oz' },
      { ingredientId: 'ginger-beer', name: 'Ginger Beer', amount: 4, unit: 'oz' },
    ],
    instructions: [
      'Fill a highball glass with ice.',
      'Add gin and lemon juice.',
      'Top with ginger beer and stir gently.',
      'Garnish with a lemon wedge.',
    ],
    glassType: 'Highball',
    garnish: 'Lemon wedge',
    tags: ['gin', 'highball', 'bubbly', 'easy', 'refreshing'],
    difficulty: 'easy',
  },

  {
    id: 'r780',
    name: 'White Lady',
    description: 'Gin, Cointreau, lemon, and egg white — the original gin sour, perfectly calibrated.',
    ingredients: [
      { ingredientId: 'gin', name: 'Gin', amount: 1.5, unit: 'oz' },
      { ingredientId: 'triple-sec', name: 'Cointreau', amount: 0.75, unit: 'oz' },
      { ingredientId: 'lemon-juice', name: 'Fresh Lemon Juice', amount: 0.75, unit: 'oz' },
      { ingredientId: 'egg-white', name: 'Egg White', amount: 1, unit: 'piece', optional: true },
    ],
    instructions: [
      'Dry-shake all ingredients without ice.',
      'Add ice and shake vigorously.',
      'Double-strain into a chilled coupe.',
    ],
    glassType: 'Coupe',
    tags: ['gin', 'classic', 'sour', 'shaken', 'citrus', 'silky'],
    difficulty: 'medium',
  },

  // ── Tequila & Mezcal ─────────────────────────────────────────────────────────

  {
    id: 'r781',
    name: 'Tequila Sour',
    description: 'Tequila, lemon, simple syrup, and egg white — the sour format suits blanco perfectly.',
    ingredients: [
      { ingredientId: 'tequila', name: 'Tequila Blanco', amount: 2, unit: 'oz' },
      { ingredientId: 'lemon-juice', name: 'Fresh Lemon Juice', amount: 0.75, unit: 'oz' },
      { ingredientId: 'simple-syrup', name: 'Simple Syrup', amount: 0.5, unit: 'oz' },
      { ingredientId: 'egg-white', name: 'Egg White', amount: 1, unit: 'piece', optional: true },
    ],
    instructions: [
      'Dry-shake all ingredients without ice.',
      'Add ice and shake hard.',
      'Double-strain into a chilled coupe.',
      'Garnish with a few dashes of Angostura on the foam.',
    ],
    glassType: 'Coupe',
    garnish: 'Bitters on foam',
    tags: ['tequila', 'sour', 'shaken', 'citrus', 'silky'],
    difficulty: 'medium',
  },

  {
    id: 'r782',
    name: 'Mezcal Sour',
    description: 'Mezcal\'s smoke marries lemon and egg white — complex on the nose, clean on the finish.',
    ingredients: [
      { ingredientId: 'mezcal', name: 'Mezcal', amount: 2, unit: 'oz' },
      { ingredientId: 'lemon-juice', name: 'Fresh Lemon Juice', amount: 0.75, unit: 'oz' },
      { ingredientId: 'agave-syrup', name: 'Agave Syrup', amount: 0.5, unit: 'oz' },
      { ingredientId: 'egg-white', name: 'Egg White', amount: 1, unit: 'piece', optional: true },
    ],
    instructions: [
      'Dry-shake all ingredients without ice.',
      'Add ice and shake vigorously.',
      'Double-strain into a chilled coupe.',
    ],
    glassType: 'Coupe',
    tags: ['mezcal', 'sour', 'shaken', 'citrus', 'smoky', 'silky'],
    difficulty: 'medium',
  },

  {
    id: 'r783',
    name: 'Batanga',
    description: 'Tequila, fresh lime, and Mexican cola with a salt rim — Don Javier\'s legendary simplicity.',
    ingredients: [
      { ingredientId: 'tequila', name: 'Tequila Blanco', amount: 2, unit: 'oz' },
      { ingredientId: 'lime-juice', name: 'Fresh Lime Juice', amount: 0.5, unit: 'oz' },
      { ingredientId: 'cola', name: 'Mexican Cola', amount: 5, unit: 'oz' },
    ],
    instructions: [
      'Salt-rim a highball glass and fill with ice.',
      'Add tequila and lime juice.',
      'Top with cola and stir with a knife.',
    ],
    glassType: 'Highball',
    garnish: 'Salt rim, lime wedge',
    tags: ['tequila', 'highball', 'bubbly', 'easy', 'salty', 'refreshing'],
    difficulty: 'easy',
  },

  {
    id: 'r784',
    name: 'Cantarito',
    description: 'Tequila with three citrus juices and grapefruit soda — the Mexican answer to everything.',
    ingredients: [
      { ingredientId: 'tequila', name: 'Tequila Blanco', amount: 2, unit: 'oz' },
      { ingredientId: 'lime-juice', name: 'Fresh Lime Juice', amount: 0.5, unit: 'oz' },
      { ingredientId: 'lemon-juice', name: 'Fresh Lemon Juice', amount: 0.5, unit: 'oz' },
      { ingredientId: 'orange-juice', name: 'Fresh Orange Juice', amount: 1, unit: 'oz' },
      { ingredientId: 'grapefruit-soda', name: 'Grapefruit Soda', amount: 4, unit: 'oz' },
    ],
    instructions: [
      'Salt-rim a clay pot or highball glass and fill with ice.',
      'Combine tequila and juices over ice.',
      'Top with grapefruit soda and stir gently.',
      'Garnish with citrus wheels.',
    ],
    glassType: 'Highball',
    garnish: 'Salt rim, citrus wheels',
    tags: ['tequila', 'highball', 'citrus', 'bubbly', 'easy', 'refreshing'],
    difficulty: 'easy',
  },

  {
    id: 'r785',
    name: 'Mezcal Spritz',
    description: 'Mezcal with Aperol and prosecco — smoke meets bitter orange, surprisingly elegant.',
    ingredients: [
      { ingredientId: 'mezcal', name: 'Mezcal', amount: 1, unit: 'oz' },
      { ingredientId: 'aperol', name: 'Aperol', amount: 1, unit: 'oz' },
      { ingredientId: 'prosecco', name: 'Prosecco', amount: 3, unit: 'oz' },
      { ingredientId: 'soda-water', name: 'Soda Water', amount: 1, unit: 'oz' },
    ],
    instructions: [
      'Fill a wine glass with ice.',
      'Combine mezcal and Aperol over ice.',
      'Top with prosecco and a splash of soda water.',
      'Garnish with an orange slice.',
    ],
    glassType: 'Wine',
    garnish: 'Orange slice',
    tags: ['mezcal', 'aperol', 'bubbly', 'smoky', 'spritz', 'aperitivo'],
    difficulty: 'easy',
  },

  // ── Rum ──────────────────────────────────────────────────────────────────────

  {
    id: 'r786',
    name: 'Rum Sour',
    description: 'White rum, lemon, simple syrup, and egg white — the sour template at its most rum-forward.',
    ingredients: [
      { ingredientId: 'rum-white', name: 'White Rum', amount: 2, unit: 'oz' },
      { ingredientId: 'lemon-juice', name: 'Fresh Lemon Juice', amount: 0.75, unit: 'oz' },
      { ingredientId: 'simple-syrup', name: 'Simple Syrup', amount: 0.5, unit: 'oz' },
      { ingredientId: 'egg-white', name: 'Egg White', amount: 1, unit: 'piece', optional: true },
    ],
    instructions: [
      'Dry-shake all ingredients without ice.',
      'Add ice and shake hard.',
      'Double-strain into a chilled coupe.',
    ],
    glassType: 'Coupe',
    tags: ['rum', 'sour', 'shaken', 'citrus', 'silky'],
    difficulty: 'medium',
  },

  {
    id: 'r787',
    name: 'El Floridita Daiquiri',
    description: 'Hemingway\'s house daiquiri — rum, grapefruit, maraschino, lime. No sugar added.',
    ingredients: [
      { ingredientId: 'rum-white', name: 'White Rum', amount: 2, unit: 'oz' },
      { ingredientId: 'grapefruit-juice', name: 'Fresh Grapefruit Juice', amount: 0.5, unit: 'oz' },
      { ingredientId: 'maraschino-liqueur', name: 'Maraschino Liqueur', amount: 0.25, unit: 'oz' },
      { ingredientId: 'lime-juice', name: 'Fresh Lime Juice', amount: 0.5, unit: 'oz' },
    ],
    instructions: [
      'Shake all ingredients vigorously with ice.',
      'Double-strain into a chilled coupe.',
    ],
    glassType: 'Coupe',
    tags: ['rum', 'classic', 'shaken', 'citrus', 'dry', 'tiki'],
    difficulty: 'easy',
  },

  {
    id: 'r788',
    name: 'Rum Punch',
    description: 'One sour, two sweet, three strong, four weak — the original bartender\'s formula.',
    ingredients: [
      { ingredientId: 'rum-aged', name: 'Aged Rum', amount: 2, unit: 'oz' },
      { ingredientId: 'lime-juice', name: 'Fresh Lime Juice', amount: 0.75, unit: 'oz' },
      { ingredientId: 'simple-syrup', name: 'Simple Syrup', amount: 0.5, unit: 'oz' },
      { ingredientId: 'grenadine', name: 'Grenadine', amount: 0.25, unit: 'oz' },
      { ingredientId: 'angostura-bitters', name: 'Angostura Bitters', amount: 2, unit: 'dashes' },
    ],
    instructions: [
      'Shake all ingredients with ice.',
      'Strain into a highball glass over fresh ice.',
      'Grate nutmeg over the top.',
    ],
    glassType: 'Highball',
    garnish: 'Freshly grated nutmeg, lime wheel',
    tags: ['rum', 'punch', 'tropical', 'shaken', 'citrus', 'easy'],
    difficulty: 'easy',
  },

  {
    id: 'r789',
    name: 'Dark Rum Flip',
    description: 'Dark rum, simple syrup, and a whole egg — rich, velvet, after-dinner serious.',
    ingredients: [
      { ingredientId: 'rum-dark', name: 'Dark Rum', amount: 2, unit: 'oz' },
      { ingredientId: 'simple-syrup', name: 'Simple Syrup', amount: 0.5, unit: 'oz' },
      { ingredientId: 'egg', name: 'Whole Egg', amount: 1, unit: 'piece' },
    ],
    instructions: [
      'Combine all ingredients in a shaker.',
      'Shake without ice for 15 seconds.',
      'Add ice and shake hard for another 15 seconds.',
      'Double-strain into a chilled coupe.',
      'Grate nutmeg over the top.',
    ],
    glassType: 'Coupe',
    garnish: 'Freshly grated nutmeg',
    tags: ['rum', 'flip', 'after-dinner', 'shaken', 'creamy', 'medium'],
    difficulty: 'medium',
  },

  {
    id: 'r790',
    name: 'Rum Old Fashioned',
    description: 'Aged rum, simple syrup, and bitters — the Old Fashioned format applied to rum with full conviction.',
    ingredients: [
      { ingredientId: 'rum-aged', name: 'Aged Rum', amount: 2, unit: 'oz' },
      { ingredientId: 'simple-syrup', name: 'Simple Syrup', amount: 0.25, unit: 'oz' },
      { ingredientId: 'angostura-bitters', name: 'Angostura Bitters', amount: 2, unit: 'dashes' },
    ],
    instructions: [
      'Combine all ingredients in a rocks glass over a large ice cube.',
      'Stir until chilled.',
      'Express an orange peel over the glass.',
    ],
    glassType: 'Rocks',
    garnish: 'Orange peel',
    tags: ['rum', 'stirred', 'spirit-forward', 'easy', 'classic'],
    difficulty: 'easy',
  },

  // ── Digestifs & Amaro ────────────────────────────────────────────────────────

  {
    id: 'r791',
    name: 'Fernet con Coca',
    description: 'Fernet-Branca and cola — Argentina\'s national cocktail. It requires no explanation and no apology.',
    ingredients: [
      { ingredientId: 'fernet-branca', name: 'Fernet-Branca', amount: 2, unit: 'oz' },
      { ingredientId: 'cola', name: 'Cola', amount: 4, unit: 'oz' },
    ],
    instructions: [
      'Fill a highball glass with ice.',
      'Pour Fernet-Branca over ice.',
      'Top with cola and stir gently.',
    ],
    glassType: 'Highball',
    tags: ['digestif', 'amaro', 'fernet', 'highball', 'bubbly', 'easy', 'bitter'],
    difficulty: 'easy',
  },

  {
    id: 'r792',
    name: 'Amaro Sour',
    description: 'Amaro Nonino, lemon juice, and egg white — bitter, bright, and completely convincing.',
    ingredients: [
      { ingredientId: 'amaro-nonino', name: 'Amaro Nonino', amount: 2, unit: 'oz' },
      { ingredientId: 'lemon-juice', name: 'Fresh Lemon Juice', amount: 0.75, unit: 'oz' },
      { ingredientId: 'simple-syrup', name: 'Simple Syrup', amount: 0.25, unit: 'oz' },
      { ingredientId: 'egg-white', name: 'Egg White', amount: 1, unit: 'piece', optional: true },
    ],
    instructions: [
      'Dry-shake all ingredients without ice.',
      'Add ice and shake hard.',
      'Double-strain into a chilled coupe.',
    ],
    glassType: 'Coupe',
    tags: ['amaro', 'digestif', 'sour', 'shaken', 'citrus', 'bitter', 'after-dinner'],
    difficulty: 'medium',
  },

  {
    id: 'r793',
    name: 'Averna Sour',
    description: 'Amaro Averna\'s dark caramel and citrus notes make it the sour format\'s sleeper hit.',
    ingredients: [
      { ingredientId: 'amaro-averna', name: 'Amaro Averna', amount: 2, unit: 'oz' },
      { ingredientId: 'lemon-juice', name: 'Fresh Lemon Juice', amount: 0.75, unit: 'oz' },
      { ingredientId: 'simple-syrup', name: 'Simple Syrup', amount: 0.25, unit: 'oz' },
      { ingredientId: 'egg-white', name: 'Egg White', amount: 1, unit: 'piece', optional: true },
    ],
    instructions: [
      'Dry-shake all ingredients without ice.',
      'Add ice and shake hard.',
      'Double-strain into a chilled coupe.',
    ],
    glassType: 'Coupe',
    tags: ['amaro', 'digestif', 'sour', 'shaken', 'citrus', 'bitter', 'after-dinner'],
    difficulty: 'medium',
  },

  {
    id: 'r794',
    name: 'Whiskey Sour (Rye)',
    description: 'Rye whiskey, lemon, simple syrup, and egg white — the Sour format at its most disciplined.',
    ingredients: [
      { ingredientId: 'rye-whiskey', name: 'Rye Whiskey', amount: 2, unit: 'oz' },
      { ingredientId: 'lemon-juice', name: 'Fresh Lemon Juice', amount: 0.75, unit: 'oz' },
      { ingredientId: 'simple-syrup', name: 'Simple Syrup', amount: 0.5, unit: 'oz' },
      { ingredientId: 'egg-white', name: 'Egg White', amount: 1, unit: 'piece', optional: true },
    ],
    instructions: [
      'Dry-shake all ingredients without ice.',
      'Add ice and shake vigorously.',
      'Double-strain into a chilled coupe or over ice in a rocks glass.',
    ],
    glassType: 'Coupe',
    garnish: 'Maraschino cherry, orange peel',
    tags: ['whiskey', 'rye', 'sour', 'shaken', 'citrus', 'silky'],
    difficulty: 'medium',
  },

  {
    id: 'r795',
    name: 'Italian Greyhound',
    description: 'Campari and grapefruit juice — bitter, pink, and completely Italian without trying.',
    ingredients: [
      { ingredientId: 'campari', name: 'Campari', amount: 1.5, unit: 'oz' },
      { ingredientId: 'grapefruit-juice', name: 'Fresh Grapefruit Juice', amount: 3, unit: 'oz' },
      { ingredientId: 'soda-water', name: 'Soda Water', amount: 1, unit: 'oz' },
    ],
    instructions: [
      'Fill a highball glass with ice.',
      'Combine Campari and grapefruit juice over ice.',
      'Top with soda water and stir gently.',
      'Garnish with a grapefruit wedge.',
    ],
    glassType: 'Highball',
    garnish: 'Grapefruit wedge',
    tags: ['campari', 'aperitivo', 'citrus', 'bubbly', 'easy', 'bitter', 'low-abv'],
    difficulty: 'easy',
  },

  // ── Vodka ────────────────────────────────────────────────────────────────────

  {
    id: 'r796',
    name: 'Vodka Buck',
    description: 'Vodka, lime, and ginger beer — cleaner than the Mule, same satisfaction.',
    ingredients: [
      { ingredientId: 'vodka', name: 'Vodka', amount: 2, unit: 'oz' },
      { ingredientId: 'lime-juice', name: 'Fresh Lime Juice', amount: 0.5, unit: 'oz' },
      { ingredientId: 'ginger-beer', name: 'Ginger Beer', amount: 4, unit: 'oz' },
    ],
    instructions: [
      'Fill a highball glass with ice.',
      'Add vodka and lime juice.',
      'Top with ginger beer and stir gently.',
      'Garnish with a lime wedge.',
    ],
    glassType: 'Highball',
    garnish: 'Lime wedge',
    tags: ['vodka', 'highball', 'bubbly', 'easy', 'refreshing'],
    difficulty: 'easy',
  },

  {
    id: 'r797',
    name: 'Espresso Tonic',
    description: 'Cold espresso floated over tonic — a cocktail for people who insist on caffeine.',
    ingredients: [
      { ingredientId: 'espresso', name: 'Cold Espresso', amount: 1, unit: 'oz' },
      { ingredientId: 'tonic-water', name: 'Tonic Water', amount: 5, unit: 'oz' },
      { ingredientId: 'vodka', name: 'Vodka', amount: 1, unit: 'oz' },
    ],
    instructions: [
      'Fill a highball glass with ice.',
      'Pour tonic water and vodka over ice.',
      'Float cold espresso on top by pouring slowly over the back of a spoon.',
    ],
    glassType: 'Highball',
    tags: ['vodka', 'coffee', 'bubbly', 'easy', 'caffeinated'],
    difficulty: 'easy',
  },

  {
    id: 'r798',
    name: 'Lemon Drop',
    description: 'Vodka, Cointreau, and lemon with a sugar rim — unfashionable in name, impeccable in form.',
    ingredients: [
      { ingredientId: 'vodka', name: 'Vodka', amount: 2, unit: 'oz' },
      { ingredientId: 'triple-sec', name: 'Cointreau', amount: 0.5, unit: 'oz' },
      { ingredientId: 'lemon-juice', name: 'Fresh Lemon Juice', amount: 0.75, unit: 'oz' },
      { ingredientId: 'simple-syrup', name: 'Simple Syrup', amount: 0.25, unit: 'oz' },
    ],
    instructions: [
      'Sugar-rim a chilled coupe.',
      'Shake all ingredients with ice.',
      'Double-strain into the prepared glass.',
    ],
    glassType: 'Coupe',
    garnish: 'Sugar rim, lemon twist',
    tags: ['vodka', 'classic', 'sour', 'shaken', 'citrus', 'easy'],
    difficulty: 'easy',
  },

  {
    id: 'r799',
    name: 'Harvey Wallbanger',
    description: 'Vodka, orange juice, and a Galliano float — the 1970s\'s greatest unironic achievement.',
    ingredients: [
      { ingredientId: 'vodka', name: 'Vodka', amount: 1.5, unit: 'oz' },
      { ingredientId: 'orange-juice', name: 'Fresh Orange Juice', amount: 4, unit: 'oz' },
      { ingredientId: 'galliano', name: 'Galliano', amount: 0.5, unit: 'oz' },
    ],
    instructions: [
      'Fill a highball glass with ice.',
      'Add vodka and orange juice.',
      'Float Galliano on top by pouring over the back of a spoon.',
    ],
    glassType: 'Highball',
    garnish: 'Orange slice, maraschino cherry',
    tags: ['vodka', 'classic', 'highball', 'easy', 'citrus', 'retro'],
    difficulty: 'easy',
  },

  {
    id: 'r800',
    name: 'Polish Mule',
    description: 'Vodka, lemon, elderflower liqueur, and ginger beer — a Mule that went to finishing school.',
    ingredients: [
      { ingredientId: 'vodka', name: 'Vodka', amount: 1.5, unit: 'oz' },
      { ingredientId: 'elderflower-liqueur', name: 'Elderflower Liqueur', amount: 0.5, unit: 'oz' },
      { ingredientId: 'lemon-juice', name: 'Fresh Lemon Juice', amount: 0.5, unit: 'oz' },
      { ingredientId: 'ginger-beer', name: 'Ginger Beer', amount: 4, unit: 'oz' },
    ],
    instructions: [
      'Fill a copper mug or highball with ice.',
      'Add vodka, elderflower liqueur, and lemon juice.',
      'Top with ginger beer and stir gently.',
      'Garnish with a cucumber slice and lemon wheel.',
    ],
    glassType: 'Copper Mug',
    garnish: 'Cucumber slice, lemon wheel',
    tags: ['vodka', 'highball', 'bubbly', 'easy', 'floral', 'refreshing'],
    difficulty: 'easy',
  },

  // ── Brunch ────────────────────────────────────────────────────────────────────

  {
    id: 'r801',
    name: "Buck's Fizz",
    description: 'Champagne and orange juice — the Mimosa\'s older, drier British cousin. More Champagne, less juice.',
    ingredients: [
      { ingredientId: 'champagne', name: 'Champagne', amount: 4, unit: 'oz' },
      { ingredientId: 'orange-juice', name: 'Fresh Orange Juice', amount: 2, unit: 'oz' },
    ],
    instructions: [
      'Pour orange juice into a chilled flute.',
      'Top slowly with Champagne.',
      'Do not stir.',
    ],
    glassType: 'Flute',
    tags: ['champagne', 'bubbly', 'brunch', 'easy', 'citrus', 'low-abv'],
    difficulty: 'easy',
  },

  {
    id: 'r802',
    name: 'Bloody Maria',
    description: 'Tequila replaces vodka in the Bloody Mary — and suddenly it makes more sense.',
    ingredients: [
      { ingredientId: 'tequila', name: 'Tequila Blanco', amount: 2, unit: 'oz' },
      { ingredientId: 'tomato-juice', name: 'Tomato Juice', amount: 4, unit: 'oz' },
      { ingredientId: 'lime-juice', name: 'Fresh Lime Juice', amount: 0.5, unit: 'oz' },
      { ingredientId: 'hot-sauce', name: 'Hot Sauce', amount: 3, unit: 'dashes' },
      { ingredientId: 'worcestershire', name: 'Worcestershire Sauce', amount: 2, unit: 'dashes' },
      { ingredientId: 'celery-salt', name: 'Celery Salt', amount: 1, unit: 'pinch' },
    ],
    instructions: [
      'Rim a highball glass with celery salt.',
      'Fill with ice and combine all ingredients.',
      'Roll between two glasses to mix.',
      'Garnish with celery, lime, and jalapeño.',
    ],
    glassType: 'Highball',
    garnish: 'Celery stalk, lime wheel, jalapeño',
    tags: ['tequila', 'brunch', 'savory', 'spicy', 'easy', 'tomato'],
    difficulty: 'easy',
  },

  {
    id: 'r803',
    name: 'Red Snapper',
    description: 'Gin in a Bloody Mary — the original recipe before vodka took over. More herbaceous, more interesting.',
    ingredients: [
      { ingredientId: 'gin', name: 'Gin', amount: 2, unit: 'oz' },
      { ingredientId: 'tomato-juice', name: 'Tomato Juice', amount: 4, unit: 'oz' },
      { ingredientId: 'lemon-juice', name: 'Fresh Lemon Juice', amount: 0.5, unit: 'oz' },
      { ingredientId: 'hot-sauce', name: 'Hot Sauce', amount: 3, unit: 'dashes' },
      { ingredientId: 'worcestershire', name: 'Worcestershire Sauce', amount: 2, unit: 'dashes' },
      { ingredientId: 'celery-salt', name: 'Celery Salt', amount: 1, unit: 'pinch' },
    ],
    instructions: [
      'Rim a highball glass with celery salt.',
      'Fill with ice and combine all ingredients.',
      'Roll between two glasses to mix.',
      'Garnish with a celery stalk and lemon wheel.',
    ],
    glassType: 'Highball',
    garnish: 'Celery stalk, lemon wheel',
    tags: ['gin', 'brunch', 'savory', 'spicy', 'easy', 'tomato'],
    difficulty: 'easy',
  },

  {
    id: 'r804',
    name: 'Prosecco Sangria',
    description: 'Prosecco, white wine, elderflower, and citrus — a summer pitcher that scales gracefully.',
    ingredients: [
      { ingredientId: 'prosecco', name: 'Prosecco', amount: 4, unit: 'oz' },
      { ingredientId: 'elderflower-liqueur', name: 'Elderflower Liqueur', amount: 0.75, unit: 'oz' },
      { ingredientId: 'lime-juice', name: 'Fresh Lime Juice', amount: 0.5, unit: 'oz' },
      { ingredientId: 'orange-juice', name: 'Fresh Orange Juice', amount: 1, unit: 'oz' },
    ],
    instructions: [
      'Combine elderflower liqueur and juices in a wine glass over ice.',
      'Top with Prosecco and stir gently.',
      'Garnish with fresh fruit and mint.',
    ],
    glassType: 'Wine',
    garnish: 'Fresh fruit, mint',
    tags: ['prosecco', 'bubbly', 'brunch', 'easy', 'fruity', 'floral'],
    difficulty: 'easy',
  },

  {
    id: 'r805',
    name: 'Limoncello Spritz',
    description: 'Limoncello, prosecco, and soda — easy, Italian, and undeniably cheerful.',
    ingredients: [
      { ingredientId: 'elderflower-cordial', name: 'Limoncello', amount: 1.5, unit: 'oz' },
      { ingredientId: 'prosecco', name: 'Prosecco', amount: 3, unit: 'oz' },
      { ingredientId: 'soda-water', name: 'Soda Water', amount: 1, unit: 'oz' },
    ],
    instructions: [
      'Fill a wine glass with ice.',
      'Add limoncello over ice.',
      'Top with prosecco and a splash of soda.',
      'Garnish with a lemon wheel.',
    ],
    glassType: 'Wine',
    garnish: 'Lemon wheel',
    tags: ['brunch', 'bubbly', 'easy', 'citrus', 'spritz', 'low-abv'],
    difficulty: 'easy',
  },

  // ── Irish ─────────────────────────────────────────────────────────────────────

  {
    id: 'r806',
    name: 'Irish Coffee',
    description: 'Irish whiskey, coffee, brown sugar, and whipped cream — the airport version is a crime. This isn\'t.',
    ingredients: [
      { ingredientId: 'irish-whiskey', name: 'Irish Whiskey', amount: 1.5, unit: 'oz' },
      { ingredientId: 'coffee', name: 'Hot Coffee', amount: 4, unit: 'oz' },
      { ingredientId: 'simple-syrup', name: 'Brown Sugar Syrup', amount: 0.5, unit: 'oz' },
      { ingredientId: 'heavy-cream', name: 'Lightly Whipped Cream', amount: 1, unit: 'oz' },
    ],
    instructions: [
      'Pre-warm a stemmed glass with hot water.',
      'Add whiskey and sugar syrup.',
      'Pour in hot coffee and stir.',
      'Float lightly whipped cream on top by pouring over the back of a spoon.',
      'Do not stir — drink through the cream.',
    ],
    glassType: 'Stemmed',
    tags: ['irish-whiskey', 'whiskey', 'coffee', 'hot', 'after-dinner', 'easy', 'creamy'],
    difficulty: 'easy',
  },

  {
    id: 'r807',
    name: 'Irish Buck',
    description: 'Irish whiskey, lime, and ginger beer — gentler than the Moscow Mule but just as refreshing.',
    ingredients: [
      { ingredientId: 'irish-whiskey', name: 'Irish Whiskey', amount: 2, unit: 'oz' },
      { ingredientId: 'lime-juice', name: 'Fresh Lime Juice', amount: 0.5, unit: 'oz' },
      { ingredientId: 'ginger-beer', name: 'Ginger Beer', amount: 4, unit: 'oz' },
    ],
    instructions: [
      'Fill a highball glass with ice.',
      'Add whiskey and lime juice.',
      'Top with ginger beer and stir gently.',
      'Garnish with a lime wedge.',
    ],
    glassType: 'Highball',
    garnish: 'Lime wedge',
    tags: ['irish-whiskey', 'whiskey', 'highball', 'bubbly', 'easy', 'refreshing'],
    difficulty: 'easy',
  },

  // ── Wine & Sherry ─────────────────────────────────────────────────────────────

  {
    id: 'r808',
    name: 'Fino & Tonic',
    description: 'Fino sherry and tonic — Spain\'s answer to the Gin & Tonic, lower ABV and arguably better.',
    ingredients: [
      { ingredientId: 'dry-sherry', name: 'Fino Sherry', amount: 2, unit: 'oz' },
      { ingredientId: 'tonic-water', name: 'Tonic Water', amount: 4, unit: 'oz' },
    ],
    instructions: [
      'Fill a large wine glass with ice.',
      'Pour fino sherry over ice.',
      'Top with tonic water.',
      'Garnish with a lemon twist and green olive.',
    ],
    glassType: 'Wine',
    garnish: 'Lemon twist, green olive',
    tags: ['sherry', 'low-abv', 'aperitivo', 'bubbly', 'easy', 'dry', 'savory'],
    difficulty: 'easy',
  },

  {
    id: 'r809',
    name: 'Rebujito',
    description: 'Manzanilla sherry and lemon-lime soda — Seville\'s festival drink. The Spanish have this figured out.',
    ingredients: [
      { ingredientId: 'dry-sherry', name: 'Manzanilla Sherry', amount: 3, unit: 'oz' },
      { ingredientId: 'sprite', name: 'Lemon-Lime Soda', amount: 4, unit: 'oz' },
    ],
    instructions: [
      'Fill a highball glass with ice.',
      'Pour sherry over ice.',
      'Top with lemon-lime soda.',
      'Garnish with fresh mint.',
    ],
    glassType: 'Highball',
    garnish: 'Fresh mint',
    tags: ['sherry', 'low-abv', 'bubbly', 'easy', 'refreshing'],
    difficulty: 'easy',
  },

  {
    id: 'r810',
    name: 'Adonis',
    description: 'Fino sherry and sweet vermouth with orange bitters — the aperitif format at its oldest and finest.',
    ingredients: [
      { ingredientId: 'dry-sherry', name: 'Fino or Amontillado Sherry', amount: 1.5, unit: 'oz' },
      { ingredientId: 'sweet-vermouth', name: 'Sweet Vermouth', amount: 1.5, unit: 'oz' },
      { ingredientId: 'orange-bitters', name: 'Orange Bitters', amount: 2, unit: 'dashes' },
    ],
    instructions: [
      'Stir all ingredients with ice until well chilled.',
      'Strain into a chilled coupe.',
      'Express an orange peel over the glass.',
    ],
    glassType: 'Coupe',
    garnish: 'Orange peel',
    tags: ['sherry', 'low-abv', 'aperitivo', 'stirred', 'classic'],
    difficulty: 'easy',
  },

  {
    id: 'r811',
    name: 'Kir',
    description: 'White wine and crème de cassis — one recipe, two ingredients, no drama. That is the Kir.',
    ingredients: [
      { ingredientId: 'creme-de-cassis', name: 'Crème de Cassis', amount: 0.5, unit: 'oz' },
    ],
    instructions: [
      'Pour crème de cassis into a wine glass.',
      'Top slowly with chilled dry white wine.',
      'Do not stir.',
    ],
    glassType: 'Wine',
    tags: ['low-abv', 'aperitivo', 'wine', 'easy', 'fruity', 'french'],
    difficulty: 'easy',
  },

  {
    id: 'r812',
    name: 'Spritz al Bitter',
    description: 'Campari, prosecco, and soda — the original Italian formula, before Aperol made it famous.',
    ingredients: [
      { ingredientId: 'campari', name: 'Campari', amount: 1.5, unit: 'oz' },
      { ingredientId: 'prosecco', name: 'Prosecco', amount: 3, unit: 'oz' },
      { ingredientId: 'soda-water', name: 'Soda Water', amount: 1, unit: 'oz' },
    ],
    instructions: [
      'Fill a large wine glass with ice.',
      'Add Campari over ice.',
      'Top with prosecco and a splash of soda water.',
      'Garnish with an orange slice and a green olive.',
    ],
    glassType: 'Wine',
    garnish: 'Orange slice, green olive',
    tags: ['campari', 'aperitivo', 'bubbly', 'easy', 'bitter', 'spritz', 'low-abv'],
    difficulty: 'easy',
  },

  // ── Bourbon Variations ───────────────────────────────────────────────────────

  {
    id: 'r813',
    name: 'Bourbon Buck',
    description: 'Bourbon, lemon, and ginger beer — the classic Buck formula applied to whiskey.',
    ingredients: [
      { ingredientId: 'bourbon', name: 'Bourbon', amount: 2, unit: 'oz' },
      { ingredientId: 'lemon-juice', name: 'Fresh Lemon Juice', amount: 0.5, unit: 'oz' },
      { ingredientId: 'ginger-beer', name: 'Ginger Beer', amount: 4, unit: 'oz' },
    ],
    instructions: [
      'Fill a highball glass with ice.',
      'Add bourbon and lemon juice.',
      'Top with ginger beer and stir gently.',
      'Garnish with a lemon wedge.',
    ],
    glassType: 'Highball',
    garnish: 'Lemon wedge',
    tags: ['bourbon', 'whiskey', 'highball', 'bubbly', 'easy', 'refreshing'],
    difficulty: 'easy',
  },

  {
    id: 'r814',
    name: 'Bourbon Smash',
    description: 'Bourbon muddled with lemon and mint, topped with soda — ice-cold and completely summer.',
    ingredients: [
      { ingredientId: 'bourbon', name: 'Bourbon', amount: 2, unit: 'oz' },
      { ingredientId: 'lemon-juice', name: 'Fresh Lemon Juice', amount: 0.75, unit: 'oz' },
      { ingredientId: 'simple-syrup', name: 'Simple Syrup', amount: 0.5, unit: 'oz' },
      { ingredientId: 'soda-water', name: 'Soda Water', amount: 2, unit: 'oz' },
    ],
    instructions: [
      'Muddle lemon wedges and fresh mint with simple syrup in a shaker.',
      'Add bourbon and ice.',
      'Shake briefly and pour into a rocks glass.',
      'Top with soda water.',
      'Garnish generously with mint.',
    ],
    glassType: 'Rocks',
    garnish: 'Fresh mint, lemon wheel',
    tags: ['bourbon', 'whiskey', 'smash', 'shaken', 'citrus', 'herbal', 'easy'],
    difficulty: 'easy',
  },

  {
    id: 'r815',
    name: 'Boulevardier (Rye)',
    description: 'Boulevardier built with rye instead of bourbon — more peppery, more New York.',
    ingredients: [
      { ingredientId: 'rye-whiskey', name: 'Rye Whiskey', amount: 1.5, unit: 'oz' },
      { ingredientId: 'campari', name: 'Campari', amount: 0.75, unit: 'oz' },
      { ingredientId: 'sweet-vermouth', name: 'Sweet Vermouth', amount: 0.75, unit: 'oz' },
    ],
    instructions: [
      'Stir all ingredients with ice until well chilled.',
      'Strain into a chilled coupe or over a large ice cube in a rocks glass.',
      'Express an orange peel over the glass.',
    ],
    glassType: 'Coupe',
    garnish: 'Orange peel',
    tags: ['whiskey', 'rye', 'stirred', 'spirit-forward', 'bitter', 'classic'],
    difficulty: 'easy',
  },

  {
    id: 'r816',
    name: 'Presbyterian',
    description: 'Whiskey split evenly between ginger ale and soda — easier than it sounds, better than you expect.',
    ingredients: [
      { ingredientId: 'bourbon', name: 'Bourbon', amount: 2, unit: 'oz' },
      { ingredientId: 'ginger-ale', name: 'Ginger Ale', amount: 3, unit: 'oz' },
      { ingredientId: 'soda-water', name: 'Soda Water', amount: 2, unit: 'oz' },
    ],
    instructions: [
      'Fill a highball glass with ice.',
      'Add bourbon.',
      'Top with ginger ale and soda water.',
      'Stir gently and garnish with a lemon wedge.',
    ],
    glassType: 'Highball',
    garnish: 'Lemon wedge',
    tags: ['bourbon', 'whiskey', 'highball', 'bubbly', 'easy'],
    difficulty: 'easy',
  },

  // ── Coffee & Espresso ────────────────────────────────────────────────────────

  {
    id: 'r817',
    name: 'Kahlúa & Cream',
    description: 'Coffee liqueur and heavy cream over ice — simple, satisfying, no explanation needed.',
    ingredients: [
      { ingredientId: 'coffee-liqueur', name: 'Coffee Liqueur', amount: 2, unit: 'oz' },
      { ingredientId: 'heavy-cream', name: 'Heavy Cream', amount: 2, unit: 'oz' },
    ],
    instructions: [
      'Fill a rocks glass with ice.',
      'Pour coffee liqueur over ice.',
      'Float cream on top by pouring over the back of a spoon.',
    ],
    glassType: 'Rocks',
    tags: ['coffee', 'after-dinner', 'easy', 'creamy', 'dessert'],
    difficulty: 'easy',
  },

  {
    id: 'r818',
    name: 'Revolver',
    description: 'Bourbon, coffee liqueur, and orange bitters — stirred spirit-forward and deeply satisfying.',
    ingredients: [
      { ingredientId: 'bourbon', name: 'Bourbon', amount: 2, unit: 'oz' },
      { ingredientId: 'coffee-liqueur', name: 'Coffee Liqueur', amount: 0.5, unit: 'oz' },
      { ingredientId: 'orange-bitters', name: 'Orange Bitters', amount: 2, unit: 'dashes' },
    ],
    instructions: [
      'Stir all ingredients with ice until chilled.',
      'Strain into a chilled coupe.',
      'Express an orange peel over the glass.',
    ],
    glassType: 'Coupe',
    garnish: 'Orange peel',
    tags: ['bourbon', 'whiskey', 'coffee', 'stirred', 'spirit-forward', 'modern-classic'],
    difficulty: 'easy',
  },

  {
    id: 'r819',
    name: 'Espresso Martini (Vodka)',
    description: 'Vodka, coffee liqueur, and fresh espresso shaken hard — the one everyone orders and no one apologizes for.',
    ingredients: [
      { ingredientId: 'vodka', name: 'Vodka', amount: 1.5, unit: 'oz' },
      { ingredientId: 'coffee-liqueur', name: 'Coffee Liqueur', amount: 0.75, unit: 'oz' },
      { ingredientId: 'espresso', name: 'Fresh Espresso', amount: 1, unit: 'oz' },
      { ingredientId: 'simple-syrup', name: 'Simple Syrup', amount: 0.25, unit: 'oz' },
    ],
    instructions: [
      'Chill a martini glass.',
      'Shake all ingredients very hard with ice for 15 seconds.',
      'Double-strain into the chilled glass.',
      'Three coffee beans on the foam.',
    ],
    glassType: 'Martini',
    garnish: 'Three coffee beans',
    tags: ['vodka', 'coffee', 'shaken', 'modern-classic', 'caffeinated', 'easy'],
    difficulty: 'easy',
  },

  {
    id: 'r820',
    name: 'Amaretto Coffee',
    description: 'Amaretto and hot coffee with whipped cream — the Italian answer to Irish Coffee.',
    ingredients: [
      { ingredientId: 'amaretto', name: 'Amaretto', amount: 1.5, unit: 'oz' },
      { ingredientId: 'coffee', name: 'Hot Coffee', amount: 4, unit: 'oz' },
      { ingredientId: 'heavy-cream', name: 'Lightly Whipped Cream', amount: 1, unit: 'oz' },
    ],
    instructions: [
      'Pre-warm a stemmed glass.',
      'Add amaretto.',
      'Pour in hot coffee and stir.',
      'Float whipped cream on top.',
    ],
    glassType: 'Stemmed',
    tags: ['amaretto', 'coffee', 'hot', 'after-dinner', 'easy', 'creamy'],
    difficulty: 'easy',
  },

  // ── Gin Sour Variations ──────────────────────────────────────────────────────

  {
    id: 'r821',
    name: 'Tom Collins',
    description: 'Gin, lemon, simple syrup, and soda — the oldest highball format and still the best argument for it.',
    ingredients: [
      { ingredientId: 'gin', name: 'Gin', amount: 2, unit: 'oz' },
      { ingredientId: 'lemon-juice', name: 'Fresh Lemon Juice', amount: 1, unit: 'oz' },
      { ingredientId: 'simple-syrup', name: 'Simple Syrup', amount: 0.5, unit: 'oz' },
      { ingredientId: 'soda-water', name: 'Soda Water', amount: 3, unit: 'oz' },
    ],
    instructions: [
      'Shake gin, lemon juice, and simple syrup with ice.',
      'Strain into a Collins glass over ice.',
      'Top with soda water.',
      'Garnish with a lemon wheel and maraschino cherry.',
    ],
    glassType: 'Collins',
    garnish: 'Lemon wheel, maraschino cherry',
    tags: ['gin', 'highball', 'citrus', 'bubbly', 'easy', 'classic'],
    difficulty: 'easy',
  },

  {
    id: 'r822',
    name: 'Ramos Gin Fizz',
    description: 'Gin, citrus, cream, egg white, and orange flower water — the drink that takes 12 minutes to shake properly.',
    ingredients: [
      { ingredientId: 'gin', name: 'Gin', amount: 2, unit: 'oz' },
      { ingredientId: 'lemon-juice', name: 'Fresh Lemon Juice', amount: 0.5, unit: 'oz' },
      { ingredientId: 'lime-juice', name: 'Fresh Lime Juice', amount: 0.5, unit: 'oz' },
      { ingredientId: 'simple-syrup', name: 'Simple Syrup', amount: 0.75, unit: 'oz' },
      { ingredientId: 'heavy-cream', name: 'Heavy Cream', amount: 1, unit: 'oz' },
      { ingredientId: 'egg-white', name: 'Egg White', amount: 1, unit: 'piece' },
      { ingredientId: 'orange-flower-water', name: 'Orange Flower Water', amount: 3, unit: 'dashes' },
      { ingredientId: 'soda-water', name: 'Soda Water', amount: 2, unit: 'oz' },
    ],
    instructions: [
      'Combine everything except soda in a shaker without ice.',
      'Shake vigorously for 2 full minutes.',
      'Add ice and shake for another minute.',
      'Strain into a chilled highball glass.',
      'Slowly pour soda water through the back of a spoon to create a rising head.',
    ],
    glassType: 'Highball',
    tags: ['gin', 'new-orleans', 'classic', 'shaken', 'creamy', 'fizz', 'hard'],
    difficulty: 'hard',
  },

  {
    id: 'r823',
    name: 'Singapore Sling',
    description: 'Gin, Cherry Heering, Bénédictine, pineapple, lime, and bitters — sprawling and worth the effort.',
    ingredients: [
      { ingredientId: 'gin', name: 'Gin', amount: 1.5, unit: 'oz' },
      { ingredientId: 'cherry-liqueur', name: 'Cherry Heering', amount: 0.5, unit: 'oz' },
      { ingredientId: 'benedictine', name: 'Bénédictine', amount: 0.25, unit: 'oz' },
      { ingredientId: 'triple-sec', name: 'Cointreau', amount: 0.25, unit: 'oz' },
      { ingredientId: 'pineapple-juice', name: 'Pineapple Juice', amount: 2, unit: 'oz' },
      { ingredientId: 'lime-juice', name: 'Fresh Lime Juice', amount: 0.5, unit: 'oz' },
      { ingredientId: 'grenadine', name: 'Grenadine', amount: 0.25, unit: 'oz' },
      { ingredientId: 'angostura-bitters', name: 'Angostura Bitters', amount: 1, unit: 'dash' },
    ],
    instructions: [
      'Shake all ingredients with ice.',
      'Strain into a Collins glass over ice.',
      'Garnish with a pineapple slice and maraschino cherry.',
    ],
    glassType: 'Collins',
    garnish: 'Pineapple slice, maraschino cherry',
    tags: ['gin', 'classic', 'shaken', 'tropical', 'fruity', 'medium'],
    difficulty: 'medium',
  },

  // ── Flips & Eggnogs ──────────────────────────────────────────────────────────

  {
    id: 'r824',
    name: 'Bourbon Eggnog',
    description: 'Bourbon, egg, sugar, and nutmeg — the original American holiday drink, made properly.',
    ingredients: [
      { ingredientId: 'bourbon', name: 'Bourbon', amount: 2, unit: 'oz' },
      { ingredientId: 'egg', name: 'Whole Egg', amount: 1, unit: 'piece' },
      { ingredientId: 'simple-syrup', name: 'Simple Syrup', amount: 0.5, unit: 'oz' },
      { ingredientId: 'heavy-cream', name: 'Heavy Cream', amount: 1, unit: 'oz' },
    ],
    instructions: [
      'Combine all ingredients in a shaker without ice.',
      'Shake vigorously for 20 seconds.',
      'Add ice and shake again.',
      'Strain into a chilled rocks glass.',
      'Grate fresh nutmeg over the top.',
    ],
    glassType: 'Rocks',
    garnish: 'Freshly grated nutmeg',
    tags: ['bourbon', 'whiskey', 'flip', 'after-dinner', 'holiday', 'creamy', 'medium'],
    difficulty: 'medium',
  },

  {
    id: 'r825',
    name: 'Cognac Flip',
    description: 'Cognac, whole egg, and simple syrup — the ancestor of the eggnog, dressed for dinner.',
    ingredients: [
      { ingredientId: 'cognac', name: 'Cognac', amount: 2, unit: 'oz' },
      { ingredientId: 'simple-syrup', name: 'Simple Syrup', amount: 0.5, unit: 'oz' },
      { ingredientId: 'egg', name: 'Whole Egg', amount: 1, unit: 'piece' },
    ],
    instructions: [
      'Combine all ingredients in a shaker without ice.',
      'Shake without ice for 15 seconds.',
      'Add ice and shake hard for another 15 seconds.',
      'Double-strain into a chilled coupe.',
      'Grate nutmeg over the top.',
    ],
    glassType: 'Coupe',
    garnish: 'Freshly grated nutmeg',
    tags: ['cognac', 'brandy', 'flip', 'after-dinner', 'shaken', 'creamy', 'medium'],
    difficulty: 'medium',
  },

  // ── Cachaca & Pisco ──────────────────────────────────────────────────────────

  {
    id: 'r826',
    name: 'Chilcano',
    description: 'Pisco, lime, ginger ale, and bitters — Peru\'s everyday aperitif and the country\'s best-kept secret.',
    ingredients: [
      { ingredientId: 'pisco', name: 'Pisco', amount: 2, unit: 'oz' },
      { ingredientId: 'lime-juice', name: 'Fresh Lime Juice', amount: 0.5, unit: 'oz' },
      { ingredientId: 'ginger-ale', name: 'Ginger Ale', amount: 4, unit: 'oz' },
      { ingredientId: 'angostura-bitters', name: 'Angostura Bitters', amount: 2, unit: 'dashes' },
    ],
    instructions: [
      'Fill a highball glass with ice.',
      'Add pisco and lime juice.',
      'Top with ginger ale and stir gently.',
      'Add dashes of bitters and garnish with a lime wheel.',
    ],
    glassType: 'Highball',
    garnish: 'Lime wheel',
    tags: ['pisco', 'highball', 'bubbly', 'easy', 'citrus', 'refreshing'],
    difficulty: 'easy',
  },

  {
    id: 'r827',
    name: 'Batida',
    description: 'Cachaça blended with fresh fruit — Brazil\'s answer to the frozen Daiquiri, less polished and more honest.',
    ingredients: [
      { ingredientId: 'cachaca', name: 'Cachaça', amount: 2, unit: 'oz' },
      { ingredientId: 'lime-juice', name: 'Fresh Lime Juice', amount: 1, unit: 'oz' },
      { ingredientId: 'simple-syrup', name: 'Simple Syrup', amount: 0.75, unit: 'oz' },
      { ingredientId: 'coconut-cream', name: 'Coconut Cream', amount: 1, unit: 'oz' },
    ],
    instructions: [
      'Blend all ingredients with a cup of crushed ice.',
      'Pour into a rocks or highball glass.',
      'Garnish with a lime wheel and shredded coconut.',
    ],
    glassType: 'Rocks',
    garnish: 'Lime wheel, shredded coconut',
    tags: ['cachaca', 'tropical', 'blended', 'fruity', 'medium', 'creamy'],
    difficulty: 'medium',
  },

  // ── Sambuca & Anise ──────────────────────────────────────────────────────────

  {
    id: 'r828',
    name: 'Caffe Corretto',
    description: 'Sambuca and espresso — the Italian\'s three-second dessert course.',
    ingredients: [
      { ingredientId: 'sambuca', name: 'Sambuca', amount: 1, unit: 'oz' },
      { ingredientId: 'espresso', name: 'Fresh Espresso', amount: 2, unit: 'oz' },
    ],
    instructions: [
      'Pull a fresh espresso.',
      'Add sambuca to the cup.',
      'Stir once and drink immediately.',
    ],
    glassType: 'Espresso Cup',
    tags: ['sambuca', 'coffee', 'after-dinner', 'digestif', 'easy', 'italian'],
    difficulty: 'easy',
  },

  // ── Sake & Japanese ──────────────────────────────────────────────────────────

  {
    id: 'r829',
    name: 'Sake Spritz',
    description: 'Sake, yuzu, and soda — clean, Japanese, and entirely underused at the cocktail hour.',
    ingredients: [
      { ingredientId: 'sake', name: 'Sake', amount: 3, unit: 'oz' },
      { ingredientId: 'yuzu-juice', name: 'Yuzu Juice', amount: 0.5, unit: 'oz' },
      { ingredientId: 'soda-water', name: 'Soda Water', amount: 2, unit: 'oz' },
    ],
    instructions: [
      'Fill a wine glass with ice.',
      'Pour sake and yuzu juice over ice.',
      'Top with soda water.',
      'Garnish with a cucumber slice.',
    ],
    glassType: 'Wine',
    garnish: 'Cucumber slice',
    tags: ['sake', 'low-abv', 'bubbly', 'easy', 'light', 'citrus', 'japanese'],
    difficulty: 'easy',
  },

  {
    id: 'r830',
    name: 'Sake Martini',
    description: 'Vodka and sake in place of vermouth — the Saketini. Clean and minimal, which is the whole point.',
    ingredients: [
      { ingredientId: 'vodka', name: 'Vodka', amount: 2, unit: 'oz' },
      { ingredientId: 'sake', name: 'Sake', amount: 1, unit: 'oz' },
    ],
    instructions: [
      'Stir both ingredients with ice until very cold.',
      'Strain into a chilled martini glass.',
      'Garnish with a cucumber slice.',
    ],
    glassType: 'Martini',
    garnish: 'Cucumber slice',
    tags: ['vodka', 'sake', 'stirred', 'spirit-forward', 'easy', 'japanese'],
    difficulty: 'easy',
  },

  // ── Rye Variations ───────────────────────────────────────────────────────────

  {
    id: 'r831',
    name: 'Red Hook',
    description: 'Rye, Punt e Mes, and maraschino — the Brooklyn variation that went a different direction.',
    ingredients: [
      { ingredientId: 'rye-whiskey', name: 'Rye Whiskey', amount: 2, unit: 'oz' },
      { ingredientId: 'sweet-vermouth', name: 'Sweet Vermouth', amount: 0.5, unit: 'oz' },
      { ingredientId: 'maraschino-liqueur', name: 'Maraschino Liqueur', amount: 0.5, unit: 'oz' },
    ],
    instructions: [
      'Stir all ingredients with ice until chilled.',
      'Strain into a chilled coupe.',
      'Express a lemon peel over the glass.',
    ],
    glassType: 'Coupe',
    garnish: 'Lemon peel',
    tags: ['whiskey', 'rye', 'stirred', 'spirit-forward', 'modern-classic'],
    difficulty: 'easy',
  },

  {
    id: 'r832',
    name: 'Slope',
    description: 'Rye, Aperol, apricot brandy, and Angostura — a Brooklyn neighborhood cocktail that knows its audience.',
    ingredients: [
      { ingredientId: 'rye-whiskey', name: 'Rye Whiskey', amount: 2, unit: 'oz' },
      { ingredientId: 'aperol', name: 'Aperol', amount: 0.5, unit: 'oz' },
      { ingredientId: 'apricot-brandy', name: 'Apricot Liqueur', amount: 0.25, unit: 'oz' },
      { ingredientId: 'angostura-bitters', name: 'Angostura Bitters', amount: 2, unit: 'dashes' },
    ],
    instructions: [
      'Stir all ingredients with ice until chilled.',
      'Strain into a chilled coupe.',
      'Express a lemon peel over the glass.',
    ],
    glassType: 'Coupe',
    garnish: 'Lemon peel',
    tags: ['whiskey', 'rye', 'stirred', 'spirit-forward', 'bitter', 'modern-classic'],
    difficulty: 'easy',
  },

  {
    id: 'r833',
    name: 'Rye Smash',
    description: 'Rye whiskey, lemon, and fresh mint smashed together — seasonal and unapologetically simple.',
    ingredients: [
      { ingredientId: 'rye-whiskey', name: 'Rye Whiskey', amount: 2, unit: 'oz' },
      { ingredientId: 'lemon-juice', name: 'Fresh Lemon Juice', amount: 0.75, unit: 'oz' },
      { ingredientId: 'simple-syrup', name: 'Simple Syrup', amount: 0.5, unit: 'oz' },
    ],
    instructions: [
      'Muddle a few mint leaves with simple syrup.',
      'Add rye and lemon juice with ice.',
      'Shake briefly and strain into a rocks glass over crushed ice.',
      'Garnish generously with mint.',
    ],
    glassType: 'Rocks',
    garnish: 'Fresh mint bouquet',
    tags: ['whiskey', 'rye', 'smash', 'shaken', 'citrus', 'herbal', 'easy'],
    difficulty: 'easy',
  },

  // ── Elderflower & Floral ─────────────────────────────────────────────────────

  {
    id: 'r834',
    name: 'Elder Fashion',
    description: 'Bourbon, elderflower liqueur, and lemon — the Old Fashioned floral variation that works.',
    ingredients: [
      { ingredientId: 'bourbon', name: 'Bourbon', amount: 2, unit: 'oz' },
      { ingredientId: 'elderflower-liqueur', name: 'Elderflower Liqueur', amount: 0.5, unit: 'oz' },
      { ingredientId: 'lemon-juice', name: 'Fresh Lemon Juice', amount: 0.25, unit: 'oz' },
      { ingredientId: 'angostura-bitters', name: 'Angostura Bitters', amount: 2, unit: 'dashes' },
    ],
    instructions: [
      'Stir all ingredients with ice until chilled.',
      'Strain over a large ice cube in a rocks glass.',
      'Express a lemon peel over the glass.',
    ],
    glassType: 'Rocks',
    garnish: 'Lemon peel',
    tags: ['bourbon', 'whiskey', 'stirred', 'floral', 'spirit-forward'],
    difficulty: 'easy',
  },

  {
    id: 'r835',
    name: 'Garden Party',
    description: 'Gin, elderflower, cucumber, and lime — the cocktail that arrives in a glass already decorated with summer.',
    ingredients: [
      { ingredientId: 'gin', name: 'Gin', amount: 1.5, unit: 'oz' },
      { ingredientId: 'elderflower-liqueur', name: 'Elderflower Liqueur', amount: 0.75, unit: 'oz' },
      { ingredientId: 'lime-juice', name: 'Fresh Lime Juice', amount: 0.75, unit: 'oz' },
      { ingredientId: 'soda-water', name: 'Soda Water', amount: 2, unit: 'oz' },
    ],
    instructions: [
      'Muddle a few cucumber slices with elderflower liqueur.',
      'Add gin, lime juice, and ice.',
      'Shake briefly and strain into a Collins glass over ice.',
      'Top with soda water.',
    ],
    glassType: 'Collins',
    garnish: 'Cucumber ribbon, lime wheel',
    tags: ['gin', 'floral', 'bubbly', 'easy', 'refreshing', 'cucumber'],
    difficulty: 'easy',
  },

  // ── Bitter & Spirit-Forward ──────────────────────────────────────────────────

  {
    id: 'r836',
    name: 'Lucien Gaudin',
    description: 'Gin, Campari, Cointreau, and dry vermouth — the Negroni\'s leaner, drier French cousin.',
    ingredients: [
      { ingredientId: 'gin', name: 'Gin', amount: 1, unit: 'oz' },
      { ingredientId: 'campari', name: 'Campari', amount: 0.5, unit: 'oz' },
      { ingredientId: 'triple-sec', name: 'Cointreau', amount: 0.5, unit: 'oz' },
      { ingredientId: 'dry-vermouth', name: 'Dry Vermouth', amount: 0.5, unit: 'oz' },
    ],
    instructions: [
      'Stir all ingredients with ice until well chilled.',
      'Strain into a chilled coupe.',
      'Express an orange peel over the glass.',
    ],
    glassType: 'Coupe',
    garnish: 'Orange peel',
    tags: ['gin', 'campari', 'stirred', 'spirit-forward', 'bitter', 'classic'],
    difficulty: 'easy',
  },

  {
    id: 'r837',
    name: 'Campari Spritz',
    description: 'Campari and soda — the Campari Spritz\'s minimalist cousin. Two ingredients, complete confidence.',
    ingredients: [
      { ingredientId: 'campari', name: 'Campari', amount: 1.5, unit: 'oz' },
      { ingredientId: 'prosecco', name: 'Prosecco', amount: 3, unit: 'oz' },
      { ingredientId: 'soda-water', name: 'Soda Water', amount: 1.5, unit: 'oz' },
    ],
    instructions: [
      'Fill a rocks or wine glass with ice.',
      'Pour Campari over ice.',
      'Top with prosecco and a splash of soda.',
      'Garnish with an orange slice.',
    ],
    glassType: 'Rocks',
    garnish: 'Orange slice',
    tags: ['campari', 'aperitivo', 'bubbly', 'easy', 'bitter', 'spritz'],
    difficulty: 'easy',
  },

  {
    id: 'r838',
    name: 'Mezcal Old Fashioned',
    description: 'Mezcal replacing bourbon — same structure, same ceremony, smoke where the caramel was.',
    ingredients: [
      { ingredientId: 'mezcal', name: 'Mezcal', amount: 2, unit: 'oz' },
      { ingredientId: 'agave-syrup', name: 'Agave Syrup', amount: 0.25, unit: 'oz' },
      { ingredientId: 'angostura-bitters', name: 'Angostura Bitters', amount: 2, unit: 'dashes' },
      { ingredientId: 'orange-bitters', name: 'Orange Bitters', amount: 1, unit: 'dash' },
    ],
    instructions: [
      'Combine all ingredients in a rocks glass over a large ice cube.',
      'Stir until chilled.',
      'Express an orange peel over the glass.',
    ],
    glassType: 'Rocks',
    garnish: 'Orange peel',
    tags: ['mezcal', 'stirred', 'spirit-forward', 'smoky', 'easy'],
    difficulty: 'easy',
  },

  {
    id: 'r839',
    name: 'El Diablo',
    description: 'Tequila, crème de cassis, lime, and ginger beer — the Mule\'s Mexicana, darker and more complex.',
    ingredients: [
      { ingredientId: 'tequila', name: 'Tequila Blanco', amount: 1.5, unit: 'oz' },
      { ingredientId: 'creme-de-cassis', name: 'Crème de Cassis', amount: 0.5, unit: 'oz' },
      { ingredientId: 'lime-juice', name: 'Fresh Lime Juice', amount: 0.5, unit: 'oz' },
      { ingredientId: 'ginger-beer', name: 'Ginger Beer', amount: 4, unit: 'oz' },
    ],
    instructions: [
      'Fill a highball glass with ice.',
      'Add tequila, crème de cassis, and lime juice.',
      'Top with ginger beer and stir gently.',
      'Garnish with a lime wedge.',
    ],
    glassType: 'Highball',
    garnish: 'Lime wedge',
    tags: ['tequila', 'highball', 'bubbly', 'easy', 'fruity', 'spicy'],
    difficulty: 'easy',
  },

  {
    id: 'r840',
    name: 'Velvet Hammer',
    description: 'Vodka, white crème de cacao, and cream — a dessert cocktail from 1970 that\'s been waiting for its moment.',
    ingredients: [
      { ingredientId: 'vodka', name: 'Vodka', amount: 1.5, unit: 'oz' },
      { ingredientId: 'creme-de-cacao-white', name: 'White Crème de Cacao', amount: 0.75, unit: 'oz' },
      { ingredientId: 'heavy-cream', name: 'Heavy Cream', amount: 1.5, unit: 'oz' },
    ],
    instructions: [
      'Shake all ingredients vigorously with ice.',
      'Strain into a chilled coupe.',
    ],
    glassType: 'Coupe',
    tags: ['vodka', 'dessert', 'after-dinner', 'shaken', 'creamy', 'chocolate', 'easy'],
    difficulty: 'easy',
  },

  {
    id: 'r841',
    name: 'Brandy Alexander',
    description: 'Cognac, dark crème de cacao, and cream — the dessert cocktail that actually deserves its reputation.',
    ingredients: [
      { ingredientId: 'cognac', name: 'Cognac', amount: 1.5, unit: 'oz' },
      { ingredientId: 'creme-de-cacao', name: 'Dark Crème de Cacao', amount: 0.75, unit: 'oz' },
      { ingredientId: 'heavy-cream', name: 'Heavy Cream', amount: 1.5, unit: 'oz' },
    ],
    instructions: [
      'Shake all ingredients vigorously with ice.',
      'Strain into a chilled coupe.',
      'Grate nutmeg over the top.',
    ],
    glassType: 'Coupe',
    garnish: 'Freshly grated nutmeg',
    tags: ['cognac', 'brandy', 'dessert', 'after-dinner', 'shaken', 'creamy', 'chocolate', 'easy'],
    difficulty: 'easy',
  },

  {
    id: 'r842',
    name: 'Pink Squirrel',
    description: 'Crème de noyaux, white crème de cacao, and cream — vintage, sweet, and correctly pink.',
    ingredients: [
      { ingredientId: 'amaretto', name: 'Amaretto', amount: 1, unit: 'oz' },
      { ingredientId: 'creme-de-cacao-white', name: 'White Crème de Cacao', amount: 0.75, unit: 'oz' },
      { ingredientId: 'heavy-cream', name: 'Heavy Cream', amount: 1.5, unit: 'oz' },
      { ingredientId: 'grenadine', name: 'Grenadine', amount: 0.25, unit: 'oz' },
    ],
    instructions: [
      'Shake all ingredients with ice.',
      'Strain into a chilled coupe.',
    ],
    glassType: 'Coupe',
    tags: ['amaretto', 'dessert', 'after-dinner', 'shaken', 'creamy', 'easy', 'retro'],
    difficulty: 'easy',
  },

  {
    id: 'r843',
    name: 'Scorpion',
    description: 'Cognac, rum, orgeat, and citrus in the tropical register — the punch bowl format scaled down.',
    ingredients: [
      { ingredientId: 'cognac', name: 'Cognac', amount: 1, unit: 'oz' },
      { ingredientId: 'rum-white', name: 'White Rum', amount: 1, unit: 'oz' },
      { ingredientId: 'orange-juice', name: 'Fresh Orange Juice', amount: 1.5, unit: 'oz' },
      { ingredientId: 'lemon-juice', name: 'Fresh Lemon Juice', amount: 0.75, unit: 'oz' },
      { ingredientId: 'orgeat', name: 'Orgeat', amount: 0.75, unit: 'oz' },
    ],
    instructions: [
      'Shake all ingredients with ice.',
      'Strain into a highball glass over crushed ice.',
      'Garnish with a gardenia or mint bouquet.',
    ],
    glassType: 'Highball',
    garnish: 'Mint bouquet',
    tags: ['cognac', 'rum', 'tiki', 'tropical', 'shaken', 'citrus', 'medium'],
    difficulty: 'medium',
  },

  {
    id: 'r844',
    name: 'Sherry Flip',
    description: 'Amontillado sherry and a whole egg — rich, nutty, and completely underestimated.',
    ingredients: [
      { ingredientId: 'amontillado-sherry', name: 'Amontillado Sherry', amount: 2.5, unit: 'oz' },
      { ingredientId: 'simple-syrup', name: 'Simple Syrup', amount: 0.5, unit: 'oz' },
      { ingredientId: 'egg', name: 'Whole Egg', amount: 1, unit: 'piece' },
    ],
    instructions: [
      'Combine all ingredients in a shaker without ice.',
      'Shake vigorously for 20 seconds.',
      'Add ice and shake for another 15 seconds.',
      'Double-strain into a chilled coupe.',
      'Grate fresh nutmeg over the top.',
    ],
    glassType: 'Coupe',
    garnish: 'Freshly grated nutmeg',
    tags: ['sherry', 'low-abv', 'flip', 'after-dinner', 'shaken', 'creamy', 'medium'],
    difficulty: 'medium',
  },

  {
    id: 'r845',
    name: 'Clover Leaf',
    description: 'The Clover Club goes vertical — gin, raspberry, lemon, egg white, and fresh mint muddled in.',
    ingredients: [
      { ingredientId: 'gin', name: 'Gin', amount: 2, unit: 'oz' },
      { ingredientId: 'lemon-juice', name: 'Fresh Lemon Juice', amount: 0.75, unit: 'oz' },
      { ingredientId: 'raspberry-syrup', name: 'Raspberry Syrup', amount: 0.5, unit: 'oz' },
      { ingredientId: 'egg-white', name: 'Egg White', amount: 1, unit: 'piece' },
    ],
    instructions: [
      'Muddle a sprig of fresh mint.',
      'Add all remaining ingredients.',
      'Dry-shake without ice.',
      'Add ice and shake hard.',
      'Double-strain into a chilled coupe.',
    ],
    glassType: 'Coupe',
    garnish: 'Fresh mint sprig',
    tags: ['gin', 'classic', 'sour', 'shaken', 'fruity', 'herbal', 'silky'],
    difficulty: 'medium',
  },

  {
    id: 'r846',
    name: 'Coffee Negroni',
    description: 'Gin, Campari, and coffee liqueur — bittersweet, complex, and completely unconventional.',
    ingredients: [
      { ingredientId: 'gin', name: 'Gin', amount: 1.5, unit: 'oz' },
      { ingredientId: 'campari', name: 'Campari', amount: 0.75, unit: 'oz' },
      { ingredientId: 'coffee-liqueur', name: 'Coffee Liqueur', amount: 0.75, unit: 'oz' },
    ],
    instructions: [
      'Stir all ingredients with ice until chilled.',
      'Strain into a rocks glass over a large ice cube.',
      'Express an orange peel over the glass.',
    ],
    glassType: 'Rocks',
    garnish: 'Orange peel',
    tags: ['gin', 'campari', 'coffee', 'stirred', 'spirit-forward', 'bitter', 'modern-classic'],
    difficulty: 'easy',
  },

  {
    id: 'r847',
    name: 'Naked Martini',
    description: 'Gin stirred with nothing but cold — for the person who has already said everything worth saying.',
    ingredients: [
      { ingredientId: 'gin', name: 'Gin', amount: 3, unit: 'oz' },
    ],
    instructions: [
      'Stir gin with ice until very cold.',
      'Strain into a chilled martini glass.',
      'Express a lemon peel over the glass.',
    ],
    glassType: 'Martini',
    garnish: 'Lemon peel or green olive',
    tags: ['gin', 'stirred', 'spirit-forward', 'easy', 'classic', 'dry'],
    difficulty: 'easy',
  },

  {
    id: 'r848',
    name: 'Bijou Negroni',
    description: 'Gin, sweet vermouth, and Green Chartreuse — the Bijou formula interpreted through Negroni proportions.',
    ingredients: [
      { ingredientId: 'gin', name: 'Gin', amount: 1, unit: 'oz' },
      { ingredientId: 'sweet-vermouth', name: 'Sweet Vermouth', amount: 1, unit: 'oz' },
      { ingredientId: 'green-chartreuse', name: 'Green Chartreuse', amount: 1, unit: 'oz' },
      { ingredientId: 'orange-bitters', name: 'Orange Bitters', amount: 1, unit: 'dash' },
    ],
    instructions: [
      'Stir all ingredients with ice until well chilled.',
      'Strain into a chilled coupe.',
      'Garnish with a cherry.',
    ],
    glassType: 'Coupe',
    garnish: 'Maraschino cherry',
    tags: ['gin', 'chartreuse', 'stirred', 'spirit-forward', 'herbal', 'classic'],
    difficulty: 'easy',
  },

  {
    id: 'r849',
    name: 'Pink Gin',
    description: 'The Royal Navy\'s daily medicine — gin with Angostura bitters, stirred and served cold.',
    ingredients: [
      { ingredientId: 'gin', name: 'Gin', amount: 2.5, unit: 'oz' },
      { ingredientId: 'angostura-bitters', name: 'Angostura Bitters', amount: 4, unit: 'dashes' },
    ],
    instructions: [
      'Coat a chilled coupe with Angostura bitters.',
      'Discard the excess.',
      'Pour chilled gin into the bitters-coated glass.',
    ],
    glassType: 'Coupe',
    tags: ['gin', 'stirred', 'spirit-forward', 'easy', 'classic', 'bitter'],
    difficulty: 'easy',
  },

  {
    id: 'r850',
    name: 'Wild Rabbit',
    description: 'Bourbon, elderflower liqueur, lemon, and ginger beer — what happens when the Gold Rush met the Mule.',
    ingredients: [
      { ingredientId: 'bourbon', name: 'Bourbon', amount: 1.5, unit: 'oz' },
      { ingredientId: 'elderflower-liqueur', name: 'Elderflower Liqueur', amount: 0.5, unit: 'oz' },
      { ingredientId: 'lemon-juice', name: 'Fresh Lemon Juice', amount: 0.5, unit: 'oz' },
      { ingredientId: 'honey-syrup', name: 'Honey Syrup', amount: 0.25, unit: 'oz' },
      { ingredientId: 'ginger-beer', name: 'Ginger Beer', amount: 3, unit: 'oz' },
    ],
    instructions: [
      'Shake bourbon, elderflower, lemon, and honey syrup with ice.',
      'Strain into a highball glass over ice.',
      'Top with ginger beer.',
      'Garnish with a lemon wheel and mint.',
    ],
    glassType: 'Highball',
    garnish: 'Lemon wheel, mint',
    tags: ['bourbon', 'whiskey', 'highball', 'bubbly', 'floral', 'easy'],
    difficulty: 'easy',
  },
];
