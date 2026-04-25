import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { Recipe, InventoryItem, QuantityLevel } from '../types';
import { PANTRY_CATEGORIES } from '../data/pantryItems';
import { UnlockSuggestion } from '../utils/unlockCalculator';
import { VesperRecipeCard } from './VesperRecipeCard';
import { IMadeThisModal } from './IMadeThisModal';
import { DrinkSurvey } from './DrinkSurvey';
import { decrementInventory } from '../utils/inventoryDecrement';
import { useVesperVoice } from '../hooks/useVesperVoice';
import { useTasteProfile } from '../hooks/useTasteProfile';
import { houseSyrups } from '../data/houseSyrups';
import './ChatBartender.css';

type BarMode = 'my-bar' | 'im-out' | 'explore';

interface Message {
  role: 'bartender' | 'user';
  text: string;
  id: string;
  recommendedRecipes?: string[];
}

function genId() { return Math.random().toString(36).slice(2) }

const LS_VOICE_ENABLED   = 'vesper_voice_enabled'
const LS_VOICE_AUTOPLAY  = 'vesper_voice_autoplay'

function getVoicePref(key: string): boolean {
  try { const v = localStorage.getItem(key); return v === null ? true : v === 'true' } catch { return true }
}
function setVoicePref(key: string, val: boolean) {
  try { localStorage.setItem(key, String(val)) } catch {}
}

interface Props {
  mode: BarMode;
  inventory: InventoryItem[];
  checkedPantryIds?: Set<string>;
  onGoToInventory?: () => void;
  unlockSuggestions?: UnlockSuggestion[];
  recipes?: Recipe[];
  contextNote?: string;
  onContextNoteConsumed?: () => void;
  onSetQuantity?: (id: string, qty: QuantityLevel) => void;
  userId?: string | null;
  onClose?: () => void;
  imOutContext?: 'bar' | 'party' | null;
  canMakeNames?: string[] | null;
  onVoiceDuck?:   () => void;
  onVoiceUnduck?: () => void;
}

function renderMarkdown(text: string): React.ReactElement {
  const lines = text.split('\n');
  const elements: React.ReactElement[] = [];

  lines.forEach((line, i) => {
    if (line.trim() === '') {
      elements.push(<br key={i} />);
      return;
    }

    const parseInline = (str: string): (string | React.ReactElement)[] => {
      const parts: (string | React.ReactElement)[] = [];
      let remaining = str;
      let key = 0;

      while (remaining.length > 0) {
        const boldMatch   = remaining.match(/\*\*(.+?)\*\*/);
        const italicMatch = remaining.match(/\*(.+?)\*/);

        if (boldMatch && (!italicMatch || boldMatch.index! <= italicMatch.index!)) {
          if (boldMatch.index! > 0) parts.push(remaining.slice(0, boldMatch.index));
          parts.push(<strong key={key++}>{boldMatch[1]}</strong>);
          remaining = remaining.slice(boldMatch.index! + boldMatch[0].length);
        } else if (italicMatch) {
          if (italicMatch.index! > 0) parts.push(remaining.slice(0, italicMatch.index));
          parts.push(<em key={key++}>{italicMatch[1]}</em>);
          remaining = remaining.slice(italicMatch.index! + italicMatch[0].length);
        } else {
          parts.push(remaining);
          break;
        }
      }
      return parts;
    };

    if (line.trim().startsWith('- ')) {
      elements.push(
        <div key={i} className="cb-bullet">
          <span className="cb-bullet-dot">•</span>
          <span>{parseInline(line.trim().slice(2))}</span>
        </div>
      );
    } else {
      elements.push(<p key={i} className="cb-p">{parseInline(line)}</p>);
    }
  });

  return <>{elements}</>;
}

function getInitialQuickReplies(lightPref: boolean): string[] {
  return [
    'Surprise me 🎲',
    'Something classic',
    'Light and refreshing',
    'Strong and stirred',
    "I'm feeling adventurous",
    lightPref ? 'All options 🍸' : 'Keep it light 🌿',
  ];
}

