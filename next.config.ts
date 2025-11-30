import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  /* config options here */
  logging: {
    fetches: {
      fullUrl: true,
      hmrRefreshes: true,
    },
    incomingRequests: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "flagcdn.com",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8080",
        pathname: "/storage/**",
      },
      {
        protocol: "http",
        hostname: "192.168.50.204",
        port: "8080",
        pathname: "/storage/houses/**",
      },
    ],
  },
}

export default nextConfig
