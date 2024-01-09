"use client";
import { useUser } from "@/context/AuthProvider";
import { DateProvider } from "@/context/DateProvider";
import { HabitsProvider } from "@/context/HabitsProvider";
import { ReplicacheProvider } from "@/context/ReplicacheProvider";
import { redirect } from "next/navigation";

export default function HabitLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session } = useUser();

  if (session?.user?.id == null) redirect("/auth/login");

  return (
    <ReplicacheProvider>
      <HabitsProvider>
        <DateProvider>{children}</DateProvider>
      </HabitsProvider>
    </ReplicacheProvider>
  );
}
