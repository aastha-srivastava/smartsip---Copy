/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
      return [
        {
          source: "/api/proxy", // Your frontend endpoint
          destination: "https://api.tonystark.in/api.php", // Target backend API
        },
        {
            source: "/api/proxy2", // Your frontend endpoint
            destination: "https://api.tonystark.in/data.php", // Target backend API
          },
      ];
    },
  };
  
  export default nextConfig;
  