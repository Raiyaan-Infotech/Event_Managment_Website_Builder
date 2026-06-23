import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/ui/toast";
import { AppQueryProvider } from "@/components/providers/query-provider";
import { NetworkStatusGuard } from "@/components/status-pages/network-status-guard";

export const metadata: Metadata = {
  title: "EventCraft Website Builder",
  description: "Vendor website builder portal",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AppQueryProvider>
          <ToastProvider>
            <NetworkStatusGuard>{children}</NetworkStatusGuard>
          </ToastProvider>
        </AppQueryProvider>
      </body>
    </html>
  );
}
