const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
};

// module.exports = nextConfig;
module.exports = withPWA(nextConfig);
