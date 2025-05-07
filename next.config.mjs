/** @type {import('next').NextConfig} */
// const nextConfig = {};

const nextConfig = {
    reactStrictMode: true,
    images:{
        // domains: ["api.sorciproptrack.com"],
        domains: ['localhost', '127.0.0.1']
        // formats: ["image/webp"],
    }
}

export default nextConfig;
