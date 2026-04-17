import React, { useState, useEffect, useRef } from 'react';
import './BartenderModal.css';

// ── Types ────────────────────────────────────────────────────────────────────

type Mood          = 'sweet' | 'sour' | 'bitter' | 'savory';
type Spirit        = 'brown' | 'clear' | 'agave'  | 'any';
type Style         = 'classic' | 'adventurous';
type Method        = 'stirred' | 'shaken' | 'either';
type Strength      = 'light'   | 'balanced' | 'bold';
type Phase         = 'category-pick' | 'question' | 'shaking' | 'reveal';
type DrinkCategory = 'cocktail' | 'mocktail' | 'dirty-soda';
type MocktailVibe  = 'fruity' | 'citrus' | 'herbal' | 'fizzy';
type MocktailBase  = 'sparkling' | 'still' | 'tea';
type MocktailSweet = 'light' | 'medium' | 'sweet';
type SodaBase      = 'sprite' | 'drpepper' | 'coke' | 'orange';
type SodaFlavor    = 'coconut' | 'berry' | 'peach' | 'citrus';
type SodaCream     = 'yes' | 'no';

interface Answers {
  mood?:     Mood;
  spirit?:   Spirit;
  style?:    Style;
  method?:   Method;
  strength?: Strength;
}

interface CocktailRec {
  name:        string;
  voice:       string;
  ingredients: string[];
  moods:       Mood[];
  spirits:     Spirit[];
  styles:      Style[];
  methods:     Method[];
  strengths:   Strength[];
}

interface MocktailRec {
  name:        string;
  voice:       string;
  ingredients: string[];
  vibes:       MocktailVibe[];
  bases:       MocktailBase[];
  sweets:      MocktailSweet[];
}

interface DirtySodaRec {
  name:        string;
  voice:       string;
  ingredients: string[];
  bases:       SodaBase[];
  flavors:     SodaFlavor[];
  creams:      SodaCream[];
}

type DrinkRec = { name: string; voice: string; ingredients: string[] };

// ── Cocktail Library ─────────────────────────────────────────────────────────

