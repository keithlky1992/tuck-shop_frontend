const API_URL = process.env.API_URL;

/** @type {import('next').NextConfig} */
const nextConfig = {
    //   reactStrictMode: true,
    async rewrites() {
        return [
            {
                source: "/api/:path*",
                destination: `http://localhost:4000/:path*`,
                // destination: `${API_URL}/:path*`,
            },
        ];
    },
};

export default nextConfig;
