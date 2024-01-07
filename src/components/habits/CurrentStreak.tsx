import { useCalculateStreak } from "@/hooks/useCalculateStreak";
import { Habit } from "@/utils/habits";
import { Lightning } from "@phosphor-icons/react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
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
          <span className="hidden items-center gap-1 sm:flex">
            <Lightning />
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
