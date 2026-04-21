import React, { useState, useRef } from 'react';
import {
  RecognizedBottle,
  BottleType,
  recognizeSingleBottle,
  recognizeShelf,
} from '../lib/bottleRecognition';
import { supabase } from '../lib/supabase';
import { mapBottleType, mapBottleToSpiritType } from '../lib/bottleRecognition';
import './PhotoScanModal.css';

// ── Types ─────────────────────────────────────────────────────────────────────

type Status = 'idle' | 'loading' | 'single-result' | 'shelf-result' | 'error';

interface Props {
  mode: 'single' | 'shelf';
  onConfirmSingle?: (bottle: RecognizedBottle) => void;
  onConfirmShelf?: (bottles: RecognizedBottle[]) => void;
  onClose: () => void;
}

interface DebugInfo {
  imageSizeKB:     number;
  supabaseUrl:     string;
  clientExists:    boolean;
  rawResponse:     string;
  rawData:         string;
  rawError:        string;
  error:           string | null;
  mappedCategory:  string;
  mappedSpiritType: string;
}

const ALL_BOTTLE_TYPES: BottleType[] = [
  'Vodka', 'Bourbon', 'Gin', 'Rum', 'Tequila', 'Mezcal', 'Scotch',
  'Whiskey', 'Liqueur', 'Wine', 'Beer', 'Mixer', 'Energy Drink', 'Other',
];

// ── Helpers ───────────────────────────────────────────────────────────────────

const MAX_DIMENSION = 1500;
const JPEG_QUALITY  = 0.85;

function compressImage(file: File): Promise<{ base64: string; sizeKB: number }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        let { width, height } = img;
        if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
          if (width >= height) {
            height = Math.round((height / width) * MAX_DIMENSION);
            width  = MAX_DIMENSION;
          } else {
            width  = Math.round((width / height) * MAX_DIMENSION);
            height = MAX_DIMENSION;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width  = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) { reject(new Error('No 2d context')); return; }
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', JPEG_QUALITY);
        const base64  = dataUrl.split(',')[1];
        const sizeKB  = Math.round((base64.length * 0.75) / 1024);
        console.log('[PhotoScanModal] Compressed image:', sizeKB, 'KB', `(${width}×${height})`);
        resolve({ base64, sizeKB });
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

// ── ShelfRow sub-component ────────────────────────────────────────────────────

