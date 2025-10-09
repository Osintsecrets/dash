/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';
const basePath = isProd ? '/dash' : '';

export default {
  output: 'export',               // static export
  basePath,                       // required for /dash
  assetPrefix: basePath + '/',    // ensure assets resolve under /dash
  images: { unoptimized: true },  // export-friendly
  trailingSlash: true,
};
