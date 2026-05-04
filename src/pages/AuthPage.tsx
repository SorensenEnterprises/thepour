import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ResponsibleFooter } from '../components/ResponsibleFooter';
import { ThePourLogo } from '../components/ThePourLogo';
import './AuthPage.css';

interface Props {
  onEntered: () => void;
}

type Mode = 'signin' | 'signup';

export function AuthPage({ onEntered }: Props) {
  const { signIn, signUp, continueAsGuest } = useAuth();
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
  const topPadding = isStandalone ? 78 : 24;

  const [mode, setMode] = useState<Mode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'verify'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) return;
    setStatus('loading');
    setErrorMsg('');

    if (mode === 'signin') {
      const { error } = await signIn(email, password);
      if (error) {
        setStatus('error');
        setErrorMsg(error);
      } else {
        onEntered();
      }
    } else {
      const { error } = await signUp(email, password);
      if (error) {
        setStatus('error');
        setErrorMsg(error);
      } else {
        setStatus('verify');
      }
    }
  }

  function handleGuest() {
    continueAsGuest();
    onEntered();
  }

  function toggleMode() {
    setMode(m => (m === 'signin' ? 'signup' : 'signin'));
    setStatus('idle');
    setErrorMsg('');
  }

  if (status === 'verify') {
    return (
      <div className="auth-wrap" style={{ paddingTop: `${topPadding}px` }}>
        <div className="auth-card">
          <div className="auth-verify-icon">✉</div>
          <h2 className="auth-title">Check your email</h2>
          <p className="auth-sub">
            We sent a confirmation link to <strong>{email}</strong>.
            Click it to activate your account, then sign in.
          </p>
          <button
            className="auth-link-btn"
            onClick={() => { setMode('signin'); setStatus('idle'); }}
          >
            Back to Sign In
          </button>
        </div>
        <ResponsibleFooter />
      </div>
    );
  }

  return (
    <div className="auth-wrap" style={{ paddingTop: `${topPadding}px` }}>
      <div className="auth-card">
        {/* Brand */}
        <div className="auth-brand">
          <ThePourLogo glassSize={36} fontSize={24} />
        </div>

        <h2 className="auth-title">
          {mode === 'signin' ? 'Welcome back' : 'Create your bar'}
        </h2>
        <p className="auth-sub">
          {mode === 'signin'
            ? 'Sign in to sync your inventory across devices.'
            : 'Create a free account to save your bar to the cloud.'}
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label className="auth-label" htmlFor="auth-email">Email</label>
            <input
              id="auth-email"
              className="auth-input"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
              disabled={status === 'loading'}
            />
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="auth-password">Password</label>
            <input
              id="auth-password"
              className="auth-input"
              type="password"
              placeholder={mode === 'signup' ? 'At least 6 characters' : 'Your password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
              disabled={status === 'loading'}
            />
          </div>

          {status === 'error' && (
            <p className="auth-error">{errorMsg}</p>
          )}

          <button
            className="auth-submit"
            type="submit"
            disabled={status === 'loading'}
          >
            {status === 'loading'
              ? 'Please wait…'
              : mode === 'signin' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="auth-divider">
          <span>or</span>
        </div>

        <button className="auth-guest-btn" onClick={handleGuest}>
          Continue as guest
        </button>

        <p className="auth-toggle">
          {mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}
          {' '}
          <button className="auth-toggle-link" onClick={toggleMode}>
            {mode === 'signin' ? 'Create one' : 'Sign in'}
          </button>
        </p>
      </div>
      <ResponsibleFooter />
    </div>
  );
}
