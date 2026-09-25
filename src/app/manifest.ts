import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'KICKSMATE - Footwear POS & Retail Admin',
    short_name: 'KICKSMATE POS',
    description: 'Sistem Kasir POS & Manajemen Ritel Toko Sepatu Offline-First',
    start_url: '/',
    display: 'standalone',
    background_color: '#0f172a',
    theme_color: '#4f46e5',
    orientation: 'any',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  };
}
