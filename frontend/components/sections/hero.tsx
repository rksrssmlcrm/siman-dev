import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/site/container'
import { HERO, STATS, WORKS } from '@/lib/content'

type FloatCard = {
  work: (typeof WORKS)[number]
  className: string
  rotate: string
  delay: string
}

const FLOAT_CARDS: FloatCard[] = [
  {
    work: WORKS[0],
    className: 'left-0 top-24 w-52 xl:w-60',
    rotate: '-8deg',
    delay: '0s',
  },
  {
    work: WORKS[1],
    className: 'right-0 top-16 w-52 xl:w-64',
    rotate: '7deg',
    delay: '1.2s',
  },
  {
    work: WORKS[2],
    className: 'bottom-8 left-4 w-48 xl:w-56',
    rotate: '6deg',
    delay: '0.6s',
  },
  {
    work: WORKS[3],
    className: 'bottom-4 right-2 w-52 xl:w-60',
    rotate: '-6deg',
    delay: '1.8s',
  },
]

function FloatingCard({ work, className, rotate, delay }: FloatCard) {
  return (
    <figure
      className={`float-slow pointer-events-none absolute z-0 overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-black/40 ${className}`}
      style={{ ['--tw-rotate' as string]: rotate, rotate, animationDelay: delay }}
      aria-hidden
    >
      <Image
        src={work.image || '/placeholder.svg'}
        alt=""
        width={320}
        height={200}
        className="h-auto w-full object-cover"
      />
      <figcaption className="border-t border-border bg-card px-3 py-2">
        <p className="text-sm font-semibold">{work.title}</p>
        <p className="text-xs text-muted-foreground">{work.category}</p>
      </figcaption>
    </figure>
  )
}

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-28 pb-16 md:pt-36 md:pb-24">
      <div className="grid-bg absolute inset-0 -z-10 opacity-60" aria-hidden />
      <div
        className="absolute -top-40 left-1/2 -z-10 h-96 w-2xl -translate-x-1/2 rounded-full brand-gradient opacity-20 blur-4xl"
        aria-hidden
      />

      <Container className="relative">
        <div className="relative">
          {/* Scattered portfolio previews (desktop only) */}
          <div className="pointer-events-none absolute inset-0 hidden lg:block">
            {FLOAT_CARDS.map((card) => (
              <FloatingCard key={card.work.title} {...card} />
            ))}
          </div>

          <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center reveal">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-4 py-2 text-sm font-medium text-muted-foreground backdrop-blur">
              <span className="size-2 rounded-full brand-gradient" aria-hidden />
              {HERO.badge}
            </span>

            <h1 className="mt-6 font-display text-5xl leading-[0.95] font-black tracking-tight text-balance sm:text-6xl md:text-7xl lg:text-8xl">
              <span className="block">{HERO.titleLines[0]}</span>
              <span className="brand-text block">{HERO.titleLines[1]}</span>
              <span className="brand-text block">{HERO.titleLines[2]}</span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground text-pretty md:text-lg">
              {HERO.description}
            </p>

            <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
              <Button
                size="lg"
                render={
                  <a href="#contact">
                    {HERO.primaryCta}
                    <ArrowRight className="size-4" />
                  </a>
                }
                className="brand-gradient h-12 rounded-full px-7 text-base font-semibold text-white hover:opacity-90"
              />
              <Button
                size="lg"
                variant="outline"
                render={<a href="#works">{HERO.secondaryCta}</a>}
                className="h-12 rounded-full border-border bg-card/50 px-7 text-base font-semibold backdrop-blur hover:bg-card"
              />
            </div>
          </div>
        </div>

        <dl className="reveal mt-16 grid grid-cols-2 gap-4 md:mt-24 md:grid-cols-4 md:gap-6">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-border bg-card/60 p-5 text-center backdrop-blur md:text-left"
            >
              <dt className="sr-only">{stat.label}</dt>
              <dd className="font-display text-3xl font-bold md:text-4xl">
                <span className="brand-text">{stat.value}</span>
              </dd>
              <dd className="mt-1.5 text-sm text-muted-foreground">{stat.label}</dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  )
}
