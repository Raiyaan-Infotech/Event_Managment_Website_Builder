"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, Edit2, GripVertical, Plus, Quote, Star, Trash2 } from "lucide-react";
import { WebsiteBuilderLayout } from "../_components/website-builder-layout";
import { ImageUpload } from "../_components/image-upload";
import { ToggleField } from "../_components/toggle-field";
import { WebsiteRichTextEditor } from "../_components/rich-text-editor";
import {
  DesktopMobileToggle,
  type PreviewDevice,
} from "../_components/desktop-mobile-toggle";
import { BuilderCountedInput } from "../_components/builder-field";
import { FormActions } from "../_components/form-actions";
import { OutlineButton, PrimaryButton } from "@/components/ui/button";
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

interface Testimonial {
  id: string;
  customerName: string;
  eventName: string;
  feedback: string;
  photoUrl: string;
  status: boolean;
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
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${background}" />
          <stop offset="100%" stop-color="#111827" />
        </linearGradient>
      </defs>
      <rect width="160" height="160" rx="24" fill="url(#g)" />
      <circle cx="80" cy="64" r="30" fill="#ffffff" opacity="0.9" />
      <path d="M30 145c8-34 28-51 50-51s42 17 50 51" fill="#ffffff" opacity="0.9" />
      <text x="80" y="72" text-anchor="middle" font-family="Inter, Arial" font-size="22" font-weight="800" fill="#111827">${initials}</text>
    </svg>
  `)}`;
}

const initialTestimonials: Testimonial[] = [
  {
    id: "1",
    customerName: "Jessica Thompson",
    eventName: "Dream Wedding Celebration",
    feedback:
      "Eventify made our dream wedding a reality! Every detail was perfectly planned and executed. The team was professional, creative, and incredibly supportive throughout the entire journey. Our guests are still talking about how amazing everything was! Thank you for making our special day unforgettable.",
    photoUrl: avatarDataUrl("Jessica Thompson", "#f6b3a7"),
    status: true,
  },
  {
    id: "2",
    customerName: "David Miller",
    eventName: "Corporate Annual Gala",
    feedback:
      "Exceptional service and flawless execution! The team handled everything with professionalism and creativity. Highly recommended for any corporate event!",
    photoUrl: avatarDataUrl("David Miller", "#38bdf8"),
    status: true,
  },
  {
    id: "3",
    customerName: "Michael Brown",
    eventName: "Birthday Bash",
    feedback:
      "From the decor to the entertainment, everything was beyond our expectations. The attention to detail and customer care is unmatched. Will definitely work with Eventify again!",
    photoUrl: avatarDataUrl("Michael Brown", "#94a3b8"),
    status: true,
  },
];

function stripHtml(value: string) {
  return value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function RatingStars() {
  return (
    <div className="flex justify-center gap-0.5 text-amber-400">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star key={index} className="h-3.5 w-3.5 fill-current" />
      ))}
    </div>
  );
}

function TestimonialCard({
  testimonial,
  featured = false,
}: {
  testimonial: Testimonial;
  featured?: boolean;
}) {
  return (
    <article
      className={cn(
        "relative flex flex-col items-center rounded-[16px] bg-white px-6 py-6 text-center shadow-[0_16px_35px_rgba(15,23,42,0.08)]",
        featured ? "min-h-[300px] scale-105" : "min-h-[260px]",
      )}
    >
      <Quote className="h-8 w-8 fill-[var(--vendor-primary-btn)] text-[var(--vendor-primary-btn)]" />
      <img
        src={testimonial.photoUrl}
        alt={testimonial.customerName}
        className="mt-3 h-16 w-16 rounded-full object-cover"
      />
      <h3 className="mt-3 text-[13px] font-black text-[var(--vendor-text)]">
        {testimonial.customerName}
      </h3>
      <p className="mt-0.5 text-[11px] font-bold text-[var(--vendor-primary-btn)]">
        {testimonial.eventName}
      </p>
      <div className="mt-2">
        <RatingStars />
      </div>
      <p className="mt-3 line-clamp-7 text-[11px] font-semibold leading-5 text-[var(--vendor-text)]">
        {stripHtml(testimonial.feedback)}
      </p>
    </article>
  );
}

