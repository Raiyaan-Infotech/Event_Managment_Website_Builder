import { StatusPage } from "@/components/status-pages/status-page";

export function WebsitePlaceholder() {
  return (
    <StatusPage
      embedded
      variant="empty"
      title="No Content Yet"
      description="You haven't added any content to this section yet."
      supportText="Create or enable a section from the website builder menu."
      actions={[
        {
          label: "Create Page",
          href: "/website/pages/create",
          icon: "plus",
        },
        {
          label: "Go to UI Block",
          href: "/website/ui-block",
          icon: "back",
          variant: "outline",
        },
      ]}
      info={{
        icon: "idea",
        title: "Need ideas?",
        description: "Enable sections from UI Block or create a custom page.",
        href: "/website/ui-block",
      }}
    />
  );
}