interface ShelfRowItem {
  bottle:      RecognizedBottle;
  checked:     boolean;
  editingName: boolean;
  editingType: boolean;
  draftName:   string;
  draftType:   BottleType;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function PhotoScanModal({ mode, onConfirmSingle, onConfirmShelf, onClose }: Props) {
  const [status, setStatus]               = useState<Status>('idle');
  const [singleResult, setSingleResult]   = useState<RecognizedBottle | null>(null);
  const [editingName, setEditingName]     = useState(false);
  const [draftName, setDraftName]         = useState('');
  const [shelfRows, setShelfRows]         = useState<ShelfRowItem[]>([]);
  const [debugInfo, setDebugInfo]         = useState<DebugInfo | null>(null);

  const fileRef = useRef<HTMLInputElement>(null);
  const hasApiKey = !!process.env.REACT_APP_SUPABASE_URL;

  // ── File handling ────────────────────────────────────────────────────────

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';
    setStatus('loading');
    setDebugInfo(null);

    let imageSizeKB = 0;
    try {
      const { base64, sizeKB } = await compressImage(file);
      imageSizeKB = sizeKB;

      const supabaseUrl  = process.env.REACT_APP_SUPABASE_URL ?? '(missing)';
      const clientExists = !!supabase;

      if (mode === 'single') {
        const { bottle, rawResponse, rawData, rawError, error } = await recognizeSingleBottle(base64);
        const mappedCategory   = bottle ? mapBottleType(bottle.type)                        : '';
        const mappedSpiritType = bottle ? mapBottleToSpiritType(bottle.type, bottle.brand)  : '';
        setDebugInfo({ imageSizeKB, supabaseUrl, clientExists, rawResponse, rawData, rawError, error, mappedCategory, mappedSpiritType });
        if (bottle) {
          setSingleResult(bottle);
          setDraftName(bottle.name);
          setEditingName(false);
          setStatus('single-result');
        } else {
          setStatus('error');
        }
      } else {
        const { bottles, rawResponse, rawData, rawError, error } = await recognizeShelf(base64);
        const firstBottle      = bottles[0];
        const mappedCategory   = firstBottle ? mapBottleType(firstBottle.type)                             : '';
        const mappedSpiritType = firstBottle ? mapBottleToSpiritType(firstBottle.type, firstBottle.brand)  : '';
        setDebugInfo({ imageSizeKB, supabaseUrl, clientExists, rawResponse, rawData, rawError, error, mappedCategory, mappedSpiritType });
        setShelfRows(
          bottles.map(b => ({
            bottle:      b,
            checked:     true,
            editingName: false,
            editingType: false,
            draftName:   b.name,
            draftType:   b.type,
          }))
        );
        setStatus('shelf-result');
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setDebugInfo({
        imageSizeKB,
        supabaseUrl:      process.env.REACT_APP_SUPABASE_URL ?? '(missing)',
        clientExists:     !!supabase,
        rawResponse:      '',
        rawData:          '',
        rawError:         msg,
        error:            msg,
        mappedCategory:   '',
        mappedSpiritType: '',
      });
      setStatus('error');
    }
  }

  // ── Single result handlers ────────────────────────────────────────────────

  function handleConfirmSingle() {
    if (!singleResult) return;
    const confirmed: RecognizedBottle = {
      ...singleResult,
      name: editingName ? draftName : singleResult.name,
    };
    onConfirmSingle?.(confirmed);
  }

  function handleTryAgain() {
    setSingleResult(null);
    setShelfRows([]);
    setDebugInfo(null);
    setStatus('idle');
  }

  // ── Shelf row handlers ────────────────────────────────────────────────────

  function toggleChecked(idx: number) {
    setShelfRows(rows =>
      rows.map((r, i) => i === idx ? { ...r, checked: !r.checked } : r)
    );
  }

  function startEditRow(idx: number) {
    setShelfRows(rows =>
      rows.map((r, i) => i === idx
        ? { ...r, editingName: true, editingType: true }
        : r
      )
    );
  }

  function commitRowEdit(idx: number) {
    setShelfRows(rows =>
      rows.map((r, i) => {
        if (i !== idx) return r;
        return {
          ...r,
          editingName: false,
          editingType: false,
          bottle: { ...r.bottle, name: r.draftName, type: r.draftType },
        };
      })
    );
  }

  function updateRowDraftName(idx: number, value: string) {
    setShelfRows(rows => rows.map((r, i) => i === idx ? { ...r, draftName: value } : r));
  }

  function updateRowDraftType(idx: number, value: BottleType) {
    setShelfRows(rows => rows.map((r, i) => i === idx ? { ...r, draftType: value } : r));
  }

  function handleConfirmShelf() {
    const confirmed = shelfRows
      .filter(r => r.checked)
      .map(r => r.bottle);
    onConfirmShelf?.(confirmed);
  }

  const checkedCount = shelfRows.filter(r => r.checked).length;

  // ── Debug panel ───────────────────────────────────────────────────────────

  const debugLines = debugInfo
    ? [
        `Image size:       ${debugInfo.imageSizeKB} KB`,
        `Supabase URL:     ${debugInfo.supabaseUrl}`,
        `Client exists:    ${debugInfo.clientExists ? 'yes' : 'no'}`,
        `Error:            ${debugInfo.error ?? 'none'}`,
        `Mapped category:  ${debugInfo.mappedCategory || '(none)'}`,
        `Mapped spiritType:${debugInfo.mappedSpiritType || '(none — no recipe match)'}`,
        ``,
        `── invoke data ──`,
        debugInfo.rawData
          ? debugInfo.rawData.slice(0, 300) + (debugInfo.rawData.length > 300 ? '…' : '')
          : '(empty)',
        ``,
        `── invoke error ──`,
        debugInfo.rawError !== '(null)' ? debugInfo.rawError : '(none)',
        ``,
        `── raw response (first 400 chars) ──`,
        debugInfo.rawResponse
          ? debugInfo.rawResponse.slice(0, 400) + (debugInfo.rawResponse.length > 400 ? '…' : '')
          : '(empty)',
      ].join('\n')
    : null;

  // ── Render ────────────────────────────────────────────────────────────────

  const title    = mode === 'single' ? 'Photo ID' : 'Scan My Bar';
  const bodyText = mode === 'single'
    ? 'Point your camera at the bottle'
    : 'Point your camera at your bottles';

  return (
    <div className="psm-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="psm-modal">
        <button className="psm-close" onClick={onClose} aria-label="Close">×</button>

        {/* ── IDLE ── */}
        {status === 'idle' && (
          <>
            <h2 className="psm-title">{title}</h2>
            <p className="psm-subtitle">{bodyText}</p>

            {hasApiKey ? (
              <button
                className="psm-take-photo-btn"
                onClick={() => fileRef.current?.click()}
              >
                📷 Take Photo
              </button>
            ) : (
              <div className="psm-no-key">
                AI recognition not configured. Add REACT_APP_ANTHROPIC_API_KEY to enable.
              </div>
            )}

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              capture="environment"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
          </>
        )}

        {/* ── LOADING ── */}
        {status === 'loading' && (
          <>
            <h2 className="psm-title">{title}</h2>
            <div className="psm-loading">
              <div className="psm-spinner" />
              <p className="psm-loading-text">
                {mode === 'single'
                  ? 'Identifying your bottle…'
                  : 'Identifying your bottles…'}
              </p>
            </div>
          </>
        )}

        {/* ── SINGLE RESULT ── */}
        {status === 'single-result' && singleResult && (
          <>
            <h2 className="psm-title">Got it!</h2>

            <div className="psm-bottle-card">
              <span className="psm-bottle-emoji">🍾</span>

              <div className="psm-bottle-name-row">
                {editingName ? (
                  <input
                    className="psm-bottle-name-input"
                    value={draftName}
                    onChange={e => setDraftName(e.target.value)}
                    onBlur={() => setEditingName(false)}
                    autoFocus
                  />
                ) : (
                  <>
                    <span className="psm-bottle-name">{draftName}</span>
                    <button
                      className="psm-edit-name-btn"
                      onClick={() => setEditingName(true)}
                    >
                      Edit
                    </button>
                  </>
                )}
              </div>

              <p className="psm-bottle-meta">
                {singleResult.type} &middot; {singleResult.size_ml}ml
              </p>

              {singleResult.confidence === 'low' && (
                <div className="psm-low-confidence">
                  ⚠️ We're not 100% sure — please verify
                </div>
              )}
            </div>

            <div className="psm-single-actions">
              <button className="psm-confirm-btn" onClick={handleConfirmSingle}>
                Confirm
              </button>
              <button className="psm-secondary-btn" onClick={handleTryAgain}>
                Try Again
              </button>
            </div>
          </>
        )}

        {/* ── SHELF RESULT ── */}
        {status === 'shelf-result' && (
          <>
            {shelfRows.length === 0 ? (
              <>
                <h2 className="psm-title">No bottles found</h2>
                <p className="psm-no-bottles">
                  No bottles detected — try again with better lighting
                </p>
                <button className="psm-secondary-btn" onClick={handleTryAgain}>
                  Try Again
                </button>
              </>
            ) : (
              <>
                <h2 className="psm-shelf-header">
                  We found {shelfRows.length} bottle{shelfRows.length !== 1 ? 's' : ''}
                </h2>

                <div className="psm-checklist">
                  {shelfRows.map((row, idx) => (
                    <div
                      key={idx}
                      className={`psm-checklist-row${row.editingName || row.editingType ? ' psm-checklist-row--editing' : ''}`}
                    >
                      <input
                        type="checkbox"
                        className="psm-row-checkbox"
                        checked={row.checked}
                        onChange={() => toggleChecked(idx)}
                      />

                      {row.editingName ? (
                        <input
                          className="psm-row-name-input"
                          value={row.draftName}
                          onChange={e => updateRowDraftName(idx, e.target.value)}
                          onBlur={() => commitRowEdit(idx)}
                          autoFocus
                        />
                      ) : (
                        <span
                          className="psm-row-name"
                          onClick={() => startEditRow(idx)}
                          title="Tap to edit"
                        >
                          {row.bottle.name}
                        </span>
                      )}

                      {row.editingType ? (
                        <select
                          className="psm-row-type-select"
                          value={row.draftType}
                          onChange={e => updateRowDraftType(idx, e.target.value as BottleType)}
                          onBlur={() => commitRowEdit(idx)}
                        >
                          {ALL_BOTTLE_TYPES.map(t => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                      ) : (
                        <span className="psm-row-type-pill">{row.bottle.type}</span>
                      )}

                      <span
                        className={`psm-confidence-dot psm-confidence-dot--${row.bottle.confidence}`}
                        title={`Confidence: ${row.bottle.confidence}`}
                      />
                    </div>
                  ))}
                </div>

                <button
                  className="psm-add-all-btn"
                  onClick={handleConfirmShelf}
                  disabled={checkedCount === 0}
                >
                  Add {checkedCount} bottle{checkedCount !== 1 ? 's' : ''}
                </button>
                <button className="psm-secondary-btn" onClick={handleTryAgain}>
                  Try Again
                </button>
              </>
            )}
          </>
        )}

        {/* ── ERROR ── */}
        {status === 'error' && (
          <>
            <div className="psm-error">
              <span className="psm-error-emoji">🤷</span>
              <h2 className="psm-error-title">Couldn't identify this bottle</h2>
              <p className="psm-error-sub">
                Try barcode scanner or add manually
              </p>
              <button className="psm-secondary-btn" onClick={handleTryAgain}>
                Try Again
              </button>
            </div>

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              capture="environment"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
          </>
        )}

        {/* ── DEBUG PANEL ── */}
        {debugLines !== null && (
          <div className="psm-debug">
            <span className="psm-debug-label">Debug</span>
            <pre className="psm-debug-box">{debugLines}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
