import dynamic from 'next/dynamic'
import { Mail, Send } from 'lucide-react'
import { Container } from '@/components/site/container'
import { Eyebrow } from '@/components/site/eyebrow'
import { Reveal } from '@/components/site/reveal'
import { CONTACTS, CONTACT_CHANNELS, SECTIONS } from '@/lib/content'

// Below the fold: split the form (react-hook-form + zod) out of the main bundle.
const LeadForm = dynamic(() =>
  import('@/components/sections/lead-form').then((m) => m.LeadForm),
)

export function Contact() {
  return (
    <section id="contact" className="scroll-mt-20 py-20 md:py-28">
      <Container>
        <div className="relative overflow-hidden rounded-4xl border border-border bg-card/40 p-6 md:p-12">
          <div
            className="absolute -bottom-32 -left-24 h-80 w-80 rounded-full brand-gradient opacity-20 blur-4xl"
            aria-hidden
          />
          <div className="relative grid gap-10 lg:grid-cols-2 lg:items-start">
            <Reveal className="flex flex-col gap-6">
              <Eyebrow>{SECTIONS.contact.eyebrow}</Eyebrow>
              <h2 className="font-display text-3xl font-bold tracking-tight text-balance sm:text-4xl md:text-5xl">
                {SECTIONS.contact.title}
              </h2>
              <p className="max-w-md text-base leading-relaxed text-muted-foreground text-pretty md:text-lg">
                {SECTIONS.contact.description}
              </p>

              <ul className="flex flex-col gap-3">
                <li>
                  <a
                    href={CONTACTS.telegramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-4 rounded-2xl border border-border bg-background/40 p-4 transition-colors hover:border-primary/50"
                  >
                    <span className="inline-flex size-11 items-center justify-center rounded-xl brand-gradient text-white">
                      <Send className="size-5" aria-hidden />
                    </span>
                    <span>
                      <span className="block text-sm text-muted-foreground">
                        {CONTACT_CHANNELS.telegram}
                      </span>
                      <span className="font-semibold">{CONTACTS.telegram}</span>
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${CONTACTS.email}`}
                    className="group flex items-center gap-4 rounded-2xl border border-border bg-background/40 p-4 transition-colors hover:border-primary/50"
                  >
                    <span className="inline-flex size-11 items-center justify-center rounded-xl bg-secondary text-brand-cyan">
                      <Mail className="size-5" aria-hidden />
                    </span>
                    <span>
                      <span className="block text-sm text-muted-foreground">
                        {CONTACT_CHANNELS.email}
                      </span>
                      <span className="font-semibold break-all">
                        {CONTACTS.email}
                      </span>
                    </span>
                  </a>
                </li>
              </ul>
            </Reveal>

            <Reveal delay={120}>
              <LeadForm />
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  )
}
