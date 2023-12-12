import { useEffect, useState } from "react";

export function useIsOnline() {
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    const handleOffline = () => setIsOnline(false);
    const handleOnline = () => setIsOnline(true);

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", () => handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  });

  return isOnline;
}
