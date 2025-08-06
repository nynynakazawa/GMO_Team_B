import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/conoha/:path*',
        destination: 'https://compute.c3j1.conoha.io/:path*',
      },
    ];
  },
};

export default nextConfig;
