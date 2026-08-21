/**
 * import-questions.ts — Import soal dari JSON hasil parse_docx.py ke sebuah paket.
 *
 * Pemakaian:
 *   npx tsx scripts/import-questions.ts --package <slug> --category <kode> --file <soal.json>
 *   npx tsx scripts/import-questions.ts --package <slug> --category <kode> --file <soal.json> --append
 *
 * Tanpa --append: menghapus soal existing pada kategori tsb di paket tsb, lalu insert baru.
 * Dengan --append: menambah soal di akhir (order_index berlanjut) — untuk membangun bank.
 * Format JSON: [{ content, options:[{key,text}], correct_answer, explanation }]
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

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`)
  return i !== -1 ? process.argv[i + 1] : undefined
}

async function main() {
  const slug = arg('package')
  const category = arg('category')
  const file = arg('file')
  const append = process.argv.includes('--append')

  if (!slug || !category || !file) {
    console.error('Usage: npx tsx scripts/import-questions.ts --package <slug> --category <kode> --file <soal.json>')
    process.exit(1)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: pkg } = await (supabase.from('packages') as any)
    .select('id, name')
    .eq('slug', slug)
    .single()
  if (!pkg) {
    console.error(`Paket dengan slug "${slug}" tidak ditemukan.`)
    process.exit(1)
  }

  const questions = JSON.parse(readFileSync(file, 'utf-8')) as {
    content: string
    options: { key: string; text: string }[]
    correct_answer: string
    explanation?: string
  }[]

  // Hapus soal existing kategori tsb di paket ini (kecuali mode append)
  let startIndex = 1
  if (!append) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { count } = await (supabase.from('questions') as any)
      .select('*', { count: 'exact', head: true })
      .eq('package_id', pkg.id)
      .eq('category', category)
    if (count && count > 0) {
      console.log(`Menghapus ${count} soal existing kategori ${category}...`)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase.from('questions') as any).delete().eq('package_id', pkg.id).eq('category', category)
    }
  } else {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { count } = await (supabase.from('questions') as any)
      .select('*', { count: 'exact', head: true })
      .eq('package_id', pkg.id)
      .eq('category', category)
    startIndex = (count ?? 0) + 1
    console.log(`Mode append — order_index mulai dari ${startIndex}`)
  }

  const rows = questions.map((q, i) => ({
    package_id: pkg.id,
    content: q.content.trim(),
    options: q.options,
    correct_answer: q.correct_answer.toUpperCase(),
    explanation: q.explanation?.trim() || null,
    category,
    difficulty: 'medium',
    order_index: startIndex + i,
  }))

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase.from('questions') as any).insert(rows).select('id')
  if (error) {
    console.error('Gagal insert:', error.message)
    process.exit(1)
  }
  console.log(`✅ Paket "${pkg.name}" | kategori ${category}: insert ${data.length} soal`)
}

main()
