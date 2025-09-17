/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@arvasit/components', '@arvasit/utils', '@arvasit/types', '@arvasit/schemas', '@arvasit/sdk'],
  experimental: {
    externalDir: true,
  },
};

module.exports = nextConfig;
