// lib/item-analysis.ts
// Modul kalkulasi Item Response / Psikometri & Sebaran Nilai Ujian

export interface QuestionItem {
  id: string
  order_index: number
  content: string
  category: string | null
  correct_answer: string
  explanation: string | null
  image_url: string | null
  options: { key: string; text: string }[] | unknown
}

export interface AttemptItem {
  id: string
  user_id: string
  score: number | null
  correct_count: number | null
  wrong_count: number | null
  empty_count: number | null
  duration_seconds: number | null
  started_at: string
  status: string
  attempt_number?: number | null
  answers: Record<string, string> | null | unknown
}

export interface AnalyticsFilterOptions {
  attemptMode: 'first' | 'all' | 'best'
  excludeZeroScore: boolean
  minDurationSeconds: number
  timeRange: 'all' | '30d' | '7d'
  categoryFilter?: string
}

export interface QuestionAnalysisResult {
  id: string
  order_index: number
  content: string
  category: string | null
  correct_answer: string
  explanation: string | null
  image_url: string | null
  options: { key: string; text: string }[]
  totalRespondents: number
  correctCount: number
  wrongCount: number
  emptyCount: number
  difficultyIndex: number // 0 - 100 (% peserta benar)
  difficultyLevel: 'too_easy' | 'ideal' | 'too_hard'
  optionsBreakdown: {
    key: string
    text: string
    count: number
    percent: number
    isCorrect: boolean
  }[]
  emptyPercent: number
  topMisleadingOption: { key: string; percent: number } | null
}

export interface PackageAnalyticsSummary {
  totalRawAttempts: number
  totalFilteredAttempts: number
  averageScore: number
  medianScore: number
  highestScore: number
  lowestScore: number
  averageDurationSeconds: number
  distributionBins: {
    range: string
    min: number
    max: number
    count: number
    percent: number
  }[]
  counts: {
    tooEasy: number // > 85%
    ideal: number   // 30 - 85%
    tooHard: number // < 30%
  }
  questions: QuestionAnalysisResult[]
}

/**
 * Filter list attempt sesuai opsi filter yang ditentukan admin
 */
export function filterAttempts(
  attempts: AttemptItem[],
  options: AnalyticsFilterOptions
): AttemptItem[] {
  const now = Date.now()
  let filtered = [...attempts]

  // Hanya ambil sesi yang selesai (status 'finished')
  filtered = filtered.filter((a) => a.status === 'finished')

  // 1. Filter Rentang Waktu
  if (options.timeRange === '7d') {
    const cutoff = now - 7 * 24 * 60 * 60 * 1000
    filtered = filtered.filter((a) => new Date(a.started_at).getTime() >= cutoff)
  } else if (options.timeRange === '30d') {
    const cutoff = now - 30 * 24 * 60 * 60 * 1000
    filtered = filtered.filter((a) => new Date(a.started_at).getTime() >= cutoff)
  }

  // 2. Filter Durasi Minimal
  if (options.minDurationSeconds > 0) {
    filtered = filtered.filter((a) => (a.duration_seconds ?? 0) >= options.minDurationSeconds)
  }

  // 3. Filter Nilai 0 / Kosong
  if (options.excludeZeroScore) {
    filtered = filtered.filter((a) => {
      const score = a.score ?? 0
      const correct = a.correct_count ?? 0
      return score > 0 || correct > 0
    })
  }

  // 4. Filter Mode Percobaan (first / all / best)
  if (options.attemptMode === 'first') {
    // Hanya percobaan pertama (attempt_number === 1 atau attempt pertama secara kronologis per user)
    const userFirstMap = new Map<string, AttemptItem>()
    // Urutkan asc berdasarkan started_at
    const sortedAsc = [...filtered].sort(
      (a, b) => new Date(a.started_at).getTime() - new Date(b.started_at).getTime()
    )
    for (const a of sortedAsc) {
      if (!userFirstMap.has(a.user_id)) {
        if (a.attempt_number === 1 || !a.attempt_number) {
          userFirstMap.set(a.user_id, a)
        }
      }
    }
    filtered = Array.from(userFirstMap.values())
  } else if (options.attemptMode === 'best') {
    // Ambil skor tertinggi per user
    const userBestMap = new Map<string, AttemptItem>()
    for (const a of filtered) {
      const existing = userBestMap.get(a.user_id)
      if (!existing || (a.score ?? 0) > (existing.score ?? 0)) {
        userBestMap.set(a.user_id, a)
      }
    }
    filtered = Array.from(userBestMap.values())
  }

  return filtered
}

/**
 * Hitung seluruh analitik paket (makro skor & per butir soal)
 */
