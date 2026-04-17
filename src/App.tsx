import React, { useState, useMemo } from 'react';
import { NavBar } from './components/NavBar';
import { RecipesPage } from './pages/RecipesPage';
import { InventoryPage } from './pages/InventoryPage';
import { LandingPage } from './pages/LandingPage';
import { useInventory } from './hooks/useInventory';
import { sampleRecipes } from './data/sampleRecipes';
import { matchRecipesToInventory } from './utils/recipeUtils';
import { QuantityLevel } from './types';
import './App.css';

type View = 'landing' | 'recipes' | 'inventory';

function App() {
  const [view, setView] = useState<View>('landing');
  const { inventory, inStockIds, splashIds, setQuantity, addItem } = useInventory();

  const matches = useMemo(
    () => matchRecipesToInventory(sampleRecipes, inStockIds, splashIds),
    [inStockIds, splashIds]
  );

  if (view === 'landing') {
    return <LandingPage onEnter={() => setView('recipes')} />;
  }

  return (
    <div className="app">
      <NavBar
        activePage={view as 'recipes' | 'inventory'}
        onNavigate={setView}
        onHome={() => setView('landing')}
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

export default App;
