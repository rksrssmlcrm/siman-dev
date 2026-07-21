/** Cookie consent preferences stored in the `consent_prefs` cookie. */

export type ConsentPrefs = {
  necessary: true
  analytics: boolean
  updatedAt: number
}

export const CONSENT_COOKIE_NAME = 'consent_prefs'
/** 12 months in seconds */
export const CONSENT_MAX_AGE = 60 * 60 * 24 * 365

export function parseConsentCookie(raw: string): ConsentPrefs | null {
  try {
    const parsed = JSON.parse(decodeURIComponent(raw)) as Partial<ConsentPrefs>
    if (parsed.necessary !== true || typeof parsed.analytics !== 'boolean') return null
    if (typeof parsed.updatedAt !== 'number') return null
    return { necessary: true, analytics: parsed.analytics, updatedAt: parsed.updatedAt }
  } catch {
    return null
  }
}

export function serializeConsentCookie(prefs: ConsentPrefs): string {
  return encodeURIComponent(JSON.stringify(prefs))
}

export function readConsentCookie(): ConsentPrefs | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${CONSENT_COOKIE_NAME}=`))
  if (!match) return null
  return parseConsentCookie(match.slice(CONSENT_COOKIE_NAME.length + 1))
}

export function writeConsentCookie(prefs: ConsentPrefs): void {
  const secure = typeof window !== 'undefined' && window.location.protocol === 'https:'
  const parts = [
    `${CONSENT_COOKIE_NAME}=${serializeConsentCookie(prefs)}`,
    `Max-Age=${CONSENT_MAX_AGE}`,
    'Path=/',
    'SameSite=Lax',
  ]
  if (secure) parts.push('Secure')
  document.cookie = parts.join('; ')
}

export function createConsentPrefs(analytics: boolean): ConsentPrefs {
  return { necessary: true, analytics, updatedAt: Date.now() }
}
