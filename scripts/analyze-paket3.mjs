import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const env = fs.readFileSync('D:/Soal/ClaudeProject-web/.env.local', 'utf-8')
const get = (k) => {
  const m = env.split('\n').find((l) => l.startsWith(k + '='))
  return m ? m.split('=').slice(1).join('=') : null
}
const supabase = createClient(get('NEXT_PUBLIC_SUPABASE_URL'), get('SUPABASE_SERVICE_ROLE_KEY'))

const L = (s) => (s || '').length

async function main() {
  const { data: pkgs, error } = await supabase
    .from('packages')
    .select('id, name, slug, total_questions, is_published')
    .like('slug', 'antam-%-paket-3')

  if (error) {
    console.error('ERR packages:', error.message)
    return
  }
  if (!pkgs.length) {
    console.log('Tidak ada antam paket-3 ditemukan')
    return
  }

  let totalQ = 0
  let totalFlag = 0
  const perStream = {}

  for (const p of pkgs.sort((a, b) => a.slug.localeCompare(b.slug))) {
    const { data: qs, error: qErr } = await supabase
      .from('questions')
      .select('id, order_index, options, correct_answer, category, difficulty')
      .eq('package_id', p.id)

    if (qErr) {
      console.log(`${p.slug} :: ERR ${qErr.message}`)
      continue
    }

    const stream = p.slug.replace('-paket-3', '').replace('antam-', '')
    const flags = []
    for (const q of qs) {
      const c = q.options.find((o) => o.key === q.correct_answer)
      if (!c) continue
      const d = q.options.filter((o) => o.key !== q.correct_answer).map((o) => L(o.text))
      const mx = Math.max(...d)
      const cl = L(c.text)
      const ratio = cl / mx
      if (ratio >= 1.6) {
        flags.push({ order: q.order_index, ratio: +ratio.toFixed(2), cLen: cl, maxD: mx, dist: d, text: c.text })
      }
    }

    totalQ += qs.length
    totalFlag += flags.length
    perStream[stream] = { total: qs.length, flagged: flags.length }

    console.log(`\n=== ${p.slug} (${p.name}) | soal: ${qs.length} | flagged>=1.6x: ${flags.length} ===`)
    flags.sort((a, b) => b.ratio - a.ratio)
    for (const f of flags) {
      console.log(`  #${f.order} ratio=${f.ratio}x cLen=${f.cLen} maxD=${f.maxD} dist=${JSON.stringify(f.dist)}`)
      console.log(`     KUNCI: ${f.text}`)
    }
  }

  console.log('\n\n=== RINGKASAN PER STREAM ===')
  console.log('Stream'.padEnd(14), 'Soal', 'Flagged')
  for (const [s, v] of Object.entries(perStream)) {
    console.log(s.padEnd(14), String(v.total).padEnd(6), v.flagged)
  }
  console.log(`\nTOTAL antam paket-3: ${pkgs.length} paket | ${totalQ} soal | ${totalFlag} flagged`)
}

main()
