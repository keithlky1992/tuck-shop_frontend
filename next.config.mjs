const API_URL = process.env.API_URL;

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    async rewrites() {
        return [
            {
                source: "/api/:path*",
                destination: `http://192.168.50.135:4000/:path*`,
                // destination: `http://localhost:4000/:path*`,
                // destination: `${API_URL}/:path*`,
            },
        ];
    },
};

// module.exports = {
//   images: {
//     remotePatterns: [new URL('http://localhost:4000/**')],
//   },
// }

export default nextConfig;

