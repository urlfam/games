/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Fix for "Missing origin header from a forwarded Server Actions request"
  experimental: {
    serverActions: {
      allowedOrigins: ['puzzio.io', 'www.puzzio.io', 'localhost:3000'],
    },
  },
  compress: true, // Enable Gzip (Brotli handled by Proxy/CDN)
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|jpeg|png|gif|ico|webp|js|css|woff|woff2)',
        locale: false,
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:path*', // All pages
        headers: [
          {
            key: 'Cache-Control',
            // TEMPORAIRE POUR TEST : s-maxage=60 (1 min) pour vérifier stale-while-revalidate
            // Remettre s-maxage=3600 après le test !
            value: 'public, max-age=60, s-maxage=60, stale-while-revalidate=86400',
          },
        ],
      },
    ];
  },
  images: {
    // Limit max width to 1920px to avoid generating 3840px (4K) images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    // Add more intermediate sizes (200, 400, 512) to better match grid layouts (approx 190px and 400px)
    imageSizes: [16, 32, 48, 64, 96, 128, 200, 256, 384, 400, 512],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.puzzio.io',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'imgs.crazygames.com',
      },
      {
        protocol: 'https',
        hostname: 'www.crazygames.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  async redirects() {
    return [
      {
        source: '/tag/:slug',
        destination: '/t/:slug',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
