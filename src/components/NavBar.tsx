import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface Props {
  activePage: 'recipes' | 'inventory';
  onNavigate: (page: 'recipes' | 'inventory') => void;
  onHome: () => void;
  onSignIn?: () => void;
  onSignOut?: () => void;
}

export function NavBar({ activePage, onNavigate, onHome, onSignIn, onSignOut }: Props) {
  const { user, isGuest, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
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
