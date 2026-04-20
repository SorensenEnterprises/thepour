import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { DrinkSurvey } from './DrinkSurvey';
import { ThePourLogo } from './ThePourLogo';
import { calculateCaloriesFromStrings } from '../utils/calorieUtils';
import './BartenderModal.css';

// ── Types ────────────────────────────────────────────────────────────────────

type Mood          = 'sweet' | 'sour' | 'bitter' | 'savory';
type Spirit        = 'brown' | 'clear' | 'agave'  | 'any';
type Style         = 'classic' | 'adventurous';
type LightPref     = 'light-pref' | 'no-pref';
type Strength      = 'light'   | 'balanced' | 'bold';
type Phase         = 'category-pick' | 'question' | 'shaking' | 'reveal' | 'recipe';
type DrinkCategory = 'cocktail' | 'mocktail' | 'dirty-soda';
type MocktailVibe  = 'fruity' | 'citrus' | 'herbal' | 'fizzy';
type MocktailBase  = 'sparkling' | 'still' | 'tea';
type MocktailSweet = 'light' | 'medium' | 'sweet';
type SodaBase      = 'sprite' | 'drpepper' | 'coke' | 'orange';
type SodaFlavor    = 'coconut' | 'berry' | 'peach' | 'citrus';
type SodaCream     = 'yes' | 'no';

interface Answers {
  mood?:      Mood;
  spirit?:    Spirit;
  style?:     Style;
  lightPref?: LightPref;
  strength?:  Strength;
}

interface CocktailRec {
  name:        string;
  description: string;
  voice:       string;
  ingredients: string[];
  steps:       string[];
  moods:       Mood[];
  spirits:     Spirit[];
  styles:      Style[];
  methods?:    string[];
  strengths:   Strength[];
}

interface MocktailRec {
  name:        string;
  description: string;
  voice:       string;
  ingredients: string[];
  steps:       string[];
  vibes:       MocktailVibe[];
  bases:       MocktailBase[];
  sweets:      MocktailSweet[];
}

interface DirtySodaRec {
  name:        string;
  description: string;
  voice:       string;
  ingredients: string[];
  steps:       string[];
  bases:       SodaBase[];
  flavors:     SodaFlavor[];
  creams:      SodaCream[];
}

type DrinkRec = { name: string; description: string; voice: string; ingredients: string[]; steps: string[] };

// ── Cocktail Library ─────────────────────────────────────────────────────────

