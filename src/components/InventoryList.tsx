import React, { useState } from 'react';
import { InventoryItem, QuantityLevel, QUANTITY_LEVELS, QUANTITY_LABELS, BOTTLE_SIZES } from '../types';

interface Props {
  inventory: InventoryItem[];
  onSetQuantity: (id: string, qty: QuantityLevel) => void;
  onEdit: (item: InventoryItem) => void;
  onDelete: (id: string) => void;
}

type SectionKey = 'spirits' | 'liqueurs' | 'mixers' | 'other';

const SECTION_ORDER: SectionKey[] = ['spirits', 'liqueurs', 'mixers', 'other'];

const SECTION_LABELS: Record<SectionKey, string> = {
  spirits:  'Spirits',
  liqueurs: 'Liqueurs & Fortified',
  mixers:   'Mixers & Juice',
  other:    'Other',
};

function getSectionKey(category: InventoryItem['category']): SectionKey {
  if (category === 'spirit')  return 'spirits';
  if (category === 'liqueur') return 'liqueurs';
  if (category === 'mixer')   return 'mixers';
  return 'other';
}

function sizeLabelShort(size?: number): string | null {
  if (!size || size === 750) return null;
  const found = BOTTLE_SIZES.find(s => s.value === size);
  if (!found) return null;
  return found.value >= 1000 ? `${found.value / 1000}L` : `${found.value}ml`;
}

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

function QuantitySelector({ current, onChange }: { current: QuantityLevel; onChange: (qty: QuantityLevel) => void }) {
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

interface SectionProps {
  sectionKey: SectionKey;
  items: InventoryItem[];
  open: boolean;
  onToggle: () => void;
  onSetQuantity: (id: string, qty: QuantityLevel) => void;
  onEdit: (item: InventoryItem) => void;
  onDelete: (id: string) => void;
}

function InventorySection({ sectionKey, items, open, onToggle, onSetQuantity, onEdit, onDelete }: SectionProps) {
  const inStockCount = items.filter(i => i.quantity !== 'out').length;

  return (
    <div className={`inv-section${open ? ' inv-section--open' : ''}`}>
      <button className="inv-section-header" onClick={onToggle} aria-expanded={open}>
        <span className="inv-section-name">{SECTION_LABELS[sectionKey]}</span>
        <span className="inv-section-meta">
          <span className="inv-section-count">{inStockCount}/{items.length}</span>
          <svg
            className={`inv-section-chevron${open ? ' inv-section-chevron--open' : ''}`}
            width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </button>

      <div className="inv-section-body">
        <div className="inv-section-body-inner">
          <ul>
            {items.map(item => {
              const sizeTag = sizeLabelShort(item.size);
              return (
                <li
                  key={item.ingredientId}
                  className={`inventory-item inventory-item--${item.quantity}${item.quantity === 'out' ? ' inventory-item--sunk' : ''}`}
                >
                  <div className="inventory-item-top">
                    <div className="inventory-item-name-wrap">
                      <span className={`inventory-item-name ${item.quantity === 'out' ? 'inventory-item-name--out' : ''}`}>
                        {item.name}
                      </span>
                      {sizeTag && (
                        <span className="inventory-size-tag">{sizeTag}</span>
                      )}
                    </div>
                    <div className="inventory-item-actions">
                      <QuantityBadge level={item.quantity} />
                      <button
                        className="inv-icon-btn inv-edit-btn"
                        onClick={() => onEdit(item)}
                        aria-label={`Edit ${item.name}`}
                        title="Edit bottle"
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                      </button>
                      <button
                        className="inv-icon-btn inv-delete-btn"
                        onClick={() => {
                          if (window.confirm(`Remove "${item.name}" from your bar?`)) {
                            onDelete(item.ingredientId);
                          }
                        }}
                        aria-label={`Delete ${item.name}`}
                        title="Remove bottle"
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6"/>
                          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                          <path d="M10 11v6M14 11v6"/>
                          <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                  <QuantitySelector
                    current={item.quantity}
                    onChange={qty => onSetQuantity(item.ingredientId, qty)}
                  />
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

export function InventoryList({ inventory, onSetQuantity, onEdit, onDelete }: Props) {
  const [openSections, setOpenSections] = useState<Record<SectionKey, boolean>>({
    spirits:  true,
    liqueurs: false,
    mixers:   false,
    other:    false,
  });

  const allOpen = SECTION_ORDER.every(k => openSections[k]);

  function toggleSection(key: SectionKey) {
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));
  }

  function toggleAll() {
    const next = !allOpen;
    setOpenSections({ spirits: next, liqueurs: next, mixers: next, other: next });
  }

  const grouped = SECTION_ORDER.reduce((acc, key) => {
    const items = inventory.filter(item => getSectionKey(item.category) === key);
    if (items.length > 0) acc[key] = sortItems(items);
    return acc;
  }, {} as Partial<Record<SectionKey, InventoryItem[]>>);

  const visibleSections = SECTION_ORDER.filter(k => grouped[k]);

  return (
    <div className="inventory-list">
      {visibleSections.length > 0 && (
        <div className="inv-list-toolbar">
          <button className="inv-expand-all-btn" onClick={toggleAll}>
            {allOpen ? 'Collapse all' : 'Expand all'}
          </button>
        </div>
      )}

      {visibleSections.map(key => (
        <InventorySection
          key={key}
          sectionKey={key}
          items={grouped[key]!}
          open={openSections[key]}
          onToggle={() => toggleSection(key)}
          onSetQuantity={onSetQuantity}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
