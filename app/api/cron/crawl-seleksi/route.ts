import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import os from 'os'

// Gunakan service role untuk bypass RLS saat insert dari cron
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const FIRECRAWL_API_KEY = process.env.FIRECRAWL_API_KEY!
const CRON_SECRET = process.env.CRON_SECRET!

// Sumber crawl per institusi — sinkron dengan tabel crawl_sources
const CRAWL_SOURCES = [
  {
    institusi: 'RBB',
    kategori: 'pengumuman' as const,
    url: 'https://fhcibumn.com/gallery/news',
    label: 'FHCI BUMN - Berita',
  },
  {
    institusi: 'PLN',
    kategori: 'pengumuman' as const,
    url: 'https://web.pln.co.id/karier/informasi-rekrutmen-pln',
    label: 'PLN - Info Rekrutmen',
  },
  {
    institusi: 'OJK',
    kategori: 'pengumuman' as const,
    url: 'https://www.ojk.go.id/id/karir/Pages/default.aspx',
    label: 'OJK - Karir',
  },
]

interface FirecrawlItem {
  judul: string
  ringkasan: string
  url_sumber: string
  tanggal_publikasi: string | null
  konten_lengkap: string
}

// Jalankan firecrawl CLI dan parse hasilnya
function runFirecrawl(url: string): string {
  const tmpFile = path.join(os.tmpdir(), `fc-${Date.now()}.md`)
  try {
    execSync(
      `firecrawl scrape "${url}" --format markdown --output "${tmpFile}"`,
      {
        env: { ...process.env, FIRECRAWL_API_KEY },
        timeout: 30_000,
        stdio: 'pipe',
      }
    )
    if (fs.existsSync(tmpFile)) {
      const content = fs.readFileSync(tmpFile, 'utf-8')
      fs.unlinkSync(tmpFile)
      return content
    }
    return ''
  } catch {
    // Fallback: baca stdout langsung jika output file tidak dibuat
    try {
      const result = execSync(
        `firecrawl scrape "${url}" --format markdown`,
        {
          env: { ...process.env, FIRECRAWL_API_KEY },
          timeout: 30_000,
          stdio: 'pipe',
        }
      )
      return result.toString()
    } catch {
      return ''
    }
  }
}

// Parse markdown dari Firecrawl jadi array item terstruktur
function parseMarkdownItems(
  markdown: string,
  institusi: string
): FirecrawlItem[] {
  const items: FirecrawlItem[] = []

  // Pola: heading ## diikuti link, tanggal, dan ringkasan
  const articleRegex =
    /##\s+\[(.+?)\]\((https?:\/\/[^\)]+)\)[\s\S]*?-\s*(\d{2}\/\d{2}\/\d{4})[\s\S]*?\n([^\n\[]{20,200})/g

  let match
  while ((match = articleRegex.exec(markdown)) !== null) {
    const [, judul, url_sumber, tanggal_raw, ringkasan] = match

    // Parse tanggal dari format DD/MM/YYYY ke ISO
    let tanggal_publikasi: string | null = null
    if (tanggal_raw) {
      const [dd, mm, yyyy] = tanggal_raw.split('/')
      tanggal_publikasi = `${yyyy}-${mm}-${dd}`
    }

    items.push({
      judul: judul.trim(),
      ringkasan: ringkasan.trim().replace(/\[.*?\]/g, '').trim(),
      url_sumber,
      tanggal_publikasi,
      konten_lengkap: markdown.substring(
        match.index,
        Math.min(match.index + 2000, markdown.length)
      ),
    })
  }

  // Fallback: jika regex gagal, simpan seluruh markdown sebagai satu item
  if (items.length === 0 && markdown.length > 100) {
    items.push({
      judul: `Update ${institusi} — ${new Date().toLocaleDateString('id-ID')}`,
      ringkasan: markdown.substring(0, 300).replace(/[#\[\]]/g, '').trim(),
      url_sumber: '',
      tanggal_publikasi: new Date().toISOString().split('T')[0],
      konten_lengkap: markdown,
    })
  }

  return items
}

// Insert ke Supabase, skip duplikat (by url_hash)
async function upsertItems(
  items: FirecrawlItem[],
  institusi: string,
  kategori: string
): Promise<{ inserted: number; skipped: number }> {
  let inserted = 0
  let skipped = 0

  for (const item of items) {
    if (!item.url_sumber && !item.judul) continue

    const { error } = await supabase
      .from('info_seleksi')
      .insert({
        institusi,
        kategori,
        judul: item.judul,
        ringkasan: item.ringkasan,
        konten_lengkap: item.konten_lengkap,
        url_sumber: item.url_sumber || null,
        tanggal_publikasi: item.tanggal_publikasi,
      })
      .select()

    if (error) {
      // Error 23505 = unique violation = duplikat URL → skip
      if (error.code === '23505') {
        skipped++
      } else {
        console.error(`[crawl] insert error for ${item.judul}:`, error.message)
      }
    } else {
      inserted++
    }
  }

  return { inserted, skipped }
}

export async function GET(request: Request) {
  // Verifikasi cron secret (Vercel mengirim header ini)
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const startTime = Date.now()
  const results: Array<{
    institusi: string
    url: string
    status: string
    items_found: number
    inserted: number
    skipped: number
    error?: string
    duration_ms: number
  }> = []

  for (const source of CRAWL_SOURCES) {
    const t0 = Date.now()
    let status: 'success' | 'failed' | 'partial' = 'success'
    let items_found = 0
    let inserted = 0
    let skipped = 0
    let error_message: string | undefined

    try {
      console.log(`[crawl] Scraping ${source.institusi}: ${source.url}`)

      const markdown = runFirecrawl(source.url)
      if (!markdown) throw new Error('Empty response from Firecrawl')

      const items = parseMarkdownItems(markdown, source.institusi)
      items_found = items.length

      if (items.length === 0) {
        status = 'partial'
        error_message = 'No items parsed from markdown'
      } else {
        const counts = await upsertItems(items, source.institusi, source.kategori)
        inserted = counts.inserted
        skipped = counts.skipped
      }
    } catch (err) {
      status = 'failed'
      error_message = err instanceof Error ? err.message : String(err)
      console.error(`[crawl] Error for ${source.institusi}:`, error_message)
    }

    const duration_ms = Date.now() - t0

    // Simpan log ke Supabase
    await supabase.from('crawl_log').insert({
      institusi: source.institusi,
      url_target: source.url,
      status,
      items_found,
      items_inserted: inserted,
      items_skipped: skipped,
      error_message,
      duration_ms,
    })

    results.push({
      institusi: source.institusi,
      url: source.url,
      status,
      items_found,
      inserted,
      skipped,
      error: error_message,
      duration_ms,
    })
  }

  return NextResponse.json({
    success: true,
    total_duration_ms: Date.now() - startTime,
    ran_at: new Date().toISOString(),
    results,
  })
}
