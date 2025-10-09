/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';
const basePath = isProd ? '/dash' : '';

const nextConfig = {
  output: 'export',
  basePath,
  assetPrefix: `${basePath}/`,
  images: { unoptimized: true },
  trailingSlash: true,
  experimental: {
    typedRoutes: true
  }
};
export default nextConfig;
