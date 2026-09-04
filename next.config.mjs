/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/webp'],
  },
  experimental: {
    serverActions: {
      // Fotky se zmenšují už v prohlížeči (lib/zmenseni.ts), takže sem
      // dorazí po pár stech kilobajtech. Rezerva je pro jistotu.
      bodySizeLimit: '4mb',
    },
  },
};

export default nextConfig;
