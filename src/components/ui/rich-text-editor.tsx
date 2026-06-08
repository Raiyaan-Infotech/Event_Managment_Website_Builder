"use client";

import * as React from "react";
import {
  Bold,
  Italic,
  Link,
  List,
  ListOrdered,
  Quote,
  Table,
  Underline,
  Image as ImageIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  height?: string | number;
  readOnly?: boolean;
}

function htmlToPlainText(value: string) {
  return value
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

const toolbarItems = [
  { label: "Bold", icon: Bold },
  { label: "Italic", icon: Italic },
  { label: "Underline", icon: Underline },
  { label: "Bulleted list", icon: List },
  { label: "Numbered list", icon: ListOrdered },
  { label: "Quote", icon: Quote },
  { label: "Link", icon: Link },
  { label: "Image", icon: ImageIcon },
  { label: "Table", icon: Table },
];

export function RichTextEditor({
  value,
  onChange,
  placeholder,
  height = "300px",
  readOnly = false,
}: RichTextEditorProps) {
  const plainValue = React.useMemo(() => htmlToPlainText(value), [value]);

  return (
    <div className="w-full bg-[var(--vendor-panel-bg)]">
      <div className="flex flex-wrap items-center gap-1 border-b border-[var(--vendor-border)] p-2">
        <button
          type="button"
          className="h-7 rounded-[var(--vendor-radius-control)] border border-[var(--vendor-border)] px-2 text-[11px] font-semibold text-[var(--vendor-text)]"
          disabled={readOnly}
        >
          Paragraph
        </button>
        {toolbarItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              type="button"
              title={item.label}
              disabled={readOnly}
              className="flex h-7 w-7 items-center justify-center rounded-[var(--vendor-radius-control)] text-[var(--vendor-text)] hover:bg-[var(--vendor-table-row-hover)] disabled:opacity-50"
            >
              <Icon className="h-3.5 w-3.5" />
            </button>
          );
        })}
      </div>
      <textarea
        readOnly={readOnly}
        value={plainValue}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        style={{ minHeight: height }}
        className={cn(
          "w-full resize-none border-0 bg-transparent px-3 py-3 text-[var(--vendor-form-input-text)] font-medium leading-6 text-[var(--vendor-text)] outline-none placeholder:text-[var(--vendor-text-muted)]",
        )}
      />
    </div>
  );
}
