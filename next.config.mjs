import nextPWA from "next-pwa";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  
  },
};

export default nextPWA({
  dest: "public",
  disable: process.env.NODE_ENV === "development", // Disable PWA in development
})(nextConfig);