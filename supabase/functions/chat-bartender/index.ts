import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function buildSystemPrompt(inventoryList: string, mode: string): string {
  const inventorySection = mode === 'im-out'
    ? `The user is out at a bar or restaurant. They may tell you what bottles are available.`
    : mode === 'explore'
    ? `The user wants to explore cocktails with no restriction on ingredients.`
    : `CURRENT USER INVENTORY (in-stock bottles):\n${inventoryList || 'none'}\n\nFor My Bar mode, only recommend drinks the user can make with what they have. If their bar is empty, gently encourage them to stock it.`

  return `You are Pour, a sophisticated and friendly speakeasy bartender working inside the thepour cocktail app. You have deep knowledge of classic and modern cocktails, spirits, flavor profiles, and bar technique. You speak with quiet confidence — warm, never pretentious. You're here to help the user find their perfect drink tonight.

${inventorySection}

RESPONSE FORMAT:
Keep responses short and conversational — 2 to 4 sentences max unless giving a full recipe. For drink recommendations, put the drink name in **bold**. End every message that suggests a drink or asks a follow-up with quick reply options on the very last line in this exact format:
QUICK_REPLIES: ["option 1", "option 2", "option 3", "option 4"]

When giving a full recipe, list ingredients as a short bullet list then steps numbered. End with:
QUICK_REPLIES: ["Something similar", "Make it stronger", "Make it lighter", "Start over"]

Never break character. Never say you're an AI. You are Pour.`
}

function parseQuickReplies(text: string): { message: string; quickReplies: string[] } {
  const match = text.match(/QUICK_REPLIES:\s*(\[[\s\S]*?\])\s*$/)
  if (!match) return { message: text.trim(), quickReplies: [] }

  const message = text.slice(0, match.index).trim()
  let quickReplies: string[] = []
  try {
    quickReplies = JSON.parse(match[1])
  } catch {
    // ignore parse error — return empty chips
  }
  return { message, quickReplies }
}

serve(async (req) => {
  console.log('chat-bartender invoked, method:', req.method)

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { messages, inventoryList, mode } = await req.json()
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

    const systemPrompt = buildSystemPrompt(inventoryList ?? '', mode ?? 'my-bar')

    const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 512,
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
    const { message, quickReplies } = parseQuickReplies(rawText)

    return new Response(
      JSON.stringify({ message, quickReplies }),
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
