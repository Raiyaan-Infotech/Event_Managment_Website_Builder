"use client";

import * as React from "react";
import type { LucideIcon } from "lucide-react";
import { GripVertical, Link, Pencil, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MultiSelectPages } from "./multi-select-pages";
import { ConfirmDeleteButton } from "./confirm-delete-button";

export interface ChildMenuItem {
  id: string;
  label: string;
  iconKey?: string;
  link?: string | null;
  required?: boolean;
}

export interface DraggableItemListItem {
  id: string | number;
  label: string;
  icon?: LucideIcon;
  description?: string;
  rightContent?: React.ReactNode;
  children?: ChildMenuItem[];
  locked?: boolean;
  required?: boolean;
}

export interface PageOption {
  label: string;
  value: string;
  icon?: LucideIcon;
}

interface DraggableItemListProps {
  items: DraggableItemListItem[];
  pageOptions?: PageOption[];
  variant?: "default" | "flat";
  onDelete?: (item: DraggableItemListItem) => void;
  onEdit?: (item: DraggableItemListItem) => void;
  onReorder?: (items: DraggableItemListItem[]) => void;
  onAddChild?: (parentId: string | number, child: ChildMenuItem) => void;
  onDeleteChild?: (parentId: string | number, childId: string) => void;
  emptyText?: string;
  className?: string;
  showAddChild?: boolean;          // ← add this
}

interface ChildPagePickerProps {
  parentId: string | number;
  children: ChildMenuItem[];
  pageOptions: PageOption[];
  onAddChild?: (parentId: string | number, child: ChildMenuItem) => void;
  onDeleteChild?: (parentId: string | number, childId: string) => void;
  onClose: () => void;
}

function childPageValue(child: ChildMenuItem): string {
  // A child page is stored two ways: freshly added via the picker
  // (iconKey = page value, link = null) OR loaded back from the API
  // (link = page slug, no iconKey). Resolve both to the same page value so a
  // saved child stays selected when the picker is reopened.
  if (child.iconKey) return child.iconKey;
  if (child.link) return String(child.link).replace(/^\/+/, "");
  return "";
}

function pageChildValues(children: ChildMenuItem[], pageOptions: PageOption[]) {
  const validValues = new Set(pageOptions.map((option) => option.value));
  return children
    .map(childPageValue)
    .filter((value) => value !== "" && validValues.has(value));
}

function ChildPagePicker({
  parentId,
  children,
  pageOptions,
  onAddChild,
  onDeleteChild,
  onClose,
}: ChildPagePickerProps) {
  const panelRef = React.useRef<HTMLDivElement>(null);
  const selectedValues = pageChildValues(children, pageOptions);

  // Close the picker when clicking anywhere outside of it, so the user doesn't
  // have to use the X. Clicks on the parent's add-child toggle are ignored so
  // that button keeps toggling; the page dropdown renders inside the panel, so
  // selecting children never triggers a close.
  React.useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node;
      if (panelRef.current?.contains(target)) return;
      if (target instanceof Element && target.closest("[data-child-menu-toggle]")) {
        return;
      }
      onClose();
    }
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [onClose]);

  const handleChange = (nextValues: string[]) => {
    const addedValues = nextValues.filter((value) => !selectedValues.includes(value));
    const removedValues = selectedValues.filter((value) => !nextValues.includes(value));

    let didAdd = false;
    addedValues.forEach((value) => {
      const option = pageOptions.find((page) => page.value === value);
      if (!option) return;

      onAddChild?.(parentId, {
        id: `child-${value}-${Date.now()}`,
        label: option.label,
        iconKey: value,
        link: null,
      });
      didAdd = true;
    });

    removedValues.forEach((value) => {
      const child = children.find((item) => childPageValue(item) === value);
      if (child) {
        onDeleteChild?.(parentId, child.id);
      }
    });

    // Auto-close the picker the moment a child is added, so the user doesn't
    // have to click the X. (Removing a tag keeps it open.)
    if (didAdd) {
      onClose();
    }
  };

  return (
    <div
      ref={panelRef}
      className="mx-3 mb-2.5 rounded-[var(--vendor-radius-control)] border border-[var(--vendor-primary-btn)]/30 bg-[var(--vendor-primary-btn)]/5 p-3"
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <div>
          <p className="text-[12px] font-bold text-[var(--vendor-primary-btn)]">
            Add Child Menu
          </p>
          <p className="mt-0.5 text-[10px] font-medium text-[var(--vendor-text-muted)]">
            Select pages to show below this menu item.
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-[var(--vendor-radius-control)] p-1 text-[var(--vendor-text-muted)] hover:bg-white"
          aria-label="Close child menu picker"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      <MultiSelectPages
        value={selectedValues}
        options={pageOptions}
        onChange={handleChange}
        placeholder="Add child page"
      />
    </div>
  );
}

