import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatusLoader({
  message = "Loading...",
  embedded = false,
  className,
}: {
  message?: string;
  embedded?: boolean;
  className?: string;
}) {
  return (
    <main
      className={cn(
        "flex w-full items-center justify-center bg-white text-slate-950",
        embedded ? "h-full min-h-[calc(100vh-92px)]" : "min-h-screen",
        className,
      )}
    >
      <div className="flex flex-col items-center text-center">
        <div className="relative flex h-20 w-20 items-center justify-center rounded-[24px] bg-[#f2f3ff]">
          <div className="absolute inset-2 rounded-[20px] border border-[#d8d4ff]" />
          <Loader2 className="h-9 w-9 animate-spin text-[#5b4bff]" />
        </div>
        <p className="mt-5 text-[14px] font-black text-slate-950">{message}</p>
        <p className="mt-1 text-[12px] font-medium text-slate-500">
          Please wait while we prepare your workspace.
        </p>
      </div>
    </main>
  );
}
