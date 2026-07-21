import { Container } from '@/components/site/container'
import { SectionHeading } from '@/components/site/section-heading'
import { Reveal } from '@/components/site/reveal'
import { PROCESS_STEPS, SECTIONS } from '@/lib/content'

export function Process() {
  return (
    <section id="process" className="scroll-mt-20 py-20 md:py-28">
      <Container>
        <SectionHeading {...SECTIONS.process} />

        <ol className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {PROCESS_STEPS.map((step, i) => {
            const Icon = step.icon
            return (
              <Reveal
                as="li"
                key={step.step}
                delay={(i % 4) * 90}
                className="relative flex h-full flex-col rounded-3xl border border-border bg-card/60 p-6"
              >
                <span className="font-display text-5xl font-black text-secondary">
                  {step.step}
                </span>
                <span className="mt-4 inline-flex size-11 items-center justify-center rounded-2xl brand-gradient text-white">
                  <Icon className="size-5" aria-hidden />
                </span>
                <h3 className="mt-4 text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </Reveal>
            )
          })}
        </ol>
      </Container>
    </section>
  )
}
