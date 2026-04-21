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

const SHELF_SYSTEM_PROMPT = `You are a spirits and beverage identification expert. Identify every bottle visible in this photo and return ONLY a valid JSON array with no preamble, explanation, or markdown formatting. Each item: {"name":"full product name","brand":"brand name","type":"one of: Vodka, Bourbon, Gin, Rum, Tequila, Mezcal, Scotch, Whiskey, Liqueur, Wine, Beer, Mixer, Energy Drink, Other","size_ml":750,"confidence":"high, medium, or low"}
Only include bottles you can reasonably identify. Return [] if no bottles visible.`;

// ── API call ─────────────────────────────────────────────────────────────────

const ANTHROPIC_API_KEY = process.env.REACT_APP_ANTHROPIC_API_KEY;

async function callVision(base64: string, systemPrompt: string): Promise<string> {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY!,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
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
    }),
  });
  const data = await res.json();
  return data.content?.[0]?.text ?? '';
}

// ── Public API ───────────────────────────────────────────────────────────────

export async function recognizeSingleBottle(base64: string): Promise<RecognizedBottle | null> {
  if (!ANTHROPIC_API_KEY) return null;
  try {
    const text = await callVision(base64, SINGLE_SYSTEM_PROMPT);
    const parsed = JSON.parse(text.trim());
    if (parsed.error) return null;
    return parsed as RecognizedBottle;
  } catch {
    return null;
  }
}

export async function recognizeShelf(base64: string): Promise<RecognizedBottle[]> {
  if (!ANTHROPIC_API_KEY) return [];
  try {
    const text = await callVision(base64, SHELF_SYSTEM_PROMPT);
    const parsed = JSON.parse(text.trim());
    if (!Array.isArray(parsed)) return [];
    return parsed as RecognizedBottle[];
  } catch {
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
