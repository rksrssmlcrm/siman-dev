import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/site/container'
import { SectionHeading } from '@/components/site/section-heading'
import { Reveal } from '@/components/site/reveal'
import { PLANS, PRICING_LABELS, SECTIONS } from '@/lib/content'
import { cn } from '@/lib/utils'

export function Pricing() {
  return (
    <section id="pricing" className="scroll-mt-20 py-20 md:py-28">
      <Container>
        <SectionHeading {...SECTIONS.pricing} />

        <ul className="mt-12 grid gap-6 lg:grid-cols-3">
          {PLANS.map((plan, i) => (
            <Reveal
              as="li"
              key={plan.name}
              delay={i * 90}
              className={cn(
                'relative flex h-full flex-col rounded-3xl border p-7',
                plan.highlighted
                  ? 'border-primary/60 bg-card'
                  : 'border-border bg-card/60',
              )}
            >
              {plan.highlighted ? (
                <span className="brand-gradient absolute -top-3 left-7 rounded-full px-3 py-1 text-xs font-semibold text-white">
                  {PRICING_LABELS.popular}
                </span>
              ) : null}

              <h3 className="text-lg font-semibold">{plan.name}</h3>
              <p className="mt-3 font-display text-3xl font-bold">{plan.price}</p>
              <p className="mt-1 text-sm text-brand-cyan">
                {PRICING_LABELS.periodPrefix}
                {plan.period}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                {plan.description}
              </p>

              <ul className="mt-6 flex flex-1 flex-col gap-3 border-t border-border pt-6">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <Check className="mt-0.5 size-4 shrink-0 text-brand-cyan" aria-hidden />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <Button
                size="lg"
                render={<a href="#contact">{plan.cta}</a>}
                className={cn(
                  'mt-7 h-11 w-full rounded-full font-semibold',
                  plan.highlighted
                    ? 'brand-gradient text-white hover:opacity-90'
                    : 'border border-border bg-secondary text-foreground hover:bg-secondary/70',
                )}
              />
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  )
}
