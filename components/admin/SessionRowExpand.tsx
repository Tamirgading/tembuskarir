'use client'
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from 'react'
import Link from 'next/link'
import {
  ChevronDown, ChevronRight, ExternalLink, CheckCircle2, Clock,
  Copy, Check
} from 'lucide-react'

export interface SessionData {
  id: string
  status: string
  started_at: string
  finished_at: string | null
  score: number | null
  correct_count: number | null
  wrong_count: number | null
  empty_count: number | null
  duration_seconds: number | null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  score_details: any
  answers_count: number
  user: {
    id: string
    email: string
    full_name: string | null
    plan: string
  } | null
  package: {
    id: string
    name: string
    category: string
    total_questions: number
    duration_minutes: number
    slug: string
  } | null
}

function formatDateWIB(iso: string) {
  try {
    const d = new Date(iso)
    return d.toLocaleString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Jakarta',
    }) + ' WIB'
  } catch {
    return iso
  }
}

function formatDuration(seconds: number | null) {
  if (seconds === null || seconds === undefined) return '-'
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  if (mins === 0) return `${secs} dtk`
  return `${mins} mnt ${secs > 0 ? `${secs} dtk` : ''}`.trim()
}

function getElapsed(startedAt: string) {
  try {
    const diff = Math.max(0, Date.now() - new Date(startedAt).getTime())
    const mins = Math.floor(diff / 60000)
    const hours = Math.floor(mins / 60)
    if (hours > 0) return `${hours} jam ${mins % 60} mnt`
    if (mins === 0) return 'Baru saja'
    return `${mins} mnt`
  } catch {
    return '-'
  }
}

