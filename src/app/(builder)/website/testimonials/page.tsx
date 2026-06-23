"use client";

import * as React from "react";
import {
  ChevronLeft,
  ChevronRight,
  CloudUpload,
  Edit2,
  GripVertical,
  Plus,
  Quote,
  Star,
  X,
} from "lucide-react";
import { WebsiteBuilderLayout } from "../_components/website-builder-layout";
import { ToggleField } from "../_components/toggle-field";
import { WebsiteRichTextEditor } from "../_components/rich-text-editor";
import { BuilderCountedInput } from "../_components/builder-field";
import { FormActions } from "../_components/form-actions";
import { ImageCropper } from "../_components/image-cropper-lazy";
import { ConfirmDeleteButton } from "../_components/confirm-delete-button";
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
import { cn, resolveMediaUrl } from "@/lib/utils";
import {
  useCreateTestimonial,
  useDeleteTestimonial,
  useTestimonials,
  useUpdateTestimonial,
  useUploadVendorMedia,
} from "@/hooks/use-website-builder";
import type { VendorWebsiteTestimonialRecord } from "@/lib/website-builder-api";
import { TestimonialsSection } from "@/components/website-preview/sections/testimonials-section";

interface Testimonial {
  id: string;
  recordId?: number;
  customerName: string;
  eventName: string;
  feedback: string;
  photoUrl: string;
  rating: number;
  showRating: boolean;
  status: boolean;
  isFeatured: boolean;
  sortOrder: number;
  photoFile?: File | null;
}

function avatarDataUrl(name: string, background: string) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160">
      <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${background}" />
        <stop offset="100%" stop-color="#111827" />
      </linearGradient></defs>
      <rect width="160" height="160" rx="24" fill="url(#g)" />
      <circle cx="80" cy="64" r="30" fill="#ffffff" opacity="0.9" />
      <path d="M30 145c8-34 28-51 50-51s42 17 50 51" fill="#ffffff" opacity="0.9" />
      <text x="80" y="72" text-anchor="middle" font-family="Inter, Arial" font-size="22" font-weight="800" fill="#111827">${initials}</text>
    </svg>
  `)}`;
}

function buildFallbackAvatar(name: string) {
  return avatarDataUrl(name || "Customer", "#a78bfa");
}

function mapRecordToTestimonial(
  record: VendorWebsiteTestimonialRecord,
  index: number,
): Testimonial {
  const customerName = record.customer_name || "Customer";
  return {
    id: String(record.id),
    recordId: record.id,
    customerName,
    eventName: record.event_name || "",
    feedback: record.feedback || "",
    photoUrl: record.photo_url
      ? resolveMediaUrl(record.photo_url)
      : buildFallbackAvatar(customerName),
    rating: Math.max(1, Math.min(5, Number(record.rating || 5))),
    showRating: record.show_rating === true || record.show_rating === 1,
    status: record.is_active === true || record.is_active === 1,
    isFeatured: record.is_featured === true || record.is_featured === 1,
    sortOrder: record.sort_order || index + 1,
    photoFile: null,
  };
}

function TestimonialImageUpload({
  value,
  onFileSelect,
  onRemove,
  maxSizeMb = 2,
}: {
  value: string;
  onFileSelect: (file: File) => void;
  onRemove: () => void;
  maxSizeMb?: number;
}) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [error, setError] = React.useState("");

  const handleClick = () => inputRef.current?.click();

  const acceptFile = (file?: File | null) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    if (file.size > maxSizeMb * 1024 * 1024) {
      setError(`Image is too large. Maximum ${maxSizeMb}MB.`);
      return;
    }
    setError("");
    onFileSelect(file);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    acceptFile(event.target.files?.[0]);
    event.target.value = "";
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    acceptFile(event.dataTransfer.files?.[0]);
  };

  return (
    <div className="space-y-1">
      <p className="text-[11px] font-medium text-[var(--vendor-text)]">Customer Photo</p>
      <div className="relative overflow-hidden rounded-[var(--vendor-radius-control)] border border-[var(--vendor-border)]">
        <img src={value} alt="Customer" className="h-24 w-full object-cover" />
        <button
          type="button"
          onClick={onRemove}
          className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80"
        >
          <X className="h-3 w-3" />
        </button>
      </div>
      <div
        role="button"
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={(event) => event.key === "Enter" && handleClick()}
        onDragOver={(event) => event.preventDefault()}
        onDrop={handleDrop}
        className="flex cursor-pointer flex-col items-center justify-center gap-1 rounded-[var(--vendor-radius-control)] border border-dashed border-[var(--vendor-border)] bg-slate-50/60 px-4 py-4 text-center transition-colors hover:bg-slate-100/60"
      >
        <CloudUpload className="mb-0.5 h-6 w-6 text-[var(--vendor-text-muted)]" />
        <p className="text-[11px] font-semibold text-[var(--vendor-text)]">Click to upload</p>
        <p className="text-[10px] text-[var(--vendor-text-muted)]">or drag and drop</p>
        <p className="mt-0.5 text-[10px] leading-tight text-[var(--vendor-text-muted)]">
          Recommended: 400x400px
          <br />
          (Max: 2MB)
        </p>
      </div>
      {error && (
        <p className="text-[10px] font-medium text-rose-500">{error}</p>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />
    </div>
  );
}

function StarRating({ count = 5 }: { count?: number }) {
  return (
    <div className="flex items-center justify-center gap-0.5">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          className={cn(
            "h-3.5 w-3.5",
            index < count
              ? "fill-amber-400 text-amber-400"
              : "fill-slate-200 text-slate-200",
          )}
        />
      ))}
    </div>
  );
}

function RatingInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, index) => {
        const star = index + 1;
        return (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="transition-transform hover:scale-110 focus:outline-none"
            aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
          >
            <Star
              className={cn(
                "h-6 w-6",
                star <= value
                  ? "fill-amber-400 text-amber-400"
                  : "fill-slate-200 text-slate-200",
              )}
            />
          </button>
        );
      })}
      <span className="ml-1.5 text-[11px] font-semibold text-[var(--vendor-text-muted)]">
        {value} / 5
      </span>
    </div>
  );
}

function TestimonialLivePreview({ testimonials }: { testimonials: Testimonial[] }) {
  const active = testimonials.filter((item) => item.status);
  if (!active.length) return null;

  const initials = (name: string) =>
    name
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();

  return (
    <div className="space-y-3 rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-[var(--vendor-panel-bg)] p-3 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
        <span className="text-[12px] font-semibold text-[var(--vendor-text)]">Live Preview</span>
        <span className="text-[11px] text-[var(--vendor-text-muted)]">
          This is how testimonials will appear on the website.
        </span>
      </div>

      {/* Mirrors the live TestimonialsSection design (rating top → feedback → photo + name + event). */}
      <div className="rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-slate-50 px-4 py-6">
        <div className="mb-6 text-center">
          <span className="mb-3 inline-flex rounded-[3px] bg-[var(--vendor-primary-btn)] px-2.5 py-0.5 text-[10px] font-bold text-white">
            Testimonials
          </span>
          <h2 className="mt-3 text-[18px] font-black tracking-tight text-[var(--vendor-text)]">
            What Our Clients Say
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {active.map((t) => (
            <article
              key={t.id}
              className="flex flex-col rounded-[14px] bg-white p-4 shadow-[0_12px_30px_rgba(15,23,42,0.07)]"
            >
              {t.showRating ? (
                <div className="mb-2 flex gap-0.5 text-[12px] text-amber-400">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <span key={index} className={index < t.rating ? "" : "text-slate-200"}>
                      ★
                    </span>
                  ))}
                </div>
              ) : null}
              <p className="flex-1 text-[11px] font-medium leading-5 text-slate-600">
                {t.feedback.replace(/<[^>]+>/g, "") || "Wonderful experience!"}
              </p>
              <div className="mt-4 flex items-center gap-2.5">
                {t.photoUrl ? (
                  <img
                    src={t.photoUrl}
                    alt={t.customerName}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--vendor-primary-btn)] text-[11px] font-black text-white">
                    {initials(t.customerName)}
                  </span>
                )}
                <div className="min-w-0">
                  <p className="truncate text-[12px] font-black text-slate-950">
                    {t.customerName}
                  </p>
                  {t.eventName ? (
                    <p className="truncate text-[10px] font-bold text-[var(--vendor-primary-btn)]">
                      {t.eventName}
                    </p>
                  ) : null}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

