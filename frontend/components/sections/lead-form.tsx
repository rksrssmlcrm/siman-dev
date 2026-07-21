'use client'

import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle2, Loader2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { FORM } from '@/lib/content'
import {
  formatRuPhone,
  leadFormSchema,
  toLeadPayload,
  type LeadFormValues,
} from '@/lib/validation/lead'

type Status = 'idle' | 'loading' | 'success' | 'error'

export function LeadForm() {
  const [status, setStatus] = useState<Status>('idle')

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: { name: '', phone: '', message: '', honeypot: '' },
  })

  const onSubmit = async (values: LeadFormValues) => {
    if (status === 'loading') return
    setStatus('loading')
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(toLeadPayload(values)),
      })
      if (!res.ok) throw new Error(`Request failed with status ${res.status}`)
      setStatus('success')
      reset()
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div
        className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-border bg-card p-10 text-center"
        role="status"
        aria-live="polite"
      >
        <span className="inline-flex size-14 items-center justify-center rounded-full brand-gradient text-white">
          <CheckCircle2 className="size-7" aria-hidden />
        </span>
        <h3 className="text-2xl font-semibold">{FORM.success.title}</h3>
        <p className="max-w-sm text-muted-foreground">{FORM.success.text}</p>
        <Button
          variant="outline"
          onClick={() => setStatus('idle')}
          className="mt-2 rounded-full"
        >
          {FORM.success.again}
        </Button>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-5 rounded-3xl border border-border bg-card p-6 md:p-8"
    >
      <div className="flex flex-col gap-2">
        <Label htmlFor="lead-name">{FORM.labels.name}</Label>
        <Input
          id="lead-name"
          className="h-11"
          placeholder={FORM.placeholders.name}
          autoComplete="name"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'lead-name-error' : undefined}
          {...register('name')}
        />
        {errors.name ? (
          <p id="lead-name-error" className="text-sm text-destructive">
            {errors.name.message}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="lead-phone">{FORM.labels.phone}</Label>
        <Controller
          control={control}
          name="phone"
          render={({ field }) => (
            <Input
              id="lead-phone"
              type="tel"
              inputMode="tel"
              className="h-11"
              placeholder={FORM.placeholders.phone}
              autoComplete="tel"
              aria-invalid={!!errors.phone}
              aria-describedby={errors.phone ? 'lead-phone-error' : undefined}
              value={field.value}
              onChange={(e) => field.onChange(formatRuPhone(e.target.value))}
              onBlur={field.onBlur}
            />
          )}
        />
        {errors.phone ? (
          <p id="lead-phone-error" className="text-sm text-destructive">
            {errors.phone.message}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="lead-message">{FORM.labels.message}</Label>
        <Textarea
          id="lead-message"
          rows={4}
          placeholder={FORM.placeholders.message}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? 'lead-message-error' : undefined}
          {...register('message')}
        />
        {errors.message ? (
          <p id="lead-message-error" className="text-sm text-destructive">
            {errors.message.message}
          </p>
        ) : null}
      </div>

      {/* Honeypot field — hidden from users */}
      <div className="absolute -left-[9999px]" aria-hidden>
        <label htmlFor="lead-honeypot">{FORM.labels.honeypot}</label>
        <input
          id="lead-honeypot"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register('honeypot')}
        />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-start gap-3">
          <Controller
            control={control}
            name="consent"
            render={({ field }) => (
              <Checkbox
                id="lead-consent"
                className="mt-0.5"
                checked={field.value ?? false}
                onCheckedChange={(checked) => field.onChange(checked === true)}
                aria-invalid={!!errors.consent}
                aria-describedby={errors.consent ? 'lead-consent-error' : undefined}
              />
            )}
          />
          <Label
            htmlFor="lead-consent"
            className="text-sm leading-relaxed font-normal text-muted-foreground"
          >
            {FORM.consent.prefix}{' '}
            <a href="/privacy" className="text-foreground underline underline-offset-4">
              {FORM.consent.linkLabel}
            </a>
            .
          </Label>
        </div>
        {errors.consent ? (
          <p id="lead-consent-error" className="text-sm text-destructive">
            {errors.consent.message}
          </p>
        ) : null}
      </div>

      {status === 'error' ? (
        <p
          className="flex items-center gap-2 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
          role="alert"
        >
          <AlertCircle className="size-4 shrink-0" aria-hidden />
          {FORM.error}
        </p>
      ) : null}

      <Button
        type="submit"
        size="lg"
        disabled={status === 'loading'}
        className="brand-gradient h-12 rounded-full text-base font-semibold text-white hover:opacity-90"
      >
        {status === 'loading' ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden />
            {FORM.submitting}
          </>
        ) : (
          FORM.submit
        )}
      </Button>
    </form>
  )
}
