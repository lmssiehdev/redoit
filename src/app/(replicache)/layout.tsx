"use client";
import { DateProvider } from "@/context/DateProvider";
import { HabitsProvider } from "@/context/HabitsProvider";
import { ReplicacheProvider } from "@/context/ReplicacheProvider";

export default function HabitLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReplicacheProvider>
      <HabitsProvider>
        <DateProvider>
          <>{children}</>
        </DateProvider>
      </HabitsProvider>
    </ReplicacheProvider>
  );
}

// function Content({ children }: { children: React.ReactNode }) {
//   const { rep } = useReplicacheFromContext();

//   if (!rep) return null;

//   return <>{children}</>;
// }
