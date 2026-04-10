#!/usr/bin/env node
/**
 * import-soal.js
 *
 * Konversi file JSON soal → SQL migration yang bisa dijalankan di Supabase Studio.
 *
 * Usage:
 *   node scripts/import-soal.js <path-ke-file-json>
 *
 * Contoh:
 *   node scripts/import-soal.js soal-import/seri1-twk.json
 */

const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

// ── Validasi argumen ─────────────────────────────────────────────────────────
const inputFile = process.argv[2]
if (!inputFile) {
  console.error('❌  Harap sertakan path ke file JSON.')
  console.error('    Contoh: node scripts/import-soal.js soal-import/seri1-twk.json')
  process.exit(1)
}

const inputPath = path.resolve(process.cwd(), inputFile)
if (!fs.existsSync(inputPath)) {
  console.error(`❌  File tidak ditemukan: ${inputPath}`)
  process.exit(1)
}

// ── Baca & parse JSON ────────────────────────────────────────────────────────
let data
try {
  const raw = fs.readFileSync(inputPath, 'utf-8')
  data = JSON.parse(raw)
} catch (err) {
  console.error('❌  Gagal parse JSON:', err.message)
  process.exit(1)
}

const { package_slug, soal } = data

if (!package_slug || !Array.isArray(soal) || soal.length === 0) {
  console.error('❌  Format JSON tidak valid. Pastikan ada "package_slug" dan array "soal".')
  process.exit(1)
}

// ── Validasi setiap soal ─────────────────────────────────────────────────────
const VALID_KEYS = ['A', 'B', 'C', 'D', 'E']
const VALID_DIFFICULTY = ['easy', 'medium', 'hard']
const errors = []

soal.forEach((s, i) => {
  const num = i + 1
  if (!s.konten) errors.push(`Soal #${num}: "konten" wajib diisi.`)
  if (!s.pilihan || typeof s.pilihan !== 'object') errors.push(`Soal #${num}: "pilihan" harus berupa objek.`)
  if (!VALID_KEYS.includes(s.jawaban_benar)) errors.push(`Soal #${num}: "jawaban_benar" harus A/B/C/D/E.`)
  if (s.kesulitan && !VALID_DIFFICULTY.includes(s.kesulitan)) errors.push(`Soal #${num}: "kesulitan" harus easy/medium/hard.`)
})

if (errors.length > 0) {
  console.error('❌  Terdapat kesalahan validasi:')
  errors.forEach(e => console.error('   •', e))
  process.exit(1)
}

// ── Escape SQL string ────────────────────────────────────────────────────────
function esc(str) {
  if (!str) return 'NULL'
  return `'${String(str).replace(/'/g, "''")}'`
}

// ── Generate SQL ─────────────────────────────────────────────────────────────
const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
const baseFilename = path.basename(inputFile, path.extname(inputFile))
const outputFilename = `${timestamp}_import_${baseFilename}.sql`
const outputDir = path.resolve(process.cwd(), 'supabase/migrations')
const outputPath = path.join(outputDir, outputFilename)

fs.mkdirSync(outputDir, { recursive: true })

const lines = []
lines.push(`-- ============================================================`)
lines.push(`-- Import Soal: ${baseFilename}`)
lines.push(`-- Package slug: ${package_slug}`)
lines.push(`-- Dibuat: ${new Date().toLocaleString('id-ID')}`)
lines.push(`-- Jumlah soal: ${soal.length}`)
lines.push(`-- ============================================================`)
lines.push(``)
lines.push(`do $$`)
lines.push(`declare`)
lines.push(`  v_package_id uuid;`)
lines.push(`begin`)
lines.push(`  -- Ambil package_id dari slug`)
lines.push(`  select id into v_package_id from public.packages where slug = ${esc(package_slug)};`)
lines.push(``)
lines.push(`  if v_package_id is null then`)
lines.push(`    raise exception 'Package dengan slug "${package_slug}" tidak ditemukan. Pastikan package sudah ada di database.';`)
lines.push(`  end if;`)
lines.push(``)
lines.push(`  -- Insert soal-soal`)

soal.forEach((s, i) => {
  const options = VALID_KEYS
    .filter(k => s.pilihan[k])
    .map(k => ({ key: k, text: s.pilihan[k] }))
  const optionsJson = JSON.stringify(options).replace(/'/g, "''")
  const orderIndex = s.nomor ?? (i + 1)
  const difficulty = VALID_DIFFICULTY.includes(s.kesulitan) ? s.kesulitan : 'medium'
  const category = s.kategori ? esc(s.kategori) : 'NULL'
  const explanation = s.pembahasan ? esc(s.pembahasan) : 'NULL'
  const imageUrl = s.gambar_url ? esc(s.gambar_url) : 'NULL'

  lines.push(`  insert into public.questions`)
  lines.push(`    (package_id, content, options, correct_answer, explanation, difficulty, category, image_url, order_index)`)
  lines.push(`  values`)
  lines.push(`    (v_package_id, ${esc(s.konten)}, '${optionsJson}'::jsonb, ${esc(s.jawaban_benar)}, ${explanation}, '${difficulty}', ${category}, ${imageUrl}, ${orderIndex})`)
  lines.push(`  on conflict do nothing;`)
  lines.push(``)
})

lines.push(`  raise notice 'Berhasil import % soal untuk package "%"', ${soal.length}, ${esc(package_slug)};`)
lines.push(`end $$;`)

fs.writeFileSync(outputPath, lines.join('\n'), 'utf-8')

console.log(`✅  Berhasil! File SQL dibuat:`)
console.log(`   ${outputPath}`)
console.log(``)
console.log(`📋  Langkah selanjutnya:`)
console.log(`   1. Buka Supabase Studio → SQL Editor`)
console.log(`   2. Copy-paste isi file di atas, lalu Run`)
console.log(`   3. Atau gunakan: npx supabase db push (jika Supabase CLI dikonfigurasi)`)
console.log(``)
console.log(`📊  Ringkasan:`)
console.log(`   Package : ${package_slug}`)
console.log(`   Soal    : ${soal.length} soal`)

const byKategori = {}
soal.forEach(s => {
  const k = s.kategori ?? 'Tidak ada kategori'
  byKategori[k] = (byKategori[k] || 0) + 1
})
Object.entries(byKategori).forEach(([k, v]) => {
  console.log(`   ${k.padEnd(8)}: ${v} soal`)
})
