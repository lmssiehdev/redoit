import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	async rewrites() {
		return [
			{
				source: "/feedback",
				destination: "https://tally.so/r/wvMWaA",
			},
		];
	},
};

export default nextConfig;
