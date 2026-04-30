import React, { useState, useEffect, useRef } from 'react';
import { BartenderModal } from '../components/BartenderModal';
import { ResponsibleFooter } from '../components/ResponsibleFooter';
import { ThePourLogo } from '../components/ThePourLogo';
import { useFeaturedDrink, FeaturedDrink } from '../hooks/useFeaturedDrink';
import './LandingPage.css';

interface Props {
  onEnter: () => void;
  onEnterView: (view: 'inventory' | 'recipes') => void;
}

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

function FeaturedSection({ featured, onEnter }: { featured: FeaturedDrink; onEnter: () => void }) {
  const teaserParts = featured.recipe_teaser ? featured.recipe_teaser.split('·').map(s => s.trim()) : [];

  return (
    <section className="lp-featured-section">
      <div className="lp-featured-glow" />
      <div className="lp-featured-inner">

        {/* Left — editorial copy */}
        <div className="lp-featured-copy">
          {featured.occasion && (
            <p className="lp-featured-occasion">{featured.occasion}</p>
          )}
          <h2 className="lp-featured-title">{featured.drink_name}</h2>
          <p className="lp-featured-desc">{featured.vesper_description}</p>
          {featured.recipe_teaser && (
            <p className="lp-featured-teaser">{featured.recipe_teaser}</p>
          )}
          <button className="lp-featured-cta" onClick={onEnter}>
            Make This in thepour →
          </button>
          {featured.sponsor_name && (
            <p className="lp-featured-sponsor">
              Featured in partnership with{' '}
              {featured.sponsor_url
                ? <a href={featured.sponsor_url} target="_blank" rel="noopener noreferrer">{featured.sponsor_name}</a>
                : featured.sponsor_name}
            </p>
          )}
        </div>

        {/* Right — styled recipe card */}
        <div className="lp-featured-card-wrap">
          <div className="lp-featured-card">
            <div className="lp-featured-card-header">
              <span className="lp-featured-card-label">This Weekend</span>
              <span className="lp-featured-card-badge">Ready to Make</span>
            </div>
            <div className="lp-featured-card-name">{featured.drink_name}</div>
            {teaserParts.length > 0 && (
              <div className="lp-featured-card-ingredients">
                {teaserParts.map((part, i) => (
                  <span key={i} className="lp-featured-card-ing">{part}</span>
                ))}
              </div>
            )}
            <button className="lp-featured-card-btn" onClick={onEnter}>
              See Recipe →
            </button>
            <div className="lp-featured-card-glow" />
          </div>
        </div>

      </div>
    </section>
  );
}

function VesperChatDemo() {
  const [stage, setStage] = useState(0);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    const timers: ReturnType<typeof setTimeout>[] = [];

    function schedule(fn: () => void, delay: number) {
      const t = setTimeout(() => { if (mountedRef.current) fn(); }, delay);
      timers.push(t);
    }

    function startSequence() {
      schedule(() => setStage(1), 400);
      schedule(() => setStage(2), 1100);
      schedule(() => setStage(3), 3100);
      schedule(() => setStage(4), 4500);
      schedule(() => { setStage(0); schedule(startSequence, 700); }, 13500);
    }

    startSequence();

    return () => {
      mountedRef.current = false;
      timers.forEach(clearTimeout);
    };
  }, []);

  return (
    <div className="lp-chat-demo">
      <div className="lp-chat-header">
        <div className="lp-chat-avatar">V</div>
        <div className="lp-chat-header-info">
          <div className="lp-chat-name">Vesper</div>
          <div className="lp-chat-online">● Your bartender</div>
        </div>
      </div>
      <div className="lp-chat-messages">
        {stage >= 1 && (
          <div className="lp-chat-bubble lp-chat-bubble--user lp-chat-in">
            Something impressive for guests.
          </div>
        )}
        {stage === 2 && (
          <div className="lp-chat-bubble lp-chat-bubble--vesper lp-chat-in">
            <div className="lp-chat-typing">
              <span /><span /><span />
            </div>
          </div>
        )}
        {stage >= 3 && (
          <div className="lp-chat-bubble lp-chat-bubble--vesper lp-chat-in">
            <strong>Paper Plane.</strong> Equal parts everything —
            bourbon, Aperol, Campari, lemon. It sounds simple until your
            guests ask what's in it and you watch their faces. Make four.
          </div>
        )}
        {stage >= 4 && (
          <div className="lp-chat-card lp-chat-in">
            <div className="lp-chat-card-body">
              <div className="lp-chat-card-name">Paper Plane</div>
              <div className="lp-chat-card-meta">Bourbon · Aperol · Campari · Lemon</div>
            </div>
            <span className="lp-chat-card-badge">Ready ✓</span>
          </div>
        )}
      </div>
    </div>
  );
}

