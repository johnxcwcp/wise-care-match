/**
 * Sends a non-identifying categorical event to the existing GA4 gtag.
 * Never pass free text, clinical answers, or personal data. Fails silently if blocked.
 */
export const trackEvent = (name: string, params: Record<string, string | number | boolean> = {}) => {
  try {
    const gtag = (window as any).gtag;
    if (typeof gtag === "function") gtag("event", name, params);
  } catch {
    /* analytics must never break the quiz */
  }
};
