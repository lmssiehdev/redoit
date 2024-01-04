import { useCalculateStreak } from "@/hooks/useCalculateStreak";
import { Habit } from "@/utils/habits";
import { LightningBoltIcon } from "@radix-ui/react-icons";
import {
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Tooltip,
} from "@radix-ui/react-tooltip";

export default function CurrentStreak({
  completedDates,
}: {
  completedDates: Habit.Definition["completedDates"];
}) {
  const { currentStreak } = useCalculateStreak(completedDates);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="hidden items-center gap-1.5  text-sm sm:flex">
            <LightningBoltIcon />
            {currentStreak}
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p
            className="rounded-md bg-primary px-2 py-1 text-xs text-white
            "
          >
            Current Streak
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
