import { NextResponse } from 'next/server'

// Endpoint sederhana untuk verifikasi bahwa webhook URL bisa diakses oleh Midtrans
export async function GET() {
  return NextResponse.json({ status: 'ok', message: 'Webhook endpoint reachable' }, { status: 200 })
}

export async function POST() {
  return NextResponse.json({ status: 'ok', message: 'Webhook endpoint reachable' }, { status: 200 })
}
