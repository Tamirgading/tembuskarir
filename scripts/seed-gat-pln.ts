/**
 * seed-gat-pln.ts — Paket "Simulasi GAT PLN Tahap 1" + package_sections.
 * Struktur tes asli (Tahap 1 PLN):
 *   TKD 1 (26 deret, 30 dtk/soal), TKD 2 (36 silogisme+sinonim, 30 dtk/soal),
 *   Tes Pengetahuan PLN (15 dari bank, 12 mnt).
 * Jalankan: npx tsx scripts/seed-gat-pln.ts
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

const SLUG = 'gat-pln-tahap-1'
const NAME = 'Simulasi GAT PLN Tahap 1'

const SECTIONS = [
  { kode: 'TKD1', nama: 'TKD 1 — Deret Bilangan', timer_mode: 'per_question', timer_seconds: 30, question_count: 26, random_select: true, group_kode: null, passing_grade: null },
  { kode: 'TKD2', nama: 'TKD 2 — Silogisme & Sinonim', timer_mode: 'per_question', timer_seconds: 30, question_count: 36, random_select: true, group_kode: null, passing_grade: null },
  { kode: 'PENGETAHUAN', nama: 'Tes Pengetahuan PLN', timer_mode: 'section', timer_seconds: 12 * 60, question_count: 15, random_select: true, group_kode: null, passing_grade: null },
]

async function main() {
  const { data: existing } = await (supabase.from('packages') as any).select('id').eq('slug', SLUG).maybeSingle()
  let pkgId: string
  if (existing) {
    pkgId = existing.id
    await (supabase.from('packages') as any).update({ name: NAME, category: 'PLN', is_published: true }).eq('id', pkgId)
    console.log('Paket sudah ada:', pkgId)
  } else {
    const { data, error } = await (supabase.from('packages') as any)
      .insert({
        name: NAME,
        slug: SLUG,
        category: 'PLN',
        description: 'Simulasi Tahap 1 seleksi PLN: TKD 1 (Deret), TKD 2 (Silogisme & Sinonim), dan Tes Pengetahuan PLN. Timer per soal 30 detik.',
        duration_minutes: 62,
        total_questions: 77,
        is_free: true,
        is_published: true,
      })
      .select('id').single()
    if (error || !data) { console.error('Gagal buat paket:', error); process.exit(1) }
    pkgId = data.id
    console.log('Paket baru:', pkgId)
  }

  await (supabase.from('package_sections') as any).delete().eq('package_id', pkgId)
  const rows = SECTIONS.map((s, i) => ({ package_id: pkgId, order_index: i + 1, ...s }))
  const { error } = await (supabase.from('package_sections') as any).insert(rows)
  if (error) { console.error('Gagal insert seksi:', error.message); process.exit(1) }
  console.log(`✅ Insert ${rows.length} seksi`)
  console.log('\nSelesai. Paket:', SLUG)
}

main()
