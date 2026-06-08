"use client";

import * as React from "react";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastVariant = "success" | "error" | "warning" | "info";

interface Toast {
  id: string;
  message: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  showToast: (message: string, variant?: ToastVariant) => void;
}

const ToastContext = React.createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

const variantStyles: Record<ToastVariant, { bg: string; border: string; icon: string; Icon: React.ComponentType<{ className?: string }> }> = {
  success: { bg: "bg-green-50", border: "border-green-200", icon: "text-[var(--color-success)]", Icon: CheckCircle },
  error: { bg: "bg-red-50", border: "border-red-200", icon: "text-[var(--color-danger)]", Icon: XCircle },
  warning: { bg: "bg-amber-50", border: "border-amber-200", icon: "text-[var(--color-warning)]", Icon: AlertTriangle },
  info: { bg: "bg-blue-50", border: "border-blue-200", icon: "text-[var(--color-info)]", Icon: Info },
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const showToast = React.useCallback((message: string, variant: ToastVariant = "success") => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, variant }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => {
          const style = variantStyles[toast.variant];
          const Icon = style.Icon;
          return (
            <div
              key={toast.id}
              className={cn(
                "pointer-events-auto flex items-start gap-3 rounded-[var(--radius-input)] border p-4 shadow-lg animate-in slide-in-from-right",
                style.bg, style.border,
              )}
            >
              <Icon className={cn("h-5 w-5 shrink-0 mt-0.5", style.icon)} />
              <p className="flex-1 text-[13px] font-semibold leading-5 text-[var(--color-text)]">{toast.message}</p>
              <button
                onClick={() => removeToast(toast.id)}
                className="shrink-0 text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
