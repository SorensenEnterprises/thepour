import React, { useState } from 'react';
import './IMadeThisModal.css';

interface Props {
  recipeName: string;
  onConfirm:  (count: number) => void;
  onCancel:   () => void;
}

const QUICK_COUNTS = [1, 2, 3, 4, 6, 8];

export function IMadeThisModal({ recipeName, onConfirm, onCancel }: Props) {
  const [selected,  setSelected]  = useState(1);
  const [custom,    setCustom]    = useState(false);
  const [customVal, setCustomVal] = useState('');

  const effectiveCount = custom ? (parseInt(customVal, 10) || 0) : selected;
  const canConfirm     = effectiveCount >= 1;

  function handleSelectQuick(n: number) {
    setCustom(false);
    setSelected(n);
  }

  function handleConfirm() {
    if (!canConfirm) return;
    onConfirm(effectiveCount);
  }

  return (
    <div className="imt-overlay" onClick={onCancel}>
      <div className="imt-sheet" onClick={e => e.stopPropagation()}>
        <div className="imt-handle" aria-hidden="true" />

        <h3 className="imt-title">How many did you make?</h3>
        <p className="imt-sub">We'll update your bar inventory</p>

        <div className="imt-count-row">
          {QUICK_COUNTS.map(n => (
            <button
              key={n}
              className={`imt-pill${!custom && selected === n ? ' imt-pill--active' : ''}`}
              onClick={() => handleSelectQuick(n)}
            >
              {n}
            </button>
          ))}
          <button
            className={`imt-pill imt-pill--custom${custom ? ' imt-pill--active' : ''}`}
            onClick={() => setCustom(true)}
          >
            More
          </button>
        </div>

        {custom && (
          <input
            className="imt-custom-input"
            type="number"
            inputMode="numeric"
            min="1"
            max="99"
            placeholder="Enter number"
            value={customVal}
            onChange={e => setCustomVal(e.target.value)}
            autoFocus
          />
        )}

        <div className="imt-actions">
          <button
            className="imt-confirm"
            onClick={handleConfirm}
            disabled={!canConfirm}
          >
            Update My Bar
          </button>
          <button className="imt-cancel" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
