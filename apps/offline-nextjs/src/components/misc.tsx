import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";

export function GoToMainPageButton() {
	const { back } = useRouter();

	return (
		<Button onClick={() => back()} variant="ghost" size="xs">
			<ArrowLeft className="size-5" />
		</Button>
	);
}

export function RepeatedHeader({
	word,
}: { word: "habits" | "archived" | "stats" }) {
	// @HACKY: use tailwind safelist
	const content = {
		habits: "after:content-['habits']",
		archived: "after:content-['archived']",
		stats: "after:content-['stats']",
	};
	return (
		<span
			className={cn(
				"relative after:font-['Pacifico'] after:-z-10 after:opacity-50 after:text-[#feac5e] after:tracking-[0.3em] after:text-[80%] after:bottom-[10%] after:absolute after:left-1/2 after:translate-x-[-50%] after:translate-y-[10%] font-bold text-center mb-4 font-mathlete text-4xl tracking-[0.3em]",
				content[word],
			)}
		>
			{word}
		</span>
	);
}
