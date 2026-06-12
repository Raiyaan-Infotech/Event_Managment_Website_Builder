"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Edit2, FileText, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { WebsiteBuilderLayout } from "../_components/website-builder-layout";
import { FormSection } from "../_components/form-section";
import { useWebsitePages } from "./_lib/page-store";

const card =
  "rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-[var(--vendor-panel-bg)] p-3 shadow-sm";

export default function PagesPage() {
  const router = useRouter();
  const { pages, savePages, resetPages } = useWebsitePages();

  const form = (
    <FormSection
      title="Pages List"
      subtitle="Create and manage website pages."
      icon={<FileText className="h-4 w-4" />}
      actions={
        <Button
          type="button"
          size="xs"
          onClick={() => router.push("/website/pages/create")}
          className="gap-1.5"
        >
          <Plus className="h-3.5 w-3.5" />
          Create Page
        </Button>
      }
      className={`${card} space-y-3`}
    >
      <div className="overflow-hidden rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)]">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-50">
              <TableHead className="h-10 px-3 text-[11px] font-semibold text-slate-500">
                Page Title
              </TableHead>
              <TableHead className="h-10 px-3 text-[11px] font-semibold text-slate-500">
                URL
              </TableHead>
              <TableHead className="h-10 px-3 text-[11px] font-semibold text-slate-500">
                Status
              </TableHead>
              <TableHead className="h-10 px-3 text-right text-[11px] font-semibold text-slate-500">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pages.map((page) => (
              <TableRow key={page.id} className="hover:bg-slate-50">
                <TableCell className="px-3 py-3">
                  <p className="text-[12px] font-bold text-[var(--vendor-text)]">
                    {page.title}
                  </p>
                </TableCell>
                <TableCell className="px-3 py-3 text-[12px] font-medium text-[var(--vendor-text-muted)]">
                  {page.slug}
                </TableCell>
                <TableCell className="px-3 py-3">
                  <Switch
                    checked={page.enabled}
                    className="data-[state=checked]:bg-emerald-500"
                    onCheckedChange={(enabled) =>
                      savePages((currentPages) =>
                        currentPages.map((item) =>
                          item.id === page.id ? { ...item, enabled } : item,
                        ),
                      )
                    }
                  />
                </TableCell>
                <TableCell className="px-3 py-3 text-right">
                  <div className="inline-flex items-center gap-1.5">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon-xs"
                      onClick={() =>
                        router.push(`/website/pages/${encodeURIComponent(page.id)}/edit`)
                      }
                      aria-label={`Edit ${page.title}`}
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon-xs"
                      onClick={() =>
                        savePages((currentPages) =>
                          currentPages.filter((item) => item.id !== page.id),
                        )
                      }
                      className="text-rose-500 hover:text-rose-600"
                      aria-label={`Delete ${page.title}`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </FormSection>
  );

  return (
    <WebsiteBuilderLayout
      title="Pages"
      form={form}
      onCancel={resetPages}
      leftClassName="border-0 bg-transparent p-0 shadow-none"
      primaryButton={{
        label: "Create Page",
        onClick: () => router.push("/website/pages/create"),
      }}
      howItWorksLabel="How It Works"
      onHowItWorks={() =>
        alert("This is where you'd explain how to use the page editor.")
      }
    />
  );
}
