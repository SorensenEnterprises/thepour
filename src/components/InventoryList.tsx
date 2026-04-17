import React from 'react';
import { InventoryItem, QuantityLevel, QUANTITY_LEVELS, QUANTITY_LABELS } from '../types';

interface Props {
  inventory: InventoryItem[];
  onSetQuantity: (id: string, qty: QuantityLevel) => void;
}

const CATEGORY_ORDER: InventoryItem['category'][] = [
  'spirit', 'liqueur', 'mixer', 'syrup', 'bitters', 'garnish', 'other',
];

const CATEGORY_LABELS: Record<InventoryItem['category'], string> = {
  spirit:  'Spirits',
  liqueur: 'Liqueurs & Fortified',
  mixer:   'Mixers & Juice',
  syrup:   'Syrups',
  bitters: 'Bitters',
  garnish: 'Garnishes',
  other:   'Other',
};

function sortItems(items: InventoryItem[]): InventoryItem[] {
  return [...items].sort((a, b) => {
    const aOut = a.quantity === 'out' ? 1 : 0;
    const bOut = b.quantity === 'out' ? 1 : 0;
    if (aOut !== bOut) return aOut - bOut;
    return a.name.localeCompare(b.name);
  });
}

function QuantityBadge({ level }: { level: QuantityLevel }) {
  return (
    <span className={`qty-badge qty-badge--${level}`}>
      {QUANTITY_LABELS[level]}
    </span>
  );
}

function QuantitySelector({
  current,
  onChange,
}: {
  current: QuantityLevel;
  onChange: (qty: QuantityLevel) => void;
}) {
  return (
    <div className="qty-selector" role="group" aria-label="Quantity level">
      {QUANTITY_LEVELS.map(level => (
        <button
          key={level}
          className={`qty-btn qty-btn--${level} ${current === level ? 'qty-btn--active' : ''}`}
          onClick={() => onChange(level)}
          title={QUANTITY_LABELS[level]}
          aria-pressed={current === level}
        >
          {QUANTITY_LABELS[level]}
        </button>
      ))}
    </div>
  );
}

export function InventoryList({ inventory, onSetQuantity }: Props) {
  const grouped = CATEGORY_ORDER.reduce((acc, cat) => {
    const items = inventory.filter(item => item.category === cat);
    if (items.length > 0) acc[cat] = sortItems(items);
    return acc;
  }, {} as Record<string, InventoryItem[]>);

  return (
    <div className="inventory-list">
      {Object.entries(grouped).map(([category, items]) => {
        const inStockCount = items.filter(i => i.quantity !== 'out').length;
        return (
          <div key={category} className="inventory-group">
            <h3 className="category-heading">
              {CATEGORY_LABELS[category as InventoryItem['category']]}
              <span className="category-count">{inStockCount}/{items.length}</span>
            </h3>
            <ul>
              {items.map(item => (
                <li
                  key={item.ingredientId}
                  className={`inventory-item inventory-item--${item.quantity}${item.quantity === 'out' ? ' inventory-item--sunk' : ''}`}
                >
                  <div className="inventory-item-top">
                    <span className={`inventory-item-name ${item.quantity === 'out' ? 'inventory-item-name--out' : ''}`}>
                      {item.name}
                    </span>
                    <QuantityBadge level={item.quantity} />
                  </div>
                  <QuantitySelector
                    current={item.quantity}
                    onChange={qty => onSetQuantity(item.ingredientId, qty)}
                  />
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
