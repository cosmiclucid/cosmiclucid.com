import { useEffect, useState } from 'react';

type ClientEnv = {
  isMobile: boolean;
  isSmallScreen: boolean;
  prefersReducedMotion: boolean;
};

// Centralised environment detection to avoid repeating UA/viewport/matchMedia checks.
export function useClientEnv(): ClientEnv {
  const [env, setEnv] = useState<ClientEnv>({
    isMobile: false,
    isSmallScreen: false,
    prefersReducedMotion: false,
  });

  useEffect(() => {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') return;

    const compute = () => {
      const width = window.innerWidth || 0;
      const ua = navigator.userAgent || navigator.vendor || '';
      const isMobileUA = /android|iphone|ipad|ipod|windows phone/i.test(ua);
      const isSmallScreen = width < 900;
      const isMobile = isMobileUA || isSmallScreen;
      const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
      setEnv({ isMobile, isSmallScreen, prefersReducedMotion });
    };

    compute();
    window.addEventListener('resize', compute);
    const mql = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    const handleMotion = () => compute();
    mql?.addEventListener('change', handleMotion);

    return () => {
      window.removeEventListener('resize', compute);
      mql?.removeEventListener('change', handleMotion);
    };
  }, []);

  return env;
}
