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
  Trash2,
  X,
} from "lucide-react";
import { WebsiteBuilderLayout } from "../_components/website-builder-layout";
import { ToggleField } from "../_components/toggle-field";
import { WebsiteRichTextEditor } from "../_components/rich-text-editor";
import { BuilderCountedInput } from "../_components/builder-field";
import { FormActions } from "../_components/form-actions";
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

// ─── Types ────────────────────────────────────────────────────────────────────
interface Testimonial {
  id: string;
  customerName: string;
  eventName: string;
  feedback: string;
  photoUrl: string;
  rating: number;       // 1–5
  showRating: boolean;  // show/hide stars
  status: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function avatarDataUrl(name: string, background: string) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
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

function isRealImage(url: string | undefined): boolean {
  if (!url) return false;
  if (url.startsWith("data:image/svg+xml")) return false;
  return true;
}

const initialTestimonials: Testimonial[] = [
  {
    id: "1",
    customerName: "Jessica Thompson",
    eventName: "Dream Wedding Celebration",
    feedback:
      "Eventify made our dream wedding a reality! Every detail was perfectly planned and executed. The team was professional, creative, and incredibly supportive throughout the entire journey. Our guests are still talking about how amazing everything was! Thank you for making our special day unforgettable.",
    photoUrl: avatarDataUrl("Jessica Thompson", "#f6b3a7"),
    rating: 5,
    showRating: true,
    status: true,
  },
  {
    id: "2",
    customerName: "David Miller",
    eventName: "Corporate Annual Gala",
    feedback:
      "Exceptional service and flawless execution! The team handled everything with professionalism and creativity. Highly recommended for any corporate event!",
    photoUrl: avatarDataUrl("David Miller", "#38bdf8"),
    rating: 4,
    showRating: true,
    status: true,
  },
  {
    id: "3",
    customerName: "Michael Brown",
    eventName: "Birthday Bash",
    feedback:
      "From the decor to the entertainment, everything was beyond our expectations. The attention to detail and customer care is unmatched. Will definitely work with Eventify again!",
    photoUrl: avatarDataUrl("Michael Brown", "#94a3b8"),
    rating: 5,
    showRating: false,
    status: false,
  },
];

// ─── Inline ImageUpload (fixed) ───────────────────────────────────────────────
function TestimonialImageUpload({
  value,
  onFileSelect,
  onRemove,
}: {
  value: string;
  onFileSelect: (file: File) => void;
  onRemove: () => void;
}) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const handleClick = () => inputRef.current?.click();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
    e.target.value = "";
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) onFileSelect(file);
  };
  const hasRealImage = isRealImage(value);

  return (
    <div className="space-y-1">
      <p className="text-[11px] font-medium text-[var(--vendor-text)]">Customer Photo</p>
      {hasRealImage ? (
        <div className="relative rounded-[var(--vendor-radius-control)] overflow-hidden border border-[var(--vendor-border)]">
          <img src={value} alt="Customer" className="w-full h-24 object-cover" />
          <button
            type="button"
            onClick={onRemove}
            className="absolute top-1.5 right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ) : (
        <div
          role="button"
          tabIndex={0}
          onClick={handleClick}
          onKeyDown={(e) => e.key === "Enter" && handleClick()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="flex flex-col items-center justify-center gap-1 rounded-[var(--vendor-radius-control)] border border-dashed border-[var(--vendor-border)] bg-slate-50/60 px-4 py-4 text-center cursor-pointer hover:bg-slate-100/60 transition-colors"
        >
          <CloudUpload className="h-6 w-6 text-[var(--vendor-text-muted)] mb-0.5" />
          <p className="text-[11px] font-semibold text-[var(--vendor-text)]">Click to upload</p>
          <p className="text-[10px] text-[var(--vendor-text-muted)]">or drag and drop</p>
          <p className="text-[10px] text-[var(--vendor-text-muted)] mt-0.5 leading-tight">
            Recommended: 200x200px<br />(Max: 2MB)
          </p>
        </div>
      )}
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleChange} />
    </div>
  );
}

// ─── Star Rating ──────────────────────────────────────────────────────────────
function StarRating({ count = 5 }: { count?: number }) {
  return (
    <div className="flex items-center justify-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "h-3.5 w-3.5",
            i < count
              ? "fill-amber-400 text-amber-400"
              : "fill-slate-200 text-slate-200"
          )}
        />
      ))}
    </div>
  );
}

