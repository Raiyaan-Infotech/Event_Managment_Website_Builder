import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { StatusLoader } from "@/components/status-pages/status-loader";

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
  return <StatusLoader embedded message={message || "Loading..."} className={className} />;
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
