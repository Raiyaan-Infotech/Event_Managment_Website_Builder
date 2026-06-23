import { StatusPage } from "@/components/status-pages/status-page";

export default function NoContentPage() {
  return (
    <StatusPage
      variant="empty"
      title="No Content Yet"
      description="You haven't added any content to this section yet."
      supportText="Get started by creating your first content."
      actions={[
        {
          label: "Add New Content",
          href: "/website/pages/create",
          icon: "plus",
        },
      ]}
      info={{
        icon: "idea",
        title: "Need ideas?",
        description: "Check out our templates or documentation to get started.",
        href: "/website/ui-block",
      }}
    />
  );
}
