"use client";

import Image from "next/image";
import { Edit2, GripVertical, Plus, Trash2 } from "lucide-react";
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
  onStatusChange?: (row: SliderManagementRow, enabled: boolean) => void;
  thumbnailFallbackClassName?: string;
  className?: string;
}

export function SliderManagementTable({
  rows,
  activeRowId,
  title = "Slider Management",
  subtitle = "Add, reorder, or remove slides.",
  addLabel = "Add New Slide",
  onAdd,
  onEdit,
  onDelete,
  onStatusChange,
  thumbnailFallbackClassName,
  className,
}: SliderManagementTableProps) {
  return (
    <section className={cn("space-y-2", className)}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-[12px] font-black text-[var(--vendor-text)]">{title}</h2>
          {subtitle ? (
            <p className="mt-0.5 text-[9.5px] font-medium text-[var(--vendor-text-muted)] leading-tight">
              {subtitle}
            </p>
          ) : null}
        </div>
        {onAdd ? (
          <Button type="button" size="xs" onClick={onAdd} className="h-7 gap-1 px-2.5 text-[10px]">
            <Plus className="h-3 w-3" />
            {addLabel}
          </Button>
        ) : null}
      </div>

      <div className="overflow-hidden rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)]">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-50">
              <TableHead className="h-7 w-7 px-2 py-1" />
              <TableHead className="h-7 w-10 px-2 py-1 text-[9px] font-semibold text-slate-500">#</TableHead>
              <TableHead className="h-7 px-2 py-1 text-[9px] font-semibold text-slate-500">Preview</TableHead>
              <TableHead className="h-7 px-2 py-1 text-[9px] font-semibold text-slate-500">Title</TableHead>
              <TableHead className="h-7 px-2 py-1 text-[9px] font-semibold text-slate-500">Button</TableHead>
              <TableHead className="h-7 px-2 py-1 text-[9px] font-semibold text-slate-500">Status</TableHead>
              <TableHead className="h-7 px-2 py-1 text-right text-[9px] font-semibold text-slate-500">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow
                key={row.id}
                className={cn(
                  "transition-colors",
                  activeRowId === row.id
                    ? "bg-[var(--vendor-primary-btn)]/5 hover:bg-[var(--vendor-primary-btn)]/5"
                    : "hover:bg-slate-50",
                )}
              >
                <TableCell className="w-7 px-2 py-0.5 text-slate-400">
                  <GripVertical className="h-3.5 w-3.5 cursor-grab" />
                </TableCell>
                <TableCell className="w-10 px-2 py-0.5 text-[10px] font-semibold text-slate-600">{index + 1}</TableCell>
                <TableCell className="px-2 py-0.5">
                  <div
                    className={cn(
                      "relative h-8 w-12 overflow-hidden rounded-[var(--vendor-radius-control)] bg-[var(--vendor-secondary-btn)]",
                      !row.imageUrl && thumbnailFallbackClassName,
                    )}
                  >
                    {row.imageUrl ? (
                      <Image src={row.imageUrl} alt={row.title} fill className="object-cover" unoptimized />
                    ) : null}
                  </div>
                </TableCell>
                <TableCell className="px-2 py-0.5 text-[10px] font-semibold text-slate-800 truncate max-w-[120px]">{row.title}</TableCell>
                <TableCell className="px-2 py-0.5 text-[10px] text-slate-600 truncate max-w-[80px]">{row.buttonLabel ?? "-"}</TableCell>
                <TableCell className="px-2 py-0.5">
                  <Switch
                    checked={row.enabled}
                    className="scale-75 data-[state=checked]:bg-emerald-500 origin-left"
                    onCheckedChange={(checked) => onStatusChange?.(row, checked)}
                  />
                </TableCell>
                <TableCell className="px-2 py-0.5 text-right">
                  <div className="inline-flex items-center gap-1">
                    {onEdit ? (
                      <Button type="button" variant="outline" size="icon-xs" onClick={() => onEdit(row)}>
                        <Edit2 className="h-3 w-3" />
                      </Button>
                    ) : null}
                    {onDelete ? (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon-xs"
                        onClick={() => onDelete(row)}
                        className="text-rose-500 hover:text-rose-600"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    ) : null}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
