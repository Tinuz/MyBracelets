import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'vercel.app', 'pmlddqdlroyjycxtkjvh.supabase.co'],
  },
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client'],
  },
};

export default withNextIntl(nextConfig);