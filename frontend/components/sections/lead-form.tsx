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
import { CONTACTS, FORM } from '@/lib/content'
import { trackGoal } from '@/lib/analytics'
import {
  formatRuPhone,
  leadFormSchema,
  toLeadPayload,
  type LeadFormValues,
} from '@/lib/validation/lead'

type Status = 'idle' | 'loading' | 'success' | 'rate_limited' | 'server_error' | 'error'

/** RFC 9457 validation error item returned by the backend on 422. */
type ApiFieldError = { field: string; message: string }

async function submitLead(values: LeadFormValues): Promise<{
  ok: boolean
  status: number
  fieldErrors: ApiFieldError[]
}> {
  const res = await fetch('/api/leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(toLeadPayload(values)),
  })

  if (res.ok) return { ok: true, status: res.status, fieldErrors: [] }

  let fieldErrors: ApiFieldError[] = []
  try {
    const body = await res.json()
    if (res.status === 422 && Array.isArray(body?.errors)) {
      fieldErrors = body.errors
    }
  } catch {
    // ignore parse failure — treated as generic error below
  }

  return { ok: false, status: res.status, fieldErrors }
}

export function LeadForm() {
  const [status, setStatus] = useState<Status>('idle')
  const [consentChecked, setConsentChecked] = useState(false)

  const {
    register,
    handleSubmit,
    control,
    reset,
    setError,
    formState: { errors },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: { name: '', phone: '', message: '', honeypot: '' },
  })

  const resetForm = () => {
    reset()
    setConsentChecked(false)
  }

  const onSubmit = async (values: LeadFormValues) => {
    if (status === 'loading') return
    setStatus('loading')

    const { ok, status: httpStatus, fieldErrors } = await submitLead(values)

    if (ok) {
      setStatus('success')
      resetForm()
      trackGoal('lead_submit')
      return
    }

    if (httpStatus === 429) {
      setStatus('rate_limited')
      return
    }

    // Set backend field validation errors into the form
    if (httpStatus === 422 && fieldErrors.length > 0) {
      for (const fe of fieldErrors) {
        const field = fe.field as keyof LeadFormValues
        if (field === 'name' || field === 'phone' || field === 'message' || field === 'consent') {
          setError(field, { message: fe.message })
        }
      }
      setStatus('idle')
      return
    }

    setStatus(httpStatus >= 500 ? 'server_error' : 'error')
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

  const errorMessage =
    status === 'rate_limited'
      ? FORM.errorRateLimit
      : status === 'server_error'
        ? FORM.errorServer
        : status === 'error'
          ? FORM.errorGeneric
          : null

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

      {/* Honeypot — hidden from real users */}
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
                onCheckedChange={(checked) => {
                  const value = checked === true
                  field.onChange(value)
                  setConsentChecked(value)
                }}
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

      {errorMessage ? (
        <div
          className="flex items-start gap-2 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
          role="alert"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
          <span>
            {errorMessage}
            {(status === 'server_error' || status === 'error') ? (
              <>
                {' '}
                <a
                  href={CONTACTS.telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-4"
                >
                  {CONTACTS.telegram}
                </a>
              </>
            ) : null}
          </span>
        </div>
      ) : null}

      <Button
        type="submit"
        size="lg"
        disabled={status === 'loading' || !consentChecked}
        className="brand-gradient h-12 rounded-full text-base font-semibold text-white hover:opacity-90 disabled:opacity-50"
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
