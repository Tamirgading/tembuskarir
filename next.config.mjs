/** @type {import('next').NextConfig} */
const nextConfig = {
  redirects: async () => [
    // Landing page dihapus — dashboard sekarang di root /
    { source: '/dashboard', destination: '/', permanent: false },
  ],
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-XSS-Protection', value: '1; mode=block' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      ],
    },
  ],
}

export default nextConfig
