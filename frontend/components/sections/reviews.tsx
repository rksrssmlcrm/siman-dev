import { Quote, Star } from 'lucide-react'
import { Container } from '@/components/site/container'
import { SectionHeading } from '@/components/site/section-heading'
import { Reveal } from '@/components/site/reveal'
import { REVIEWS, REVIEWS_LABELS, SECTIONS } from '@/lib/content'

export function Reviews() {
  return (
    <section id="reviews" className="scroll-mt-20 py-20 md:py-28">
      <Container>
        <SectionHeading {...SECTIONS.reviews} />

        <ul className="mt-12 grid gap-6 md:grid-cols-2">
          {REVIEWS.map((review, i) => (
            <Reveal
              as="li"
              key={review.name}
              delay={(i % 2) * 100}
              className="flex h-full flex-col rounded-3xl border border-border bg-card/60 p-7"
            >
              <div className="flex items-center justify-between">
                <Quote className="size-8 text-brand-blue" aria-hidden />
                <div className="flex gap-0.5" aria-label={REVIEWS_LABELS.ratingAria}>
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star
                      key={s}
                      className="size-4 fill-brand-cyan text-brand-cyan"
                      aria-hidden
                    />
                  ))}
                </div>
              </div>
              <p className="mt-5 flex-1 text-base leading-relaxed text-pretty">
                {review.text}
              </p>
              <div className="mt-6 flex items-center gap-3 border-t border-border pt-5">
                <span
                  className="inline-flex size-11 items-center justify-center rounded-full brand-gradient text-sm font-bold text-white"
                  aria-hidden
                >
                  {review.initials}
                </span>
                <div>
                  <p className="font-semibold">{review.name}</p>
                  <p className="text-sm text-muted-foreground">{review.role}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  )
}
