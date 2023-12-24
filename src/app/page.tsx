"use client";

import { LandingPageTrackerDemo } from "@/components/LandingPageTrackerDemo";
import { UserNav } from "@/components/Navbar";
import { Button, buttonVariants } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";
import { useUser } from "@/context/AuthProvider";
import { DateProvider } from "@/context/DateProvider";
import { cn } from "@/utils/misc";
import Link from "next/link";

export default function Page() {
}

export function Content({ children }: { children: React.ReactNode }) {
  const { session } = useUser();

  return (
    <div>
      <UserNav />
      {children}
      <Toaster />
    </div>
  );
}
