import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase, supabaseConfigured } from '../lib/supabase';

const GUEST_KEY = 'thepour_guest';

// Safari private mode throws on any localStorage access — guard every call.
function lsGet(key: string): string | null {
  try { return localStorage.getItem(key); } catch { return null; }
}
function lsSet(key: string, value: string): void {
  try { localStorage.setItem(key, value); } catch { /* private mode */ }
}
function lsRemove(key: string): void {
  try { localStorage.removeItem(key); } catch { /* private mode */ }
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isGuest: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  continueAsGuest: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser]       = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    if (!supabaseConfigured) {
      // No Supabase — work in guest-only mode immediately
      setIsGuest(lsGet(GUEST_KEY) === 'true');
      setLoading(false);
      return;
    }

    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (!session) {
          setIsGuest(lsGet(GUEST_KEY) === 'true');
        }
      })
      .catch(() => {
        // Network error or misconfigured project — fall back to guest mode
        setIsGuest(lsGet(GUEST_KEY) === 'true');
      })
      .finally(() => setLoading(false));

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string): Promise<{ error: string | null }> => {
    if (!supabaseConfigured) return { error: 'Supabase is not configured.' };
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    setIsGuest(false);
    lsRemove(GUEST_KEY);
    return { error: null };
  };

  const signUp = async (email: string, password: string): Promise<{ error: string | null }> => {
    if (!supabaseConfigured) return { error: 'Supabase is not configured.' };
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) return { error: error.message };
    return { error: null };
  };

  const signOut = async () => {
    if (supabaseConfigured) await supabase.auth.signOut();
    setIsGuest(false);
    lsRemove(GUEST_KEY);
  };

  const continueAsGuest = () => {
    setIsGuest(true);
    lsSet(GUEST_KEY, 'true');
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, isGuest, signIn, signUp, signOut, continueAsGuest }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
