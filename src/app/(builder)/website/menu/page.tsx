"use client";

import * as React from "react";
import {
  Calendar,
  ChevronDown,
  Home,
  Image as ImageIcon,
  Mail,
  MessageSquareQuote,
  Plus,
  Users,
} from "lucide-react";
import { WebsiteBuilderLayout } from "../_components/website-builder-layout";
import { FormSection } from "../_components/form-section";
import { BuilderCountedInput } from "../_components/builder-field";
import { MultiSelectPages, type MultiSelectOption } from "../_components/multi-select-pages";
import {
  DraggableItemList,
  type DraggableItemListItem,
  type ChildMenuItem,
  type PageOption,
} from "../_components/draggable-item-list";

// ─── Static data ──────────────────────────────────────────────────────────────

const pageOptions: MultiSelectOption[] = [
  { label: "Home",         value: "home" },
  { label: "About Us",     value: "about-us" },
  { label: "Services",     value: "services" },
  { label: "Events",       value: "events" },
  { label: "Gallery",      value: "gallery" },
  { label: "Testimonials", value: "testimonials" },
  { label: "Contact Us",   value: "contact-us" },
];

// Pages available to choose from inside the "Add Child Menu" modal
const childPageOptions: PageOption[] = [
  { label: "Home",         value: "home",         icon: Home },
  { label: "About Us",     value: "about-us",     icon: Users },
  { label: "Services",     value: "services",     icon: Calendar },
  { label: "Events",       value: "events",       icon: Calendar },
  { label: "Gallery",      value: "gallery",      icon: ImageIcon },
  { label: "Testimonials", value: "testimonials", icon: MessageSquareQuote },
  { label: "Contact Us",   value: "contact-us",   icon: Mail },
];

const initialMenuItems: DraggableItemListItem[] = [
  { id: "home",         label: "Home",         icon: Home,               children: [] },
  { id: "about-us",     label: "About Us",     icon: Users,              children: [] },
  {
    id: "services",
    label: "Services",
    icon: Calendar,
    rightContent: <ChevronDown className="h-4 w-4 text-slate-400" />,
    children: [],
  },
  { id: "events",       label: "Events",       icon: Calendar,           children: [] },
  { id: "gallery",      label: "Gallery",      icon: ImageIcon,          children: [] },
  { id: "testimonials", label: "Testimonials", icon: MessageSquareQuote, children: [] },
  { id: "contact-us",   label: "Contact Us",   icon: Mail,               children: [] },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function WebsiteMenuPage() {
  const [menuHeading, setMenuHeading]     = React.useState("Main Menu");
  const [selectedPages, setSelectedPages] = React.useState([
    "home", "about-us", "services", "events", "gallery", "testimonials", "contact-us",
  ]);
  const [menuItems, setMenuItems] = React.useState<DraggableItemListItem[]>(initialMenuItems);
  const [isSaving, setIsSaving]   = React.useState(false);

  // ── custom-link modal state (bottom "Add Custom Link" button) ──
  const [showCustomModal, setShowCustomModal] = React.useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 800);
  };

  const handleCancel = () => {
    setMenuHeading("Main Menu");
    setSelectedPages(["home", "about-us", "services", "events", "gallery", "testimonials", "contact-us"]);
    setMenuItems(initialMenuItems);
  };

  // ── child operations ──
  const handleAddChild = (parentId: string | number, child: ChildMenuItem) => {
    setMenuItems((prev) =>
      prev.map((item) =>
        item.id === parentId
          ? { ...item, children: [...(item.children ?? []), child] }
          : item
      )
    );
  };

  const handleDeleteChild = (parentId: string | number, childId: string) => {
    setMenuItems((prev) =>
      prev.map((item) =>
        item.id === parentId
          ? { ...item, children: (item.children ?? []).filter((c) => c.id !== childId) }
          : item
      )
    );
  };

  // ── "Add Custom Link" bottom button → adds a new TOP-LEVEL item ──
  const handleAddCustomLink = (name: string, link: string) => {
    const newItem: DraggableItemListItem = {
      id: `custom-${Date.now()}`,
      label: name,
      children: [],
      description: link || undefined,
    };
    setMenuItems((prev) => [...prev, newItem]);
  };

  const form = (
    <div className="space-y-3">

      {/* ── Menu Settings ── */}
      <FormSection
        title="Nav Menu Settings"
        className="rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-[var(--vendor-panel-bg)] p-4 shadow-sm space-y-3"
      >
        <BuilderCountedInput
          label="Nav Menu Heading"
          value={menuHeading}
          onChange={setMenuHeading}
          maxLength={60}
        />

        <p className="text-[10px] font-medium text-[var(--vendor-text-muted)]">
          This is the nav menu heading visible on your website.
        </p>

        <MultiSelectPages
          label="Select Pages"
          value={selectedPages}
          options={pageOptions}
          onChange={setSelectedPages}
          placeholder="Add page"
        />
      </FormSection>

      {/* ── Menu Structure ── */}
      <FormSection
        title="Nav Menu Order"
        subtitle="Drag and drop to reorder • Click + on any item to add a child menu"
        className="rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-[var(--vendor-panel-bg)] p-4 shadow-sm space-y-3"
      >
        <DraggableItemList
          items={menuItems}
          pageOptions={childPageOptions}
          onReorder={setMenuItems}
          onDelete={(item) =>
            setMenuItems((curr) => curr.filter((r) => r.id !== item.id))
          }
          onAddChild={handleAddChild}
          onDeleteChild={handleDeleteChild}
        />

        {/* Add Custom Link — opens inline mini-form */}
        <AddCustomLinkRow onAdd={handleAddCustomLink} />
      </FormSection>

    </div>
  );

  return (
    <WebsiteBuilderLayout
      title="Nav Menu"
      form={form}
      onCancel={handleCancel}
      leftClassName="border-0 bg-transparent p-0 shadow-none"
      howItWorksLabel="How It Works"
      onHowItWorks={() =>
        alert("This is where you'd explain how to use the page editor.")
      }
      primaryButton={{
        label: "Save Changes",
        onClick: handleSave,
        isLoading: isSaving,
      }}
    />
  );
}

