import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import { Container } from '@/components/site/container'
import { SectionHeading } from '@/components/site/section-heading'
import { Reveal } from '@/components/site/reveal'
import { SECTIONS, WORKS } from '@/lib/content'

export function Works() {
  return (
    <section id="works" className="scroll-mt-20 py-20 md:py-28">
      <Container>
        <SectionHeading {...SECTIONS.works} />

        <ul className="mt-12 grid gap-6 sm:grid-cols-2">
          {WORKS.map((work, i) => (
            <Reveal
              as="li"
              key={work.title}
              delay={(i % 2) * 100}
              className="group overflow-hidden rounded-3xl border border-border bg-card/60"
            >
              <div className="relative aspect-16/10 overflow-hidden">
                <Image
                  src={work.image || '/placeholder.svg'}
                  alt={`Проект «${work.title}» — ${work.category}`}
                  fill
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent"
                  aria-hidden
                />
              </div>

              <div className="flex items-start justify-between gap-4 p-6">
                <div>
                  <div className="flex flex-wrap gap-2">
                    {work.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-border bg-secondary px-2.5 py-1 text-xs text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="mt-3 text-xl font-semibold">{work.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {work.category}
                  </p>
                </div>
                <span
                  className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors group-hover:border-primary group-hover:text-foreground"
                  aria-hidden
                >
                  <ArrowUpRight className="size-5" />
                </span>
              </div>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  )
}
