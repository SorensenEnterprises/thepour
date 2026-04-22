import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { RecipeCard, MadeThisResult } from '../components/RecipeCard';
import { OneIngredientAway } from '../components/OneIngredientAway';
import { RecipeMatch } from '../utils/recipeUtils';
import { UnlockSuggestion } from '../utils/unlockCalculator';
import { decrementInventory } from '../utils/inventoryDecrement';
import { ResponsibleFooter } from '../components/ResponsibleFooter';
import { Recipe, InventoryItem, QuantityLevel } from '../types';
import { useAuth } from '../contexts/AuthContext';

type DrinkCategory = 'cocktail' | 'mocktail' | 'dirty-soda' | 'shot';
type ReadyFilter  = 'all' | 'ready';
type SpiritFilter = 'all' | 'whiskey' | 'gin' | 'tequila' | 'vodka' | 'rum' | 'other';

const SPIRIT_FILTERS: { value: SpiritFilter; label: string }[] = [
  { value: 'all',     label: 'All' },
  { value: 'whiskey', label: 'Whiskey' },
  { value: 'gin',     label: 'Gin' },
  { value: 'tequila', label: 'Tequila' },
  { value: 'vodka',   label: 'Vodka' },
  { value: 'rum',     label: 'Rum' },
  { value: 'other',   label: 'Other' },
];

const SPIRIT_TAG_MAP: Record<Exclude<SpiritFilter, 'all' | 'other'>, string[]> = {
  whiskey: ['whiskey', 'bourbon', 'rye', 'scotch'],
  gin:     ['gin'],
  tequila: ['tequila'],
  vodka:   ['vodka'],
  rum:     ['rum'],
};

const CATEGORY_TAG: Record<DrinkCategory, string> = {
  cocktail:     '',
  mocktail:     'mocktail',
  'dirty-soda': 'dirty-soda',
  shot:         'shot',
};

interface Toast {
  id:      number;
  text:    string;
  variant: 'normal' | 'amber';
}

interface Props {
  matches:           RecipeMatch[];
  unlockSuggestions: UnlockSuggestion[];
  inventory:         InventoryItem[];
  onSetQuantity:     (ingredientId: string, qty: QuantityLevel) => void;
  onRecipeMade?:     (recipeName: string, count: number) => void;
}

