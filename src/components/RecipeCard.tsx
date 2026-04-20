import React, { useState } from 'react';
import { Recipe } from '../types';
import { calculateCalories } from '../utils/calorieUtils';

interface Props {
  recipe: Recipe;
  canMake: boolean;
  missingIngredients: string[];
  splashWarnings: string[];
  haveCount?: number;
  totalCount?: number;
  exploreMode?: boolean;
}

export function RecipeCard({ recipe, canMake, missingIngredients, splashWarnings, haveCount = 0, totalCount = 0, exploreMode = false }: Props) {
  const [expanded, setExpanded] = useState(false);

  const headerClass = exploreMode
    ? haveCount === totalCount ? 'can-make' : haveCount > 0 ? 'explore-partial' : 'explore-none'
    : canMake
      ? splashWarnings.length > 0 ? 'can-make-low' : 'can-make'
      : 'missing';

  function getBadge() {
    if (exploreMode) {
      if (haveCount === totalCount) return { cls: 'badge-green', text: 'Have everything' };
      if (haveCount === 0) return { cls: 'badge-muted', text: `0 of ${totalCount} ingredients` };
      return { cls: 'badge-explore', text: `${haveCount} of ${totalCount} ingredients` };
    }
    if (canMake) {
      return splashWarnings.length > 0
        ? { cls: 'badge-warn', text: 'Low on stock' }
        : { cls: 'badge-green', text: 'Ready to make' };
    }
    return { cls: 'badge-orange', text: `Missing ${missingIngredients.length}` };
  }

  const badge = getBadge();
  const calories = calculateCalories(recipe.ingredients);

  return (
    <div className={`recipe-card ${headerClass}`}>
      <div className="recipe-card-header" onClick={() => setExpanded(!expanded)}>
        <div className="recipe-title-row">
          <h3>{recipe.name}</h3>
          <span className={`badge ${badge.cls}`}>{badge.text}</span>
        </div>
        <p className="recipe-description">{recipe.description}</p>
        <div className="recipe-meta">
          <span className="tag">{recipe.glassType} glass</span>
          <span className={`tag difficulty-${recipe.difficulty}`}>{recipe.difficulty}</span>
          {recipe.tags.map(tag => (
            <span key={tag} className="tag">{tag}</span>
          ))}
          <span className="tag recipe-calories">~{calories} cal</span>
        </div>
      </div>

      {expanded && (
        <div className="recipe-details">
          <div className="recipe-section">
            <h4>Ingredients</h4>
            <ul>
              {recipe.ingredients.map(ing => (
                <li key={ing.ingredientId} className="ingredient-item">
                  <span className="ingredient-amount">{ing.amount} {ing.unit}</span>
                  <span className="ingredient-name">{ing.name}</span>
                  {ing.optional && <span className="optional-label">optional</span>}
                </li>
              ))}
            </ul>
          </div>
          <div className="recipe-section">
            <h4>Instructions</h4>
            <ol>
              {recipe.instructions.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </div>
          {recipe.garnish && (
            <p className="garnish-note">Garnish: {recipe.garnish}</p>
          )}
          {!exploreMode && splashWarnings.length > 0 && (
            <div className="splash-alert">
              <strong>Running low:</strong> {splashWarnings.join(', ')} — you may not have enough
            </div>
          )}
          {missingIngredients.length > 0 && (
            <div className={exploreMode ? 'missing-alert missing-alert--explore' : 'missing-alert'}>
              <strong>{exploreMode ? 'Still need:' : "You're missing:"}</strong> {missingIngredients.join(', ')}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
