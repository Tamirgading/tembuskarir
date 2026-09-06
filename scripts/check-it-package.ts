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

async function main() {
  const { data, error } = await (supabase.from('packages') as any)
    .select('id, name, slug')
    .eq('slug', 'antam-it')
    .single()

  if (error) {
    console.error('Not found or error:', error.message)
    // Create the package
    const { data: newPkg, error: createErr } = await (supabase.from('packages') as any)
      .insert({
        name: 'ANTAM IMPACT — Information Technology',
        slug: 'antam-it',
        category: 'LAINNYA',
        description: 'Simulasi tes ANTAM IMPACT 2026 untuk stream Information Technology. Materi: Rekayasa Perangkat Lunak, Manajemen Basis Data, Infrastruktur IT & Jaringan, Keamanan Siber, Manajemen Layanan IT.',
        duration_minutes: 50,
        total_questions: 40,
        is_free: false,
        is_published: true,
      })
      .select('id, name, slug')
      .single()
    if (createErr) {
      console.error('Create error:', createErr.message)
    } else {
      console.log('Created:', JSON.stringify(newPkg))
    }
  } else {
    console.log('Found:', JSON.stringify(data))
  }
}

main()
