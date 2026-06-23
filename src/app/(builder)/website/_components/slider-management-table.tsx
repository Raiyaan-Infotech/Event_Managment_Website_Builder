"use client";

import * as React from "react";
import Image from "next/image";
import { Edit2, GripVertical, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { ConfirmDeleteButton } from "./confirm-delete-button";

export interface SliderManagementRow {
  id: string | number;
  title: string;
  buttonLabel?: string;
  imageUrl?: string | null;
  enabled: boolean;
}

interface SliderManagementTableProps {
  rows: SliderManagementRow[];
  activeRowId?: string | number;
  title?: string;
  subtitle?: string;
  addLabel?: string;
  onAdd?: () => void;
  onEdit?: (row: SliderManagementRow) => void;
  onDelete?: (row: SliderManagementRow) => void;
  onReorder?: (rows: SliderManagementRow[]) => void;
  onStatusChange?: (row: SliderManagementRow, enabled: boolean) => void;
  thumbnailFallbackClassName?: string;
  className?: string;
}

export function SliderManagementTable({
  rows,
  activeRowId,
  title = "",
  subtitle = "",
  addLabel = "Add New Slide",
  onAdd,
  onEdit,
  onDelete,
  onReorder,
  onStatusChange,
  thumbnailFallbackClassName,
  className,
}: SliderManagementTableProps) {
  const dragItemIndex = React.useRef<number | null>(null);
  const dragOverItemIndex = React.useRef<number | null>(null);
  const [draggingIndex, setDraggingIndex] = React.useState<number | null>(null);
  const [overIndex, setOverIndex] = React.useState<number | null>(null);

  const resetDragState = () => {
    dragItemIndex.current = null;
    dragOverItemIndex.current = null;
    setDraggingIndex(null);
    setOverIndex(null);
  };

  const handleDragStart = (event: React.DragEvent, index: number) => {
    if (!onReorder) return;
    dragItemIndex.current = index;
    dragOverItemIndex.current = index;
    setDraggingIndex(index);
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", String(rows[index]?.id ?? index));
  };

  const handleDragEnter = (index: number) => {
    if (!onReorder || dragItemIndex.current === null) return;
    dragOverItemIndex.current = index;
    setOverIndex(index);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    if (
      !onReorder ||
      dragItemIndex.current === null ||
      dragOverItemIndex.current === null ||
      dragItemIndex.current === dragOverItemIndex.current
    ) {
      resetDragState();
      return;
    }

    const reordered = [...rows];
    const [moved] = reordered.splice(dragItemIndex.current, 1);
    reordered.splice(dragOverItemIndex.current, 0, moved);
    onReorder(reordered);
    resetDragState();
  };

  return (
    <section className={cn("space-y-3", className)}>
      <div className="flex  items-start justify-between gap-2">
        <div>
          <h2 className="text-[14px] font-black text-[var(--vendor-text)]">
            {title}
          </h2>
          {subtitle ? (
            <p className="mt-0.5 text-[11px] font-medium text-[var(--vendor-text-muted)] leading-tight">
              {subtitle}
            </p>
          ) : null}
        </div>
        {onAdd ? (
          <Button
            type="button"
            size="xs"
            onClick={onAdd}
            className="h-8 gap-1.5 px-3 text-[11px] shrink-0"
          >
            <Plus className="h-3.5 w-3.5" />
            {addLabel}
          </Button>
        ) : null}
      </div>

      <div className="overflow-hidden rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)]">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-50">
              <TableHead className="h-10 w-7 px-2 py-2" />
              <TableHead className="h-10 w-10 px-2 py-2 text-[11px] font-semibold text-slate-500">
                #
              </TableHead>
              <TableHead className="h-10 px-2 py-2 text-[11px] font-semibold text-slate-500">
                Preview
              </TableHead>
              <TableHead className="h-10 px-2 py-2 text-[11px] font-semibold text-slate-500">
                Title
              </TableHead>
              <TableHead className="h-10 px-2 py-2 text-[11px] font-semibold text-slate-500">
                Button
              </TableHead>
              <TableHead className="h-10 px-2 py-2 text-[11px] font-semibold text-slate-500">
                Status
              </TableHead>
              <TableHead className="h-10 px-2 py-2 text-right text-[11px] font-semibold text-slate-500">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, index) => {
              const isDragging = draggingIndex === index;
              const isOver = overIndex === index && draggingIndex !== index;

              return (
                <TableRow
                  key={row.id}
                  onDragEnter={() => handleDragEnter(index)}
                  onDragOver={(event) => {
                    if (!onReorder) return;
                    event.preventDefault();
                    event.dataTransfer.dropEffect = "move";
                  }}
                  onDrop={handleDrop}
                  className={cn(
                    "transition-colors",
                    isDragging
                      ? "opacity-40"
                      : isOver
                        ? "bg-[var(--vendor-primary-btn)]/10"
                        : activeRowId === row.id
                          ? "bg-[var(--vendor-primary-btn)]/5 hover:bg-[var(--vendor-primary-btn)]/5"
                          : "hover:bg-slate-50",
                  )}
                >
                  <TableCell className="w-7 px-2 py-3 text-slate-400">
                    <button
                      type="button"
                      draggable={Boolean(onReorder)}
                      onDragStart={(event) => handleDragStart(event, index)}
                      onDragEnd={resetDragState}
                      className={cn(
                        "flex cursor-grab text-slate-400 active:cursor-grabbing",
                        !onReorder && "cursor-default opacity-50",
                      )}
                      aria-label={`Drag ${row.title}`}
                    >
                      <GripVertical className="h-4 w-4" />
                    </button>
                  </TableCell>
                  <TableCell className="w-10 px-2 py-3 text-[12px] font-semibold text-slate-600">
                    {index + 1}
                  </TableCell>
                  <TableCell className="px-2 py-3">
                    <div
                      className={cn(
                        "relative h-12 w-16 overflow-hidden rounded-[var(--vendor-radius-control)] bg-[var(--vendor-secondary-btn)]",
                        !row.imageUrl && thumbnailFallbackClassName,
                      )}
                    >
                      {row.imageUrl ? (
                        <Image
                          src={row.imageUrl}
                          alt={row.title}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : null}
                    </div>
                  </TableCell>
                  <TableCell className="px-2 py-3 text-[12px] font-semibold text-slate-800 truncate max-w-[160px]">
                    {row.title}
                  </TableCell>
                  <TableCell className="px-2 py-3 text-[12px] text-slate-600 truncate max-w-[100px]">
                    {row.buttonLabel ?? "-"}
                  </TableCell>
                  <TableCell className="px-2 py-3">
                    <Switch
                      checked={row.enabled}
                      className="data-[state=checked]:bg-emerald-500"
                      onCheckedChange={(checked) =>
                        onStatusChange?.(row, checked)
                      }
                    />
                  </TableCell>
                  <TableCell className="px-2 py-3 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      {onEdit ? (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon-xs"
                          onClick={() => onEdit(row)}
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </Button>
                      ) : null}
                      {onDelete ? (
                        <ConfirmDeleteButton
                          onConfirm={() => onDelete(row)}
                          itemLabel={row.title}
                          className="text-rose-500 hover:text-rose-600"
                        />
                      ) : null}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
