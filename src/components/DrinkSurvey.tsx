import React, { useState, useEffect } from 'react';
import { supabase, supabaseConfigured } from '../lib/supabase';
import './DrinkSurvey.css';

interface Props {
  recipeName: string;
  userId: string | null;
  onDismiss: () => void;
}

type Strength   = 'too-weak' | 'just-right' | 'too-strong';
type MakeAgain  = 'yes' | 'maybe' | 'no';
type Status     = 'idle' | 'submitting' | 'done';

function lsRatingsPush(entry: object) {
  try {
    const key = 'thepour_drink_ratings';
    const list = JSON.parse(localStorage.getItem(key) ?? '[]');
    list.push(entry);
    localStorage.setItem(key, JSON.stringify(list));
  } catch {}
}

export function DrinkSurvey({ recipeName, userId, onDismiss }: Props) {
  const [stars,     setStars]     = useState(0);
  const [hoverStar, setHoverStar] = useState(0);
  const [strength,  setStrength]  = useState<Strength | null>(null);
  const [makeAgain, setMakeAgain] = useState<MakeAgain | null>(null);
  const [status,    setStatus]    = useState<Status>('idle');

  useEffect(() => {
    if (status !== 'done') return;
    const t = setTimeout(onDismiss, 2500);
    return () => clearTimeout(t);
  }, [status, onDismiss]);

  const canSubmit = stars > 0 && strength !== null && makeAgain !== null;

  async function handleSubmit() {
    if (!canSubmit || status === 'submitting') return;
    setStatus('submitting');

    const recipeId = recipeName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const payload = {
      recipe_id:  recipeId,
      stars,
      strength,
      make_again: makeAgain,
      created_at: new Date().toISOString(),
    };

    if (userId && supabaseConfigured) {
      try {
        await supabase.from('drink_ratings').insert({ ...payload, user_id: userId });
      } catch {
        lsRatingsPush(payload);
      }
    } else {
      lsRatingsPush(payload);
    }

    setStatus('done');
  }

  if (status === 'done') {
    return (
      <div className="ds-card ds-card--done" role="status">
        <span className="ds-done-icon">🍸</span>
        <p className="ds-done-text">Thanks — we'll remember that.</p>
      </div>
    );
  }

  const activeStar = hoverStar || stars;

  return (
    <div className="ds-card" role="dialog" aria-label="How was your drink?">
      <button className="ds-dismiss" onClick={onDismiss} aria-label="Dismiss survey">×</button>

      <p className="ds-headline">How was it?</p>

      <div className="ds-stars" onMouseLeave={() => setHoverStar(0)}>
        {[1, 2, 3, 4, 5].map(n => (
          <button
            key={n}
            className={`ds-star${activeStar >= n ? ' ds-star--lit' : ''}`}
            onMouseEnter={() => setHoverStar(n)}
            onClick={() => setStars(n)}
            aria-label={`${n} star${n !== 1 ? 's' : ''}`}
          >
            ★
          </button>
        ))}
      </div>

      <p className="ds-label">Strength?</p>
      <div className="ds-pill-row">
        {(['too-weak', 'just-right', 'too-strong'] as Strength[]).map(v => (
          <button
            key={v}
            className={`ds-pill${strength === v ? ' ds-pill--active' : ''}`}
            onClick={() => setStrength(v)}
          >
            {v === 'too-weak' ? 'Too weak' : v === 'just-right' ? 'Just right' : 'Too strong'}
          </button>
        ))}
      </div>

      <p className="ds-label">Make it again?</p>
      <div className="ds-pill-row">
        {(['yes', 'maybe', 'no'] as MakeAgain[]).map(v => (
          <button
            key={v}
            className={`ds-pill${makeAgain === v ? ' ds-pill--active' : ''}`}
            onClick={() => setMakeAgain(v)}
          >
            {v.charAt(0).toUpperCase() + v.slice(1)}
          </button>
        ))}
      </div>

      <button
        className="ds-submit"
        onClick={handleSubmit}
        disabled={!canSubmit || status === 'submitting'}
      >
        {status === 'submitting' ? 'Saving…' : 'Submit'}
      </button>
    </div>
  );
}
