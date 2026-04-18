import React, { useState } from 'react';
import { BartenderModal } from '../components/BartenderModal';
import './LandingPage.css';

interface Props {
  onEnter: () => void;
}

const MOCK_CARDS = [
  { name: 'Negroni',      desc: 'Gin · Campari · Sweet Vermouth', badge: 'Ready',       cls: 'ready' },
  { name: 'Old Fashioned',desc: 'Bourbon · Bitters · Simple Syrup', badge: 'Low on stock', cls: 'warn' },
  { name: 'French 75',    desc: 'Gin · Lemon · Champagne',        badge: 'Missing 1',   cls: 'miss' },
];

const INVENTORY_PREVIEW = [
  { name: 'Hendrick\'s Gin',    badge: 'Full',   cls: 'full' },
  { name: 'Campari',            badge: 'Full',   cls: 'full' },
  { name: 'Sweet Vermouth',     badge: '½ Bottle', cls: 'half' },
  { name: 'Angostura Bitters',  badge: 'Splash', cls: 'splash' },
];

const KLAVIYO_PUBLIC_KEY = 'XXQwsC';
const KLAVIYO_LIST_ID    = 'TQut8s';

async function submitToKlaviyo(email: string, zip: string): Promise<void> {
  const res = await fetch(
    `https://a.klaviyo.com/client/subscriptions/?company_id=${KLAVIYO_PUBLIC_KEY}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'revision': '2023-12-15',
      },
      body: JSON.stringify({
        data: {
          type: 'subscription',
          attributes: {
            profile: {
              data: {
                type: 'profile',
                attributes: {
                  email,
                  properties: { zip_code: zip },
                },
              },
            },
          },
          relationships: {
            list: {
              data: {
                type: 'list',
                id: KLAVIYO_LIST_ID,
              },
            },
          },
        },
      }),
    },
  );
  if (!res.ok) throw new Error(`Klaviyo error ${res.status}`);
}

type SignupStatus = 'idle' | 'loading' | 'success' | 'error';

interface SignupFormProps {
  btnLabel: string;
  id: string;
}

function SignupForm({ btnLabel, id }: SignupFormProps) {
  const [email,  setEmail]  = useState('');
  const [zip,    setZip]    = useState('');
  const [status, setStatus] = useState<SignupStatus>('idle');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !zip) return;
    setStatus('loading');
    try {
      await submitToKlaviyo(email.trim(), zip.trim());
      setStatus('success');
      setEmail('');
      setZip('');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="lp-signup-success">
        <span className="lp-signup-success-dot" />
        You're on the list!
      </div>
    );
  }

  return (
    <form className="lp-signup" onSubmit={handleSubmit} id={id}>
      <div className="lp-signup-fields">
        <input
          className="lp-signup-input"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          disabled={status === 'loading'}
        />
        <input
          className="lp-signup-input lp-signup-zip"
          type="text"
          placeholder="ZIP code"
          value={zip}
          onChange={e => setZip(e.target.value.replace(/\D/g, '').slice(0, 5))}
          maxLength={5}
          required
          disabled={status === 'loading'}
        />
      </div>
      <button
        className="lp-signup-btn"
        type="submit"
        disabled={status === 'loading'}
      >
        {status === 'loading' ? 'Sending…' : btnLabel}
      </button>
      {status === 'error' && (
        <p className="lp-signup-error">Something went wrong. Please try again.</p>
      )}
    </form>
  );
}

export function LandingPage({ onEnter }: Props) {
  const [bartenderOpen, setBartenderOpen] = useState(false);

  return (
    <div className="lp">

      {/* ── Nav ── */}
      <nav className="lp-nav">
        <div className="lp-nav-brand">
          <span className="lp-nav-icon">🍸</span>
          <span className="lp-nav-name">thepour.</span>
        </div>
        <button className="lp-nav-btn">Get Early Access</button>
      </nav>

      {/* ── Hero ── */}
      <section className="lp-hero">
        <div className="lp-hero-copy">
          <div className="lp-hero-eyebrow">
            <span className="lp-eyebrow-dot" />
            Now in early access
          </div>
          <h1 className="lp-hero-headline">
            Your bar.<br />
            <em>Smarter</em> every pour.
          </h1>
          <p className="lp-hero-sub">
            Track what's in your home bar, discover what you can make right now,
            and get recipe suggestions that actually match your bottles.
          </p>
          <p className="lp-hero-tagline">
            Cocktails. Mocktails. Dirty Sodas. Every drink, one app.
          </p>
          <SignupForm btnLabel="Get Early Access" id="hero-signup" />
          <div className="lp-bartender-row">
            <button className="lp-bartender-btn" onClick={() => setBartenderOpen(true)}>
              🍸 Ask Your Bartender
            </button>
            <span className="lp-bartender-hint">Not sure what to make? Let us decide.</span>
          </div>
          <p className="lp-hero-meta">
            <button onClick={onEnter}>Or try the app now →</button>
          </p>
        </div>

        {/* ── Phone Mockup ── */}
        <div className="lp-phone-wrap">
          <div className="lp-phone">
            <div className="lp-phone-notch" />
            <div className="lp-phone-screen">
              <div className="lp-phone-top">
                <span className="lp-phone-title">thepour.</span>
                <span className="lp-phone-tag">3 ready</span>
              </div>
              {MOCK_CARDS.map(card => (
                <div key={card.name} className={`lp-mock-card lp-mock-card--${card.cls}`}>
                  <div className="lp-mock-card-row">
                    <span className="lp-mock-card-name">{card.name}</span>
                    <span className={`lp-mock-card-badge lp-mock-card-badge--${card.cls}`}>
                      {card.badge}
                    </span>
                  </div>
                  <div className="lp-mock-card-desc">{card.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="lp-divider" />

      {/* ── How It Works ── */}
      <section className="lp-section">
        <p className="lp-section-label">How it works</p>
        <h2 className="lp-section-title">Three steps to a better home bar</h2>
        <p className="lp-section-sub">
          Set up your bar in minutes. thepour. does the rest — matching recipes to exactly what you have.
        </p>
        <div className="lp-steps">
          <div className="lp-step">
            <div className="lp-step-num">01</div>
            <div className="lp-step-title">Stock your bar</div>
            <p className="lp-step-desc">
              Browse our library of spirits, liqueurs, and mixers. Mark each bottle with how much you have — Full, Half, Splash, or Out.
            </p>
            <div className="lp-step-connector" />
          </div>
          <div className="lp-step">
            <div className="lp-step-num">02</div>
            <div className="lp-step-title">Get matched recipes</div>
            <p className="lp-step-desc">
              Instantly see which cocktails you can make right now, which ones are one bottle away, and get a heads up when you're running low.
            </p>
            <div className="lp-step-connector" />
          </div>
          <div className="lp-step">
            <div className="lp-step-num">03</div>
            <div className="lp-step-title">Pour with confidence</div>
            <p className="lp-step-desc">
              Tap any recipe for accurate measurements, step-by-step instructions, and glassware recommendations from classic to modern.
            </p>
          </div>
        </div>
      </section>

      <div className="lp-divider" />

      {/* ── Features Bento ── */}
      <section className="lp-section">
        <p className="lp-section-label">Features</p>
        <h2 className="lp-section-title">Everything your bar needs</h2>
        <p className="lp-section-sub">
          Built for home bartenders who take their craft seriously.
        </p>
        <div className="lp-bento">

          {/* Wide card — inventory */}
          <div className="lp-bento-card lp-bento-card--wide">
            <span className="lp-bento-icon">📦</span>
            <div className="lp-bento-title">Quantity-aware inventory</div>
            <p className="lp-bento-desc">
              Not just in or out. Track every bottle from Full to Splash so recipes warn you before you run dry mid-pour.
            </p>
            <div className="lp-mini-inventory">
              {INVENTORY_PREVIEW.map(item => (
                <div key={item.name} className="lp-mini-row">
                  <span className="lp-mini-name">{item.name}</span>
                  <span className={`lp-mini-badge lp-mini-badge--${item.cls}`}>{item.badge}</span>
                </div>
              ))}
            </div>
            <div className="lp-bento-glow" />
          </div>

          {/* Tall card — smart matching */}
          <div className="lp-bento-card lp-bento-card--tall">
            <span className="lp-bento-icon">✨</span>
            <div className="lp-bento-title">Smart recipe matching</div>
            <p className="lp-bento-desc">
              Recipes are ranked by how many ingredients you already have. The ones you can make right now always come first.
            </p>
            <p className="lp-bento-desc" style={{ marginTop: 12 }}>
              Running low on a key ingredient? You'll see a warning before you start mixing — not halfway through.
            </p>
            <div className="lp-bento-glow" />
          </div>

          {/* Regular — recipes */}
          <div className="lp-bento-card">
            <span className="lp-bento-icon">🍹</span>
            <div className="lp-bento-title">Cocktails, Mocktails & Dirty Sodas</div>
            <p className="lp-bento-desc">
              200+ recipes across four categories — classic cocktails, shots, zero-proof mocktails, and viral dirty sodas. Something for everyone.
            </p>
            <div className="lp-bento-glow" />
          </div>

          {/* Regular — search */}
          <div className="lp-bento-card">
            <span className="lp-bento-icon">🔍</span>
            <div className="lp-bento-title">Search & filter by spirit</div>
            <p className="lp-bento-desc">
              Find recipes by name or filter by spirit type — Whiskey, Gin, Rum, Tequila, Vodka — all composable.
            </p>
            <div className="lp-bento-glow" />
          </div>

          {/* Regular — add bottles */}
          <div className="lp-bento-card">
            <span className="lp-bento-icon">➕</span>
            <div className="lp-bento-title">Add any bottle</div>
            <p className="lp-bento-desc">
              Not in our library? Add custom bottles to your bar and they'll count toward recipe matching instantly.
            </p>
            <div className="lp-bento-glow" />
          </div>

        </div>
      </section>

      <div className="lp-divider" />

      {/* ── CTA ── */}
      <section className="lp-cta">
        <div className="lp-cta-glow" />
        <div className="lp-cta-inner">
          <p className="lp-section-label">Early access</p>
          <h2 className="lp-cta-title">
            Ready to make something <em>great</em>?
          </h2>
          <p className="lp-cta-sub">
            Join the waitlist and be the first to know when thepour. launches. Free during beta.
          </p>
          <div className="lp-cta-signup">
            <SignupForm btnLabel="Join the list" id="cta-signup" />
          </div>
          <p className="lp-cta-meta">No spam. Unsubscribe any time.</p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="lp-footer">
        <span className="lp-footer-brand">thepour.</span>
        <span className="lp-footer-copy">© {new Date().getFullYear()} thepour. All rights reserved.</span>
        <button className="lp-footer-enter" onClick={onEnter}>
          Open the app →
        </button>
      </footer>

      {bartenderOpen && (
        <BartenderModal onClose={() => setBartenderOpen(false)} />
      )}
    </div>
  );
}
