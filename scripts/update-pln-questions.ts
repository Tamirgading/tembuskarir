import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { resolve } from 'path'

const envPath = resolve(process.cwd(), '.env.local')
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
  console.log('Fetching TKD1 and TKD2-SILOGISME questions for PLN packages...')
  const { data: pkgs } = await (supabase.from('packages') as any).select('id').in('slug', ['gat-pln-tahap-1', 'gat-pln-tahap-1-demo'])
  if (!pkgs || pkgs.length === 0) return console.log('No packages found')

  const pkgIds = pkgs.map((p: any) => p.id)

  const { data: qs, error } = await (supabase.from('questions') as any)
    .select('*')
    .in('package_id', pkgIds)
    .in('category', ['TKD1', 'TKD2-SILOGISME'])

  if (error) return console.error(error)

  const tkd1 = qs.filter((q: any) => q.category === 'TKD1')
  const silogisme = qs.filter((q: any) => q.category === 'TKD2-SILOGISME')

  console.log(`Found ${tkd1.length} TKD1 and ${silogisme.length} Silogisme questions.`)

  let updatedTkd1 = 0
  let updatedSilogisme = 0

  // Update TKD 1 variety
  // 1. Missing middle
  for (let i = 0; i < Math.min(10, tkd1.length); i++) {
    const q = tkd1[i]
    if (i % 2 === 0) {
      // Middle
      const newContent = "Isilah angka yang kosong di tengah deret berikut:\n\n12, 15, 18, ..., 24, 27"
      const correct = "21"
      const opts = [
        { key: 'A', text: '19' },
        { key: 'B', text: '20' },
        { key: 'C', text: '21' },
        { key: 'D', text: '22' },
        { key: 'E', text: '23' },
      ]
      await (supabase.from('questions') as any).update({ content: newContent, options: opts, correct_answer: 'C', explanation: 'Deret ini merupakan penjumlahan +3 secara konstan. 18 + 3 = 21.' }).eq('id', q.id)
    } else {
      // Wrong number
      const newContent = "Manakah angka yang polanya SALAH pada deret berikut?\n\n5, 10, 15, 22, 25, 30"
      const correct = "22"
      const opts = [
        { key: 'A', text: '5' },
        { key: 'B', text: '10' },
        { key: 'C', text: '15' },
        { key: 'D', text: '22' },
        { key: 'E', text: '25' },
      ]
      await (supabase.from('questions') as any).update({ content: newContent, options: opts, correct_answer: 'D', explanation: 'Deret ini memiliki pola penjumlahan +5 secara konstan. Seharusnya angka setelah 15 adalah 20, bukan 22. Jadi angka yang salah adalah 22.' }).eq('id', q.id)
    }
    updatedTkd1++
  }

  // Update Silogisme to be shorter
  const shortSilogismes = [
    {
      c: "Semua karyawan berdasi. Sebagian karyawan berjas.",
      opts: [
        { key: "A", text: "Sebagian karyawan berdasi dan berjas." },
        { key: "B", text: "Semua karyawan berjas pasti berdasi." },
        { key: "C", text: "Semua karyawan berdasi dan berjas." },
        { key: "D", text: "Sebagian karyawan berdasi namun tidak berjas." },
        { key: "E", text: "A, B, dan D benar." }
      ],
      ans: "E",
      exp: "Kesimpulan silogisme irisan: Sebagian karyawan berdasi dan berjas (A). Karena semua berdasi, maka yang berjas pasti berdasi (B). Sebagian lagi berdasi tapi tidak berjas (D)."
    },
    {
      c: "Tidak ada siswa pemalas yang lulus ujian. Budi adalah siswa pemalas.",
      opts: [
        { key: "A", text: "Budi mungkin lulus ujian." },
        { key: "B", text: "Budi lulus ujian." },
        { key: "C", text: "Budi tidak lulus ujian." },
        { key: "D", text: "Semua siswa lulus ujian." },
        { key: "E", text: "Tidak dapat disimpulkan." }
      ],
      ans: "C",
      exp: "Karena Budi adalah siswa pemalas dan tidak ada yang pemalas lulus, maka Budi pasti tidak lulus ujian."
    },
    {
      c: "Jika hujan turun, maka jalanan basah. Jalanan tidak basah.",
      opts: [
        { key: "A", text: "Hujan turun." },
        { key: "B", text: "Hujan tidak turun." },
        { key: "C", text: "Jalanan kering." },
        { key: "D", text: "Mungkin hujan turun." },
        { key: "E", text: "Hujan deras." }
      ],
      ans: "B",
      exp: "Modus Tollens: p -> q. ~q. Maka ~p (Hujan tidak turun)."
    }
  ]

  for (let i = 0; i < Math.min(15, silogisme.length); i++) {
    const q = silogisme[i]
    const shortQ = shortSilogismes[i % shortSilogismes.length]
    await (supabase.from('questions') as any).update({
      content: shortQ.c,
      options: shortQ.opts,
      correct_answer: shortQ.ans,
      explanation: shortQ.exp
    }).eq('id', q.id)
    updatedSilogisme++
  }

  console.log(`Successfully updated ${updatedTkd1} TKD 1 and ${updatedSilogisme} Silogisme questions.`)
}

main()
