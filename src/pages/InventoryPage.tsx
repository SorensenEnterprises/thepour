import React, { useState } from 'react';
import { InventoryList } from '../components/InventoryList';
import { AddBottleForm } from '../components/AddBottleForm';
import { InventoryItem, QuantityLevel } from '../types';

interface Props {
  inventory: InventoryItem[];
  onSetQuantity: (id: string, qty: QuantityLevel) => void;
  onAddItem: (item: InventoryItem) => void;
}

export function InventoryPage({ inventory, onSetQuantity, onAddItem }: Props) {
  const [showForm, setShowForm] = useState(false);
  const inStockCount = inventory.filter(i => i.quantity !== 'out').length;

  return (
    <div className="page">
      <div className="page-header inventory-page-header">
        <div>
          <h2>My Bar</h2>
          <p className="page-subtitle">
            {inStockCount} of {inventory.length} ingredients stocked — set levels for each bottle
          </p>
        </div>
        <button className="add-bottle-btn" onClick={() => setShowForm(true)}>
          + Add Bottle
        </button>
      </div>

      <InventoryList inventory={inventory} onSetQuantity={onSetQuantity} />

      {showForm && (
        <AddBottleForm
          onAdd={item => { onAddItem(item); setShowForm(false); }}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}
