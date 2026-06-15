"use client";

import * as React from "react";
import { LayoutGrid, Search, X } from "lucide-react";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type IconEntry = {
  name: string;
};

const SOCIAL_ICON_COLLECTION = {
  prefix: "simple-icons",
  label: "Social Icons",
};

interface IconPickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (value: string) => void;
}

export function IconPickerDialog({
  open,
  onOpenChange,
  onSelect,
}: IconPickerDialogProps) {
  const [allIcons, setAllIcons] = React.useState<IconEntry[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [search, setSearch] = React.useState("");

  React.useEffect(() => {
    if (!open || allIcons.length > 0) return;

    let cancelled = false;

    const loadIcons = async () => {
      setIsLoading(true);
      setError("");
      try {
        const response = await fetch(
          `https://api.iconify.design/collection?prefix=${SOCIAL_ICON_COLLECTION.prefix}&pretty=0`,
        );
        if (!response.ok) throw new Error("Failed to load social icons");
        const data = await response.json();
        const names = [
          ...(Array.isArray(data.uncategorized) ? data.uncategorized : []),
          ...Object.values(data.categories || {}).flatMap((value) =>
            Array.isArray(value) ? value : [],
          ),
        ] as string[];

        if (!cancelled) {
          setAllIcons(names.map((name) => ({ name })));
        }
      } catch {
        if (!cancelled) {
          setError("Unable to load social icons. Please try again.");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    loadIcons();

    return () => {
      cancelled = true;
    };
  }, [allIcons.length, open]);

  const filtered = React.useMemo(() => {
    const query = search.trim().toLowerCase();
    const list = query
      ? allIcons.filter((item) => item.name.toLowerCase().includes(query))
      : allIcons;
    return list.slice(0, 240);
  }, [allIcons, search]);

  React.useEffect(() => {
    if (!open) setSearch("");
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-3">
      <div className="flex max-h-[86vh] w-full max-w-2xl flex-col gap-3 overflow-hidden rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-white p-4 shadow-2xl">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <LayoutGrid className="h-4 w-4 shrink-0 text-[var(--vendor-primary-btn)]" />
            <h2 className="truncate text-[14px] font-black text-[var(--vendor-text)]">
              Social Icon Picker
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[var(--vendor-radius-control)] text-[var(--vendor-text-muted)] hover:bg-slate-100 hover:text-[var(--vendor-text)]"
            aria-label="Close icon picker"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex flex-wrap gap-1.5">
          <Button type="button" size="xs" className="h-7 px-3 text-[11px]">
            {SOCIAL_ICON_COLLECTION.label}
          </Button>
        </div>

        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--vendor-text-muted)]" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search social icons..."
            autoFocus
            className="h-9 pl-9 pr-9 text-[12px]"
          />
          {search ? (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--vendor-text-muted)] hover:text-[var(--vendor-text)]"
              aria-label="Clear icon search"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto rounded-[var(--vendor-radius-control)] border border-[var(--vendor-border)]">
          {isLoading ? (
            <div className="flex h-40 items-center justify-center text-[12px] font-medium text-[var(--vendor-text-muted)]">
              Loading social icons...
            </div>
          ) : error ? (
            <div className="flex h-40 items-center justify-center px-4 text-center text-[12px] font-medium text-rose-500">
              {error}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex h-40 items-center justify-center text-[12px] font-medium text-[var(--vendor-text-muted)]">
              No icons found{search ? ` for "${search}"` : ""}.
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-1 p-2 sm:grid-cols-6 md:grid-cols-8">
              {filtered.map((item) => {
                return (
                  <button
                    key={item.name}
                    type="button"
                    title={item.name}
                    onClick={() => {
                      onSelect(`${SOCIAL_ICON_COLLECTION.prefix}:${item.name}`);
                      onOpenChange(false);
                    }}
                    className={cn(
                      "flex min-h-[64px] flex-col items-center justify-center gap-1 rounded-[var(--vendor-radius-control)] p-2 text-center transition-colors",
                      "hover:bg-[var(--vendor-primary-btn)]/10 hover:text-[var(--vendor-primary-btn)]",
                    )}
                  >
                    <Icon
                      icon={`${SOCIAL_ICON_COLLECTION.prefix}:${item.name}`}
                      className="h-5 w-5 shrink-0"
                    />
                    <span className="w-full truncate text-[9px] font-medium leading-none text-[var(--vendor-text-muted)]">
                      {item.name}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <p className="text-[11px] font-medium text-[var(--vendor-text-muted)]">
          {isLoading
            ? "Loading..."
            : `Showing ${filtered.length} of ${allIcons.length} social icons`}
        </p>
      </div>
    </div>
  );
}
