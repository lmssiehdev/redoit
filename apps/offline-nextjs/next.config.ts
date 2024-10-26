import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	async rewrites() {
		return [
			{
				source: "/feedback",
				destination: "https://tally.so/r/wvMWaA",
			},
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
	typescript: {
		// ! WARN - This should be temporary to get a deployed version up and running.
		ignoreBuildErrors: true,
	},
};

export default nextConfig;
