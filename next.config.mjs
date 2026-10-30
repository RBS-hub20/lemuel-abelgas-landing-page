/**
 * This project lives on an exFAT drive, where macOS writes ._ sidecar files next to everything.
 * Both Next's image cache and Turbopack's on-disk cache read those back and fail, so both are off.
 * The photos in public/photos are already sized and compressed WebP.
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  images: { unoptimized: true },
  experimental: {
    turbopackFileSystemCacheForDev: false,
    turbopackFileSystemCacheForBuild: false,
  },
};

export default nextConfig;
