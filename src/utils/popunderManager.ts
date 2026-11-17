const POPUNDER_SCRIPT_URL =
  'https://pl30616999.profitableratecpmnetwork.com/ca/52/c3/ca52c325704866c7ae29f34363091f05.js';

/**
 * 1 hour divided into 3 equal parts = 20 minutes (1,200,000 ms).
 * Triggers once on the user's first interaction after load, then once every 20 minutes.
 */
export const POPUNDER_INTERVAL_MS = 20 * 60 * 1000;

const STORAGE_KEY = 'asbily_popunder_last_at';
const GRACE_WINDOW_MS = 2000;

let memoryLastAt = 0;
let initialized = false;
let armed = false;
let scriptLoaded = false;
let graceUntil = 0;
let rearmTimer: number | null = null;

function readLastShownAt(): number {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = Number(raw);
      if (Number.isFinite(parsed) && parsed > 0) {
        memoryLastAt = parsed;
        return parsed;
      }
    }
  } catch {
    // Ignore storage access errors in restricted contexts
  }
  return memoryLastAt;
}

function writeLastShownAt(ts: number): void {
  memoryLastAt = ts;
  try {
    window.localStorage.setItem(STORAGE_KEY, String(ts));
  } catch {
    // Ignore storage quota / privacy mode errors
  }
}

function isPopunderDue(now = Date.now()): boolean {
  const lastAt = readLastShownAt();
  return !lastAt || now - lastAt >= POPUNDER_INTERVAL_MS;
}

function injectPopunderScript(): void {
  if (typeof document === 'undefined') return;
  const existing = document.querySelectorAll('script[data-asbily-popunder="true"]');
  existing.forEach((node) => node.remove());

  scriptLoaded = false;
  const script = document.createElement('script');
  script.src = POPUNDER_SCRIPT_URL;
  script.async = true;
  script.setAttribute('data-asbily-popunder', 'true');
  script.onload = () => {
    scriptLoaded = true;
  };
  script.onerror = () => {
    scriptLoaded = false;
  };
  (document.head || document.body || document.documentElement).appendChild(script);
}

function scheduleNextArm(): void {
  if (typeof window === 'undefined') return;
  if (rearmTimer !== null) {
    window.clearTimeout(rearmTimer);
    rearmTimer = null;
  }

  const lastAt = readLastShownAt();
  if (!lastAt) return;

  const elapsed = Date.now() - lastAt;
  const remaining = Math.max(1000, POPUNDER_INTERVAL_MS - elapsed);

  rearmTimer = window.setTimeout(() => {
    rearmTimer = null;
    checkAndArmPopunder();
  }, remaining);
}

export function checkAndArmPopunder(): void {
  if (typeof window === 'undefined') return;
  if (armed) return;

  if (isPopunderDue()) {
    armed = true;
    injectPopunderScript();
  } else {
    scheduleNextArm();
  }
}

export function initPopunderSchedule(): () => void {
  if (typeof window === 'undefined' || initialized) {
    return () => {};
  }
  initialized = true;

  // Guard programmatic window.open calls during the 20-minute cooldown window
  const originalWindowOpen = window.open.bind(window);
  window.open = ((...args: Parameters<typeof window.open>) => {
    const now = Date.now();
    if (now <= graceUntil || isPopunderDue(now)) {
      writeLastShownAt(now);
      armed = false;
      scheduleNextArm();
      try {
        return originalWindowOpen(...args);
      } catch {
        return null;
      }
    }
    return null;
  }) as typeof window.open;

  const handleUserInteraction = () => {
    const now = Date.now();
    // Only disarm & start the 20-minute cooldown after the Adsterra script has actually loaded
    if (armed && scriptLoaded && isPopunderDue(now)) {
      graceUntil = now + GRACE_WINDOW_MS;
      armed = false;
      writeLastShownAt(now);
      scheduleNextArm();
    } else if (!armed && isPopunderDue(now)) {
      checkAndArmPopunder();
    }
  };

  const handleVisibility = () => {
    if (document.visibilityState === 'visible') {
      checkAndArmPopunder();
    }
  };

  document.addEventListener('pointerdown', handleUserInteraction, { capture: true, passive: true });
  document.addEventListener('click', handleUserInteraction, { capture: true, passive: true });
  document.addEventListener('visibilitychange', handleVisibility);

  checkAndArmPopunder();

  return () => {
    initialized = false;
    window.open = originalWindowOpen;
    document.removeEventListener('pointerdown', handleUserInteraction, { capture: true });
    document.removeEventListener('click', handleUserInteraction, { capture: true });
    document.removeEventListener('visibilitychange', handleVisibility);
    if (rearmTimer !== null) {
      window.clearTimeout(rearmTimer);
      rearmTimer = null;
    }
  };
}
