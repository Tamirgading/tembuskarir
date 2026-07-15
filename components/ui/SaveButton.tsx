'use client'

import { Bookmark } from 'lucide-react'

interface SaveButtonProps {
  questionId: string
  saved: boolean
  loading?: boolean
  onToggle: (questionId: string) => void
}

/** Tombol simpan/bookmark soal — dipakai di review hasil ujian. */
export default function SaveButton({ questionId, saved, loading = false, onToggle }: SaveButtonProps) {
  return (
    <button
      onClick={() => onToggle(questionId)}
      disabled={loading}
      title={saved ? 'Hapus dari simpanan' : 'Simpan soal ini'}
      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-all select-none disabled:opacity-50 ${
        saved
          ? 'bg-amber-50 border-amber-300 text-amber-700 hover:bg-amber-100'
          : 'bg-white border-hairline text-ink-muted hover:bg-paper-soft hover:text-ink'
      }`}
    >
      <Bookmark
        className={`w-[13px] h-[13px] transition-transform ${loading ? 'scale-90' : ''}`}
        strokeWidth={saved ? 0 : 2}
        fill={saved ? 'currentColor' : 'none'}
      />
      {saved ? 'Tersimpan' : 'Simpan'}
    </button>
  )
}
