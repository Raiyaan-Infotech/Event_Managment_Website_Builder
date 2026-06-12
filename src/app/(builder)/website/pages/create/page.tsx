"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { WebsiteBuilderLayout } from "../../_components/website-builder-layout";
import { DEFAULT_PAGE_CONTENT, createPageId, createSlug, useWebsitePages } from "../_lib/page-store";
import { PageEditorForm } from "../_components/page-editor-form";

export default function CreatePage() {
  const router = useRouter();
  const { pages, savePages } = useWebsitePages();
  const [draft, setDraft] = React.useState({
    title: "",
    content: DEFAULT_PAGE_CONTENT,
  });
  const [isSaving, setIsSaving] = React.useState(false);

  const handleSave = () => {
    const cleanTitle = draft.title.trim() || "Untitled Page";
    const id = createPageId(cleanTitle, pages);

    setIsSaving(true);
    savePages([
      ...pages,
      {
        id,
        title: cleanTitle,
        slug: createSlug(cleanTitle),
        content: draft.content,
        enabled: true,
      },
    ]);
    router.push("/website/pages");
  };

  return (
    <WebsiteBuilderLayout
      title="Create Page"
      breadcrumbs={[
        { label: "Dashboard", href: "/" },
        { label: "Website Builder", href: "/website" },
        { label: "Pages", href: "/website/pages" },
        { label: "Create Page" },
      ]}
      form={<PageEditorForm draft={draft} onChange={setDraft} />}
      onCancel={() => router.push("/website/pages")}
      leftClassName="border-0 bg-transparent p-0 shadow-none"
      primaryButton={{
        label: "Create Page",
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
