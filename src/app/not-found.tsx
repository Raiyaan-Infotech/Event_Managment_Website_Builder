import { StatusPage } from "@/components/status-pages/status-page";

export default function NotFoundPage() {
  return (
    <StatusPage
      variant="not-found"
      title="Oops! Page not found"
      description="The page you are looking for doesn't exist or has been moved."
      supportText="Let's get you back on track."
      topAction={{
        label: "Back to Home",
        href: "/",
        icon: "back",
      }}
      actions={[
        {
          label: "Go to Dashboard",
          href: "/",
          icon: "home",
        },
        {
          label: "Visit Website",
          href: "/website",
          icon: "globe",
          variant: "outline",
        },
      ]}
      info={{
        icon: "help",
        title: "Need help?",
        description: "Visit our Help Center or contact support.",
        href: "/website",
      }}
    />
  );
}
