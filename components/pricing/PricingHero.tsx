'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Sparkles, ShieldCheck, Zap } from 'lucide-react'
import { CareerIllustration } from '@/components/illustrations/CareerIllustration'

interface FloatingParticle {
  id: number
  top: string
  left: string
  size: number
  duration: number
  delay: number
}

const PARTICLES: FloatingParticle[] = [
  { id: 1, top: '22%', left: '12%', size: 4, duration: 3.8, delay: 0 },
  { id: 2, top: '68%', left: '18%', size: 3, duration: 4.5, delay: 1.2 },
  { id: 3, top: '35%', left: '82%', size: 5, duration: 4.2, delay: 0.6 },
  { id: 4, top: '75%', left: '72%', size: 3, duration: 5.1, delay: 1.8 },
  { id: 5, top: '18%', left: '60%', size: 4, duration: 3.5, delay: 0.9 },
]

export function PricingHero() {
  return (
    <div
      className="relative rounded-3xl overflow-hidden text-white p-8 sm:p-10 text-center border border-white/10 shadow-xl"
      style={{
        background: 'linear-gradient(135deg, #0F2C44 0%, #0a1f30 60%, #0B3D30 100%)',
      }}
    >
      {/* Dynamic Animated Ambient Light Blobs */}
      <motion.div
        className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-cyan-500/20 blur-3xl pointer-events-none"
        animate={{
          x: [0, 30, -15, 0],
          y: [0, -20, 25, 0],
          scale: [1, 1.15, 0.95, 1],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute -bottom-20 -right-16 w-80 h-80 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none"
        animate={{
          x: [0, -35, 20, 0],
          y: [0, 25, -20, 0],
          scale: [1, 1.2, 0.9, 1],
        }}
        transition={{
          duration: 11,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Decorative Grid Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.7) 1px, transparent 0)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Floating Sparkle Particles */}
      {PARTICLES.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-cyan-200/60 pointer-events-none"
          style={{
            top: p.top,
            left: p.left,
            width: p.size,
            height: p.size,
          }}
          animate={{
            y: [0, -14, 0],
            opacity: [0.25, 0.9, 0.25],
            scale: [0.9, 1.3, 0.9],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Shimmer Light Sweep across card */}
      <motion.div
        className="absolute -inset-full w-[200%] h-full bg-gradient-to-r from-transparent via-white/[0.04] to-transparent pointer-events-none"
        style={{ transform: 'rotate(25deg)' }}
        animate={{
          x: ['-100%', '200%'],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: 'easeInOut',
          repeatDelay: 2,
        }}
      />

      {/* Floating Career Illustration (hidden on small screens, animated on sm+) */}
      <div className="absolute right-6 bottom-0 w-40 sm:w-52 pointer-events-none select-none hidden sm:block">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, x: 20 }}
          animate={{
            opacity: 0.95,
            scale: 1,
            x: 0,
            y: [0, -9, 0],
          }}
          transition={{
            opacity: { duration: 0.8, ease: 'easeOut' },
            scale: { duration: 0.8, ease: 'easeOut' },
            x: { duration: 0.8, ease: 'easeOut' },
            y: {
              duration: 4.5,
              repeat: Infinity,
              ease: 'easeInOut',
            },
          }}
          className="relative"
        >
          {/* Subtle glow underneath illustration */}
          <div className="absolute inset-0 bg-emerald-400/15 blur-2xl rounded-full transform translate-y-4" />
          <CareerIllustration className="w-full relative z-10" />
        </motion.div>
      </div>

      {/* Content Container with Staggered Entrance Motion */}
      <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center">
        {/* Animated Badge */}
        <motion.div
          initial={{ opacity: 0, y: -12, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="relative group mb-4"
        >
          <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-400 to-emerald-400 rounded-full blur-xs opacity-40 group-hover:opacity-75 transition duration-500" />
          <span className="relative inline-flex items-center gap-2 text-[11px] sm:text-xs font-semibold bg-slate-900/80 backdrop-blur-md border border-white/20 rounded-full px-3.5 py-1 text-white shadow-sm">
            <motion.span
              animate={{
                rotate: [0, 15, -15, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="inline-block"
            >
              <Sparkles className="w-3.5 h-3.5 text-brand-300" />
            </motion.span>
            Investasi untuk kariermu
          </span>
        </motion.div>

        {/* Animated Title */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
          className="text-2xl sm:text-4xl font-heading font-extrabold tracking-tight text-white"
        >
          Langganan <span className="text-emerald-400">&amp;</span> Harga
        </motion.h1>

        {/* Animated Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
          className="text-white/75 text-sm sm:text-base mt-2.5 max-w-md mx-auto leading-relaxed"
        >
          Pilih paket sesuai persiapan seleksi kerjamu
        </motion.p>

        {/* Value Highlights Pills */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
          className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-4 text-[11px] sm:text-xs text-white/70"
        >
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10">
            <Zap className="w-3 h-3 text-amber-300" />
            Akses Langsung Aktif
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10">
            <ShieldCheck className="w-3 h-3 text-emerald-300" />
            Simulasi Sesuai Sistem Asli
          </span>
        </motion.div>
      </div>
    </div>
  )
}
