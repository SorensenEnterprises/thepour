import { useState, useEffect } from 'react';

const FUNCTION_URL =
  'https://ctwwbnrkvzlwkhefzodu.supabase.co/functions/v1/get-featured-drink';

export interface FeaturedDrink {
  id: string;
  drink_name: string;
  vesper_description: string;
  occasion: string | null;
  recipe_teaser: string | null;
  sponsor_name: string | null;
  sponsor_url: string | null;
  active_from: string;
  active_to: string;
  created_at: string;
}

export function useFeaturedDrink() {
  const [featuredDrink, setFeaturedDrink] = useState<FeaturedDrink | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch(FUNCTION_URL)
      .then(r => (r.ok ? r.json() : null))
      .then(json => { if (!cancelled) setFeaturedDrink(json ?? null); })
      .catch(() => { if (!cancelled) setFeaturedDrink(null); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  return { featuredDrink, loading };
}
