'use client'

import { useState, useEffect } from 'react'
import { BookOpen, X, FileText, Clock, CheckCircle2 } from 'lucide-react'

interface AntamKisiKisiModalProps {
  streamName: string
  streamCode: string
  jurusan: string
  topics: { name: string; subtopics: string[] }[]
}

export function AntamKisiKisiModal({
  streamName,
  streamCode,
  jurusan,
  topics,
}: AntamKisiKisiModalProps) {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.body.style.overflow = 'unset'
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/25 text-white text-xs font-bold transition-all shadow-xs backdrop-blur-xs cursor-pointer group shrink-0"
        title="Buka Kisi-Kisi Ujian Teknis"
      >
        <BookOpen className="w-4 h-4 text-amber-300 group-hover:scale-110 transition-transform shrink-0" />
        <span>Lihat Kisi-Kisi Ujian</span>
        <span className="bg-white/20 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">
          {topics.length} Topik
        </span>
      </button>

      {/* Pop-up Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity cursor-pointer"
            onClick={() => setIsOpen(false)}
          />

          {/* Dialog Card */}
          <div className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[88vh] flex flex-col overflow-hidden border border-slate-200 z-10 animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-start justify-between gap-4 bg-gradient-to-r from-slate-50 to-white">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider uppercase bg-[#00315f] text-white">
                    {streamCode}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    ANTAM IMPACT 2026
                  </span>
                </div>
                <h2 className="text-xl font-heading font-extrabold text-slate-900 leading-tight">
                  Kisi-Kisi Ujian Teknis {streamName}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Kualifikasi Jurusan: <span className="font-medium text-slate-700">{jurusan}</span>
                </p>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 grid place-items-center transition-colors shrink-0 cursor-pointer"
                title="Tutup"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Highlights Strip */}
            <div className="px-6 py-2.5 bg-slate-100/80 border-b border-slate-200/80 flex items-center justify-between text-xs text-slate-600 gap-2 flex-wrap">
              <div className="flex items-center gap-1.5 font-medium">
                <FileText className="w-3.5 h-3.5 text-sky-600" />
                <span>Format: <strong>40 Soal CAT</strong></span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>Waktu: <strong>50 Menit</strong></span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Cakupan: <strong>{topics.length} Bidang Topik</strong></span>
              </div>
            </div>

            {/* Scrollable Topics Body */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-3.5 nice-scroll">
              {topics.map((topic, i) => (
                <div
                  key={i}
                  className="bg-slate-50/70 hover:bg-slate-50 rounded-2xl p-4 border border-slate-200/80 transition-all duration-150"
                >
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-lg bg-white shadow-xs border border-slate-200/80 text-[#00315f] text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <h3 className="text-sm font-bold text-slate-900 leading-snug">
                          {topic.name}
                        </h3>
                        <span className="text-[11px] font-semibold text-slate-400">
                          {topic.subtopics.length} Sub-topik
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mt-2.5">
                        {topic.subtopics.map((sub, sIdx) => (
                          <span
                            key={sIdx}
                            className="inline-flex items-center gap-1.5 text-xs text-slate-700 bg-white border border-slate-200 rounded-lg px-2.5 py-1 shadow-2xs"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0" />
                            {sub}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer with Paraphrased Note */}
            <div className="p-5 border-t border-slate-100 bg-slate-50/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <p className="text-[11.5px] text-slate-500 italic leading-relaxed flex-1">
                *Rangkuman kisi-kisi dan materi teknis ini dirumuskan secara komprehensif berdasarkan silabus standar kompetensi industri pertambangan serta dihimpun dari pengalaman dan evaluasi langsung para peserta seleksi ujian teknis (CAT) periode sebelumnya.
              </p>
              <button
                onClick={() => setIsOpen(false)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer shrink-0 shadow-xs"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
