"use client";

import { AppBackButton } from "@/app/(replicache)/create/page";
import { ProfileForm } from "@/components/habits/AddHabitForm";
import { useToast } from "@/components/ui/use-toast";
import { HabitProvider, useHabit } from "@/context/HabitProvider";
import { useReplicacheFromContext } from "@/context/ReplicacheProvider";
import { Habit } from "@/utils/habits";
import { useRouter } from "next/navigation";

export default function HabitPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <AppBackButton />
      <HabitProvider habitId={`habit/${params.id}`}>
        <FormWrapper />
      </HabitProvider>
    </div>
  );
}

function FormWrapper() {
  const { rep } = useReplicacheFromContext();
  const { toast } = useToast();
  const { completedDates, habitData, habitId } = useHabit();
  const router = useRouter();

  if (!habitData?.name) return null;

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
    });
    router.push("/");
  };

  return (
    <div className="space-y-2 max-w-[400px] mx-auto">
      <h1 className="mt-2 mb-6 text-xl">Edit Habit</h1>
      <ProfileForm
        // key={habitData?.name}
        onSubmit={handleHabitUpdate}
        args={{ name: habitData?.name, color: habitData?.color as any }}
      />
    </div>
  );
}
