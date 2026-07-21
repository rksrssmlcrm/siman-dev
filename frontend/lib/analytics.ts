/**
 * Yandex Metrika goal tracking — only fires when analytics cookie consent is granted.
 */

import { readConsentCookie } from '@/lib/consent'

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

/** Fire a Yandex Metrika reachGoal event. No-op without analytics consent or Metrika ID. */
export function trackGoal(goal: string, params?: Record<string, unknown>): void {
  if (typeof window === 'undefined') return
  const prefs = readConsentCookie()
  if (!prefs?.analytics) return

  const id = getMetrikaId()
  if (!id || typeof window.ym !== 'function') return
  window.ym(id, 'reachGoal', goal, params)
}