export function calculatePackageAnalytics(
  allRawAttempts: AttemptItem[],
  questions: QuestionItem[],
  options: AnalyticsFilterOptions
): PackageAnalyticsSummary {
  const filteredAttempts = filterAttempts(allRawAttempts, options)
  const N = filteredAttempts.length

  // Parse questions options
  const normalizedQuestions = questions.map((q) => {
    let opts: { key: string; text: string }[] = []
    if (Array.isArray(q.options)) {
      opts = q.options as { key: string; text: string }[]
    } else if (typeof q.options === 'string') {
      try {
        opts = JSON.parse(q.options)
      } catch {
        opts = []
      }
    }
    return {
      ...q,
      parsedOptions: opts,
    }
  })

  // ── 1. Hitung Makro Skor ──────────────────────────────────────────────────
  const scores = filteredAttempts.map((a) => a.score ?? 0).sort((a, b) => a - b)
  const durations = filteredAttempts
    .map((a) => a.duration_seconds ?? 0)
    .filter((d) => d > 0)

  let averageScore = 0
  let medianScore = 0
  let highestScore = 0
  let lowestScore = 0
  let averageDurationSeconds = 0

  if (N > 0) {
    const sumScore = scores.reduce((acc, s) => acc + s, 0)
    averageScore = Math.round((sumScore / N) * 10) / 10
    highestScore = scores[scores.length - 1]
    lowestScore = scores[0]

    // Median
    const mid = Math.floor(scores.length / 2)
    medianScore = scores.length % 2 !== 0 ? scores[mid] : Math.round((scores[mid - 1] + scores[mid]) / 2)

    // Average duration
    if (durations.length > 0) {
      averageDurationSeconds = Math.round(durations.reduce((a, b) => a + b, 0) / durations.length)
    }
  }

  // ── 2. Distribusi Skor (Histogram Bins) ────────────────────────────────────
  // Bins: 0-20, 21-40, 41-60, 61-80, 81-100
  const binDefs = [
    { range: '0 - 20', min: 0, max: 20 },
    { range: '21 - 40', min: 21, max: 40 },
    { range: '41 - 60', min: 41, max: 60 },
    { range: '61 - 80', min: 61, max: 80 },
    { range: '81 - 100', min: 81, max: 100 },
  ]

  const distributionBins = binDefs.map((b) => {
    const count = scores.filter((s) => s >= b.min && s <= b.max).length
    const percent = N > 0 ? Math.round((count / N) * 100) : 0
    return {
      ...b,
      count,
      percent,
    }
  })

  // ── 3. Analisis Butir Soal (Item Difficulty & Distractor) ──────────────────
  let tooEasyCount = 0
  let idealCount = 0
  let tooHardCount = 0

  const questionAnalyses: QuestionAnalysisResult[] = normalizedQuestions.map((q) => {
    let correctCount = 0
    let wrongCount = 0
    let emptyCount = 0
    const optionCounts: Record<string, number> = {}

    // Inisialisasi option keys
    q.parsedOptions.forEach((opt) => {
      optionCounts[opt.key.toUpperCase()] = 0
    })

    const correctKey = (q.correct_answer ?? '').trim().toUpperCase()

    // Evaluasi seluruh jawaban peserta pada attempt ini
    for (const a of filteredAttempts) {
      const answersMap = (a.answers ?? {}) as Record<string, string>
      const chosen = answersMap[q.id]?.trim()?.toUpperCase()

      if (!chosen) {
        emptyCount++
      } else {
        optionCounts[chosen] = (optionCounts[chosen] ?? 0) + 1
        if (chosen === correctKey) {
          correctCount++
        } else {
          wrongCount++
        }
      }
    }

    // Persentase benar (P-Value / Difficulty Index)
    const difficultyIndex = N > 0 ? Math.round((correctCount / N) * 100) : 0

    let difficultyLevel: 'too_easy' | 'ideal' | 'too_hard' = 'ideal'
    if (difficultyIndex >= 85) {
      difficultyLevel = 'too_easy'
      tooEasyCount++
    } else if (difficultyIndex < 30) {
      difficultyLevel = 'too_hard'
      tooHardCount++
    } else {
      idealCount++
    }

    // Option distribution
    let topMisleading: { key: string; percent: number } | null = null
    let maxDistractorCount = 0

    const optionsBreakdown = q.parsedOptions.map((opt) => {
      const k = opt.key.toUpperCase()
      const cnt = optionCounts[k] ?? 0
      const pct = N > 0 ? Math.round((cnt / N) * 100) : 0
      const isCorrect = k === correctKey

      if (!isCorrect && cnt > maxDistractorCount) {
        maxDistractorCount = cnt
        topMisleading = { key: k, percent: pct }
      }

      return {
        key: opt.key,
        text: opt.text,
        count: cnt,
        percent: pct,
        isCorrect,
      }
    })

    const emptyPercent = N > 0 ? Math.round((emptyCount / N) * 100) : 0

    return {
      id: q.id,
      order_index: q.order_index,
      content: q.content,
      category: q.category,
      correct_answer: q.correct_answer,
      explanation: q.explanation,
      image_url: q.image_url,
      options: q.parsedOptions,
      totalRespondents: N,
      correctCount,
      wrongCount,
      emptyCount,
      difficultyIndex,
      difficultyLevel,
      optionsBreakdown,
      emptyPercent,
      topMisleadingOption: topMisleading,
    }
  })

  return {
    totalRawAttempts: allRawAttempts.length,
    totalFilteredAttempts: N,
    averageScore,
    medianScore,
    highestScore,
    lowestScore,
    averageDurationSeconds,
    distributionBins,
    counts: {
      tooEasy: tooEasyCount,
      ideal: idealCount,
      tooHard: tooHardCount,
    },
    questions: questionAnalyses,
  }
}
