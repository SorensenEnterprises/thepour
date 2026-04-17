import React from 'react';

interface Props {
  activePage: 'recipes' | 'inventory';
  onNavigate: (page: 'recipes' | 'inventory') => void;
  onHome: () => void;
}

export function NavBar({ activePage, onNavigate, onHome }: Props) {
  return (
    <nav className="navbar">
      <button className="navbar-brand navbar-home" onClick={onHome}>
        <span className="brand-name">thepour<span className="brand-period">.</span></span>
      </button>
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
