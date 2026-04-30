import React, { useState, useEffect } from 'react';
import { FeaturedDrink } from '../hooks/useFeaturedDrink';
import './FeaturedDrinkBanner.css';

interface Props {
  featured: FeaturedDrink;
  isReady: boolean;
  onMakeThis: (drinkName: string) => void;
}

export function FeaturedDrinkBanner({ featured, isReady, onMakeThis }: Props) {
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const key = `featured_dismissed_${featured.id}`;
    if (sessionStorage.getItem(key)) setDismissed(true);
  }, [featured.id]);

  function handleDismiss() {
    sessionStorage.setItem(`featured_dismissed_${featured.id}`, '1');
    setDismissed(true);
  }

  if (dismissed) return null;

  // First sentence of Vesper's description only
  const teaser = featured.vesper_description.split(/(?<=[.!?])\s/)[0];

  return (
    <div className="fdb-wrap">
      <div className="fdb-inner">
        <div className="fdb-content">
          {featured.occasion && (
            <p className="fdb-occasion">{featured.occasion}</p>
          )}
          <div className="fdb-title-row">
            <h3 className="fdb-title">{featured.drink_name}</h3>
            {featured.sponsor_name && (
              <span className="fdb-featured-badge">Featured</span>
            )}
          </div>
          <p className="fdb-teaser">{teaser}</p>
          <div className="fdb-actions">
            <button
              className="fdb-make-btn"
              onClick={() => onMakeThis(featured.drink_name)}
            >
              Make This →
            </button>
            {isReady && <span className="fdb-ready">Ready ✓</span>}
          </div>
        </div>
        <button
          className="fdb-dismiss"
          onClick={handleDismiss}
          aria-label="Dismiss"
        >
          ×
        </button>
      </div>
    </div>
  );
}
