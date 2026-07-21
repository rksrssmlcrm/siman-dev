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

/** Cached snapshot so useSyncExternalStore does not see a new object every read. */
let cachedRaw: string | null | undefined
let cachedPrefs: ConsentPrefs | null = null

function readRawConsentCookie(): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${CONSENT_COOKIE_NAME}=`))
  if (!match) return null
  return match.slice(CONSENT_COOKIE_NAME.length + 1)
}

export function readConsentCookie(): ConsentPrefs | null {
  const raw = readRawConsentCookie()
  if (raw === cachedRaw) return cachedPrefs
  cachedRaw = raw
  cachedPrefs = raw ? parseConsentCookie(raw) : null
  return cachedPrefs
}

/** Invalidate cache after writing the cookie (same raw string would otherwise stale). */
export function writeConsentCookie(prefs: ConsentPrefs): void {
  const secure = typeof window !== 'undefined' && window.location.protocol === 'https:'
  const serialized = serializeConsentCookie(prefs)
  const parts = [
    `${CONSENT_COOKIE_NAME}=${serialized}`,
    `Max-Age=${CONSENT_MAX_AGE}`,
    'Path=/',
    'SameSite=Lax',
  ]
  if (secure) parts.push('Secure')
  document.cookie = parts.join('; ')
  cachedRaw = serialized
  cachedPrefs = prefs
}

export function createConsentPrefs(analytics: boolean): ConsentPrefs {
  return { necessary: true, analytics, updatedAt: Date.now() }
}
