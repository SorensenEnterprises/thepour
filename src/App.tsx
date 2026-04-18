import React, { useState, useMemo } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NavBar } from './components/NavBar';
import { RecipesPage } from './pages/RecipesPage';
import { InventoryPage } from './pages/InventoryPage';
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { useInventory } from './hooks/useInventory';
import { sampleRecipes } from './data/sampleRecipes';
import { matchRecipesToInventory } from './utils/recipeUtils';
import { QuantityLevel } from './types';
import './App.css';

type View = 'landing' | 'auth' | 'recipes' | 'inventory';

function AppContent() {
  const { user, isGuest, loading } = useAuth();
  const [view, setView] = useState<View>('landing');

  const { inventory, inStockIds, splashIds, setQuantity, addItem } = useInventory(user?.id);

  const matches = useMemo(
    () => matchRecipesToInventory(sampleRecipes, inStockIds, splashIds),
    [inStockIds, splashIds]
  );

  if (loading) {
    return (
      <div className="app-loading">
        <span className="app-loading-brand">thepour<span style={{ color: '#4abbc4' }}>.</span></span>
      </div>
    );
  }

  // Landing page — always show first
  if (view === 'landing') {
    return (
      <LandingPage
        onEnter={() => {
          // If already authed or guest, go straight to app
          if (user || isGuest) {
            setView('recipes');
          } else {
            setView('auth');
          }
        }}
      />
    );
  }

  // Auth gate — shown when not signed in (including guests who want to sign in)
  if (view === 'auth' && !user) {
    return <AuthPage onEntered={() => setView('recipes')} />;
  }

  // Main app shell
  return (
    <div className="app">
      <NavBar
        activePage={view as 'recipes' | 'inventory'}
        onNavigate={setView}
        onHome={() => setView('landing')}
        onSignIn={() => setView('auth')}
        onSignOut={() => setView('auth')}
      />
      <main className="main-content">
        {view === 'recipes' ? (
          <RecipesPage matches={matches} />
        ) : (
          <InventoryPage
            inventory={inventory}
            onSetQuantity={(id: string, qty: QuantityLevel) => setQuantity(id, qty)}
            onAddItem={addItem}
          />
        )}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
