"use client";

import Home from "@/components/Main";
import { useUser } from "@/context/AuthProvider";

export default function Page() {
  const { session } = useUser();

  return (
    <div>
      <pre className="font-handrawn">
        {JSON.stringify(session?.user?.id, null, 2)}
      </pre>
      {session?.user?.id != null ? (
        <Home userId={session.user?.id} />
      ) : (
        <div> Login</div>
      )}
    </div>
  );
}
