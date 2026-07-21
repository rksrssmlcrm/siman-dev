'use client'

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from 'react'
import {
  createConsentPrefs,
  readConsentCookie,
  writeConsentCookie,
  type ConsentPrefs,
} from '@/lib/consent'
import { CookieBanner } from '@/components/site/cookie-banner'
import { MetrikaLoader } from '@/components/site/metrika-loader'

type ConsentContextValue = {
  prefs: ConsentPrefs | null
  analyticsAllowed: boolean
  openSettings: () => void
}

const ConsentContext = createContext<ConsentContextValue | null>(null)

const consentListeners = new Set<() => void>()

function subscribeConsent(onChange: () => void): () => void {
  consentListeners.add(onChange)
  return () => consentListeners.delete(onChange)
}

function getConsentSnapshot(): ConsentPrefs | null {
  return readConsentCookie()
}

function notifyConsentChange(): void {
  consentListeners.forEach((listener) => listener())
}

export function useConsent(): ConsentContextValue {
  const ctx = useContext(ConsentContext)
  if (!ctx) {
    throw new Error('useConsent must be used within ConsentProvider')
  }
  return ctx
}

export function ConsentProvider({ children }: { children: ReactNode }) {
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  )
  const prefs = useSyncExternalStore(subscribeConsent, getConsentSnapshot, () => null)

  const [settingsOpen, setSettingsOpen] = useState(false)
  const [configureMode, setConfigureMode] = useState(false)
  const [draftAnalytics, setDraftAnalytics] = useState(false)

  const applyPrefs = useCallback((analytics: boolean) => {
    const next = createConsentPrefs(analytics)
    writeConsentCookie(next)
    notifyConsentChange()
    setSettingsOpen(false)
    setConfigureMode(false)
  }, [])

  const openSettings = useCallback(() => {
    setDraftAnalytics(prefs?.analytics ?? false)
    setConfigureMode(true)
    setSettingsOpen(true)
  }, [prefs])

  const showBanner = mounted && (settingsOpen || prefs === null)

  const value = useMemo(
    () => ({
      prefs,
      analyticsAllowed: prefs?.analytics ?? false,
      openSettings,
    }),
    [prefs, openSettings],
  )

  return (
    <ConsentContext.Provider value={value}>
      {children}
      {mounted && prefs?.analytics ? <MetrikaLoader /> : null}
      {showBanner ? (
        <CookieBanner
          configureMode={configureMode}
          draftAnalytics={draftAnalytics}
          onDraftAnalyticsChange={setDraftAnalytics}
          onAcceptAll={() => applyPrefs(true)}
          onNecessaryOnly={() => applyPrefs(false)}
          onOpenConfigure={() => {
            setConfigureMode(true)
            setDraftAnalytics(prefs?.analytics ?? false)
          }}
          onSaveConfigure={() => applyPrefs(draftAnalytics)}
          onClose={() => {
            setSettingsOpen(false)
            setConfigureMode(false)
          }}
        />
      ) : null}
    </ConsentContext.Provider>
  )
}
