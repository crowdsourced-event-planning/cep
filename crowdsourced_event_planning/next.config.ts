import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // domains: ["example.com", "cdn.example.org"], // Daftar domain eksternal yang diizinkan
    // formats: ["image/webp", "image/avif"], // Format yang dioptimasi
    // deviceSizes: [640, 768, 1024, 1280, 1600], // Ukuran device target
    // imageSizes: [16, 32, 48, 64, 96], // Ukuran kustom untuk <Image layout="intrinsic" />
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pixabay.com",
        pathname: "/get/**",
      },
    ],
  },
};

export default nextConfig;
