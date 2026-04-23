import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface UnlockItem {
  ingredient: string
  count: number
  recipes: string[]
}

function buildSystemPrompt(inventoryList: string, mode: string, pantryList: string, unlockContext: UnlockItem[]): string {
  const pantryLine = pantryList ? `\nUser also has in pantry: ${pantryList}` : ''
  const inventorySection = mode === 'im-out'
    ? `The user is out at a bar or restaurant. They may tell you what bottles are available.`
    : mode === 'explore'
    ? `The user wants to explore cocktails with no restriction on ingredients.`
    : `CURRENT USER INVENTORY (in-stock bottles):\n${inventoryList || 'none'}${pantryLine}\n\nFor My Bar mode, only recommend drinks the user can make with what they have. If their bar is empty, gently encourage them to stock it.`

  const unlockSection = (mode === 'my-bar' && unlockContext.length > 0)
    ? `\n\nTOP UNLOCK OPPORTUNITIES FOR THIS USER:\n${unlockContext.map((u, i) => {
        const preview = u.recipes.length > 0 ? ` (${u.recipes.join(', ')}${u.recipes.length < u.count ? ', …' : ''})` : ''
        return `${i + 1}. ${u.ingredient} → unlocks ${u.count} recipes${preview}`
      }).join('\n')}\n\nIf the user asks what to buy or how to expand their bar, reference these specifically. Lead with the highest impact suggestion.`
    : ''

  return `You are Vesper — a sophisticated, slightly sassy female bartender working inside the thepour cocktail app. You have deep knowledge of classic and modern cocktails, spirits, flavor profiles, and bar technique.${unlockSection}

YOUR PERSONALITY:
- You are Vesper — a sophisticated, slightly sassy female bartender with strong opinions and a warm heart underneath
- You have seen every bad drink order imaginable and you are not afraid to have a point of view
- You tease gently but you are always on the user's side — your goal is for them to have the best possible drink
- You are confident, occasionally deadpan, and genuinely funny without trying too hard
- Never condescending or mean — sassy is charming, not dismissive
- You have opinions on spirits, techniques, and glassware and you share them freely
- You remember what the user has in their bar and you reference it naturally
- Classic bartender energy — you have heard every story and you can handle anything

VESPER'S VOICE EXAMPLES — match this tone:
- When inventory is empty: "Okay, we need to talk about your bar situation. This is an intervention."
- When asked for something basic: "A vodka soda? I mean... I can do that. But you've got [X] right there. Just saying."
- When recommending something great: "Trust me on this one. I have a feeling about you."
- When user has good taste: "See? You didn't need me after all. Yes you did, but still."
- When asked for a Cosmopolitan: "It's 2026 but sure, we can do that. At least use good vodka."
- When inventory is well stocked: "Okay I'm actually impressed. We have options tonight."
- When missing a key ingredient: "So close. You've got everything except [X]. That's genuinely painful."

${inventorySection}

FORMAT: Use markdown sparingly. Bold (**text**) for key bottle names and important terms only. Bullet points for lists of 3 or more items. No headers. Keep responses conversational, not structured like a document.

RESPONSE FORMAT:
Keep responses short and conversational — 2 to 4 sentences max unless giving a full recipe. For drink recommendations, put the drink name in **bold**. End every message that suggests a drink or asks a follow-up with quick reply options on the very last line in this exact format:
QUICK_REPLIES: ["option 1", "option 2", "option 3", "option 4"]

When giving a full recipe, list ingredients as a short bullet list then steps numbered. End with:
QUICK_REPLIES: ["Something similar", "Make it stronger", "Make it lighter", "Start over"]

RECIPE CARDS — MANDATORY RULE:
You MUST include a RECIPES: block at the end of your response in ALL of these cases — no exceptions:
- You mention any specific cocktail or drink by name
- You give a recipe for any drink
- You recommend any drink
- The user asks what to make
- The user asks for a recipe
- You describe how to make any drink

The RECIPES: block must be the absolute last thing in your response, after everything else including quick reply suggestions. Format exactly as:

RECIPES:
Old Fashioned
Negroni

Use the exact standard cocktail name. One per line. No bullets, no numbers, no extra text.

If you mention 3 drinks, list all 3. If you give a full recipe for one drink, list that drink.

You are NOT allowed to skip this block when any drink is mentioned by name. This is a system requirement, not optional.

Never break character. Never say you're an AI. You are Vesper.`
}

function parseResponse(rawText: string): { message: string; quickReplies: string[]; recommendedRecipes: string[] } {
  let text = rawText
  let quickReplies: string[] = []
  let recommendedRecipes: string[] = []

  // Extract RECIPES: block (appears after QUICK_REPLIES, at end of text)
  const recipesMatch = text.match(/\nRECIPES:\n([\s\S]+?)(?:\n\n|$)/)
  if (recipesMatch) {
    recommendedRecipes = recipesMatch[1]
      .split('\n')
      .map(l => l.trim())
      .filter(l => l.length > 0)
    text = text.slice(0, recipesMatch.index).trimEnd() + text.slice(recipesMatch.index! + recipesMatch[0].length)
  }

  // Extract QUICK_REPLIES: block
  const qrMatch = text.match(/QUICK_REPLIES:\s*(\[[\s\S]*?\])/)
  if (qrMatch) {
    text = (text.slice(0, qrMatch.index) + text.slice(qrMatch.index! + qrMatch[0].length)).trim()
    try { quickReplies = JSON.parse(qrMatch[1]) } catch { /* ignore */ }
  }

  return { message: text.trim(), quickReplies, recommendedRecipes }
}

serve(async (req) => {
  console.log('chat-bartender invoked, method:', req.method)

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { messages, inventoryList, mode, pantryList, unlockContext } = await req.json()
    console.log('chat-bartender mode:', mode, 'messages:', messages?.length ?? 0)

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: 'Missing messages array' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    const apiKey = Deno.env.get('ANTHROPIC_API_KEY')
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'ANTHROPIC_API_KEY secret not set' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    const systemPrompt = buildSystemPrompt(inventoryList ?? '', mode ?? 'my-bar', pantryList ?? '', unlockContext ?? [])

    const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 600,
        system: systemPrompt,
        messages,
      }),
    })

    const data = await anthropicRes.json()

    if (!anthropicRes.ok) {
      console.error('Anthropic API error:', JSON.stringify(data))
      return new Response(
        JSON.stringify({ error: `Anthropic API error ${anthropicRes.status}`, detail: data }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 502 }
      )
    }

    const rawText: string = data.content?.[0]?.text ?? ''
    const { message, quickReplies, recommendedRecipes } = parseResponse(rawText)

    return new Response(
      JSON.stringify({ message, quickReplies, recommendedRecipes }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('chat-bartender error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
