import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  CheckCircle2, Lock, ArrowRight, RefreshCw, ClipboardCheck, Trophy,
  BarChart2, BookOpen, Clock,
} from 'lucide-react'
import { formatDate } from '@/lib/utils'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: profile } = await (supabase as any)
    .from('users')
    .select('full_name, plan')
    .eq('id', user.id)
    .single()

  const fullName: string = profile?.full_name ?? user.email?.split('@')[0] ?? 'Pengguna'
  const firstName = fullName.split(' ')[0]

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { count: attemptCount } = await (supabase as any)
    .from('attempts')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('status', 'finished')

  const hasAttempts = (attemptCount ?? 0) > 0
  const progressStep = hasAttempts ? 3 : 2
  const progressPct = hasAttempts ? 100 : 33

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: latestAttemptData } = hasAttempts ? await (supabase as any)
    .from('attempts')
    .select('score, correct_count, wrong_count, empty_count, finished_at, packages(name, category)')
    .eq('user_id', user.id)
    .eq('status', 'finished')
    .order('finished_at', { ascending: false })
    .limit(1)
    .single() : { data: null }

  const latestAttempt = latestAttemptData as {
    score: number | null
    correct_count: number | null
    wrong_count: number | null
    empty_count: number | null
    finished_at: string | null
    packages: { name: string; category: string } | null
  } | null

  return (
    <div className="max-w-[1100px] w-full mx-auto space-y-6">

      {/* Greeting */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white rounded-2xl p-6 shadow-[0_2px_12px_rgba(22,72,126,0.04)] border border-slate-100">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#16487e] tracking-tight">
            Halo, {firstName}{' '}
            <span className="inline-block hover:rotate-12 transition-transform duration-300 origin-bottom-right">👋</span>
          </h1>
          <p className="text-slate-500 text-sm">
            {hasAttempts
              ? 'Pantau progres belajarmu dan lanjutkan simulasi untuk meningkatkan skor.'
              : 'Selamat datang di TembusKarir! Mari mulai langkah pertamamu menuju karier impian di BUMN & Swasta Top Tier.'}
          </p>
        </div>
      </div>

      {/* Onboarding Steps — hanya tampil sebelum tes pertama */}
      {!hasAttempts && (
        <div className="bg-white rounded-2xl p-6 shadow-[0_2px_12px_rgba(22,72,126,0.04)] border border-slate-100 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#006397]" />
              <h2 className="font-bold text-slate-800">Langkah Persiapan Menuju Lolos Seleksi</h2>
              <span className="px-2 py-0.5 rounded-full bg-[#cce5ff] text-[#004b73] text-[11px] font-bold">
                {progressStep - 1} dari 3 Selesai ({progressPct}%)
              </span>
            </div>
            <span className="text-xs text-slate-400">Estimasi selesai: 15 menit</span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#006397] h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
            {/* Step 1 — selalu selesai */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 shadow-sm">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <span className="text-sm font-bold text-slate-800 leading-snug block">Buat Akun &amp; Target</span>
                <span className="text-xs text-slate-500">Target posisi MT telah terpasang</span>
              </div>
            </div>

            {/* Step 2 — aktif karena belum ada attempt */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-[#d4e3ff]/30 border-2 border-[#16487e]/30">
              <div className="w-7 h-7 rounded-full bg-[#16487e] text-white flex items-center justify-center flex-shrink-0 font-bold text-sm shadow-sm">
                2
              </div>
              <div className="flex flex-col flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-[#16487e] leading-snug">Pilih Tes</span>
                  <span className="px-1.5 py-0.5 rounded bg-[#9be1fd] text-[#004b73] text-[10px] font-bold uppercase">Utama</span>
                </div>
                <span className="text-xs text-slate-500 mb-2">Pilih simulasi target rekrutmenmu</span>
                <Link
                  href="/portal/astra"
                  className="inline-flex items-center gap-1 py-1 px-2.5 rounded-lg bg-[#16487e] text-white text-xs font-semibold hover:bg-[#389add] transition-colors w-fit shadow-sm"
                >
                  Pilih Tes <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Step 3 — terkunci */}
            <div className="flex items-start gap-3 p-3 rounded-xl border bg-slate-50/40 border-slate-100 opacity-60">
              <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center flex-shrink-0 text-sm">
                <Lock className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="text-sm font-bold text-slate-800 leading-snug block">Pembahasan &amp; Ranking</span>
                <span className="text-xs text-slate-500">Terbuka otomatis setelah menyelesaikan tes pertama</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ringkasan Aktivitas — hanya tampil setelah ada tes selesai */}
      {hasAttempts && (
        <div className="bg-white rounded-2xl p-6 shadow-[0_2px_12px_rgba(22,72,126,0.04)] border border-slate-100">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-[#006397]" />
              <h2 className="font-bold text-slate-800">Ringkasan Aktivitas</h2>
            </div>
            <Link
              href="/rapor"
              className="text-xs font-semibold text-[#16487e] hover:text-[#389add] transition-colors flex items-center gap-1"
            >
              Lihat Rapor Lengkap <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Stat: Total ujian */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="w-11 h-11 rounded-xl bg-[#cce5ff] flex items-center justify-center flex-shrink-0">
                <ClipboardCheck className="w-5 h-5 text-[#004b73]" />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-slate-900 tabular-nums">{attemptCount}</p>
                <p className="text-xs text-slate-500 leading-snug">Ujian Selesai</p>
              </div>
            </div>

            {/* Stat: Skor terakhir */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="w-11 h-11 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                <Trophy className="w-5 h-5 text-emerald-700" />
              </div>
              <div className="min-w-0">
                <p className="text-2xl font-extrabold text-slate-900 tabular-nums">
                  {latestAttempt?.score ?? '—'}
                </p>
                <p className="text-xs text-slate-500 leading-snug truncate">
                  {latestAttempt?.packages?.name ?? 'Skor Terakhir'}
                </p>
              </div>
            </div>

            {/* Stat: Tes terakhir dikerjakan */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="w-11 h-11 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-amber-700" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-900 leading-snug">
                  {latestAttempt?.finished_at ? formatDate(latestAttempt.finished_at) : '—'}
                </p>
                <p className="text-xs text-slate-500 leading-snug">Tes Terakhir</p>
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-100">
            <Link
              href="/riwayat"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5" /> Riwayat Tes
            </Link>
            <Link
              href="/soal-tersimpan"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 transition-colors"
            >
              <ClipboardCheck className="w-3.5 h-3.5" /> Soal Tersimpan
            </Link>
            <Link
              href="/rapor"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#16487e] text-white text-xs font-semibold hover:bg-[#389add] transition-colors"
            >
              <BarChart2 className="w-3.5 h-3.5" /> Lihat Rapor
            </Link>
          </div>
        </div>
      )}

      {/* Rekomendasi Simulasi */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-bold text-[#16487e] tracking-tight">Rekomendasi Simulasi untuk Target Kariermu</h2>
            <p className="text-sm text-slate-500">Sesuai kisi-kisi tes resmi dan batch rekrutmen aktif saat ini.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card ASTRA */}
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-[0_2px_12px_rgba(22,72,126,0.04)] hover:shadow-[0_8px_24px_rgba(22,72,126,0.12)] transition-all flex flex-col group">
            <div className="relative h-44 overflow-hidden">
              <Image
                src="/card-astra.jpg"
                alt="Psikotes ASTRA"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#cce5ff] text-[#004b73] text-[11px] font-bold shadow-sm">
                Paling Populer
              </span>
              <span className="absolute bottom-3 left-3 text-white text-sm font-bold flex items-center gap-1">
                Astra International
              </span>
            </div>
            <div className="p-4 flex-1 flex flex-col justify-between gap-3">
              <div className="space-y-1">
                <h3 className="font-bold text-slate-800 text-base leading-snug">Psikotes Astra International</h3>
                <p className="text-xs text-slate-500">Tes penalaran analitis, logika deret, ketelitian spasial, dan verbal khas Astra Group.</p>
              </div>
              <div className="space-y-2 pt-1 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>80 Soal • 7 Subtes</span>
                  <span>±41 Menit</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[11px] font-bold">Tersedia Gratis</span>
                  <Link
                    href="/portal/astra"
                    className="inline-flex items-center gap-1 py-1.5 px-3 rounded-xl bg-[#16487e] text-white text-xs font-semibold hover:bg-[#389add] transition-colors shadow-sm"
                  >
                    Mulai Tes <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Card PLN */}
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-[0_2px_12px_rgba(22,72,126,0.04)] hover:shadow-[0_8px_24px_rgba(22,72,126,0.12)] transition-all flex flex-col group">
            <div className="relative h-44 overflow-hidden">
              <Image
                src="/card-pln.jpg"
                alt="Rekrutmen PLN"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#d4e3ff] text-[#001c3a] text-[11px] font-bold shadow-sm">
                Rekomendasi BUMN
              </span>
              <span className="absolute bottom-3 left-3 text-white text-sm font-bold">PLN Group 2025</span>
            </div>
            <div className="p-4 flex-1 flex flex-col justify-between gap-3">
              <div className="space-y-1">
                <h3 className="font-bold text-slate-800 text-base leading-snug">Rekrutmen PLN Group 2025</h3>
                <p className="text-xs text-slate-500">General Aptitude Test (GAT) dan Uji Akademik teknis terstandar Rekrutmen Bersama.</p>
              </div>
              <div className="space-y-2 pt-1 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>GAT &amp; Akademik (Tahap 1–2)</span>
                  <span>±60 Menit</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[11px] font-bold">Tersedia Gratis</span>
                  <Link
                    href="/portal/pln"
                    className="inline-flex items-center gap-1 py-1.5 px-3 rounded-xl bg-slate-100 text-[#16487e] text-xs font-semibold hover:bg-[#16487e] hover:text-white transition-colors"
                  >
                    Mulai Simulasi <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Card ANTAM */}
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-[0_2px_12px_rgba(22,72,126,0.04)] hover:shadow-[0_8px_24px_rgba(22,72,126,0.12)] transition-all flex flex-col group">
            <div className="relative h-44 overflow-hidden">
              <Image
                src="/card-antam.png"
                alt="ANTAM IMPACT 2026"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#b9eaff] text-[#001f29] text-[11px] font-bold shadow-sm">
                Program Baru
              </span>
              <span className="absolute bottom-3 left-3 text-white text-sm font-bold">PT Aneka Tambang</span>
            </div>
            <div className="p-4 flex-1 flex flex-col justify-between gap-3">
              <div className="space-y-1">
                <h3 className="font-bold text-slate-800 text-base leading-snug">ANTAM IMPACT 2026</h3>
                <p className="text-xs text-slate-500">Uji kompetensi Integrated Miners Program, reasoning logic, dan work culture fit.</p>
              </div>
              <div className="space-y-2 pt-1 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>14 Job Stream • 40 Soal</span>
                  <span>±50 Menit</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[11px] font-bold">Tersedia Gratis</span>
                  <Link
                    href="/portal/antam"
                    className="inline-flex items-center gap-1 py-1.5 px-3 rounded-xl bg-slate-100 text-[#16487e] text-xs font-semibold hover:bg-[#16487e] hover:text-white transition-colors"
                  >
                    Mulai Simulasi <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-2">
        <div className="bg-white rounded-2xl p-5 shadow-[0_2px_12px_rgba(22,72,126,0.04)] border border-slate-100 flex items-start gap-4 hover:bg-slate-50/60 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0 text-[#006397]">
            <RefreshCw className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-slate-800 text-sm leading-snug">Ujian Dapat Dikerjakan Berulang</h3>
            <p className="text-xs text-slate-500 leading-relaxed">Asah pemahamanmu berkali-kali tanpa batas untuk menguasai setiap tipe soal secara optimal.</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-[0_2px_12px_rgba(22,72,126,0.04)] border border-slate-100 flex items-start gap-4 hover:bg-slate-50/60 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0 text-[#16487e]">
            <ClipboardCheck className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-slate-800 text-sm leading-snug">Ada Pembahasan</h3>
            <p className="text-xs text-slate-500 leading-relaxed">Setiap soal dilengkapi dengan solusi komprehensif, trik pengerjaan cepat, dan tips jitu mentor.</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-[0_2px_12px_rgba(22,72,126,0.04)] border border-slate-100 flex items-start gap-4 hover:bg-slate-50/60 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0 text-[#006397]">
            <Trophy className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-slate-800 text-sm leading-snug">Ranking Nasional</h3>
            <p className="text-xs text-slate-500 leading-relaxed">Bandingkan skormu secara langsung di papan peringkat dengan ribuan kandidat pelamar se-Indonesia.</p>
          </div>
        </div>
      </div>

    </div>
  )
}
