'use client'

import { useState, useRef } from 'react'
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

export function UploadAvatarForm({ userId, initialAvatar }: Pick<ProfilFormProps, 'userId' | 'initialAvatar'>) {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(initialAvatar)
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    // Preview lokal
    const objectUrl = URL.createObjectURL(file)
    setPreview(objectUrl)

    setLoading(true)
    setMsg('')

    const supabase = createClient()
    const ext = file.name.split('.').pop()
    const filePath = `${userId}/avatar.${ext}`

    // Upload ke Supabase Storage bucket 'avatars'
    const { error: uploadErr } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true })

    if (uploadErr) {
      setMsg('Gagal upload foto. Pastikan bucket "avatars" sudah dibuat di Supabase Storage.')
      setLoading(false)
      return
    }

    // Ambil public URL
    const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(filePath)
    const publicUrl = urlData.publicUrl

    // Update tabel users
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: updateErr } = await (supabase.from('users') as any)
      .update({ avatar_url: publicUrl })
      .eq('id', userId)

    if (updateErr) {
      setMsg('Foto terupload tapi gagal disimpan ke profil.')
    } else {
      setMsg('Foto profil berhasil diperbarui!')
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">Foto Profil</label>
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center shrink-0">
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <span className="text-blue-600 text-2xl font-bold">?</span>
          )}
        </div>
        <div>
          <input
            ref={fileRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={handleChange}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={loading}
            className="px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            {loading ? 'Mengupload...' : 'Ganti Foto'}
          </button>
          <p className="text-xs text-gray-400 mt-1">PNG, JPG, WebP. Maks 2MB.</p>
        </div>
      </div>
      {msg && (
        <p className={`text-sm ${msg.startsWith('Gagal') || msg.includes('gagal') ? 'text-red-600' : 'text-green-600'}`}>{msg}</p>
      )}
    </div>
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
