'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
interface ProfilFormProps {
  userId: string
  initialName: string | null
  initialAvatar: string | null
  email: string
}

export function EditNamaForm({ userId, initialName }: Pick<ProfilFormProps, 'userId' | 'initialName'>) {
  const router = useRouter()
  const [name, setName] = useState(initialName ?? '')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    setLoading(true)
    setMsg('')

    const supabase = createClient()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from('users') as any)
      .update({ full_name: name.trim() })
      .eq('id', userId)

    if (error) {
      setMsg('Gagal menyimpan nama.')
    } else {
      setMsg('Nama berhasil diperbarui!')
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Nama Lengkap</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Nama lengkap"
        />
      </div>
      {msg && (
        <p className={`text-sm ${msg.startsWith('Gagal') ? 'text-red-600' : 'text-green-600'}`}>{msg}</p>
      )}
      <button
        type="submit"
        disabled={loading || !name.trim()}
        className="px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
      >
        {loading ? 'Menyimpan...' : 'Simpan Nama'}
      </button>
    </form>
  )
}

export function GantiPasswordForm() {
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')
  const [isError, setIsError] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMsg('')

    if (newPassword.length < 8) {
      setMsg('Password baru minimal 8 karakter.')
      setIsError(true)
      return
    }
    if (newPassword !== confirmPassword) {
      setMsg('Konfirmasi password tidak cocok.')
      setIsError(true)
      return
    }

    setLoading(true)
    const supabase = createClient()

    // Verifikasi password lama dengan re-login
    const { data: { user } } = await supabase.auth.getUser()
    if (!user?.email) {
      setMsg('Sesi tidak valid. Silakan login ulang.')
      setIsError(true)
      setLoading(false)
      return
    }

    const { error: signInErr } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: oldPassword,
    })

    if (signInErr) {
      setMsg('Password lama salah.')
      setIsError(true)
      setLoading(false)
      return
    }

    // Update password baru
    const { error: updateErr } = await supabase.auth.updateUser({ password: newPassword })
    if (updateErr) {
      setMsg('Gagal memperbarui password.')
      setIsError(true)
    } else {
      setMsg('Password berhasil diperbarui!')
      setIsError(false)
      setOldPassword('')
      setNewPassword('')
      setConfirmPassword('')
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {[
        { label: 'Password Lama', value: oldPassword, set: setOldPassword, auto: 'current-password' },
        { label: 'Password Baru', value: newPassword, set: setNewPassword, auto: 'new-password' },
        { label: 'Konfirmasi Password Baru', value: confirmPassword, set: setConfirmPassword, auto: 'new-password' },
      ].map((field) => (
        <div key={field.label}>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">{field.label}</label>
          <input
            type="password"
            autoComplete={field.auto}
            value={field.value}
            onChange={(e) => field.set(e.target.value)}
            required
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="••••••••"
          />
        </div>
      ))}
      {msg && (
        <p className={`text-sm ${isError ? 'text-red-600' : 'text-green-600'}`}>{msg}</p>
      )}
      <button
        type="submit"
        disabled={loading}
        className="px-5 py-2 bg-gray-800 text-white text-sm font-medium rounded-lg hover:bg-gray-900 transition-colors disabled:opacity-50"
      >
        {loading ? 'Menyimpan...' : 'Perbarui Password'}
      </button>
    </form>
  )
}
