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

// ── Prompts ──────────────────────────────────────────────────────────────────

const SINGLE_SYSTEM_PROMPT = `You are a spirits and beverage identification expert. Identify the bottle in this photo and return ONLY a valid JSON object with no preamble, explanation, or markdown formatting:
{"name":"full product name e.g. Grey Goose Vodka","brand":"brand name e.g. Grey Goose","type":"one of: Vodka, Bourbon, Gin, Rum, Tequila, Mezcal, Scotch, Whiskey, Liqueur, Wine, Beer, Mixer, Energy Drink, Other","size_ml":750,"confidence":"high, medium, or low"}
If you cannot identify the bottle return: {"error":"unidentified"}`;

const SHELF_SYSTEM_PROMPT = `You are an expert at identifying alcoholic beverage bottles. Look carefully at this image. Identify EVERY bottle, can, or beverage container you can see, even if partially visible or the label is not fully clear. Make your best identification attempt for each one. Return ONLY a valid JSON array with no other text. Each item: { "name": "full product name", "brand": "brand name", "type": "one of: Vodka, Bourbon, Gin, Rum, Tequila, Mezcal, Scotch, Whiskey, Liqueur, Wine, Beer, Mixer, Energy Drink, Other", "size_ml": 750, "confidence": "high, medium, or low" }. If genuinely no bottles exist return [].`;

// ── API call ─────────────────────────────────────────────────────────────────

const ANTHROPIC_API_KEY = process.env.REACT_APP_ANTHROPIC_API_KEY;

interface VisionResult {
  text: string;
  raw:  string;
}

async function callVision(base64: string, systemPrompt: string): Promise<VisionResult> {
  console.log('[bottleRecognition] Image size (chars):', base64.length);
  console.log('[bottleRecognition] API key present:', !!ANTHROPIC_API_KEY);

  const requestBody = {
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    system: systemPrompt,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: { type: 'base64', media_type: 'image/jpeg', data: base64 },
          },
          { type: 'text', text: 'Identify the bottle(s).' },
        ],
      },
    ],
  };

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY!,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify(requestBody),
  });

  const data = await res.json();
  const raw = JSON.stringify(data);
  console.log('[bottleRecognition] Raw API response:', raw);

  if (!res.ok) {
    console.error('[bottleRecognition] API error status:', res.status, data);
    throw new Error(`API ${res.status}: ${raw}`);
  }

  const text = data.content?.[0]?.text ?? '';
  return { text, raw };
}

// ── Public API ───────────────────────────────────────────────────────────────

export async function recognizeSingleBottle(base64: string): Promise<SingleRecognitionResult> {
  if (!ANTHROPIC_API_KEY) {
    const msg = 'No API key configured';
    console.warn('[bottleRecognition]', msg);
    return { bottle: null, rawResponse: '', error: msg };
  }
  let raw = '';
  try {
    const { text, raw: rawRes } = await callVision(base64, SINGLE_SYSTEM_PROMPT);
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
  if (!ANTHROPIC_API_KEY) {
    const msg = 'No API key configured';
    console.warn('[bottleRecognition]', msg);
    return { bottles: [], rawResponse: '', error: msg };
  }
  let raw = '';
  try {
    const { text, raw: rawRes } = await callVision(base64, SHELF_SYSTEM_PROMPT);
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
