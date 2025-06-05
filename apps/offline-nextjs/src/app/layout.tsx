import { Button, buttonVariants } from "@/components/ui/button";
import { excalifont, mathlete, neucha, pacifico } from "@/fonts/fonts";
import { cn } from "@/lib/utils";
import { PostHogProviderWrapper } from "@/providers/post-hog";
import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
	title: "redoit!",
	description: "Your radically easy-to-use habit tracker",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<PostHogProviderWrapper>
				<body
					className={cn(
						[
							neucha.variable,
							pacifico.variable,
							mathlete.variable,
							excalifont.variable,
						],
						"font-display px-2 min-h-screen flex flex-col",
					)}
				>
					<nav className="py-2 flex text-center items-center justify-between gap-2 text-lg">
						<Link
							href="/"
							// activeProps={{
							//   className: "font-bold",
							// }}
							// activeOptions={{ exact: true }}
						>
							Redoit<span className="pl-1 text-xs text-gray-400">[beta]</span>
						</Link>

						<div className="flex items-center gap-2">
							<Button asChild variant="link" className="px-1">
								<Link
									href="/archive"
									// activeProps={{
									//   className: "underline",
									// }}
								>
									archived
								</Link>
							</Button>
							<Button asChild variant="link" className="px-1">
								<Link
									href="/settings"
									// activeProps={{
									//   className: "underline",
									// }}
								>
									settings
								</Link>
							</Button>
							<Link
								target="_blank"
								href="https://github.com/lmssiehdev/redoit-monorepo"
								className={cn(
									buttonVariants({ size: "sm" }),
									"flex items-center gap-1",
								)}
							>
								⭐ Star us on github
							</Link>
						</div>
					</nav>
					<div className="flex-1">{children}</div>
					<footer className="text-sm my-2 hidden sm:block ml-auto">
						🌱 built with care, one day at a time{" "}
						<span className="font-pacifico">{" • "}</span>
						<Link
							href="/feedback"
							target="_blank"
							className="text-[#65a30d] hover:opacity-70 underline underline-offset-2 font-bold"
						>
							send feedback ↗
						</Link>
					</footer>
				</body>
			</PostHogProviderWrapper>
		</html>
	);
}
