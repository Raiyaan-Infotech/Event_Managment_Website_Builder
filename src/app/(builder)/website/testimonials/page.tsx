"use client";

import * as React from "react";
import {
  Edit2,
  GripVertical,
  Plus,
  Star,
  Trash2,
  Users,
  CheckCircle2,
} from "lucide-react";
import { WebsiteBuilderLayout } from "../_components/website-builder-layout";
import { FormSection } from "../_components/form-section";
import { ImageUpload } from "../_components/image-upload";
import { ToggleField } from "../_components/toggle-field";
import { WebsiteRichTextEditor } from "../_components/rich-text-editor";
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
import { TestimonialStatCard } from "@/components/builder/testimonial-stat-card";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Testimonial {
  id: string;
  customerName: string;
  eventName: string;
  feedback: string;
  photoUrl: string;
  status: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

// ─── Seed data ────────────────────────────────────────────────────────────────

const initialTestimonials: Testimonial[] = [
  {
    id: "1",
    customerName: "Jessica Thompson",
    eventName: "Dream Wedding Celebration",
    feedback:
      "Eventify made our dream wedding a reality! Every detail was perfectly planned and executed. The team was professional, creative, and incredibly supportive throughout the entire journey.",
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
      "From the decor to the entertainment, everything was beyond our expectations. The attention to detail and customer care is unmatched.",
    photoUrl: avatarDataUrl("Michael Brown", "#94a3b8"),
    status: false,
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

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
  const total = testimonials.length;
  const active = testimonials.filter((t) => t.status).length;

  return (
    <div className="space-y-2.5">
      {/* Table header row */}
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-[12px] font-black text-[var(--vendor-text)]">
            Testimonial Management
          </h2>
          <p className="text-[9px] font-medium text-[var(--vendor-text-muted)]">
            Add, edit, or remove testimonials.
          </p>
        </div>
        <PrimaryButton
          type="button"
          size="sm"
          onClick={onAdd}
          className="h-7 gap-1 px-2.5 text-[10px]"
        >
          <Plus className="h-3 w-3" />
          Add New
        </PrimaryButton>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)]">
        <Table className="min-w-[560px]">
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-50">
              <TableHead className="h-7 w-6 px-2 py-1.5" />
              <TableHead className="h-7 w-8 px-2 py-1.5 text-[10px]">#</TableHead>
              <TableHead className="h-7 px-2 py-1.5 text-[10px]">Photo</TableHead>
              <TableHead className="h-7 px-2 py-1.5 text-[10px]">Name</TableHead>
              <TableHead className="h-7 px-2 py-1.5 text-[10px]">Event</TableHead>
              <TableHead className="h-7 px-2 py-1.5 text-[10px]">Status</TableHead>
              <TableHead className="h-7 px-2 py-1.5 text-right text-[10px]">
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
                    : "hover:bg-slate-50",
                )}
              >
                <TableCell className="w-6 px-2 py-2 text-slate-400">
                  <GripVertical className="h-3.5 w-3.5 cursor-grab" />
                </TableCell>
                <TableCell className="w-8 px-2 py-2 text-[11px] font-semibold text-slate-500">
                  {index + 1}
                </TableCell>
                <TableCell className="px-2 py-2">
                  <img
                    src={t.photoUrl}
                    alt={t.customerName}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                </TableCell>
                <TableCell className="px-2 py-2 text-[11px] font-semibold text-slate-800">
                  {t.customerName}
                </TableCell>
                <TableCell className="px-2 py-2 text-[11px] text-slate-500">
                  {t.eventName}
                </TableCell>
                <TableCell className="px-2 py-2">
                  <Switch
                    checked={t.status}
                    className="scale-75 data-[state=checked]:bg-emerald-500"
                    onCheckedChange={(checked) => onStatusChange(t, checked)}
                  />
                </TableCell>
                <TableCell className="px-2 py-2 text-right">
                  <div className="inline-flex items-center gap-1.5">
                    <OutlineButton
                      type="button"
                      size="icon-sm"
                      onClick={() => onEdit(t)}
                      className="h-6 w-6"
                    >
                      <Edit2 className="h-3 w-3" />
                    </OutlineButton>
                    <OutlineButton
                      type="button"
                      size="icon-sm"
                      onClick={() => onDelete(t)}
                      className="h-6 w-6 text-rose-500 hover:text-rose-600"
                    >
                      <Trash2 className="h-3 w-3" />
                    </OutlineButton>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-3 gap-2">
        <TestimonialStatCard
          icon={Users}
          iconBg="#dbeafe"
          iconColor="#3b82f6"
          value={total}
          label="Total Testimonials"
        />
        <TestimonialStatCard
          icon={CheckCircle2}
          iconBg="#d1fae5"
          iconColor="#10b981"
          value={active}
          label="Active Testimonials"
        />
        <TestimonialStatCard
          icon={Star}
          iconBg="#fef3c7"
          iconColor="#f59e0b"
          value="4.9"
          label="Average Rating"
        />
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] =
    React.useState<Testimonial[]>(initialTestimonials);
  const [editingId, setEditingId] = React.useState(initialTestimonials[0].id);
  const objectUrlsRef = React.useRef<string[]>([]);

  const [isSaving, setIsSaving] = React.useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 800);
  };

  const handleCancel = () => {
    setTestimonials(initialTestimonials);
    setEditingId(initialTestimonials[0].id);
  };

  React.useEffect(() => {
    return () => {
      objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const editing =
    testimonials.find((t) => t.id === editingId) ?? testimonials[0];

  const updateEditing = (patch: Partial<Testimonial>) => {
    setTestimonials((curr) =>
      curr.map((t) => (t.id === editing.id ? { ...t, ...patch } : t)),
    );
  };

  const handlePhotoSelect = (file: File) => {
    const url = URL.createObjectURL(file);
    objectUrlsRef.current.push(url);
    if (editing.photoUrl.startsWith("blob:")) URL.revokeObjectURL(editing.photoUrl);
    updateEditing({ photoUrl: url });
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

  // ── Form ──────────────────────────────────────────────────────────────────

  const form = (
    <div className="space-y-3">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-start">

        {/* ── Left: Editor (col-span-5) ── */}
        <div className="lg:col-span-5">
          <FormSection
            title="Testimonial Details"
            subtitle="Add customer testimonial and feedback."
            className="rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-[var(--vendor-panel-bg)] p-3 shadow-sm space-y-2.5"
          >
            {/* Name + Event side-by-side */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <BuilderCountedInput
                label="Customer Name"
                required
                value={editing.customerName}
                onChange={(v) => updateEditing({ customerName: v })}
                maxLength={100}
              />
              <BuilderCountedInput
                label="Event Name"
                required
                value={editing.eventName}
                onChange={(v) => updateEditing({ eventName: v })}
                maxLength={100}
              />
            </div>

            {/* Photo: avatar preview + upload side-by-side */}
            <div className="space-y-1">
              <p className="text-[10px] font-semibold text-[var(--vendor-text)]">
                Customer Photo
              </p>
              <ImageUpload
                key={`${editing.id}-${editing.photoUrl}`}
                label="Customer Photo"
                value={editing.photoUrl}
                recommendedSize="200x200px"
                maxFileSize="2MB"
                onFileSelect={handlePhotoSelect}
                onRemove={() => updateEditing({ photoUrl: "/placeholder-avatar.png" })}
              />
            </div>

            {/* Rich text feedback */}
            <WebsiteRichTextEditor
              label="Feedback"
              value={editing.feedback}
              onChange={(v) => updateEditing({ feedback: v })}
              height="72px"
              showWordCount={false}
              showCharCount
              maxChars={1000}
            />

            {/* Show/Hide toggle */}
            <ToggleField
              label="Show/Hide Testimonial"
              description="Show this testimonial on website"
              checked={editing.status}
              onCheckedChange={(status) => updateEditing({ status })}
              className="border border-[var(--vendor-border)] bg-slate-50/60 p-2.5 rounded-[var(--vendor-radius-control)]"
            />

            {/* Actions */}
            {/* <div className="border-t border-[var(--vendor-border)] pt-2">
              <FormActions
                saveLabel="Update Testimonial"
                onCancel={() => setEditingId(initialTestimonials[0].id)}
                layout="default"
              />
            </div> */}
          </FormSection>
        </div>

        {/* ── Right: Table + Stats (col-span-7) ── */}
        <div className="lg:col-span-7">
          <FormSection
            title="Testimonials List"
            subtitle="Manage all customer testimonials."
            className="rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-[var(--vendor-panel-bg)] p-3 shadow-sm space-y-2.5"
          >
            <TestimonialManagementTable
              testimonials={testimonials}
              activeId={editing.id}
              onAdd={handleAdd}
              onEdit={(t) => setEditingId(t.id)}
              onDelete={handleDelete}
              onStatusChange={(t, status) =>
                setTestimonials((curr) =>
                  curr.map((item) =>
                    item.id === t.id ? { ...item, status } : item,
                  ),
                )
              }
            />
          </FormSection>
        </div>
      </div>

      {/* Bottom Actions */}
      {/* <FormActions
        saveLabel="Save Testimonials"
        onSave={handleSave}
        onCancel={handleCancel}
        isSaving={isSaving}
        layout="end"
      /> */}
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
    />
  );
}