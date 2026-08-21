/**
 * lib/exam-scoring.ts
 * Shared scoring logic untuk semua kategori ujian.
 * Digunakan oleh: /api/submit, /api/cron/cleanup, /persiapan page guard.
 */

export interface QuestionForScoring {
  id: string
  correct_answer: string
  category?: string | null
  options?: { key: string; text: string; point?: number }[] | null
}

/**
 * Baris soal berbasis poin per opsi (kolom eksplisit opt_a..opt_e, point_a..point_e).
 * Dipakai oleh tabel questions_pln_akhlak & questions_pln_la.
 */
export interface QuestionPointRow {
  id: string
  opt_a: string; opt_b: string; opt_c: string; opt_d: string; opt_e: string
  point_a: number; point_b: number; point_c: number; point_d: number; point_e: number
}

export interface CategoryStats {
  correct: number  // soal yang dijawab benar (atau dijawab, untuk soal berbasis poin)
  wrong: number    // soal yang dijawab salah (0 untuk soal berbasis poin)
  empty: number    // soal tidak dijawab
  rawScore: number // total poin kategori ini
}

export interface ScoreResult {
  score: number
  correctCount: number
  wrongCount: number
  emptyCount: number
  scoreDetails: Record<string, unknown>
}

// ── ASTRA Psikotes subtests ───────────────────────────────────────────────────
export const ASTRA_SUBTESTS: Record<string, { full: string; soal: number; minutes: number }> = {
  QR:  { full: 'Quantitative Reasoning',  soal: 10, minutes: 11 },
  DR:  { full: 'Deductive Reasoning',     soal: 10, minutes: 5  },
  RC:  { full: 'Reading Comprehension',   soal: 10, minutes: 5  },
  IR:  { full: 'Inductive Reasoning',     soal: 10, minutes: 6  },
  VIZ: { full: 'Visualization',           soal: 10, minutes: 6  },
  PS:  { full: 'Perceptual Speed',        soal: 30, minutes: 2  },
  WM:  { full: 'Working Memory',          soal: 10, minutes: 6  },
}

// ── PLN GAT subtests (General Aptitude Test) ─────────────────────────────────
// Urutan default: tes kognitif dulu (masih fresh), baru LA & AKHLAK.
// Total durasi: 180 menit. User bisa pilih subtes apa duluan di frontend.
export const PLN_SUBTESTS: Record<string, { full: string; soal: number; minutes: number; kind: 'mcq' | 'akhlak' | 'la' }> = {
  NUM:    { full: 'Numerik',                 soal: 30, minutes: 30, kind: 'mcq' },
  VER:    { full: 'Verbal',                  soal: 30, minutes: 30, kind: 'mcq' },
  SIL:    { full: 'Silogisme',               soal: 15, minutes: 15, kind: 'mcq' },
  DER:    { full: 'Deret Angka',             soal: 15, minutes: 10, kind: 'mcq' },
  FIG:    { full: 'Figural',                 soal: 20, minutes: 20, kind: 'mcq' },
  PU:     { full: 'Pengetahuan Umum PLN',    soal: 20, minutes: 15, kind: 'mcq' },
  LA:     { full: 'Learning Agility',        soal: 40, minutes: 30, kind: 'la' },
  AKHLAK: { full: 'AKHLAK',                  soal: 40, minutes: 30, kind: 'akhlak' },
}

/**
 * Konversi baris questions_pln_akhlak → format QuestionForScoring.
 * AKHLAK scoring: key dengan point tertinggi = "best" (berbasis poin per opsi).
 */
export function transformPlnAkhlakForScoring(
  rows: QuestionPointRow[]
): QuestionForScoring[] {
  return rows.map((r) => {
    const opts = (['a', 'b', 'c', 'd', 'e'] as const).map((k) => ({
      key: k.toUpperCase(),
      text: r[`opt_${k}`],
      point: r[`point_${k}`],
    }))
    const best = opts.reduce((prev, curr) => (curr.point > prev.point ? curr : prev))
    return {
      id: r.id,
      correct_answer: best.key,
      category: 'AKHLAK',
      options: opts,
    }
  })
}

