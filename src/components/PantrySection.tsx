import React from 'react';
import { PANTRY_CATEGORIES } from '../data/pantryItems';
import './PantrySection.css';

interface Props {
  checkedPantryIds: Set<string>;
  onToggle: (itemId: string) => void;
}

export function PantrySection({ checkedPantryIds, onToggle }: Props) {
  return (
    <div className="pantry-section">
      <div className="pantry-header">
        <h3 className="pantry-title">Pantry &amp; Fresh Ingredients</h3>
        <p className="pantry-hint">
          Vesper uses your pantry to unlock more recipes and stop asking if you have limes.
        </p>
      </div>

      <div className="pantry-categories">
        {PANTRY_CATEGORIES.map(cat => (
          <div key={cat.category} className="pantry-cat">
            <span className="pantry-cat-label">{cat.emoji} {cat.category}</span>
            <div className="pantry-chips">
              {cat.items.map(item => {
                const checked = checkedPantryIds.has(item.id);
                return (
                  <button
                    key={item.id}
                    className={`pantry-chip${checked ? ' pantry-chip--checked' : ''}`}
                    onClick={() => onToggle(item.id)}
                    aria-pressed={checked}
                  >
                    {checked && <span className="pantry-chip-check" aria-hidden="true">✓</span>}
                    {item.name}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
