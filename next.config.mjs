const API_URL = process.env.API_URL;

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    async rewrites() {
        return [
            {
                source: "/api/:path*",
                // destination: `http://172.20.10.4:4000/:path*`,
                destination: `http://192.168.50.135:4000/:path*`,
                // destination: `http://localhost:4000/:path*`,
                // destination: `${API_URL}/:path*`,
            },
        ];
    },
    eslint: {
        // Warning: This allows production builds to successfully complete even if
        // your project has ESLint errors.
        ignoreDuringBuilds: true,
    },
};

// module.exports = {
//   images: {
//     remotePatterns: [new URL('http://localhost:4000/**')],
//   },
// }

export default nextConfig;

