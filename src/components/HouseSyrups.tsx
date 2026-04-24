import React, { useState } from 'react';
import { houseSyrups, syrupCategories, SyrupRecipe } from '../data/houseSyrups';
import './HouseSyrups.css';

interface Props {
  checkedPantryIds: Set<string>;
  onTogglePantry: (itemId: string) => void;
}

function formatTime(minutes: number): string {
  if (minutes >= 1440) return `${Math.round(minutes / 1440)}d`;
  if (minutes >= 60) return `${Math.round(minutes / 60)} hr`;
  return `${minutes} min`;
}

function splitInstructions(text: string): string[] {
  return text
    .split(/\.\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 5)
    .map(s => (s.endsWith('.') ? s : s + '.'));
}

export function HouseSyrups({ checkedPantryIds, onTogglePantry }: Props) {
  const [activeCategory, setActiveCategory] = useState('essential');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [confirmedId, setConfirmedId] = useState<string | null>(null);

  const activeCat = syrupCategories.find(c => c.id === activeCategory)!;
  const activeSyrups = activeCat.ids
    .map(id => houseSyrups.find(s => s.id === id))
    .filter((s): s is SyrupRecipe => s !== undefined);

  function handleToggle(syrup: SyrupRecipe) {
    const wasChecked = checkedPantryIds.has(syrup.unlockIngredientId);
    onTogglePantry(syrup.unlockIngredientId);
    if (!wasChecked) {
      setConfirmedId(syrup.id);
      setTimeout(() => setConfirmedId(prev => (prev === syrup.id ? null : prev)), 3500);
    }
  }

  return (
    <div className="hs-wrap">
      <div className="hs-header">
        <h3 className="hs-title">⚗️ House Syrups</h3>
        <p className="hs-subtitle">Vesper's guide to stocking your bar properly.</p>
      </div>

      <div className="hs-tabs-scroll">
        <div className="hs-tabs">
          {syrupCategories.map(cat => (
            <button
              key={cat.id}
              className={`hs-tab${cat.id === activeCategory ? ' hs-tab--active' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.emoji} {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="hs-cards">
        {activeSyrups.map(syrup => {
          const isMade    = checkedPantryIds.has(syrup.unlockIngredientId);
          const isExpanded = expandedId === syrup.id;
          const steps     = splitInstructions(syrup.instructions);

          return (
            <div key={syrup.id} className={`hs-card${isMade ? ' hs-card--made' : ''}`}>
              {/* ── Card header ── */}
              <div className="hs-card-header">
                <div className="hs-name-row">
                  <span className="hs-name">{syrup.name}</span>
                  {isMade && <span className="hs-made-pill">✓ In pantry</span>}
                </div>
                <div className="hs-badges">
                  <span className="hs-badge hs-badge--time">{formatTime(syrup.timeMinutes)}</span>
                  <span className={`hs-badge hs-badge--diff hs-badge--${syrup.difficulty}`}>
                    {syrup.difficulty === 'easy'   && 'Easy'}
                    {syrup.difficulty === 'medium' && 'Medium'}
                    {syrup.difficulty === 'hard'   && 'Hard — worth it'}
                  </span>
                  <span className="hs-badge hs-badge--shelf">Lasts {syrup.shelfLifeDays}d</span>
                </div>
              </div>

              <p className="hs-quip">"{syrup.vesperQuip}"</p>

              <button
                className="hs-expand-btn"
                onClick={() => setExpandedId(isExpanded ? null : syrup.id)}
                aria-expanded={isExpanded}
              >
                {isExpanded ? 'Hide recipe ↑' : 'See recipe →'}
              </button>

              {/* ── Expanded recipe ── */}
              {isExpanded && (
                <div className="hs-expanded">
                  <div className="hs-section">
                    <h5 className="hs-section-title">Ingredients</h5>
                    <ul className="hs-ingredients">
                      {syrup.ingredients.map((ing, i) => (
                        <li key={i} className="hs-ing">
                          <span className="hs-ing-amount">{ing.amount} {ing.unit}</span>
                          <span className="hs-ing-name">{ing.name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="hs-section">
                    <h5 className="hs-section-title">Instructions</h5>
                    <ol className="hs-instructions">
                      {steps.map((step, i) => (
                        <li key={i}>{step}</li>
                      ))}
                    </ol>
                  </div>

                  <div className="hs-tip">
                    <span className="hs-tip-label">Vesper's tip</span>
                    <p className="hs-tip-text">{syrup.vesperTip}</p>
                  </div>

                  <div className="hs-used-in">
                    <span className="hs-used-label">Used in:</span>
                    <div className="hs-used-chips">
                      {syrup.usedIn.slice(0, 8).map((name, i) => (
                        <span key={i} className="hs-used-chip">{name}</span>
                      ))}
                      {syrup.usedIn.length > 8 && (
                        <span className="hs-used-chip hs-used-chip--more">
                          +{syrup.usedIn.length - 8} more
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="hs-storage">{syrup.storageNote}</p>

                  <div className="hs-made-row">
                    <button
                      className={`hs-made-btn${isMade ? ' hs-made-btn--on' : ''}`}
                      onClick={() => handleToggle(syrup)}
                    >
                      {isMade ? '✓ In My Pantry' : 'I Made This'}
                    </button>
                    {confirmedId === syrup.id && (
                      <span className="hs-confirm">
                        Added — {syrup.usedIn.length} recipes unlocked
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
