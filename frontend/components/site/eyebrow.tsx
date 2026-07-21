export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-medium tracking-wide text-muted-foreground uppercase">
      <span className="size-1.5 rounded-full brand-gradient" aria-hidden />
      {children}
    </span>
  )
}
