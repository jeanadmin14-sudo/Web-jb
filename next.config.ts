import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    const publicCacheHeaders = [
      {
        key: "Cache-Control",
        value: "public, s-maxage=300, stale-while-revalidate=600",
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
