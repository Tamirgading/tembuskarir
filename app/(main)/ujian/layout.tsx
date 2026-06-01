// Layout ujian — hanya beri background color.
// Navbar & padding container sudah dihilangkan oleh NavbarWrapper/MainWrapper
// di (main)/layout.tsx berdasarkan usePathname().
export default function UjianLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-paper">
      {children}
    </div>
  )
}
