"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FileText, Pencil, Search } from "lucide-react";
import { WebsiteBuilderLayout } from "../../_components/website-builder-layout";
import { FormSection } from "../../_components/form-section";
import { ConfirmDeleteButton } from "../../_components/confirm-delete-button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useCreateWebsitePage,
  useDeleteWebsitePage,
  useUpdateWebsitePage,
  useWebsitePages,
} from "@/hooks/use-website-builder";
import { useToast } from "@/components/ui/toast";
import {
  buildPagePayload,
  isFixedPage,
  mergeWebsitePages,
  toPageDraft,
  type WebsitePage,
} from "../_lib/page-store";

export default function PagesListPage() {
  const router = useRouter();
  const { data: pageRecords = [] } = useWebsitePages();
  const deletePage = useDeleteWebsitePage();
  const updatePage = useUpdateWebsitePage();
  const createPage = useCreateWebsitePage();
  const { showToast } = useToast();
  const isToggling = updatePage.isPending || createPage.isPending;
  const [query, setQuery] = React.useState("");
  const [pendingToggle, setPendingToggle] = React.useState<{
    page: WebsitePage;
    value: boolean;
  } | null>(null);

  const pages = React.useMemo(() => {
    const merged = mergeWebsitePages(pageRecords);
    // Fixed pages first, then dynamic — preserve existing order within each group.
    return [...merged].sort(
      (left, right) => Number(isFixedPage(right)) - Number(isFixedPage(left)),
    );
  }, [pageRecords]);

  const filteredPages = React.useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return pages;
    return pages.filter((page) =>
      [page.title, page.slug, page.pageType, page.status]
        .join(" ")
        .toLowerCase()
        .includes(normalized),
    );
  }, [pages, query]);

  const handleDelete = async (id: number | string) => {
    try {
      await deletePage.mutateAsync(id);
      showToast("Page deleted");
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Unable to delete page",
        "error",
      );
    }
  };

  const handleToggleActive = async (page: WebsitePage, value: boolean) => {
    try {
      const payload = buildPagePayload(
        { ...toPageDraft(page), enabled: value },
        pages,
        { page, isSystem: isFixedPage(page) },
      );
      // Fixed/system pages may not exist in the DB yet — create on first toggle.
      if (page.isPersisted) {
        await updatePage.mutateAsync({ id: page.id, payload });
      } else {
        await createPage.mutateAsync(payload);
      }
      showToast(value ? "Page published" : "Page set to draft");
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Unable to update page",
        "error",
      );
    }
  };

  const confirmToggle = async () => {
    if (!pendingToggle) return;
    await handleToggleActive(pendingToggle.page, pendingToggle.value);
    setPendingToggle(null);
  };

  const formContent = (
    <FormSection
      title="Pages"
      subtitle="All fixed and dynamic pages of your website."
      className="w-full rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-white p-3 shadow-sm"
      actions={
        <div className="relative hidden w-[240px] sm:block">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search pages..."
            className="h-8 !pl-8 text-[11px]"
          />
        </div>
      }
    >
      <div className="relative block sm:hidden">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search pages..."
          className="h-8 !pl-8 text-[11px]"
        />
      </div>

      <Table className="min-w-[720px] text-[11px]">
        <TableHeader>
          <TableRow className="bg-slate-50 hover:bg-slate-50">
            <TableHead className="w-[56px]">#</TableHead>
            <TableHead>Page</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredPages.length ? (
            filteredPages.map((page, index) => {
              const fixed = isFixedPage(page);
              const canDelete = page.isPersisted && !fixed;
              const published = page.status !== "draft" && page.enabled;
              const editHref = `/website/pages/${encodeURIComponent(page.routeKey)}/edit`;
              return (
                <TableRow key={String(page.id)}>
                  <TableCell className="font-bold">{index + 1}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 shrink-0 text-[var(--vendor-primary-btn)]" />
                      <div className="min-w-0">
                        <Link
                          href={editHref}
                          className="font-bold text-slate-900 hover:text-[var(--vendor-primary-btn)] hover:underline"
                        >
                          {page.title}
                        </Link>
                        <p className="text-[10px] font-semibold text-slate-500">/{page.slug}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`rounded px-2 py-1 text-[10px] font-bold ${
                        fixed
                          ? "bg-amber-100 text-amber-700"
                          : "bg-[var(--vendor-primary-btn)]/10 text-[var(--vendor-primary-btn)]"
                      }`}
                    >
                      {fixed ? "Fixed" : "Dynamic"}
                    </span>
                  </TableCell>
                  <TableCell>
                    {fixed ? (
                      // Fixed pages are always published — no status toggle.
                      <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-700">
                        Published
                      </span>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={published}
                          disabled={isToggling}
                          onCheckedChange={(value) => setPendingToggle({ page, value })}
                        />
                        <span
                          className={`text-[10px] font-bold ${
                            published ? "text-green-700" : "text-gray-500"
                          }`}
                        >
                          {published ? "Published" : "Draft"}
                        </span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={editHref}
                        title="Edit page"
                        className="flex h-7 w-7 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-[var(--vendor-primary-btn)]"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Link>
                      <ConfirmDeleteButton
                        className="text-rose-500 hover:text-rose-600 disabled:text-slate-300"
                        itemLabel={page.title}
                        disabled={!canDelete || deletePage.isPending}
                        title={
                          fixed ? "Fixed pages cannot be deleted" : undefined
                        }
                        onConfirm={() => handleDelete(page.id)}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="py-10 text-center">
                <div className="mx-auto flex max-w-[280px] flex-col items-center gap-2 text-slate-500">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--vendor-primary-btn)]/10 text-[var(--vendor-primary-btn)]">
                    <FileText className="h-5 w-5" />
                  </span>
                  <p className="text-[12px] font-black text-slate-700">No pages found</p>
                  <p className="text-[11px] font-medium leading-4">
                    Create your first page to get started.
                  </p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </FormSection>
  );

  return (
    <>
      <WebsiteBuilderLayout
        title="Pages List"
        subtitle="View and manage all your website pages."
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Website Builder", href: "/website" },
          { label: "Pages List" },
        ]}
        form={formContent}
        leftClassName="border-0 bg-transparent p-0 shadow-none"
        primaryButton={{
          label: "Create Page",
          onClick: () => router.push("/website/pages/create"),
        }}
        howItWorksLabel="How It Works"
        onHowItWorks={() =>
          alert("Edit or delete your pages here. Fixed pages cannot be deleted.")
        }
      />

      {pendingToggle ? (
        <div
          className="fixed inset-0 z-[140] flex items-center justify-center bg-slate-950/45 p-4"
          onClick={() => {
            if (!isToggling) setPendingToggle(null);
          }}
        >
          <div
            className="w-full max-w-sm rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-white p-5 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="space-y-1.5 text-left">
              <h3 className="text-[15px] font-black leading-5 text-[var(--vendor-text)]">
                {pendingToggle.value ? "Publish this page?" : "Set page to draft?"}
              </h3>
              <p className="text-[12px] leading-5 text-[var(--vendor-text-muted)]">
                {pendingToggle.value
                  ? `"${pendingToggle.page.title}" will be published and visible on your website.`
                  : `"${pendingToggle.page.title}" will be set to draft and hidden from your website.`}
              </p>
            </div>
            <div className="mt-4 flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setPendingToggle(null)}
                disabled={isToggling}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={confirmToggle}
                disabled={isToggling}
              >
                {isToggling
                  ? "Saving..."
                  : pendingToggle.value
                    ? "Publish"
                    : "Set to Draft"}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
