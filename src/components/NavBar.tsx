import React from 'react';

interface Props {
  activePage: 'recipes' | 'inventory';
  onNavigate: (page: 'recipes' | 'inventory') => void;
}

export function NavBar({ activePage, onNavigate }: Props) {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="brand-icon">🍸</span>
        <span className="brand-name">thepour.</span>
      </div>
      <div className="navbar-links">
        <button
          className={`nav-link ${activePage === 'recipes' ? 'active' : ''}`}
          onClick={() => onNavigate('recipes')}
        >
          Recipes
        </button>
        <button
          className={`nav-link ${activePage === 'inventory' ? 'active' : ''}`}
          onClick={() => onNavigate('inventory')}
        >
          My Bar
        </button>
      </div>
    </nav>
  );
}