export function RecipesPage({ matches, unlockSuggestions, inventory, onSetQuantity, onRecipeMade }: Props) {
  const { user } = useAuth();

  const [category,      setCategory]      = useState<DrinkCategory>('cocktail');
  const [readyFilter,   setReadyFilter]   = useState<ReadyFilter>('all');
  const [spiritFilter,  setSpiritFilter]  = useState<SpiritFilter>('all');
  const [search,        setSearch]        = useState('');
  const [toasts,        setToasts]        = useState<Toast[]>([]);
  const [toastCounter,  setToastCounter]  = useState(0);

  function pushToast(text: string, variant: 'normal' | 'amber' = 'normal') {
    const id = toastCounter + 1;
    setToastCounter(id);
    setToasts(prev => [...prev, { id, text, variant }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  }

  const handleMadeThis = useCallback((recipe: Recipe, count: number): MadeThisResult => {
    const { updated, lowBottles, adjustedCount } = decrementInventory(inventory, recipe, count);

    // Apply each changed item back via setQuantity
    updated.forEach(item => {
      const original = inventory.find(i => i.ingredientId === item.ingredientId);
      if (original && original.quantity !== item.quantity) {
        onSetQuantity(item.ingredientId, item.quantity);
      }
    });

    // Normal confirmation toast
    const drinksLabel = count === 1 ? 'drink' : 'drinks';
    if (adjustedCount > 0) {
      pushToast(`Bar updated — ${count} ${drinksLabel} made, ${adjustedCount} bottle${adjustedCount !== 1 ? 's' : ''} adjusted`);
    } else {
      pushToast(`Logged ${count} ${drinksLabel} of ${recipe.name} 🍸`);
    }

    // Low-stock toasts (amber)
    lowBottles.forEach(name => {
      setTimeout(() => pushToast(`${name} is running low — time to restock`, 'amber'), 500);
    });

    // Vesper context (Step 5)
    onRecipeMade?.(recipe.name, count);

    return { lowBottles, adjustedCount };
  }, [inventory, onSetQuantity, onRecipeMade, toastCounter]);

  const categoryMatches = useMemo(() => {
    if (category === 'cocktail') {
      return matches.filter(({ recipe }) =>
        !recipe.tags.includes('mocktail') &&
        !recipe.tags.includes('dirty-soda') &&
        !recipe.tags.includes('shot'));
    }
    const tag = CATEGORY_TAG[category];
    return matches.filter(({ recipe }) => recipe.tags.includes(tag));
  }, [matches, category]);

  const displayed = useMemo(() => {
    const q = search.trim().toLowerCase();
    return categoryMatches.filter(({ recipe, canMake }) => {
      if (readyFilter === 'ready' && !canMake) return false;
      if (category === 'cocktail' && spiritFilter !== 'all') {
        const tags = recipe.tags;
        if (spiritFilter === 'other') {
          const allSpiritTags = Object.values(SPIRIT_TAG_MAP).flat();
          if (tags.some(t => allSpiritTags.includes(t))) return false;
        } else {
          const allowed = SPIRIT_TAG_MAP[spiritFilter];
          if (!tags.some(t => allowed.includes(t))) return false;
        }
      }
      if (q && !recipe.name.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [categoryMatches, category, readyFilter, spiritFilter, search]);

  const readyCount = categoryMatches.filter(m => m.canMake).length;

  const PAGE_TITLES: Record<DrinkCategory, string> = {
    cocktail:     'Recipe Suggestions',
    mocktail:     'Mocktail Recipes',
    'dirty-soda': 'Dirty Soda Recipes',
    shot:         'Shot Recipes',
  };

  return (
    <div className="page">
      <div className="page-header">
        <div className="category-toggle">
          {(['cocktail', 'mocktail', 'dirty-soda', 'shot'] as DrinkCategory[]).map(cat => (
            <button
              key={cat}
              className={`category-toggle-btn${category === cat ? ' active' : ''}`}
              onClick={() => { setCategory(cat); setSpiritFilter('all'); setReadyFilter('all'); }}
            >
              {cat === 'cocktail' ? '🍸 Cocktails' : cat === 'mocktail' ? '🧃 Mocktails' : cat === 'dirty-soda' ? '🥤 Dirty Sodas' : '🥃 Shots'}
            </button>
          ))}
        </div>

        <h2>{PAGE_TITLES[category]}</h2>
        <p className="page-subtitle">
          {`${readyCount} of ${categoryMatches.length} recipes ready with your current bar`}
        </p>

        <div className="recipes-search-row">
          <div className="search-wrap">
            <svg className="search-icon" viewBox="0 0 16 16" fill="none">
              <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <input
              className="search-input"
              type="text"
              placeholder="Search recipes…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button className="search-clear" onClick={() => setSearch('')} aria-label="Clear search">
                ×
              </button>
            )}
          </div>
        </div>

        <div className="filter-row">
          {(category === 'cocktail') && (
            <div className="filter-tabs spirit-filters">
              {SPIRIT_FILTERS.map(({ value, label }) => (
                <button
                  key={value}
                  className={`filter-tab ${spiritFilter === value ? 'active' : ''}`}
                  onClick={() => setSpiritFilter(value)}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
          <div className="filter-tabs ready-filter">
            <button
              className={`filter-tab ${readyFilter === 'all' ? 'active' : ''}`}
              onClick={() => setReadyFilter('all')}
            >
              All
            </button>
            <button
              className={`filter-tab filter-tab--ready ${readyFilter === 'ready' ? 'active' : ''}`}
              onClick={() => setReadyFilter('ready')}
            >
              Ready ({readyCount})
            </button>
          </div>
        </div>
      </div>

      <OneIngredientAway suggestions={unlockSuggestions} />

      <div className="recipe-list">
        {displayed.map(({ recipe, canMake, missingIngredients, splashWarnings, haveCount, totalCount }) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            canMake={canMake}
            missingIngredients={missingIngredients}
            splashWarnings={splashWarnings}
            haveCount={haveCount}
            totalCount={totalCount}
            exploreMode={false}
            onMadeThis={count => handleMadeThis(recipe, count)}
            userId={user?.id ?? null}
          />
        ))}
        {displayed.length === 0 && (
          <p className="empty-state">
            {search ? `No recipes matching "${search}"` : 'No recipes match your current filters.'}
          </p>
        )}
      </div>
      <ResponsibleFooter />

      {/* ── Toasts ── */}
      <div className="rp-toasts" aria-live="polite">
        {toasts.map(t => (
          <div key={t.id} className={`rp-toast rp-toast--${t.variant}`}>
            {t.text}
          </div>
        ))}
      </div>
    </div>
  );
}
