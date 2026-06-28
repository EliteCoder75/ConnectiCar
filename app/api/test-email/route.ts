import { NextResponse } from 'next/server'
import { Resend } from 'resend'

export async function GET() {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev'
  const to = process.env.RESEND_ADMIN_EMAIL ?? 'bachirguedouda@gmail.com'

  if (!apiKey) {
    return NextResponse.json({ error: 'RESEND_API_KEY is missing' }, { status: 500 })
  }

  const resend = new Resend(apiKey)

  const { data, error } = await resend.emails.send({
    from,
    to,
    subject: 'Test ConnectiCAR — Email fonctionne !',
    html: '<h1>Bravo !</h1><p>Les emails fonctionnent correctement.</p>',
  })

  if (error) {
    return NextResponse.json({ error, from, to, keyPrefix: apiKey.slice(0, 12) + '...' }, { status: 500 })
  }

  return NextResponse.json({ success: true, data, from, to })
}
