import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { InventoryItem } from '../types';
import { PANTRY_CATEGORIES } from '../data/pantryItems';
import { UnlockSuggestion } from '../utils/unlockCalculator';
import './ChatBartender.css';

type BarMode = 'my-bar' | 'im-out' | 'explore';

interface Message {
  role: 'bartender' | 'user';
  text: string;
}

interface Props {
  mode: BarMode;
  inventory: InventoryItem[];
  checkedPantryIds?: Set<string>;
  onGoToInventory?: () => void;
  unlockSuggestions?: UnlockSuggestion[];
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

const QUICK_REPLIES_INITIAL = [
  'Surprise me 🎲',
  'Something classic',
  'Light and refreshing',
  'Strong and stirred',
  "I'm feeling adventurous",
];

function getOpeningMessage(
  mode: BarMode,
  count: number,
  checkedPantryIds?: Set<string>,
  topUnlock?: UnlockSuggestion,
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

export function ChatBartender({ mode, inventory, checkedPantryIds, onGoToInventory, unlockSuggestions = [] }: Props) {
  const topUnlock   = unlockSuggestions[0];
  const openingText = getOpeningMessage(mode, inventory.length, checkedPantryIds, topUnlock);

  const [messages, setMessages] = useState<Message[]>([
    { role: 'bartender', text: openingText },
  ]);
  const [quickReplies, setQuickReplies] = useState<string[]>(QUICK_REPLIES_INITIAL);
  const [input, setInput]   = useState('');
  const [typing, setTyping] = useState(false);

  const bottomRef  = useRef<HTMLDivElement>(null);
  const inputRef   = useRef<HTMLInputElement>(null);
  const apiHistory = useRef<{ role: 'user' | 'assistant'; content: string }[]>([]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  async function sendMessage(text: string) {
    if (!text.trim() || typing) return;

    const userMsg: Message = { role: 'user', text: text.trim() };
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

      const { data, error } = await supabase.functions.invoke('chat-bartender', {
        body: {
          messages: apiHistory.current,
          inventoryList,
          mode,
          pantryList,
          unlockContext,
        },
      });

      if (error || data?.error) {
        throw new Error(error?.message ?? data?.error ?? 'Unknown error');
      }

      const reply: string       = data?.message ?? "Sorry, I lost my train of thought. Try again?";
      const chips: string[]     = data?.quickReplies ?? [];

      apiHistory.current.push({ role: 'assistant', content: reply });
      setMessages(prev => [...prev, { role: 'bartender', text: reply }]);
      setQuickReplies(chips);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setMessages(prev => [
        ...prev,
        { role: 'bartender', text: `Something went wrong on my end — sorry about that. (${msg})` },
      ]);
    } finally {
      setTyping(false);
    }
  }

  function handleSend() {
    sendMessage(input);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') handleSend();
  }

  return (
    <div className="cb-wrap">
      <div className="cb-messages">
        {messages.map((msg, i) => (
          <div key={i} className={`cb-row cb-row--${msg.role}`}>
            {msg.role === 'bartender' && (
              <div className="cb-avatar">V</div>
            )}
            <div className={`cb-bubble cb-bubble--${msg.role}`}>
              {msg.role === 'bartender' ? renderMarkdown(msg.text) : msg.text}
            </div>
          </div>
        ))}

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

      {quickReplies.length > 0 && !typing && (
        <div className="cb-chips">
          {quickReplies.map((chip, i) => (
            <button key={i} className="cb-chip" onClick={() => sendMessage(chip)}>
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
    </div>
  );
}
