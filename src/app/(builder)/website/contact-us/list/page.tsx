"use client";

import * as React from "react";
import { Mail, Search } from "lucide-react";
import { WebsiteBuilderLayout } from "../../_components/website-builder-layout";
import { FormSection } from "../../_components/form-section";
import { ConfirmDeleteButton } from "../../_components/confirm-delete-button";
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

type ContactMessage = {
  id: string;
  recordId: number | string;
  categoryId: string;
  categoryName: string;
  categoryOther: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
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

function mapMessages(
  records: Array<Record<string, unknown>>,
  categoryRecords: Array<Record<string, unknown>>,
): ContactMessage[] {
  const categoryMap = new Map(
    categoryRecords.map((category) => [
      String(category.id || ""),
      String(category.name || "Uncategorized"),
    ]),
  );

  return records.map((record) => {
    const categoryId = String(record.category_id || "");
    return {
      id: String(record.id || ""),
      recordId: String(record.id || ""),
      categoryId,
      categoryName: categoryMap.get(categoryId) || "Uncategorized",
      categoryOther: String(record.category_other || ""),
      name: String(record.name || "-"),
      email: String(record.email || "-"),
      phone: String(record.phone || "-"),
      subject: String(record.subject || "-"),
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
        message.subject,
        message.message,
        message.status,
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalized),
    );
  }, [messages, query]);

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
        subject: message.subject,
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
            onChange={(event) => setQuery(event.target.value)}
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
          onChange={(event) => setQuery(event.target.value)}
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
            <TableHead>Subject</TableHead>
            <TableHead>Message</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredMessages.length ? (
            filteredMessages.map((message, index) => (
              <TableRow key={message.id}>
                <TableCell className="font-bold">{index + 1}</TableCell>
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
                  <span className="rounded bg-[var(--vendor-primary-btn)]/10 px-2 py-1 text-[10px] font-bold text-[var(--vendor-primary-btn)]">
                    {message.categoryName}
                  </span>
                  {message.categoryOther ? (
                    <p className="mt-1 max-w-[160px] break-words text-[10px] font-semibold text-slate-500">
                      “{message.categoryOther}”
                    </p>
                  ) : null}
                </TableCell>
                <TableCell className="font-semibold text-slate-700">
                  {message.subject}
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
                      className="text-rose-500 hover:text-rose-600"
                      itemLabel={message.subject || message.name}
                      onConfirm={() => deleteRow(message.id)}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="py-10 text-center">
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
