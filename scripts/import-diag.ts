/**
 * import-diag.ts — Import soal berbasis gambar (Diagram Reasoning) ke paket.
 *
 * Pemakaian:
 *   npx tsx scripts/import-diag.ts \
 *     --package <slug> --category <kode> \
 *     --keys <keys.json> --images <folder> --prefix <prefix>
 *
 * keys.json: [{ key, explanation }] (hasil scripts/parse_diag.py), urut 1..n
 * images: folder berisi 01.png, 02.png, ... (hasil ekstrak media docx)
 * prefix: awalan nama file di storage (mis. rbb-diag1)
 */
import { createClient } from '@supabase/supabase-js'
import { readFileSync, readdirSync, writeFileSync, existsSync } from 'fs'
import { resolve, join } from 'path'

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

const BUCKET = 'question-images'

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`)
  return i !== -1 ? process.argv[i + 1] : undefined
}

async function main() {
  const slug = arg('package')
  const category = arg('category')
  const keysFile = arg('keys')
  const imagesFolder = arg('images')
  const prefix = arg('prefix')
  const append = process.argv.includes('--append')

  if (!slug || !category || !keysFile || !imagesFolder || !prefix) {
    console.error('Usage: --package <slug> --category <kode> --keys <keys.json> --images <folder> --prefix <prefix>')
    process.exit(1)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: pkg } = await (supabase.from('packages') as any)
    .select('id, name')
    .eq('slug', slug)
    .single()
  if (!pkg) { console.error(`Paket "${slug}" tidak ditemukan.`); process.exit(1) }

  const keys = JSON.parse(readFileSync(keysFile, 'utf-8')) as { key: string; explanation?: string }[]

  // Urutkan file gambar (01.png, 02.png, ...)
  const files = readdirSync(imagesFolder)
    .filter((f) => /\.(png|jpe?g|gif|webp)$/i.test(f))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))

  if (files.length < keys.length) {
    console.error(`Gambar (${files.length}) < kunci (${keys.length}). Periksa folder.`)
    process.exit(1)
  }

  // Upload & insert
  let startIndex = 1
  if (append) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { count } = await (supabase.from('questions') as any)
      .select('*', { count: 'exact', head: true })
      .eq('package_id', pkg.id)
      .eq('category', category)
    startIndex = (count ?? 0) + 1
  }
  const rows: Record<string, unknown>[] = []
  for (let i = 0; i < keys.length; i++) {
    const imgPath = join(imagesFolder, files[i])
    const bytes = readFileSync(imgPath)
    const ext = files[i].split('.').pop()!.toLowerCase()
    const storagePath = `questions/${prefix}-${String(i + 1).padStart(2, '0')}.${ext}`

    const { error: upErr } = await supabase.storage.from(BUCKET).upload(storagePath, bytes, {
      contentType: `image/${ext === 'jpg' ? 'jpeg' : ext}`,
      upsert: true,
    })
    if (upErr) {
      console.error(`Upload ${files[i]} gagal:`, upErr.message)
      process.exit(1)
    }
    const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(storagePath)

    rows.push({
      package_id: pkg.id,
      content: 'Perhatikan gambar berikut, kemudian pilih jawaban yang paling tepat.',
      options: ['A', 'B', 'C', 'D', 'E'].map((k) => ({ key: k, text: k })),
      correct_answer: keys[i].key,
      explanation: keys[i].explanation || null,
      category,
      difficulty: 'medium',
      order_index: startIndex + i,
      image_url: urlData.publicUrl,
    })
  }

  // Hapus existing kategori tsb di paket ini (kecuali mode append)
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
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase.from('questions') as any).insert(rows).select('id')
  if (error) {
    console.error('Gagal insert:', error.message)
    process.exit(1)
  }
  console.log(`✅ Paket "${pkg.name}" | ${category}: insert ${data.length} soal gambar`)

  // Simpan daftar URL untuk referensi
  const listPath = resolve(__dirname, `../data/diag-${prefix}-urls.json`)
  writeFileSync(listPath, JSON.stringify(rows.map((r) => r.image_url), null, 1))
  console.log('URL list ->', listPath)
}

main()
