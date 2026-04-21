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
  error:       string | null;
}

export interface ShelfRecognitionResult {
  bottles:     RecognizedBottle[];
  rawResponse: string;
  error:       string | null;
}

// ── Edge function call ────────────────────────────────────────────────────────

async function callEdgeFunction(
  imageBase64: string,
  mode: 'single' | 'shelf',
): Promise<{ text: string; raw: string }> {
  console.log('[bottleRecognition] Calling edge function, mode:', mode, 'image chars:', imageBase64.length);

  const { data, error } = await supabase.functions.invoke('identify-bottles', {
    body: { imageBase64, mode },
  });

  const raw = JSON.stringify(data ?? error);
  console.log('[bottleRecognition] Edge function response:', raw);

  if (error) {
    throw new Error(`Edge function error: ${error.message}`);
  }
  if (data?.error) {
    throw new Error(`Server error: ${data.error}`);
  }

  const text: string = data?.result ?? '';
  return { text, raw };
}

// ── Public API ───────────────────────────────────────────────────────────────

export async function recognizeSingleBottle(base64: string): Promise<SingleRecognitionResult> {
  let raw = '';
  try {
    const { text, raw: rawRes } = await callEdgeFunction(base64, 'single');
    raw = rawRes;
    console.log('[bottleRecognition] Single content text:', text);
    const parsed = JSON.parse(text.trim());
    if (parsed.error) {
      return { bottle: null, rawResponse: raw, error: `Model returned: ${parsed.error}` };
    }
    return { bottle: parsed as RecognizedBottle, rawResponse: raw, error: null };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[bottleRecognition] recognizeSingleBottle error:', err);
    return { bottle: null, rawResponse: raw, error: msg };
  }
}

export async function recognizeShelf(base64: string): Promise<ShelfRecognitionResult> {
  let raw = '';
  try {
    const { text, raw: rawRes } = await callEdgeFunction(base64, 'shelf');
    raw = rawRes;
    console.log('[bottleRecognition] Shelf content text:', text);
    const parsed = JSON.parse(text.trim());
    if (!Array.isArray(parsed)) {
      console.warn('[bottleRecognition] Response was not an array:', parsed);
      return { bottles: [], rawResponse: raw, error: `Expected array, got: ${text.slice(0, 200)}` };
    }
    return { bottles: parsed as RecognizedBottle[], rawResponse: raw, error: null };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[bottleRecognition] recognizeShelf error:', err);
    return { bottles: [], rawResponse: raw, error: msg };
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
