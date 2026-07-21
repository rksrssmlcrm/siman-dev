import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Logo } from '@/components/site/logo'
import { Footer } from '@/components/site/footer'
import { COOKIES_PAGE, METRIKA_COOKIES, type CookieEntry } from '@/lib/cookies'

export const metadata: Metadata = {
  title: `${COOKIES_PAGE.title} — SimanDev`,
  description: 'Перечень cookie на сайте SimanDev: назначение, срок хранения и категории.',
  robots: { index: true },
}

function CookieTable({ rows }: { rows: CookieEntry[] }) {
  return (
    <div className="mt-4 overflow-x-auto rounded-xl border border-border">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="border-b border-border bg-muted/40">
          <tr>
            <th className="px-4 py-3 font-medium">{COOKIES_PAGE.tableHeaders.name}</th>
            <th className="px-4 py-3 font-medium">{COOKIES_PAGE.tableHeaders.category}</th>
            <th className="px-4 py-3 font-medium">{COOKIES_PAGE.tableHeaders.purpose}</th>
            <th className="px-4 py-3 font-medium">{COOKIES_PAGE.tableHeaders.duration}</th>
            <th className="px-4 py-3 font-medium">{COOKIES_PAGE.tableHeaders.provider}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.name} className="border-b border-border last:border-0">
              <td className="px-4 py-3 font-mono text-xs">{row.name}</td>
              <td className="px-4 py-3 text-muted-foreground">{row.category}</td>
              <td className="px-4 py-3 text-muted-foreground">{row.purpose}</td>
              <td className="px-4 py-3 text-muted-foreground">{row.duration}</td>
              <td className="px-4 py-3 text-muted-foreground">{row.provider}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function CookiesPage() {
  return (
    <>
      <header className="border-b border-border">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Logo href="/" />
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" aria-hidden />
            На главную
          </Link>
        </div>
      </header>

      <main className="py-14 md:py-20">
        <article className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            {COOKIES_PAGE.title}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Обновлено: {COOKIES_PAGE.updatedAt}
          </p>
          <p className="mt-6 leading-relaxed text-muted-foreground">{COOKIES_PAGE.intro}</p>

          <section className="mt-10">
            <h2 className="text-xl font-semibold">Cookie сайта</h2>
            <CookieTable rows={COOKIES_PAGE.cookies} />
          </section>

          <section className="mt-10">
            <h2 className="text-xl font-semibold">Cookie Яндекс.Метрики</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {COOKIES_PAGE.analyticsNote}
            </p>
            <CookieTable rows={METRIKA_COOKIES} />
          </section>

          <p className="mt-10 text-sm text-muted-foreground">{COOKIES_PAGE.manage}</p>

          <p className="mt-6 text-sm text-muted-foreground">
            См. также:{' '}
            <Link href="/privacy" className="underline underline-offset-4 hover:text-foreground">
              Политика обработки персональных данных
            </Link>
            .
          </p>
        </article>
      </main>

      <Footer />
    </>
  )
}
