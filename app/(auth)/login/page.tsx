import { redirect } from 'next/navigation'

// Halaman /login dihapus — login sekarang via modal popup
// Redirect ke home agar bookmark lama tidak 404
export default function LoginPage() {
  redirect('/')
}
