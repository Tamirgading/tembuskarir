# DESIGN.md — TembusKarir Design System

> Dokumen referensi untuk desain visual platform TembusKarir.
> Update file ini setiap ada keputusan desain baru yang berdampak luas.

---

## Identitas Visual

TembusKarir menggunakan pendekatan **modern + fungsional**: tampilan bersih dan terpercaya seperti produk profesional, dengan aksen **Navy Blue** dan **Light Blue** — menandakan profesionalisme, kepercayaan, dan teknologi.

**Sidebar** memakai warna dasar putih atau abu-abu terang sesuai dengan skema terang (Light Mode).

---

## Warna

### Brand — Navy & Light Blue

| Token | Hex | Penggunaan |
|---|---|---|
| `brand-50` | `#f0f9ff` | Background tint sangat terang |
| `brand-100` | `#e0f2fe` | Background badge/chip |
| `brand-200` | `#9be1fd` | `brand-light` - Aksen terang/glow |
| `brand-400` | `#389add` | `brand-accent` - Aksen interaktif, sekunder |
| `brand-500` | `#0284c7` | Hover state ringan |
| **`brand` / `brand-600`** | **`#16487e`** | **`brand-dark` - CTA utama, teks header, identitas utama** |
| `brand-700` | `#103762` | Hover CTA |
| `brand-950` | `#082f49` | Teks sangat gelap |

### Netral

| Token | Hex | Penggunaan |
|---|---|---|
| `paper` | `#F8FAFC` | Background halaman |
| `paper-soft` | `#F1F5F9` | Background elemen sekunder (chip, hover) |
| `hairline` | `#E2E8F0` | Border kartu, divider |
| `ink` | `#0F172A` | Teks utama (navy gelap) |
| `ink-soft` | `#334155` | Teks body default |
| `ink-muted` | `#64748B` | Teks keterangan, label sekunder |

### Warna Kategori Ujian

| Kategori | Background token | Teks | Ikon |
|---|---|---|---|
| ASTRA (Psikotes) | `orange-100` | `orange-600` | Briefcase |
| PLN (Rekrutmen) | `brand/10` | `brand` | Zap |
| ANTAM IMPACT | `amber-100` | `amber-600` | Mountain |

### Warna Status

| Status | Background | Teks |
|---|---|---|
| Benar / Sukses | `green-50`, `green-100` | `green-700` |
| Salah / Error | `red-50`, `red-100` | `red-700` |
| Peringatan / Pending | `yellow-50`, `yellow-100` | `yellow-700` |
| Netral / Kosong | `paper-soft` | `ink-muted` |
| Premium aktif | `brand/10` | `brand-700` |

---

## Tipografi

TembusKarir menggunakan **Plus Jakarta Sans** sebagai font tunggal utama untuk menciptakan kesan modern, bersih, dan konsisten.

| Peran | Font | Variable | Class |
|---|---|---|---|
| Body & UI | Plus Jakarta Sans | `--font-sans` | `font-sans` (default) |
| Heading / Display | Plus Jakarta Sans | `--font-sans` | `font-sans` |
| Angka / Skor / Timer | Plus Jakarta Sans | `--font-sans` | `font-sans` |

### Aturan Penggunaan

- **`font-heading`**: semua `<h1>`–`<h6>`, judul kartu, nama halaman. Letter spacing `-0.01em`.
- **`font-num`**: skor, timer, angka statistik. Selalu `tabular-nums` agar digit tidak meloncat saat update.
- **`font-sans`**: semua teks body, label, deskripsi.

### Skala Ukuran yang Umum Dipakai

| Konteks | Ukuran |
|---|---|
| Heading hero (`h1`) | `text-3xl` – `text-[42px]` |
| Judul kartu | `text-lg` / `font-bold` |
| Body | `text-sm` (14px) |
| Label sekunder | `text-xs` (12px) |
| Micro label / eyebrow | `text-[11px]` uppercase tracking-wider |
| Keterangan terkecil | `text-[10px]` – `text-[9px]` |

---

## Spasi & Radius

Tailwind defaults dipakai penuh. Yang paling sering muncul:

| Radius | Class | Dipakai untuk |
|---|---|---|
| 8px | `rounded-lg` | Tombol kecil, badge pill dalam tabel |
| 12px | `rounded-xl` | Tombol CTA, input, chip |
| 16px | `rounded-2xl` | Kartu standar |
| 24px | `rounded-3xl` | Hero section, kartu besar |
| penuh | `rounded-full` | Pill badge, avatar |

---

## Bayangan

| Token | Nilai | Dipakai untuk |
|---|---|---|
| `shadow-soft` | `0 4px 20px -2px rgba(15,44,68,0.06)` | Kartu, panel, floating element |
| `shadow-glow` | `0 0 15px rgba(14,159,110,0.30)` | Aksen brand highlight |

