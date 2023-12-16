"use client";

import {
  Session,
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";

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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const router = useRouter();
  const supabase = createClientComponentClient();

  /*
      * Note sure I need this, yet.
      useEffect(() => {
      const searchParams = new URLSearchParams(window?.location?.hash ?? '');
      const access_token = searchParams.get('#access_token');
      const refresh_token = searchParams.get('refresh_token');

      if (access_token && refresh_token) {
        supabase.auth.setSession({ access_token, refresh_token });
        router.push('/');
        setInitial(true);
      } else if (!accessToken) {
        window.location.href = '/signin';
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

  */
  let _session = useRef<Session | null>(null);

  useEffect(() => {
    getActiveSession();
    async function getActiveSession() {
      const {
        data: { session: activeSession },
      } = await supabase.auth.getSession();
      _session.current = activeSession;
      setSession(activeSession);
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

    // return () => subscription.unsubscribe();
  }, []);

  const value = useMemo(
    () =>
      ({
        session,
        signIn: async () => {
          await supabase.auth.signInWithPassword({
            email: "test@example.com",
            password: "test",
          });
          return;
          await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
              queryParams: {
                access_type: "offline",
                prompt: "consent",
              },
              redirectTo: "http://localhost:3000/auth/callback",
            },
          });
        },
        signOut: async () => await supabase.auth.signOut(),
      } as ContextValue),
    [session]
  );

  return (
    <>
      <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    </>
  );
}
