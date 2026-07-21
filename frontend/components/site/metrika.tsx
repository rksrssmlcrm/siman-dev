import Script from 'next/script'

const METRIKA_ID = process.env.NEXT_PUBLIC_METRIKA_ID

/**
 * Yandex Metrika counter.
 * Renders nothing when NEXT_PUBLIC_METRIKA_ID is not set.
 *
 * Analytics & consent:
 * The script currently loads with strategy="afterInteractive" without waiting
 * for explicit cookie consent. This is a temporary state — in step 12 (cookie
 * banner) the init call must be moved inside an `onConsentGranted` callback
 * so tracking only starts after the user accepts.
 *
 * TODO(step-12): wrap `ym(id, 'init', ...)` in onConsentGranted().
 * See docs/ARCHITECTURE.md — "Cookie consent & analytics".
 */
export function Metrika() {
  if (!METRIKA_ID) return null

  return (
    <>
      <Script id="yandex-metrika" strategy="afterInteractive">
        {`
          (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
          m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],
          k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
          (window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js', 'ym');
          ym(${METRIKA_ID}, 'init', {
            clickmap: true,
            trackLinks: true,
            accurateTrackBounce: true,
            webvisor: false
          });
        `}
      </Script>
      <noscript>
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://mc.yandex.ru/watch/${METRIKA_ID}`}
            style={{ position: 'absolute', left: '-9999px' }}
            alt=""
          />
        </div>
      </noscript>
    </>
  )
}
