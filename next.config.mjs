/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    images: {
        unoptimized: true,
    },
    assetPrefix: './',
    output: 'export',
    distDir: 'extension/pages'
};

export default nextConfig;