function TestimonialsPreview({
  testimonials,
  activeIndex,
  onActiveIndexChange,
}: {
  testimonials: Testimonial[];
  activeIndex: number;
  onActiveIndexChange: (index: number) => void;
}) {
  const visibleTestimonials = testimonials.filter((testimonial) => testimonial.status);
  const active = visibleTestimonials[activeIndex] ?? visibleTestimonials[0];
  const left = visibleTestimonials[(activeIndex - 1 + visibleTestimonials.length) % visibleTestimonials.length];
  const right = visibleTestimonials[(activeIndex + 1) % visibleTestimonials.length];
  const cards = visibleTestimonials.length > 1 ? [left, active, right] : visibleTestimonials;

  return (
    <div className="space-y-5">
      <div className="relative overflow-hidden rounded-[var(--vendor-radius-panel)] bg-[linear-gradient(135deg,#f4f0ff,#ffffff_48%,#f7f3ff)] px-10 py-8">
        <div className="text-center">
          <h2 className="text-[24px] font-black tracking-tight text-[var(--vendor-text)]">
            What Our Clients Say
          </h2>
          <p className="mt-2 text-[12px] font-medium text-[var(--vendor-text-muted)]">
            Real stories from real clients who celebrated with us.
          </p>
        </div>

        {visibleTestimonials.length ? (
          <div className="relative mt-8">
            <button
              type="button"
              onClick={() => onActiveIndexChange((activeIndex - 1 + visibleTestimonials.length) % visibleTestimonials.length)}
              className="absolute -left-5 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[var(--vendor-text)] shadow-sm"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="grid items-center gap-8 lg:grid-cols-3">
              {cards.map((testimonial, index) => (
                <TestimonialCard
                  key={`${testimonial.id}-${index}`}
                  testimonial={testimonial}
                  featured={testimonial.id === active?.id}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => onActiveIndexChange((activeIndex + 1) % visibleTestimonials.length)}
              className="absolute -right-5 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[var(--vendor-text)] shadow-sm"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        ) : (
          <div className="mt-8 rounded-[var(--vendor-radius-panel)] border border-dashed border-[var(--vendor-border)] bg-white/70 p-10 text-center">
            <p className="text-[14px] font-black text-[var(--vendor-text)]">No testimonials enabled</p>
            <p className="mt-1 text-[12px] text-[var(--vendor-text-muted)]">
              Enable at least one testimonial to show it in preview.
            </p>
          </div>
        )}

        <div className="mt-7 flex justify-center gap-2">
          {visibleTestimonials.map((testimonial, index) => (
            <button
              key={testimonial.id}
              type="button"
              onClick={() => onActiveIndexChange(index)}
              className={cn(
                "h-2.5 w-2.5 rounded-full transition-colors",
                index === activeIndex ? "bg-[var(--vendor-primary-btn)]" : "bg-slate-300",
              )}
            />
          ))}
        </div>
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
  onStatusChange,
}: {
  testimonials: Testimonial[];
  activeId?: string;
  onAdd: () => void;
  onEdit: (testimonial: Testimonial) => void;
  onDelete: (testimonial: Testimonial) => void;
  onStatusChange: (testimonial: Testimonial, status: boolean) => void;
}) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-[15px] font-black text-[var(--vendor-text)]">Testimonial Management</h2>
          <p className="mt-0.5 text-[12px] font-medium text-[var(--vendor-text-muted)]">
            Add, edit, or remove testimonials.
          </p>
        </div>
        <PrimaryButton type="button" size="sm" onClick={onAdd} className="h-9 gap-1.5 px-4 text-[12px]">
          <Plus className="h-4 w-4" />
          Add New Testimonial
        </PrimaryButton>
      </div>

      <div className="overflow-hidden rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)]">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-50">
              <TableHead className="h-9 w-9 px-3 py-2.5" />
              <TableHead className="h-9 w-12 px-3 py-2.5 text-[11px]">#</TableHead>
              <TableHead className="h-9 px-3 py-2.5 text-[11px]">Photo</TableHead>
              <TableHead className="h-9 px-3 py-2.5 text-[11px]">Name</TableHead>
              <TableHead className="h-9 px-3 py-2.5 text-[11px]">Event Name</TableHead>
              <TableHead className="h-9 px-3 py-2.5 text-[11px]">Status</TableHead>
              <TableHead className="h-9 px-3 py-2.5 text-right text-[11px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {testimonials.map((testimonial, index) => (
              <TableRow
                key={testimonial.id}
                className={cn(
                  "transition-colors",
                  activeId === testimonial.id
                    ? "bg-[var(--vendor-primary-btn)]/5 hover:bg-[var(--vendor-primary-btn)]/5"
                    : "hover:bg-slate-50",
                )}
              >
                <TableCell className="w-9 px-3 py-3 text-slate-400">
                  <GripVertical className="h-4 w-4 cursor-grab" />
                </TableCell>
                <TableCell className="w-12 px-3 py-3 text-[12px] font-semibold text-slate-600">
                  {index + 1}
                </TableCell>
                <TableCell className="px-3 py-3">
                  <img
                    src={testimonial.photoUrl}
                    alt={testimonial.customerName}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                </TableCell>
                <TableCell className="px-3 py-3 text-[12px] font-semibold text-slate-800">
                  {testimonial.customerName}
                </TableCell>
                <TableCell className="px-3 py-3 text-[12px] text-slate-600">
                  {testimonial.eventName}
                </TableCell>
                <TableCell className="px-3 py-3">
                  <Switch
                    checked={testimonial.status}
                    className="scale-90 data-[state=checked]:bg-emerald-500"
                    onCheckedChange={(checked) => onStatusChange(testimonial, checked)}
                  />
                </TableCell>
                <TableCell className="px-3 py-3 text-right">
                  <div className="inline-flex items-center gap-2">
                    <OutlineButton type="button" size="icon-sm" onClick={() => onEdit(testimonial)}>
                      <Edit2 className="h-3.5 w-3.5" />
                    </OutlineButton>
                    <OutlineButton
                      type="button"
                      size="icon-sm"
                      onClick={() => onDelete(testimonial)}
                      className="text-rose-500 hover:text-rose-600"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </OutlineButton>
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

export default function TestimonialsPage() {
  const [device, setDevice] = React.useState<PreviewDevice>("desktop");
  const [testimonials, setTestimonials] = React.useState<Testimonial[]>(initialTestimonials);
  const [editingId, setEditingId] = React.useState(initialTestimonials[0].id);
  const [activePreviewIndex, setActivePreviewIndex] = React.useState(0);
  const objectUrlsRef = React.useRef<string[]>([]);

  React.useEffect(() => {
    return () => {
      objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const editing = testimonials.find((testimonial) => testimonial.id === editingId) ?? testimonials[0];

  const updateEditing = (patch: Partial<Testimonial>) => {
    setTestimonials((current) =>
      current.map((testimonial) =>
        testimonial.id === editing.id ? { ...testimonial, ...patch } : testimonial,
      ),
    );
  };

  const handlePhotoSelect = (file: File) => {
    const imageUrl = URL.createObjectURL(file);
    objectUrlsRef.current.push(imageUrl);
    if (editing.photoUrl.startsWith("blob:")) URL.revokeObjectURL(editing.photoUrl);
    updateEditing({ photoUrl: imageUrl });
  };

  const handleAdd = () => {
    const next: Testimonial = {
      id: `${Date.now()}`,
      customerName: "New Customer",
      eventName: "Event Name",
      feedback: "Add customer feedback here.",
      photoUrl: avatarDataUrl("New Customer", "#a78bfa"),
      status: true,
    };

    setTestimonials((current) => [...current, next]);
    setEditingId(next.id);
  };

  const handleDelete = (testimonial: Testimonial) => {
    setTestimonials((current) => {
      const next = current.filter((item) => item.id !== testimonial.id);
      if (testimonial.id === editingId && next[0]) setEditingId(next[0].id);
      return next.length ? next : current;
    });
  };

  const form = (
    <div className="space-y-3">
      {/* Header */}
      <div>
        <h2 className="text-[13px] font-black text-[var(--vendor-text)]">Testimonial Information</h2>
        <p className="mt-0.5 text-[11px] text-[var(--vendor-text-muted)]">
          Add customer testimonial and feedback.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <BuilderCountedInput
          label="Customer Name"
          value={editing.customerName}
          onChange={(value) => updateEditing({ customerName: value })}
          maxLength={100}
        />
        <BuilderCountedInput
          label="Event Name"
          value={editing.eventName}
          onChange={(value) => updateEditing({ eventName: value })}
          maxLength={100}
        />
      </div>

      {/* Customer Photo - Side-by-side & Compact */}
      <div className="space-y-1">
        <p className="text-[10px] font-semibold text-[var(--vendor-text)]">Customer Photo</p>
        <div className="flex items-center gap-3">
          <img
            src={editing.photoUrl}
            alt={editing.customerName}
            className="h-[64px] w-[64px] rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] object-cover"
          />
          <ImageUpload
            key={`${editing.id}-${editing.photoUrl}`}
            value={null}
            title="Click to upload"
            browseText=""
            hint="JPG, PNG"
            recommendedSize=""
            size="sm"
            onFileSelect={handlePhotoSelect}
            className="space-y-0 h-[64px]"
            dropzoneClassName="h-[64px] p-1 w-[92px]"
          />
        </div>
      </div>

      <WebsiteRichTextEditor
        label="Feedback"
        value={editing.feedback}
        onChange={(value) => updateEditing({ feedback: value })}
        height="80px"
        showWordCount={false}
        showCharCount
        maxChars={1000}
      />

      <ToggleField
        label="Show/Hide Testimonial"
        description="Show testimonial on website"
        checked={editing.status}
        onCheckedChange={(status) => updateEditing({ status })}
        className="border-0 bg-transparent p-0 flex items-center justify-between h-8"
      />

      <div className="border-t border-[var(--vendor-border)] pt-3">
        <FormActions
          saveLabel="Update Testimonial"
          onCancel={() => setEditingId(initialTestimonials[0].id)}
          layout="default"
        />
      </div>
    </div>
  );

  const preview = (
    <div className="space-y-6">
      <TestimonialsPreview
        testimonials={testimonials}
        activeIndex={activePreviewIndex}
        onActiveIndexChange={setActivePreviewIndex}
      />
      <TestimonialManagementTable
        testimonials={testimonials}
        activeId={editing.id}
        onAdd={handleAdd}
        onEdit={(testimonial) => setEditingId(testimonial.id)}
        onDelete={handleDelete}
        onStatusChange={(testimonial, status) => {
          setTestimonials((current) =>
            current.map((item) =>
              item.id === testimonial.id ? { ...item, status } : item,
            ),
          );
        }}
      />
    </div>
  );

  return (
    <WebsiteBuilderLayout
      title="Testimonials"
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Testimonials", href: "/website/testimonials" },
        { label: "Add New Testimonial" },
      ]}
      form={form}
      preview={preview}
      previewTitle="Live Preview"
      previewSubtitle="This is how testimonials will appear on the website."
      previewActions={<DesktopMobileToggle value={device} onChange={setDevice} />}
      saveLabel="Save Testimonial"
      contentClassName="xl:grid-cols-[minmax(320px,32fr)_minmax(0,68fr)]"
    />
  );
}
