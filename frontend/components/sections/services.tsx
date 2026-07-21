import { Check } from 'lucide-react'
import { Container } from '@/components/site/container'
import { SectionHeading } from '@/components/site/section-heading'
import { Reveal } from '@/components/site/reveal'
import { SECTIONS, SERVICES } from '@/lib/content'

export function Services() {
  return (
    <section id="services" className="scroll-mt-20 py-20 md:py-28">
      <Container>
        <SectionHeading {...SECTIONS.services} />

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service, i) => {
            const Icon = service.icon
            return (
              <Reveal
                as="li"
                key={service.title}
                delay={(i % 3) * 90}
                className="group flex h-full flex-col rounded-3xl border border-border bg-card/60 p-6 transition-colors hover:border-primary/50"
              >
                <span className="inline-flex size-12 items-center justify-center rounded-2xl brand-gradient text-white">
                  <Icon className="size-6" aria-hidden />
                </span>
                <h3 className="mt-5 text-xl font-semibold">{service.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {service.description}
                </p>
                <ul className="mt-5 flex flex-col gap-2 border-t border-border pt-5">
                  {service.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <Check className="size-4 shrink-0 text-brand-cyan" aria-hidden />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            )
          })}
        </ul>
      </Container>
    </section>
  )
}
