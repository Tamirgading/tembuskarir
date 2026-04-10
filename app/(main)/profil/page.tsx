import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import type { UserRow } from '@/lib/utils'
import { formatDate } from '@/lib/utils'
import { EditNamaForm, UploadAvatarForm, GantiPasswordForm } from '@/components/ui/ProfilForm'

export default async function ProfilPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data } = await supabase
    .from('users')
    .select('full_name, email, plan, plan_expires_at, avatar_url')
    .eq('id', user.id)
    .single()

  const profile = data as Pick<UserRow, 'full_name' | 'email' | 'plan' | 'plan_expires_at' | 'avatar_url'> | null

  const name = profile?.full_name ?? null
  const avatar = profile?.avatar_url ?? null
  const plan = profile?.plan ?? 'free'

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Profil Saya</h1>

      {/* ── Section A: Informasi Profil ── */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
        <h2 className="font-semibold text-gray-900 border-b border-gray-100 pb-3">Informasi Akun</h2>

        {/* Upload avatar */}
        <UploadAvatarForm userId={user.id} initialAvatar={avatar} />

        <hr className="border-gray-100" />

        {/* Edit nama */}
        <EditNamaForm userId={user.id} initialName={name} />

        {/* Email (read-only) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
          <input
            type="email"
            value={user.email ?? ''}
            disabled
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-400 cursor-not-allowed"
          />
          <p className="text-xs text-gray-400 mt-1">Email tidak dapat diubah.</p>
        </div>
      </div>

      {/* ── Section B: Keamanan ── */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="font-semibold text-gray-900 border-b border-gray-100 pb-3">Keamanan</h2>
        <GantiPasswordForm />
      </div>

      {/* ── Section C: Status Langganan ── */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="font-semibold text-gray-900 border-b border-gray-100 pb-3">Status Langganan</h2>

        {plan === 'premium' ? (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 text-amber-700 text-sm font-semibold rounded-full">
                ✦ Premium Aktif
              </span>
              {profile?.plan_expires_at && (
                <span className="text-sm text-gray-500">
                  Hingga {formatDate(profile.plan_expires_at)}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500">
              Nikmati akses tak terbatas ke semua paket soal dan fitur premium.
            </p>
            <Link
              href="/harga"
              className="inline-block px-4 py-2 border border-amber-300 text-amber-700 text-sm font-medium rounded-lg hover:bg-amber-50 transition-colors"
            >
              Perpanjang Langganan
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-600 text-sm font-medium rounded-full">
                Akun Gratis
              </span>
            </div>
            <p className="text-sm text-gray-500">
              Upgrade ke Premium untuk akses semua paket soal tanpa batas.
            </p>
            <Link
              href="/harga"
              className="inline-block px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Upgrade ke Premium →
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
