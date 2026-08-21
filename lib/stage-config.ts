/**
 * lib/stage-config.ts
 * Konfigurasi paket ujian gabungan ("tahap") yang memakai tabel package_sections.
 * Satu paket tahap berisi beberapa seksi (sub-tes) berurutan dengan timer terpisah
 * dan passing grade opsional. Soal disimpan inline di paket, kategori soal = kode seksi.
 */

export interface StageSection {
  id: string
  order_index: number
  kode: string
  nama: string
  timer_mode: 'section' | 'per_question'
  timer_seconds: number
  question_count: number | null
  random_select: boolean
  group_kode: string | null
  passing_grade: number | null
}

/**
 * Ambil seksi paket tahap secara berurutan.
 * Aman dipakai dari server (service/anon) karena RLS membatasi ke paket published.
 */
export async function fetchStageSections(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  client: any,
  packageId: string
): Promise<StageSection[]> {
  const { data } = await client
    .from('package_sections')
    .select('*')
    .eq('package_id', packageId)
    .order('order_index', { ascending: true })
  return (data ?? []) as StageSection[]
}

/**
 * Evaluasi passing grade per grup seksi (group_kode / kode seksi).
 * Mengembalikan status lolos/belum per grup + overall.
 */
export function evaluateStagePassing(
  sections: StageSection[],
  scoreDetails: Record<string, unknown> | null
): {
  groups: {
    kode: string
    nama: string
    passingGrade: number | null
    correct: number
    total: number
    passed: boolean | null
  }[]
  overall: 'lolos' | 'belum' | 'none'
} {
  const categories = (scoreDetails?.categories ?? {}) as Record<
    string,
    { correct: number; wrong: number; empty: number }
  >

  // Kelompokkan seksi berdasarkan group_kode (fallback: kode seksi sendiri)
  const groupMap = new Map<string, StageSection[]>()
  for (const s of sections) {
    const key = s.group_kode ?? s.kode
    if (!groupMap.has(key)) groupMap.set(key, [])
    groupMap.get(key)!.push(s)
  }

  const groups: {
    kode: string
    nama: string
    passingGrade: number | null
    correct: number
    total: number
    passed: boolean | null
  }[] = []

  for (const secs of Array.from(groupMap.values())) {
    const orderSecs: StageSection[] = [...secs].sort((a, b) => a.order_index - b.order_index)
    const kode = orderSecs[0].kode
    const nama = secs.length > 1 ? secs.map((s) => s.kode).join(' · ') : orderSecs[0].nama
    const passingGrade = orderSecs.find((s) => s.passing_grade != null)?.passing_grade ?? null

    let correct = 0
    let total = 0
    for (const s of secs) {
      const stat = categories[s.kode]
      if (stat) {
        correct += stat.correct
        total += stat.correct + stat.wrong + stat.empty
      }
    }

    groups.push({
      kode,
      nama,
      passingGrade,
      correct,
      total,
      passed: passingGrade != null ? correct >= passingGrade : null,
    })
  }

  const judged = groups.filter((g) => g.passed !== null)
  const overall =
    judged.length === 0
      ? 'none'
      : judged.every((g) => g.passed === true)
        ? 'lolos'
        : 'belum'

  return { groups, overall }
}
