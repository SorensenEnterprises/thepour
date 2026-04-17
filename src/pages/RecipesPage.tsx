import React, { useState, useMemo } from 'react';
import { RecipeCard } from '../components/RecipeCard';
import { RecipeMatch } from '../utils/recipeUtils';

type ReadyFilter = 'all' | 'ready';
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

// Tags in sampleRecipes that map to each spirit bucket
const SPIRIT_TAG_MAP: Record<Exclude<SpiritFilter, 'all' | 'other'>, string[]> = {
  whiskey: ['whiskey', 'bourbon', 'rye', 'scotch'],
  gin:     ['gin'],
  tequila: ['tequila'],
  vodka:   ['vodka'],
  rum:     ['rum'],
};

interface Props {
  matches: RecipeMatch[];
}

export function RecipesPage({ matches }: Props) {
  const [readyFilter, setReadyFilter] = useState<ReadyFilter>('all');
  const [spiritFilter, setSpiritFilter] = useState<SpiritFilter>('all');
  const [search, setSearch] = useState('');

  const displayed = useMemo(() => {
    const q = search.trim().toLowerCase();
    return matches.filter(({ recipe, canMake }) => {
      if (readyFilter === 'ready' && !canMake) return false;

      if (spiritFilter !== 'all') {
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
  }, [matches, readyFilter, spiritFilter, search]);

  const readyCount = matches.filter(m => m.canMake).length;

  return (
    <div className="page">
      <div className="page-header">
        <h2>Recipe Suggestions</h2>
        <p className="page-subtitle">
          {readyCount} of {matches.length} recipes ready with your current bar
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

      <div className="recipe-list">
        {displayed.map(({ recipe, canMake, missingIngredients, splashWarnings }) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            canMake={canMake}
            missingIngredients={missingIngredients}
            splashWarnings={splashWarnings}
          />
        ))}
        {displayed.length === 0 && (
          <p className="empty-state">
            {search ? `No recipes matching "${search}"` : 'No recipes match your current filters.'}
          </p>
        )}
      </div>
    </div>
  );
}
