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
        "flex gap-2",
        // On mobile, stretch buttons full-width so they're easy to tap.
        // On sm+ revert to the layout prop alignment.
        "flex-col sm:flex-row",
        layout === "end" && "sm:justify-end",
        layout === "between" && "sm:justify-between",
        layout === "default" && "sm:justify-start",
        className,
      )}
    >
      {onCancel ? (
        <OutlineButton
          type="button"
          size="sm"
          onClick={onCancel}
          // Full width on mobile, auto on sm+
          className="h-9 w-full text-[11px] sm:w-auto"
        >
          <X className="h-4 w-4 shrink-0" />
          {cancelLabel}
        </OutlineButton>
      ) : null}

      <PrimaryButton
        type="button"
        size="sm"
        onClick={onSave}
        disabled={disableSave || isSaving}
        className="h-9 w-full text-[11px] shadow-sm sm:w-auto whitespace-nowrap"
      >
        <Save className="h-4 w-4 shrink-0" />
        {isSaving ? "Saving…" : saveLabel}
      </PrimaryButton>
    </div>
  );
}