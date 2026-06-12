"use client";

import * as React from "react";
import type { LucideIcon } from "lucide-react";
import { GripVertical, Trash2, Plus, Link } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ChildMenuItem {
  id: string;
  label: string;
  iconKey?: string;
  link?: string | null; // null = page-based child, string = custom link
}

export interface DraggableItemListItem {
  id: string | number;
  label: string;
  icon?: LucideIcon;
  description?: string;
  rightContent?: React.ReactNode;
  children?: ChildMenuItem[];
}

export interface PageOption {
  label: string;
  value: string;
  icon?: LucideIcon;
}

interface DraggableItemListProps {
  items: DraggableItemListItem[];
  pageOptions?: PageOption[]; // pages to pick from when adding a child menu
  onDelete?: (item: DraggableItemListItem) => void;
  onReorder?: (items: DraggableItemListItem[]) => void;
  onAddChild?: (parentId: string | number, child: ChildMenuItem) => void;
  onDeleteChild?: (parentId: string | number, childId: string) => void;
  emptyText?: string;
  className?: string;
}

// ─── Child-menu modal ─────────────────────────────────────────────────────────

type ModalState =
  | { open: false }
  | { open: true; type: "page"; parentId: string | number }
  | { open: true; type: "custom"; parentId: string | number | null };