const COCKTAILS: CocktailRec[] = [
  {
    name: 'Old Fashioned',
    description: 'A timeless whiskey cocktail — just bourbon, bitters, and a touch of sweetness. The one that started everything.',
    voice: "Whiskey dressed just enough to make an impression. There's a reason this one never goes out of style.",
    ingredients: ['2 oz Bourbon', '¼ oz Simple Syrup', '2 dashes Angostura Bitters', 'Orange peel'],
    steps: [
      'Add simple syrup and bitters to a rocks glass.',
      'Pour in the bourbon and stir gently to combine.',
      'Add a large ice cube.',
      'Express orange peel over the glass, run it around the rim, and drop it in.',
    ],
    moods: ['bitter', 'sweet'], spirits: ['brown'], styles: ['classic'],
    methods: ['stirred'], strengths: ['bold'],
  },
  {
    name: 'Manhattan',
    description: 'Rye whiskey, sweet vermouth, and bitters — stirred cold and served straight up. Serious and sophisticated.',
    voice: "Serious, sophisticated, a little dangerous. The kind of drink you order when you've already decided you're staying.",
    ingredients: ['2 oz Rye Whiskey', '1 oz Sweet Vermouth', '2 dashes Angostura Bitters', 'Maraschino cherry'],
    steps: [
      'Combine rye, sweet vermouth, and bitters in a mixing glass with ice.',
      'Stir for 30 seconds until well chilled.',
      'Strain into a chilled coupe or Nick & Nora glass.',
      'Garnish with a maraschino cherry.',
    ],
    moods: ['bitter', 'sweet'], spirits: ['brown'], styles: ['classic'],
    methods: ['stirred'], strengths: ['balanced', 'bold'],
  },
  {
    name: 'Whiskey Sour',
    description: 'Bourbon shaken with fresh lemon and simple syrup — warming and bright in equal measure.',
    voice: "All the warmth of whiskey with a citrus wake-up call. Comfort food for your glass.",
    ingredients: ['2 oz Bourbon', '¾ oz Fresh Lemon Juice', '¾ oz Simple Syrup', 'Egg white (optional)'],
    steps: [
      'Add all ingredients to a shaker. If using egg white, dry-shake first (no ice) for 10 seconds.',
      'Add ice and shake vigorously for 15 seconds.',
      'Strain into a rocks glass over fresh ice.',
      'Garnish with a cherry or orange wheel.',
    ],
    moods: ['sour'], spirits: ['brown'], styles: ['classic'],
    methods: ['shaken'], strengths: ['balanced'],
  },
  {
    name: 'Paper Plane',
    description: 'Equal parts bourbon, Aperol, Amaro Nonino, and lemon juice. Modern, bitter-sweet, completely balanced.',
    voice: "Equal parts everything — it shouldn't work this well, but it does. Every single time.",
    ingredients: ['¾ oz Bourbon', '¾ oz Aperol', '¾ oz Amaro Nonino', '¾ oz Fresh Lemon Juice'],
    steps: [
      'Measure all four ingredients in equal parts into a shaker.',
      'Add ice and shake hard for 12 seconds.',
      'Double-strain into a chilled coupe.',
      'Serve immediately — no garnish needed.',
    ],
    moods: ['sour', 'bitter'], spirits: ['brown'], styles: ['adventurous'],
    methods: ['shaken'], strengths: ['balanced'],
  },
  {
    name: 'Penicillin',
    description: 'Blended scotch shaken with lemon, honey-ginger syrup, and floated with smoky Islay scotch. Complex and warming.',
    voice: "Honey and ginger chase the smoke around the glass. Complex, warming, utterly unforgettable.",
    ingredients: ['2 oz Blended Scotch', '¾ oz Fresh Lemon Juice', '¾ oz Honey-Ginger Syrup', '¼ oz Islay Scotch float'],
    steps: [
      'Shake blended scotch, lemon juice, and honey-ginger syrup with ice.',
      'Strain into a rocks glass over a large ice cube.',
      'Float the Islay scotch on top by pouring slowly over the back of a spoon.',
      'Garnish with candied ginger on a pick.',
    ],
    moods: ['sour', 'savory'], spirits: ['brown'], styles: ['adventurous'],
    methods: ['shaken'], strengths: ['bold'],
  },
  {
    name: 'Negroni',
    description: 'Equal parts gin, Campari, and sweet vermouth — stirred, strained, and unapologetically bitter.',
    voice: "Bitter, bold, beautiful. You asked for something that pushes back — here it is.",
    ingredients: ['1 oz Gin', '1 oz Campari', '1 oz Sweet Vermouth', 'Orange peel'],
    steps: [
      'Combine gin, Campari, and sweet vermouth in a mixing glass with ice.',
      'Stir for 30 seconds until well chilled.',
      'Strain into a rocks glass over a large ice cube.',
      'Express orange peel over the glass and use as garnish.',
    ],
    moods: ['bitter'], spirits: ['clear'], styles: ['classic'],
    methods: ['stirred'], strengths: ['bold'],
  },
  {
    name: 'Gin & Tonic',
    description: 'Two ingredients done right — good gin over ice, topped with cold tonic. Simple never gets old.',
    voice: "Simple. Honest. Exactly as refreshing as you need it to be right now.",
    ingredients: ['2 oz Gin', '4 oz Tonic Water', 'Lime wedge'],
    steps: [
      'Fill a highball glass with ice.',
      'Pour gin over the ice.',
      'Top with cold tonic water, pouring gently down the side to preserve carbonation.',
      'Squeeze lime wedge over the drink and drop it in.',
    ],
    moods: ['bitter', 'sweet'], spirits: ['clear'], styles: ['classic'],
    methods: ['stirred', 'either'], strengths: ['light'],
  },
  {
    name: 'Last Word',
    description: 'A Prohibition-era equal-parts classic — gin, Chartreuse, maraschino, and lime. Herbal, sharp, and addictive.',
    voice: "Four spirits walk into a bar and somehow agree on everything. A Prohibition-era miracle.",
    ingredients: ['¾ oz Gin', '¾ oz Green Chartreuse', '¾ oz Maraschino Liqueur', '¾ oz Fresh Lime Juice'],
    steps: [
      'Measure all four ingredients in equal parts into a shaker.',
      'Add ice and shake well for 12 seconds.',
      'Double-strain into a chilled coupe.',
      'Serve immediately with no garnish.',
    ],
    moods: ['sour', 'bitter'], spirits: ['clear'], styles: ['adventurous'],
    methods: ['shaken'], strengths: ['balanced'],
  },
  {
    name: 'Espresso Martini',
    description: 'Vodka, coffee liqueur, and fresh espresso — shaken cold until frothy. The drink that keeps you going.',
    voice: "Stay sharp, stay social. This one hits like a good conversation — caffeinated and a little dangerous.",
    ingredients: ['1½ oz Vodka', '1 oz Coffee Liqueur', '1 oz Fresh Espresso', '3 coffee beans'],
    steps: [
      'Brew espresso and let it cool for 2 minutes.',
      'Add vodka, coffee liqueur, and espresso to a shaker with ice.',
      'Shake very hard for 15 seconds to build a thick foam.',
      'Double-strain into a chilled coupe and garnish with 3 coffee beans.',
    ],
    moods: ['sweet', 'savory'], spirits: ['clear'], styles: ['adventurous'],
    methods: ['shaken'], strengths: ['bold'],
  },
  {
    name: 'Gimlet',
    description: 'Gin and fresh lime juice, sweetened just enough. Clean, tart, and utterly no-nonsense.',
    voice: "Gin and lime at their most honest — clean, tart, and utterly no-nonsense.",
    ingredients: ['2 oz Gin', '¾ oz Fresh Lime Juice', '¾ oz Simple Syrup', 'Lime wheel'],
    steps: [
      'Add gin, fresh lime juice, and simple syrup to a shaker with ice.',
      'Shake well for 12 seconds.',
      'Strain into a chilled coupe or rocks glass.',
      'Garnish with a lime wheel.',
    ],
    moods: ['sour'], spirits: ['clear'], styles: ['classic'],
    methods: ['shaken'], strengths: ['balanced'],
  },
  {
    name: 'Margarita',
    description: 'Tequila blanco, triple sec, and fresh lime — with a salt rim. The holy trinity.',
    voice: "Agave, acid, salt. The holy trinity. You can't go wrong, and you never will.",
    ingredients: ['2 oz Tequila Blanco', '1 oz Triple Sec', '¾ oz Fresh Lime Juice', 'Salt rim'],
    steps: [
      'Salt-rim a chilled coupe or rocks glass.',
      'Add tequila, triple sec, and lime juice to a shaker with ice.',
      'Shake vigorously for 12 seconds.',
      'Strain into the prepared glass and garnish with a lime wheel.',
    ],
    moods: ['sour', 'sweet'], spirits: ['agave'], styles: ['classic'],
    methods: ['shaken'], strengths: ['balanced'],
  },
  {
    name: 'Paloma',
    description: 'Tequila, fresh grapefruit, and soda. The drink Mexico actually orders — bright and criminally underrated.',
    voice: "The drink Mexico actually drinks. Grapefruit and tequila — bright, alive, and criminally underrated.",
    ingredients: ['2 oz Tequila Blanco', '2 oz Fresh Grapefruit Juice', '½ oz Lime Juice', '½ oz Simple Syrup', 'Soda water'],
    steps: [
      'Add tequila, grapefruit juice, lime juice, and simple syrup to a shaker with ice.',
      'Shake briefly — 8 seconds.',
      'Strain into a salt-rimmed highball glass over ice.',
      'Top with soda water and garnish with a grapefruit wedge.',
    ],
    moods: ['sweet', 'sour'], spirits: ['agave'], styles: ['classic'],
    methods: ['shaken', 'either'], strengths: ['light'],
  },
  {
    name: 'Mezcal Negroni',
    description: 'The classic Negroni built with smoky mezcal instead of gin. Everything you love, with fire underneath.',
    voice: "The classic's smokier alter ego. Everything you love about a Negroni, with fire underneath.",
    ingredients: ['1 oz Mezcal', '1 oz Campari', '1 oz Sweet Vermouth', 'Orange peel'],
    steps: [
      'Combine mezcal, Campari, and sweet vermouth in a mixing glass with ice.',
      'Stir for 30 seconds until well chilled.',
      'Strain into a rocks glass over a large ice cube.',
      'Express orange peel over the glass and use as garnish.',
    ],
    moods: ['bitter', 'savory'], spirits: ['agave'], styles: ['adventurous'],
    methods: ['stirred'], strengths: ['bold'],
  },
  {
    name: "Tommy's Margarita",
    description: 'Two-ingredient margarita with agave syrup instead of triple sec — pure tequila and lime, nothing in the way.',
    voice: "Pure agave, nothing in the way. This is what tequila tastes like when it's allowed to speak.",
    ingredients: ['2 oz Tequila Blanco', '1 oz Fresh Lime Juice', '½ oz Agave Syrup', 'Lime wheel'],
    steps: [
      'Add tequila, fresh lime juice, and agave syrup to a shaker with ice.',
      'Shake well for 12 seconds.',
      'Strain into a chilled rocks glass over ice.',
      'Garnish with a lime wheel.',
    ],
    moods: ['sour'], spirits: ['agave'], styles: ['classic', 'adventurous'],
    methods: ['shaken'], strengths: ['balanced'],
  },
  {
    name: 'Daiquiri',
    description: 'White rum, fresh lime, and simple syrup — shaken cold and served straight up. Three ingredients, zero compromises.',
    voice: "Three ingredients, zero compromises. Rum and lime have been doing this together since Havana had secrets.",
    ingredients: ['2 oz White Rum', '¾ oz Fresh Lime Juice', '¾ oz Simple Syrup'],
    steps: [
      'Add rum, lime juice, and simple syrup to a shaker with ice.',
      'Shake vigorously for 15 seconds.',
      'Double-strain into a chilled coupe.',
      'Serve immediately with no garnish, or add a lime wheel.',
    ],
    moods: ['sour'], spirits: ['any'], styles: ['classic'],
    methods: ['shaken'], strengths: ['balanced'],
  },
  {
    name: 'Dark & Stormy',
    description: 'Dark rum and spicy ginger beer over ice with a squeeze of lime. Bold, stormy, and deeply satisfying.',
    voice: "Dark rum and spicy ginger — you wanted bold and we're delivering atmospheric. This one has weather.",
    ingredients: ['2 oz Dark Rum', '4 oz Ginger Beer', '½ oz Lime Juice', 'Lime wedge'],
    steps: [
      'Fill a highball glass with ice.',
      'Add dark rum.',
      'Top with cold ginger beer, pouring gently.',
      'Squeeze lime juice over the top and drop in a lime wedge.',
    ],
    moods: ['sweet', 'savory'], spirits: ['any'], styles: ['classic'],
    methods: ['either'], strengths: ['bold'],
  },
];

