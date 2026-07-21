'use client'

import { useConsent } from '@/components/site/consent-provider'
import { FOOTER } from '@/lib/content'

export function CookieSettingsButton() {
  const { openSettings } = useConsent()

  return (
    <button
      type="button"
      onClick={openSettings}
      className="transition-colors hover:text-foreground"
    >
      {FOOTER.cookieSettings}
    </button>
  )
}
