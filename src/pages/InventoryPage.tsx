import React, { useState } from 'react';
import { InventoryList } from '../components/InventoryList';
import { AddBottleForm } from '../components/AddBottleForm';
import { BarcodeScannerModal } from '../components/BarcodeScannerModal';
import { ResponsibleFooter } from '../components/ResponsibleFooter';
import { InventoryItem, QuantityLevel, Ingredient } from '../types';

interface Props {
  inventory: InventoryItem[];
  onSetQuantity: (id: string, qty: QuantityLevel) => void;
  onAddItem: (item: InventoryItem) => void;
  onEditItem: (item: InventoryItem) => void;
  onDeleteItem: (id: string) => void;
}

type Overlay = 'none' | 'scan' | 'add' | 'edit';

export function InventoryPage({ inventory, onSetQuantity, onAddItem, onEditItem, onDeleteItem }: Props) {
  const [overlay, setOverlay]           = useState<Overlay>('none');
  const [prefillName, setPrefillName]   = useState('');
  const [prefillCategory, setPrefillCategory] = useState<Ingredient['category']>('spirit');
  const [editingItem, setEditingItem]   = useState<InventoryItem | null>(null);

  const inStockCount = inventory.filter(i => i.quantity !== 'out').length;

  function openAdd(name = '', category: Ingredient['category'] = 'spirit') {
    setPrefillName(name);
    setPrefillCategory(category);
    setEditingItem(null);
    setOverlay('add');
  }

  function openEdit(item: InventoryItem) {
    setEditingItem(item);
    setOverlay('edit');
  }

  return (
    <div className="page">
      <div className="page-header inventory-page-header">
        <div>
          <h2>My Bar</h2>
          <p className="page-subtitle">
            {inStockCount} of {inventory.length} ingredients stocked — set levels for each bottle
          </p>
        </div>
        <div className="inventory-header-btns">
          <button className="scan-bottle-btn" onClick={() => setOverlay('scan')}>
            📷 Scan
          </button>
          <button className="add-bottle-btn" onClick={() => openAdd()}>
            + Add Bottle
          </button>
        </div>
      </div>

      <InventoryList
        inventory={inventory}
        onSetQuantity={onSetQuantity}
        onEdit={openEdit}
        onDelete={onDeleteItem}
      />
      <ResponsibleFooter />

      {overlay === 'scan' && (
        <BarcodeScannerModal
          onFound={(name, category) => openAdd(name, category)}
          onNotFound={() => openAdd()}
          onClose={() => setOverlay('none')}
        />
      )}

      {overlay === 'add' && (
        <AddBottleForm
          prefillName={prefillName}
          prefillCategory={prefillCategory}
          onSave={item => { onAddItem(item); setOverlay('none'); }}
          onClose={() => setOverlay('none')}
        />
      )}

      {overlay === 'edit' && editingItem && (
        <AddBottleForm
          existingId={editingItem.ingredientId}
          prefillName={editingItem.name}
          prefillCategory={editingItem.category}
          prefillQuantity={editingItem.quantity}
          prefillSize={editingItem.size}
          prefillSpiritType={editingItem.spiritType}
          onSave={item => { onEditItem(item); setOverlay('none'); }}
          onClose={() => setOverlay('none')}
        />
      )}
    </div>
  );
}
