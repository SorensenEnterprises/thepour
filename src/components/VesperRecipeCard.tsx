import React, { useState } from 'react';
import { Recipe, InventoryItem } from '../types';
import { calculateCalories } from '../utils/calorieUtils';
import { getGlassInfo } from '../utils/glasswareUtils';
import { buildInventoryMatcher, isGarnish } from '../utils/ingredientMatcher';
import './VesperRecipeCard.css';

interface Props {
  recipe: Recipe;
  inventory: InventoryItem[];
  checkedPantryIds: Set<string>;
}

const MAX_COLLAPSED_INGREDIENTS = 5;

export function VesperRecipeCard({ recipe, inventory, checkedPantryIds }: Props) {
  const [expanded, setExpanded] = useState(false);

  const matcher  = buildInventoryMatcher(inventory, checkedPantryIds);
  const required = recipe.ingredients.filter(i => !i.optional && !isGarnish(i.ingredientId));
  const missing  = required.filter(i => !matcher.isSatisfied(i.ingredientId, i.name));
  const canMake  = missing.length === 0;

  const calories = calculateCalories(recipe.ingredients);
  const glass    = getGlassInfo(recipe.glassType);

  const allIngredients = recipe.ingredients;
  const hiddenCount    = allIngredients.length - MAX_COLLAPSED_INGREDIENTS;

  return (
    <div className="vrc-card">
      {/* ── Header ── */}
      <div className="vrc-header" onClick={() => setExpanded(e => !e)}>
        <div className="vrc-header-left">
          <span className="vrc-name">{recipe.name}</span>
          <div className="vrc-meta">
            <span className="vrc-glass">{glass.emoji} {recipe.glassType}</span>
            <span className="vrc-cal">~{calories} cal</span>
          </div>
        </div>
        <div className="vrc-header-right">
          {canMake ? (
            <span className="vrc-status vrc-status--ready">Ready ✓</span>
          ) : (
            <span className="vrc-status vrc-status--missing">
              Missing {missing.length}
            </span>
          )}
          <svg
            className={`vrc-chevron${expanded ? ' vrc-chevron--up' : ''}`}
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* ── Collapsed ingredient preview ── */}
      {!expanded && (
        <div className="vrc-ingredients-preview">
          {allIngredients.slice(0, MAX_COLLAPSED_INGREDIENTS).map(ing => {
            const isMissing = !ing.optional && !isGarnish(ing.ingredientId) && !matcher.isSatisfied(ing.ingredientId, ing.name);
            return (
              <span key={ing.ingredientId} className={`vrc-ing${isMissing ? ' vrc-ing--missing' : ''}`}>
                {ing.amount} {ing.unit} {ing.name}{ing.optional ? '*' : ''}
              </span>
            );
          })}
          {hiddenCount > 0 && (
            <span className="vrc-ing-more">+{hiddenCount} more</span>
          )}
        </div>
      )}

      {/* ── Expanded full recipe ── */}
      {expanded && (
        <div className="vrc-details">
          <section className="vrc-section">
            <h4 className="vrc-section-title">Ingredients</h4>
            <ul className="vrc-ing-list">
              {allIngredients.map(ing => {
                const isMissing = !ing.optional && !isGarnish(ing.ingredientId) && !matcher.isSatisfied(ing.ingredientId, ing.name);
                return (
                  <li key={ing.ingredientId} className={`vrc-ing-item${isMissing ? ' vrc-ing-item--missing' : ''}`}>
                    <span className="vrc-ing-amount">{ing.amount} {ing.unit}</span>
                    <span className="vrc-ing-name">{ing.name}</span>
                    {ing.optional && <span className="vrc-optional">optional</span>}
                    {isMissing && <span className="vrc-need">need</span>}
                  </li>
                );
              })}
            </ul>
          </section>

          <section className="vrc-section">
            <h4 className="vrc-section-title">Instructions</h4>
            <ol className="vrc-steps">
              {recipe.instructions.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </section>

          {recipe.garnish && (
            <p className="vrc-garnish">Garnish: {recipe.garnish}</p>
          )}

          {!canMake && missing.length > 0 && (
            <div className="vrc-missing-alert">
              <strong>You're missing:</strong> {missing.map(i => i.name).join(', ')}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