function ChildRow({
  child,
  onDelete,
}: {
  child: ChildMenuItem;
  onDelete: () => void;
}) {
  const deleteDisabled = Boolean(child.required);

  return (
    <div className="relative flex items-center gap-2 rounded-[var(--vendor-radius-control)] border border-[var(--vendor-border)] bg-[var(--vendor-panel-bg)]/60 px-3 py-2">
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

      <ConfirmDeleteButton
        size="icon-sm"
        onConfirm={onDelete}
        itemLabel={child.label}
        disabled={deleteDisabled}
        className={cn(
          "shrink-0 text-rose-500 hover:text-rose-600",
          deleteDisabled &&
            "border-slate-200 bg-slate-50 text-slate-400 hover:bg-slate-50 hover:text-slate-400 disabled:cursor-not-allowed disabled:opacity-100",
        )}
        aria-label={
          deleteDisabled ? `${child.label} cannot be removed` : `Remove ${child.label}`
        }
        title={deleteDisabled ? "Required item cannot be removed" : undefined}
      />
    </div>
  );
}

export function DraggableItemList({
  items,
  pageOptions = [],
  variant = "default",
  onDelete,
  onEdit,
  onReorder,
  onAddChild,
  onDeleteChild,
  emptyText = "No items added.",
  className,
  showAddChild = true,
}: DraggableItemListProps) {
  const dragItemIndex = React.useRef<number | null>(null);
  const dragOverItemIndex = React.useRef<number | null>(null);
  const [draggingIndex, setDraggingIndex] = React.useState<number | null>(null);
  const [overIndex, setOverIndex] = React.useState<number | null>(null);
  const [expandedParentId, setExpandedParentId] = React.useState<string | number | null>(null);

  const handleDragStart = (index: number) => {
    if (items[index]?.locked) return;
    dragItemIndex.current = index;
    setDraggingIndex(index);
  };

  const handleDragEnter = (index: number) => {
    if (dragItemIndex.current === null || items[dragItemIndex.current]?.locked) return;
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
      if (moved?.locked) {
        dragItemIndex.current = null;
        dragOverItemIndex.current = null;
        setDraggingIndex(null);
        setOverIndex(null);
        return;
      }
      reordered.splice(dragOverItemIndex.current, 0, moved);
      onReorder?.(reordered);
    }

    dragItemIndex.current = null;
    dragOverItemIndex.current = null;
    setDraggingIndex(null);
    setOverIndex(null);
  };

  if (!items.length) {
    return (
      <div
        className={cn(
          "rounded-[var(--vendor-radius-panel)] border border-dashed border-[var(--vendor-border)] p-6 text-center text-[13px] font-semibold text-[var(--vendor-text-muted)]",
          className,
        )}
      >
        {emptyText}
      </div>
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      {items.map((item, index) => {
        const Icon = item.icon;
        const isDragging = draggingIndex === index;
        const isOver = overIndex === index && draggingIndex !== index;
        const children = item.children ?? [];
        const isChildPickerOpen = expandedParentId === item.id;
        const deleteDisabled = Boolean(item.required || item.locked);

        return (
          <div
            key={item.id}
            draggable={!item.locked}
            onDragStart={() => handleDragStart(index)}
            onDragEnter={() => handleDragEnter(index)}
            onDragEnd={handleDragEnd}
            onDragOver={(event) => event.preventDefault()}
            className={cn(
              "border bg-[var(--vendor-panel-bg)] transition-all select-none",
              variant === "flat"
                ? "rounded-[var(--vendor-radius-control)] shadow-none"
                : "rounded-[var(--vendor-radius-panel)] shadow-xs",
              isDragging
                ? "border-[var(--vendor-primary-btn)]/40 bg-[var(--vendor-primary-btn)]/5 opacity-40"
                : isOver
                  ? "scale-[1.01] border-[var(--vendor-primary-btn)] bg-[var(--vendor-primary-btn)]/5"
                  : "border-[var(--vendor-border)]",
            )}
          >
            <div className="flex items-center gap-3 px-3 py-2.5">
              <span
                className={cn(
                  "text-[var(--vendor-text-muted)] touch-none",
                  item.locked
                    ? "cursor-not-allowed opacity-50"
                    : "cursor-grab active:cursor-grabbing",
                )}
                aria-label={item.locked ? `${item.label} position locked` : `Drag ${item.label}`}
                title={item.locked ? "Locked position" : undefined}
              >
                <GripVertical className="h-4 w-4" />
              </span>

              {Icon ? (
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--vendor-radius-control)] bg-[var(--vendor-primary-btn)]/10 text-[var(--vendor-primary-btn)]">
                  <Icon className="h-4 w-4" />
                </span>
              ) : null}

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

              {children.length > 0 ? (
                <span className="rounded-[4px] bg-[var(--vendor-border)] px-1.5 py-0.5 text-[10px] font-bold text-[var(--vendor-text-muted)]">
                  {children.length} child
                </span>
              ) : null}
{showAddChild ? (

              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                onClick={() =>
                  setExpandedParentId((current) => (current === item.id ? null : item.id))
                }
                data-child-menu-toggle
                className="shrink-0 text-[var(--vendor-primary-btn)] hover:border-[var(--vendor-primary-btn)] hover:bg-[var(--vendor-primary-btn)]/5"
                aria-label={`Add child menu under ${item.label}`}
              >
                <Plus className="h-4 w-4" />
              </Button> ) : null}

              {onEdit ? (
                <Button
                  type="button"
                  variant="outline"
                  size="icon-sm"
                  onClick={() => onEdit(item)}
                  className="shrink-0 text-[var(--vendor-primary-btn)] hover:border-[var(--vendor-primary-btn)] hover:bg-[var(--vendor-primary-btn)]/5"
                  aria-label={`Edit ${item.label}`}
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
              ) : null}

              {onDelete ? (
                <ConfirmDeleteButton
                  size="icon-sm"
                  onConfirm={() => onDelete(item)}
                  itemLabel={item.label}
                  disabled={deleteDisabled}
                  className={cn(
                    "shrink-0 text-rose-500 hover:text-rose-600",
                    deleteDisabled &&
                      "border-slate-200 bg-slate-50 text-slate-400 hover:bg-slate-50 hover:text-slate-400 disabled:cursor-not-allowed disabled:opacity-100",
                  )}
                  aria-label={
                    deleteDisabled ? `${item.label} cannot be removed` : `Delete ${item.label}`
                  }
                  title={deleteDisabled ? "Required item cannot be removed" : undefined}
                />
              ) : null}
            </div>

            {showAddChild  && isChildPickerOpen ? (
              <ChildPagePicker
                parentId={item.id}
                children={children}
                pageOptions={pageOptions}
                onAddChild={onAddChild}
                onDeleteChild={onDeleteChild}
                onClose={() => setExpandedParentId(null)}
              />
            ) : null}

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
  );
}
