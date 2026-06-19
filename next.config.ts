import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  compress: false,
  allowedDevOrigins: [
    ".space-z.ai",
    "preview-chat-79fa71f7-03eb-45c0-aa1d-7e0c3524d894.space-z.ai",
    "localhost",
    "127.0.0.1",
  ],
};

export default nextConfig;
