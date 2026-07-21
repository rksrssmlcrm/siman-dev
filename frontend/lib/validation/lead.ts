import { z } from 'zod'

/**
 * Contract for POST /api/leads (see docs/ARCHITECTURE.md, section 3).
 * The same shape is validated by Pydantic on the FastAPI side —
 * change both together.
 */
export const leadPayloadSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Укажите имя')
    .max(100, 'Слишком длинное имя'),
  phone: z
    .string()
    .regex(/^\+7\d{10}$/, 'Телефон должен быть в формате +7XXXXXXXXXX'),
  message: z.string().max(1000, 'Сообщение слишком длинное').optional(),
  consent: z.literal(true, {
    message: 'Необходимо согласие на обработку данных',
  }),
  // Honeypot — humans never fill it. Deliberately unconstrained here: a filled
  // value must NOT fail validation (bots would learn about the trap from 422);
  // the handler silently drops such requests instead.
  honeypot: z.string().optional(),
})

export type LeadPayload = z.infer<typeof leadPayloadSchema>

/** Client-side schema for the form fields (phone is masked while typing). */
export const leadFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Укажите имя (минимум 2 символа)')
    .max(100, 'Слишком длинное имя'),
  phone: z
    .string()
    .regex(
      /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/,
      'Введите телефон в формате +7 (999) 999-99-99',
    ),
  message: z.string().max(1000, 'Сообщение слишком длинное').optional(),
  consent: z.literal(true, {
    message: 'Необходимо согласие на обработку данных',
  }),
  honeypot: z.string().max(0).optional(),
})

export type LeadFormValues = z.infer<typeof leadFormSchema>

/** Formats raw input into the `+7 (999) 999-99-99` mask while typing. */
export function formatRuPhone(value: string): string {
  const digits = value.replace(/\D/g, '')
  let d = digits
  if (d.startsWith('8')) d = '7' + d.slice(1)
  if (!d.startsWith('7')) d = '7' + d
  d = d.slice(0, 11)

  const rest = d.slice(1)
  let out = '+7'
  if (rest.length > 0) out += ' (' + rest.slice(0, 3)
  if (rest.length >= 3) out += ')'
  if (rest.length > 3) out += ' ' + rest.slice(3, 6)
  if (rest.length > 6) out += '-' + rest.slice(6, 8)
  if (rest.length > 8) out += '-' + rest.slice(8, 10)
  return out
}

/** Converts validated form values to the API payload (phone → E.164). */
export function toLeadPayload(values: LeadFormValues): LeadPayload {
  return {
    name: values.name.trim(),
    phone: `+${values.phone.replace(/\D/g, '')}`,
    message: values.message?.trim() || undefined,
    consent: values.consent,
    honeypot: values.honeypot ?? '',
  }
}