/**
 * Konversi baris questions_pln_la → format QuestionForScoring.
 * Berbasis poin per opsi; handle is_reverse_scored (bisa balik nilai point 6 - x).
 */
export function transformPlnLaForScoring(
  rows: (QuestionPointRow & { is_reverse_scored?: boolean })[]
): QuestionForScoring[] {
  return rows.map((r) => {
    const reverse = r.is_reverse_scored === true
    const opts = (['a', 'b', 'c', 'd', 'e'] as const).map((k) => ({
      key: k.toUpperCase(),
      text: r[`opt_${k}`],
      point: reverse ? 6 - r[`point_${k}`] : r[`point_${k}`],
    }))
    const best = opts.reduce((prev, curr) => (curr.point > prev.point ? curr : prev))
    return {
      id: r.id,
      correct_answer: best.key,
      category: 'LA',
      options: opts,
    }
  })
}

/**
 * Hitung skor ujian berdasarkan kategori paket.
 *
 * pkgCategory:
 *   'PLN'   → GAT scoring (MCQ +1; AKHLAK & LA berbasis poin per opsi)
 *   'ASTRA' → per-subtest correct count (+1 benar, 0 salah/kosong)
 *   lainnya → simple percentage (correctCount / total * 100)
 */
export function computeScore(
  questions: QuestionForScoring[],
  answers: Record<string, string>,
  pkgCategory: string
): ScoreResult {
  let correctCount = 0
  let wrongCount = 0
  let emptyCount = 0
  let score: number
  let scoreDetails: Record<string, unknown> = {}

  if (pkgCategory === 'PLN') {
    // ── PLN GAT Scoring ───────────────────────────────────────────────────────
    // MCQ subtests (NUM/VER/SIL/DER/FIG/PU): +1 benar, 0 salah/kosong.
    // AKHLAK & LA: ambil nilai point dari opsi yang dipilih (sudah dinormalisasi di transformer).
    const catStats: Record<string, CategoryStats> = {}

    for (const q of questions) {
      const cat = (q.category ?? 'NUM').toUpperCase()
      if (!catStats[cat]) catStats[cat] = { correct: 0, wrong: 0, empty: 0, rawScore: 0 }

      const userAnswer = answers[q.id]
      const isPointBased = cat === 'AKHLAK' || cat === 'LA'

      if (!userAnswer) {
        emptyCount++
        catStats[cat].empty++
      } else if (isPointBased) {
        const selectedOpt = (q.options ?? []).find((o) => o.key === userAnswer)
        const point = selectedOpt?.point ?? 0
        catStats[cat].correct++
        catStats[cat].rawScore += point
        correctCount++
      } else if (userAnswer === q.correct_answer) {
        correctCount++
        catStats[cat].correct++
        catStats[cat].rawScore++
      } else {
        wrongCount++
        catStats[cat].wrong++
      }
    }

    const totalRaw = Object.values(catStats).reduce((sum, c) => sum + c.rawScore, 0)
    score = Math.round(totalRaw)
    scoreDetails = {
      type: 'PLN',
      categories: catStats,
      totalQuestions: questions.length,
    }

  } else if (pkgCategory === 'ASTRA') {
    // ── ASTRA Psikotes Scoring ────────────────────────────────────────────────
    // Benar +1, Salah 0, Kosong 0. Skor = jumlah benar.
    const catStats: Record<string, CategoryStats> = {}

    for (const q of questions) {
      const cat = (q.category ?? 'QR').toUpperCase()
      if (!catStats[cat]) catStats[cat] = { correct: 0, wrong: 0, empty: 0, rawScore: 0 }

      const userAnswer = answers[q.id]
      if (!userAnswer) {
        emptyCount++
        catStats[cat].empty++
      } else if (userAnswer === q.correct_answer) {
        correctCount++
        catStats[cat].correct++
        catStats[cat].rawScore++
      } else {
        wrongCount++
        catStats[cat].wrong++
      }
    }

    score = correctCount
    scoreDetails = {
      type: 'ASTRA',
      categories: catStats,
      totalQuestions: questions.length,
      maxScore: questions.length,
    }

  } else if (pkgCategory === 'BUMN') {
    // ── BUMN Scoring ─────────────────────────────────────────────────────────
    // TWK, VLR, WC, NS, DIAG : MCQ +1 benar, 0 salah/kosong.
    // AKHLAK                  : berbasis poin per opsi (1–5), tidak ada jawaban salah.
    const catStats: Record<string, CategoryStats> = {}

    for (const q of questions) {
      const cat = (q.category ?? 'TWK').toUpperCase()
      if (!catStats[cat]) catStats[cat] = { correct: 0, wrong: 0, empty: 0, rawScore: 0 }

      const userAnswer = answers[q.id]
      // AKHLAK berbasis poin hanya jika opsi menyimpan point (1–5).
      // Jika tidak, diperlakukan sebagai MCQ biasa (+1 benar) — format RBB 2-opsi.
      const isPointBased = cat === 'AKHLAK' && (q.options ?? []).some((o) => o.point != null)

      if (!userAnswer) {
        emptyCount++
        catStats[cat].empty++
      } else if (isPointBased) {
        const selectedOpt = (q.options ?? []).find((o) => o.key === userAnswer)
        const point = selectedOpt?.point ?? 0
        catStats[cat].correct++
        catStats[cat].rawScore += point
        correctCount++
      } else if (userAnswer === q.correct_answer) {
        correctCount++
        catStats[cat].correct++
        catStats[cat].rawScore++
      } else {
        wrongCount++
        catStats[cat].wrong++
      }
    }

    const totalRaw = Object.values(catStats).reduce((sum, c) => sum + c.rawScore, 0)
    score = Math.round(totalRaw)
    scoreDetails = {
      type: 'BUMN',
      categories: catStats,
      totalQuestions: questions.length,
    }

  } else if (pkgCategory === 'ANTAM') {
    // ── ANTAM IMPACT Scoring ─────────────────────────────────────────────────
    // Semua MCQ: +1 benar, 0 salah/kosong. Skor = jumlah benar.
    const catStats: Record<string, CategoryStats> = {}

    for (const q of questions) {
      const cat = (q.category ?? 'UMUM').toUpperCase()
      if (!catStats[cat]) catStats[cat] = { correct: 0, wrong: 0, empty: 0, rawScore: 0 }

      const userAnswer = answers[q.id]
      if (!userAnswer) {
        emptyCount++
        catStats[cat].empty++
      } else if (userAnswer === q.correct_answer) {
        correctCount++
        catStats[cat].correct++
        catStats[cat].rawScore++
      } else {
        wrongCount++
        catStats[cat].wrong++
      }
    }

    score = correctCount
    scoreDetails = {
      type: 'ANTAM',
      categories: catStats,
      totalQuestions: questions.length,
      maxScore: questions.length,
    }

  } else {
    // ── Simple Scoring (non-PLN, non-ASTRA, non-BUMN; mis. BI/OJK) ───────────
    // Skor = persentase benar. Breakdown per sub-tes tetap direkam agar
    // Rapor & analisis penguasaan berfungsi untuk kategori ini.
    const totalQuestions = questions.length
    const catStats: Record<string, CategoryStats> = {}

    for (const q of questions) {
      const cat = (q.category ?? 'UMUM').toUpperCase()
      if (!catStats[cat]) catStats[cat] = { correct: 0, wrong: 0, empty: 0, rawScore: 0 }

      const userAnswer = answers[q.id]
      if (!userAnswer) {
        emptyCount++
        catStats[cat].empty++
      } else if (userAnswer === q.correct_answer) {
        correctCount++
        catStats[cat].correct++
        catStats[cat].rawScore++
      } else {
        wrongCount++
        catStats[cat].wrong++
      }
    }

    score = totalQuestions > 0
      ? Math.round((correctCount / totalQuestions) * 100)
      : 0
    scoreDetails = {
      type: 'simple',
      categories: catStats,
      totalQuestions,
    }
  }

  return { score, correctCount, wrongCount, emptyCount, scoreDetails }
}

/**
 * Cek apakah sebuah attempt sudah melewati batas waktu.
 */
export function isAttemptExpired(startedAt: string, durationMinutes: number): boolean {
  const startMs = new Date(startedAt).getTime()
  const deadlineMs = startMs + durationMinutes * 60 * 1000
  return Date.now() > deadlineMs
}
