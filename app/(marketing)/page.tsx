'use client'

import React, { useEffect } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import { motion } from 'framer-motion'

const DataStreamBackground = () => {
  const streams = Array.from({ length: 15 });
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 opacity-40">
      {streams.map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-px bg-gradient-to-r from-transparent via-[#389add] to-transparent"
          style={{
            top: `${(i + 1) * 6}%`,
            width: `${Math.random() * 30 + 10}%`,
            opacity: Math.random() * 0.6 + 0.2,
          }}
          animate={{
            x: ['-100vw', '100vw'],
          }}
          transition={{
            duration: Math.random() * 8 + 8,
            repeat: Infinity,
            ease: 'linear',
            delay: Math.random() * -15,
          }}
        />
      ))}
    </div>
  );
};

const GridMotionBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 opacity-[0.07]">
      <motion.div 
        className="absolute inset-0"
        style={{
          backgroundImage: 'linear-gradient(#16487e 1px, transparent 1px), linear-gradient(90deg, #16487e 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
        animate={{
          y: [0, 40],
          x: [0, 40]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      <div className="absolute inset-0 bg-white" style={{ maskImage: 'radial-gradient(circle at center, transparent 0%, black 80%)', WebkitMaskImage: 'radial-gradient(circle at center, transparent 0%, black 80%)' }}></div>
    </div>
  )
}

const BreathingGlowBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <motion.div
        className="absolute top-0 left-1/4 w-[600px] h-[400px] bg-[#9be1fd]/20 rounded-full blur-3xl"
        animate={{
          x: [-30, 30, -30],
          y: [-10, 20, -10],
          opacity: [0.3, 0.6, 0.3],
          scale: [1, 1.05, 1]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 right-1/4 w-[500px] h-[300px] bg-[#389add]/10 rounded-full blur-3xl"
        animate={{
          x: [30, -30, 30],
          y: [10, -20, 10],
          opacity: [0.2, 0.5, 0.2],
          scale: [1, 1.1, 1]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
    </div>
  )
}

export default function StitchLandingPage() {
  // Intersection Observer for the .motion-reveal elements (from Stitch AI's vanilla JS)
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.15
    }

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed')
          observer.unobserve(entry.target)
        }
      })
    }, observerOptions)

    const elements = document.querySelectorAll('.motion-reveal')
    elements.forEach(el => revealObserver.observe(el))

    return () => {
      elements.forEach(el => revealObserver.unobserve(el))
    }
  }, [])

  return (
    <div className="min-h-screen flex flex-col antialiased selection:bg-[#389add] selection:text-white bg-white font-sans text-[#1e293b]">
      
      {/* 
        Menyisipkan style khusus dari Stitch AI. 
        Kita bisa menaruhnya di sini menggunakan <style> bawaan React.
      */}
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        
        .font-sans {
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-9px) rotate(0.5deg); }
        }
        @keyframes float-reverse {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(8px) rotate(-0.5deg); }
        }
        .animate-float-1 { animation: float-slow 5s ease-in-out infinite; }
        .animate-float-2 { animation: float-reverse 6s ease-in-out infinite 0.5s; }
        .animate-float-3 { animation: float-slow 7s ease-in-out infinite 1s; }
        .animate-float-4 { animation: float-reverse 5.5s ease-in-out infinite 1.5s; }

        .hero-radiant-bg {
          background-color: #ffffff;
          background-image: 
            radial-gradient(circle at 50% 18%, rgba(155, 225, 253, 0.28) 0%, rgba(255, 255, 255, 0) 65%),
            radial-gradient(circle at 15% 45%, rgba(56, 154, 221, 0.08) 0%, rgba(255, 255, 255, 0) 40%),
            radial-gradient(circle at 85% 40%, rgba(22, 72, 126, 0.07) 0%, rgba(255, 255, 255, 0) 40%);
        }

        .motion-reveal {
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
          will-change: opacity, transform;
        }

        .motion-reveal.is-revealed {
          opacity: 1;
          transform: translateY(0);
        }
      `}} />

      {/* BEGIN: TopNavigationBar */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-100 transition-all shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            
            {/* Left: Official Brand Logo & Navigation Links */}
            <div className="flex items-center gap-8">
              <a className="flex items-center group" data-purpose="brand-logo" href="#">
                <img 
                  alt="TembusKarir Logo" 
                  className="h-8 md:h-9 w-auto object-contain transition-transform group-hover:scale-105" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBlity4EwdDcUP9hKJfxU5KMul5B-q8KiVAYZN5_zWKLokxkjvxa6bpCReQoWmm2EyFsSdVWCwsXcoFYHL5UM7zGYMa0A9Dq7fQaNOKCl09Aoih9OIn9WTI5nkFvWATR5-HpLqM_AMugBBHG5nrwaRVqpI0RmqfoR7g-baGlL_FXARE12F74MR54Srt4CqkKtmIFFvs2t1l1h5EQTSEHcgd9URrs95hMO2MSjsVVuigIMsaPXDI2BmSEHxHHdWEBn7f_g"
                />
              </a>
              {/* Desktop Navigation Menu */}
              <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-slate-600">
                <a className="hover:text-[#389add] transition-colors" href="#beranda">Beranda</a>
                <a className="hover:text-[#389add] transition-colors" href="#pilih-tes">Katalog Tes</a>
                <a className="hover:text-[#389add] transition-colors" href="#keunggulan">Kenapa Kami</a>
                <a className="hover:text-[#389add] transition-colors" href="#cara-kerja">Cara Kerja</a>
              </nav>
            </div>

            {/* Right: Auth Action Buttons */}
            <div className="flex items-center gap-3">
              <a className="text-sm font-semibold text-[#16487e] hover:text-[#389add] px-4 py-2 rounded-xl transition-colors" href="/login">
                Masuk
              </a>
              <a className="inline-flex items-center justify-center text-sm font-bold text-white bg-[#16487e] hover:bg-[#389add] px-6 py-2.5 rounded-full shadow-md shadow-[#16487e]/20 hover:shadow-lg transition-all duration-200" href="/register">
                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                </svg>
                Daftar Gratis
              </a>
            </div>

          </div>
        </div>
      </header>

      <main className="flex-grow">
        {/* BEGIN: HeroSection (Kaarira.com Inspired Centered + Floating Cards Layout) */}
        <section className="relative pt-12 pb-12 md:pt-20 md:pb-16 overflow-hidden hero-radiant-bg" id="beranda">
          
          <DataStreamBackground />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            
            {/* Ambient Glow Spheres */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#9be1fd]/30 rounded-full blur-3xl pointer-events-none -z-10"></div>
            
            {/* FLOATING CARDS AROUND HERO (Visible on Desktop / Tablets) */}
            
            {/* Floating Card 1: Top Left (TPD & Skor Evaluasi) */}
            <div className="hidden xl:block absolute -left-8 top-2 w-64 p-4 bg-white/95 rounded-2xl shadow-xl shadow-slate-200/60 border border-[#9be1fd]/60 backdrop-blur-md animate-float-1 z-20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold tracking-wide uppercase px-2.5 py-0.5 rounded-md bg-[#e0f2fe] text-[#16487e]">Simulasi TPD</span>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#389add] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#16487e]"></span>
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-800">Tes Potensi Dasar BUMN</p>
              <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-slate-100">
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">Hasil Evaluasi</span>
                  <span className="text-base font-extrabold text-[#16487e]">82<span className="text-xs text-slate-400 font-normal">/100</span></span>
                </div>
                <span className="inline-flex items-center text-[11px] font-bold px-2 py-1 rounded-full bg-[#e0f2fe] text-[#16487e]">
                  <svg className="w-3 h-3 mr-1 text-[#389add]" fill="currentColor" viewBox="0 0 20 20">
                    <path clipRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" fillRule="evenodd"></path>
                  </svg>
                  Lolos Passing
                </span>
              </div>
            </div>

            {/* Floating Card 2: Top Right (Timer & Panduan Seleksi) */}
            <div className="hidden xl:block absolute -right-8 top-0 w-64 p-4 bg-white/95 rounded-2xl shadow-xl shadow-slate-200/60 border border-[#9be1fd]/60 backdrop-blur-md animate-float-2 z-20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#e0f2fe] text-[#16487e]">Target Seleksi Astra</span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#389add]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#389add] animate-pulse"></span>
                  Terverifikasi
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-900 leading-tight truncate">Psikotes Astra 2026</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Format 7 Subtes</p>
                </div>
              </div>
              <div className="mt-2.5 pt-2 border-t border-slate-100">
                <p className="text-[9px] text-slate-500 leading-tight">
                  Quantitative Reasoning, Deductive Reasoning, Reading Comprehension, Inductive Reasoning, Visualization, Perceptual Speed, Working Memory
                </p>
              </div>
            </div>

            {/* Floating Card 3: Bottom Left (Soal Cepat Preview) */}
            <div className="hidden xl:block absolute -left-4 bottom-2 w-64 p-4 bg-white/95 rounded-2xl shadow-xl shadow-slate-200/60 border border-[#9be1fd]/60 backdrop-blur-md animate-float-3 z-20">
              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 mb-1.5">
                <span>Soal 14/80</span>
                <span className="text-[#389add] font-bold">Penalaran Logis</span>
              </div>
              <p className="text-xs text-slate-700 font-medium line-clamp-2">Pola barisan: 3, 7, 15, 31, ... bilangan berikutnya?</p>
              <div className="mt-2 flex items-center gap-2">
                <div className="w-full py-1 px-2 rounded-md bg-[#e0f2fe] text-[#16487e] text-[11px] font-bold flex items-center justify-between">
                  <span>Jawaban: 63</span>
                  <svg className="w-3.5 h-3.5 text-[#389add]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"></path>
                  </svg>
                </div>
              </div>
            </div>

            {/* Floating Card 4: Bottom Right (Analisis AI) */}
            <div className="hidden xl:block absolute -right-4 bottom-2 w-64 p-4 bg-white/95 rounded-2xl shadow-xl shadow-slate-200/60 border border-[#9be1fd]/60 backdrop-blur-md animate-float-4 z-20">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-6 rounded-lg bg-[#16487e] text-[#9be1fd] flex items-center justify-center">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                    </svg>
                  </div>
                  <span className="text-xs font-bold text-slate-900">Sebaran Nilai Peserta</span>
                </div>
                <span className="text-[10px] font-bold text-[#16487e] bg-[#e0f2fe] px-1.5 py-0.5 rounded">Top 5%</span>
              </div>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-[11px] text-slate-600">Skor Kamu: <span className="font-extrabold text-[#16487e]">86</span><span className="text-[10px] text-slate-400">/100</span></span>
                <span className="text-[10px] text-[#389add] font-bold">Passing: 78+</span>
              </div>
              
              {/* Fake Graph */}
              <div className="mt-2.5 flex items-end gap-1.5 h-7 px-1 pt-1 bg-slate-50 rounded-lg border border-slate-100">
                <div className="flex-1 bg-[#9be1fd]/40 rounded-t h-2.5"></div>
                <div className="flex-1 bg-[#9be1fd]/60 rounded-t h-4"></div>
                <div className="flex-1 bg-[#389add]/60 rounded-t h-5"></div>
                <div className="flex-1 bg-[#389add] rounded-t h-6"></div>
                <div className="flex-1 bg-[#16487e] rounded-t h-full relative group">
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#16487e]"></div>
                </div>
                <div className="flex-1 bg-[#389add]/70 rounded-t h-3.5"></div>
              </div>
              
              <p className="mt-2 text-[10px] text-slate-500 leading-tight">
                Persentil ke-95. Memenuhi kualifikasi wawancara user.
              </p>
            </div>

            {/* CENTERED HERO CONTENT */}
            <div className="max-w-4xl mx-auto text-center relative z-10 pt-4 pb-2">
              
              {/* Category Pill Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#e0f2fe]/90 border border-[#9be1fd] text-[#16487e] text-xs sm:text-sm font-bold shadow-xs hover:bg-[#9be1fd]/40 transition-colors">
                <span className="text-[#389add]">
                  <svg className="w-4 h-4 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                  </svg>
                </span>
                <span>Persiapan Seleksi Karier BUMN &amp; Perusahaan Swasta 2026</span>
              </div>
              
              {/* Big Central Headline */}
              <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.12]">
                Lulus <span className="text-[#16487e]">Seleksi Karir</span> Impian <br className="hidden sm:inline"/>
                <span className="bg-gradient-to-r from-[#16487e] via-[#389add] to-[#16487e] bg-clip-text text-transparent">
                  Paling Bergengsi
                </span> di Indonesia
              </h1>
              
              {/* Subheadline */}
              <p className="mt-5 text-base sm:text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
                Siap sebelum seleksi dimulai. Akses modul simulasi berwaktu, analisis pola soal, dan rekomendasi lolos presisi tinggi.
              </p>
              
              {/* CTA Buttons (Centered & Modern) */}
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <a className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-extrabold text-white bg-[#16487e] hover:bg-[#389add] rounded-full shadow-lg shadow-[#16487e]/25 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200" href="/register">
                  <span>Mulai Tes Gratis</span>
                  <svg className="w-5 h-5 ml-2 -mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                  </svg>
                </a>
                <a className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-bold text-[#16487e] bg-white hover:bg-[#e0f2fe]/60 border-2 border-[#389add] rounded-full shadow-xs hover:border-[#16487e] transition-all duration-200" href="#pilih-tes">
                  Lihat Katalog Tes
                </a>
              </div>
              
            </div>
          </div>
        </section>

        {/* BEGIN: TestSelectionSection */}
        <section className="py-12 md:py-16 bg-[#f8fafc] border-y border-[#9be1fd]/30" id="pilih-tes">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Section Title */}
            <div className="text-center max-w-3xl mx-auto mb-14">
              <p className="text-xs sm:text-sm font-bold tracking-wider text-[#389add] uppercase mb-2">Pilih Tes Yang Ingin Kamu Persiapkan</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#16487e] tracking-tight">
                Katalog Simulasi Ujian Terlengkap
              </h2>
              <p className="mt-3 text-base text-slate-600">
                Berbagai simulasi tes rekrutmen dirancang langsung menyerupai soal asli korporasi BUMN &amp; multinasional.
              </p>
            </div>

            {/* Cards Grid: 4 Columns with Blue Theme */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Card 1: Psikotes ASTRA */}
              <div className="relative bg-white rounded-2xl border border-[#9be1fd]/50 shadow-sm hover:shadow-xl hover:border-[#389add] hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between overflow-hidden group">
                <div>
                  <div className="relative h-48 md:h-52 w-full overflow-hidden bg-slate-100">
                    <img alt="Astra" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" src="/card-astra.jpg"/>
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-60"></div>
                    <div className="absolute top-3 right-3">
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#16487e] text-white shadow-xs backdrop-blur-xs">
                        Paling Populer
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-[#e0f2fe] text-[#16487e] flex items-center justify-center font-bold shrink-0">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#389add] transition-colors">Psikotes ASTRA</h3>
                    </div>
                    <p className="text-xs font-semibold text-[#16487e] mt-1">80 Soal • 7 Subtes • ±41 Menit</p>
                    <p className="text-xs text-slate-600 mt-2.5 line-clamp-3 leading-relaxed">
                      Simulasi lengkap psikotes ASTRA International sesuai format terkini: Pauli/Kraepelin, Logika Aritmatika, Deret Angka, dan Spasial.
                    </p>
                  </div>
                </div>
                <div className="px-5 pb-5 pt-0">
                  <div className="pt-3 border-t border-slate-100">
                    <a className="w-full inline-flex items-center justify-center py-2.5 px-4 text-xs font-bold text-white bg-[#16487e] hover:bg-[#389add] rounded-xl transition-all shadow-sm group-hover:shadow-md" href="#mulai-astra">
                      Lihat Simulasi →
                    </a>
                  </div>
                </div>
              </div>

              {/* Card 2: Rekrutmen PLN */}
              <div className="relative bg-white rounded-2xl border border-[#9be1fd]/50 shadow-sm hover:shadow-xl hover:border-[#389add] hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between overflow-hidden group">
                <div>
                  <div className="relative h-48 md:h-52 w-full overflow-hidden bg-slate-100">
                    <img alt="PLN" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" src="/card-pln.jpg"/>
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-60"></div>
                    <div className="absolute top-3 right-3">
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#16487e] text-white shadow-xs backdrop-blur-xs">
                        Favorit BUMN
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-[#e0f2fe] text-[#16487e] flex items-center justify-center font-bold shrink-0">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#389add] transition-colors">Rekrutmen PLN</h3>
                    </div>
                    <p className="text-xs font-semibold text-[#16487e] mt-1">GAT • Tahap 2 Akademik • ±60 Menit</p>
                    <p className="text-xs text-slate-600 mt-2.5 line-clamp-3 leading-relaxed">
                      Simulasi General Aptitude Test (GAT) dan Uji Kemampuan Akademik teknis sesuai standar rekrutmen PT PLN (Persero).
                    </p>
                  </div>
                </div>
                <div className="px-5 pb-5 pt-0">
                  <div className="pt-3 border-t border-slate-100">
                    <a className="w-full inline-flex items-center justify-center py-2.5 px-4 text-xs font-bold text-white bg-[#16487e] hover:bg-[#389add] rounded-xl transition-all shadow-sm group-hover:shadow-md" href="#mulai-pln">
                      Lihat Simulasi →
                    </a>
                  </div>
                </div>
              </div>

              {/* Card 3: ANTAM IMPACT */}
              <div className="relative bg-white rounded-2xl border border-[#9be1fd]/50 shadow-sm hover:shadow-xl hover:border-[#389add] hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between overflow-hidden group">
                <div>
                  <div className="relative h-48 md:h-52 w-full overflow-hidden bg-slate-100">
                    <img alt="Antam" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" src="/card-antam.png"/>
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-60"></div>
                    <div className="absolute top-3 right-3">
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#16487e] text-white shadow-xs backdrop-blur-xs">
                        Update Terbaru
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-[#e0f2fe] text-[#16487e] flex items-center justify-center font-bold shrink-0">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#389add] transition-colors">ANTAM IMPACT 2026</h3>
                    </div>
                    <p className="text-xs font-semibold text-[#16487e] mt-1">14 Job Stream • 40 Soal • ±50 Menit</p>
                    <p className="text-xs text-slate-600 mt-2.5 line-clamp-3 leading-relaxed">
                      Persiapan seleksi program Management Trainee ANTAM IMPACT komprehensif: Situational Judgement &amp; Analytical Reasoning.
                    </p>
                  </div>
                </div>
                <div className="px-5 pb-5 pt-0">
                  <div className="pt-3 border-t border-slate-100">
                    <a className="w-full inline-flex items-center justify-center py-2.5 px-4 text-xs font-bold text-white bg-[#16487e] hover:bg-[#389add] rounded-xl transition-all shadow-sm group-hover:shadow-md" href="#mulai-antam">
                      Lihat Simulasi →
                    </a>
                  </div>
                </div>
              </div>

              {/* Card 4: BUMN */}
              <div className="relative bg-white rounded-2xl border border-[#9be1fd]/50 shadow-sm hover:shadow-xl hover:border-[#389add] hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between overflow-hidden group">
                <div>
                  <div className="relative h-48 md:h-52 w-full overflow-hidden bg-slate-100">
                    <img alt="BUMN" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" src="/card-bumn.jpeg"/>
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-60"></div>
                    <div className="absolute top-3 right-3">
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#16487e] text-white shadow-xs backdrop-blur-xs">
                        Tes Bersama
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-[#e0f2fe] text-[#16487e] flex items-center justify-center font-bold shrink-0">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#389add] transition-colors">Rekrutmen Bersama BUMN</h3>
                    </div>
                    <p className="text-xs font-semibold text-[#16487e] mt-1">TKD • Core Values AKHLAK • WBI</p>
                    <p className="text-xs text-slate-600 mt-2.5 line-clamp-3 leading-relaxed">
                      Kombinasi Tes Kemampuan Dasar (TKD), Tes Core Values AKHLAK, dan Wawasan Kebangsaan untuk seluruh entitas BUMN.
                    </p>
                  </div>
                </div>
                <div className="px-5 pb-5 pt-0">
                  <div className="pt-3 border-t border-slate-100">
                    <a className="w-full inline-flex items-center justify-center py-2.5 px-4 text-xs font-bold text-white bg-[#16487e] hover:bg-[#389add] rounded-xl transition-all shadow-sm group-hover:shadow-md" href="#mulai-bumn">
                      Lihat Simulasi →
                    </a>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>
        
        {/* BEGIN: ValuePillarsSection */}
        <section className="py-12 md:py-16 bg-white relative overflow-hidden" id="keunggulan">
          <GridMotionBackground />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-2xl mx-auto mb-8 motion-reveal">
              <p className="text-xs sm:text-sm font-bold text-[#389add] tracking-wider uppercase mb-2">Kenapa TembusKarir?</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#16487e] tracking-tight">
                Fokus Pada Yang Benar-Benar Diujikan
              </h2>
              <p className="text-slate-600 mt-3">
                Kami membedah pola soal dari vendor rekrutmen asli, sehingga Anda tidak membuang waktu mempelajari materi yang salah.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Pillar 1 */}
              <div className="motion-reveal bg-[#f8fafc] p-7 rounded-3xl border border-[#9be1fd]/40 shadow-xs hover:shadow-xl hover:border-[#389add] hover:-translate-y-2 transition-all duration-300 text-center flex flex-col items-center" style={{ transitionDelay: '100ms' }}>
                <div className="w-14 h-14 rounded-2xl bg-[#e0f2fe] text-[#16487e] flex items-center justify-center mb-5 shadow-sm">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" strokeWidth="2"></circle><circle cx="12" cy="12" r="5" strokeWidth="2"></circle><circle cx="12" cy="12" r="1" strokeWidth="2"></circle></svg>
                </div>
                <h3 className="text-lg font-bold text-[#16487e] mb-2">Mirip Tes Asli</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Soal &amp; format antarmuka dirancang akurat menyerupai proses seleksi vendor tes resmi korporasi.
                </p>
              </div>
              
              {/* Pillar 2 */}
              <div className="motion-reveal bg-[#f8fafc] p-7 rounded-3xl border border-[#9be1fd]/40 shadow-xs hover:shadow-xl hover:border-[#389add] hover:-translate-y-2 transition-all duration-300 text-center flex flex-col items-center" style={{ transitionDelay: '200ms' }}>
                <div className="w-14 h-14 rounded-2xl bg-[#e0f2fe] text-[#16487e] flex items-center justify-center mb-5 shadow-sm">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                </div>
                <h3 className="text-lg font-bold text-[#16487e] mb-2">Simulasi Berwaktu</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Latihan dengan hitungan waktu mundur per section untuk melatih ketahanan di bawah tekanan durasi ketat.
                </p>
              </div>
              
              {/* Pillar 3 */}
              <div className="motion-reveal bg-[#f8fafc] p-7 rounded-3xl border border-[#9be1fd]/40 shadow-xs hover:shadow-xl hover:border-[#389add] hover:-translate-y-2 transition-all duration-300 text-center flex flex-col items-center" style={{ transitionDelay: '300ms' }}>
                <div className="w-14 h-14 rounded-2xl bg-[#e0f2fe] text-[#16487e] flex items-center justify-center mb-5 shadow-sm">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                </div>
                <h3 className="text-lg font-bold text-[#16487e] mb-2">Hasil &amp; Pembahasan</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Dapatkan skor seketika, identifikasi kelemahan subtes, dan rasionalisasi setiap kunci jawaban.
                </p>
              </div>
              
              {/* Pillar 4 */}
              <div className="motion-reveal bg-[#f8fafc] p-7 rounded-3xl border border-[#9be1fd]/40 shadow-xs hover:shadow-xl hover:border-[#389add] hover:-translate-y-2 transition-all duration-300 text-center flex flex-col items-center" style={{ transitionDelay: '400ms' }}>
                <div className="w-14 h-14 rounded-2xl bg-[#e0f2fe] text-[#16487e] flex items-center justify-center mb-5 shadow-sm">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                </div>
                <h3 className="text-lg font-bold text-[#16487e] mb-2">Pantau Perkembangan</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Pantau grafik peningkatan skor kamu dari tiap repetisi pengerjaan melalui dasbor rapor belajar.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* BEGIN: HowItWorksSection */}
        <section className="py-12 md:py-16 bg-[#f8fafc] border-t border-[#9be1fd]/30 relative overflow-hidden" id="cara-kerja">
          <BreathingGlowBackground />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-2xl mx-auto mb-8 motion-reveal">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#e0f2fe] border border-[#9be1fd]/60 text-[#16487e] text-xs font-bold uppercase tracking-wider mb-3">
                <span className="w-2 h-2 rounded-full bg-[#389add] animate-pulse"></span>
                Cara Kerja
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-[#16487e] tracking-tight">
                Simulasi Ujian dalam 3 Tahap Terukur
              </h2>
              <p className="text-slate-600 mt-3 text-base">Kami mengadaptasi alur ujian sesungguhnya agar Anda terbiasa dengan tekanan waktu dan format antarmuka.</p>
            </div>
            
            <div className="relative">
              {/* Connecting line */}
              <div className="hidden md:block absolute top-28 left-[16%] right-[16%] h-0.5 pointer-events-none z-0">
                <div className="w-full h-full bg-gradient-to-r from-[#9be1fd] via-[#389add] to-[#9be1fd] opacity-60 border-t-2 border-dashed border-[#389add]/40"></div>
                <div className="absolute left-1/3 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#389add]/20 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-[#389add] animate-ping"></div>
                </div>
                <div className="absolute left-2/3 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#389add]/20 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-[#389add] animate-ping"></div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                
                {/* Step 1 */}
                <div className="motion-reveal group relative bg-white/90 backdrop-blur-md rounded-3xl p-7 border border-[#9be1fd]/60 shadow-lg shadow-slate-200/50 hover:shadow-2xl hover:border-[#389add] hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between" style={{ transitionDelay: '150ms' }}>
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold bg-gradient-to-r from-[#16487e] to-[#389add] text-white shadow-xs">Langkah 01</span>
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#e0f2fe] to-[#9be1fd]/40 text-[#16487e] flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                        <svg className="w-6 h-6 text-[#16487e]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                      </div>
                    </div>
                    <h3 className="text-xl font-extrabold text-[#16487e] mb-2 group-hover:text-[#389add] transition-colors">Pilih Simulasi</h3>
                    <p className="text-slate-600 text-sm leading-relaxed mb-6">Tentukan modul tes berdasarkan perusahaan incaranmu (ASTRA, PLN, ANTAM, Pertamina, dll).</p>
                  </div>
                  <div className="mt-2 p-3.5 bg-slate-50/80 rounded-2xl border border-slate-100 shadow-inner">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 mb-2">
                      <span>Kategori Ujian</span>
                      <span className="text-[#389add] font-bold">12 Modul Aktif</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-[#16487e] text-white shadow-xs flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#9be1fd]"></span> BUMN
                      </span>
                      <span className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-white text-slate-700 border border-slate-200 hover:border-[#389add] transition-colors">Astra</span>
                      <span className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-white text-slate-700 border border-slate-200 hover:border-[#389add] transition-colors">Swasta</span>
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="motion-reveal group relative bg-white/90 backdrop-blur-md rounded-3xl p-7 border border-[#9be1fd]/60 shadow-lg shadow-slate-200/50 hover:shadow-2xl hover:border-[#389add] hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between" style={{ transitionDelay: '300ms' }}>
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold bg-gradient-to-r from-[#16487e] to-[#389add] text-white shadow-xs">Langkah 02</span>
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#e0f2fe] to-[#9be1fd]/40 text-[#16487e] flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                        <svg className="w-6 h-6 text-[#16487e]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                      </div>
                    </div>
                    <h3 className="text-xl font-extrabold text-[#16487e] mb-2 group-hover:text-[#389add] transition-colors">Kerjakan Tes</h3>
                    <p className="text-slate-600 text-sm leading-relaxed mb-6">Selesaikan simulasi dengan sistem batas waktu otomatis dan navigasi soal seperti tes nyata.</p>
                  </div>
                  <div className="mt-2 p-3.5 bg-slate-50/80 rounded-2xl border border-slate-100 shadow-inner">
                    <div className="flex items-center justify-between text-[11px] mb-2">
                      <span className="font-bold text-[#16487e] flex items-center gap-1">
                        <svg className="w-3.5 h-3.5 text-[#389add]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                        Sisa Waktu
                      </span>
                      <span className="font-mono font-extrabold text-[#389add] text-xs bg-[#e0f2fe] px-2 py-0.5 rounded">24:18</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-1.5 mb-2.5 overflow-hidden">
                      <div className="bg-gradient-to-r from-[#389add] to-[#16487e] h-1.5 rounded-full" style={{ width: '65%' }}></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-1.5">
                        <span className="w-5 h-5 rounded-md bg-[#16487e] text-white text-[10px] font-bold flex items-center justify-center">1</span>
                        <span className="w-5 h-5 rounded-md bg-[#16487e] text-white text-[10px] font-bold flex items-center justify-center">2</span>
                        <span className="w-5 h-5 rounded-md bg-[#389add] text-white text-[10px] font-bold flex items-center justify-center animate-pulse">3</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="motion-reveal group relative bg-white/90 backdrop-blur-md rounded-3xl p-7 border border-[#9be1fd]/60 shadow-lg shadow-slate-200/50 hover:shadow-2xl hover:border-[#389add] hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between" style={{ transitionDelay: '450ms' }}>
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold bg-gradient-to-r from-[#16487e] to-[#389add] text-white shadow-xs">Langkah 03</span>
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#e0f2fe] to-[#9be1fd]/40 text-[#16487e] flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                        <svg className="w-6 h-6 text-[#16487e]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                      </div>
                    </div>
                    <h3 className="text-xl font-extrabold text-[#16487e] mb-2 group-hover:text-[#389add] transition-colors">Evaluasi Hasil</h3>
                    <p className="text-slate-600 text-sm leading-relaxed mb-6">Analisis rapor kelemahanmu, pelajari kunci solusi cerdas, dan ulangi untuk mematangkan kesiapan.</p>
                  </div>
                  <div className="mt-2 p-3.5 bg-slate-50/80 rounded-2xl border border-slate-100 shadow-inner">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-medium">Skor Akhir</span>
                        <span className="text-base font-black text-[#16487e]">88% <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded ml-1">Lolos Target</span></span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block font-medium">Passing</span>
                        <span className="text-xs font-bold text-slate-700">75%</span>
                      </div>
                    </div>
                    <div className="space-y-1 pt-1 border-t border-slate-200/70">
                      <div className="flex items-center justify-between text-[10px] text-slate-600">
                        <span>Logika Penalaran</span>
                        <span className="font-bold text-[#16487e]">92%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-1 overflow-hidden">
                        <div className="bg-[#16487e] h-1 rounded-full" style={{ width: '92%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>
        
        {/* Removed StatsAndSocialProofSection as requested */}
        
        {/* BEGIN: BottomCallToAction */}
        <section className="py-16 md:py-20 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl bg-gradient-to-br from-[#16487e] to-[#0f355c] text-white p-8 sm:p-12 md:p-14 text-center relative overflow-hidden shadow-2xl border border-[#9be1fd]/20">
              <div className="absolute -top-20 -right-20 w-60 h-60 bg-[#389add]/20 rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-[#9be1fd]/20 rounded-full blur-3xl pointer-events-none"></div>
              
              <div className="relative z-10 max-w-2xl mx-auto space-y-6">
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                  Mulai Langkah Nyata Menuju Karir Idamanmu Hari Ini
                </h2>
                <p className="text-slate-200 text-sm sm:text-base">
                  Jangan biarkan kesempatan emas terlewat hanya karena kurang terbiasa dengan model soal seleksi. Latihan sekarang juga secara gratis.
                </p>
                <div className="pt-4 flex flex-wrap justify-center gap-4">
                  <a className="px-8 py-4 bg-[#389add] hover:bg-[#9be1fd] hover:text-[#16487e] text-white font-extrabold rounded-full shadow-lg shadow-[#389add]/30 hover:scale-105 transition-all text-base" href="/register">
                    Daftar &amp; Simulasi Sekarang
                  </a>
                  <a className="px-7 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-full border border-white/30 transition-all text-base" href="#konsultasi">
                    Konsultasi Paket BUMN
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
        
      </main>

      {/* BEGIN: MainFooter */}
      <footer className="bg-slate-900 text-slate-400 text-sm border-t border-slate-800 pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
            
            <div className="md:col-span-2 space-y-4">
              <a className="inline-block p-1.5 bg-white rounded-xl" href="#">
                <img alt="TembusKarir Logo" className="h-7 w-auto object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBVfvFccj0ls3XZSeP2rVHeGvD20behMlru3Wc5iZo5s-ahETznu0B3JQw7O_KXXoaCXMpBOsU-hHzqDQhsRBF-z25QyOdh9VysLL5kmxUmGyX2VchjfWOQMYZ1hmuc-h_4T7Ir9H7Wr2JUFHpmjBs1ugWniq1Ehv_bebsXFwIUGtH4IMomLaWXZu1FIFT4Z1oD2Bw_0BvIJcRg-cYuq9FqOINi6hZEnBogNmXT9CEJHcSNb2U26ghpFvLsTtkqlrtAIA"/>
              </a>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-sm">
                Platform persiapan dan simulasi psikotes terpercaya untuk seleksi rekrutmen BUMN, ASTRA, dan korporasi terkemuka di Indonesia.
              </p>
              <div className="pt-2 flex items-center gap-3 text-slate-400">
                <span className="text-xs">Hubungi kami:</span>
                <a className="text-[#389add] hover:text-[#9be1fd] text-xs font-semibold" href="mailto:support@tembuskarir.id">support@tembuskarir.id</a>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">Simulasi Unggulan</h4>
              <ul className="space-y-2 text-xs">
                <li><a className="hover:text-white transition-colors" href="#">Psikotes Astra</a></li>
                <li><a className="hover:text-white transition-colors" href="#">Rekrutmen PLN (GAT)</a></li>
                <li><a className="hover:text-white transition-colors" href="#">ANTAM IMPACT 2026</a></li>
                <li><a className="hover:text-white transition-colors" href="#">Core Values AKHLAK BUMN</a></li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">Fitur Platform</h4>
              <ul className="space-y-2 text-xs">
                <li><a className="hover:text-white transition-colors" href="#">Rapor Belajar Interaktif</a></li>
                <li><a className="hover:text-white transition-colors" href="#">Riwayat &amp; Pembahasan Soal</a></li>
                <li><a className="hover:text-white transition-colors" href="#">Buku Panduan Karir</a></li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">Dukungan</h4>
              <ul className="space-y-2 text-xs">
                <li><a className="hover:text-white transition-colors" href="#">Pusat Bantuan (FAQ)</a></li>
                <li><a className="hover:text-white transition-colors" href="#">Kebijakan Privasi</a></li>
                <li><a className="hover:text-white transition-colors" href="#">Syarat &amp; Ketentuan</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
            <p>© 2026 TembusKarir. Hak cipta dilindungi undang-undang.</p>
            <div className="flex items-center gap-6">
              <a className="hover:text-slate-400" href="#">Kebijakan Privasi</a>
              <a className="hover:text-slate-400" href="#">Syarat &amp; Ketentuan</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
