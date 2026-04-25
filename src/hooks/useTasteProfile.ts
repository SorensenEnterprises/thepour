import { useState, useCallback } from 'react';

const LS_KEY = 'vesper_taste_profile';

export interface TasteProfile {
  lightPreference:    boolean;
  spiritPreferences:  string[];
  avoidList:          string[];
  sweetnessPreference: 'low' | 'medium' | 'high' | null;
}

const DEFAULT_PROFILE: TasteProfile = {
  lightPreference:    false,
  spiritPreferences:  [],
  avoidList:          [],
  sweetnessPreference: null,
};

function loadProfile(): TasteProfile {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return DEFAULT_PROFILE;
    return { ...DEFAULT_PROFILE, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PROFILE;
  }
}

function saveProfile(profile: TasteProfile) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(profile)); } catch {}
}

export function useTasteProfile() {
  const [tasteProfile, setTasteProfile] = useState<TasteProfile>(loadProfile);

  const updateLightPreference = useCallback((value: boolean) => {
    setTasteProfile(prev => {
      const next = { ...prev, lightPreference: value };
      saveProfile(next);
      return next;
    });
  }, []);

  return {
    tasteProfile,
    lightPreference: tasteProfile.lightPreference,
    updateLightPreference,
  };
}
