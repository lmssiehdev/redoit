"use client";

import { AppBackButton } from "@/app/(replicache)/create/page";
import { MonthlyCalendar } from "@/components/calendar/Monthly";
import ChartWrapper from "@/components/chart";
import { Button } from "@/components/ui/button";
import { HabitProvider, useHabit } from "@/context/HabitProvider";
import { useReplicacheFromContext } from "@/context/ReplicacheProvider";
import { Pencil1Icon, TrashIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";

export default function HabitPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <AppBackButton />
      <HabitProvider habitId={`habit/${params.id}`}>
        <Content />
      </HabitProvider>
    </div>
  );
}

function Content() {
  const router = useRouter();
  const { rep } = useReplicacheFromContext();
  const { completedDates, habitData, habitId, markDate, deleteHabit } =
    useHabit();
  if (!habitData?.name) return null;

  console.log(completedDates, Object.values(completedDates).length);
  function handleDeleteHabit() {
    deleteHabit();
    router.push("/");
  }

  return (
    <div className="max-w-screen-sm w-full mx-auto">
      <div className="max-w-fit w-full mx-auto">
        <div className="max-w-[350px] w-full mx-auto">
          <div className="flex justify-between items-center ">
            <div
              className="border-l-2 pl-2"
              style={{
                borderColor: habitData?.color,
              }}
            >
              {habitData.name}
            </div>
            <div className="flex gap-2 items-center">
              <Pencil1Icon className="h-4 w-4" />
              <Button variant="ghost" size="icon" onClick={handleDeleteHabit}>
                <TrashIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="my-5">
            <MonthlyCalendar />
          </div>
        </div>
        {/* <div>
          <h2 className="text-center font-bold text-lg tracking-wide">
            Completion Rate
          </h2>
          <ChartWrapper color={habitData.color} />
        </div> */}
      </div>
    </div>
  );
}
