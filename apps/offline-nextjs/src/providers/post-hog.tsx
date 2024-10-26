"use client";
import { usePathname, useSearchParams } from "next/navigation";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { usePostHog } from "posthog-js/react";
import { useEffect } from "react";

export function PostHogPageView(): null {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const posthog = usePostHog();
	useEffect(() => {
		// Track pageviews
		if (pathname && posthog) {
			let url = window.origin + pathname;
			if (searchParams.toString()) {
				url = `${url}?${searchParams.toString()}`;
			}
			posthog.capture("$pageview", {
				$current_url: url,
			});
		}
	}, [pathname, searchParams, posthog]);

	return null;
}

export function PostHogProviderWrapper({
	children,
}: {
	children: React.ReactNode;
}) {
	useEffect(() => {
		posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
			api_host: "/ingest",
			person_profiles: "identified_only",
			// Disable automatic pageview capture, as we capture manually
			capture_pageview: false,
		});
	}, []);

	return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}
