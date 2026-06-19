import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
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
        headers: noCacheHeaders,
      },
      {
        source: "/produk",
        headers: noCacheHeaders,
      },
      {
        source: "/layanan",
        headers: noCacheHeaders,
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
        source: "/api/:path*",
        headers: noCacheHeaders,
      },
    ];
  },
};

export default nextConfig;
