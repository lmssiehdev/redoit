"use client";
import { useUser } from "@/context/AuthProvider";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

export function Navbar() {
  const user = useUser();

  // const handleSignInWithEmail = async () => {
  //   await supabase.auth.signInWithPassword({
  //     email: "test@example.com",
  //     password: "test",
  //   });
  // };

  // const handleSignIn = async () => {
  //   await supabase.auth.signInWithOAuth({
  //     provider: "google",
  //     options: {
  //       queryParams: {
  //         access_type: "offline",
  //         prompt: "consent",
  //       },
  //       redirectTo: "http://localhost:3000/auth/callback",
  //     },
  //   });
  //   router.refresh();
  // };

  const handleSignOut = async () => await user.signOut();

  return (
    <>
      <nav className="flex justify-between">
        <h1>redoit</h1>
        <ul>
          {user.session === null ? (
            <>
              <li>
                <button onClick={() => user.signIn()}>Sign In</button>
              </li>
            </>
          ) : (
            <li>
              <button onClick={handleSignOut}>Logout</button>
            </li>
          )}
        </ul>
      </nav>
    </>
  );
}
