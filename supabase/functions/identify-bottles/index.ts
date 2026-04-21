import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const SINGLE_PROMPT = `You are a spirits and beverage identification expert. Identify the bottle in this photo and return ONLY a valid JSON object with no preamble or markdown: { "name": string, "brand": string, "type": string, "size_ml": number, "confidence": "high"|"medium"|"low" }. If you cannot identify it return { "error": "unidentified" }`

const SHELF_PROMPT = `You are an expert at identifying alcoholic beverage bottles. Look carefully at this image. Identify EVERY bottle, can, or beverage container you can see, even if partially visible or the label is not fully clear. Make your best identification attempt for each one. Return ONLY a valid JSON array with no other text. Each item: { "name": string, "brand": string, "type": string, "size_ml": number, "confidence": "high"|"medium"|"low" }. If genuinely no bottles exist return [].`

serve(async (req) => {
  console.log('identify-bottles invoked, method:', req.method)

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { imageBase64, mode } = await req.json()
    console.log('identify-bottles mode:', mode, 'image chars:', imageBase64?.length ?? 0)

    if (!imageBase64 || !mode) {
      return new Response(
        JSON.stringify({ error: 'Missing imageBase64 or mode' }),
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

    const systemPrompt = mode === 'shelf' ? SHELF_PROMPT : SINGLE_PROMPT

    const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        system: systemPrompt,
        messages: [{
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: 'image/jpeg',
                data: imageBase64,
              },
            },
            {
              type: 'text',
              text: mode === 'shelf' ? 'Identify all bottles in this image.' : 'Identify this bottle.',
            },
          ],
        }],
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

    const text = data.content?.[0]?.text ?? ''

    return new Response(
      JSON.stringify({ result: text }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Edge function error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
