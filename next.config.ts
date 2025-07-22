import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export', // Static export
  basePath: '/minimalist-pomodoro', // Base path for GitHub Pages
  images: {
    unoptimized: true, // Disable Next.js image optimization as it requires a server
  },
};

export default nextConfig;