function getOpeningMessage(
  mode: BarMode,
  count: number,
  checkedPantryIds?: Set<string>,
  topUnlock?: UnlockSuggestion,
  lightPreference?: boolean,
): string {
  if (mode === 'im-out') {
    return "Ooh, not a bad selection. Let's see what we can do with what's in front of you.";
  }
  if (mode === 'explore') {
    return "No limits tonight? My favorite kind of conversation. Tell me what you're in the mood for.";
  }
  if (count === 0) {
    return "Okay, we need to talk. Your bar is empty and I'm concerned. Want to scan some bottles first, or should I show you what you're missing out on?";
  }

  if (lightPreference) {
    return `Well, well. ${count} bottle${count !== 1 ? 's' : ''} and you want to keep it clean. I respect that. Fresh citrus helps — and honestly, less sugar means more spirit. Let's see what we can do.`;
  }

  let base: string;
  const hasCitrus = checkedPantryIds?.has('fresh-lime') || checkedPantryIds?.has('fresh-lemon');
  if (hasCitrus) {
    base = `Well, well. ${count} bottle${count !== 1 ? 's' : ''} and fresh citrus on deck — we have real options tonight. What are we making?`;
  } else {
    base = `Well, well. ${count} bottle${count !== 1 ? 's' : ''} and you still can't decide what to make. Lucky you found me. What are we working with tonight?`;
  }

  if (topUnlock && topUnlock.unlockCount >= 8) {
    base += ` Oh — and grab some ${topUnlock.ingredientDisplayName} next time you're out. It would unlock ${topUnlock.unlockCount} more recipes with what you've already got.`;
  }

  return base;
}

