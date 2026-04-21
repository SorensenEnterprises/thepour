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

// ── Prompts ──────────────────────────────────────────────────────────────────

const SINGLE_SYSTEM_PROMPT = `You are a spirits and beverage identification expert. Identify the bottle in this photo and return ONLY a valid JSON object with no preamble, explanation, or markdown formatting:
{"name":"full product name e.g. Grey Goose Vodka","brand":"brand name e.g. Grey Goose","type":"one of: Vodka, Bourbon, Gin, Rum, Tequila, Mezcal, Scotch, Whiskey, Liqueur, Wine, Beer, Mixer, Energy Drink, Other","size_ml":750,"confidence":"high, medium, or low"}
If you cannot identify the bottle return: {"error":"unidentified"}`;

const SHELF_SYSTEM_PROMPT = `You are an expert at identifying alcoholic beverage bottles. Look carefully at this image. Identify EVERY bottle, can, or beverage container you can see, even if partially visible or the label is not fully clear. Make your best identification attempt for each one. Return ONLY a valid JSON array with no other text. Each item: { "name": "full product name", "brand": "brand name", "type": "one of: Vodka, Bourbon, Gin, Rum, Tequila, Mezcal, Scotch, Whiskey, Liqueur, Wine, Beer, Mixer, Energy Drink, Other", "size_ml": 750, "confidence": "high, medium, or low" }. If genuinely no bottles exist return [].`;

// ── API call ─────────────────────────────────────────────────────────────────

const ANTHROPIC_API_KEY = process.env.REACT_APP_ANTHROPIC_API_KEY;

async function callVision(base64: string, systemPrompt: string): Promise<string> {
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

  console.log('[bottleRecognition] Request body (image truncated):', {
    ...requestBody,
    messages: requestBody.messages.map(m => ({
      ...m,
      content: Array.isArray(m.content)
        ? m.content.map((c: any) =>
            c.type === 'image'
              ? { ...c, source: { ...c.source, data: c.source.data.slice(0, 40) + '...' } }
              : c
          )
        : m.content,
    })),
  });

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
  console.log('[bottleRecognition] Raw API response:', JSON.stringify(data));

  if (!res.ok) {
    console.error('[bottleRecognition] API error status:', res.status, data);
    throw new Error(`API error ${res.status}: ${JSON.stringify(data)}`);
  }

  return data.content?.[0]?.text ?? '';
}

// ── Public API ───────────────────────────────────────────────────────────────

export async function recognizeSingleBottle(base64: string): Promise<RecognizedBottle | null> {
  if (!ANTHROPIC_API_KEY) {
    console.warn('[bottleRecognition] No API key — skipping recognition');
    return null;
  }
  try {
    const text = await callVision(base64, SINGLE_SYSTEM_PROMPT);
    console.log('[bottleRecognition] Single parsed text:', text);
    const parsed = JSON.parse(text.trim());
    if (parsed.error) return null;
    return parsed as RecognizedBottle;
  } catch (err) {
    console.error('[bottleRecognition] recognizeSingleBottle error:', err);
    return null;
  }
}

export async function recognizeShelf(base64: string): Promise<RecognizedBottle[]> {
  if (!ANTHROPIC_API_KEY) {
    console.warn('[bottleRecognition] No API key — skipping recognition');
    return [];
  }
  try {
    const text = await callVision(base64, SHELF_SYSTEM_PROMPT);
    console.log('[bottleRecognition] Shelf parsed text:', text);
    const parsed = JSON.parse(text.trim());
    if (!Array.isArray(parsed)) {
      console.warn('[bottleRecognition] Response was not an array:', parsed);
      return [];
    }
    return parsed as RecognizedBottle[];
  } catch (err) {
    console.error('[bottleRecognition] recognizeShelf error:', err);
    return [];
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