---

## Komponen Utama

### Kartu Standar

```tsx
<div className="bg-white rounded-2xl border border-hairline shadow-soft p-5">
```

### Kartu Interaktif (hover terangkat)

```tsx
<div className="bg-white rounded-2xl border border-hairline shadow-soft p-5 card-hover hover:border-brand/30">
```

### Tombol CTA Primer

```tsx
<button className="inline-flex items-center gap-2 bg-brand text-white font-bold px-5 py-2.5 rounded-xl hover:bg-brand-700 transition-colors">
```

### Tombol Sekunder

```tsx
<button className="inline-flex items-center gap-2 bg-white border border-hairline text-ink font-semibold px-5 py-2.5 rounded-xl hover:bg-paper-soft transition-colors">
```

### Tombol Outline Brand

```tsx
<button className="inline-flex items-center gap-1.5 text-xs font-bold text-brand border border-brand/30 hover:bg-brand/5 transition-colors px-4 py-2 rounded-xl">
```

### Badge / Pill

```tsx
{/* Status positif */}
<span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-green-100 text-green-700">Benar</span>

{/* Brand */}
<span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-brand-700 bg-brand/10 border border-brand/20 rounded-full px-3 py-1">
  Label
</span>
```

### Section Label (eyebrow)

```tsx
<SectionLabel>Judul Seksi</SectionLabel>
{/* → uppercase, tracking-wider, text-[11px] font-bold text-ink-muted */}
```

### Ikon — lucide-react

**Wajib lucide-react** untuk semua ikon UI. Tidak boleh pakai emoji keyboard sebagai ikon fungsional (emoji hanya untuk konten teks kontekstual).

Ukuran standar: `w-4 h-4` (inline), `w-5 h-5` (kartu), `w-6 h-6` (hero/KPI).

---

## Animasi & Transisi

### Entrance

```css
.fade-up {
  animation: tk-fade-up 0.55s cubic-bezier(0.2, 0.7, 0.2, 1) both;
}
/* from: opacity 0 + translateY(10px) → to: opacity 1 + none */
```

Dipakai di setiap page container (`<div className="... fade-up">`).

### Card Hover

```css
.card-hover:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 4px rgba(15,44,68,0.05), 0 18px 40px -18px rgba(15,44,68,0.22);
}
transition: 0.25s cubic-bezier(0.2, 0.7, 0.2, 1)
```

### Transition Default

```
transition-colors  — untuk perubahan warna (hover button, link)
duration 150–200ms, ease default
```

### Aksesibilitas

- `prefers-reduced-motion`: `fade-up` dan `card-hover` dinonaktifkan.
- Focus visible: `outline 2px solid #0E9F6E`, `outline-offset 2px`, `border-radius 8px`.

---

## Background Halaman

```css
body background: var(--paper) = #F7F6F2
```

Halaman dengan konten lebar menggunakan `bg-grid-slate` (grid garis hangat 40×40px) sebagai texture ringan.

---

## Layout & Grid

- **Lebar konten utama**: `max-w-5xl mx-auto` (1024px)
- **Admin panel**: full-width dengan padding minimal
- **Spacing antar section**: `space-y-5` – `space-y-10`
- **Grid kartu 3 kolom**: `grid grid-cols-1 sm:grid-cols-3 gap-4`
- **Grid 2 kolom asimetris**: `grid grid-cols-1 lg:grid-cols-[1.15fr_.85fr]`

---

## Pola Warna Dark Mode

Saat ini platform **belum mengimplementasikan dark mode** secara eksplisit. Body background `paper` dan kartu `white` digunakan tanpa `dark:` prefix. Jika dark mode ditambahkan di masa mendatang, token warna di atas perlu di-remap.

---

## Keputusan Desain

| Tanggal | Keputusan | Alasan |
|---|---|---|
| Sprint 1 | Emerald sebagai brand, bukan biru generik | Diferensiasi dari kompetitor SaaS biru; "tumbuh" sesuai misi |
| Sprint 6 | Remap `blue`/`indigo` → emerald di Tailwind | Eliminasi biru generik dari kodebase tanpa refactor manual |
| Sprint 6 | Sidebar gradasi navy→emerald | Identitas kuat tanpa banner gambar |
| Sprint 6 | lucide-react untuk semua ikon | Konsistensi stroke & ukuran; tidak ada emoji-sebagai-ikon |
| Sprint 6 | Bricolage Grotesque untuk heading | Berkarakter editorial, anti-generik (bukan Inter/Geist) |
| Sprint 6 | Space Grotesk untuk angka | Tabular nums presisi untuk skor & timer |
| Agu 2026 | hero.png sebagai ilustrasi beranda guest | Gambar AI-generated tunggal, tidak di-overlay HTML |
