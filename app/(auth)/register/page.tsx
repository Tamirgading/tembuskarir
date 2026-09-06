'use client'

import React from 'react'
import Link from 'next/link'

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-800 antialiased selection:bg-brand-accent selection:text-white relative overflow-x-hidden"
      style={{
        backgroundColor: '#faf8ff',
        backgroundImage: `
          radial-gradient(circle at 50% 15%, rgba(155, 225, 253, 0.42) 0%, rgba(250, 248, 255, 0) 55%),
          radial-gradient(circle at 15% 45%, rgba(56, 154, 221, 0.16) 0%, rgba(250, 248, 255, 0) 45%),
          radial-gradient(circle at 85% 65%, rgba(22, 72, 126, 0.14) 0%, rgba(250, 248, 255, 0) 50%)
        `
      }}
    >
      <header className="w-full border-b border-slate-100/80 bg-white/70 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link className="flex items-center gap-2 group" href="/">
            <img alt="TembusKarir Logo" className="h-7 sm:h-8 w-auto object-contain transition-transform group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBVfvFccj0ls3XZSeP2rVHeGvD20behMlru3Wc5iZo5s-ahETznu0B3JQw7O_KXXoaCXMpBOsU-hHzqDQhsRBF-z25QyOdh9VysLL5kmxUmGyX2VchjfWOQMYZ1hmuc-h_4T7Ir9H7Wr2JUFHpmjBs1ugWniq1Ehv_bebsXFwIUGtH4IMomLaWXZu1FIFT4Z1oD2Bw_0BvIJcRg-cYuq9FqOINi6hZEnBogNmXT9CEJHcSNb2U26ghpFvLsTtkqlrtAIA" />
          </Link>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 relative">
        {/* Ambient Grid Texture */}
        <div className="absolute inset-0 pointer-events-none z-0 opacity-80"
          style={{
            backgroundSize: '40px 40px',
            backgroundImage: `
              linear-gradient(to right, rgba(56, 154, 221, 0.05) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(56, 154, 221, 0.05) 1px, transparent 1px)
            `
          }}
        ></div>

        {/* Ambient Glowing Spheres */}
        <div className="absolute top-1/4 -left-28 w-[420px] h-[420px] bg-[#9be1fd]/35 rounded-full blur-[90px] pointer-events-none z-0 animate-orb-1"></div>
        <div className="absolute bottom-8 -right-28 w-[460px] h-[460px] bg-[#389add]/25 rounded-full blur-[100px] pointer-events-none z-0 animate-orb-2"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[580px] h-[580px] bg-gradient-to-tr from-[#9be1fd]/20 via-[#389add]/10 to-transparent rounded-full blur-[110px] pointer-events-none z-0 animate-orb-3"></div>

        {/* Animated Data Stream Beams & Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute left-[12%] sm:left-[16%] bottom-0 w-[2px] h-64 bg-gradient-to-t from-transparent via-[#389add]/40 to-transparent animate-stream-1 rounded-full"></div>
          <div className="absolute left-[8%] top-[35%] w-2 h-2 rounded-full bg-[#389add]/40 blur-[1px] animate-stream-4"></div>
          <div className="absolute left-[24%] bottom-0 w-[1.5px] h-48 bg-gradient-to-t from-transparent via-[#9be1fd]/50 to-transparent animate-stream-2 rounded-full"></div>
          <div className="absolute right-[14%] sm:right-[18%] bottom-0 w-[2px] h-72 bg-gradient-to-t from-transparent via-[#16487e]/30 to-transparent animate-stream-3 rounded-full"></div>
          <div className="absolute right-[10%] top-[40%] w-2.5 h-2.5 rounded-full bg-[#9be1fd]/50 blur-[1px] animate-stream-1"></div>
          <div className="absolute right-[25%] bottom-0 w-[1px] h-52 bg-gradient-to-t from-transparent via-[#389add]/35 to-transparent animate-stream-4 rounded-full"></div>
          
          {/* Subtle Floating Constellation Points */}
          <div className="absolute left-[18%] top-[22%] w-1.5 h-1.5 rounded-full bg-[#16487e]/30"></div>
          <div className="absolute left-[22%] top-[68%] w-2 h-2 rounded-full bg-[#389add]/30"></div>
          <div className="absolute right-[20%] top-[26%] w-2 h-2 rounded-full bg-[#9be1fd]/60"></div>
          <div className="absolute right-[16%] top-[72%] w-1.5 h-1.5 rounded-full bg-[#16487e]/25"></div>
        </div>

        {/* Centered Registration Card */}
        <div className="w-full max-w-md bg-white/95 backdrop-blur-xl rounded-3xl border border-[#9be1fd]/60 shadow-2xl shadow-[#16487e]/10 p-6 sm:p-8 relative z-20 transition-all duration-300">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#e0f2fe] to-[#9be1fd]/30 p-2 mb-3 shadow-inner border border-[#9be1fd]/50">
              <img alt="TembusKarir Icon" className="w-full h-full object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBVfvFccj0ls3XZSeP2rVHeGvD20behMlru3Wc5iZo5s-ahETznu0B3JQw7O_KXXoaCXMpBOsU-hHzqDQhsRBF-z25QyOdh9VysLL5kmxUmGyX2VchjfWOQMYZ1hmuc-h_4T7Ir9H7Wr2JUFHpmjBs1ugWniq1Ehv_bebsXFwIUGtH4IMomLaWXZu1FIFT4Z1oD2Bw_0BvIJcRg-cYuq9FqOINi6hZEnBogNmXT9CEJHcSNb2U26ghpFvLsTtkqlrtAIA"/>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#16487e] tracking-tight">Daftar Akun Tembuskarir</h1>
          </div>

          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Nama Lengkap</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                </span>
                <input className="w-full pl-10 pr-4 py-3 text-xs sm:text-sm bg-[#f8fafc] border border-slate-200 rounded-xl focus:bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#389add] focus:ring-4 focus:ring-[#9be1fd]/35 transition-all" placeholder="Contoh: John Doe" required type="text"/>
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Alamat Email</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                </span>
                <input className="w-full pl-10 pr-4 py-3 text-xs sm:text-sm bg-[#f8fafc] border border-slate-200 rounded-xl focus:bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#389add] focus:ring-4 focus:ring-[#9be1fd]/35 transition-all" placeholder="nama@email.com" required type="email"/>
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                </span>
                <input className="w-full pl-10 pr-4 py-3 text-xs sm:text-sm bg-[#f8fafc] border border-slate-200 rounded-xl focus:bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#389add] focus:ring-4 focus:ring-[#9be1fd]/35 transition-all" placeholder="Minimal 8 karakter" required type="password"/>
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Konfirmasi Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                </span>
                <input className="w-full pl-10 pr-4 py-3 text-xs sm:text-sm bg-[#f8fafc] border border-slate-200 rounded-xl focus:bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#389add] focus:ring-4 focus:ring-[#9be1fd]/35 transition-all" placeholder="Ulangi password" required type="password"/>
              </div>
            </div>

            <div className="space-y-3 pt-1">
              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink mx-3 text-xs text-slate-400 font-medium uppercase tracking-wider">atau daftar lebih cepat</span>
                <div className="flex-grow border-t border-slate-200"></div>
              </div>
              <button type="button" className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-slate-200 hover:border-[#389add] rounded-xl bg-white hover:bg-slate-50 transition-all font-semibold text-slate-700 text-sm shadow-xs cursor-pointer">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"></path>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"></path>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"></path>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"></path>
                </svg>
                <span>Daftar dengan Google</span>
              </button>
            </div>
            
            <div className="pt-1 text-[11px] text-slate-500 leading-relaxed">
              Dengan mendaftar, Anda menyetujui <Link className="text-[#389add] hover:underline font-semibold" href="/syarat-ketentuan">Syarat &amp; Ketentuan</Link> serta <Link className="text-[#389add] hover:underline font-semibold" href="/kebijakan-privasi">Kebijakan Privasi</Link> TembusKarir.
            </div>
            
            <button className="w-full mt-2 py-3.5 px-4 bg-[#16487e] hover:bg-[#389add] text-white text-sm font-extrabold rounded-2xl shadow-lg shadow-[#16487e]/25 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer" type="submit">
              <span>Daftar Sekarang</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"></path></svg>
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-600">
              Sudah punya akun? <Link className="font-extrabold text-[#16487e] hover:text-[#389add] transition-colors ml-1" href="/login">Masuk di sini</Link>
            </p>
          </div>
        </div>
      </main>

      <footer className="w-full border-t border-slate-100/80 py-5 text-center text-xs text-slate-400 bg-white/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 TembusKarir. Hak cipta dilindungi undang-undang.</p>
          <div className="flex items-center gap-4 text-slate-500 font-medium">
            <Link className="hover:text-[#389add] transition-colors" href="#">Bantuan</Link>
            <Link className="hover:text-[#389add] transition-colors" href="/kebijakan-privasi">Kebijakan Privasi</Link>
            <Link className="hover:text-[#389add] transition-colors" href="/syarat-ketentuan">Syarat &amp; Ketentuan</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
