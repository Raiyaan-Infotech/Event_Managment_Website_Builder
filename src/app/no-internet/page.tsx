import { StatusPage } from "@/components/status-pages/status-page";

export default function NoInternetPage() {
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
        description: "Check your connection or contact your network administrator.",
      }}
    />
  );
}
