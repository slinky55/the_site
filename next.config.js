/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverComponentsExternalPackages: ['sequelize'],
    },
    images: {
        formats: ["image/avif", "image/webp"],
        remotePatterns: [
          {
            protocol: "https",
            hostname: "www.dropbox.com",
            port: "",
            pathname: "/**",
          },
        ],
    },
}

module.exports = nextConfig
