import { SingUpWithGoogle } from "@/app/auth/login/page";
import Link from "next/link";

export default function Page() {
  return (
    <div className="mx-auto flex w-full flex-col justify-center space-y-6 font-normal sm:w-[350px]  lg:p-8">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Create an account
        </h1>
      </div>
      <div className="rounded border border-input p-6">
        <SingUpWithGoogle />
      </div>

      <div className="text-center">
        <Link
          href="/auth/login"
          className="mx-auto text-center text-sm text-muted-foreground underline underline-offset-4 hover:text-primary"
        >
          Already have an account?
        </Link>
      </div>
    </div>
  );
}