function ChildMenuModal({
  state,
  pageOptions = [],
  onConfirm,
  onClose,
}: {
  state: ModalState;
  pageOptions: PageOption[];
  onConfirm: (parentId: string | number | null, child: ChildMenuItem) => void;
  onClose: () => void;
}) {
  const [selectedPage, setSelectedPage] = React.useState("");
  const [customName, setCustomName] = React.useState("");
  const [customLink, setCustomLink] = React.useState("");

  // reset whenever modal opens
  React.useEffect(() => {
    if (state.open) {
      setSelectedPage("");
      setCustomName("");
      setCustomLink("");
    }
  }, [state.open]);

  if (!state.open) return null;

  const handleConfirm = () => {
    if (state.type === "page") {
      const opt = pageOptions.find((p) => p.value === selectedPage);
      if (!opt) return;
      onConfirm(state.parentId, {
        id: `child-${opt.value}-${Date.now()}`,
        label: opt.label,
        iconKey: opt.value,
        link: null,
      });
    } else {
      if (!customName.trim()) return;
      onConfirm(state.parentId, {
        id: `child-custom-${Date.now()}`,
        label: customName.trim(),
        iconKey: "link",
        link: customLink.trim() || null,
      });
    }
    onClose();
  };

  return (
    /* overlay */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-[340px] rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-[var(--vendor-panel-bg)] p-5 shadow-2xl">
        <h3 className="mb-4 text-[14px] font-black text-[var(--vendor-text)]">
          {state.type === "page" ? "Add Child Menu" : "Add Custom Link"}
        </h3>

        {state.type === "page" ? (
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-[var(--vendor-text-muted)]">
              Select Page
            </label>
            <select
              value={selectedPage}
              onChange={(e) => setSelectedPage(e.target.value)}
              className="w-full rounded-[var(--vendor-radius-control)] border border-[var(--vendor-border)] bg-[var(--vendor-panel-bg)] px-3 py-2 text-[13px] text-[var(--vendor-text)] outline-none focus:border-[var(--vendor-primary-btn)]"
            >
              <option value="">— Choose a page —</option>
              {pageOptions.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[var(--vendor-text-muted)]">
                Menu Name
              </label>
              <input
                type="text"
                placeholder="e.g. Blog, Portfolio…"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="w-full rounded-[var(--vendor-radius-control)] border border-[var(--vendor-border)] bg-[var(--vendor-panel-bg)] px-3 py-2 text-[13px] text-[var(--vendor-text)] outline-none focus:border-[var(--vendor-primary-btn)]"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[var(--vendor-text-muted)]">
                Link URL
              </label>
              <input
                type="text"
                placeholder="https://…"
                value={customLink}
                onChange={(e) => setCustomLink(e.target.value)}
                className="w-full rounded-[var(--vendor-radius-control)] border border-[var(--vendor-border)] bg-[var(--vendor-panel-bg)] px-3 py-2 text-[13px] text-[var(--vendor-text)] outline-none focus:border-[var(--vendor-primary-btn)]"
              />
            </div>
          </div>
        )}

        <div className="mt-5 flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-[var(--vendor-radius-control)] border border-[var(--vendor-border)] py-2 text-[13px] font-semibold text-[var(--vendor-text-muted)] hover:bg-[var(--vendor-border)]/30 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="flex-1 rounded-[var(--vendor-radius-control)] bg-[var(--vendor-primary-btn)] py-2 text-[13px] font-bold text-white hover:opacity-90 transition-opacity"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Child row ────────────────────────────────────────────────────────────────

function ChildRow({
  child,
  onDelete,
}: {
  child: ChildMenuItem;
  onDelete: () => void;
}) {
  return (
    <div className="relative flex items-center gap-2 rounded-[var(--vendor-radius-control)] border border-[var(--vendor-border)] bg-[var(--vendor-panel-bg)]/60 px-3 py-2">
      {/* indent connector */}
      <span className="absolute -left-[18px] top-1/2 h-px w-[14px] bg-[var(--vendor-border)]" />

      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-[4px] bg-[var(--vendor-primary-btn)]/10 text-[var(--vendor-primary-btn)]">
        <Link className="h-3 w-3" />
      </span>

      <div className="min-w-0 flex-1">
        <p className="truncate text-[12px] font-bold text-[var(--vendor-text)]">
          {child.label}
        </p>
        {child.link ? (
          <p className="truncate text-[10px] font-medium text-[var(--vendor-text-muted)]">
            {child.link}
          </p>
        ) : null}
      </div>

      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        onClick={onDelete}
        className="shrink-0 text-rose-500 hover:text-rose-600"
        aria-label={`Remove ${child.label}`}
      >
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function DraggableItemList({
  items,
  pageOptions = [],
  onDelete,
  onReorder,
  onAddChild,
  onDeleteChild,
  emptyText = "No items added.",
  className,
}: DraggableItemListProps) {
  const dragItemIndex = React.useRef<number | null>(null);
  const dragOverItemIndex = React.useRef<number | null>(null);
  const [draggingIndex, setDraggingIndex] = React.useState<number | null>(null);
  const [overIndex, setOverIndex] = React.useState<number | null>(null);
  const [modal, setModal] = React.useState<ModalState>({ open: false });

  // ── drag handlers ──
  const handleDragStart = (index: number) => {
    dragItemIndex.current = index;
    setDraggingIndex(index);
  };
  const handleDragEnter = (index: number) => {
    dragOverItemIndex.current = index;
    setOverIndex(index);
  };
  const handleDragEnd = () => {
    if (
      dragItemIndex.current !== null &&
      dragOverItemIndex.current !== null &&
      dragItemIndex.current !== dragOverItemIndex.current
    ) {
      const reordered = [...items];
      const [moved] = reordered.splice(dragItemIndex.current, 1);
      reordered.splice(dragOverItemIndex.current, 0, moved);
      onReorder?.(reordered);
    }
    dragItemIndex.current = null;
    dragOverItemIndex.current = null;
    setDraggingIndex(null);
    setOverIndex(null);
  };

  // ── modal confirm ──
  const handleModalConfirm = (
    parentId: string | number | null,
    child: ChildMenuItem
  ) => {
    if (parentId !== null) {
      onAddChild?.(parentId, child);
    } else {
      // custom link as a top-level item (bottom button with no parent)
      onAddChild?.("__top__", child);
    }
  };

  if (!items.length) {
    return (
      <div
        className={cn(
          "rounded-[var(--vendor-radius-panel)] border border-dashed border-[var(--vendor-border)] p-6 text-center text-[13px] font-semibold text-[var(--vendor-text-muted)]",
          className
        )}
      >
        {emptyText}
      </div>
    );
  }

  return (
    <>
      <div className={cn("space-y-2", className)}>
        {items.map((item, index) => {
          const Icon = item.icon;
          const isDragging = draggingIndex === index;
          const isOver = overIndex === index && draggingIndex !== index;
          const children = item.children ?? [];

          return (
            <div
              key={item.id}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragEnter={() => handleDragEnter(index)}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => e.preventDefault()}
              className={cn(
                "rounded-[var(--vendor-radius-panel)] border bg-[var(--vendor-panel-bg)] shadow-xs transition-all select-none",
                isDragging
                  ? "opacity-40 border-[var(--vendor-primary-btn)]/40 bg-[var(--vendor-primary-btn)]/5"
                  : isOver
                  ? "border-[var(--vendor-primary-btn)] bg-[var(--vendor-primary-btn)]/5 scale-[1.01]"
                  : "border-[var(--vendor-border)]"
              )}
            >
              {/* ── parent row ── */}
              <div className="flex items-center gap-3 px-3 py-2.5">
                {/* grip */}
                <span
                  className="cursor-grab text-[var(--vendor-text-muted)] active:cursor-grabbing touch-none"
                  aria-label={`Drag ${item.label}`}
                >
                  <GripVertical className="h-4 w-4" />
                </span>

                {/* icon */}
                {Icon ? (
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--vendor-radius-control)] bg-[var(--vendor-primary-btn)]/10 text-[var(--vendor-primary-btn)]">
                    <Icon className="h-4 w-4" />
                  </span>
                ) : null}

                {/* label */}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-black text-[var(--vendor-text)]">
                    {item.label}
                  </p>
                  {item.description ? (
                    <p className="truncate text-[11px] font-medium text-[var(--vendor-text-muted)]">
                      {item.description}
                    </p>
                  ) : null}
                </div>

                {item.rightContent}

                {/* child count badge */}
                {children.length > 0 ? (
                  <span className="rounded-[4px] bg-[var(--vendor-border)] px-1.5 py-0.5 text-[10px] font-bold text-[var(--vendor-text-muted)]">
                    {children.length} child
                  </span>
                ) : null}

                {/* add child button */}
                <Button
                  type="button"
                  variant="outline"
                  size="icon-sm"
                  onClick={() =>
                    setModal({ open: true, type: "page", parentId: item.id })
                  }
                  className="shrink-0 text-[var(--vendor-primary-btn)] hover:border-[var(--vendor-primary-btn)] hover:bg-[var(--vendor-primary-btn)]/5"
                  aria-label={`Add child menu under ${item.label}`}
                >
                  <Plus className="h-4 w-4" />
                </Button>

                {/* delete */}
                {onDelete ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon-sm"
                    onClick={() => onDelete(item)}
                    className="shrink-0 text-rose-500 hover:text-rose-600"
                    aria-label={`Delete ${item.label}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                ) : null}
              </div>

              {/* ── children ── */}
              {children.length > 0 ? (
                <div className="relative ml-10 mr-3 mb-2.5 flex flex-col gap-1.5 border-l border-dashed border-[var(--vendor-border)] pl-5">
                  {children.map((child) => (
                    <ChildRow
                      key={child.id}
                      child={child}
                      onDelete={() => onDeleteChild?.(item.id, child.id)}
                    />
                  ))}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      {/* modal */}
      <ChildMenuModal
        state={modal}
        pageOptions={pageOptions}
        onConfirm={handleModalConfirm}
        onClose={() => setModal({ open: false })}
      />
    </>
  );
}