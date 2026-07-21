import { Logo } from '@/components/site/logo'
import { CONTACTS, FOOTER, NAV_ITEMS } from '@/lib/content'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-border">
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-[1.5fr_1fr_1fr]">
          <div className="flex flex-col gap-4">
            <Logo />
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              {FOOTER.description}
            </p>
          </div>

          <nav aria-label={FOOTER.navAria}>
            <h2 className="text-sm font-semibold">{FOOTER.navTitle}</h2>
            <ul className="mt-4 flex flex-col gap-2.5">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-sm font-semibold">{FOOTER.contactsTitle}</h2>
            <ul className="mt-4 flex flex-col gap-2.5 text-sm">
              <li>
                <a
                  href={CONTACTS.telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  {`Telegram ${CONTACTS.telegram}`}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${CONTACTS.email}`}
                  className="break-all text-muted-foreground transition-colors hover:text-foreground"
                >
                  {CONTACTS.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-border pt-6 text-sm text-muted-foreground sm:flex-row sm:items-center">
          <p>
            © {year} {CONTACTS.brand}. {FOOTER.rights}
          </p>
          <a
            href="/privacy"
            className="transition-colors hover:text-foreground"
          >
            {FOOTER.privacyLink}
          </a>
        </div>
      </div>
    </footer>
  )
}
