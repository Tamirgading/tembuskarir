/**
 * seed-demos.ts — Buat paket GRATIS demo (soal lebih sedikit) untuk RBB BUMN Tahap 1 & GAT PLN Tahap 1.
 *
 * Demo = salinan sebagian soal dari paket penuh, seksi sama, question_count kecil.
 * Jalankan: npx tsx scripts/seed-demos.ts
 */
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { resolve } from 'path'

const envPath = resolve(__dirname, '../.env.local')
const envContent = readFileSync(envPath, 'utf-8')
for (const line of envContent.split('\n')) {
  const trimmed = line.trim()
  if (!trimmed || trimmed.startsWith('#')) continue
  const eqIdx = trimmed.indexOf('=')
  if (eqIdx === -1) continue
  const key = trimmed.slice(0, eqIdx)
  const val = trimmed.slice(eqIdx + 1)
  if (!process.env[key]) process.env[key] = val
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function shuffle(a: any[]): any[] {
  const x = [...a]
  for (let i = x.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[x[i], x[j]] = [x[j], x[i]]
  }
  return x
}

interface DemoDef {
  srcSlug: string
  slug: string
  name: string
  description: string
  sections: { kode: string; nama: string; timer_mode: 'section' | 'per_question'; timer_seconds: number; count: number; group_kode?: string | null; passing_grade?: number | null }[]
}

const DEMOS: DemoDef[] = [
  {
    srcSlug: 'rbb-bumn-tahap-1',
    slug: 'rbb-bumn-tahap-1-demo',
    name: 'Simulasi RBB BUMN Tahap 1 — Demo',
    description: 'Versi demo gratis: contoh soal dari tiap sub-tes (TKD, AKHLAK, TWK). Upgrade Premium untuk akses penuh 200 soal.',
    sections: [
      { kode: 'TKD-VLR', nama: 'TKD — Verbal Logical Reasoning', timer_mode: 'section', timer_seconds: 4 * 60, count: 5, group_kode: 'TKD', passing_grade: 8 },
      { kode: 'TKD-NS',  nama: 'TKD — Number Sequence',          timer_mode: 'section', timer_seconds: 5 * 60, count: 5, group_kode: 'TKD' },
      { kode: 'TKD-WC',  nama: 'TKD — Word Classification',       timer_mode: 'section', timer_seconds: 2 * 60, count: 5, group_kode: 'TKD' },
      { kode: 'TKD-DIAG',nama: 'TKD — Diagram Reasoning',         timer_mode: 'section', timer_seconds: 4 * 60, count: 5, group_kode: 'TKD' },
      { kode: 'AKHLAK',  nama: 'AKHLAK',                          timer_mode: 'per_question', timer_seconds: 20, count: 10 },
      { kode: 'TWK',     nama: 'TWK',                             timer_mode: 'section', timer_seconds: 3 * 60, count: 5, passing_grade: 3 },
    ],
  },
  {
    srcSlug: 'gat-pln-tahap-1',
    slug: 'gat-pln-tahap-1-demo',
    name: 'Simulasi GAT PLN Tahap 1 — Demo',
    description: 'Versi demo gratis: contoh soal TKD 1, TKD 2, dan Pengetahuan PLN. Upgrade Premium/PLN untuk akses penuh.',
    sections: [
      { kode: 'TKD1', nama: 'TKD 1 — Deret Bilangan', timer_mode: 'per_question', timer_seconds: 30, count: 8 },
      { kode: 'TKD2', nama: 'TKD 2 — Silogisme & Sinonim', timer_mode: 'per_question', timer_seconds: 30, count: 10 },
      { kode: 'PENGETAHUAN', nama: 'Tes Pengetahuan PLN', timer_mode: 'section', timer_seconds: 4 * 60, count: 5 },
    ],
  },
]

async function createDemo(d: DemoDef) {
  // Ambil paket sumber
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: srcPkg } = await (supabase.from('packages') as any).select('id').eq('slug', d.srcSlug).single()
  if (!srcPkg) { console.error(`Sumber ${d.srcSlug} tidak ada`); return }

  // Upsert paket demo
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: existing } = await (supabase.from('packages') as any).select('id').eq('slug', d.slug).maybeSingle()
  let pkgId: string
  if (existing) {
    pkgId = existing.id
    await (supabase.from('packages') as any).update({ name: d.name, is_free: true, is_published: true, description: d.description }).eq('id', pkgId)
  } else {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase.from('packages') as any)
      .insert({
        name: d.name,
        slug: d.slug,
        category: (await (supabase.from('packages') as any).select('category').eq('id', srcPkg.id).single()).data.category,
        description: d.description,
        duration_minutes: Math.round(d.sections.reduce((s, x) => s + x.timer_seconds, 0) / 60),
        total_questions: d.sections.reduce((s, x) => s + x.count, 0),
        is_free: true,
        is_published: true,
      })
      .select('id').single()
    if (error || !data) { console.error('Gagal buat paket demo:', error); return }
    pkgId = data.id
  }

  // Bersihkan seksi & soal demo lama
  await (supabase.from('package_sections') as any).delete().eq('package_id', pkgId)
  await (supabase.from('questions') as any).delete().eq('package_id', pkgId)

  // Insert seksi
  const secRows = d.sections.map((s, i) => ({
    package_id: pkgId,
    order_index: i + 1,
    kode: s.kode,
    nama: s.nama,
    timer_mode: s.timer_mode,
    timer_seconds: s.timer_seconds,
    question_count: s.count,
    random_select: true,
    group_kode: s.group_kode ?? null,
    passing_grade: s.passing_grade ?? null,
  }))
  await (supabase.from('package_sections') as any).insert(secRows)

  // Salin sebagian soal dari sumber (acak per kategori)
  let total = 0
  for (const s of d.sections) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: srcQs } = await (supabase.from('questions') as any)
      .select('content, options, correct_answer, explanation, category, difficulty, image_url')
      .eq('package_id', srcPkg.id)
      .eq('category', s.kode)
    const picked = shuffle(srcQs ?? []).slice(0, s.count)
    if (picked.length === 0) { console.log(`  ${s.kode}: tidak ada soal sumber`); continue }
    const rows = picked.map((q: Record<string, unknown>, i: number) => ({
      package_id: pkgId,
      content: q.content,
      options: q.options,
      correct_answer: q.correct_answer,
      explanation: q.explanation,
      category: s.kode,
      difficulty: q.difficulty,
      order_index: i + 1,
      image_url: q.image_url ?? null,
    }))
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from('questions') as any).insert(rows)
    if (error) { console.error(`  ${s.kode} gagal:`, error.message) } else { total += rows.length }
  }

  console.log(`✅ ${d.name} (${d.slug}): ${d.sections.length} seksi, ${total} soal`)
}

async function main() {
  for (const d of DEMOS) await createDemo(d)
  console.log('\nSelesai.')
}

main()
