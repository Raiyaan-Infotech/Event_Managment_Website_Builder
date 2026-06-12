"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { WebsiteBuilderLayout } from "../../../_components/website-builder-layout";
import { createSlug, useWebsitePages } from "../../_lib/page-store";
import { PageEditorForm } from "../../_components/page-editor-form";

export default function EditPage() {
  const router = useRouter();
  const params = useParams<{ pageId: string }>();
  const pageId = decodeURIComponent(params.pageId);
  const { pages, savePages, isLoaded } = useWebsitePages();
  const page = pages.find((item) => item.id === pageId);
  const [draft, setDraft] = React.useState({
    title: "",
    content: "",
  });
  const [isSaving, setIsSaving] = React.useState(false);

  React.useEffect(() => {
    if (!page) return;

    setDraft({
      title: page.title,
      content: page.content,
    });
  }, [page]);

  if (!page && !isLoaded) {
    return (
      <WebsiteBuilderLayout
        title="Edit Page"
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Website Builder", href: "/website" },
          { label: "Pages", href: "/website/pages" },
          { label: "Edit Page" },
        ]}
        form={
          <div className="rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-[var(--vendor-panel-bg)] p-4 text-[12px] font-semibold text-[var(--vendor-text-muted)]">
            Loading page...
          </div>
        }
        onCancel={() => router.push("/website/pages")}
        leftClassName="border-0 bg-transparent p-0 shadow-none"
      />
    );
  }

  if (!page) {
    return (
      <WebsiteBuilderLayout
        title="Edit Page"
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Website Builder", href: "/website" },
          { label: "Pages", href: "/website/pages" },
          { label: "Edit Page" },
        ]}
        form={
          <div className="rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-[var(--vendor-panel-bg)] p-4 text-[12px] font-semibold text-[var(--vendor-text-muted)]">
            Page not found.
          </div>
        }
        onCancel={() => router.push("/website/pages")}
        leftClassName="border-0 bg-transparent p-0 shadow-none"
        primaryButton={{
          label: "Back to Pages",
          onClick: () => router.push("/website/pages"),
        }}
      />
    );
  }

  const handleSave = () => {
    const cleanTitle = draft.title.trim() || "Untitled Page";

    setIsSaving(true);
    savePages((currentPages) =>
      currentPages.map((item) =>
        item.id === page.id
          ? {
              ...item,
              title: cleanTitle,
              slug: createSlug(cleanTitle),
              content: draft.content,
            }
          : item,
      ),
    );
    router.push("/website/pages");
  };

  return (
    <WebsiteBuilderLayout
      title="Edit Page"
      breadcrumbs={[
        { label: "Dashboard", href: "/" },
        { label: "Website Builder", href: "/website" },
        { label: "Pages", href: "/website/pages" },
        { label: "Edit Page" },
      ]}
      form={<PageEditorForm draft={draft} onChange={setDraft} />}
      onCancel={() => router.push("/website/pages")}
      leftClassName="border-0 bg-transparent p-0 shadow-none"
      primaryButton={{
        label: "Update Page",
        onClick: handleSave,
        isLoading: isSaving,
      }}
      howItWorksLabel="How It Works"
      onHowItWorks={() =>
        alert("This is where you'd explain how to use the page editor.")
      }
    />
  );
}
