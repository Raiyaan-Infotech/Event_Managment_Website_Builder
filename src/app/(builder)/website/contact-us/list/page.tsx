"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, Mail, Search } from "lucide-react";
import { WebsiteBuilderLayout } from "../../_components/website-builder-layout";
import { FormSection } from "../../_components/form-section";
import { ConfirmDeleteButton } from "../../_components/confirm-delete-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useContactCategories,
  useContactMessages,
  useDeleteContactMessage,
  useUpdateContactMessage,
} from "@/hooks/use-website-builder";

type ContactMessageStatus = "new" | "read" | "replied" | "archived";

const PAGE_SIZE = 10;

type ContactMessage = {
  id: string;
  recordId: number | string;
  categoryId: string;
  categoryName: string;
  categoryState: "active" | "disabled" | "deleted";
  categoryOther: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: ContactMessageStatus;
  createdAt: string;
};

function normalizeStatus(value: unknown): ContactMessageStatus {
  const status = String(value || "new").toLowerCase();
  if (status === "read" || status === "replied" || status === "archived") {
    return status;
  }
  return "new";
}

function isProtectedCategoryName(name: string) {
  return ["other", "others"].includes(name.trim().toLowerCase());
}

function mapMessages(
  records: Array<Record<string, unknown>>,
  categoryRecords: Array<Record<string, unknown>>,
): ContactMessage[] {
  const categoryMap = new Map(
    categoryRecords.map((category) => {
      const activeValue = String(category.is_active ?? "1").toLowerCase();
      const disabled =
        category.is_active === false ||
        category.is_active === 0 ||
        activeValue === "0" ||
        activeValue === "false" ||
        activeValue === "no" ||
        activeValue === "off";
      return [
        String(category.id || ""),
        {
          name: String(category.name || "Uncategorized"),
          state: disabled ? "disabled" : "active",
        },
      ] as const;
    }),
  );

  return records.map((record) => {
    const categoryId = String(record.category_id || "");
    const category = categoryMap.get(categoryId);
    return {
      id: String(record.id || ""),
      recordId: String(record.id || ""),
      categoryId,
      categoryName: category?.name || (categoryId ? "Deleted category" : "Uncategorized"),
      categoryState: (category?.state || (categoryId ? "deleted" : "active")) as
        | "active"
        | "disabled"
        | "deleted",
      categoryOther: String(record.category_other || ""),
      name: String(record.name || "-"),
      email: String(record.email || "-"),
      phone: String(record.phone || "-"),
      message: String(record.message || ""),
      status: normalizeStatus(record.status),
      createdAt: String(record.created_at || ""),
    };
  });
}

