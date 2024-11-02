import { Popover, PopoverContent } from "@/components/ui/popover";
import { colors } from "@/constants";
import { PopoverTrigger } from "@radix-ui/react-popover";

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
