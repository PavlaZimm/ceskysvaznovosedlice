/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/webp'],
    remotePatterns: [{ protocol: 'https', hostname: '*.public.blob.vercel-storage.com', pathname: '/novosedlice/fotky/**' }],
  },
  // www verze má jen jednu adresu: hlavní doménu bez www.
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.csznovosedlice.cz' }],
        destination: 'https://csznovosedlice.cz/:path*',
        permanent: true,
      },
    ];
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
