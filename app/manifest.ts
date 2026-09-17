import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

/**
 * Web app manifest — gives Android/Chrome the real guru mark for home-screen
 * and tab icons. Browser-tab favicons come from app/favicon.ico + app/icon.png,
 * iOS from app/apple-icon.png (all generated from public/brand/ppc-guru-mark.png).
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: siteConfig.name,
    description: siteConfig.description,
    start_url: "/",
    display: "browser",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    icons: [
      { src: "/brand/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/brand/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/brand/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