export default function ContactListPage() {
  const { data: messageRecords = [] } = useContactMessages();
  const { data: categoryRecords = [] } = useContactCategories();
  const updateMessage = useUpdateContactMessage();
  const deleteMessage = useDeleteContactMessage();
  const [query, setQuery] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);

  const messages = React.useMemo(
    () =>
      mapMessages(
        messageRecords as Array<Record<string, unknown>>,
        categoryRecords as Array<Record<string, unknown>>,
      ),
    [categoryRecords, messageRecords],
  );

  const filteredMessages = React.useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return messages;
    return messages.filter((message) =>
      [
        message.categoryName,
        message.categoryOther,
        message.name,
        message.email,
        message.phone,
        message.message,
        message.status,
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalized),
    );
  }, [messages, query]);

  const totalPages = Math.max(1, Math.ceil(filteredMessages.length / PAGE_SIZE));
  const pageStart = (currentPage - 1) * PAGE_SIZE;
  const pageEnd = pageStart + PAGE_SIZE;
  const paginatedMessages = filteredMessages.slice(pageStart, pageEnd);

  React.useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages));
  }, [totalPages]);

  const visiblePages = React.useMemo(() => {
    const pages: number[] = [];
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, start + 4);
    const adjustedStart = Math.max(1, end - 4);
    for (let page = adjustedStart; page <= end; page += 1) {
      pages.push(page);
    }
    return pages;
  }, [currentPage, totalPages]);

  const updateQuery = (value: string) => {
    setQuery(value);
    setCurrentPage(1);
  };

  const changeStatus = async (
    message: ContactMessage,
    status: ContactMessageStatus,
  ) => {
    await updateMessage.mutateAsync({
      id: message.recordId,
      payload: {
        category_id: message.categoryId || null,
        category_other: message.categoryOther || null,
        name: message.name,
        email: message.email,
        phone: message.phone,
        message: message.message,
        status,
        is_active: true,
      },
    });
  };

  const deleteRow = async (id: string) => {
    await deleteMessage.mutateAsync(id);
  };

  const formContent = (
    <FormSection
      title="Contact List"
      subtitle="Submitted contact form messages will appear here."
      className="w-full rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-white p-3 shadow-sm"
      actions={
        <div className="relative hidden w-[260px] sm:block">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <Input
            value={query}
            onChange={(event) => updateQuery(event.target.value)}
            placeholder="Search messages..."
            className="h-8 !pl-8 text-[11px]"
          />
        </div>
      }
    >
      <div className="relative block sm:hidden">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
        <Input
          value={query}
          onChange={(event) => updateQuery(event.target.value)}
          placeholder="Search messages..."
          className="h-8 !pl-8 text-[11px]"
        />
      </div>

      <Table className="min-w-[980px] text-[11px]">
        <TableHeader>
          <TableRow className="bg-slate-50 hover:bg-slate-50">
            <TableHead className="w-[56px]">#</TableHead>
            <TableHead>Visitor</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Message</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedMessages.length ? (
            paginatedMessages.map((message, index) => (
              <TableRow key={message.id}>
                <TableCell className="font-bold">{pageStart + index + 1}</TableCell>
                <TableCell>
                  <div className="space-y-0.5">
                    <p className="font-bold text-slate-900">{message.name}</p>
                    <p className="text-[10px] font-semibold text-slate-500">
                      {message.email}
                    </p>
                    <p className="text-[10px] font-semibold text-slate-500">
                      {message.phone}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <span
                    className={
                      message.categoryState === "active"
                        ? "rounded bg-[var(--vendor-primary-btn)]/10 px-2 py-1 text-[10px] font-bold text-[var(--vendor-primary-btn)]"
                        : message.categoryState === "disabled"
                          ? "rounded bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-500"
                          : "rounded bg-rose-50 px-2 py-1 text-[10px] font-bold text-rose-600"
                    }
                  >
                    {message.categoryName}
                  </span>
                  {message.categoryState !== "active" ? (
                    <span className="ml-1 rounded bg-slate-200 px-1.5 py-0.5 text-[9px] font-black uppercase text-slate-600">
                      {message.categoryState}
                    </span>
                  ) : null}
                  {message.categoryOther ? (
                    <p className="mt-1 max-w-[160px] break-words text-[10px] font-semibold text-slate-500">
                      “{message.categoryOther}”
                    </p>
                  ) : null}
                </TableCell>
                <TableCell>
                  <p className="line-clamp-2 max-w-[280px] text-[11px] font-medium leading-4 text-slate-600">
                    {message.message || "-"}
                  </p>
                </TableCell>
                <TableCell>
                  <Select
                    value={message.status}
                    onValueChange={(value) =>
                      changeStatus(message, value as ContactMessageStatus)
                    }
                  >
                    <SelectTrigger className="h-8 w-[120px] text-[11px] font-bold">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="read">Read</SelectItem>
                      <SelectItem value="replied">Replied</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <div className="flex justify-end">
                    <ConfirmDeleteButton
                      className="text-rose-500 hover:text-rose-600 disabled:text-slate-300"
                      itemLabel={message.name}
                      onConfirm={() => deleteRow(message.id)}
                      disabled={isProtectedCategoryName(message.categoryName)}
                      title={
                        isProtectedCategoryName(message.categoryName)
                          ? 'Messages under "Other" category cannot be deleted'
                          : undefined
                      }
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="py-10 text-center">
                <div className="mx-auto flex max-w-[280px] flex-col items-center gap-2 text-slate-500">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--vendor-primary-btn)]/10 text-[var(--vendor-primary-btn)]">
                    <Mail className="h-5 w-5" />
                  </span>
                  <p className="text-[12px] font-black text-slate-700">
                    No contact messages yet
                  </p>
                  <p className="text-[11px] font-medium leading-4">
                    Messages submitted from the public contact form will appear here.
                  </p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="mt-3 flex flex-col gap-2 border-t border-slate-100 pt-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[11px] font-semibold text-slate-500">
          {filteredMessages.length > 0
            ? `Showing ${pageStart + 1}-${Math.min(pageEnd, filteredMessages.length)} of ${filteredMessages.length} messages`
            : "Showing 0 messages"}
        </p>
        {filteredMessages.length > PAGE_SIZE ? (
          <div className="flex items-center gap-1.5">
            <Button
              type="button"
              variant="outline"
              size="xs"
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={currentPage <= 1}
              className="h-7 px-2 text-[11px]"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              Prev
            </Button>
            {visiblePages.map((page) => (
              <Button
                key={page}
                type="button"
                variant={page === currentPage ? "primary" : "outline"}
                size="icon-xs"
                onClick={() => setCurrentPage(page)}
                className="h-7 w-7 text-[11px]"
              >
                {page}
              </Button>
            ))}
            <Button
              type="button"
              variant="outline"
              size="xs"
              onClick={() =>
                setCurrentPage((page) => Math.min(totalPages, page + 1))
              }
              disabled={currentPage >= totalPages}
              className="h-7 px-2 text-[11px]"
            >
              Next
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        ) : null}
      </div>
    </FormSection>
  );

  return (
    <WebsiteBuilderLayout
      title="Contact List"
      subtitle="View and manage contact form messages."
      form={formContent}
      leftClassName="border-0 bg-transparent p-0 shadow-none"
    />
  );
}
