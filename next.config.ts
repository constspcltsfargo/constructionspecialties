import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    // All photos are served locally from /public.
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