// ─── Inline "Add Custom Link" row ─────────────────────────────────────────────
// Expands in-place to ask for Name + URL, then collapses back on Add/Cancel.

function AddCustomLinkRow({
  onAdd,
}: {
  onAdd: (name: string, link: string) => void;
}) {
  const [open, setOpen]   = React.useState(false);
  const [name, setName]   = React.useState("");
  const [link, setLink]   = React.useState("");

  const handleAdd = () => {
    if (!name.trim()) return;
    onAdd(name.trim(), link.trim());
    setName("");
    setLink("");
    setOpen(false);
  };

  const handleCancel = () => {
    setName("");
    setLink("");
    setOpen(false);
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-10 w-full items-center justify-center gap-2 rounded-[var(--vendor-radius-control)] border border-dashed border-[var(--vendor-primary-btn)]/50 text-[12px] font-bold text-[var(--vendor-primary-btn)] hover:bg-[var(--vendor-primary-btn)]/5 transition-colors"
      >
        <Plus className="h-4 w-4" />
        Add Custom Link
      </button>
    );
  }

  return (
    <div className="rounded-[var(--vendor-radius-control)] border border-[var(--vendor-primary-btn)]/40 bg-[var(--vendor-primary-btn)]/5 p-3 space-y-2.5">
      <p className="text-[12px] font-bold text-[var(--vendor-primary-btn)]">
        New Custom Link
      </p>

      <div className="space-y-1.5">
        <label className="text-[11px] font-bold text-[var(--vendor-text-muted)]">
          Menu Name
        </label>
        <input
          type="text"
          placeholder="e.g. Blog, Portfolio…"
          value={name}
          onChange={(e) => setName(e.target.value)}
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
          value={link}
          onChange={(e) => setLink(e.target.value)}
          className="w-full rounded-[var(--vendor-radius-control)] border border-[var(--vendor-border)] bg-[var(--vendor-panel-bg)] px-3 py-2 text-[13px] text-[var(--vendor-text)] outline-none focus:border-[var(--vendor-primary-btn)]"
        />
      </div>

      <div className="flex gap-2 pt-0.5">
        <button
          type="button"
          onClick={handleCancel}
          className="flex-1 rounded-[var(--vendor-radius-control)] border border-[var(--vendor-border)] py-1.5 text-[12px] font-semibold text-[var(--vendor-text-muted)] hover:bg-[var(--vendor-border)]/30 transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleAdd}
          className="flex-1 rounded-[var(--vendor-radius-control)] bg-[var(--vendor-primary-btn)] py-1.5 text-[12px] font-bold text-white hover:opacity-90 transition-opacity"
        >
          Add
        </button>
      </div>
    </div>
  );
}