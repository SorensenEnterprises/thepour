import { supabase } from './supabase';

// ── Types ────────────────────────────────────────────────────────────────────

export type BottleType =
  | 'Vodka'
  | 'Bourbon'
  | 'Gin'
  | 'Rum'
  | 'Tequila'
  | 'Mezcal'
  | 'Scotch'
  | 'Whiskey'
  | 'Liqueur'
  | 'Wine'
  | 'Beer'
  | 'Mixer'
  | 'Energy Drink'
  | 'Other';

export interface RecognizedBottle {
  name:       string;
  brand:      string;
  type:       BottleType;
  size_ml:    number;
  confidence: 'high' | 'medium' | 'low';
}

export interface SingleRecognitionResult {
  bottle:      RecognizedBottle | null;
  rawResponse: string;
  rawData:     string;
  rawError:    string;
  error:       string | null;
}

export interface ShelfRecognitionResult {
  bottles:     RecognizedBottle[];
  rawResponse: string;
  rawData:     string;
  rawError:    string;
  error:       string | null;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

// Returns exact Ingredient['category'] values used by the inventory system.
export const mapBottleType = (aiType: string): 'spirit' | 'liqueur' | 'mixer' | 'other' => {
  const type = aiType.toLowerCase().trim();
  const spiritKeywords = [
    'gin', 'vodka', 'rum', 'tequila', 'mezcal', 'whiskey', 'whisky',
    'bourbon', 'scotch', 'rye', 'brandy', 'cognac', 'calvados',
    'absinthe', 'grappa', 'pisco', 'cachaca', 'baijiu', 'soju',
    'aquavit', 'schnapps', 'armagnac',
  ];
  const liqueurKeywords = [
    'liqueur', 'triple sec', 'cointreau', 'amaretto', 'kahlua',
    'baileys', 'campari', 'aperol', 'vermouth', 'amaro', 'chartreuse',
    'benedictine', 'drambuie', 'frangelico', 'sambuca', 'limoncello',
    'curacao', 'maraschino', 'falernum', 'elderflower', 'chambord',
  ];
  const mixerKeywords = [
    'mixer', 'tonic', 'soda', 'juice', 'syrup', 'bitters',
    'ginger beer', 'ginger ale', 'cola', 'lemon-lime', 'energy drink',
    'red bull', 'monster', 'celsius',
  ];

  if (spiritKeywords.some(k => type.includes(k)))  return 'spirit';
  if (liqueurKeywords.some(k => type.includes(k))) return 'liqueur';
  if (mixerKeywords.some(k => type.includes(k)))   return 'mixer';
  return 'spirit'; // default unrecognised bottles to spirit
};

// Maps AI type+brand to a SPIRIT_TYPES / LIQUEUR_TYPES / FORTIFIED_TYPES value
// so useInventory can expand it to canonical recipe ingredient IDs.
export const mapBottleToSpiritType = (aiType: string, brand: string = ''): string => {
  const text = `${aiType} ${brand}`.toLowerCase().trim();

  // Whiskey — most specific first
  if (text.includes('bourbon'))                                               return 'bourbon';
  if (text.includes('rye whiskey') || text.includes('rye whisky'))           return 'rye-whiskey';
  if (text.includes('irish whiskey') || text.includes('irish whisky'))       return 'irish-whiskey';
  if (text.includes('islay') || text.includes('peated'))                     return 'scotch-peated';
  if (text.includes('scotch') || text.includes('blended whisky'))            return 'scotch-blended';
  if (text.includes('japanese whisky') || text.includes('japanese whiskey')) return 'japanese-whisky';
  if (text.includes('whiskey') || text.includes('whisky'))                   return 'bourbon';

  // Tequila
  if (text.includes('reposado'))                                return 'tequila-reposado';
  if (text.includes('añejo') || text.includes('anejo'))         return 'tequila-anejo';
  if (text.includes('tequila'))                                 return 'tequila-blanco';

  // Other spirits
  if (text.includes('mezcal'))                                  return 'mezcal';
  if (text.includes('old tom'))                                 return 'gin-old-tom';
  if (text.includes('navy strength'))                           return 'gin-navy';
  if (text.includes('gin'))                                     return 'gin-london-dry';
  if (text.includes('white rum') || text.includes('light rum') || text.includes('silver rum')) return 'rum-white';
  if (text.includes('dark rum')  || text.includes('black rum')) return 'rum-dark';
  if (text.includes('aged rum'))                                return 'rum-aged';
  if (text.includes('spiced rum'))                              return 'rum-spiced';
  if (text.includes('rum'))                                     return 'rum-white';
  if (text.includes('vodka'))                                   return 'vodka';
  if (text.includes('cognac') || text.includes('brandy') || text.includes('armagnac') || text.includes('calvados')) return 'cognac-brandy';

  // Liqueurs & fortified
  if (text.includes('triple sec') || text.includes('cointreau') || text.includes('curacao')) return 'triple-sec';
  if (text.includes('kahlua') || text.includes('coffee liqueur')) return 'coffee-liqueur';
  if (text.includes('baileys')  || text.includes('irish cream'))  return 'irish-cream';
  if (text.includes('amaretto'))                                   return 'amaretto';
  if (text.includes('elderflower') || text.includes('st. germain') || text.includes('st germain')) return 'elderflower';
  if (text.includes('peach schnapps'))                             return 'peach-schnapps';
  if (text.includes('campari'))                                    return 'campari-l';
  if (text.includes('aperol'))                                     return 'aperol-l';
  if (text.includes('chambord'))                                   return 'chambord';
  if (text.includes('sweet vermouth') || text.includes('rosso'))  return 'sweet-vermouth';
  if (text.includes('dry vermouth')   || text.includes('bianco') || text.includes('blanc vermouth')) return 'dry-vermouth';
  if (text.includes('vermouth'))                                   return 'sweet-vermouth';
  if (text.includes('fino') || text.includes('manzanilla') || text.includes('dry sherry')) return 'dry-sherry';
  if (text.includes('cream sherry'))                               return 'cream-sherry';
  if (text.includes('port'))                                       return 'port';

  return '';
};

const cleanJson = (text: string): string =>
  text
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim();

// ── Edge function call ────────────────────────────────────────────────────────

interface EdgeResult {
  text:     string;
  raw:      string;
  rawData:  string;
  rawError: string;
}

async function callEdgeFunction(imageBase64: string, mode: 'single' | 'shelf'): Promise<EdgeResult> {
  console.log('[bottleRecognition] supabase client:', supabase);
  console.log('[bottleRecognition] invoking identify-bottles with mode:', mode);
  console.log('[bottleRecognition] image size:', imageBase64.length, 'chars');

  const { data, error } = await supabase.functions.invoke('identify-bottles', {
    body: { imageBase64, mode },
  });

  console.log('[bottleRecognition] invoke result - data:', data);
  console.log('[bottleRecognition] invoke result - error:', error);

  const rawData  = data  ? JSON.stringify(data)  : '(null)';
  const rawError = error ? JSON.stringify({ message: error.message, name: error.name, context: String((error as any).context) }) : '(null)';
  const raw      = JSON.stringify({ data, error: error ? { message: error.message, name: error.name } : null });

  console.log('[bottleRecognition] rawData:', rawData);
  console.log('[bottleRecognition] rawError:', rawError);

  if (error) {
    throw Object.assign(new Error(`Edge function error: ${error.message}`), { rawData, rawError });
  }
  if (data?.error) {
    throw Object.assign(new Error(`Server error: ${data.error}`), { rawData, rawError });
  }

  const text: string = data?.result ?? '';
  return { text, raw, rawData, rawError };
}

// ── Public API ───────────────────────────────────────────────────────────────

export async function recognizeSingleBottle(base64: string): Promise<SingleRecognitionResult> {
  let raw = ''; let rawData = ''; let rawError = '';
  try {
    const result = await callEdgeFunction(base64, 'single');
    raw = result.raw; rawData = result.rawData; rawError = result.rawError;
    console.log('[bottleRecognition] Single content text:', result.text);
    const parsed = JSON.parse(cleanJson(result.text));
    if (parsed.error) {
      return { bottle: null, rawResponse: raw, rawData, rawError, error: `Model returned: ${parsed.error}` };
    }
    return { bottle: parsed as RecognizedBottle, rawResponse: raw, rawData, rawError, error: null };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    rawData  = (err as any).rawData  ?? rawData;
    rawError = (err as any).rawError ?? rawError;
    console.error('[bottleRecognition] recognizeSingleBottle error:', err);
    return { bottle: null, rawResponse: raw, rawData, rawError, error: msg };
  }
}

export async function recognizeShelf(base64: string): Promise<ShelfRecognitionResult> {
  let raw = ''; let rawData = ''; let rawError = '';
  try {
    const result = await callEdgeFunction(base64, 'shelf');
    raw = result.raw; rawData = result.rawData; rawError = result.rawError;
    console.log('[bottleRecognition] Shelf content text:', result.text);
    const parsed = JSON.parse(cleanJson(result.text));
    if (!Array.isArray(parsed)) {
      console.warn('[bottleRecognition] Response was not an array:', parsed);
      return { bottles: [], rawResponse: raw, rawData, rawError, error: `Expected array, got: ${result.text.slice(0, 200)}` };
    }
    return { bottles: parsed as RecognizedBottle[], rawResponse: raw, rawData, rawError, error: null };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    rawData  = (err as any).rawData  ?? rawData;
    rawError = (err as any).rawError ?? rawError;
    console.error('[bottleRecognition] recognizeShelf error:', err);
    return { bottles: [], rawResponse: raw, rawData, rawError, error: msg };
  }
}

export function bottleToIngredientIds(bottle: RecognizedBottle): string[] {
  switch (bottle.type) {
    case 'Vodka':        return ['vodka'];
    case 'Bourbon':      return ['bourbon'];
    case 'Gin':          return ['gin'];
    case 'Rum':          return ['rum-white', 'rum-dark', 'rum-aged'];
    case 'Tequila':      return ['tequila'];
    case 'Mezcal':       return ['mezcal'];
    case 'Scotch':       return ['scotch', 'islay-scotch'];
    case 'Whiskey':      return ['rye-whiskey', 'bourbon', 'scotch'];
    case 'Liqueur':      return [
      'triple-sec',
      'campari',
      'aperol',
      'maraschino-liqueur',
      'sweet-vermouth',
      'dry-vermouth',
      'green-chartreuse',
      'yellow-chartreuse',
    ];
    case 'Energy Drink': {
      const text = `${bottle.name} ${bottle.brand}`.toLowerCase();
      if (text.includes('red bull') || text.includes('redbull')) {
        if (text.includes('sugar free') || text.includes('sugarfree') || text.includes('zero')) return ['red-bull-sugar-free'];
        if (text.includes('peach'))           return ['red-bull-peach'];
        return ['red-bull'];
      }
      if (text.includes('monster')) {
        if (text.includes('ultra white') || text.includes('white ultra')) return ['monster-ultra-white'];
        return ['monster-energy'];
      }
      if (text.includes('celsius'))      return ['celsius-energy'];
      if (text.includes('liquid death')) return ['liquid-death'];
      return ['energy-drink'];
    }
    case 'Wine':
    case 'Beer':
    case 'Mixer':
    case 'Other':
    default:
      return [];
  }
}
