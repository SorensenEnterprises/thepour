import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    const today = new Date().toISOString().split('T')[0]
    console.log('get-featured-drink: today =', today)

    // Active row: today is within the window (inclusive)
    let { data, error } = await supabase
      .from('featured_drink')
      .select('*')
      .lte('active_from', today)
      .gte('active_to', today)
      .order('active_from', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (error) throw error

    if (!data) {
      // Fallback: most recently expired row so the section is never empty
      const result = await supabase
        .from('featured_drink')
        .select('*')
        .lt('active_to', today)
        .order('active_to', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (result.error) throw result.error
      data = result.data
    }

    console.log('get-featured-drink: returning', data?.drink_name ?? 'null')

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('get-featured-drink error:', err)
    return new Response(JSON.stringify({ error: err.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