export function LandingPage({ onEnter, onEnterView }: Props) {
  const [bartenderOpen, setBartenderOpen] = useState(false);
  const { featuredDrink } = useFeaturedDrink();

  return (
    <div className="lp">

      {/* ── Nav ── */}
      <nav className="lp-nav">
        <div className="lp-nav-brand">
          <ThePourLogo glassSize={24} fontSize={20} />
        </div>
        <button className="lp-nav-btn" onClick={onEnter}>Sign In</button>
      </nav>

      {/* ── Hero ── */}
      <section className="lp-hero">
        <div className="lp-hero-copy">
          <div className="lp-hero-eyebrow">
            <span className="lp-eyebrow-dot" />
            Now in early access
          </div>
          <h1 className="lp-hero-headline">
            Meet Vesper.<br />
            Your bartender <em>knows</em> your bar.
          </h1>
          <p className="lp-hero-sub">
            Not a search box. Not a filter. A bartender with opinions, taste,
            and a direct line to your inventory.
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

        {/* ── Animated Vesper Chat ── */}
        <div className="lp-phone-wrap">
          <VesperChatDemo />
        </div>
      </section>

      {featuredDrink && (
        <>
          <div className="lp-divider" />
          <FeaturedSection featured={featuredDrink} onEnter={onEnter} />
        </>
      )}

      <div className="lp-divider" />

      {/* ── How It Works ── */}
      <section className="lp-section">
        <p className="lp-section-label">How it works</p>
        <h2 className="lp-section-title">Three steps to a better home bar</h2>
        <p className="lp-section-sub">
          Set up your bar in minutes. thepour. does the rest — matching recipes to exactly what you have.
        </p>
        <div className="lp-steps">
          <button className="lp-step lp-step--btn" onClick={() => onEnterView('inventory')}>
            <div className="lp-step-num">01</div>
            <div className="lp-step-title">Stock your bar</div>
            <p className="lp-step-desc">
              Browse our library of spirits, liqueurs, and mixers. Mark each bottle with how much you have — Full, Half, Splash, or Out.
            </p>
            <span className="lp-step-cta">Open My Bar →</span>
            <div className="lp-step-connector" />
          </button>
          <button className="lp-step lp-step--btn" onClick={() => onEnterView('recipes')}>
            <div className="lp-step-num">02</div>
            <div className="lp-step-title">Get matched recipes</div>
            <p className="lp-step-desc">
              Instantly see which cocktails you can make right now, which ones are one bottle away, and get a heads up when you're running low.
            </p>
            <span className="lp-step-cta">Browse Recipes →</span>
            <div className="lp-step-connector" />
          </button>
          <button className="lp-step lp-step--btn" onClick={() => onEnterView('recipes')}>
            <div className="lp-step-num">03</div>
            <div className="lp-step-title">Pour with confidence</div>
            <p className="lp-step-desc">
              Tap any recipe for accurate measurements, step-by-step instructions, and glassware recommendations from classic to modern.
            </p>
            <span className="lp-step-cta">See what's ready →</span>
          </button>
        </div>
      </section>

      <div className="lp-divider" />

      {/* ── Vesper Section ── */}
      <section className="lp-vesper-section">
        <div className="lp-vesper-glow" />
        <div className="lp-vesper-inner">
          <p className="lp-section-label" style={{ color: 'var(--teal)' }}>Your Bartender</p>
          <h2 className="lp-vesper-headline">
            Vesper doesn't just find recipes.<br />
            <em>She decides.</em>
          </h2>
          <div className="lp-vesper-columns">
            <div className="lp-vesper-col">
              <div className="lp-vesper-col-title">She knows your bar</div>
              <p className="lp-vesper-col-desc">
                Every recommendation is based on exactly what you have. No missing ingredients. No guessing.
              </p>
            </div>
            <div className="lp-vesper-col">
              <div className="lp-vesper-col-title">She has opinions</div>
              <p className="lp-vesper-col-desc">
                Ask for something unique and she won't say Gin &amp; Tonic. She'll find something worth making.
              </p>
            </div>
            <div className="lp-vesper-col">
              <div className="lp-vesper-col-title">She speaks your language</div>
              <p className="lp-vesper-col-desc">
                Not a list of results. A real recommendation with a reason.
              </p>
            </div>
          </div>
          <div className="lp-vesper-quote">
            <div className="lp-vesper-quote-mark">"</div>
            <p className="lp-vesper-quote-text">
              You're one bottle away from a Sazerac — all you need is Absinthe. Tonight though, make a Blood and Sand. You have everything, and it tastes like a drink from a better era that somehow still feels dangerous.
            </p>
            <div className="lp-vesper-quote-attr">— Vesper, thepour.ai</div>
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
            <div className="lp-bento-title">Cocktails, Mocktails &amp; Dirty Sodas</div>
            <p className="lp-bento-desc">
              600+ recipes across four categories — classic cocktails, shots, zero-proof mocktails, and viral dirty sodas. Something for everyone.
            </p>
            <div className="lp-bento-glow" />
          </div>

          {/* Regular — search */}
          <div className="lp-bento-card">
            <span className="lp-bento-icon">🔍</span>
            <div className="lp-bento-title">Search &amp; filter by spirit</div>
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
        <ThePourLogo glassSize={18} fontSize={16} className="lp-footer-brand" />
        <span className="lp-footer-copy">© {new Date().getFullYear()} thepour. All rights reserved.</span>
        <button className="lp-footer-enter" onClick={onEnter}>
          Open the app →
        </button>
      </footer>

      <ResponsibleFooter />

      {bartenderOpen && (
        <BartenderModal onClose={() => setBartenderOpen(false)} />
      )}
    </div>
  );
}
