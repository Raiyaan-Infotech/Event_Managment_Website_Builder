"use client";

import * as React from "react";
import {
  Calendar,
  ChevronDown,
  Facebook,
  Home,
  Image as ImageIcon,
  Instagram,
  Mail,
  MessageSquareQuote,
  Phone,
  Plus,
  Users,
  Youtube,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { WebsiteBuilderLayout } from "../_components/website-builder-layout";
import { FormSection } from "../_components/form-section";
import { BuilderCountedInput } from "../_components/builder-field";
import { MultiSelectPages, type MultiSelectOption } from "../_components/multi-select-pages";
import { DraggableItemList, type DraggableItemListItem } from "../_components/draggable-item-list";

interface MenuPreviewProps {
  menuItems: DraggableItemListItem[];
}

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

function DesktopMenuPreview({ menuItems }: MenuPreviewProps) {
  return (
    <div className="overflow-hidden rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-white shadow-sm">
      <div className="flex items-center justify-between bg-[#101010] px-6 py-3 text-xs font-semibold text-white">
        <div className="flex items-center gap-5">
          <span className="inline-flex items-center gap-2">
            <Phone className="h-3.5 w-3.5" />
            +91 98765 43210
          </span>
          <span className="h-4 w-px bg-white/30" />
          <span className="inline-flex items-center gap-2">
            <Mail className="h-3.5 w-3.5" />
            hello@royalmoments.com
          </span>
        </div>
        <div className="flex items-center gap-5">
          <Facebook className="h-4 w-4" />
          <Instagram className="h-4 w-4" />
          <Youtube className="h-4 w-4" />
        </div>
      </div>

      <div className="flex items-center justify-between px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-[var(--vendor-radius-control)] border border-amber-200 bg-amber-50 text-xl font-black text-amber-600">
            RM
          </div>
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-slate-950">Royal Moments</p>
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-slate-500">Events</p>
          </div>
        </div>

        <nav className="flex items-center gap-6 text-[13px] font-black text-slate-950">
          {menuItems.map((item, index) => (
            <span
              key={item.id}
              className={`inline-flex items-center gap-1 whitespace-nowrap ${
                index === 0 ? "border-b-2 border-[var(--vendor-primary-btn)] pb-2 text-[var(--vendor-primary-btn)]" : ""
              }`}
            >
              {item.label}
              {item.label === "Services" ? <ChevronDown className="h-3 w-3" /> : null}
            </span>
          ))}
          <Button className="h-10 px-5">Book Now</Button>
        </nav>
      </div>

      <section className="relative min-h-[360px] overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_18%,rgba(255,255,255,0.20),transparent_22%),linear-gradient(90deg,rgba(0,0,0,0.82),rgba(0,0,0,0.32)),linear-gradient(135deg,#301220,#7c2646_44%,#140a10)]" />
        <div className="relative flex min-h-[360px] items-center px-10 py-12 text-white">
          <div className="max-w-xl">
            <h2 className="text-5xl font-black leading-tight">
              Creating Unforgettable <span className="text-amber-400">Moments</span>
            </h2>
            <p className="mt-5 max-w-lg text-base font-medium leading-8 text-white/85">
              We create beautiful, memorable and perfect events that stay with you forever.
            </p>
            <div className="mt-8 flex gap-4">
              <Button className="h-11 px-7">Book Consultation</Button>
              <Button variant="outline" className="h-11 border-white/50 bg-transparent px-7 text-white hover:bg-white/10">
                Explore Events
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function MobileMenuPreview() {
  return (
    <div className="mx-auto mt-6 max-w-xl overflow-hidden rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-white shadow-lg">
      <div className="bg-[#101010] px-6 py-3 text-center text-xs font-semibold text-white">
        +91 98765 43210 <span className="mx-4 text-white/40">|</span> hello@royalmoments.com
        <div className="mt-2 flex justify-center gap-5">
          <Facebook className="h-4 w-4" />
          <Instagram className="h-4 w-4" />
          <Youtube className="h-4 w-4" />
        </div>
      </div>
      <div className="flex items-center justify-between px-7 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-[var(--vendor-radius-control)] border border-amber-200 bg-amber-50 text-lg font-black text-amber-600">
            RM
          </div>
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-slate-950">Royal Moments</p>
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-slate-500">Events</p>
          </div>
        </div>
        <span className="text-2xl font-black text-slate-950">☰</span>
      </div>
    </div>
  );
}

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

  const form = (
    <FormSection
      title="Menu Settings"
      className="rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-[var(--vendor-panel-bg)] p-4 shadow-sm"
    >
      <BuilderCountedInput
        label="Menu Heading"
        value={menuHeading}
        onChange={setMenuHeading}
        maxLength={60}
        className="max-w-[420px]"
      />
      <p className="text-[11px] font-medium text-slate-500">
        This is the menu heading visible on your website.
      </p>

      <MultiSelectPages
        label="Select Pages"
        value={selectedPages}
        options={pageOptions}
        onChange={setSelectedPages}
        placeholder="Add page"
        className="[&_label]:text-[10px] [&_label]:font-black [&_label]:uppercase [&_label]:tracking-wide [&_label]:text-slate-600"
      />

      <div className="space-y-2">
        <div>
          <h3 className="text-[13px] font-black text-[var(--vendor-text)]">Menu Structure</h3>
          <p className="mt-1 text-[12px] font-medium text-slate-500">
            Drag and drop to reorder menu items.
          </p>
        </div>
        <DraggableItemList
          items={menuItems}
          onDelete={(item) => setMenuItems((current) => current.filter((row) => row.id !== item.id))}
        />
      </div>

      <button
        type="button"
        className="flex h-11 w-full items-center justify-center gap-2 rounded-[var(--vendor-radius-control)] border border-dashed border-[var(--vendor-primary-btn)]/45 text-[13px] font-black text-[var(--vendor-primary-btn)] hover:bg-[var(--vendor-primary-btn)]/5"
      >
        <Plus className="h-4 w-4" />
        Add Custom Link
      </button>
    </FormSection>
  );

  return (
    <WebsiteBuilderLayout
      title="Menu Management"
      form={form}
      preview={
        <div>
          <div className="mb-3 flex items-center gap-2 text-[13px] font-black text-[var(--vendor-primary-btn)]">
            <Home className="h-4 w-4" />
            Desktop View
          </div>
          <DesktopMenuPreview menuItems={menuItems} />
          <div className="mt-6 border-t border-[var(--vendor-border)] pt-5">
            <div className="mb-3 flex items-center gap-2 text-[13px] font-black text-[var(--vendor-primary-btn)]">
              <Phone className="h-4 w-4" />
              Mobile View
            </div>
            <MobileMenuPreview />
          </div>
        </div>
      }
      previewTitle="Live Preview"
      previewSubtitle="This is how your menu will appear on your website."
      contentClassName="xl:grid-cols-[minmax(420px,0.42fr)_minmax(0,1fr)]"
    />
  );
}
