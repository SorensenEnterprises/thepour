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
    const parsed = JSON.parse(result.text.trim());
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
    const parsed = JSON.parse(result.text.trim());
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
    case 'Wine':
    case 'Beer':
    case 'Mixer':
    case 'Energy Drink':
    case 'Other':
    default:
      return [];
  }
}
