import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.pixabay.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "pixabay.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
