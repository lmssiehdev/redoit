"use client";

import { ProfileForm } from "@/components/habits/AddHabitForm";
import { buttonVariants } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useReplicacheFromContext } from "@/context/ReplicacheProvider";
import { HABIT_TEMPLATE, type Habit } from "@/utils/habits";
import { cn } from "@/utils/misc";
import { ChevronLeftIcon } from "@radix-ui/react-icons";
import { nanoid } from "nanoid";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function AppBackButton() {
  return (
    <Link
      href="/web"
      className={cn(
        buttonVariants({ variant: "ghost" }),
        "flex items-center w-fit"
      )}
    >
      <ChevronLeftIcon className="mr-2 h-4 w-4" />
      Back
    </Link>
  );
}
export default function Page() {
  return (
    <div>
      <AppBackButton />
      <div className="space-y-2 max-w-[400px] mx-auto">
        <h1 className="mt-2 mb-6 text-xl">Create Habit</h1>
        <FormWrapper />
      </div>
    </div>
  );
}

function FormWrapper() {
  const { rep } = useReplicacheFromContext();
  const { toast } = useToast();
  const router = useRouter();

  const handleCreateMessage = (args: Partial<Habit.Definition>) => {
    const habit = {
      ...HABIT_TEMPLATE,
      id: nanoid(),
      ...args,
    } as Habit.Definition;

    rep?.mutate.createHabit(habit);
    toast({
      description: "New habit added! 🌟",
      duration: 1000,
    });
    router.push("/web");
  };

  return <ProfileForm onSubmit={handleCreateMessage} />;
}
