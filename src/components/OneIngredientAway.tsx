import React, { useState } from 'react';
import { UnlockSuggestion } from '../utils/unlockCalculator';
import './OneIngredientAway.css';

interface Props {
  suggestions: UnlockSuggestion[];
}

const CATEGORY_LABELS: Record<UnlockSuggestion['ingredientCategory'], string> = {
  spirit:  'Spirit',
  liqueur: 'Liqueur',
  mixer:   'Mixer',
  fresh:   'Fresh',
  pantry:  'Pantry',
};

export function OneIngredientAway({ suggestions }: Props) {
  const [expanded, setExpanded]           = useState(false);
  const [expandedRecipes, setExpandedRecipes] = useState<Set<string>>(new Set());

  if (suggestions.length === 0) return null;

  const top = suggestions[0];

  function toggleRecipes(canonicalType: string) {
    setExpandedRecipes(prev => {
      const next = new Set(prev);
      if (next.has(canonicalType)) next.delete(canonicalType);
      else next.add(canonicalType);
      return next;
    });
  }

  return (
    <div className="oia-wrap">
      <button
        className="oia-header"
        onClick={() => setExpanded(e => !e)}
        aria-expanded={expanded}
      >
        <div className="oia-header-left">
          <span className="oia-title">Unlock more recipes</span>
          {!expanded && (
            <span className="oia-preview">
              Add {top.ingredientDisplayName} → {top.unlockCount} more recipe{top.unlockCount !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        <svg
          className={`oia-chevron${expanded ? ' oia-chevron--up' : ''}`}
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M4 6l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {expanded && (
        <div className="oia-body">
          {suggestions.slice(0, 5).map(s => {
            const recipesOpen = expandedRecipes.has(s.ingredientCanonicalType);
            return (
              <div key={s.ingredientCanonicalType} className="oia-card">
                <div className="oia-card-top">
                  <span className="oia-card-name">{s.ingredientDisplayName}</span>
                  <span className="oia-card-count">
                    {s.unlockCount} recipe{s.unlockCount !== 1 ? 's' : ''}
                  </span>
                </div>

                <div className="oia-card-meta">
                  <span className={`oia-badge oia-badge--${s.ingredientCategory}`}>
                    {CATEGORY_LABELS[s.ingredientCategory]}
                  </span>
                </div>

                <p className="oia-card-quip">"{s.vesperQuip}"</p>

                <div className="oia-card-actions">
                  <button
                    className="oia-see-recipes"
                    onClick={() => toggleRecipes(s.ingredientCanonicalType)}
                  >
                    See recipes {recipesOpen ? '▲' : '→'}
                  </button>
                  <a
                    className="oia-shop-link"
                    href="#shop"
                    onClick={e => e.preventDefault()}
                    aria-label={`Shop for ${s.ingredientDisplayName}`}
                  >
                    Shop →
                  </a>
                </div>

                {recipesOpen && (
                  <ul className="oia-recipe-list">
                    {s.recipes.map(r => (
                      <li key={r.id} className="oia-recipe-item">{r.name}</li>
                    ))}
                  </ul>
                )}

                {s.howToGet && (
                  <div className="oia-how-to">
                    <span className="oia-how-to-label">How to make it</span>
                    <span className="oia-how-to-text">{s.howToGet}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