function CarouselTestimonialLivePreview({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  const active = testimonials.filter((item) => item.status);
  if (!active.length) return null;

  const previewTestimonials = active.map((item, index) => ({
    id: item.recordId ?? index + 1,
    name: item.customerName,
    event: item.eventName,
    feedback: item.feedback.replace(/<[^>]+>/g, "") || "Wonderful experience!",
    photoUrl: item.photoUrl,
    rating: item.rating,
    showRating: item.showRating,
  }));

  return (
    <div className="space-y-3 rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-[var(--vendor-panel-bg)] p-3 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
        <span className="text-[12px] font-semibold text-[var(--vendor-text)]">
          Live Preview
        </span>
        <span className="text-[11px] text-[var(--vendor-text-muted)]">
          This is how testimonials will appear on the website.
        </span>
      </div>
      <div
        className="overflow-hidden rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)]"
        style={{ "--preview-card-radius": "12px" } as React.CSSProperties}
      >
        <TestimonialsSection
          testimonials={previewTestimonials}
          theme={{
            primaryButton: "var(--vendor-primary-btn)",
            primaryText: "var(--vendor-text)",
            secondaryText: "var(--vendor-text-muted)",
            paragraph: "var(--vendor-text-muted)",
          }}
        />
      </div>
    </div>
  );
}

function TestimonialManagementTable({
  testimonials,
  activeId,
  onAdd,
  onEdit,
  onDelete,
  onReorder,
  onStatusChange,
}: {
  testimonials: Testimonial[];
  activeId?: string;
  onAdd: () => void;
  onEdit: (item: Testimonial) => void;
  onDelete: (item: Testimonial) => void;
  onReorder: (items: Testimonial[]) => void;
  onStatusChange: (item: Testimonial, status: boolean) => void;
}) {
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
    dragItemIndex.current = index;
    dragOverItemIndex.current = index;
    setDraggingIndex(index);
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", String(testimonials[index]?.id ?? index));
  };

  const handleDragEnter = (index: number) => {
    if (dragItemIndex.current === null) return;
    dragOverItemIndex.current = index;
    setOverIndex(index);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    if (
      dragItemIndex.current === null ||
      dragOverItemIndex.current === null ||
      dragItemIndex.current === dragOverItemIndex.current
    ) {
      resetDragState();
      return;
    }

    const reordered = [...testimonials];
    const [moved] = reordered.splice(dragItemIndex.current, 1);
    reordered.splice(dragOverItemIndex.current, 0, moved);
    onReorder(reordered);
    resetDragState();
  };

  return (
    <div className="space-y-2 rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-[var(--vendor-panel-bg)] p-3 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-[13px] font-black text-[var(--vendor-text)]">
            Testimonial Management
          </h2>
          <p className="text-[10px] text-[var(--vendor-text-muted)]">
            Add, edit, or remove testimonials.
          </p>
        </div>
        <Button type="button" size="xs" onClick={onAdd} className="h-8 shrink-0 gap-1.5 px-3 text-[11px]">
          <Plus className="h-3.5 w-3.5" />
          Add New Testimonial
        </Button>
      </div>

      <div className="overflow-hidden rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)]">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-50">
              <TableHead className="h-9 w-7 px-2" />
              <TableHead className="h-9 w-8 px-2 text-[11px] font-semibold text-slate-500">#</TableHead>
              <TableHead className="h-9 px-2 text-[11px] font-semibold text-slate-500">Photo</TableHead>
              <TableHead className="h-9 px-2 text-[11px] font-semibold text-slate-500">Name</TableHead>
              <TableHead className="h-9 px-2 text-[11px] font-semibold text-slate-500">Event Name</TableHead>
              <TableHead className="h-9 px-2 text-[11px] font-semibold text-slate-500">Rating</TableHead>
              <TableHead className="h-9 px-2 text-[11px] font-semibold text-slate-500">Status</TableHead>
              <TableHead className="h-9 px-2 text-right text-[11px] font-semibold text-slate-500">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {testimonials.map((item, index) => (
              <TableRow
                key={item.id}
                onDragEnter={() => handleDragEnter(index)}
                onDragOver={(event) => {
                  event.preventDefault();
                  event.dataTransfer.dropEffect = "move";
                }}
                onDrop={handleDrop}
                className={cn(
                  "transition-colors",
                  draggingIndex === index
                    ? "opacity-40"
                    : overIndex === index && draggingIndex !== index
                      ? "bg-[var(--vendor-primary-btn)]/10"
                      : activeId === item.id
                        ? "bg-[var(--vendor-primary-btn)]/5 hover:bg-[var(--vendor-primary-btn)]/5"
                        : "hover:bg-slate-50",
                )}
              >
                <TableCell className="w-7 px-2 py-2.5">
                  <button
                    type="button"
                    draggable
                    onDragStart={(event) => handleDragStart(event, index)}
                    onDragEnd={resetDragState}
                    className="flex cursor-grab text-slate-400 active:cursor-grabbing"
                    aria-label={`Drag ${item.customerName}`}
                  >
                    <GripVertical className="h-4 w-4" />
                  </button>
                </TableCell>
                <TableCell className="w-8 px-2 py-2.5 text-[12px] font-semibold text-slate-600">
                  {index + 1}
                </TableCell>
                <TableCell className="px-2 py-2.5">
                  <img
                    src={item.photoUrl}
                    alt={item.customerName}
                    className="h-9 w-9 rounded-full object-cover"
                  />
                </TableCell>
                <TableCell className="px-2 py-2.5 text-[12px] font-semibold text-slate-800">
                  {item.customerName}
                </TableCell>
                <TableCell className="px-2 py-2.5 text-[12px] text-slate-500">
                  {item.eventName}
                </TableCell>
                <TableCell className="px-2 py-2.5">
                  {item.showRating ? (
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, starIndex) => (
                        <Star
                          key={starIndex}
                          className={cn(
                            "h-3 w-3",
                            starIndex < item.rating
                              ? "fill-amber-400 text-amber-400"
                              : "fill-slate-200 text-slate-200",
                          )}
                        />
                      ))}
                    </div>
                  ) : (
                    <span className="text-[10px] text-slate-400">Hidden</span>
                  )}
                </TableCell>
                <TableCell className="px-2 py-2.5">
                  <Switch
                    checked={item.status}
                    className="data-[state=checked]:bg-emerald-500"
                    onCheckedChange={(checked) => onStatusChange(item, checked)}
                  />
                </TableCell>
                <TableCell className="px-2 py-2.5 text-right">
                  <div className="inline-flex items-center gap-1.5">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon-xs"
                      onClick={() => onEdit(item)}
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </Button>
                    <ConfirmDeleteButton
                      onConfirm={() => onDelete(item)}
                      itemLabel={item.customerName}
                      className="text-rose-500 hover:text-rose-600"
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default function TestimonialsPage() {
  const { data: testimonialRecords = [] } = useTestimonials();
  const createTestimonial = useCreateTestimonial();
  const updateTestimonial = useUpdateTestimonial();
  const deleteTestimonial = useDeleteTestimonial();
  const uploadVendorMedia = useUploadVendorMedia();

  const [testimonials, setTestimonials] = React.useState<Testimonial[]>([]);
  const [editingId, setEditingId] = React.useState<string>("");
  const [cropperOpen, setCropperOpen] = React.useState(false);
  const [imageToCrop, setImageToCrop] = React.useState("");
  const [pendingPhotoFile, setPendingPhotoFile] = React.useState<File | null>(null);
  const [isSaving, setIsSaving] = React.useState(false);

  React.useEffect(() => {
    const mapped = [...testimonialRecords]
      .sort(
        (left, right) =>
          (left.sort_order ?? Number.MAX_SAFE_INTEGER) -
          (right.sort_order ?? Number.MAX_SAFE_INTEGER),
      )
      .map((record, index) => mapRecordToTestimonial(record, index));
    setTestimonials(mapped);
    if (!mapped.length) {
      setEditingId("");
      return;
    }
    setEditingId((current) =>
      mapped.some((item) => item.id === current) ? current : mapped[0].id,
    );
  }, [testimonialRecords]);

  const editing = React.useMemo(
    () => testimonials.find((item) => item.id === editingId) ?? testimonials[0] ?? null,
    [editingId, testimonials],
  );

  const updateEditing = (patch: Partial<Testimonial>) => {
    if (!editing) return;
    setTestimonials((current) =>
      current.map((item) =>
        item.id === editing.id
          ? {
              ...item,
              ...patch,
            }
          : item,
      ),
    );
  };

  const handlePhotoSelect = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setPendingPhotoFile(file);
      setImageToCrop(String(reader.result || ""));
      setCropperOpen(true);
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = (croppedBase64: string) => {
    const sourceFile = pendingPhotoFile;
    if (!sourceFile) {
      setCropperOpen(false);
      setImageToCrop("");
      return;
    }

    fetch(croppedBase64)
      .then((response) => response.blob())
      .then((blob) => {
        const extension = sourceFile.name.includes(".")
          ? sourceFile.name.slice(sourceFile.name.lastIndexOf("."))
          : ".jpg";
        const croppedFile = new File(
          [blob],
          `${sourceFile.name.replace(/\.[^.]+$/, "")}-cropped${extension}`,
          { type: blob.type || sourceFile.type || "image/jpeg" },
        );

        updateEditing({
          photoUrl: croppedBase64,
          photoFile: croppedFile,
        });

        setPendingPhotoFile(null);
        setImageToCrop("");
        setCropperOpen(false);
      });
  };

  const handlePhotoRemove = () => {
    if (!editing) return;
    updateEditing({
      photoUrl: buildFallbackAvatar(editing.customerName),
      photoFile: null,
    });
  };

  const handleAdd = () => {
    const next: Testimonial = {
      id: `draft-${Date.now()}`,
      customerName: "New Customer",
      eventName: "Event Name",
      feedback: "Add customer feedback here.",
      photoUrl: buildFallbackAvatar("New Customer"),
      rating: 5,
      showRating: true,
      status: true,
      isFeatured: false,
      sortOrder: testimonials.length + 1,
      photoFile: null,
    };
    setTestimonials((current) => [...current, next]);
    setEditingId(next.id);
  };

  const handleDelete = async (item: Testimonial) => {
    if (item.recordId) {
      await deleteTestimonial.mutateAsync(item.recordId);
      return;
    }
    setTestimonials((current) => {
      const nextItems = current.filter((row) => row.id !== item.id);
      setEditingId((currentId) =>
        currentId === item.id ? nextItems[0]?.id || "" : currentId,
      );
      return nextItems.map((row, index) => ({
        ...row,
        sortOrder: index + 1,
      }));
    });
  };

  const handleReorder = async (reordered: Testimonial[]) => {
    const normalized = reordered.map((item, index) => ({
      ...item,
      sortOrder: index + 1,
    }));
    setTestimonials(normalized);

    await Promise.all(
      normalized
        .filter((item) => item.recordId)
        .map((item) =>
          updateTestimonial.mutateAsync({
            id: item.recordId as number,
            payload: {
              customer_name: item.customerName,
              photo_url: item.photoUrl.startsWith("data:") ? null : item.photoUrl,
              event_name: item.eventName,
              feedback: item.feedback,
              rating: item.rating,
              show_rating: item.showRating,
              is_featured: item.isFeatured,
              sort_order: item.sortOrder,
              is_active: item.status,
            },
          }),
        ),
    );
  };

  const handleStatusChange = async (item: Testimonial, status: boolean) => {
    setTestimonials((current) =>
      current.map((row) => (row.id === item.id ? { ...row, status } : row)),
    );

    if (!item.recordId) return;

    await updateTestimonial.mutateAsync({
      id: item.recordId,
      payload: {
        customer_name: item.customerName,
        photo_url: item.photoUrl.startsWith("data:") ? null : item.photoUrl,
        event_name: item.eventName,
        feedback: item.feedback,
        rating: item.rating,
        show_rating: item.showRating,
        is_featured: item.isFeatured,
        sort_order: item.sortOrder,
        is_active: status,
      },
    });
  };

  const handleSave = async () => {
    if (!editing) return;

    setIsSaving(true);
    try {
      let photoUrl = editing.photoUrl;
      if (editing.photoFile) {
        const uploaded = await uploadVendorMedia.mutateAsync({
          file: editing.photoFile,
          folder: "testimonials",
        });
        photoUrl = uploaded.url;
      }

      const payload = {
        customer_name: editing.customerName.trim(),
        photo_url: photoUrl.startsWith("data:") ? null : photoUrl,
        event_name: editing.eventName.trim(),
        feedback: editing.feedback,
        rating: editing.rating,
        show_rating: editing.showRating,
        is_featured: editing.isFeatured,
        sort_order: editing.sortOrder,
        is_active: editing.status,
      };

      if (editing.recordId) {
        await updateTestimonial.mutateAsync({
          id: editing.recordId,
          payload,
        });
      } else {
        await createTestimonial.mutateAsync(payload);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (!editing) return;
    updateEditing({
      customerName: "",
      eventName: "",
      feedback: "",
      photoUrl: buildFallbackAvatar("Guest"),
      photoFile: null,
      rating: 0,
      showRating: false,
      status: false,
      isFeatured: false,
    });
  };

  if (!editing) {
    return (
      <WebsiteBuilderLayout
        title="Testimonials"
        form={
          <div className="rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-white p-4 shadow-sm">
            <Button type="button" size="xs" onClick={handleAdd} className="h-8 gap-1.5 px-3 text-[11px]">
              <Plus className="h-3.5 w-3.5" />
              Add New Testimonial
            </Button>
          </div>
        }
        leftClassName="border-0 bg-transparent p-0 shadow-none"
      />
    );
  }

  const form = (
    <div className="grid grid-cols-1 items-start gap-3 lg:grid-cols-[340px_1fr]">
      <div className="space-y-2.5 rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-[var(--vendor-panel-bg)] p-3 shadow-sm">
        <div>
          <p className="text-[13px] font-black text-[var(--vendor-text)]">
            Testimonial Information
          </p>
          <p className="text-[10px] text-[var(--vendor-text-muted)]">
            Add customer testimonial and feedback.
          </p>
        </div>

        <BuilderCountedInput
          label="Customer Name"
          required
          value={editing.customerName}
          onChange={(value) => updateEditing({ customerName: value })}
          maxLength={100}
          className="space-y-0.5"
        />

        <TestimonialImageUpload
          key={`${editing.id}-photo`}
          value={editing.photoUrl}
          onFileSelect={handlePhotoSelect}
          onRemove={handlePhotoRemove}
        />

        <BuilderCountedInput
          label="Event Name"
          required
          value={editing.eventName}
          onChange={(value) => updateEditing({ eventName: value })}
          maxLength={100}
          className="space-y-0.5"
        />

        <WebsiteRichTextEditor
          label="Feedback"
          value={editing.feedback}
          onChange={(value) => updateEditing({ feedback: value })}
          height="120px"
          showWordCount={false}
          showCharCount
          maxChars={1000}
        />

        <ToggleField
          label="Show Rating"
          description="Display star rating for this testimonial."
          checked={editing.showRating}
          onCheckedChange={(showRating) => updateEditing({ showRating })}
          className="rounded-[var(--vendor-radius-control)] border border-[var(--vendor-border)] bg-slate-50/60 px-2.5 py-2"
        />

        {editing.showRating ? (
          <div className="space-y-1 px-0.5">
            <p className="text-[11px] font-medium text-[var(--vendor-text)]">Rating</p>
            <RatingInput
              value={editing.rating}
              onChange={(rating) => updateEditing({ rating })}
            />
          </div>
        ) : null}

        <ToggleField
          label="Show/Hide Testimonial"
          description="Choose whether to show this testimonial on the website."
          checked={editing.status}
          onCheckedChange={(status) => updateEditing({ status })}
          className="rounded-[var(--vendor-radius-control)] border border-[var(--vendor-border)] bg-slate-50/60 px-2.5 py-2"
        />

        <div className="border-t border-[var(--vendor-border)] pt-2">
          <FormActions
            saveLabel={editing.recordId ? "Update Testimonial" : "Save Testimonial"}
            onCancel={handleCancel}
            onSave={handleSave}
            isSaving={isSaving}
            layout="default"
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <CarouselTestimonialLivePreview testimonials={testimonials} />
        <TestimonialManagementTable
          testimonials={testimonials}
          activeId={editing.id}
          onAdd={handleAdd}
          onEdit={(item) => setEditingId(item.id)}
          onDelete={handleDelete}
          onReorder={handleReorder}
          onStatusChange={handleStatusChange}
        />
      </div>
    </div>
  );

  return (
    <>
      <WebsiteBuilderLayout
        title="Testimonials"
        form={form}
        onSave={handleSave}
        onCancel={handleCancel}
        onDelete={() => handleDelete(editing)}
        deleteItemLabel={editing.customerName || "testimonial"}
        saveLabel={editing.recordId ? "Update Testimonial" : "Save Testimonial"}
        isSaving={isSaving}
        leftClassName="border-0 bg-transparent p-0 shadow-none"
        howItWorksLabel="How It Works"
        onHowItWorks={() =>
          alert("This is where you'd explain how to use the testimonials editor.")
        }
      />
      <ImageCropper
        open={cropperOpen}
        imageSrc={imageToCrop}
        onClose={() => {
          setCropperOpen(false);
          setImageToCrop("");
          setPendingPhotoFile(null);
        }}
        onCropComplete={handleCropComplete}
        aspectRatio={1}
        outputWidth={400}
        outputHeight={400}
        title="Crop Testimonial Photo"
      />
    </>
  );
}
