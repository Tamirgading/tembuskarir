/**
 * seed-rbb-tahap2.ts — Paket "Simulasi RBB BUMN Tahap 2" + package_sections.
 * Tahap 2 = Tes Bahasa Inggris (ER 20/15m, RC 45/50m, SC 20/15m).
 * LA (100 soal, 2-opsi) belum ada konten -> seksi ditambahkan nanti.
 *
 * Jalankan: npx tsx scripts/seed-rbb-tahap2.ts
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

const SLUG = 'rbb-bumn-tahap-2'
const NAME = 'Simulasi RBB BUMN Tahap 2'

const SECTIONS = [
  { kode: 'BI-ER', nama: 'Tes Bahasa Inggris — Error Recognition', timer_mode: 'section', timer_seconds: 15 * 60, group_kode: 'BI', passing_grade: 77 },
  { kode: 'BI-RC', nama: 'Tes Bahasa Inggris — Reading Comprehension', timer_mode: 'section', timer_seconds: 50 * 60, group_kode: 'BI', passing_grade: null },
  { kode: 'BI-SC', nama: 'Tes Bahasa Inggris — Sentence Completion', timer_mode: 'section', timer_seconds: 15 * 60, group_kode: 'BI', passing_grade: null },
]

async function main() {
  const { data: existing } = await (supabase.from('packages') as any).select('id').eq('slug', SLUG).maybeSingle()
  let pkgId: string
  if (existing) {
    pkgId = existing.id
    await (supabase.from('packages') as any).update({ name: NAME, category: 'BUMN', is_published: true }).eq('id', pkgId)
    console.log('Paket sudah ada:', pkgId)
  } else {
    const { data, error } = await (supabase.from('packages') as any)
      .insert({
        name: NAME,
        slug: SLUG,
        category: 'BUMN',
        description: 'Simulasi Rekrutmen Bersama BUMN Tahap 2: Tes Bahasa Inggris (Error Recognition, Reading Comprehension, Sentence Completion).',
        duration_minutes: 80,
        total_questions: 85,
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
