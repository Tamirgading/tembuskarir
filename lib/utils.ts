import type { Database } from '@/types/database'

// Row type shortcuts
export type UserRow = Database['public']['Tables']['users']['Row']
export type PackageRow = Database['public']['Tables']['packages']['Row']
export type QuestionRow = Database['public']['Tables']['questions']['Row']
export type AttemptRow = Database['public']['Tables']['attempts']['Row']
export type SubscriptionRow = Database['public']['Tables']['subscriptions']['Row']

export function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

export function formatRupiah(amount: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount)
}
