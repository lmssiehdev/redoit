"use client";
import { buttonVariants } from "@/components/ui/button";
import { useUser } from "@/context/AuthProvider";
import { DateProvider } from "@/context/DateProvider";
import { HabitsProvider } from "@/context/HabitsProvider";
import { ReplicacheProvider } from "@/context/ReplicacheProvider";
import { cn } from "@/utils/misc";
import Link from "next/link";

export default function HabitLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session } = useUser();

  return (
    <>
      {session?.user?.id != null ? (
        <ReplicacheProvider>
          <HabitsProvider>
            <DateProvider>{children}</DateProvider>
          </HabitsProvider>
        </ReplicacheProvider>
      ) : (
        <Link
          href="/auth/signin"
          className={cn(buttonVariants({ variant: "link" }), "text-lg")}
        >
          Login
        </Link>
      )}
    </>
  );
}
