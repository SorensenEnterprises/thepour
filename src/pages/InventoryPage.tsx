import React, { useState } from 'react';
import { InventoryList } from '../components/InventoryList';
import { AddBottleForm } from '../components/AddBottleForm';
import { BarcodeScannerModal } from '../components/BarcodeScannerModal';
import { PhotoScanModal } from '../components/PhotoScanModal';
import { ResponsibleFooter } from '../components/ResponsibleFooter';
import { InventoryItem, QuantityLevel, Ingredient, BottleSize } from '../types';
import { RecognizedBottle, mapBottleType, mapBottleToSpiritType } from '../lib/bottleRecognition';

interface Props {
  inventory: InventoryItem[];
  onSetQuantity: (id: string, qty: QuantityLevel) => void;
  onAddItem: (item: InventoryItem) => void;
  onEditItem: (item: InventoryItem) => void;
  onDeleteItem: (id: string) => void;
}

type Overlay = 'none' | 'method-picker' | 'scan' | 'photo' | 'shelf' | 'add' | 'edit';

const detectCategoryFromType = (type: string): Ingredient['category'] => mapBottleType(type);

export function InventoryPage({ inventory, onSetQuantity, onAddItem, onEditItem, onDeleteItem }: Props) {
  const [overlay, setOverlay]           = useState<Overlay>('none');
  const [prefillName, setPrefillName]         = useState('');
  const [prefillCategory, setPrefillCategory] = useState<Ingredient['category']>('spirit');
  const [prefillSpiritType, setPrefillSpiritType] = useState('');
  const [editingItem, setEditingItem]         = useState<InventoryItem | null>(null);

  const inStockCount = inventory.filter(i => i.quantity !== 'out').length;

  function openAdd(name = '', category: Ingredient['category'] = 'spirit', spiritType = '') {
    setPrefillName(name);
    setPrefillCategory(category);
    setPrefillSpiritType(spiritType);
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
          <button className="add-bottle-btn" onClick={() => setOverlay('method-picker')}>
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

      {overlay === 'method-picker' && (
        <div className="method-picker-overlay" onClick={e => { if (e.target === e.currentTarget) setOverlay('none'); }}>
          <div className="method-picker-modal">
            <button className="method-picker-close" onClick={() => setOverlay('none')} aria-label="Close">×</button>
            <h2 className="method-picker-title">Add a Bottle</h2>
            <p className="method-picker-sub">How do you want to add it?</p>
            <div className="method-picker-grid">
              <button className="method-card" onClick={() => setOverlay('scan')}>
                <span className="method-card-icon">📷</span>
                <span className="method-card-label">Scan Barcode</span>
                <span className="method-card-desc">Scan a barcode</span>
              </button>
              <button className="method-card" onClick={() => setOverlay('photo')}>
                <span className="method-card-icon">📸</span>
                <span className="method-card-label">Photo</span>
                <span className="method-card-desc">Identify one bottle by photo</span>
              </button>
              <button className="method-card method-card--featured" onClick={() => setOverlay('shelf')}>
                <span className="method-card-icon">✨</span>
                <span className="method-card-label">Scan My Bar</span>
                <span className="method-card-desc">Add your whole bar at once</span>
              </button>
              <button className="method-card" onClick={() => { setOverlay('none'); openAdd(); }}>
                <span className="method-card-icon">✏️</span>
                <span className="method-card-label">Add Manually</span>
                <span className="method-card-desc">Type it in</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {overlay === 'scan' && (
        <BarcodeScannerModal
          onFound={(name, category) => openAdd(name, category)}
          onNotFound={() => openAdd()}
          onClose={() => setOverlay('none')}
        />
      )}

      {overlay === 'photo' && (
        <PhotoScanModal
          mode="single"
          onConfirmSingle={(bottle: RecognizedBottle) =>
            openAdd(bottle.name, detectCategoryFromType(bottle.type), mapBottleToSpiritType(bottle.type, bottle.brand))
          }
          onClose={() => setOverlay('none')}
        />
      )}

      {overlay === 'shelf' && (
        <PhotoScanModal
          mode="shelf"
          onConfirmShelf={(bottles: RecognizedBottle[]) => {
            bottles.forEach((b, i) => {
              const spiritType = mapBottleToSpiritType(b.type, b.brand);
              const item: InventoryItem = {
                ingredientId:
                  b.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') +
                  '-' + Date.now() + i,
                name:       b.name,
                category:   detectCategoryFromType(b.type),
                quantity:   'full',
                size:       ([50, 375, 750, 1000, 1750].includes(b.size_ml) ? b.size_ml : 750) as BottleSize,
                spiritType: spiritType || undefined,
              };
              onAddItem(item);
            });
            setOverlay('none');
          }}
          onClose={() => setOverlay('none')}
        />
      )}

      {overlay === 'add' && (
        <AddBottleForm
          prefillName={prefillName}
          prefillCategory={prefillCategory}
          prefillSpiritType={prefillSpiritType}
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