export function SessionRowExpand({ session }: { session: SessionData }) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const isFinished = session.status === 'finished'
  const durationLimitMinutes = session.package?.duration_minutes ?? 60
  const elapsedMs = Math.max(0, Date.now() - new Date(session.started_at).getTime())
  const isOngoingActive = !isFinished && elapsedMs <= (durationLimitMinutes + 5) * 60 * 1000

  const categoryColor: Record<string, string> = {
    ANTAM: 'bg-teal-50 text-teal-700 border-teal-200',
    ASTRA: 'bg-blue-50 text-blue-700 border-blue-200',
    PLN: 'bg-amber-50 text-amber-700 border-amber-200',
    BUMN: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  }

  function handleCopy(e: React.MouseEvent) {
    e.stopPropagation()
    navigator.clipboard.writeText(session.id)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const categoryBadgeClass = categoryColor[session.package?.category ?? ''] ?? 'bg-slate-100 text-slate-700 border-slate-200'

  return (
    <>
      <tr
        onClick={() => setOpen(!open)}
        className="hover:bg-slate-50/80 transition-colors cursor-pointer border-b border-slate-100 text-sm"
      >
        {/* Peserta */}
        <td className="px-4 py-3.5">
          <div className="flex items-center gap-3">
            <span
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 ${
                session.user?.plan === 'premium' ? 'bg-amber-500' : 'bg-slate-400'
              }`}
            >
              {(session.user?.full_name ?? session.user?.email ?? '?').charAt(0).toUpperCase()}
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-900 truncate max-w-[180px]">
                  {session.user?.full_name || 'Tanpa Nama'}
                </span>
                {session.user?.plan === 'premium' ? (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-800 border border-amber-200 shrink-0">
                    Premium
                  </span>
                ) : (
                  <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200 shrink-0">
                    Free
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 truncate max-w-[200px] mt-0.5">
                {session.user?.email ?? 'Unknown Email'}
              </p>
            </div>
          </div>
        </td>

        {/* Paket Soal */}
        <td className="px-4 py-3.5">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 mb-1">
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider ${categoryBadgeClass}`}>
                {session.package?.category ?? 'UMUM'}
              </span>
            </div>
            <p className="font-medium text-slate-900 text-xs truncate max-w-[230px]" title={session.package?.name ?? 'Paket'}>
              {session.package?.name ?? 'Paket Dihapus'}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {session.package?.total_questions ?? 0} Soal · {session.package?.duration_minutes ?? 0} Mnt
            </p>
          </div>
        </td>

        {/* Status Sesi */}
        <td className="px-4 py-3.5">
          {isFinished ? (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Selesai</span>
            </div>
          ) : isOngoingActive ? (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shrink-0" />
              <span>Sedang Ujian</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
              <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>Waktu Habis</span>
            </div>
          )}
        </td>

        {/* Waktu Mulai & Durasi */}
        <td className="px-4 py-3.5 text-xs text-slate-600">
          <div className="font-medium text-slate-800">
            {formatDateWIB(session.started_at)}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-400 shrink-0" />
            {isFinished ? (
              <span>Durasi: {formatDuration(session.duration_seconds)}</span>
            ) : isOngoingActive ? (
              <span className="text-blue-600 font-medium">Berjalan {getElapsed(session.started_at)}</span>
            ) : (
              <span>Berakhir (Belum Submit)</span>
            )}
          </div>
        </td>

        {/* Hasil / Nilai */}
        <td className="px-4 py-3.5">
          {isFinished ? (
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-slate-900 font-mono text-sm">
                  {session.score ?? 0}
                </span>
                {session.package?.total_questions ? (
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                    {Math.round(((session.score ?? 0) / session.package.total_questions) * 100)}%
                  </span>
                ) : null}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5 space-x-1.5">
                <span className="text-emerald-600 font-medium">✓ {session.correct_count ?? 0}</span>
                <span className="text-rose-500 font-medium">✗ {session.wrong_count ?? 0}</span>
                <span className="text-slate-400">○ {session.empty_count ?? 0}</span>
              </div>
            </div>
          ) : (
            <div>
              <span className="text-xs font-semibold text-slate-700">
                {session.answers_count} Soal Diisi
              </span>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {session.package?.total_questions ? `dari ${session.package.total_questions} total soal` : 'sedang berjalan'}
              </p>
            </div>
          )}
        </td>

        {/* Aksi */}
        <td className="px-4 py-3.5 text-right">
          <div className="flex items-center justify-end gap-1.5 text-slate-400 group-hover:text-slate-600">
            {open ? (
              <ChevronDown className="w-4 h-4 text-slate-600" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </div>
        </td>
      </tr>

      {/* Expanded Row */}
      {open && (
        <tr className="bg-slate-50/70 border-b border-slate-200">
          <td colSpan={6} className="px-6 py-5">
            <div className="space-y-4">
              {/* Header info */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200/80">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-slate-500">Attempt ID:</span>
                  <code className="text-xs bg-white px-2 py-0.5 rounded border border-slate-200 font-mono text-slate-700">
                    {session.id}
                  </code>
                  <button
                    onClick={handleCopy}
                    className="p-1 hover:bg-white rounded border border-transparent hover:border-slate-200 transition text-slate-500 hover:text-slate-800"
                    title="Salin Attempt ID"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  {isFinished && (
                    <Link
                      href={`/hasil/${session.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-900 hover:text-white transition-all shadow-xs"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Buka Rapor Hasil &amp; Pembahasan
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              </div>

              {/* Detail Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-3.5 rounded-xl border border-slate-200/80">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Waktu Pengerjaan
                  </span>
                  <div className="text-xs space-y-1 text-slate-700">
                    <p><span className="text-slate-400">Mulai:</span> {formatDateWIB(session.started_at)}</p>
                    <p>
                      <span className="text-slate-400">Selesai:</span>{' '}
                      {session.finished_at ? formatDateWIB(session.finished_at) : 'Belum selesai'}
                    </p>
                    <p>
                      <span className="text-slate-400">Durasi Aktual:</span>{' '}
                      <strong className="font-semibold text-slate-900">{formatDuration(session.duration_seconds)}</strong>
                    </p>
                  </div>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-slate-200/80">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Ringkasan Butir Soal
                  </span>
                  <div className="text-xs space-y-1 text-slate-700">
                    <p><span className="text-slate-400">Total Soal Paket:</span> {session.package?.total_questions ?? 0} butir</p>
                    <p><span className="text-slate-400">Soal Terjawab:</span> {session.answers_count} butir</p>
                    {isFinished && (
                      <p className="space-x-2 pt-0.5">
                        <span className="text-emerald-700 font-semibold">{session.correct_count ?? 0} Benar</span>
                        <span className="text-slate-300">·</span>
                        <span className="text-rose-600 font-semibold">{session.wrong_count ?? 0} Salah</span>
                        <span className="text-slate-300">·</span>
                        <span className="text-slate-500">{session.empty_count ?? 0} Kosong</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-slate-200/80">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Profil Peserta
                  </span>
                  <div className="text-xs space-y-1 text-slate-700">
                    <p className="font-semibold text-slate-900">{session.user?.full_name || 'Tanpa Nama'}</p>
                    <p className="text-slate-500 font-mono text-[11px]">{session.user?.email}</p>
                    <p><span className="text-slate-400">Paket Langganan:</span> {session.user?.plan === 'premium' ? 'Premium Member' : 'Free User'}</p>
                  </div>
                </div>
              </div>

              {/* Sub-test breakdown jika ada di score_details */}
              {session.score_details?.categories && Array.isArray(session.score_details.categories) && (
                <div className="bg-white rounded-xl border border-slate-200/80 p-3.5">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                    Rincian Nilai per Sub-tes / Kategori
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {session.score_details.categories.map((cat: any, idx: number) => (
                      <div key={idx} className="p-2 bg-slate-50 rounded-lg border border-slate-100 text-xs">
                        <span className="text-slate-500 font-medium block truncate" title={cat.category || cat.name}>
                          {cat.category || cat.name || `Bagian ${idx + 1}`}
                        </span>
                        <div className="flex items-center justify-between mt-1">
                          <span className="font-black text-slate-900 font-mono">
                            {cat.score ?? cat.correct ?? 0}
                          </span>
                          {cat.total ? (
                            <span className="text-[10px] text-slate-400">
                              / {cat.total}
                            </span>
                          ) : null}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  )
}
