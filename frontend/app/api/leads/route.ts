import { NextResponse } from 'next/server'
import { leadPayloadSchema } from '@/lib/validation/lead'

/**
 * Temporary stub for POST /api/leads.
 * Will be replaced by the FastAPI backend (routed via Caddy in production,
 * via the BACKEND_URL rewrite in local dev) — see docs/ARCHITECTURE.md.
 * Implements the same contract: 201 accepted / 422 problem details.
 */
export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return problemResponse(400, 'Invalid JSON body')
  }

  const parsed = leadPayloadSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      {
        type: 'urn:simandev:validation-error',
        title: 'Validation failed',
        status: 422,
        errors: parsed.error.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        })),
      },
      { status: 422, headers: { 'Content-Type': 'application/problem+json' } },
    )
  }

  const id = crypto.randomUUID()

  // Spam caught by the honeypot gets a fake success so bots learn nothing.
  if (parsed.data.honeypot) {
    return NextResponse.json({ id, status: 'accepted' }, { status: 201 })
  }

  // Stub: the real backend will persist the lead and send notifications.
  console.log('[lead-stub] accepted lead', { id, name: parsed.data.name })

  return NextResponse.json({ id, status: 'accepted' }, { status: 201 })
}

function problemResponse(status: number, title: string) {
  return NextResponse.json(
    { type: 'about:blank', title, status },
    { status, headers: { 'Content-Type': 'application/problem+json' } },
  )
}
