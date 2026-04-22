import React, { useState, useMemo } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NavBar } from './components/NavBar';
import { BartenderModal } from './components/BartenderModal';
import { RecipesPage } from './pages/RecipesPage';
import { InventoryPage } from './pages/InventoryPage';
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { useInventory } from './hooks/useInventory';
import { usePantry } from './hooks/usePantry';
import { sampleRecipes } from './data/sampleRecipes';
import { matchRecipesToInventory } from './utils/recipeUtils';
import { calculateUnlocks } from './utils/unlockCalculator';
import { QuantityLevel } from './types';
import './App.css';

type View = 'landing' | 'auth' | 'recipes' | 'inventory';

function AppContent() {
  const { user, isGuest, loading } = useAuth();
  const [view, setView] = useState<View>('landing');
  const [pendingView, setPendingView] = useState<'recipes' | 'inventory'>('recipes');
  const [bartenderOpen, setBartenderOpen] = useState(false);
  const [bartenderInitialMode, setBartenderInitialMode] = useState<'my-bar' | 'im-out' | 'explore'>('my-bar');

  const {
    inventory, inStockIds, splashIds,
    loading: inventoryLoading, error: inventoryError, clearError,
    setQuantity, addItem, editItem, removeItem,
  } = useInventory(user?.id);

  const { checkedPantryIds, togglePantry } = usePantry(user?.id);

  const matches = useMemo(
    () => matchRecipesToInventory(sampleRecipes, inventory, splashIds, checkedPantryIds),
    [inventory, splashIds, checkedPantryIds]
  );

  const unlockSuggestions = useMemo(
    () => calculateUnlocks(sampleRecipes, inventory, checkedPantryIds),
    [inventory, checkedPantryIds]
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
    const handleEnterView = (target: 'recipes' | 'inventory') => {
      setPendingView(target);
      if (user || isGuest) setView(target);
      else setView('auth');
    };
    return (
      <LandingPage
        onEnter={() => handleEnterView('recipes')}
        onEnterView={handleEnterView}
      />
    );
  }

  // Auth gate — shown when not signed in (including guests who want to sign in)
  if (view === 'auth' && !user) {
    return <AuthPage onEntered={() => setView(pendingView)} />;
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
          <RecipesPage matches={matches} unlockSuggestions={unlockSuggestions} />
        ) : (
          <InventoryPage
            inventory={inventory}
            onSetQuantity={(id: string, qty: QuantityLevel) => setQuantity(id, qty)}
            onAddItem={addItem}
            onEditItem={editItem}
            onDeleteItem={removeItem}
            loading={inventoryLoading}
            error={inventoryError}
            onClearError={clearError}
            isGuest={isGuest && !user}
            onSignIn={() => { setPendingView('inventory'); setView('auth'); }}
            checkedPantryIds={checkedPantryIds}
            onTogglePantry={togglePantry}
          />
        )}
      </main>

      <div className="fab-group">
        <button
          className="im-out-fab"
          onClick={() => { setBartenderInitialMode('im-out'); setBartenderOpen(true); }}
        >
          🚪 I'm Out
        </button>
        <button
          className="bartender-fab"
          onClick={() => { setBartenderInitialMode('my-bar'); setBartenderOpen(true); }}
        >
          🍸 Ask Vesper
        </button>
      </div>

      {bartenderOpen && (
        <BartenderModal
          onClose={() => setBartenderOpen(false)}
          inStockIds={inStockIds}
          inventory={inventory}
          checkedPantryIds={checkedPantryIds}
          onGoToInventory={() => { setBartenderOpen(false); setView('inventory'); }}
          initialMode={bartenderInitialMode}
          unlockSuggestions={unlockSuggestions}
        />
      )}
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