// ─── Rating Input ─────────────────────────────────────────────────────────────
function RatingInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => {
        const star = i + 1;
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
                  : "fill-slate-200 text-slate-200"
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

// ─── Live Preview Carousel ────────────────────────────────────────────────────
function TestimonialLivePreview({ testimonials }: { testimonials: Testimonial[] }) {
  const [current, setCurrent] = React.useState(0);
  const active = testimonials.filter((t) => t.status);
  if (!active.length) return null;

  const prev = () => setCurrent((c) => (c - 1 + active.length) % active.length);
  const next = () => setCurrent((c) => (c + 1) % active.length);

  const getVisible = () => {
    if (active.length === 1) return [{ t: active[0], pos: "center" }];
    if (active.length === 2)
      return [
        { t: active[0], pos: "left" },
        { t: active[1], pos: "center" },
      ];
    const left = active[(current - 1 + active.length) % active.length];
    const center = active[current];
    const right = active[(current + 1) % active.length];
    return [
      { t: left, pos: "left" },
      { t: center, pos: "center" },
      { t: right, pos: "right" },
    ];
  };

  const visible = getVisible();

  return (
    <div className="rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-[var(--vendor-panel-bg)] p-3 shadow-sm space-y-3">
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
        <span className="text-[12px] font-semibold text-[var(--vendor-text)]">Live Preview</span>
        <span className="text-[11px] text-[var(--vendor-text-muted)]">
          — This is how testimonials will appear on the website.
        </span>
      </div>

      <div className="rounded-[var(--vendor-radius-panel)] bg-slate-50/80 border border-[var(--vendor-border)] px-6 py-6">
        <div className="text-center mb-6">
          <h2 className="text-[18px] font-black text-[var(--vendor-text)]">What Our Clients Say</h2>
          <p className="text-[11px] text-[var(--vendor-text-muted)] mt-1">
            Real stories from real clients who celebrated with us.
          </p>
        </div>

        <div className="relative flex items-center gap-3">
          <button
            onClick={prev}
            className="absolute -left-3 z-10 flex h-7 w-7 items-center justify-center rounded-full border border-[var(--vendor-border)] bg-white shadow-sm hover:bg-slate-50 transition-colors"
          >
            <ChevronLeft className="h-4 w-4 text-[var(--vendor-text)]" />
          </button>

          <div className="flex gap-3 w-full overflow-hidden">
            {visible.map(({ t, pos }) => (
              <div
                key={t.id}
                className={cn(
                  "flex-1 rounded-[var(--vendor-radius-panel)] bg-white border border-[var(--vendor-border)] p-4 flex flex-col items-center text-center transition-all",
                  pos === "center" ? "shadow-md scale-[1.03] z-10" : "opacity-80 scale-[0.97]"
                )}
              >
                <Quote className="h-6 w-6 text-[var(--vendor-primary-btn)] mb-2 fill-[var(--vendor-primary-btn)]" />
                <img
                  src={t.photoUrl}
                  alt={t.customerName}
                  className="h-14 w-14 rounded-full object-cover border-2 border-white shadow mb-2"
                />
                <p className="text-[13px] font-black text-[var(--vendor-text)]">{t.customerName}</p>
                <p className="text-[10px] font-semibold text-[var(--vendor-primary-btn)] mb-1">
                  {t.eventName}
                </p>
                {/* ← rating shown only if showRating is true */}
                {t.showRating && <StarRating count={t.rating} />}
                <p className="mt-2 text-[10px] text-[var(--vendor-text-muted)] leading-relaxed line-clamp-5">
                  {t.feedback.replace(/<[^>]+>/g, "")}
                </p>
              </div>
            ))}
          </div>

          <button
            onClick={next}
            className="absolute -right-3 z-10 flex h-7 w-7 items-center justify-center rounded-full border border-[var(--vendor-border)] bg-white shadow-sm hover:bg-slate-50 transition-colors"
          >
            <ChevronRight className="h-4 w-4 text-[var(--vendor-text)]" />
          </button>
        </div>

        <div className="flex justify-center gap-1.5 mt-5">
          {active.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={cn(
                "h-2 rounded-full transition-all",
                i === current ? "w-5 bg-[var(--vendor-primary-btn)]" : "w-2 bg-slate-300"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Management Table ─────────────────────────────────────────────────────────
function TestimonialManagementTable({
  testimonials,
  activeId,
  onAdd,
  onEdit,
  onDelete,
  onStatusChange,
}: {
  testimonials: Testimonial[];
  activeId?: string;
  onAdd: () => void;
  onEdit: (t: Testimonial) => void;
  onDelete: (t: Testimonial) => void;
  onStatusChange: (t: Testimonial, status: boolean) => void;
}) {
  return (
    <div className="rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-[var(--vendor-panel-bg)] p-3 shadow-sm space-y-2">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-[13px] font-black text-[var(--vendor-text)]">Testimonial Management</h2>
          <p className="text-[10px] text-[var(--vendor-text-muted)]">Add, edit, or remove testimonials.</p>
        </div>
        <Button
          type="button"
          size="xs"
          onClick={onAdd}
          className="h-8 gap-1.5 px-3 text-[11px] shrink-0"
        >
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
            {testimonials.map((t, index) => (
              <TableRow
                key={t.id}
                className={cn(
                  "transition-colors",
                  activeId === t.id
                    ? "bg-[var(--vendor-primary-btn)]/5 hover:bg-[var(--vendor-primary-btn)]/5"
                    : "hover:bg-slate-50"
                )}
              >
                <TableCell className="w-7 px-2 py-2.5">
                  <GripVertical className="h-4 w-4 cursor-grab text-slate-400" />
                </TableCell>
                <TableCell className="w-8 px-2 py-2.5 text-[12px] font-semibold text-slate-600">
                  {index + 1}
                </TableCell>
                <TableCell className="px-2 py-2.5">
                  <img
                    src={t.photoUrl}
                    alt={t.customerName}
                    className="h-9 w-9 rounded-full object-cover"
                  />
                </TableCell>
                <TableCell className="px-2 py-2.5 text-[12px] font-semibold text-slate-800">
                  {t.customerName}
                </TableCell>
                <TableCell className="px-2 py-2.5 text-[12px] text-slate-500">
                  {t.eventName}
                </TableCell>
                {/* ← Rating column */}
                <TableCell className="px-2 py-2.5">
                  {t.showRating ? (
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "h-3 w-3",
                            i < t.rating
                              ? "fill-amber-400 text-amber-400"
                              : "fill-slate-200 text-slate-200"
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
                    checked={t.status}
                    className="data-[state=checked]:bg-emerald-500"
                    onCheckedChange={(checked) => onStatusChange(t, checked)}
                  />
                </TableCell>
                <TableCell className="px-2 py-2.5 text-right">
                  <div className="inline-flex items-center gap-1.5">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon-xs"
                      onClick={() => onEdit(t)}
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon-xs"
                      onClick={() => onDelete(t)}
                      className="text-rose-500 hover:text-rose-600"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
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

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = React.useState<Testimonial[]>(initialTestimonials);
  const [editingId, setEditingId] = React.useState(initialTestimonials[0].id);
  const objectUrlsRef = React.useRef<string[]>([]);
  const [isSaving, setIsSaving] = React.useState(false);

  const handleSave = () => { setIsSaving(true); setTimeout(() => setIsSaving(false), 800); };
  const handleCancel = () => {
    setTestimonials(initialTestimonials);
    setEditingId(initialTestimonials[0].id);
  };

  React.useEffect(() => {
    return () => { objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url)); };
  }, []);

  const editing = testimonials.find((t) => t.id === editingId) ?? testimonials[0];

  const updateEditing = (patch: Partial<Testimonial>) =>
    setTestimonials((curr) => curr.map((t) => (t.id === editing.id ? { ...t, ...patch } : t)));

  const handlePhotoSelect = (file: File) => {
    const url = URL.createObjectURL(file);
    objectUrlsRef.current.push(url);
    if (editing.photoUrl.startsWith("blob:")) URL.revokeObjectURL(editing.photoUrl);
    updateEditing({ photoUrl: url });
  };

  const handlePhotoRemove = () => {
    if (editing.photoUrl.startsWith("blob:")) URL.revokeObjectURL(editing.photoUrl);
    updateEditing({ photoUrl: avatarDataUrl(editing.customerName, "#a78bfa") });
  };

  const handleAdd = () => {
    const next: Testimonial = {
      id: `${Date.now()}`,
      customerName: "New Customer",
      eventName: "Event Name",
      feedback: "Add customer feedback here.",
      photoUrl: avatarDataUrl("New Customer", "#a78bfa"),
      rating: 5,
      showRating: true,
      status: true,
    };
    setTestimonials((curr) => [...curr, next]);
    setEditingId(next.id);
  };

  const handleDelete = (t: Testimonial) => {
    setTestimonials((curr) => {
      const next = curr.filter((item) => item.id !== t.id);
      if (t.id === editingId && next[0]) setEditingId(next[0].id);
      return next.length ? next : curr;
    });
  };

  const form = (
    <div className="grid gap-3 grid-cols-1 lg:grid-cols-[340px_1fr] items-start">

      {/* ── Left: Form ── */}
      <div className="rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-[var(--vendor-panel-bg)] p-3 shadow-sm space-y-2.5">
        <div>
          <p className="text-[13px] font-black text-[var(--vendor-text)]">Testimonial Information</p>
          <p className="text-[10px] text-[var(--vendor-text-muted)]">Add customer testimonial and feedback.</p>
        </div>

        <BuilderCountedInput
          label="Customer Name"
          required
          value={editing.customerName}
          onChange={(v) => updateEditing({ customerName: v })}
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
          onChange={(v) => updateEditing({ eventName: v })}
          maxLength={100}
          className="space-y-0.5"
        />

        <WebsiteRichTextEditor
          label="Feedback"
          value={editing.feedback}
          onChange={(v) => updateEditing({ feedback: v })}
          height="120px"
          showWordCount={false}
          showCharCount
          maxChars={1000}
        />

        {/* ── Rating toggle + input ── */}
        <ToggleField
          label="Show Rating"
          description="Display star rating for this testimonial."
          checked={editing.showRating}
          onCheckedChange={(showRating) => updateEditing({ showRating })}
          className="border border-[var(--vendor-border)] bg-slate-50/60 px-2.5 py-2 rounded-[var(--vendor-radius-control)]"
        />

        {/* Rating stars — only visible when showRating is on */}
        {editing.showRating && (
          <div className="space-y-1 px-0.5">
            <p className="text-[11px] font-medium text-[var(--vendor-text)]">Rating</p>
            <RatingInput
              value={editing.rating}
              onChange={(rating) => updateEditing({ rating })}
            />
          </div>
        )}

        <ToggleField
          label="Show/Hide Testimonial"
          description="Choose whether to show this testimonial on the website."
          checked={editing.status}
          onCheckedChange={(status) => updateEditing({ status })}
          className="border border-[var(--vendor-border)] bg-slate-50/60 px-2.5 py-2 rounded-[var(--vendor-radius-control)]"
        />

        <div className="border-t border-[var(--vendor-border)] pt-2">
          <FormActions
            saveLabel="Update Testimonial"
            onCancel={() => setEditingId(initialTestimonials[0].id)}
            onSave={handleSave}
            isSaving={isSaving}
            layout="default"
          />
        </div>
      </div>

      {/* ── Right: Live Preview + Table ── */}
      <div className="flex flex-col gap-3">
        <TestimonialLivePreview testimonials={testimonials} />
        <TestimonialManagementTable
          testimonials={testimonials}
          activeId={editing.id}
          onAdd={handleAdd}
          onEdit={(t) => setEditingId(t.id)}
          onDelete={handleDelete}
          onStatusChange={(t, status) =>
            setTestimonials((curr) =>
              curr.map((item) => (item.id === t.id ? { ...item, status } : item))
            )
          }
        />
      </div>

    </div>
  );

  return (
    <WebsiteBuilderLayout
      title="Testimonials"
      form={form}
      saveLabel="Save Testimonials"
      onSave={handleSave}
      onCancel={handleCancel}
      isSaving={isSaving}
      leftClassName="border-0 bg-transparent p-0 shadow-none"
      howItWorksLabel="How It Works"
      onHowItWorks={() =>
        alert("This is where you'd explain how to use the testimonials editor.")
      }
    />
  );
}