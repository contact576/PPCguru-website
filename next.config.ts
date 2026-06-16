import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // three.js / R3F transpilation safety for the App Router
  transpilePackages: ["three"],
};

export default nextConfig;
