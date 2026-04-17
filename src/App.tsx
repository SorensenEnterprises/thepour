import React, { useState, useMemo } from 'react';
import { NavBar } from './components/NavBar';
import { RecipesPage } from './pages/RecipesPage';
import { InventoryPage } from './pages/InventoryPage';
import { useInventory } from './hooks/useInventory';
import { sampleRecipes } from './data/sampleRecipes';
import { matchRecipesToInventory } from './utils/recipeUtils';
import { QuantityLevel } from './types';
import './App.css';

type Page = 'recipes' | 'inventory';

function App() {
  const [activePage, setActivePage] = useState<Page>('recipes');
  const { inventory, inStockIds, splashIds, setQuantity, addItem } = useInventory();

  const matches = useMemo(
    () => matchRecipesToInventory(sampleRecipes, inStockIds, splashIds),
    [inStockIds, splashIds]
  );

  return (
    <div className="app">
      <NavBar activePage={activePage} onNavigate={setActivePage} />
      <main className="main-content">
        {activePage === 'recipes' ? (
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
