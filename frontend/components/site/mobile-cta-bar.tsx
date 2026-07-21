'use client'

import { useEffect, useState } from 'react'
import { Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CONTACTS, CTA } from '@/lib/content'
import { cn } from '@/lib/utils'

export function MobileCtaBar() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      className={cn(
        'fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/90 p-3 backdrop-blur-xl transition-transform duration-300 lg:hidden',
        show ? 'translate-y-0' : 'translate-y-full',
      )}
    >
      <div className="flex items-center gap-3">
        <Button
          render={<a href="#contact">{CTA.discuss}</a>}
          className="brand-gradient h-11 flex-1 rounded-full font-semibold text-white hover:opacity-90"
        />
        <Button
          variant="outline"
          size="icon"
          render={
            <a
              href={CONTACTS.telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={CTA.telegramAria}
            >
              <Send className="size-5" />
            </a>
          }
          className="size-11 shrink-0 rounded-full border-border"
        />
      </div>
    </div>
  )
}
