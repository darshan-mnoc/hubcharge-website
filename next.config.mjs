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
  /**
   * Two guides outgrew their own URLs when Texas opened.
   *
   * "socal-charging" and "ev-incentives-california" both named California in
   * the path, and both now cover two states. There was no redirects() block
   * in this file at all, so renaming either one would simply have 404'd every
   * link, bookmark and search result pointing at it. 308 rather than 302:
   * these are permanent, and the old paths are not coming back.
   */
  async redirects() {
    return [
      {
        source: "/charging-101/socal-charging",
        destination: "/charging-101/charging-corridors",
        permanent: true,
      },
      {
        source: "/charging-101/ev-incentives-california",
        destination: "/charging-101/ev-incentives",
        permanent: true,
      },
      /* The pricing page is called Plan Your Charge now, and the URL says so.
         It was linked from eleven places on the site, listed in the sitemap,
         and is the kind of page people bookmark and search for by name — so
         the old path has to keep resolving. */
      {
        source: "/pricing",
        destination: "/plan-your-charge",
        permanent: true,
      },
    ];
  },
  compress: true,
  poweredByHeader: false,
}

export default nextConfig
