"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Pencil, Plus } from "lucide-react";
import { WebsiteBuilderLayout } from "../_components/website-builder-layout";
import { FormSection } from "../_components/form-section";
import { Button, OutlineButton, PrimaryButton } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import {
  useDeleteWebsitePage,
  useWebsitePages,
} from "@/hooks/use-website-builder";
import { mergeWebsitePages } from "./_lib/page-store";
import { ConfirmDeleteButton } from "../_components/confirm-delete-button";

export default function PagesListPage() {
  const router = useRouter();
  const { data: pageRecords = [], isLoading } = useWebsitePages();
  const deletePage = useDeleteWebsitePage();
  const { showToast } = useToast();
  const pages = React.useMemo(() => mergeWebsitePages(pageRecords), [pageRecords]);
  const [deletingId, setDeletingId] = React.useState<number | string | null>(null);

  const handleDelete = async (id: number | string) => {
    setDeletingId(id);
    try {
      await deletePage.mutateAsync(id);
      showToast("Page deleted");
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Unable to delete page",
        "error",
      );
    } finally {
      setDeletingId(null);
    }
  };

  const form = (
    <div className="space-y-3">
      <FormSection
        title="Pages"
        className="rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-[var(--vendor-panel-bg)] p-3 shadow-sm"
      >
        {isLoading ? (
          <div className="rounded-[var(--vendor-radius-control)] border border-[var(--vendor-border)] bg-slate-50 px-3 py-4 text-[12px] font-medium text-[var(--vendor-text-muted)]">
            Loading pages...
          </div>
        ) : pages.length === 0 ? (
          <div className="rounded-[var(--vendor-radius-control)] border border-dashed border-[var(--vendor-border)] bg-slate-50 px-3 py-6 text-center">
            <p className="text-[12px] font-semibold text-[var(--vendor-text)]">
              No pages yet
            </p>
            <p className="mt-1 text-[11px] text-[var(--vendor-text-muted)]">
              Create your first custom page for the website menu and footer.
            </p>
            <PrimaryButton
              type="button"
              size="sm"
              className="mt-3 h-8 px-3 text-[11px]"
              onClick={() => router.push("/website/pages/create")}
            >
              <Plus className="h-3.5 w-3.5 shrink-0" />
              Create Page
            </PrimaryButton>
          </div>
        ) : (
          <div className="space-y-2">
            {pages.map((page) => (
              <div
                key={page.routeKey}
                className="flex flex-wrap items-center gap-2 rounded-[var(--vendor-radius-control)] border border-[var(--vendor-border)] bg-white px-3 py-2.5"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate text-[12px] font-semibold text-[var(--vendor-text)]">
                      {page.title}
                    </p>
                    {page.isSystem ? (
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.06em] text-slate-500">
                        System
                      </span>
                    ) : null}
                    <span
                      className={`rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.06em] ${
                        page.enabled
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-amber-50 text-amber-600"
                      }`}
                    >
                      {page.enabled ? "Active" : "Draft"}
                    </span>
                  </div>
                  <p className="mt-1 truncate text-[10px] text-[var(--vendor-text-muted)]">
                    /{page.slug}
                  </p>
                </div>

                <div className="flex items-center gap-1.5">
                  <OutlineButton
                    type="button"
                    size="xs"
                    className="h-7 px-2 text-[10px]"
                    onClick={() =>
                      router.push(`/website/pages/${encodeURIComponent(page.routeKey)}/edit`)
                    }
                  >
                    <Pencil className="h-3.5 w-3.5 shrink-0" />
                    Edit
                  </OutlineButton>

                  {!page.isSystem && page.isPersisted ? (
                    <ConfirmDeleteButton
                      className="text-rose-500 hover:text-rose-600"
                      disabled={deletingId === page.id}
                      itemLabel={page.title}
                      onConfirm={() => handleDelete(page.id)}
                    />
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </FormSection>
    </div>
  );

  return (
    <WebsiteBuilderLayout
      title="Pages"
      form={form}
      leftClassName="border-0 bg-transparent p-0 shadow-none"
      topActions={
        <PrimaryButton
          type="button"
          size="sm"
          className="h-8 px-3 text-[11px]"
          onClick={() => router.push("/website/pages/create")}
        >
          <Plus className="h-3.5 w-3.5 shrink-0" />
          Create Page
        </PrimaryButton>
      }
    />
  );
}
