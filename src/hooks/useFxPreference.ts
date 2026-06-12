import { useState } from 'react';

export type FxPreference = 'on' | 'off';

const STORAGE_KEY = 'louislucid-fx-mode';

function readPreference(): FxPreference {
  if (typeof window === 'undefined') return 'on';

  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === 'off' ? 'off' : 'on';
}

export function useFxPreference() {
  const [preference, setPreferenceState] = useState<FxPreference>(readPreference);

  const setPreference = (nextPreference: FxPreference) => {
    setPreferenceState(nextPreference);
    window.localStorage.setItem(STORAGE_KEY, nextPreference);
  };

  return {
    preference,
    setPreference,
  };
}
