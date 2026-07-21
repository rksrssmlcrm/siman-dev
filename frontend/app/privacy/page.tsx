import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Logo } from '@/components/site/logo'
import { Footer } from '@/components/site/footer'
import { PRIVACY } from '@/lib/privacy'

export const metadata: Metadata = {
  title: `${PRIVACY.title} — SimanDev`,
  description:
    'Как SimanDev обрабатывает персональные данные из формы заявки: состав данных, цели, сроки хранения и ваши права.',
  robots: { index: false },
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
          <h1 className="font-display text-3xl font-bold tracking-tight text-balance sm:text-4xl">
            {PRIVACY.title}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Обновлено: {PRIVACY.updatedAt}
          </p>
          <p className="mt-6 leading-relaxed text-muted-foreground">
            {PRIVACY.intro}
          </p>

          {PRIVACY.sections.map((section) => (
            <section key={section.title} className="mt-10">
              <h2 className="text-xl font-semibold">{section.title}</h2>
              {section.paragraphs.map((paragraph) => (
                <p
                  key={paragraph}
                  className="mt-3 leading-relaxed text-muted-foreground"
                >
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </article>
      </main>

      <Footer />
    </>
  )
}
