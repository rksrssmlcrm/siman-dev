import { Container } from '@/components/site/container'
import { Reveal } from '@/components/site/reveal'
import { ADVANTAGES, MISSION } from '@/lib/content'

export function Mission() {
  return (
    <section id="mission" className="scroll-mt-20 py-8 md:py-12">
      <Container>
        <Reveal className="relative overflow-hidden rounded-4xl border border-border bg-card/60 p-8 md:p-14">
          {/* blur-[100px] kept as a one-off decorative value (visual parity with the approved v0 design) */}
          <div
            className="absolute -right-24 -top-24 h-72 w-72 rounded-full brand-gradient opacity-20 blur-[100px]"
            aria-hidden
          />
          <div className="relative grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center">
            <div>
              <span className="text-sm font-medium tracking-wide text-brand-cyan uppercase">
                {MISSION.title}
              </span>
              <p className="mt-4 font-display text-2xl leading-snug font-bold text-balance sm:text-3xl md:text-4xl">
                {MISSION.text}
              </p>
            </div>

            <ul className="grid gap-4">
              {ADVANTAGES.map((item) => {
                const Icon = item.icon
                return (
                  <li
                    key={item.title}
                    className="flex items-start gap-4 rounded-2xl border border-border bg-background/40 p-4"
                  >
                    <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-brand-cyan">
                      <Icon className="size-5" aria-hidden />
                    </span>
                    <div>
                      <h3 className="font-semibold">{item.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
