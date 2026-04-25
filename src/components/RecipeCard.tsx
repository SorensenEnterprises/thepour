import React, { useState } from 'react';
import { Recipe } from '../types';
import { calculateCalories } from '../utils/calorieUtils';
import { getGlassInfo } from '../utils/glasswareUtils';
import { getRequiredEquipment } from '../utils/equipmentUtils';
import { IMadeThisModal } from './IMadeThisModal';
import { DrinkSurvey } from './DrinkSurvey';
import { houseSyrups, SyrupRecipe } from '../data/houseSyrups';
import { RecipeMatch } from '../utils/recipeUtils';

export interface MadeThisResult {
  lowBottles:    string[];
  adjustedCount: number;
}

interface Props {
  recipe:              Recipe;
  canMake:             boolean;
  missingIngredients:  string[];
  splashWarnings:      string[];
  haveCount?:          number;
  totalCount?:         number;
  exploreMode?:        boolean;
  onMadeThis?:         (count: number) => MadeThisResult;
  userId?:             string | null;
  checkedPantryIds?:   Set<string>;
  onTogglePantry?:     (itemId: string) => void;
  variationMatches?:   RecipeMatch[];
}

export function RecipeCard({
  recipe, canMake, missingIngredients, splashWarnings,
  haveCount = 0, totalCount = 0, exploreMode = false,
  onMadeThis, userId, checkedPantryIds, onTogglePantry, variationMatches,
}: Props) {
  const [expanded,         setExpanded]         = useState(false);
  const [showModal,        setShowModal]         = useState(false);
  const [showSurvey,       setShowSurvey]        = useState(false);
  const [surveyDone,       setSurveyDone]        = useState(false);
  const [syrupSheet,       setSyrupSheet]        = useState<{ syrup: SyrupRecipe; cocktailName: string } | null>(null);
  const [syrupConfirm,     setSyrupConfirm]      = useState(false);
  const [varExpanded,      setVarExpanded]       = useState(false);
  const [selectedVarId,    setSelectedVarId]     = useState<string | null>(null);

  // Map missing ingredient names → IDs by cross-referencing recipe.ingredients
  const missingWithIds = recipe.ingredients.filter(
    ing => missingIngredients.includes(ing.name)
  );

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

  const badge    = getBadge();
  const calories = calculateCalories(recipe.ingredients);
  const glass    = getGlassInfo(recipe.glassType);
  const equipment = getRequiredEquipment(recipe.name, recipe.tags);

  function handleMadeThisConfirm(count: number) {
    setShowModal(false);
    if (!onMadeThis) return;
    onMadeThis(count);
    // After a short pause, prompt for rating (once per recipe expansion)
    if (!surveyDone) {
      setTimeout(() => setShowSurvey(true), 2200);
    }
  }

  return (
    <>
      <div className={`recipe-card ${headerClass}`}>
        <div className="recipe-card-header" onClick={() => setExpanded(!expanded)}>
          <div className="recipe-title-row">
            <h3>{recipe.name}</h3>
            <span className={`badge ${badge.cls}`}>{badge.text}</span>
          </div>
          <p className="recipe-description">{recipe.description}</p>
          {variationMatches && variationMatches.length > 0 && (
            <button
              className={`rc-variations-chip${varExpanded ? ' rc-variations-chip--open' : ''}`}
              onClick={e => { e.stopPropagation(); setVarExpanded(v => !v); setSelectedVarId(null); }}
            >
              {variationMatches.length} variation{variationMatches.length !== 1 ? 's' : ''} →
            </button>
          )}
          <div className="recipe-meta">
            <span className="tag">{recipe.glassType} glass</span>
            <span className={`tag difficulty-${recipe.difficulty}`}>{recipe.difficulty}</span>
            {recipe.tags.map(tag => (
              <span key={tag} className="tag">{tag}</span>
            ))}
            <span className="tag recipe-calories">~{calories} cal</span>
          </div>
        </div>

        {varExpanded && variationMatches && variationMatches.length > 0 && (
          <div className="rc-variations-panel" onClick={e => e.stopPropagation()}>
            <div className="rc-variations-list">
              {variationMatches.map(vm => (
                <button
                  key={vm.recipe.id}
                  className={`rc-variation-pill${vm.canMake ? ' rc-variation-pill--ready' : ''}${selectedVarId === vm.recipe.id ? ' rc-variation-pill--selected' : ''}`}
                  onClick={() => setSelectedVarId(id => id === vm.recipe.id ? null : vm.recipe.id)}
                >
                  <span className="rc-variation-label">{vm.recipe.variationLabel ?? vm.recipe.name}</span>
                  {vm.canMake && <span className="rc-variation-ready-dot" />}
                </button>
              ))}
            </div>
            {selectedVarId && (() => {
              const vm = variationMatches.find(m => m.recipe.id === selectedVarId);
              if (!vm) return null;
              const vCalories = calculateCalories(vm.recipe.ingredients);
              return (
                <div className="rc-variation-detail">
                  <h4 className="rc-variation-detail-name">{vm.recipe.name}</h4>
                  <p className="rc-variation-detail-desc">{vm.recipe.description}</p>
                  <div className="rc-variation-ingredients">
                    {vm.recipe.ingredients.map(ing => (
                      <div key={ing.ingredientId} className="rc-variation-ing">
                        <span className="rc-variation-ing-amt">{ing.amount} {ing.unit}</span>
                        <span>{ing.name}{ing.optional ? ' (optional)' : ''}</span>
                      </div>
                    ))}
                  </div>
                  <div className="rc-variation-instructions">
                    {vm.recipe.instructions.map((step, i) => (
                      <p key={i} className="rc-variation-step"><span className="rc-variation-step-n">{i + 1}.</span> {step}</p>
                    ))}
                  </div>
                  {vm.recipe.garnish && <p className="rc-variation-garnish">Garnish: {vm.recipe.garnish}</p>}
                  <p className="rc-variation-meta">~{vCalories} cal · {vm.recipe.glassType} glass · {vm.recipe.difficulty}</p>
                  {!vm.canMake && vm.missingIngredients.length > 0 && (
                    <p className="rc-variation-missing">Missing: {vm.missingIngredients.join(', ')}</p>
                  )}
                </div>
              );
            })()}
          </div>
        )}

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

            {/* ── Glassware ── */}
            <div className="recipe-section recipe-glassware">
              <h4>Glassware</h4>
              <div className="glassware-row">
                <span className="glassware-emoji">{glass.emoji}</span>
                <div className="glassware-info">
                  <span className="glassware-label">{glass.label}</span>
                  <span className="glassware-reason">{glass.reason}</span>
                </div>
                <a
                  className="glassware-shop"
                  href="https://www.amazon.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Shop →
                </a>
              </div>
            </div>

            {/* ── Equipment ── */}
            {equipment.length > 0 && (
              <div className="equipment-alert">
                <strong>Special equipment needed</strong>
                <ul className="equipment-list">
                  {equipment.map(eq => (
                    <li key={eq.name} className="equipment-item">
                      <span className="equipment-name">{eq.name}</span>
                      <span className="equipment-reason"> — {eq.reason}</span>
                      <a
                        className="equipment-shop"
                        href="https://www.amazon.com"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Shop on Amazon →
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {!exploreMode && splashWarnings.length > 0 && (
              <div className="splash-alert">
                <strong>Running low:</strong> {splashWarnings.join(', ')} — you may not have enough
              </div>
            )}
            {missingIngredients.length > 0 && (
              <div className={exploreMode ? 'missing-alert missing-alert--explore' : 'missing-alert'}>
                <strong>{exploreMode ? 'Still need:' : "You're missing:"}</strong>{' '}
                {missingWithIds.map((ing, i) => {
                  const syrup = !exploreMode
                    ? houseSyrups.find(s => s.unlockIngredientId === ing.ingredientId)
                    : undefined;
                  return (
                    <React.Fragment key={ing.ingredientId}>
                      {i > 0 && ', '}
                      {ing.name}
                      {syrup && (
                        <button
                          className="rc-make-it-link"
                          onClick={e => { e.stopPropagation(); setSyrupSheet({ syrup, cocktailName: recipe.name }); }}
                        >
                          Make it →
                        </button>
                      )}
                    </React.Fragment>
                  );
                })}
                {/* Fallback for any unmatched names */}
                {missingIngredients
                  .filter(name => !missingWithIds.some(i => i.name === name))
                  .map((name, i) => (
                    <React.Fragment key={name}>
                      {(missingWithIds.length > 0 || i > 0) && ', '}
                      {name}
                    </React.Fragment>
                  ))
                }
              </div>
            )}

            {/* ── I Made This ── */}
            {onMadeThis && (
              <button
                className="recipe-made-this-btn"
                onClick={() => setShowModal(true)}
              >
                I Made This 🍸
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── Modals (portalled via sibling fragments) ── */}
      {showModal && (
        <IMadeThisModal
          recipeName={recipe.name}
          onConfirm={handleMadeThisConfirm}
          onCancel={() => setShowModal(false)}
        />
      )}

      {showSurvey && !surveyDone && (
        <DrinkSurvey
          recipeName={recipe.name}
          userId={userId ?? null}
          onDismiss={() => { setShowSurvey(false); setSurveyDone(true); }}
        />
      )}

      {syrupSheet && (
        <div className="rc-syrup-overlay" onClick={() => { setSyrupSheet(null); setSyrupConfirm(false); }}>
          <div className="rc-syrup-sheet" onClick={e => e.stopPropagation()}>
            <button className="rc-syrup-close" onClick={() => { setSyrupSheet(null); setSyrupConfirm(false); }}>✕</button>
            <p className="rc-syrup-context">
              To make <strong>{syrupSheet.cocktailName}</strong>, you need{' '}
              <strong>{syrupSheet.syrup.name}</strong>.
            </p>
            <h4 className="rc-syrup-name">{syrupSheet.syrup.name}</h4>
            <div className="rc-syrup-badges">
              <span className="rc-syrup-badge rc-syrup-badge--time">
                {syrupSheet.syrup.timeMinutes < 60
                  ? `${syrupSheet.syrup.timeMinutes} min`
                  : syrupSheet.syrup.timeMinutes >= 1440
                  ? `${Math.round(syrupSheet.syrup.timeMinutes / 1440)}d`
                  : `${Math.round(syrupSheet.syrup.timeMinutes / 60)} hr`}
              </span>
              <span className={`rc-syrup-badge rc-syrup-badge--diff rc-syrup-badge--${syrupSheet.syrup.difficulty}`}>
                {syrupSheet.syrup.difficulty}
              </span>
            </div>

            <div className="rc-syrup-section">
              <h5 className="rc-syrup-section-title">Ingredients</h5>
              <ul className="rc-syrup-ings">
                {syrupSheet.syrup.ingredients.map((ing, i) => (
                  <li key={i} className="rc-syrup-ing">
                    <span className="rc-syrup-ing-amt">{ing.amount} {ing.unit}</span>
                    <span>{ing.name}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rc-syrup-section">
              <h5 className="rc-syrup-section-title">Instructions</h5>
              <p className="rc-syrup-instructions">{syrupSheet.syrup.instructions}</p>
            </div>

            <div className="rc-syrup-tip">
              <span className="rc-syrup-tip-label">Vesper's tip</span>
              <p>{syrupSheet.syrup.vesperTip}</p>
            </div>

            <p className="rc-syrup-storage">{syrupSheet.syrup.storageNote}</p>

            <div className="rc-syrup-actions">
              {onTogglePantry && (
                <button
                  className={`rc-syrup-made-btn${checkedPantryIds?.has(syrupSheet.syrup.unlockIngredientId) ? ' rc-syrup-made-btn--on' : ''}`}
                  onClick={() => {
                    if (onTogglePantry) {
                      onTogglePantry(syrupSheet.syrup.unlockIngredientId);
                      setSyrupConfirm(true);
                      setTimeout(() => { setSyrupSheet(null); setSyrupConfirm(false); }, 1500);
                    }
                  }}
                >
                  {checkedPantryIds?.has(syrupSheet.syrup.unlockIngredientId)
                    ? '✓ Already in pantry'
                    : 'I Made This — Add to Pantry'}
                </button>
              )}
              {syrupConfirm && (
                <span className="rc-syrup-confirm">Added! Checking recipes…</span>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
