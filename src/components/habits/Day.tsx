import { cn } from "@/utils/misc";
import { Slot } from "@radix-ui/react-slot";
import { VariantProps, cva } from "class-variance-authority";
import { forwardRef } from "react";
import ReactRough, { Rectangle } from "rough-react-wrapper";

const DayVariants = cva(
  "border-dashed border-[1px] border-black/60 text-white aspect-square disabled:opacity-40 disabled:cursor-not-allowed",
  {
    variants: {
      size: {
        default: "h-9 h-9",
      },
      variant: {
        default:
          "border-dashed border-[1px] border-black/60 text-white aspect-square ",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof DayVariants> {
  status: "checked" | "skipped";
  color: string;
  asChild?: boolean;
}

export const Day = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, asChild = false, status, color, ...props },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(
          "overflow-hidden",
          DayVariants({ variant, size, className })
        )}
        ref={ref}
        {...props}
      >
        {status && (
          <div className="-translate-x-[50%] -translate-y-[50%] pointer-events-none">
            <ReactRough renderer={"svg"}>
              <Rectangle
                seed={100}
                width={200}
                height={200}
                x={10}
                y={10}
                stroke={"4"}
                fill={color}
                dashGap={status === "skipped" ? 1 : 2}
                roughness={1}
                hachureGap={status === "skipped" ? 10 : 2}
                fillStyle={status === "checked" ? "hachure" : "dashed"}
                bowing={20}
              />
            </ReactRough>
          </div>
        )}
      </Comp>
    );
  }
);
Day.displayName = "Day";
