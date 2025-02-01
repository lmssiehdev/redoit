import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
			{
				source: "/feedback",
				destination: "https://tally.so/r/wAbG7B",
        statusCode: 302
			},
    ]
  },
  async rewrites() {
		return [
			{
				source: "/ingest/static/:path*",
				destination: "https://us-assets.i.posthog.com/static/:path*",
			},
			{
				source: "/ingest/:path*",
				destination: "https://us.i.posthog.com/:path*",
			},
			{
				source: "/ingest/decide",
				destination: "https://us.i.posthog.com/decide",
			},
		];
	},
	skipTrailingSlashRedirect: true,
};

export default nextConfig;
