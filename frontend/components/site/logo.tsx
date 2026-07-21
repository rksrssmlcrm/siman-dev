import Image from 'next/image'
import { cn } from '@/lib/utils'

export function Logo({
  className,
  href = '#top',
}: {
  className?: string
  href?: string
}) {
  return (
    <a
      href={href}
      className={cn(
        'inline-flex items-center gap-2.5 rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-ring/50',
        className,
      )}
      aria-label="SimanDev — на главную"
    >
      <span className="relative inline-flex size-9 items-center justify-center overflow-hidden rounded-xl bg-white">
        <Image
          src="/simandev-logo.webp"
          alt=""
          fill
          sizes="36px"
          className="object-cover"
          priority
        />
      </span>
      <span className="text-lg font-semibold tracking-tight">
        Siman<span className="brand-text font-bold">Dev</span>
      </span>
    </a>
  )
}
