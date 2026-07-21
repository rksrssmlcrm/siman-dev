import { cn } from '@/lib/utils'
import { Eyebrow } from '@/components/site/eyebrow'
import { Reveal } from '@/components/site/reveal'

type SectionHeadingProps = {
  eyebrow: string
  title: string
  description?: string
  align?: 'left' | 'center'
  className?: string
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  className,
}: SectionHeadingProps) {
  return (
    <Reveal
      className={cn(
        'flex max-w-2xl flex-col gap-4',
        align === 'center' && 'mx-auto items-center text-center',
        className,
      )}
    >
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="font-display text-3xl font-bold tracking-tight text-balance sm:text-4xl md:text-5xl">
        {title}
      </h2>
      {description ? (
        <p className="text-base leading-relaxed text-muted-foreground text-pretty md:text-lg">
          {description}
        </p>
      ) : null}
    </Reveal>
  )
}
