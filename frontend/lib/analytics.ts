/**
 * Thin wrapper for Yandex Metrika goal tracking.
 *
 * The Metrika script is intentionally loaded with `strategy="afterInteractive"`
 * (see components/site/metrika.tsx), but in a future step it should be deferred
 * until the user grants cookie consent (cookie banner — step 12).
 *
 * TODO(step-12): move `ym('init', ...)` call inside an `onConsentGranted`
 * callback so the tracker initialises only after explicit user consent.
 * See docs/ARCHITECTURE.md — "Cookie consent & analytics".
 */

declare global {
  interface Window {
    ym?: (id: number, method: string, ...args: unknown[]) => void
  }
}

const METRIKA_ID = process.env.NEXT_PUBLIC_METRIKA_ID

function getMetrikaId(): number | null {
  if (!METRIKA_ID) return null
  const id = parseInt(METRIKA_ID, 10)
  return isNaN(id) ? null : id
}

/** Fire a Yandex Metrika reachGoal event. No-op if Metrika is not configured. */
export function trackGoal(goal: string, params?: Record<string, unknown>): void {
  const id = getMetrikaId()
  if (!id || typeof window === 'undefined' || typeof window.ym !== 'function') return
  window.ym(id, 'reachGoal', goal, params)
}
