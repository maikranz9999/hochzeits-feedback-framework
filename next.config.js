/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    appDir: false
  },
  env: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY
  }
};

module.exports = nextConfig;
