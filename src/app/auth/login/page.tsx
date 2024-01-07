"use client";

import { Button } from "@/components/ui/button";
import { useUser } from "@/context/AuthProvider";
import { CircleNotch } from "@phosphor-icons/react";
import Link from "next/link";
import { useState } from "react";

export default function Page() {
  return (
    <div className="mx-auto flex w-full flex-col justify-center space-y-6 font-normal sm:w-[350px]  lg:p-8">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Login</h1>
      </div>
      <div className="rounded border border-input p-6">
        <SingUpWithGoogle />
      </div>

      <div className="text-center">
        <Link
          href="/auth/signup"
          className="mx-auto text-center text-sm text-muted-foreground underline underline-offset-4 hover:text-primary"
        >
          Don't have an account?
        </Link>
      </div>
    </div>
  );
}

export function SingUpWithGoogle() {
  const { signIn } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async () => {
    if (isLoading === true) return;

    setIsLoading(true);

    signIn();
  };

  return (
    <Button
      onClick={() => {
        handleSignup();
      }}
      variant="outline"
      type="button"
      className="w-full gap-2"
      disabled={isLoading}
    >
      {isLoading ? (
        <CircleNotch className="h-4 w-4 animate-spin" weight="bold" />
      ) : (
        <svg role="img" viewBox="0 0 24 24" className="h-4 w-4">
          <path
            fill="currentColor"
            d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
          />
        </svg>
      )}
      Sign in with Google
    </Button>
  );
}
