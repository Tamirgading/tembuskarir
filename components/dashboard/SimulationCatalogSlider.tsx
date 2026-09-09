'use client'

import React, { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'

interface CatalogItem {
  id: string
  title: string
  subtitle: string
  desc: string
  meta: string
  duration: string
  image: string
  badge: string
  badgeClass: string
  tag: string
  available: boolean
  href?: string
}

const CATALOG_ITEMS: CatalogItem[] = [
  {
    id: 'antam',
    title: 'ANTAM IMPACT 2026',
    subtitle: 'PT Aneka Tambang',
    desc: 'Uji kompetensi Integrated Miners Program, reasoning logic, dan work culture fit.',
    meta: '14 Job Stream • 40 Soal',
    duration: '±50 Menit',
    image: '/card-antam.png',
    badge: 'Update Terbaru',
    badgeClass: 'bg-[#16487e] text-white',
    tag: 'Tersedia Gratis',
    available: true,
    href: '/portal/antam',
  },
  {
    id: 'astra',
    title: 'Psikotes Astra International',
    subtitle: 'Astra International',
    desc: 'Tes penalaran analitis, logika deret, ketelitian spasial, dan verbal khas Astra Group.',
    meta: '80 Soal • 7 Subtes',
    duration: '±41 Menit',
    image: '/card-astra.jpg',
    badge: 'Paling Populer',
    badgeClass: 'bg-[#16487e] text-white',
    tag: 'Tersedia Gratis',
    available: true,
    href: '/portal/astra',
  },
  {
    id: 'pln',
    title: 'Rekrutmen PLN Group 2025',
    subtitle: 'PT PLN (Persero)',
    desc: 'Simulasi General Aptitude Test (GAT) dan Uji Kemampuan Akademik teknis terstandar rekrutmen PLN.',
    meta: 'GAT & Akademik (Tahap 1–2)',
    duration: '±60 Menit',
    image: '/card-pln.jpg',
    badge: 'Segera Hadir',
    badgeClass: 'bg-slate-600 text-white',
    tag: 'Coming Soon',
    available: false,
  },
  {
    id: 'bumn',
    title: 'Rekrutmen Bersama BUMN',
    subtitle: 'BUMN Group',
    desc: 'Kombinasi Tes Kemampuan Dasar (TKD), Tes Core Values AKHLAK, dan Wawasan Kebangsaan.',
    meta: 'TKD • AKHLAK • WBI',
    duration: '±75 Menit',
    image: '/card-bumn.jpeg',
    badge: 'Segera Hadir',
    badgeClass: 'bg-slate-600 text-white',
    tag: 'Coming Soon',
    available: false,
  },
]

export default function SimulationCatalogSlider() {
  const sliderRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const checkScroll = () => {
    if (!sliderRef.current) return
    const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current
    setCanScrollLeft(scrollLeft > 10)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
  }

  useEffect(() => {
    checkScroll()
    const el = sliderRef.current
    if (el) {
      el.addEventListener('scroll', checkScroll, { passive: true })
      window.addEventListener('resize', checkScroll)
    }
    return () => {
      if (el) el.removeEventListener('scroll', checkScroll)
      window.removeEventListener('resize', checkScroll)
    }
  }, [])

  const scroll = (direction: 'left' | 'right') => {
    if (!sliderRef.current) return
    const scrollAmount = 350
    sliderRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    })
  }

  return (
    <div className="space-y-4">
      {/* Header with Title and Prev/Next Navigation */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-[#16487e] tracking-tight">
            Rekomendasi Simulasi untuk Target Kariermu
          </h2>
          <p className="text-sm text-slate-500">
            Sesuai kisi-kisi tes resmi dan batch rekrutmen aktif saat ini.
          </p>
        </div>

        {/* Carousel Prev/Next Buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            aria-label="Geser ke kiri"
            className="w-8 h-8 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-700 hover:bg-slate-50 hover:border-[#389add] hover:text-[#16487e] disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-xs cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            aria-label="Geser ke kanan"
            className="w-8 h-8 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-700 hover:bg-slate-50 hover:border-[#389add] hover:text-[#16487e] disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-xs cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Scrollable Slider */}
      <div
        ref={sliderRef}
        className="flex gap-5 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scroll-smooth no-scrollbar select-none -mx-4 px-4 sm:mx-0 sm:px-0"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {CATALOG_ITEMS.map((item) => (
          <div
            key={item.id}
            className={`w-[285px] sm:w-[320px] md:w-[335px] shrink-0 snap-start flex flex-col justify-between bg-white rounded-2xl border ${
              item.available
                ? 'border-slate-100 shadow-[0_2px_12px_rgba(22,72,126,0.04)] hover:shadow-[0_8px_24px_rgba(22,72,126,0.12)] hover:border-[#389add]/40 group'
                : 'border-slate-200/90 shadow-sm opacity-85'
            } overflow-hidden transition-all duration-300`}
          >
            {/* Card Image Banner */}
            <div>
              <div className="relative h-44 overflow-hidden bg-slate-100">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 285px, 335px"
                  className={`object-cover ${
                    item.available
                      ? 'group-hover:scale-105 transition-transform duration-500 ease-out'
                      : 'grayscale'
                  }`}
                />
                <div
                  className={`absolute inset-0 ${
                    item.available
                      ? 'bg-gradient-to-t from-black/75 via-black/20 to-transparent'
                      : 'bg-gradient-to-t from-slate-950/80 via-slate-900/30 to-transparent'
                  }`}
                />
                <span
                  className={`absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-[11px] font-bold shadow-xs ${item.badgeClass}`}
                >
                  {item.badge}
                </span>
                <span className="absolute bottom-3 left-3 text-white text-sm font-bold flex items-center gap-1 drop-shadow-sm">
                  {item.subtitle}
                </span>
              </div>

              {/* Card Content Body */}
              <div className="p-4 space-y-1">
                <h3
                  className={`font-bold text-base leading-snug ${
                    item.available
                      ? 'text-slate-800 group-hover:text-[#389add] transition-colors'
                      : 'text-slate-500'
                  }`}
                >
                  {item.title}
                </h3>
                <p
                  className={`text-xs leading-relaxed line-clamp-2 ${
                    item.available ? 'text-slate-500' : 'text-slate-400'
                  }`}
                >
                  {item.desc}
                </p>
              </div>
            </div>

            {/* Card Footer Actions */}
            <div className="px-4 pb-4 pt-1">
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="truncate pr-2">{item.meta}</span>
                  <span className="shrink-0">{item.duration}</span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      item.available
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {item.tag}
                  </span>

                  {item.available && item.href ? (
                    <Link
                      href={item.href}
                      className="inline-flex items-center gap-1 py-1.5 px-3 rounded-xl bg-[#16487e] text-white text-xs font-semibold hover:bg-[#389add] transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      Mulai Simulasi <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  ) : (
                    <span className="inline-flex items-center gap-1 py-1.5 px-3 rounded-xl bg-slate-100 text-slate-400 text-xs font-semibold cursor-not-allowed border border-slate-200">
                      🔒 Segera Hadir
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
