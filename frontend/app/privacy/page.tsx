import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Logo } from '@/components/site/logo'
import { Footer } from '@/components/site/footer'
import { PRIVACY, type PrivacyBlock } from '@/lib/privacy'

export const metadata: Metadata = {
  title: `${PRIVACY.title} — SimanDev`,
  description:
    'Политика обработки персональных данных SimanDev: состав данных, цели, сроки хранения, права субъекта и передача третьим лицам.',
  robots: { index: true },
}

function PrivacyBlockView({ block }: { block: PrivacyBlock }) {
  switch (block.type) {
    case 'paragraph':
      return <p className="mt-3 leading-relaxed text-muted-foreground">{block.text}</p>
    case 'subheading':
      return <h3 className="mt-5 text-base font-medium">{block.text}</h3>
    case 'list':
      return (
        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-muted-foreground">
          {block.items.map((item) => (
            <li key={item} className="leading-relaxed">
              {item}
            </li>
          ))}
        </ul>
      )
  }
}

export default function PrivacyPage() {
  return (
    <>
      <header className="border-b border-border">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Logo href="/" />
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <ArrowLeft className="size-4" aria-hidden />
            На главную
          </Link>
        </div>
      </header>

      <main className="py-14 md:py-20">
        <article className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8">
          {/* Draft — требует проверки юристом */}
          <p className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100/90">
            {PRIVACY.draftNotice}
          </p>

          <h1 className="mt-8 font-display text-3xl font-bold tracking-tight text-balance sm:text-4xl">
            {PRIVACY.title}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Обновлено: {PRIVACY.updatedAt}
          </p>
          <p className="mt-6 leading-relaxed text-muted-foreground">{PRIVACY.intro}</p>

          {PRIVACY.sections.map((section) => (
            <section key={section.title} className="mt-10">
              <h2 className="text-xl font-semibold">{section.title}</h2>
              {section.blocks.map((block, i) => (
                <PrivacyBlockView key={`${section.title}-${i}`} block={block} />
              ))}
            </section>
          ))}

          <p className="mt-10 text-sm text-muted-foreground">
            См. также:{' '}
            <Link href="/cookies" className="underline underline-offset-4 hover:text-foreground">
              Политика cookie
            </Link>
            .
          </p>
        </article>
      </main>

      <Footer />
    </>
  )
}
