import React, { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';
import { Ingredient } from '../types';
import './BarcodeScannerModal.css';

interface Props {
  onFound: (name: string, category: Ingredient['category']) => void;
  onNotFound: () => void;
  onClose: () => void;
}

type ScanStatus = 'scanning' | 'looking-up' | 'confirm' | 'not-found' | 'error';

const CATEGORIES: { value: Ingredient['category']; label: string }[] = [
  { value: 'spirit',  label: 'Spirits' },
  { value: 'liqueur', label: 'Liqueurs & Fortified' },
  { value: 'mixer',   label: 'Mixers & Juice' },
  { value: 'syrup',   label: 'Syrups' },
  { value: 'bitters', label: 'Bitters' },
  { value: 'garnish', label: 'Garnishes' },
  { value: 'other',   label: 'Other' },
];

// Detect category from any text — tags from API or the product name itself
function detectCategory(text: string): Ingredient['category'] {
  const t = text.toLowerCase();
  if (/\bgin\b|vodka|\brum\b|tequila|mezcal|whiskey|whisky|bourbon|scotch|brandy|cognac|\brye\b|baijiu|absinthe|calvados|armagnac/.test(t)) return 'spirit';
  if (/liqueur|triple\s*sec|vermouth|campari|aperol|amaretto|cointreau|chartreuse|kahlua|baileys|sambuca|frangelico|drambuie|midori/.test(t)) return 'liqueur';
  if (/\bbitters\b/.test(t)) return 'bitters';
  if (/\bsyrup\b|grenadine|orgeat|falernum/.test(t)) return 'syrup';
  if (/red\s*bull|monster\s*energy|rockstar|celsius|bang\s*energy|ghost\s*energy|c4\s*energy|reign\s*energy|prime\s*energy|liquid\s*i\.?v|energy\s*drink/.test(t)) return 'mixer';
  if (/juice|tonic|soda|ginger\s*beer|cola|lemonade|sparkling\s*water|club\s*soda|mixer|fever.?tree|olipop|poppi|liquid\s*death/.test(t)) return 'mixer';
  if (/olive|cherry|garnish/.test(t)) return 'garnish';
  return 'other';
}

// Try Open Food Facts — returns { name, category } or null
async function lookupOpenFoodFacts(barcode: string): Promise<{ name: string; categoryTags: string } | null> {
  try {
    const res = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
    const data = await res.json();
    if (data.status === 1 && data.product?.product_name) {
      return {
        name: data.product.product_name as string,
        categoryTags: (data.product.categories ?? '') as string,
      };
    }
  } catch {}
  return null;
}

// UPC Item DB fallback
async function lookupUPCItemDB(barcode: string): Promise<{ name: string; categoryTags: string } | null> {
  try {
    const res = await fetch(`https://api.upcitemdb.com/prod/trial/lookup?upc=${barcode}`);
    const data = await res.json();
    if (data.code === 'OK' && data.items?.length > 0) {
      const item = data.items[0];
      const name = item.brand ? `${item.brand} ${item.title}`.trim() : item.title;
      return { name, categoryTags: item.category ?? '' };
    }
  } catch {}
  return null;
}

export function BarcodeScannerModal({ onFound, onNotFound, onClose }: Props) {
  const videoRef  = useRef<HTMLVideoElement>(null);
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);

  const [status,       setStatus]       = useState<ScanStatus>('scanning');
  const [confirmName,  setConfirmName]  = useState('');
  const [confirmCat,   setConfirmCat]   = useState<Ingredient['category']>('spirit');
  const [notFoundMsg,  setNotFoundMsg]  = useState('');

  useEffect(() => {
    const reader = new BrowserMultiFormatReader();
    readerRef.current = reader;

    reader.decodeFromConstraints(
      { video: { facingMode: { ideal: 'environment' } } },
      videoRef.current!,
      async (result, err) => {
        if (!result) {
          if (err && !(err instanceof NotFoundException)) setStatus('error');
          return;
        }

        reader.reset();
        const barcode = result.getText();
        setStatus('looking-up');

        // 1. Try Open Food Facts
        let found = await lookupOpenFoodFacts(barcode);

        // 2. Fallback to UPC Item DB
        if (!found) found = await lookupUPCItemDB(barcode);

        if (!found) {
          setNotFoundMsg('Bottle not found — enter manually');
          setStatus('not-found');
          return;
        }

        // Resolve category — from tags first, then from name
        const catFromTags = detectCategory(found.categoryTags);
        const category = catFromTags !== 'other'
          ? catFromTags
          : detectCategory(found.name);

        // Show confirmation if name or category is uncertain
        const nameConfident = found.name.trim().length > 0;
        const catConfident  = category !== 'other';

        if (!nameConfident || !catConfident) {
          setConfirmName(found.name.trim());
          setConfirmCat(category);
          setStatus('confirm');
        } else {
          // Both confident — still show confirm so user can verify
          setConfirmName(found.name.trim());
          setConfirmCat(category);
          setStatus('confirm');
        }
      }
    ).catch(() => setStatus('error'));

    return () => { reader.reset(); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Confirmation screen ──────────────────────────────────────────────────────
  if (status === 'confirm') {
    return (
      <div className="bs-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
        <div className="bs-modal">
          <div className="bs-header">
            <span className="bs-title">We found this bottle</span>
            <button className="bs-close" onClick={onClose} aria-label="Close">×</button>
          </div>
          <div className="bs-confirm">
            <p className="bs-confirm-sub">Does this look right? Edit before adding.</p>

            <label className="bs-field-label">Bottle name</label>
            <input
              className="bs-field-input"
              type="text"
              value={confirmName}
              onChange={e => setConfirmName(e.target.value)}
              placeholder="Bottle name"
            />

            <label className="bs-field-label">Category</label>
            <select
              className="bs-field-select"
              value={confirmCat}
              onChange={e => setConfirmCat(e.target.value as Ingredient['category'])}
            >
              {CATEGORIES.map(c => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>

            <button
              className="bs-confirm-btn"
              disabled={!confirmName.trim()}
              onClick={() => onFound(confirmName.trim(), confirmCat)}
            >
              Looks good — add to bar
            </button>
            <button className="bs-manual-btn" onClick={onNotFound}>
              Enter Manually
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Camera / status screen ───────────────────────────────────────────────────
  return (
    <div className="bs-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bs-modal">
        <div className="bs-header">
          <span className="bs-title">Scan Bottle</span>
          <button className="bs-close" onClick={onClose} aria-label="Close">×</button>
        </div>

        <div className="bs-viewfinder">
          <video ref={videoRef} className="bs-video" autoPlay muted playsInline />
          <div className="bs-reticle" />
        </div>

        <div className="bs-status">
          {status === 'scanning' && (
            <p className="bs-hint">Point the camera at a barcode</p>
          )}
          {status === 'looking-up' && (
            <p className="bs-hint bs-hint--loading">Looking up bottle…</p>
          )}
          {(status === 'not-found' || status === 'error') && (
            <>
              <p className="bs-hint bs-hint--warn">
                {status === 'error' ? 'Camera unavailable' : notFoundMsg}
              </p>
              <button className="bs-manual-btn" onClick={onNotFound}>Enter Manually</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
