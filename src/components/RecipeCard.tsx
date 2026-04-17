import React, { useState } from 'react';
import { Recipe } from '../types';

interface Props {
  recipe: Recipe;
  canMake: boolean;
  missingIngredients: string[];
  splashWarnings: string[];
}

export function RecipeCard({ recipe, canMake, missingIngredients, splashWarnings }: Props) {
  const [expanded, setExpanded] = useState(false);

  const headerClass = canMake
    ? splashWarnings.length > 0 ? 'can-make-low' : 'can-make'
    : 'missing';

  return (
    <div className={`recipe-card ${headerClass}`}>
      <div className="recipe-card-header" onClick={() => setExpanded(!expanded)}>
        <div className="recipe-title-row">
          <h3>{recipe.name}</h3>
          <span className={`badge ${canMake ? (splashWarnings.length > 0 ? 'badge-warn' : 'badge-green') : 'badge-orange'}`}>
            {canMake
              ? splashWarnings.length > 0 ? 'Low on stock' : 'Ready to make'
              : `Missing ${missingIngredients.length}`}
          </span>
        </div>
        <p className="recipe-description">{recipe.description}</p>
        <div className="recipe-meta">
          <span className="tag">{recipe.glassType} glass</span>
          <span className={`tag difficulty-${recipe.difficulty}`}>{recipe.difficulty}</span>
          {recipe.tags.map(tag => (
            <span key={tag} className="tag">{tag}</span>
          ))}
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
          {splashWarnings.length > 0 && (
            <div className="splash-alert">
              <strong>Running low:</strong> {splashWarnings.join(', ')} — you may not have enough
            </div>
          )}
          {missingIngredients.length > 0 && (
            <div className="missing-alert">
              <strong>You're missing:</strong> {missingIngredients.join(', ')}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