// ── Scoring ──────────────────────────────────────────────────────────────────

function getTopCocktails(answers: Required<Answers>, n = 3): CocktailRec[] {
  const scored = COCKTAILS.map(c => {
    let score = 0;
    if (c.moods.includes(answers.mood))                                                              score += 3;
    if (answers.spirit === 'any' || c.spirits.includes(answers.spirit) || c.spirits.includes('any')) score += 3;
    if (c.styles.includes(answers.style))                                                            score += 2;
    if (c.strengths.includes(answers.strength))                                                      score += 2;
    if (answers.lightPref === 'light-pref') {
      const cal = calculateCaloriesFromStrings(c.ingredients);
      if (cal < 150) score += 3;
      else if (cal < 200) score += 1;
    }
    return { c, score };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, n).map(s => s.c);
}

// ── Mocktail Library ─────────────────────────────────────────────────────────

const MOCKTAILS: MocktailRec[] = [
  {
    name: 'Virgin Mojito',
    description: 'Fresh mint, lime, and soda over crushed ice. All the refreshment, none of the rum.',
    voice: "Fresh mint, lime, and bubbles. Proof you don't need the rum.",
    ingredients: ['8 Mint Leaves', '1 oz Fresh Lime Juice', '¾ oz Simple Syrup', '4 oz Soda Water'],
    steps: [
      'Muddle mint leaves with lime juice and simple syrup in the bottom of a glass.',
      'Fill with crushed ice.',
      'Top with soda water and stir gently.',
      'Garnish with a fresh mint sprig and lime wheel.',
    ],
    vibes: ['herbal', 'citrus'], bases: ['sparkling'], sweets: ['light'],
  },
  {
    name: 'Shirley Temple',
    description: 'Ginger ale, orange juice, and grenadine — the original crowd-pleaser. No apologies.',
    voice: "The original crowd-pleaser. Ginger ale, grenadine, and absolutely no apologies.",
    ingredients: ['4 oz Ginger Ale', '1 oz Orange Juice', '½ oz Grenadine', 'Maraschino Cherry'],
    steps: [
      'Fill a highball glass with ice.',
      'Add ginger ale and orange juice.',
      'Drizzle grenadine over the top — it will sink and swirl beautifully.',
      'Garnish with a maraschino cherry.',
    ],
    vibes: ['fruity', 'fizzy'], bases: ['sparkling'], sweets: ['sweet'],
  },
  {
    name: 'Arnold Palmer',
    description: 'Half iced tea, half fresh lemonade. The greatest accidental invention in beverage history.',
    voice: "Half iced tea, half lemonade. The greatest accidental invention in beverage history.",
    ingredients: ['4 oz Iced Tea', '4 oz Fresh Lemonade', 'Lemon Wheel'],
    steps: [
      'Brew iced tea and let it chill completely.',
      'Make or pour fresh lemonade.',
      'Fill a glass with ice and pour equal parts of each.',
      'Stir gently and garnish with a lemon wheel.',
    ],
    vibes: ['citrus'], bases: ['tea'], sweets: ['light', 'medium'],
  },
  {
    name: 'Cucumber Cooler',
    description: 'Cucumber, mint, lime, and soda — crisp, clean, and impossibly refreshing.',
    voice: "Crisp, clean, impossibly refreshing. The drink that makes you feel like a wellness person.",
    ingredients: ['4 Cucumber Slices', '¾ oz Fresh Lime Juice', '½ oz Simple Syrup', '4 oz Soda Water', '4 Mint Leaves'],
    steps: [
      'Muddle cucumber slices and mint with lime juice and simple syrup in a shaker.',
      'Add ice and shake briefly — 8 seconds.',
      'Strain into a glass over fresh ice.',
      'Top with soda water and garnish with a cucumber ribbon.',
    ],
    vibes: ['herbal', 'citrus'], bases: ['sparkling'], sweets: ['light'],
  },
  {
    name: 'Watermelon Lemonade',
    description: 'Fresh watermelon juice, lemon, and a splash of soda. Summer in a glass, no further explanation needed.',
    voice: "Summer in a glass. No further explanation needed.",
    ingredients: ['4 oz Fresh Watermelon Juice', '¾ oz Lemon Juice', '½ oz Simple Syrup', 'Splash of Soda Water'],
    steps: [
      'Blend or juice fresh watermelon and strain out the pulp.',
      'Combine watermelon juice, lemon juice, and simple syrup in a glass over ice.',
      'Stir well to combine.',
      'Top with a splash of soda water and garnish with a watermelon wedge.',
    ],
    vibes: ['fruity', 'citrus'], bases: ['still'], sweets: ['medium'],
  },
  {
    name: 'Spicy Ginger Mule',
    description: 'Ginger beer and lime with an optional jalapeño kick. The mocktail that bites back.',
    voice: "Ginger beer and lime with a chili kick. The mocktail that bites back.",
    ingredients: ['6 oz Ginger Beer', '¾ oz Fresh Lime Juice', '¼ oz Simple Syrup', '2 Jalapeño Slices (optional)'],
    steps: [
      'If using jalapeño, muddle the slices with simple syrup at the bottom of a copper mug or glass.',
      'Fill with ice.',
      'Add lime juice and pour ginger beer over gently.',
      'Stir and garnish with a lime wedge and extra jalapeño slice.',
    ],
    vibes: ['citrus', 'fizzy'], bases: ['sparkling'], sweets: ['light'],
  },
  {
    name: 'Berry Smash',
    description: 'Muddled mixed berries, honey, and lemon juice topped with soda. Messy, beautiful, and worth every drop.',
    voice: "Muddled berries, honey, and lemon — messy, beautiful, and worth every drop.",
    ingredients: ['6 Mixed Berries', '¾ oz Fresh Lemon Juice', '¾ oz Honey Syrup', '3 oz Soda Water'],
    steps: [
      'Muddle mixed berries with lemon juice and honey syrup in a shaker.',
      'Add ice and shake well for 12 seconds.',
      'Strain into a glass over fresh ice.',
      'Top with soda water and garnish with a few whole berries.',
    ],
    vibes: ['fruity'], bases: ['sparkling', 'still'], sweets: ['medium', 'sweet'],
  },
  {
    name: 'Seedlip Garden Spritz',
    description: 'Seedlip Garden 108 with elderflower tonic and cucumber — sophisticated, botanical, and completely grown-up.',
    voice: "A serious non-alcoholic spirit with elderflower tonic. Sophisticated and completely grown-up.",
    ingredients: ['1½ oz Seedlip Garden 108', '4 oz Elderflower Tonic', '3 Cucumber Slices', 'Thyme Sprig'],
    steps: [
      'Add cucumber slices to a wine glass or large copa.',
      'Fill with ice.',
      'Pour Seedlip Garden 108 over the ice.',
      'Top gently with elderflower tonic and garnish with a thyme sprig.',
    ],
    vibes: ['herbal', 'fizzy'], bases: ['sparkling'], sweets: ['light'],
  },
];

function getTopMocktails(answers: Record<string, string>, n = 3): MocktailRec[] {
  const scored = MOCKTAILS.map(m => {
    let score = 0;
    if (m.vibes.includes(answers.vibe as MocktailVibe))   score += 3;
    if (m.bases.includes(answers.base as MocktailBase))   score += 2;
    if (m.sweets.includes(answers.sweet as MocktailSweet)) score += 2;
    return { m, score };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, n).map(s => s.m);
}

// ── Dirty Soda Library ───────────────────────────────────────────────────────

const DIRTY_SODAS: DirtySodaRec[] = [
  {
    name: 'Dirty Dr Pepper',
    description: 'Dr Pepper with coconut syrup and lime, finished with a heavy cream float. The one that started it all.',
    voice: "Dr Pepper, coconut syrup, lime, and a cream float. The one that started it all.",
    ingredients: ['12 oz Dr Pepper', '1 oz Coconut Syrup', '½ oz Fresh Lime Juice', 'Heavy Cream Float'],
    steps: [
      'Fill a large cup with ice.',
      'Add coconut syrup and lime juice, stir briefly.',
      'Pour Dr Pepper over the ice gently to preserve the fizz.',
      'Float heavy cream on top by pouring slowly over the back of a spoon.',
    ],
    bases: ['drpepper'], flavors: ['coconut'], creams: ['yes', 'no'],
  },
  {
    name: 'Utah Swirl',
    description: 'Sprite with raspberry syrup and lime, crowned with a dreamy cream pour. A soda shop original.',
    voice: "Sprite and raspberry with a cream pour. The soda shop in Utah invented something great.",
    ingredients: ['12 oz Sprite', '1 oz Raspberry Syrup', '½ oz Fresh Lime Juice', 'Heavy Cream Float'],
    steps: [
      'Fill a large cup with ice.',
      'Add raspberry syrup and lime juice.',
      'Pour Sprite gently over the ice.',
      'Float heavy cream on top by pouring slowly over the back of a spoon.',
    ],
    bases: ['sprite'], flavors: ['berry'], creams: ['yes'],
  },
  {
    name: 'Tropical Dirty Sprite',
    description: 'Sprite, mango syrup, and a coconut cream float. Beach vibes in a 32-ounce cup.',
    voice: "Sprite and mango syrup with a coconut cream float. The beach in a cup.",
    ingredients: ['12 oz Sprite', '1 oz Mango Syrup', '¼ oz Fresh Lime Juice', 'Coconut Cream Float'],
    steps: [
      'Fill a large cup with ice.',
      'Add mango syrup and lime juice.',
      'Pour Sprite gently over the ice.',
      'Float coconut cream on top and garnish with a lime wedge.',
    ],
    bases: ['sprite'], flavors: ['coconut'], creams: ['yes', 'no'],
  },
  {
    name: 'Cowboy Crush',
    description: 'Orange Fanta with peach syrup and a heavy cream float. Sweet, peachy, completely irresistible.',
    voice: "Orange Fanta, peach syrup, cream float. Sweet, peachy, completely irresistible.",
    ingredients: ['12 oz Orange Fanta', '1 oz Peach Syrup', 'Heavy Cream Float', 'Peach Slice'],
    steps: [
      'Fill a large cup with ice.',
      'Add peach syrup and stir briefly.',
      'Pour Orange Fanta over the ice gently.',
      'Float heavy cream on top and garnish with a peach slice.',
    ],
    bases: ['orange'], flavors: ['peach'], creams: ['yes'],
  },
  {
    name: 'Cherry Coke Float',
    description: 'Cherry syrup in classic Coca-Cola with a cream pour. Diner nostalgia in a 32-ounce cup.',
    voice: "Cherry syrup in Coke with a cream pour. Diner nostalgia in a 32-ounce cup.",
    ingredients: ['12 oz Coca-Cola', '1 oz Cherry Syrup', 'Heavy Cream Float', 'Maraschino Cherry'],
    steps: [
      'Fill a large cup with ice.',
      'Add cherry syrup to the glass.',
      'Pour Coca-Cola gently over the ice, stirring just slightly.',
      'Float heavy cream on top and garnish with a maraschino cherry.',
    ],
    bases: ['coke'], flavors: ['berry'], creams: ['yes'],
  },
  {
    name: 'Mango Chili Sprite',
    description: 'Sprite with mango syrup and a chili-lime rim. Sweet heat that builds with every sip.',
    voice: "Sprite with mango syrup and a chili-lime rim. Sweet heat on every sip.",
    ingredients: ['12 oz Sprite', '1 oz Mango Syrup', '½ oz Fresh Lime Juice', 'Chili-Lime Rim'],
    steps: [
      'Rim a glass with chili-lime salt — wet the rim with lime juice first, then press into the salt.',
      'Fill with ice.',
      'Add mango syrup and lime juice.',
      'Pour Sprite gently over the ice and stir softly.',
    ],
    bases: ['sprite'], flavors: ['citrus'], creams: ['no'],
  },
  {
    name: 'Peach Cream Dream',
    description: 'Dr Pepper with peach syrup and a generous cream pour — Southern comfort in soda form.',
    voice: "Dr Pepper and peach with a generous cream pour. Southern comfort in soda form.",
    ingredients: ['12 oz Dr Pepper', '1 oz Peach Syrup', '1½ oz Heavy Cream', '¼ oz Vanilla Syrup (optional)'],
    steps: [
      'Fill a large cup with ice.',
      'Add peach syrup and vanilla syrup if using.',
      'Pour Dr Pepper gently over the ice.',
      'Pour heavy cream slowly over the back of a spoon to float it on top.',
    ],
    bases: ['drpepper'], flavors: ['peach'], creams: ['yes'],
  },
  {
    name: 'Raspberry Limeade Smash',
    description: 'Sprite with raspberry syrup, fresh lime, and muddled raspberries. Bright, beautiful, and built for a hot day.',
    voice: "Sprite, raspberry syrup, fresh lime, muddled raspberries. Bright and beautiful.",
    ingredients: ['12 oz Sprite', '1 oz Raspberry Syrup', '¾ oz Fresh Lime Juice', '4 Fresh Raspberries'],
    steps: [
      'Lightly muddle raspberries at the bottom of a large cup.',
      'Fill with ice.',
      'Add raspberry syrup and lime juice.',
      'Pour Sprite over the ice gently and garnish with extra raspberries.',
    ],
    bases: ['sprite'], flavors: ['berry'], creams: ['no', 'yes'],
  },
];

function getTopDirtySodas(answers: Record<string, string>, n = 3): DirtySodaRec[] {
  const scored = DIRTY_SODAS.map(d => {
    let score = 0;
    if (d.bases.includes(answers.sodaBase as SodaBase))     score += 3;
    if (d.flavors.includes(answers.flavor as SodaFlavor))   score += 2;
    if (d.creams.includes(answers.cream as SodaCream))      score += 2;
    return { d, score };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, n).map(s => s.d);
}

// ── Questions ────────────────────────────────────────────────────────────────

const COCKTAIL_QUESTIONS = [
  {
    key:     'mood' as const,
    voice:   'Let me get a read on you.',
    text:    "What's your mood tonight?",
    options: [
      { label: 'Sweet',  sub: 'Fruit, honey, a little indulgent', value: 'sweet'  as Mood },
      { label: 'Sour',   sub: 'Citrus-forward, bright & zesty',   value: 'sour'   as Mood },
      { label: 'Bitter', sub: 'Complex, dry, grown-up',           value: 'bitter' as Mood },
      { label: 'Savory', sub: 'Herbal, smoky, unexpected',        value: 'savory' as Mood },
    ],
  },
  {
    key:     'spirit' as const,
    voice:   'Every good night starts with a foundation.',
    text:    'Your spirit of choice?',
    options: [
      { label: 'Brown Spirits', sub: 'Whiskey, Bourbon, Scotch', value: 'brown' as Spirit },
      { label: 'Clear Spirits', sub: 'Gin, Vodka',               value: 'clear' as Spirit },
      { label: 'Agave',         sub: 'Tequila, Mezcal',          value: 'agave' as Spirit },
      { label: 'No Preference', sub: 'Surprise me',              value: 'any'   as Spirit },
    ],
  },
  {
    key:     'style' as const,
    voice:   "Tell me how you're feeling.",
    text:    'How do you like it?',
    options: [
      { label: 'Classic & Timeless', sub: 'Proven, trusted, refined', value: 'classic'     as Style },
      { label: 'Something New',      sub: 'Push the envelope',         value: 'adventurous' as Style },
    ],
  },
  {
    key:     'lightPref' as const,
    voice:   "One more thing before I pour.",
    text:    'Looking for something lighter?',
    options: [
      { label: 'Yes, keep it light', sub: 'Under 150 calories',  value: 'light-pref' as LightPref },
      { label: 'No preference',      sub: 'Whatever tastes best', value: 'no-pref'    as LightPref },
    ],
  },
  {
    key:     'strength',
    voice:   'Last question. I want to get this right.',
    text:    'How strong are we talking?',
    options: [
      { label: 'Light & Refreshing', sub: 'Easy-drinking, sessionable',      value: 'light'    },
      { label: 'Balanced',           sub: 'Spirit-forward but approachable',  value: 'balanced' },
      { label: 'Bold & Boozy',       sub: 'I came here to drink',             value: 'bold'     },
    ],
  },
];

const MOCKTAIL_QUESTIONS = [
  {
    key: 'vibe',
    voice: "Let me find your flavor.",
    text: "What are you after tonight?",
    options: [
      { label: 'Fruity & Sweet',   sub: 'Berries, tropical, bright',          value: 'fruity'  },
      { label: 'Citrus & Bright',  sub: 'Lemon, lime, grapefruit',            value: 'citrus'  },
      { label: 'Herbal & Cool',    sub: 'Mint, cucumber, botanical',          value: 'herbal'  },
      { label: 'Fizzy & Playful',  sub: 'Effervescent, fun, refreshing',      value: 'fizzy'   },
    ],
  },
  {
    key: 'base',
    voice: "How do you want it built?",
    text: "Sparkling, still, or tea-based?",
    options: [
      { label: 'Sparkling',        sub: 'Bubbles, effervescent, lively',      value: 'sparkling' },
      { label: 'Still & Juicy',    sub: 'Fresh-pressed, clean, smooth',       value: 'still'     },
      { label: 'Tea-based',        sub: 'Iced tea, layered, refreshing',      value: 'tea'       },
    ],
  },
  {
    key: 'sweet',
    voice: 'Last one.',
    text: 'How sweet do you want it?',
    options: [
      { label: 'Light',            sub: 'Barely-there sweetness',             value: 'light'   },
      { label: 'Medium',           sub: 'Just right, balanced',               value: 'medium'  },
      { label: 'Sweet',            sub: 'Go all in',                          value: 'sweet'   },
    ],
  },
];

const DIRTY_SODA_QUESTIONS = [
  {
    key: 'sodaBase',
    voice: "Starting with the foundation.",
    text: "What's your base soda?",
    options: [
      { label: 'Sprite',           sub: 'Citrus, crisp, clean',               value: 'sprite'   },
      { label: 'Dr Pepper',        sub: 'Rich, complex, spiced',              value: 'drpepper' },
      { label: 'Coke',             sub: 'Classic cola depth',                 value: 'coke'     },
      { label: 'Orange Soda',      sub: 'Fanta, fruity, bold',                value: 'orange'   },
    ],
  },
  {
    key: 'flavor',
    voice: "Now let's build the flavor.",
    text: "What direction are we going?",
    options: [
      { label: 'Coconut & Tropical', sub: 'Island vibes, creamy, exotic',     value: 'coconut' },
      { label: 'Berry & Fruity',     sub: 'Raspberry, cherry, sweet',         value: 'berry'   },
      { label: 'Peach & Floral',     sub: 'Sweet, delicate, Southern',        value: 'peach'   },
      { label: 'Citrus & Zesty',     sub: 'Mango, lime, bright',              value: 'citrus'  },
    ],
  },
  {
    key: 'cream',
    voice: 'One last call.',
    text: 'Add cream to the top?',
    options: [
      { label: 'Yes, float it',    sub: 'Silky, dreamy, the right choice',    value: 'yes' },
      { label: 'No cream',         sub: 'Keep it clean and classic',          value: 'no'  },
    ],
  },
];

function getQuestions(cat: DrinkCategory | null) {
  if (cat === 'mocktail')    return MOCKTAIL_QUESTIONS;
  if (cat === 'dirty-soda')  return DIRTY_SODA_QUESTIONS;
  return COCKTAIL_QUESTIONS;
}

const SHAKER_LINES = [
  "Give me a moment…",
  "I know just the thing…",
  "Almost there…",
  "Good choice. Working on it…",
  "One more second…",
];

// ── Component ────────────────────────────────────────────────────────────────

interface Props {
  onClose: () => void;
}

export function BartenderModal({ onClose }: Props) {
  const { user } = useAuth();
  const [phase, setPhase]           = useState<Phase>('category-pick');
  const [category, setCategory]     = useState<DrinkCategory | null>(null);
  const [step, setStep]             = useState(0);
  const [answers, setAnswers]       = useState<Record<string, string>>({});
  const [recs, setRecs]             = useState<DrinkRec[]>([]);
  const [rec, setRec]               = useState<DrinkRec | null>(null);
  const [animKey, setAnimKey]       = useState(0);
  const [shakerLine, setShakerLine] = useState('');
  const [showSurvey, setShowSurvey] = useState(false);
  const [surveyDone, setSurveyDone] = useState(false);

  const revealTimerRef    = useRef<ReturnType<typeof setTimeout> | null>(null);
  const audioRef          = useRef<HTMLAudioElement | null>(null);
  const fadeFnRef         = useRef<ReturnType<typeof setInterval> | null>(null);

  function cancelPendingTimer() {
    if (revealTimerRef.current) clearTimeout(revealTimerRef.current);
  }

  function fadeOutMusic(cb: () => void) {
    const audio = audioRef.current;
    if (!audio || audio.paused) { cb(); return; }
    const start = audio.volume;
    const steps = 20;
    let step = 0;
    fadeFnRef.current = setInterval(() => {
      step++;
      audio.volume = Math.max(0, start * (1 - step / steps));
      if (step >= steps) {
        clearInterval(fadeFnRef.current!);
        audio.pause();
        cb();
      }
    }, 600 / steps);
  }

  function handleClose() {
    cancelPendingTimer();
    fadeOutMusic(onClose);
  }

  // Background jazz — only plays while overlay is mounted
  useEffect(() => {
    const audio = new Audio('/music/bartender-jazz.mp3');
    audio.loop   = true;
    audio.volume = 0.3;
    audioRef.current = audio;
    // Safari requires a user gesture before play() — the catch silences the
    // NotAllowedError. We never store the Promise because resolving it in
    // cleanup (after unmount) causes async DOM operations in Safari.
    audio.play().catch(() => {});
    return () => {
      if (fadeFnRef.current) clearInterval(fadeFnRef.current);
      if (!audio.paused) audio.pause();
      audio.src = '';
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // 60-second survey timer — fires once per recipe view, only if not already dismissed
  useEffect(() => {
    if (phase !== 'recipe' || !rec || surveyDone) return;
    setShowSurvey(false);
    const t = setTimeout(() => setShowSurvey(true), 60_000);
    return () => clearTimeout(t);
  }, [phase, rec]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleCategoryPick(cat: DrinkCategory) {
    setCategory(cat);
    setStep(0);
    setAnswers({});
    setAnimKey(k => k + 1);
    setPhase('question');
  }

  function handleAnswer(key: string, value: string) {
    const next = { ...answers, [key]: value };
    setAnswers(next);
    setShakerLine(SHAKER_LINES[step] ?? SHAKER_LINES[0]);
    setPhase('shaking');
  }

  useEffect(() => {
    if (phase !== 'shaking') return;
    const qs = getQuestions(category);
    const timer = setTimeout(() => {
      const next = answers;
      const filledStep = step + 1;
      if (filledStep < qs.length) {
        setStep(filledStep);
        setAnimKey(k => k + 1);
        setPhase('question');
      } else {
        let results: DrinkRec[];
        if (category === 'mocktail')        results = getTopMocktails(next);
        else if (category === 'dirty-soda') results = getTopDirtySodas(next);
        else                                results = getTopCocktails(next as Required<Answers>);
        setRecs(results);
        setRec(null);
        setPhase('reveal');
      }
    }, 820);
    return () => clearTimeout(timer);
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleRestart() {
    cancelPendingTimer();
    if (fadeFnRef.current) clearInterval(fadeFnRef.current);
    const audio = audioRef.current;
    if (audio) { audio.volume = 0.3; if (audio.paused) audio.play().catch(() => {}); }
    setCategory(null);
    setStep(0);
    setAnswers({});
    setRecs([]);
    setRec(null);
    setShakerLine('');
    setShowSurvey(false);
    setSurveyDone(false);
    setPhase('category-pick');
  }

  const currentQuestions = getQuestions(category);
  const q = currentQuestions[step];

  return (
    <div className="bm-overlay" onClick={e => { if (e.target === e.currentTarget) handleClose(); }}>
      <div className="bm-topbar-logo" aria-label="thepour.">
        <ThePourLogo glassSize={20} fontSize={15} />
      </div>
      <button className="bm-close" onClick={handleClose} aria-label="Close">×</button>

      {/* ── Background glass illustrations ── */}
      <div className="bm-bg-art" aria-hidden="true">

        {/* ── Martini — top-right corner ── */}
        <svg className="bm-bg-glass" style={{ width: 145, top: -12, right: -18, transform: 'rotate(-8deg)' }} viewBox="0 0 80 100" strokeWidth="1.4">
          <path d="M4,7 L76,7 L40,63 Z" /><line x1="40" y1="63" x2="40" y2="90" /><line x1="20" y1="90" x2="60" y2="90" /><circle cx="40" cy="16" r="3.5" />
        </svg>

        {/* ── Coupe — bottom-left corner ── */}
        <svg className="bm-bg-glass" style={{ width: 115, bottom: 44, left: -20, transform: 'rotate(14deg)' }} viewBox="0 0 80 100" strokeWidth="1.4">
          <path d="M7,7 Q7,54 40,60 Q73,54 73,7 Z" /><line x1="40" y1="60" x2="40" y2="88" /><line x1="21" y1="88" x2="59" y2="88" />
        </svg>

        {/* ── Highball — top-left corner ── */}
        <svg className="bm-bg-glass" style={{ width: 74, top: 38, left: 12, transform: 'rotate(-5deg)' }} viewBox="0 0 60 104" strokeWidth="1.6">
          <path d="M7,5 L53,5 L57,99 L3,99 Z" /><line x1="9" y1="32" x2="51" y2="32" />
        </svg>

        {/* ── Rocks glass — bottom-right corner ── */}
        <svg className="bm-bg-glass" style={{ width: 82, bottom: 42, right: 16, transform: 'rotate(7deg)' }} viewBox="0 0 80 72" strokeWidth="1.6">
          <path d="M7,7 L73,7 L69,65 L11,65 Z" /><line x1="9" y1="28" x2="71" y2="28" />
        </svg>

        {/* ── Nick & Nora — center-right edge ── */}
        <svg className="bm-bg-glass" style={{ width: 90, top: '38%', right: -10, transform: 'rotate(-12deg)' }} viewBox="0 0 70 100" strokeWidth="1.4">
          <path d="M10,7 Q6,46 35,54 Q64,46 60,7 Z" /><line x1="35" y1="54" x2="35" y2="84" /><line x1="17" y1="84" x2="53" y2="84" />
        </svg>

        {/* ── Champagne flute — top center ── */}
        <svg className="bm-bg-glass" style={{ width: 48, top: 6, left: '42%', transform: 'rotate(10deg)' }} viewBox="0 0 40 130" strokeWidth="1.5">
          <path d="M10,5 L8,78 L32,78 L30,5 Z" /><line x1="20" y1="78" x2="20" y2="112" /><line x1="7" y1="112" x2="33" y2="112" />
        </svg>

        {/* ── Wine / tulip glass — upper right area ── */}
        <svg className="bm-bg-glass" style={{ width: 92, top: -18, left: '58%', transform: 'rotate(-6deg)' }} viewBox="0 0 80 120" strokeWidth="1.4">
          <path d="M12,6 Q8,36 11,52 Q19,68 40,70 Q61,68 69,52 Q72,36 68,6 Z" /><line x1="40" y1="70" x2="40" y2="108" /><line x1="20" y1="108" x2="60" y2="108" />
        </svg>

        {/* ── Hurricane glass — left-center ── */}
        <svg className="bm-bg-glass" style={{ width: 68, top: '46%', left: 8, transform: 'rotate(-9deg)' }} viewBox="0 0 70 120" strokeWidth="1.5">
          <path d="M5,5 L65,5 Q68,34 50,58 Q68,82 65,115 L5,115 Q2,82 20,58 Q2,34 5,5 Z" />
        </svg>

        {/* ── Margarita glass — lower center ── */}
        <svg className="bm-bg-glass" style={{ width: 100, bottom: 52, left: '37%', transform: 'rotate(-4deg)' }} viewBox="0 0 100 110" strokeWidth="1.4">
          <path d="M2,8 L98,8 L70,52 L58,52 Q50,55 42,52 L30,52 Z" /><line x1="50" y1="52" x2="50" y2="96" /><line x1="28" y1="96" x2="72" y2="96" />
        </svg>

        {/* ── Citrus wheel — upper left area ── */}
        <svg className="bm-bg-glass" style={{ width: 58, top: '18%', left: '22%', transform: 'rotate(20deg)' }} viewBox="0 0 60 60" strokeWidth="1.5">
          <circle cx="30" cy="30" r="25" /><circle cx="30" cy="30" r="8" />
          <line x1="30" y1="5" x2="30" y2="55" /><line x1="5" y1="30" x2="55" y2="30" />
          <line x1="12" y1="12" x2="48" y2="48" /><line x1="48" y1="12" x2="12" y2="48" />
        </svg>

        {/* ── Spirit bottle — far left lower ── */}
        <svg className="bm-bg-glass" style={{ width: 50, top: '60%', left: -4, transform: 'rotate(6deg)' }} viewBox="0 0 50 140" strokeWidth="1.5">
          <rect x="8" y="60" width="34" height="75" rx="5" />
          <path d="M8,60 Q8,42 18,30" /><path d="M42,60 Q42,42 32,30" />
          <rect x="18" y="10" width="14" height="20" rx="3" />
          <line x1="18" y1="30" x2="32" y2="30" />
          <rect x="11" y="74" width="28" height="30" rx="2" />
        </svg>

        {/* ── Pilsner glass — upper right ── */}
        <svg className="bm-bg-glass" style={{ width: 58, top: '20%', right: '14%', transform: 'rotate(-9deg)' }} viewBox="0 0 60 120" strokeWidth="1.5">
          <path d="M5,8 L55,8 L47,112 L13,112 Z" />
        </svg>

        {/* ── Snifter / brandy — center behind content ── */}
        <svg className="bm-bg-glass" style={{ width: 88, top: '44%', left: '44%', transform: 'rotate(13deg)' }} viewBox="0 0 90 110" strokeWidth="1.4">
          <path d="M10,8 Q5,56 32,70 Q37,73 45,73 Q53,73 58,70 Q85,56 80,8 Z" /><line x1="45" y1="73" x2="45" y2="97" /><line x1="27" y1="97" x2="63" y2="97" />
        </svg>

        {/* ── Collins / zombie glass — right lower ── */}
        <svg className="bm-bg-glass" style={{ width: 52, bottom: '28%', right: '8%', transform: 'rotate(5deg)' }} viewBox="0 0 55 130" strokeWidth="1.6">
          <path d="M7,5 L48,5 L50,125 L5,125 Z" />
        </svg>

        {/* ── Olive on cocktail pick — lower left ── */}
        <svg className="bm-bg-glass" style={{ width: 42, bottom: '34%', left: '18%', transform: 'rotate(-14deg)' }} viewBox="0 0 50 90" strokeWidth="1.5">
          <line x1="25" y1="5" x2="25" y2="53" /><line x1="17" y1="8" x2="33" y2="8" />
          <ellipse cx="25" cy="68" rx="13" ry="17" /><circle cx="25" cy="68" r="5" />
        </svg>

        {/* ── Second coupe — lower right area ── */}
        <svg className="bm-bg-glass" style={{ width: 82, bottom: '16%', right: '22%', transform: 'rotate(-5deg)' }} viewBox="0 0 80 100" strokeWidth="1.4">
          <path d="M7,7 Q7,54 40,60 Q73,54 73,7 Z" /><line x1="40" y1="60" x2="40" y2="88" /><line x1="21" y1="88" x2="59" y2="88" />
        </svg>

        {/* ── Small martini — upper left center ── */}
        <svg className="bm-bg-glass" style={{ width: 68, top: '28%', left: '16%', transform: 'rotate(-16deg)' }} viewBox="0 0 80 100" strokeWidth="1.5">
          <path d="M4,7 L76,7 L40,63 Z" /><line x1="40" y1="63" x2="40" y2="90" /><line x1="20" y1="90" x2="60" y2="90" />
        </svg>

        {/* ── Second champagne flute — lower area ── */}
        <svg className="bm-bg-glass" style={{ width: 42, bottom: '20%', left: '48%', transform: 'rotate(-7deg)' }} viewBox="0 0 40 130" strokeWidth="1.5">
          <path d="M10,5 L8,78 L32,78 L30,5 Z" /><line x1="20" y1="78" x2="20" y2="112" /><line x1="7" y1="112" x2="33" y2="112" />
        </svg>

        {/* ── Citrus wheel 2 — right upper ── */}
        <svg className="bm-bg-glass" style={{ width: 46, top: '8%', right: '24%', transform: 'rotate(-18deg)' }} viewBox="0 0 60 60" strokeWidth="1.6">
          <circle cx="30" cy="30" r="25" /><circle cx="30" cy="30" r="8" />
          <line x1="30" y1="5" x2="30" y2="55" /><line x1="5" y1="30" x2="55" y2="30" />
          <line x1="12" y1="12" x2="48" y2="48" /><line x1="48" y1="12" x2="12" y2="48" />
        </svg>

        {/* ── Highball 2 — bottom center-left ── */}
        <svg className="bm-bg-glass" style={{ width: 60, bottom: '8%', left: '30%', transform: 'rotate(8deg)' }} viewBox="0 0 60 104" strokeWidth="1.6">
          <path d="M7,5 L53,5 L57,99 L3,99 Z" /><line x1="9" y1="32" x2="51" y2="32" />
        </svg>

      </div>

      <div className={`bm-shell${(phase === 'recipe' || phase === 'reveal') ? ' bm-shell--recipe' : ''}`}>

        {/* ── Shaker transition ── */}
        {phase === 'shaking' && (
          <div className="bm-shaker-scene">
            <svg className="bm-shaker-svg" viewBox="0 0 80 224" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="bm-chrome-body" x1="13" y1="0" x2="67" y2="0" gradientUnits="userSpaceOnUse">
                  <stop offset="0%"   stopColor="#ffffff" stopOpacity="0.9" />
                  <stop offset="12%"  stopColor="#d8dfe3" />
                  <stop offset="30%"  stopColor="#a8b4bb" />
                  <stop offset="50%"  stopColor="#bec8cc" />
                  <stop offset="72%"  stopColor="#8c9ca2" />
                  <stop offset="88%"  stopColor="#6b7d84" />
                  <stop offset="100%" stopColor="#4a5c62" />
                </linearGradient>
                <linearGradient id="bm-chrome-cap" x1="22" y1="0" x2="58" y2="0" gradientUnits="userSpaceOnUse">
                  <stop offset="0%"   stopColor="#f0f4f5" stopOpacity="0.95" />
                  <stop offset="15%"  stopColor="#cdd6da" />
                  <stop offset="35%"  stopColor="#9eadb4" />
                  <stop offset="55%"  stopColor="#b4c0c5" />
                  <stop offset="80%"  stopColor="#7a8e95" />
                  <stop offset="100%" stopColor="#526068" />
                </linearGradient>
                <linearGradient id="bm-chrome-knob" x1="30" y1="0" x2="50" y2="0" gradientUnits="userSpaceOnUse">
                  <stop offset="0%"   stopColor="#e8eef0" />
                  <stop offset="40%"  stopColor="#9eadb4" />
                  <stop offset="100%" stopColor="#526068" />
                </linearGradient>
              </defs>
              <rect x="13" y="78" width="54" height="136" rx="6" ry="6" fill="url(#bm-chrome-body)" />
              <polygon points="13,78 67,78 58,56 22,56" fill="url(#bm-chrome-cap)" />
              <rect x="22" y="18" width="36" height="38" rx="3" ry="3" fill="url(#bm-chrome-cap)" />
              <polygon points="30,18 50,18 46,1 34,1" fill="url(#bm-chrome-knob)" />
              <line x1="13" y1="78" x2="67" y2="78" stroke="rgba(255,255,255,0.55)" strokeWidth="1.2" />
              <line x1="22" y1="56" x2="58" y2="56" stroke="rgba(255,255,255,0.45)" strokeWidth="1" />
              <line x1="22" y1="18" x2="58" y2="18" stroke="rgba(255,255,255,0.4)"  strokeWidth="0.8" />
              <rect x="13" y="108" width="54" height="6" fill="rgba(0,0,0,0.12)" />
              <line x1="13" y1="108" x2="67" y2="108" stroke="rgba(255,255,255,0.25)" strokeWidth="0.7" />
              <line x1="13" y1="114" x2="67" y2="114" stroke="rgba(255,255,255,0.25)" strokeWidth="0.7" />
              <rect x="16" y="82"  width="4" height="126" rx="2" fill="rgba(255,255,255,0.38)" />
              <rect x="25" y="21"  width="3" height="32"  rx="1.5" fill="rgba(255,255,255,0.32)" />
            </svg>
            <p className="bm-shaker-line">"{shakerLine}"</p>
          </div>
        )}

        {/* ── Category pick ── */}
        {phase === 'category-pick' && (
          <div className="bm-question-wrap" key="cat">
            <p className="bm-voice">"What are we making tonight?"</p>
            <h2 className="bm-question">Choose your drink</h2>
            <div className="bm-category-options">
              <button className="bm-cat-option" onClick={() => handleCategoryPick('cocktail')}>
                <span className="bm-cat-icon">🍸</span>
                <div>
                  <span className="bm-cat-label">Cocktails</span>
                  <span className="bm-cat-sub">Spirit-forward, classic or adventurous</span>
                </div>
              </button>
              <button className="bm-cat-option" onClick={() => handleCategoryPick('mocktail')}>
                <span className="bm-cat-icon">🧃</span>
                <div>
                  <span className="bm-cat-label">Mocktails</span>
                  <span className="bm-cat-sub">Zero proof, full flavor</span>
                </div>
              </button>
              <button className="bm-cat-option" onClick={() => handleCategoryPick('dirty-soda')}>
                <span className="bm-cat-icon">🥤</span>
                <div>
                  <span className="bm-cat-label">Dirty Sodas</span>
                  <span className="bm-cat-sub">Soda, syrup, and a cream float</span>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* ── Question ── */}
        {phase === 'question' && q && (
          <div key={animKey} className="bm-question-wrap">
            <p className="bm-step-count">{step + 1} / {currentQuestions.length}</p>
            <p className="bm-voice">"{q.voice}"</p>
            <h2 className="bm-question">{q.text}</h2>
            <div className="bm-options">
              {q.options.map(opt => (
                <button
                  key={opt.value}
                  className="bm-option"
                  onClick={() => handleAnswer(q.key, opt.value)}
                >
                  <span className="bm-option-label">{opt.label}</span>
                  {opt.sub && <span className="bm-option-sub">{opt.sub}</span>}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Reveal — 3 options ── */}
        {phase === 'reveal' && recs.length > 0 && (
          <div className="bm-reveal">
            <p className="bm-reveal-label">Your top picks tonight</p>
            <div className="bm-rec-cards">
              {recs.map((r, i) => (
                <div key={r.name} className={`bm-rec-card${i === 0 ? ' bm-rec-card--top' : ''}`}>
                  {i === 0 && <span className="bm-rec-badge">Best match</span>}
                  <h3 className="bm-rec-name">{r.name}</h3>
                  <span className="bm-rec-calories">~{calculateCaloriesFromStrings(r.ingredients)} cal</span>
                  <p className="bm-rec-desc">{r.description}</p>
                  <button
                    className="bm-rec-pick"
                    onClick={() => { setRec(r); setPhase('recipe'); }}
                  >
                    Make this →
                  </button>
                </div>
              ))}
            </div>
            <button className="bm-reveal-restart" onClick={handleRestart}>
              Ask again
            </button>
          </div>
        )}

        {/* ── Recipe ── */}
        {phase === 'recipe' && rec && (
          <div className="bm-recipe">
            <p className="bm-recipe-eyebrow">How to make it</p>
            <h2 className="bm-recipe-name">{rec.name}</h2>
            <p className="bm-recipe-desc">{rec.description}</p>

            <div className="bm-recipe-divider" />

            <div className="bm-recipe-section">
              <h3 className="bm-recipe-section-title">Ingredients</h3>
              <ul className="bm-recipe-ingredients">
                {rec.ingredients.map(ing => (
                  <li key={ing} className="bm-recipe-ingredient">
                    <span className="bm-recipe-ingredient-dot" />
                    {ing}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bm-recipe-section">
              <h3 className="bm-recipe-section-title">Instructions</h3>
              <ol className="bm-recipe-steps">
                {rec.steps.map((step, i) => (
                  <li key={i} className="bm-recipe-step">
                    <span className="bm-recipe-step-num">{i + 1}</span>
                    <span className="bm-recipe-step-text">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="bm-recipe-actions">
              <button className="bm-recipe-restart" onClick={handleRestart}>
                Ask again
              </button>
              <button className="bm-recipe-close" onClick={handleClose}>
                Close
              </button>
            </div>
          </div>
        )}

      </div>

      {showSurvey && rec && (
        <DrinkSurvey
          recipeName={rec.name}
          userId={user?.id ?? null}
          onDismiss={() => { setShowSurvey(false); setSurveyDone(true); }}
        />
      )}
    </div>
  );
}
