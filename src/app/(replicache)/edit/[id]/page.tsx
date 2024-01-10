"use client";

import { AppBackButton } from "@/app/(replicache)/create/page";
import { ProfileForm } from "@/components/habits/AddHabitForm";
import { useToast } from "@/components/ui/use-toast";
import { HabitProvider, useHabit } from "@/context/HabitProvider";
import { useHabits } from "@/context/HabitsProvider";
import { useReplicacheFromContext } from "@/context/ReplicacheProvider";
import { Habit } from "@/utils/habits";
import { useRouter } from "next/navigation";

export default function HabitPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <AppBackButton />
      <HabitProvider habitId={`habit/${params.id}`}>
        <Content paramsId={`habit/${params.id}`} />
      </HabitProvider>
    </div>
  );
}

function Content({ paramsId }: { paramsId: string }) {
  const { rep } = useReplicacheFromContext();
  const { toast } = useToast();
  const { isSearching } = useHabits();
  const { habitData, habitId } = useHabit();
  const router = useRouter();

  if (isSearching) {
    return <>Loading...</>;
  }

  if (!habitData || habitData.id != paramsId)
    return <div>Habits doesn't exist : /</div>;

  const { color, name, frequency } = habitData;

  const handleHabitUpdate = (args: Partial<Habit.Definition>) => {
    const updatedHabit = {
      ...habitData,
      ...args,
    };
    rep?.mutate.updateHabit({
      id: habitId,
      args: updatedHabit,
    });
    toast({
      description: "Updated and ready for success.",
      duration: 1500,
    });
    router.push("/web");
  };

  return (
    <div className="mx-auto max-w-[400px] space-y-2">
      <h1 className="mb-6 mt-2 text-xl">Edit Habit</h1>
      <ProfileForm
        onSubmit={handleHabitUpdate}
        args={{ color, name, frequency }}
      />
    </div>
  );
}
