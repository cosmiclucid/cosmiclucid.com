

// src/components/lib/qualityMode.ts
// Lightweight runtime checks to decide whether to run "full" visual effects.
// Safari (especially iOS Safari) often struggles with heavy blur/3D/compositing.

export type QualityMode = "full" | "lite";

/** True if the current device is iOS/iPadOS (including iPadOS reporting as Mac). */
export function detectIOS(): boolean {
  if (typeof navigator === "undefined") return false;

  const ua = navigator.userAgent || "";
  const platform = (navigator as any).platform || "";
  const maxTouchPoints = (navigator as any).maxTouchPoints || 0;

  const isiPhoneIPadIPod = /iP(hone|ad|od)/.test(ua);

  // iPadOS 13+ sometimes reports as MacIntel, but with touch points.
  const isiPadOS = platform === "MacIntel" && maxTouchPoints > 1;

  return isiPhoneIPadIPod || isiPadOS;
}

/**
 * True if Safari (desktop or iOS). Excludes Chrome/Edge/Firefox on iOS where possible.
 * Note: All iOS browsers use WebKit, but their UAs include CriOS/FxiOS/EdgiOS.
 */
export function detectSafari(): boolean {
  if (typeof navigator === "undefined") return false;

  const ua = navigator.userAgent || "";

  const isAppleWebKit = /AppleWebKit\//.test(ua);
  const isSafariToken = /Safari\//.test(ua);

  // Exclude common non-Safari browsers
  const isChrome = /Chrome\//.test(ua) || /Chromium\//.test(ua);
  const isEdge = /Edg\//.test(ua);
  const isFirefox = /Firefox\//.test(ua);
  const isOpera = /OPR\//.test(ua);

  // iOS variants
  const isChromeIOS = /CriOS\//.test(ua);
  const isFirefoxIOS = /FxiOS\//.test(ua);
  const isEdgeIOS = /EdgiOS\//.test(ua);
  const isOperaIOS = /OPiOS\//.test(ua);

  const excluded =
    isChrome ||
    isEdge ||
    isFirefox ||
    isOpera ||
    isChromeIOS ||
    isFirefoxIOS ||
    isEdgeIOS ||
    isOperaIOS;

  return isAppleWebKit && isSafariToken && !excluded;
}

/**
 * Decide quality mode.
 * - "lite" on Safari and/or iOS (more stable performance)
 * - "full" otherwise
 */
export function getQualityMode(): QualityMode {
  // Default to full on the server; caller should run client-side.
  if (typeof window === "undefined") return "full";

  const safari = detectSafari();
  const ios = detectIOS();

  return safari || ios ? "lite" : "full";
}