"use client";

import * as React from "react";
import { Trash2 } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";

interface ConfirmDeleteButtonProps
  extends Omit<ButtonProps, "children" | "onClick"> {
  onConfirm: () => void | Promise<void>;
  itemLabel?: string;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  children?: React.ReactNode;
}

export function ConfirmDeleteButton({
  onConfirm,
  itemLabel,
  title = "Delete item?",
  description,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  variant = "outline",
  size = "icon-xs",
  className,
  disabled,
  children,
  ...buttonProps
}: ConfirmDeleteButtonProps) {
  const [open, setOpen] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  React.useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
      setOpen(false);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Button
        type="button"
        variant={variant}
        size={size}
        className={className}
        disabled={disabled || isDeleting}
        onClick={() => setOpen(true)}
        {...buttonProps}
      >
        {children ?? <Trash2 className="h-3.5 w-3.5 shrink-0" />}
      </Button>

      {open ? (
        <div
          className="fixed inset-0 z-[140] flex items-center justify-center bg-slate-950/45 p-4"
          onClick={() => {
            if (!isDeleting) setOpen(false);
          }}
        >
          <div
            className="w-full max-w-sm rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-white p-5 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="space-y-1.5 text-left">
              <h3 className="text-left text-[15px] font-black leading-5 text-[var(--vendor-text)]">
                {title}
              </h3>
              <p className="text-left text-[12px] leading-5 text-[var(--vendor-text-muted)]">
                {description ??
                  (itemLabel
                    ? `This will permanently remove "${itemLabel}" from the list.`
                    : "This will permanently remove this item from the list.")}
              </p>
            </div>

            <div className="mt-4 flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setOpen(false)}
                disabled={isDeleting}
              >
                {cancelLabel}
              </Button>
              <Button
                type="button"
                variant="danger"
                size="sm"
                onClick={handleConfirm}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : confirmLabel}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
