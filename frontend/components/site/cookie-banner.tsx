'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { COOKIE_BANNER } from '@/lib/content'

type CookieBannerProps = {
  configureMode: boolean
  draftAnalytics: boolean
  onDraftAnalyticsChange: (value: boolean) => void
  onAcceptAll: () => void
  onNecessaryOnly: () => void
  onOpenConfigure: () => void
  onSaveConfigure: () => void
  onClose: () => void
}

export function CookieBanner({
  configureMode,
  draftAnalytics,
  onDraftAnalyticsChange,
  onAcceptAll,
  onNecessaryOnly,
  onOpenConfigure,
  onSaveConfigure,
  onClose,
}: CookieBannerProps) {
  return (
    <div
      role="dialog"
      aria-labelledby="cookie-banner-title"
      aria-describedby="cookie-banner-desc"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card/95 p-4 shadow-lg backdrop-blur-sm sm:p-6"
    >
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-4">
        <div>
          <h2 id="cookie-banner-title" className="text-base font-semibold">
            {COOKIE_BANNER.title}
          </h2>
          <p id="cookie-banner-desc" className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {COOKIE_BANNER.description}{' '}
            <Link href="/cookies" className="underline underline-offset-4 hover:text-foreground">
              {COOKIE_BANNER.detailsLink}
            </Link>
            .
          </p>
        </div>

        {configureMode ? (
          <div className="flex flex-col gap-4 rounded-xl border border-border bg-background/60 p-4">
            <div className="flex items-start gap-3 opacity-70">
              <Checkbox id="cookie-necessary" checked disabled className="mt-0.5" />
              <div>
                <Label htmlFor="cookie-necessary" className="font-medium">
                  {COOKIE_BANNER.categories.necessary.title}
                </Label>
                <p className="mt-1 text-sm text-muted-foreground">
                  {COOKIE_BANNER.categories.necessary.description}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Checkbox
                id="cookie-analytics"
                checked={draftAnalytics}
                onCheckedChange={(checked) => onDraftAnalyticsChange(checked === true)}
                className="mt-0.5"
              />
              <div>
                <Label htmlFor="cookie-analytics" className="font-medium">
                  {COOKIE_BANNER.categories.analytics.title}
                </Label>
                <p className="mt-1 text-sm text-muted-foreground">
                  {COOKIE_BANNER.categories.analytics.description}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={onSaveConfigure} className="rounded-full">
                {COOKIE_BANNER.saveSettings}
              </Button>
              <Button variant="outline" onClick={onClose} className="rounded-full">
                {COOKIE_BANNER.cancel}
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <Button onClick={onAcceptAll} className="rounded-full">
              {COOKIE_BANNER.acceptAll}
            </Button>
            <Button variant="outline" onClick={onNecessaryOnly} className="rounded-full">
              {COOKIE_BANNER.necessaryOnly}
            </Button>
            <Button variant="ghost" onClick={onOpenConfigure} className="rounded-full">
              {COOKIE_BANNER.configure}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
