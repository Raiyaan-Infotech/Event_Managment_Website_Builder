import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface LoaderProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Spinner({ size = "md", className }: LoaderProps) {
  return (
    <Loader2
      className={cn(
        "animate-spin text-[var(--color-primary)]",
        size === "sm" && "h-4 w-4",
        size === "md" && "h-6 w-6",
        size === "lg" && "h-10 w-10",
        className,
      )}
    />
  );
}

interface PageLoaderProps {
  message?: string;
  className?: string;
}

export function PageLoader({ message, className }: PageLoaderProps) {
  return (
    <div className={cn("flex h-[calc(100vh-120px)] items-center justify-center", className)}>
      <div className="flex flex-col items-center gap-4">
        <Spinner size="lg" />
        {message ? (
          <p className="text-[14px] font-medium text-[var(--color-text-secondary)]">{message}</p>
        ) : null}
      </div>
    </div>
  );
}

interface InlineLoaderProps {
  message?: string;
  className?: string;
}

export function InlineLoader({ message, className }: InlineLoaderProps) {
  return (
    <div className={cn("flex items-center justify-center gap-3 py-8", className)}>
      <Spinner size="sm" />
      {message ? (
        <span className="text-[13px] font-medium text-[var(--color-text-secondary)]">{message}</span>
      ) : null}
    </div>
  );
}
