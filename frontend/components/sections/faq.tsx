import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Container } from '@/components/site/container'
import { SectionHeading } from '@/components/site/section-heading'
import { Reveal } from '@/components/site/reveal'
import { FAQ as FAQ_ITEMS, SECTIONS } from '@/lib/content'

export function Faq() {
  return (
    <section id="faq" className="scroll-mt-20 py-20 md:py-28">
      <Container className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <SectionHeading {...SECTIONS.faq} />

        <Reveal>
          <Accordion
            multiple={false}
            defaultValue={[0]}
            className="rounded-3xl border border-border bg-card/60 px-6"
          >
            {FAQ_ITEMS.map((item, i) => (
              <AccordionItem key={item.question} value={i}>
                <AccordionTrigger className="py-5 text-base font-semibold">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                  <p>{item.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </Container>
    </section>
  )
}
