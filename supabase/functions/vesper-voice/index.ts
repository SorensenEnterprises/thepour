import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const VOICE_ID = 'uhYnkYTBc711oAY590Ea'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const ELEVENLABS_API_KEY = Deno.env.get('ELEVENLABS_API_KEY')

    console.log('vesper-voice called')
    console.log('API key present:', !!ELEVENLABS_API_KEY)
    console.log('API key length:', ELEVENLABS_API_KEY?.length)

    if (!ELEVENLABS_API_KEY) {
      console.error('ELEVENLABS_API_KEY not set')
      return new Response(
        JSON.stringify({ error: 'ELEVENLABS_API_KEY not configured' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    const body = await req.json()
    const text = body?.text

    console.log('Text received:', text?.substring(0, 50))

    if (!text || text.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: 'No text provided' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    const cleanText = text
      .replace(/RECIPES:[\s\S]*$/m, '')
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/^[-•]\s/gm, '')
      .trim()

    console.log('Calling ElevenLabs with voice:', VOICE_ID)

    const elevenResponse = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
      {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': ELEVENLABS_API_KEY,
        },
        body: JSON.stringify({
          text: cleanText,
          model_id: 'eleven_turbo_v2',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.8,
            style: 0.3,
            use_speaker_boost: true,
          },
        }),
      }
    )

    console.log('ElevenLabs response status:', elevenResponse.status)

    if (!elevenResponse.ok) {
      const errorText = await elevenResponse.text()
      console.error('ElevenLabs error:', errorText)
      return new Response(
        JSON.stringify({ error: `ElevenLabs error ${elevenResponse.status}: ${errorText}` }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    const audioBuffer = await elevenResponse.arrayBuffer()
    console.log('Audio buffer size:', audioBuffer.byteLength)

    const uint8Array = new Uint8Array(audioBuffer)
    let binary = ''
    for (let i = 0; i < uint8Array.length; i++) {
      binary += String.fromCharCode(uint8Array[i])
    }
    const base64Audio = btoa(binary)

    console.log('Success, returning audio')

    return new Response(
      JSON.stringify({ audio: base64Audio, contentType: 'audio/mpeg' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Unexpected error:', error.message, error.stack)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
