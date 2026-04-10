import { NextRequest, NextResponse } from 'next/server'
import { sendWelcomeEmail } from '@/lib/resend'

export async function POST(req: NextRequest) {
  try {
    const { email, name } = await req.json() as { email?: string; name?: string }

    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 })
    }

    await sendWelcomeEmail(email, name ?? '')
    return NextResponse.json({ message: 'OK' }, { status: 200 })
  } catch (err) {
    console.error('[Welcome Email] Error:', err)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}
