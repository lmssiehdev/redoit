import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Plus } from "@phosphor-icons/react";
import { Link, Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

export const Route = createRootRoute({
	component: RootComponent,
});

function RootComponent() {
	return (
		<>
			<nav className="p-2 flex text-center items-center justify-between gap-2 text-lg">
				<Link
					to="/"
					activeProps={{
						className: "font-bold",
					}}
					activeOptions={{ exact: true }}
				>
					Redoit<span className="pl-1 text-xs text-gray-400">[beta]</span>
				</Link>

				<div className="flex items-center gap-2">
					<Button asChild variant="link">
						<Link
							to="/archived"
							activeProps={{
								className: "underline",
							}}
						>
							archived
						</Link>
					</Button>
					<Link
						to="/add"
						className={cn(
							buttonVariants({ size: "sm" }),
							"flex items-center gap-1",
						)}
					>
						<Plus weight="bold" className="size-3" />
						Add habit
					</Link>
				</div>
			</nav>
			<hr />
			<div className="p-2">
				<Outlet />
			</div>
			<TanStackRouterDevtools position="bottom-right" />
		</>
	);
}
