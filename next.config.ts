import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    const securityHeaders = [
      {
        key: "X-Frame-Options",
        value: "DENY",
      },
      {
        key: "X-Content-Type-Options",
        value: "nosniff",
      },
      {
        key: "Referrer-Policy",
        value: "strict-origin-when-cross-origin",
      },
      {
        key: "Permissions-Policy",
        value: "camera=(), microphone=(), geolocation=()",
      },
    ];

    const publicCacheHeaders = [
      {
        key: "Cache-Control",
        value: "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    ];

    const noCacheHeaders = [
      {
        key: "Cache-Control",
        value: "no-cache, no-store, max-age=0, must-revalidate",
      },
      {
        key: "Pragma",
        value: "no-cache",
      },
      {
        key: "Expires",
        value: "0",
      },
    ];

    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        source: "/",
        headers: publicCacheHeaders,
      },
      {
        source: "/produk",
        headers: publicCacheHeaders,
      },
      {
        source: "/layanan",
        headers: publicCacheHeaders,
      },
      {
        source: "/login",
        headers: noCacheHeaders,
      },
      {
        source: "/admin",
        headers: noCacheHeaders,
      },
      {
        source: "/api/setup",
        headers: noCacheHeaders,
      },
    ];
  },
};

export default nextConfig;
