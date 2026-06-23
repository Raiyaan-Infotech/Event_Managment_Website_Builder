"use client";

import * as React from "react";
import { StatusPage } from "@/components/status-pages/status-page";

export function NetworkStatusGuard({ children }: { children: React.ReactNode }) {
  const [isOnline, setIsOnline] = React.useState(true);
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    const syncOnlineState = () => setIsOnline(navigator.onLine);

    setIsMounted(true);
    syncOnlineState();
    window.addEventListener("online", syncOnlineState);
    window.addEventListener("offline", syncOnlineState);

    return () => {
      window.removeEventListener("online", syncOnlineState);
      window.removeEventListener("offline", syncOnlineState);
    };
  }, []);

  if (isMounted && !isOnline) {
    return (
      <StatusPage
        variant="offline"
        title="No Internet Connection"
        description="Looks like you're offline. Please check your internet connection and try again."
        actions={[
          {
            label: "Try Again",
            href: "/no-internet",
            icon: "refresh",
          },
        ]}
        info={{
          icon: "refresh",
          title: "Still having trouble?",
          description:
            "Check your connection or contact your network administrator.",
        }}
      />
    );
  }

  return <>{children}</>;
}
