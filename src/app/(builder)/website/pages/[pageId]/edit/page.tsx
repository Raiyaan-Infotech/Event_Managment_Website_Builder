"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { WebsiteBuilderLayout } from "../../../_components/website-builder-layout";
import {
  buildPagePayload,
  mergeWebsitePages,
  toPageDraft,
} from "../../_lib/page-store";
import { PageEditorForm } from "../../_components/page-editor-form";
import {
  useCreateWebsitePage,
  useUpdateWebsitePage,
  useWebsitePages,
} from "@/hooks/use-website-builder";
import { useToast } from "@/components/ui/toast";

export default function EditPage() {
  const router = useRouter();
  const params = useParams<{ pageId: string }>();
  const pageId = decodeURIComponent(params.pageId);
  const { data: pageRecords = [], isLoading } = useWebsitePages();
  const updatePage = useUpdateWebsitePage();
  const createPage = useCreateWebsitePage();
  const { showToast } = useToast();
  const pages = React.useMemo(() => mergeWebsitePages(pageRecords), [pageRecords]);
  const page = pages.find((item) => item.routeKey === pageId);
  const [draft, setDraft] = React.useState({
    title: "",
    content: "",
    enabled: true,
  });
  const isSaving = updatePage.isPending || createPage.isPending;

  React.useEffect(() => {
    if (!page) return;
    setDraft(toPageDraft(page));
  }, [page]);

  if (!page && isLoading) {
    return (
      <WebsiteBuilderLayout
        title="Edit Page"
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Website Builder", href: "/website" },
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
          label: "Create Page",
          onClick: () => router.push("/website/pages/create"),
        }}
      />
    );
  }

  const handleSave = async () => {
    try {
      const payload = buildPagePayload(draft, pages, {
        page,
        isSystem: page.isSystem,
      });

      if (page.isPersisted) {
        await updatePage.mutateAsync({ id: page.id, payload });
      } else {
        const created = await createPage.mutateAsync(payload);
        router.replace(`/website/pages/${encodeURIComponent(String(created.id))}/edit`);
      }
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Unable to save page",
        "error",
      );
    }
  };

  return (
    <WebsiteBuilderLayout
      title="Edit Page"
      breadcrumbs={[
        { label: "Dashboard", href: "/" },
        { label: "Website Builder", href: "/website" },
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
