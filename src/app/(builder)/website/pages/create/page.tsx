"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { WebsiteBuilderLayout } from "../../_components/website-builder-layout";
import {
  buildPagePayload,
  mergeWebsitePages,
} from "../_lib/page-store";
import { PageEditorForm } from "../_components/page-editor-form";
import {
  useCreateWebsitePage,
  useWebsitePages,
} from "@/hooks/use-website-builder";
import { useToast } from "@/components/ui/toast";

export default function CreatePage() {
  const router = useRouter();
  const { data: pageRecords = [] } = useWebsitePages();
  const createPage = useCreateWebsitePage();
  const { showToast } = useToast();
  const [draft, setDraft] = React.useState({
    title: "",
    content: "",
    enabled: true,
  });
  const pages = React.useMemo(() => mergeWebsitePages(pageRecords), [pageRecords]);
  const isSaving = createPage.isPending;

  const handleSave = async () => {
    try {
      const created = await createPage.mutateAsync(buildPagePayload(draft, pages));
      router.push(`/website/pages/${encodeURIComponent(String(created.id))}/edit`);
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Unable to create page",
        "error",
      );
    }
  };

  return (
    <WebsiteBuilderLayout
      title="Create Page"
      breadcrumbs={[
        { label: "Dashboard", href: "/" },
        { label: "Website Builder", href: "/website" },
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
