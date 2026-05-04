import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ThePourLogo } from './ThePourLogo';

interface Props {
  activePage: 'recipes' | 'inventory';
  onNavigate: (page: 'recipes' | 'inventory') => void;
  onHome: () => void;
  onSignIn?: () => void;
  onSignOut?: () => void;
  onOpenShoppingList?: () => void;
}

export function NavBar({ activePage, onNavigate, onHome, onSignIn, onSignOut, onOpenShoppingList }: Props) {
  const { user, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
  const topPadding = isStandalone ? 54 : 0;
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [menuOpen]);

  const initial = user?.email?.[0].toUpperCase() ?? '?';

  return (
    <nav className="navbar" style={{ paddingTop: `${topPadding}px`, height: `calc(62px + ${topPadding}px)`, top: `${topPadding}px` }}>
      <button className="navbar-brand navbar-home" onClick={onHome}>
        <ThePourLogo glassSize={22} fontSize={17} />
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
        {onOpenShoppingList && (
          <button
            className="nav-link nav-link--cart"
            onClick={onOpenShoppingList}
            aria-label="Shopping list"
            title="What to buy next"
          >
            🛒
          </button>
        )}

        {/* Account indicator */}
        {user ? (
          <div className="nav-account" ref={menuRef}>
            <button
              className="nav-avatar"
              onClick={() => setMenuOpen(o => !o)}
              aria-label="Account menu"
              title={user.email}
            >
              {initial}
            </button>
            {menuOpen && (
              <div className="nav-menu">
                <p className="nav-menu-email">{user.email}</p>
                <button
                  className="nav-menu-signout"
                  onClick={async () => { setMenuOpen(false); await signOut(); onSignOut?.(); }}
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        ) : !user && onSignIn ? (
          <button className="nav-signin-link" onClick={onSignIn}>
            Sign in
          </button>
        ) : null}
      </div>
    </nav>
  );
}
