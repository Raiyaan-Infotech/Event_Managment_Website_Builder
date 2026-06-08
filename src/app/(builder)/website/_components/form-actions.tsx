"use client";

import type * as React from "react";
import { Save, X } from "lucide-react";
import { OutlineButton, PrimaryButton } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FormActionsProps {
  onSave?: () => void;
  onCancel?: () => void;
  saveLabel?: string;
  cancelLabel?: string;
  isSaving?: boolean;
  disableSave?: boolean;
  className?: string;
  layout?: "default" | "end" | "between";
}

export function FormActions({
  onSave,
  onCancel,
  saveLabel = "Save Changes",
  cancelLabel = "Cancel",
  isSaving = false,
  disableSave = false,
  className,
  layout = "end",
}: FormActionsProps) {
  return (
    <div
      className={cn(
        "flex gap-3",
        layout === "end" && "justify-end",
        layout === "between" && "justify-between",
        layout === "default" && "justify-start",
        className,
      )}
    >
      {onCancel ? (
        <OutlineButton type="button" size="sm" onClick={onCancel} className="h-10 min-w-32">
          <X className="h-4 w-4" />
          {cancelLabel}
        </OutlineButton>
      ) : null}
      <PrimaryButton
        type="button"
        size="sm"
        onClick={onSave}
        disabled={disableSave || isSaving}
        className="h-10 min-w-32 shadow-sm"
      >
        <Save className="h-4 w-4" />
        {isSaving ? "Saving..." : saveLabel}
      </PrimaryButton>
    </div>
  );
}