const COCKTAILS: CocktailRec[] = [
  {
    name: 'Old Fashioned',
    voice: "Whiskey dressed just enough to make an impression. There's a reason this one never goes out of style.",
    ingredients: ['2 oz Bourbon', '¼ oz Simple Syrup', '2 dashes Angostura Bitters', 'Orange peel'],
    moods: ['bitter', 'sweet'], spirits: ['brown'], styles: ['classic'],
    methods: ['stirred'], strengths: ['bold'],
  },
  {
    name: 'Manhattan',
    voice: "Serious, sophisticated, a little dangerous. The kind of drink you order when you've already decided you're staying.",
    ingredients: ['2 oz Rye Whiskey', '1 oz Sweet Vermouth', '2 dashes Angostura Bitters', 'Maraschino cherry'],
    moods: ['bitter', 'sweet'], spirits: ['brown'], styles: ['classic'],
    methods: ['stirred'], strengths: ['balanced', 'bold'],
  },
  {
    name: 'Whiskey Sour',
    voice: "All the warmth of whiskey with a citrus wake-up call. Comfort food for your glass.",
    ingredients: ['2 oz Bourbon', '¾ oz Fresh Lemon Juice', '¾ oz Simple Syrup', 'Egg white (optional)'],
    moods: ['sour'], spirits: ['brown'], styles: ['classic'],
    methods: ['shaken'], strengths: ['balanced'],
  },
  {
    name: 'Paper Plane',
    voice: "Equal parts everything — it shouldn't work this well, but it does. Every single time.",
    ingredients: ['¾ oz Bourbon', '¾ oz Aperol', '¾ oz Amaro Nonino', '¾ oz Fresh Lemon Juice'],
    moods: ['sour', 'bitter'], spirits: ['brown'], styles: ['adventurous'],
    methods: ['shaken'], strengths: ['balanced'],
  },
  {
    name: 'Penicillin',
    voice: "Honey and ginger chase the smoke around the glass. Complex, warming, utterly unforgettable.",
    ingredients: ['2 oz Blended Scotch', '¾ oz Fresh Lemon Juice', '¾ oz Honey-Ginger Syrup', '¼ oz Islay Scotch float'],
    moods: ['sour', 'savory'], spirits: ['brown'], styles: ['adventurous'],
    methods: ['shaken'], strengths: ['bold'],
  },
  {
    name: 'Negroni',
    voice: "Bitter, bold, beautiful. You asked for something that pushes back — here it is.",
    ingredients: ['1 oz Gin', '1 oz Campari', '1 oz Sweet Vermouth', 'Orange peel'],
    moods: ['bitter'], spirits: ['clear'], styles: ['classic'],
    methods: ['stirred'], strengths: ['bold'],
  },
  {
    name: 'Gin & Tonic',
    voice: "Simple. Honest. Exactly as refreshing as you need it to be right now.",
    ingredients: ['2 oz Gin', '4 oz Tonic Water', 'Lime wedge'],
    moods: ['bitter', 'sweet'], spirits: ['clear'], styles: ['classic'],
    methods: ['stirred', 'either'], strengths: ['light'],
  },
  {
    name: 'Last Word',
    voice: "Four spirits walk into a bar and somehow agree on everything. A Prohibition-era miracle.",
    ingredients: ['¾ oz Gin', '¾ oz Green Chartreuse', '¾ oz Maraschino Liqueur', '¾ oz Fresh Lime Juice'],
    moods: ['sour', 'bitter'], spirits: ['clear'], styles: ['adventurous'],
    methods: ['shaken'], strengths: ['balanced'],
  },
  {
    name: 'Espresso Martini',
    voice: "Stay sharp, stay social. This one hits like a good conversation — caffeinated and a little dangerous.",
    ingredients: ['1½ oz Vodka', '1 oz Coffee Liqueur', '1 oz Fresh Espresso', '3 coffee beans'],
    moods: ['sweet', 'savory'], spirits: ['clear'], styles: ['adventurous'],
    methods: ['shaken'], strengths: ['bold'],
  },
  {
    name: 'Gimlet',
    voice: "Gin and lime at their most honest — clean, tart, and utterly no-nonsense.",
    ingredients: ['2 oz Gin', '¾ oz Fresh Lime Juice', '¾ oz Simple Syrup', 'Lime wheel'],
    moods: ['sour'], spirits: ['clear'], styles: ['classic'],
    methods: ['shaken'], strengths: ['balanced'],
  },
  {
    name: 'Margarita',
    voice: "Agave, acid, salt. The holy trinity. You can't go wrong, and you never will.",
    ingredients: ['2 oz Tequila Blanco', '1 oz Triple Sec', '¾ oz Fresh Lime Juice', 'Salt rim'],
    moods: ['sour', 'sweet'], spirits: ['agave'], styles: ['classic'],
    methods: ['shaken'], strengths: ['balanced'],
  },
  {
    name: 'Paloma',
    voice: "The drink Mexico actually drinks. Grapefruit and tequila — bright, alive, and criminally underrated.",
    ingredients: ['2 oz Tequila Blanco', '2 oz Fresh Grapefruit Juice', '½ oz Lime Juice', '½ oz Simple Syrup', 'Soda water'],
    moods: ['sweet', 'sour'], spirits: ['agave'], styles: ['classic'],
    methods: ['shaken', 'either'], strengths: ['light'],
  },
  {
    name: 'Mezcal Negroni',
    voice: "The classic's smokier alter ego. Everything you love about a Negroni, with fire underneath.",
    ingredients: ['1 oz Mezcal', '1 oz Campari', '1 oz Sweet Vermouth', 'Orange peel'],
    moods: ['bitter', 'savory'], spirits: ['agave'], styles: ['adventurous'],
    methods: ['stirred'], strengths: ['bold'],
  },
  {
    name: "Tommy's Margarita",
    voice: "Pure agave, nothing in the way. This is what tequila tastes like when it's allowed to speak.",
    ingredients: ['2 oz Tequila Blanco', '1 oz Fresh Lime Juice', '½ oz Agave Syrup', 'Lime wheel'],
    moods: ['sour'], spirits: ['agave'], styles: ['classic', 'adventurous'],
    methods: ['shaken'], strengths: ['balanced'],
  },
  {
    name: 'Daiquiri',
    voice: "Three ingredients, zero compromises. Rum and lime have been doing this together since Havana had secrets.",
    ingredients: ['2 oz White Rum', '¾ oz Fresh Lime Juice', '¾ oz Simple Syrup'],
    moods: ['sour'], spirits: ['any'], styles: ['classic'],
    methods: ['shaken'], strengths: ['balanced'],
  },
  {
    name: 'Dark & Stormy',
    voice: "Dark rum and spicy ginger — you wanted bold and we're delivering atmospheric. This one has weather.",
    ingredients: ['2 oz Dark Rum', '4 oz Ginger Beer', '½ oz Lime Juice', 'Lime wedge'],
    moods: ['sweet', 'savory'], spirits: ['any'], styles: ['classic'],
    methods: ['either'], strengths: ['bold'],
  },
];

