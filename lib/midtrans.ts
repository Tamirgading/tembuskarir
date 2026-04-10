// lib/midtrans.ts
// Midtrans Snap API integration — server-side only

const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY!
const MIDTRANS_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://app.midtrans.com/snap/v1'
  : 'https://app.sandbox.midtrans.com/snap/v1'

const MIDTRANS_API_BASE = process.env.NODE_ENV === 'production'
  ? 'https://api.midtrans.com/v2'
  : 'https://api.sandbox.midtrans.com/v2'

function getAuthHeader() {
  const encoded = Buffer.from(`${MIDTRANS_SERVER_KEY}:`).toString('base64')
  return `Basic ${encoded}`
}

export interface SnapTransactionParams {
  orderId: string
  amount: number
  customerName: string
  customerEmail: string
  planType: 'monthly' | 'yearly'
}

export interface SnapResponse {
  token: string
  redirect_url: string
}

/**
 * Buat Snap transaction token untuk pembayaran
 */
export async function createSnapTransaction(params: SnapTransactionParams): Promise<SnapResponse> {
  const { orderId, amount, customerName, customerEmail, planType } = params

  const body = {
    transaction_details: {
      order_id: orderId,
      gross_amount: amount,
    },
    customer_details: {
      first_name: customerName,
      email: customerEmail,
    },
    item_details: [
      {
        id: `premium-${planType}`,
        price: amount,
        quantity: 1,
        name: planType === 'monthly' ? 'Premium Monthly' : 'Premium Yearly',
      },
    ],
    callbacks: {
      finish: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=success`,
      error: `${process.env.NEXT_PUBLIC_APP_URL}/harga?payment=error`,
      pending: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=pending`,
    },
  }

  const response = await fetch(`${MIDTRANS_BASE_URL}/transactions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: getAuthHeader(),
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`Midtrans error: ${err}`)
  }

  return response.json() as Promise<SnapResponse>
}

/**
 * Verifikasi signature webhook dari Midtrans
 * Format: SHA512(order_id + status_code + gross_amount + server_key)
 */
export async function verifyMidtransSignature(
  orderId: string,
  statusCode: string,
  grossAmount: string,
  incomingSignature: string
): Promise<boolean> {
  const raw = `${orderId}${statusCode}${grossAmount}${MIDTRANS_SERVER_KEY}`

  // Web Crypto API (tersedia di Edge & Node 18+)
  const encoder = new TextEncoder()
  const data = encoder.encode(raw)
  const hashBuffer = await crypto.subtle.digest('SHA-512', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')

  return hashHex === incomingSignature
}

/**
 * Ambil status transaksi dari Midtrans (untuk double-check saat webhook)
 */
export async function getTransactionStatus(orderId: string): Promise<{
  transaction_status: string
  fraud_status: string
  payment_type: string
}> {
  const response = await fetch(`${MIDTRANS_API_BASE}/${orderId}/status`, {
    headers: { Authorization: getAuthHeader() },
  })

  if (!response.ok) {
    throw new Error(`Midtrans status check error: ${response.statusText}`)
  }

  return response.json()
}
