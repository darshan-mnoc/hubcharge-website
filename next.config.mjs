/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      // Google Places photo media (nearby places on station pages)
      { protocol: 'https', hostname: 'places.googleapis.com', pathname: '/**' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com', pathname: '/**' },
    ],
  },
  compress: true,
  poweredByHeader: false,
}

export default nextConfig
