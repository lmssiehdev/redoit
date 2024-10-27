import { Popover, PopoverContent } from "@/components/ui/popover";
import { PopoverTrigger } from "@radix-ui/react-popover";

export const colors = [
	"#1d4ed8",
	"#ea580c",
	"#dc2626",
	"#65a30d",
	"#16a34a",
	"#059669",
	"#0891b2",
	"#db2777",
	"#c026d3",
	"#0d9488",
];

export function ColorPicker({
	value,
	onChange,
}: {
	value: string;
	onChange: (newColor: string) => void;
}) {
	return (
		<Popover>
			<PopoverTrigger className="flex-end">
				<div
					style={{ backgroundColor: value }}
					className="size-8 rounded-sm shadow"
				/>
			</PopoverTrigger>
			<PopoverContent className="w-auto">
				{/* <HexColorPicker color={value} onChange={onChange} /> */}
				<div className="grid grid-cols-5 gap-2">
					{colors.map((color) => (
						<button
							onClick={() => onChange(color)}
							type="button"
							key={color}
							className="size-6 rounded"
							style={{ background: color }}
						/>
					))}
				</div>
			</PopoverContent>
		</Popover>
	);
}
