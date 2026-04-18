import React, { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';
import { Ingredient } from '../types';
import './BarcodeScannerModal.css';

interface Props {
  onFound: (name: string, category: Ingredient['category']) => void;
  onNotFound: () => void;
  onClose: () => void;
}

type ScanStatus = 'scanning' | 'looking-up' | 'not-found' | 'error';

function guessCategory(tags: string): Ingredient['category'] {
  const t = tags.toLowerCase();
  if (/spirit|whiskey|whisky|bourbon|scotch|gin|vodka|rum|tequila|mezcal|brandy|cognac|alcohol/.test(t)) return 'spirit';
  if (/liqueur|triple.sec|vermouth|campari|aperol|amaretto/.test(t)) return 'liqueur';
  if (/bitters/.test(t)) return 'bitters';
  if (/syrup/.test(t)) return 'syrup';
  if (/juice|mixer|tonic|soda|ginger.beer|cola/.test(t)) return 'mixer';
  if (/garnish|olive|cherry|citrus|lime|lemon/.test(t)) return 'garnish';
  return 'other';
}

export function BarcodeScannerModal({ onFound, onNotFound, onClose }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);
  const [status, setStatus] = useState<ScanStatus>('scanning');
  const [notFoundMsg, setNotFoundMsg] = useState('');

  useEffect(() => {
    const reader = new BrowserMultiFormatReader();
    readerRef.current = reader;

    reader.decodeFromConstraints(
      { video: { facingMode: { ideal: 'environment' } } },
      videoRef.current!,
      async (result, err) => {
        if (!result) {
          if (err && !(err instanceof NotFoundException)) {
            setStatus('error');
          }
          return;
        }

        reader.reset();
        const barcode = result.getText();
        setStatus('looking-up');

        try {
          const res = await fetch(
            `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
          );
          const data = await res.json();
          if (data.status === 1 && data.product?.product_name) {
            const name = data.product.product_name as string;
            const tags = (data.product.categories ?? '') as string;
            onFound(name, guessCategory(tags));
          } else {
            setNotFoundMsg('Bottle not found — enter manually');
            setStatus('not-found');
          }
        } catch {
          setNotFoundMsg('Bottle not found — enter manually');
          setStatus('not-found');
        }
      }
    ).catch(() => setStatus('error'));

    return () => {
      reader.reset();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
          {status === 'not-found' && (
            <>
              <p className="bs-hint bs-hint--warn">{notFoundMsg}</p>
              <button className="bs-manual-btn" onClick={onNotFound}>
                Enter Manually
              </button>
            </>
          )}
          {status === 'error' && (
            <>
              <p className="bs-hint bs-hint--warn">Camera unavailable</p>
              <button className="bs-manual-btn" onClick={onNotFound}>
                Enter Manually
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