// ── Scoring ──────────────────────────────────────────────────────────────────

function getRecommendation(answers: Required<Answers>): CocktailRec {
  const scored = COCKTAILS.map(c => {
    let score = 0;
    if (c.moods.includes(answers.mood))                                                         score += 3;
    if (answers.spirit === 'any' || c.spirits.includes(answers.spirit) || c.spirits.includes('any')) score += 3;
    if (c.styles.includes(answers.style))                                                       score += 2;
    if (answers.method === 'either' || c.methods.includes(answers.method) || c.methods.includes('either')) score += 1;
    if (c.strengths.includes(answers.strength))                                                 score += 2;
    return { c, score };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored[0].c;
}

// ── Mocktail Library ─────────────────────────────────────────────────────────

const MOCKTAILS: MocktailRec[] = [
  { name: 'Virgin Mojito',       voice: "Fresh mint, lime, and bubbles. Proof you don't need the rum.",
    ingredients: ['8 Mint Leaves', '1 oz Fresh Lime Juice', '¾ oz Simple Syrup', '4 oz Soda Water'],
    vibes: ['herbal', 'citrus'], bases: ['sparkling'], sweets: ['light'] },
  { name: 'Shirley Temple',      voice: "The original crowd-pleaser. Ginger ale, grenadine, and absolutely no apologies.",
    ingredients: ['4 oz Ginger Ale', '1 oz OJ', '½ oz Grenadine', 'Maraschino Cherry'],
    vibes: ['fruity', 'fizzy'], bases: ['sparkling'], sweets: ['sweet'] },
  { name: 'Arnold Palmer',       voice: "Half iced tea, half lemonade. The greatest accidental invention in beverage history.",
    ingredients: ['4 oz Iced Tea', '4 oz Fresh Lemonade', 'Lemon Wheel'],
    vibes: ['citrus'], bases: ['tea'], sweets: ['light', 'medium'] },
  { name: 'Cucumber Cooler',     voice: "Crisp, clean, impossibly refreshing. The drink that makes you feel like a wellness person.",
    ingredients: ['4 Cucumber Slices', '¾ oz Fresh Lime Juice', '½ oz Simple Syrup', '4 oz Soda Water', '4 Mint Leaves'],
    vibes: ['herbal', 'citrus'], bases: ['sparkling'], sweets: ['light'] },
  { name: 'Watermelon Lemonade', voice: "Summer in a glass. No further explanation needed.",
    ingredients: ['4 oz Fresh Watermelon Juice', '¾ oz Lemon Juice', '½ oz Simple Syrup', 'Splash of Soda Water'],
    vibes: ['fruity', 'citrus'], bases: ['still'], sweets: ['medium'] },
  { name: 'Spicy Ginger Mule',   voice: "Ginger beer and lime with a chili kick. The mocktail that bites back.",
    ingredients: ['6 oz Ginger Beer', '¾ oz Fresh Lime Juice', '¼ oz Simple Syrup', '2 Jalapeño Slices (optional)'],
    vibes: ['citrus', 'fizzy'], bases: ['sparkling'], sweets: ['light'] },
  { name: 'Berry Smash',         voice: "Muddled berries, honey, and lemon — messy, beautiful, and worth every drop.",
    ingredients: ['6 Mixed Berries', '¾ oz Fresh Lemon Juice', '¾ oz Honey Syrup', '3 oz Soda Water'],
    vibes: ['fruity'], bases: ['sparkling', 'still'], sweets: ['medium', 'sweet'] },
  { name: 'Seedlip Garden Spritz', voice: "A serious non-alcoholic spirit with elderflower tonic. Sophisticated and completely grown-up.",
    ingredients: ['1½ oz Seedlip Garden 108', '4 oz Elderflower Tonic', '3 Cucumber Slices', 'Thyme Sprig'],
    vibes: ['herbal', 'fizzy'], bases: ['sparkling'], sweets: ['light'] },
];

function getMocktailRec(answers: Record<string, string>): MocktailRec {
  const scored = MOCKTAILS.map(m => {
    let score = 0;
    if (m.vibes.includes(answers.vibe as MocktailVibe))   score += 3;
    if (m.bases.includes(answers.base as MocktailBase))   score += 2;
    if (m.sweets.includes(answers.sweet as MocktailSweet)) score += 2;
    return { m, score };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored[0].m;
}

// ── Dirty Soda Library ───────────────────────────────────────────────────────

const DIRTY_SODAS: DirtySodaRec[] = [
  { name: 'Dirty Dr Pepper',         voice: "Dr Pepper, coconut syrup, lime, and a cream float. The one that started it all.",
    ingredients: ['12 oz Dr Pepper', '1 oz Coconut Syrup', '½ oz Fresh Lime Juice', 'Heavy Cream Float'],
    bases: ['drpepper'], flavors: ['coconut'], creams: ['yes', 'no'] },
  { name: 'Utah Swirl',              voice: "Sprite and raspberry with a cream pour. The soda shop in Utah invented something great.",
    ingredients: ['12 oz Sprite', '1 oz Raspberry Syrup', '½ oz Fresh Lime Juice', 'Heavy Cream Float'],
    bases: ['sprite'], flavors: ['berry'], creams: ['yes'] },
  { name: 'Tropical Dirty Sprite',   voice: "Sprite and mango syrup with a coconut cream float. The beach in a cup.",
    ingredients: ['12 oz Sprite', '1 oz Mango Syrup', '¼ oz Fresh Lime Juice', 'Coconut Cream Float'],
    bases: ['sprite'], flavors: ['coconut'], creams: ['yes', 'no'] },
  { name: 'Cowboy Crush',            voice: "Orange Fanta, peach syrup, cream float. Sweet, peachy, completely irresistible.",
    ingredients: ['12 oz Orange Fanta', '1 oz Peach Syrup', 'Heavy Cream Float', 'Peach Slice'],
    bases: ['orange'], flavors: ['peach'], creams: ['yes'] },
  { name: 'Cherry Coke Float',       voice: "Cherry syrup in Coke with a cream pour. Diner nostalgia in a 32-ounce cup.",
    ingredients: ['12 oz Coca-Cola', '1 oz Cherry Syrup', 'Heavy Cream Float', 'Maraschino Cherry'],
    bases: ['coke'], flavors: ['berry'], creams: ['yes'] },
  { name: 'Mango Chili Sprite',      voice: "Sprite with mango syrup and a chili-lime rim. Sweet heat on every sip.",
    ingredients: ['12 oz Sprite', '1 oz Mango Syrup', '½ oz Fresh Lime Juice', 'Chili-Lime Rim'],
    bases: ['sprite'], flavors: ['citrus'], creams: ['no'] },
  { name: 'Peach Cream Dream',       voice: "Dr Pepper and peach with a generous cream pour. Southern comfort in soda form.",
    ingredients: ['12 oz Dr Pepper', '1 oz Peach Syrup', '1½ oz Heavy Cream', '¼ oz Vanilla Syrup (optional)'],
    bases: ['drpepper'], flavors: ['peach'], creams: ['yes'] },
  { name: 'Raspberry Limeade Smash', voice: "Sprite, raspberry syrup, fresh lime, muddled raspberries. Bright and beautiful.",
    ingredients: ['12 oz Sprite', '1 oz Raspberry Syrup', '¾ oz Fresh Lime Juice', '4 Fresh Raspberries'],
    bases: ['sprite'], flavors: ['berry'], creams: ['no', 'yes'] },
];

function getDirtySodaRec(answers: Record<string, string>): DirtySodaRec {
  const scored = DIRTY_SODAS.map(d => {
    let score = 0;
    if (d.bases.includes(answers.sodaBase as SodaBase))     score += 3;
    if (d.flavors.includes(answers.flavor as SodaFlavor))   score += 2;
    if (d.creams.includes(answers.cream as SodaCream))      score += 2;
    return { d, score };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored[0].d;
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
    key:     'method' as const,
    voice:   "This one matters more than you'd think.",
    text:    'Stirred or shaken?',
    options: [
      { label: 'Stirred',    sub: 'Silky, spirit-forward, elegant', value: 'stirred' as Method },
      { label: 'Shaken',     sub: 'Cold, aerated, lively',          value: 'shaken'  as Method },
      { label: 'Either Way', sub: "You trust my judgment",           value: 'either'  as Method },
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

const SPEAK_COCKTAIL_QUESTIONS = [
  "What's your mood tonight?",
  "And your spirit of choice?",
  "How do you like it?",
  "Stirred or shaken?",
  "How strong are we talking?",
];

const SPEAK_MOCKTAIL_QUESTIONS = [
  "What are you after tonight?",
  "Sparkling, still, or tea-based?",
  "How sweet do you want it?",
];

const SPEAK_DIRTY_SODA_QUESTIONS = [
  "What's your base soda?",
  "What direction are we going?",
  "Add cream to the top?",
];

function getSpeakQuestions(cat: DrinkCategory | null): string[] {
  if (cat === 'mocktail')   return SPEAK_MOCKTAIL_QUESTIONS;
  if (cat === 'dirty-soda') return SPEAK_DIRTY_SODA_QUESTIONS;
  return SPEAK_COCKTAIL_QUESTIONS;
}

// ── Speech helpers ────────────────────────────────────────────────────────────

function pickVoice(): SpeechSynthesisVoice | null {
  if (!window.speechSynthesis) return null;
  const voices = window.speechSynthesis.getVoices();
  const english = voices.filter(v => v.lang.startsWith('en'));
  const maleHints = ['alex', 'daniel', 'tom', 'james', 'david', 'george', 'fred', 'albert', 'rock', 'junior', 'bad news'];
  return (
    english.find(v => maleHints.some(h => v.name.toLowerCase().includes(h))) ??
    english[0] ??
    null
  );
}

function makeUtter(text: string): SpeechSynthesisUtterance {
  const u = new SpeechSynthesisUtterance(text);
  u.pitch  = 0.85;
  u.rate   = 0.9;
  u.volume = 1;
  const v = pickVoice();
  if (v) u.voice = v;
  return u;
}

// ── Component ────────────────────────────────────────────────────────────────

interface Props {
  onClose: () => void;
}

export function BartenderModal({ onClose }: Props) {
  const [phase, setPhase]         = useState<Phase>('category-pick');
  const [category, setCategory]   = useState<DrinkCategory | null>(null);
  const [step, setStep]           = useState(0);
  const [answers, setAnswers]     = useState<Record<string, string>>({});
  const [rec, setRec]             = useState<DrinkRec | null>(null);
  const [animKey, setAnimKey]     = useState(0);
  const [shakerLine, setShakerLine] = useState('');

  const revealTimerRef    = useRef<ReturnType<typeof setTimeout> | null>(null);
  const skipFirstRef      = useRef(true);
  const audioRef          = useRef<HTMLAudioElement | null>(null);
  const fadeFnRef         = useRef<ReturnType<typeof setInterval> | null>(null);

  // Stop all speech and pending timers
  function stopSpeech() {
    if (revealTimerRef.current) clearTimeout(revealTimerRef.current);
    window.speechSynthesis?.cancel();
  }

  // Fade music out over ~600 ms then call callback
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

  // Combined close: stop speech → fade music → close overlay
  function handleClose() {
    stopSpeech();
    fadeOutMusic(onClose);
  }

  // Background jazz on mount
  useEffect(() => {
    const audio = new Audio('/music/bartender-jazz.mp3');
    audio.loop   = true;
    audio.volume = 0.3;
    audioRef.current = audio;
    audio.play().catch(() => {});
    return () => {
      if (fadeFnRef.current) clearInterval(fadeFnRef.current);
      audio.pause();
      audio.src = '';
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Opening line on mount — no Q1 chain, category pick comes first
  useEffect(() => {
    const synth = window.speechSynthesis;
    if (!synth) return;
    synth.speak(makeUtter("Welcome. Tell me what you're after tonight."));
    return stopSpeech;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Each question (fires when animKey changes — set by handleCategoryPick and step advance)
  useEffect(() => {
    if (skipFirstRef.current) { skipFirstRef.current = false; return; }
    const synth = window.speechSynthesis;
    if (!synth || phase !== 'question') return;
    synth.cancel();
    synth.speak(makeUtter(getSpeakQuestions(category)[step]));
  }, [animKey]); // eslint-disable-line react-hooks/exhaustive-deps

  // Reveal: "I know just the thing." → 1 s pause → cocktail name
  useEffect(() => {
    if (phase !== 'reveal' || !rec) return;
    const synth = window.speechSynthesis;
    if (!synth) return;
    synth.cancel();
    const intro = makeUtter("I know just the thing.");
    intro.onend = () => {
      revealTimerRef.current = setTimeout(
        () => synth.speak(makeUtter(rec.name)),
        1000,
      );
    };
    synth.speak(intro);
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

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
        let result: DrinkRec;
        if (category === 'mocktail')   result = getMocktailRec(next);
        else if (category === 'dirty-soda') result = getDirtySodaRec(next);
        else result = getRecommendation(next as Required<Answers>);
        setRec(result);
        setPhase('reveal');
      }
    }, 820);
    return () => clearTimeout(timer);
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleRestart() {
    stopSpeech();
    if (fadeFnRef.current) clearInterval(fadeFnRef.current);
    const audio = audioRef.current;
    if (audio) { audio.volume = 0.3; if (audio.paused) audio.play().catch(() => {}); }
    setCategory(null);
    setStep(0);
    setAnswers({});
    setRec(null);
    setShakerLine('');
    setPhase('category-pick');
  }

  const currentQuestions = getQuestions(category);
  const q = currentQuestions[step];

  return (
    <div className="bm-overlay" onClick={e => { if (e.target === e.currentTarget) handleClose(); }}>
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

      <div className="bm-shell">

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

              {/* Body */}
              <rect x="13" y="78" width="54" height="136" rx="6" ry="6" fill="url(#bm-chrome-body)" />

              {/* Shoulder (trapezoid) */}
              <polygon points="13,78 67,78 58,56 22,56" fill="url(#bm-chrome-cap)" />

              {/* Cap */}
              <rect x="22" y="18" width="36" height="38" rx="3" ry="3" fill="url(#bm-chrome-cap)" />

              {/* Knob */}
              <polygon points="30,18 50,18 46,1 34,1" fill="url(#bm-chrome-knob)" />

              {/* Rim lines */}
              <line x1="13" y1="78" x2="67" y2="78" stroke="rgba(255,255,255,0.55)" strokeWidth="1.2" />
              <line x1="22" y1="56" x2="58" y2="56" stroke="rgba(255,255,255,0.45)" strokeWidth="1" />
              <line x1="22" y1="18" x2="58" y2="18" stroke="rgba(255,255,255,0.4)"  strokeWidth="0.8" />

              {/* Etched band on body */}
              <rect x="13" y="108" width="54" height="6" fill="rgba(0,0,0,0.12)" />
              <line x1="13" y1="108" x2="67" y2="108" stroke="rgba(255,255,255,0.25)" strokeWidth="0.7" />
              <line x1="13" y1="114" x2="67" y2="114" stroke="rgba(255,255,255,0.25)" strokeWidth="0.7" />

              {/* Left highlight stripe — body */}
              <rect x="16" y="82"  width="4" height="126" rx="2" fill="rgba(255,255,255,0.38)" />
              {/* Left highlight stripe — cap */}
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

        {/* ── Reveal ── */}
        {phase === 'reveal' && rec && (
          <div className="bm-reveal">
            <p className="bm-reveal-label">Tonight's recommendation</p>
            <h2 className="bm-reveal-name">{rec.name}</h2>
            <p className="bm-reveal-line">"{rec.voice}"</p>
            <div className="bm-reveal-divider" />
            <div className="bm-reveal-ingredients">
              {rec.ingredients.map(ing => (
                <span key={ing} className="bm-ingredient-chip">{ing}</span>
              ))}
            </div>
            <button className="bm-reveal-cta" onClick={handleClose}>
              Make this tonight →
            </button>
            <button className="bm-reveal-restart" onClick={handleRestart}>
              Ask again
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
