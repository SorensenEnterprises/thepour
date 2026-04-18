import React, { useState, useRef, useEffect } from 'react';
import { InventoryItem, Ingredient, QuantityLevel, QUANTITY_LABELS } from '../types';

interface Props {
  onAdd: (item: InventoryItem) => void;
  onClose: () => void;
  prefillName?: string;
  prefillCategory?: Ingredient['category'];
}

const CATEGORIES: { value: Ingredient['category']; label: string }[] = [
  { value: 'spirit',  label: 'Spirits' },
  { value: 'liqueur', label: 'Liqueurs & Fortified' },
  { value: 'mixer',   label: 'Mixers & Juice' },
  { value: 'syrup',   label: 'Syrups' },
  { value: 'bitters', label: 'Bitters' },
  { value: 'garnish', label: 'Garnishes' },
  { value: 'other',   label: 'Other' },
];

// Quantity levels available when adding — "out" excluded since you're adding something you have
const ADD_LEVELS: QuantityLevel[] = ['full', 'three-quarters', 'half', 'quarter', 'splash'];

export function AddBottleForm({ onAdd, onClose, prefillName = '', prefillCategory = 'spirit' }: Props) {
  const [name, setName] = useState(prefillName);
  const [category, setCategory] = useState<Ingredient['category']>(prefillCategory);
  const [quantity, setQuantity] = useState<QuantityLevel>('full');
  const [error, setError] = useState('');
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    nameRef.current?.focus();
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Please enter a bottle name.');
      nameRef.current?.focus();
      return;
    }
    const id = trimmed.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '-' + Date.now();
    onAdd({ ingredientId: id, name: trimmed, category, quantity });
    onClose();
  }

  return (
    <div className="add-bottle-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="add-bottle-modal" role="dialog" aria-modal="true" aria-label="Add a bottle">
        <div className="add-bottle-header">
          <h3>Add a Bottle</h3>
          <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-field">
            <label className="form-label" htmlFor="bottle-name">Bottle name</label>
            <input
              ref={nameRef}
              id="bottle-name"
              className={`form-input ${error ? 'form-input--error' : ''}`}
              type="text"
              placeholder="e.g. Hendrick's Gin"
              value={name}
              onChange={e => { setName(e.target.value); setError(''); }}
            />
            {error && <span className="form-error">{error}</span>}
          </div>

          <div className="form-field">
            <label className="form-label" htmlFor="bottle-category">Category</label>
            <select
              id="bottle-category"
              className="form-select"
              value={category}
              onChange={e => setCategory(e.target.value as Ingredient['category'])}
            >
              {CATEGORIES.map(c => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label className="form-label">How much do you have?</label>
            <div className="qty-selector">
              {ADD_LEVELS.map(level => (
                <button
                  key={level}
                  type="button"
                  className={`qty-btn qty-btn--${level} ${quantity === level ? 'qty-btn--active' : ''}`}
                  onClick={() => setQuantity(level)}
                  aria-pressed={quantity === level}
                >
                  {QUANTITY_LABELS[level]}
                </button>
              ))}
            </div>
          </div>

          <button type="submit" className="add-bottle-submit">
            Add to My Bar
          </button>
        </form>
      </div>
    </div>
  );
}