export function ChatBartender({
  mode, inventory, checkedPantryIds, onGoToInventory,
  unlockSuggestions = [], recipes = [],
  contextNote, onContextNoteConsumed,
  onSetQuantity, userId, onClose, imOutContext, canMakeNames,
  onVoiceDuck, onVoiceUnduck,
}: Props) {
  const { lightPreference, updateLightPreference } = useTasteProfile();
  const topUnlock    = unlockSuggestions[0];
  const openingText  = getOpeningMessage(mode, inventory.length, checkedPantryIds, topUnlock, lightPreference);
  const openingId    = useRef(genId()).current;

  const recipeByName = useRef<Map<string, Recipe>>(new Map());
  recipeByName.current = new Map(recipes.map(r => [r.name.toLowerCase().trim(), r]));

  function detectRecipesInMessage(text: string): Recipe[] {
    const found: Recipe[] = [];
    for (const recipe of recipes) {
      const escapedName = recipe.name.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`\\b${escapedName}\\b`, 'i');
      if (regex.test(text) && found.length < 3) {
        found.push(recipe);
      }
    }
    return found;
  }

  const { speak, stop, isLoading: voiceLoading, playingId } = useVesperVoice({
    onVoiceStart: onVoiceDuck,
    onVoiceEnd:   onVoiceUnduck,
  });
  const [voiceEnabled,  setVoiceEnabled]  = useState(() => getVoicePref(LS_VOICE_ENABLED));
  const [voiceAutoplay] = useState(() => getVoicePref(LS_VOICE_AUTOPLAY));

  const [messages, setMessages] = useState<Message[]>([
    { role: 'bartender', text: openingText, id: openingId },
  ]);
  const [quickReplies, setQuickReplies] = useState<string[]>(() => getInitialQuickReplies(lightPreference));
  const [lightOffToast, setLightOffToast] = useState(false);
  const [input, setInput]   = useState('');
  const [typing, setTyping] = useState(false);

  // Make This modal state
  const [makingRecipe, setMakingRecipe]   = useState<Recipe | null>(null);
  const [surveyRecipe, setSurveyRecipe]   = useState<Recipe | null>(null);
  const [surveyDoneIds, setSurveyDoneIds] = useState<Set<string>>(new Set());
  const [makeToast, setMakeToast]         = useState<string | null>(null);

  const bottomRef  = useRef<HTMLDivElement>(null);
  const inputRef   = useRef<HTMLInputElement>(null);
  const apiHistory = useRef<{ role: 'user' | 'assistant'; content: string }[]>([]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  useEffect(() => {
    if (!contextNote) return;
    apiHistory.current.push({ role: 'user', content: contextNote });
    onContextNoteConsumed?.();
  }, [contextNote]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-play opening message after UI settles
  useEffect(() => {
    if (!voiceEnabled || !voiceAutoplay) return;
    const t = setTimeout(() => { console.log('Triggering Vesper voice'); speak(openingText, openingId); }, 500);
    return () => clearTimeout(t);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Stop audio when voice is disabled
  useEffect(() => {
    if (!voiceEnabled) stop();
    setVoicePref(LS_VOICE_ENABLED, voiceEnabled);
  }, [voiceEnabled, stop]);

  useEffect(() => {
    setVoicePref(LS_VOICE_AUTOPLAY, voiceAutoplay);
  }, [voiceAutoplay]);

  // Recipes from the most recent bartender message (for Make This chip + card handler)
  const lastBartenderMsg = [...messages].reverse().find(m => m.role === 'bartender');
  const makeThisRecipes: Recipe[] = (lastBartenderMsg?.recommendedRecipes ?? [])
    .map(name => recipeByName.current.get(name.toLowerCase().trim()))
    .filter((r): r is Recipe => r !== undefined);

  async function sendMessage(text: string, overrideLightPref?: boolean) {
    if (!text.trim() || typing) return;

    const userMsg: Message = { role: 'user', text: text.trim(), id: genId() };
    setMessages(prev => [...prev, userMsg]);
    setQuickReplies([]);
    setInput('');
    setTyping(true);

    apiHistory.current.push({ role: 'user', content: text.trim() });

    try {
      const inventoryList = inventory.length > 0
        ? inventory
            .filter(i => i.quantity !== 'out')
            .map(i => i.spiritType ? `${i.name} (${i.spiritType})` : i.name)
            .join(', ')
        : 'none';

      const pantryList = checkedPantryIds && checkedPantryIds.size > 0
        ? PANTRY_CATEGORIES
            .flatMap(cat => cat.items)
            .filter(item => checkedPantryIds.has(item.id))
            .map(item => item.name)
            .join(', ')
        : '';

      const unlockContext = unlockSuggestions.slice(0, 3).map(s => ({
        ingredient: s.ingredientDisplayName,
        count:      s.unlockCount,
        recipes:    s.recipes.slice(0, 4).map(r => r.name),
      }));

      const madeHouseSyrups = checkedPantryIds
        ? houseSyrups
            .filter(s => checkedPantryIds.has(s.unlockIngredientId))
            .map(s => s.name)
        : [];

      const effectiveLightPref = overrideLightPref ?? lightPreference;
      const { data, error } = await supabase.functions.invoke('chat-bartender', {
        body: {
          messages: apiHistory.current,
          inventoryList,
          mode,
          pantryList,
          unlockContext,
          madeHouseSyrups,
          lightPreference: effectiveLightPref,
          imOutContext: mode === 'im-out' ? (imOutContext ?? null) : null,
          canMakeNames: mode === 'my-bar' ? (canMakeNames ?? null) : null,
        },
      });

      if (error || data?.error) {
        throw new Error(error?.message ?? data?.error ?? 'Unknown error');
      }

      const reply: string      = data?.message ?? "Sorry, I lost my train of thought. Try again?";
      const chips: string[]    = data?.quickReplies ?? [];
      let recNames: string[]   = data?.recommendedRecipes ?? [];

      // Layer 2: fallback auto-detection if RECIPES: tag was missing
      if (recNames.length === 0) {
        recNames = detectRecipesInMessage(reply).map(r => r.name);
      }
      // Cap at 3
      recNames = recNames.slice(0, 3);

      const msgId = genId();
      apiHistory.current.push({ role: 'assistant', content: reply });
      setMessages(prev => [...prev, {
        role: 'bartender',
        text: reply,
        id: msgId,
        recommendedRecipes: recNames.length > 0 ? recNames : undefined,
      }]);
      setQuickReplies(chips);
      if (voiceEnabled && voiceAutoplay) {
        console.log('Triggering Vesper voice');
        speak(reply, msgId);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setMessages(prev => [
        ...prev,
        { role: 'bartender', text: `Something went wrong on my end — sorry about that. (${msg})`, id: genId() },
      ]);
    } finally {
      setTyping(false);
    }
  }

  function handleMakeConfirm(count: number) {
    if (!makingRecipe) return;
    const recipe = makingRecipe;
    setMakingRecipe(null);

    // Decrement inventory
    if (onSetQuantity) {
      const { updated } = decrementInventory(inventory, recipe, count);
      updated.forEach(item => {
        const original = inventory.find(i => i.ingredientId === item.ingredientId);
        if (original && original.quantity !== item.quantity) {
          onSetQuantity(item.ingredientId, item.quantity);
        }
      });
    }

    // Brief toast
    setMakeToast('Bar updated 🍸');
    setTimeout(() => setMakeToast(null), 3000);

    // Send chat message so Vesper can respond
    const label = count === 1 ? 'drink' : 'drinks';
    sendMessage(`I just made ${count} ${label} of ${recipe.name}`);

    // Rating prompt after a pause, once per recipe
    if (!surveyDoneIds.has(recipe.id)) {
      setTimeout(() => setSurveyRecipe(recipe), 2200);
    }
  }

  function handleChipClick(chip: string) {
    if (chip === 'Make This 🍸') {
      const target = makeThisRecipes[0] ?? null;
      if (target) {
        setMakingRecipe(target);
      } else {
        sendMessage('Make this for me');
      }
      return;
    }
    if (chip === 'Keep it light 🌿') {
      updateLightPreference(true);
      sendMessage(chip, true);
      return;
    }
    if (chip === 'All options 🍸') {
      updateLightPreference(false);
      sendMessage(chip, false);
      return;
    }
    sendMessage(chip);
  }

  // Always prepend "Make This 🍸" when the last Vesper message had recipe cards
  // or when it mentioned a drink name (cards may appear via auto-detection)
  const showMakeThis = makeThisRecipes.length > 0 || (
    lastBartenderMsg != null && detectRecipesInMessage(lastBartenderMsg.text).length > 0
  );
  const displayedChips = showMakeThis && quickReplies.length > 0
    ? ['Make This 🍸', ...quickReplies]
    : quickReplies;

  function handleSend() { sendMessage(input); }
  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') handleSend();
  }

  function handleVoiceToggle() {
    setVoiceEnabled(v => !v);
  }

  function handleSpeakerClick(msg: Message) {
    if (!voiceEnabled) return;
    if (playingId === msg.id) {
      stop();
    } else {
      console.log('Triggering Vesper voice');
      speak(msg.text, msg.id);
    }
  }

  return (
    <div className="cb-wrap">
      {makeToast && (
        <div className="cb-make-toast">{makeToast}</div>
      )}

      <div className="cb-header">
        {lightPreference && (
          <button
            className="cb-light-badge cb-light-badge--btn"
            onClick={() => {
              updateLightPreference(false);
              setLightOffToast(true);
              setTimeout(() => setLightOffToast(false), 2500);
            }}
            aria-label="Turn off light mode"
            title="Tap to turn off light mode"
          >
            🌿 Light mode <span className="cb-light-badge-x">×</span>
          </button>
        )}
        {lightOffToast && (
          <span className="cb-light-off-toast">Light mode off</span>
        )}
        <div className="cb-header-actions">
          <button
            className={`cb-voice-toggle${voiceEnabled ? ' cb-voice-toggle--on' : ' cb-voice-toggle--off'}`}
            onClick={handleVoiceToggle}
            aria-label={voiceEnabled ? 'Disable voice' : 'Enable voice'}
            title={voiceEnabled ? 'Voice on' : 'Voice off'}
          >
            {voiceEnabled ? '🔊' : '🔇'}
          </button>
          {onClose && (
            <button className="cb-close-btn" onClick={onClose} aria-label="Close chat">✕</button>
          )}
        </div>
      </div>

      <div className="cb-messages">
        {messages.map((msg, i) => {
          const cards = msg.recommendedRecipes
            ?.map(name => recipeByName.current.get(name.toLowerCase().trim()))
            .filter((r): r is Recipe => r !== undefined) ?? [];
          const isThisPlaying = playingId === msg.id;

          return (
            <div key={i} className="cb-message-group">
              <div className={`cb-row cb-row--${msg.role}`}>
                {msg.role === 'bartender' && (
                  <div className="cb-avatar">V</div>
                )}
                <div className={`cb-bubble cb-bubble--${msg.role}`}>
                  {msg.role === 'bartender' ? renderMarkdown(msg.text) : msg.text}
                  {msg.role === 'bartender' && voiceEnabled && (
                    <button
                      className={`cb-speaker-btn${isThisPlaying ? ' cb-speaker-btn--playing' : ''}`}
                      onClick={() => handleSpeakerClick(msg)}
                      aria-label={isThisPlaying ? 'Stop' : 'Play'}
                      disabled={voiceLoading && !isThisPlaying}
                    >
                      {isThisPlaying ? '■' : '🔊'}
                    </button>
                  )}
                </div>
              </div>
              {cards.length > 0 && (
                <div className="cb-recipe-cards">
                  {cards.map(recipe => (
                    <VesperRecipeCard
                      key={recipe.id}
                      recipe={recipe}
                      inventory={inventory}
                      checkedPantryIds={checkedPantryIds ?? new Set()}
                      onMakeThis={setMakingRecipe}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {typing && (
          <div className="cb-row cb-row--bartender">
            <div className="cb-avatar">V</div>
            <div className="cb-bubble cb-bubble--bartender cb-bubble--typing">
              <span className="cb-dot" />
              <span className="cb-dot" />
              <span className="cb-dot" />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {displayedChips.length > 0 && !typing && (
        <div className="cb-chips">
          {displayedChips.map((chip, i) => (
            <button
              key={i}
              className={`cb-chip${chip === 'Make This 🍸' ? ' cb-chip--make' : ''}`}
              onClick={() => handleChipClick(chip)}
            >
              {chip}
            </button>
          ))}
        </div>
      )}

      {mode === 'my-bar' && inventory.filter(i => i.quantity !== 'out').length === 0 && onGoToInventory && (
        <button className="cb-go-inventory" onClick={onGoToInventory}>
          Stock my bar →
        </button>
      )}

      <div className="cb-input-row">
        <input
          ref={inputRef}
          className="cb-input"
          placeholder="Ask me anything…"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={typing}
        />
        <button
          className="cb-send-btn"
          onClick={handleSend}
          disabled={!input.trim() || typing}
          aria-label="Send"
        >
          ↑
        </button>
      </div>

      {makingRecipe && (
        <IMadeThisModal
          recipeName={makingRecipe.name}
          onConfirm={handleMakeConfirm}
          onCancel={() => setMakingRecipe(null)}
        />
      )}

      {surveyRecipe && !surveyDoneIds.has(surveyRecipe.id) && (
        <DrinkSurvey
          recipeName={surveyRecipe.name}
          userId={userId ?? null}
          onDismiss={() => {
            setSurveyDoneIds(prev => { const s = new Set(prev); s.add(surveyRecipe.id); return s; });
            setSurveyRecipe(null);
          }}
        />
      )}
    </div>
  );
}
