"use client";

import {
  Session,
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type ContextValue = {
  session: any;
  signIn: () => void;
  signOut: () => void;
};
const AuthContext = createContext<ContextValue>({} as ContextValue);

export function useUser() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useUser must be used within an AuthContext.");
  return context;
}

export function AuthProvider({
  children,
  initialSession,
  initialSub,
}: {
  initialSession: Session | null;
  children: React.ReactNode;
  initialSub: Record<string, unknown> | null;
}) {
  const [sub, setSub] = useState<Record<string, unknown> | null>(
    () => initialSub,
  );
  const [session, setSession] = useState<Session | null>(() => initialSession);
  const router = useRouter();
  const supabase = createClientComponentClient();
  let _session = useRef<Session | null>(null);

  useEffect(() => {
    getActiveSession();
    getSub();
    async function getActiveSession() {
      const {
        data: { session: activeSession },
      } = await supabase.auth.getSession();
      _session.current = activeSession;
      setSession(activeSession);
    }

    async function getSub() {
      const res = await fetch("/api/user");
      const { sub } = await res.json();
      setSub(sub);
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, currentSession) => {
      console.log("onAuthState called");
      if (
        event === "SIGNED_IN" ||
        (event === "TOKEN_REFRESHED" && !_session && currentSession)
      ) {
        router.refresh();
      }

      if (event == "SIGNED_OUT") {
        // router.push("/signin");
      }

      _session.current = currentSession;
      setSession(currentSession);
    });

    return () => subscription.unsubscribe();
  }, []);

  const value = useMemo(
    () =>
      ({
        session,
        signIn: async () => {
          if (process.env.NODE_ENV === "development") {
            await supabase.auth.signInWithPassword({
              email: "test@example.com",
              password: "testtest",
            });
          } else {
            await supabase.auth.signInWithOAuth({
              provider: "google",
              options: {
                queryParams: {
                  access_type: "offline",
                  prompt: "consent",
                },
                redirectTo: `${process.env.NEXT_PUBLIC_APP_URL!}/auth/callback`,
              },
            });
          }
        },
        signOut: async () => await supabase.auth.signOut(),
        isPremium: sub,
      }) as ContextValue,
    [session, sub],
  );

  return (
    <>
      <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    </>
  );
}
