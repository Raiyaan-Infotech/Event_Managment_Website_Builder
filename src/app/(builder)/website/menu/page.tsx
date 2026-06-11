"use client";

import * as React from "react";
import {
  Calendar,
  ChevronDown,
  Facebook,
  Home,
  Image as ImageIcon,
  Instagram,
  List,
  Mail,
  MessageSquareQuote,
  Phone,
  Plus,
  Sparkles,
  Users,
  Youtube,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { WebsiteBuilderLayout } from "../_components/website-builder-layout";
import { FormSection } from "../_components/form-section";
import { BuilderCountedInput } from "../_components/builder-field";
import { MultiSelectPages, type MultiSelectOption } from "../_components/multi-select-pages";
import { DraggableItemList, type DraggableItemListItem } from "../_components/draggable-item-list";
import { FormActions } from "../_components/form-actions";

const pageOptions: MultiSelectOption[] = [
  { label: "Home", value: "home" },
  { label: "About Us", value: "about-us" },
  { label: "Services", value: "services" },
  { label: "Events", value: "events" },
  { label: "Gallery", value: "gallery" },
  { label: "Testimonials", value: "testimonials" },
  { label: "Contact Us", value: "contact-us" },
];

const initialMenuItems: DraggableItemListItem[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "about-us", label: "About Us", icon: Users },
  { id: "services", label: "Services", icon: Calendar, rightContent: <ChevronDown className="h-4 w-4 text-slate-500" /> },
  { id: "events", label: "Events", icon: Calendar },
  { id: "gallery", label: "Gallery", icon: ImageIcon },
  { id: "testimonials", label: "Testimonials", icon: MessageSquareQuote },
  { id: "contact-us", label: "Contact Us", icon: Mail },
];

export default function WebsiteMenuPage() {
  const [menuHeading, setMenuHeading] = React.useState("Main Menu");
  const [selectedPages, setSelectedPages] = React.useState([
    "home",
    "about-us",
    "services",
    "events",
    "gallery",
    "testimonials",
    "contact-us",
  ]);
  const [menuItems, setMenuItems] = React.useState<DraggableItemListItem[]>(initialMenuItems);
  const [isSaving, setIsSaving] = React.useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 800);
  };

  const form = (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:h-full">

    {/* ── Column 1: Menu Settings ── */}
    <div className="flex flex-col gap-4 lg:overflow-y-auto">
      <FormSection
        title="Menu Settings"
        icon={<List className="h-[18px] w-[18px]" />}
        subtitle="Configure your website navigation menu."
        className="rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-[var(--vendor-panel-bg)] p-4 shadow-sm space-y-3"
      >
        <BuilderCountedInput
          label="Menu Heading"
          value={menuHeading}
          onChange={setMenuHeading}
          maxLength={60}
          className="space-y-0.5"
        />

        <p className="text-[10px] font-medium text-[var(--vendor-text-muted)]">
          This heading will be visible on your website.
        </p>

        <MultiSelectPages
          label="Select Pages"
          value={selectedPages}
          options={pageOptions}
          onChange={setSelectedPages}
          placeholder="Add page"
        />

        {/* Add Custom Link button */}
        <button
          type="button"
          className="flex h-10 w-full items-center justify-center gap-2 rounded-[var(--vendor-radius-control)] border border-dashed border-[var(--vendor-primary-btn)]/50 text-[12px] font-bold text-[var(--vendor-primary-btn)] hover:bg-[var(--vendor-primary-btn)]/5 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Custom Link
        </button>

        {/* Tip box */}
        <div className="flex items-start gap-2.5 rounded-[var(--vendor-radius-control)] bg-[hsl(228_64%_96%)] p-3">
          <Sparkles className="h-4 w-4 shrink-0 text-[#2457d6] mt-0.5" />
          <div>
            <p className="text-[11px] font-bold text-[#2457d6]">Tip</p>
            <p className="mt-0.5 text-[10px] font-medium text-[var(--vendor-text-muted)]">
              Add or remove pages from the list. Drag items on the right to reorder them.
            </p>
          </div>
        </div>
      </FormSection>
    </div>

    {/* ── Column 2: Menu Structure ── */}
    <div className="flex flex-col gap-4 lg:overflow-y-auto">
      <FormSection
        title="Menu Structure"
        icon={<Sparkles className="h-[18px] w-[18px]" />}
        subtitle="Drag and drop to reorder menu items."
        className="rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-[var(--vendor-panel-bg)] p-4 shadow-sm space-y-3"
      >
        <DraggableItemList
          items={menuItems}
          onDelete={(item) =>
            setMenuItems((current) => current.filter((row) => row.id !== item.id))
          }
        />
      </FormSection>
    </div>

  </div>
);

  return (
    <WebsiteBuilderLayout
      title="Menu Management"
      form={form}
      saveLabel="Save Changes"
      onSave={handleSave}
      isSaving={isSaving}
    />
  );
}