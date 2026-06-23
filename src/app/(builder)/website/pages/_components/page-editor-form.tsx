"use client";

import { FormSection } from "../../_components/form-section";
import { BuilderCountedInput } from "../../_components/builder-field";
import { WebsiteRichTextEditor } from "../../_components/rich-text-editor";
import { Switch } from "@/components/ui/switch";
import type { PageDraft } from "../_lib/page-store";

interface PageEditorFormProps {
  draft: PageDraft;
  onChange: (draft: PageDraft) => void;
  // Fixed pages are always published, so the active toggle is hidden for them.
  showActive?: boolean;
}

const card =
  "rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-[var(--vendor-panel-bg)] p-3 shadow-sm";

export function PageEditorForm({ draft, onChange, showActive = true }: PageEditorFormProps) {
  return (
    <div className="space-y-3">
      <FormSection
        title="Page Title"
        className={card}
        actions={
          showActive ? (
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-[var(--vendor-text-muted)]">
                {draft.enabled ? "Active" : "Inactive"}
              </span>
              <Switch
                checked={draft.enabled}
                onCheckedChange={(enabled) => onChange({ ...draft, enabled })}
              />
            </div>
          ) : undefined
        }
      >
        <BuilderCountedInput
          value={draft.title}
          onChange={(title) => onChange({ ...draft, title })}
          maxLength={100}
        />
      </FormSection>

      <FormSection title="Page Content" className={card}>
        <WebsiteRichTextEditor
          label=""
          value={draft.content}
          onChange={(content) => onChange({ ...draft, content })}
          height="420px"
          showWordCount
          showCharCount
        />
      </FormSection>
    </div>
  );
}
