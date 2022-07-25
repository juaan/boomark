/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  experimental: {
    esmExternals: false,
  },
  images: {
    domains: ["pbs.twimg.com"],
  },
};
