"use client";

import * as React from "react";
import {
  FileText,
  GalleryHorizontal,
  Info,
  List,
  Monitor,
  Search,
  Settings,
  SlidersHorizontal,
  Star,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { WebsiteBuilderLayout } from "../_components/website-builder-layout";
import { FormSection } from "../_components/form-section";
import {
  DraggableItemList,
  type DraggableItemListItem,
} from "../_components/draggable-item-list";

interface UiBlockItem extends DraggableItemListItem {
  visible: boolean;
}

const card =
  "rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-[var(--vendor-panel-bg)] p-4 shadow-sm";

const initialBlocks: UiBlockItem[] = [
  { id: "nav-menu", label: "Nav Menu", icon: List, visible: true },
  { id: "hero-section", label: "Hero Section", icon: Monitor, visible: true },
  { id: "about-us", label: "About Us", icon: FileText, visible: true },
  { id: "advance-slider", label: "Advance Slider", icon: SlidersHorizontal, visible: true },
  { id: "gallery", label: "Gallery", icon: GalleryHorizontal, visible: true },
  { id: "testimonials", label: "Testimonials", icon: Star, visible: true },
  { id: "basic-slider", label: "Basic Slider", icon: SlidersHorizontal, visible: false },
  { id: "basic-sponsors", label: "Basic Sponsors", icon: Users, visible: false },
  { id: "basic-clients", label: "Basic Clients", icon: Users, visible: false },
  { id: "events", label: "Events", icon: FileText, visible: false },
  { id: "seo", label: "SEO", icon: Search, visible: false },
  { id: "footer", label: "Footer", icon: Settings, visible: true },
];

function toListItems(
  items: UiBlockItem[],
  onToggle: (id: string | number, visible: boolean) => void,
) {
  return items.map((item) => ({
    ...item,
    rightContent: (
      <Switch
        checked={item.visible}
        onCheckedChange={(visible) => onToggle(item.id, visible)}
        className="data-[state=checked]:bg-emerald-500"
      />
    ),
  }));
}

export default function UiBlockPage() {
  const [blocks, setBlocks] = React.useState<UiBlockItem[]>(initialBlocks);
  const [isSaving, setIsSaving] = React.useState(false);

  const shownBlocks = blocks.filter((item) => item.visible);
  const hiddenBlocks = blocks.filter((item) => !item.visible);

  const handleToggle = (id: string | number, visible: boolean) => {
    setBlocks((current) =>
      current.map((item) => (item.id === id ? { ...item, visible } : item)),
    );
  };

  const handleGroupReorder = (
    orderedItems: DraggableItemListItem[],
    visible: boolean,
  ) => {
    setBlocks((current) => {
      const orderedIds = orderedItems.map((item) => item.id);
      const ordered = orderedIds
        .map((id) => current.find((item) => item.id === id))
        .filter((item): item is UiBlockItem => Boolean(item));
      const untouched = current.filter((item) => item.visible !== visible);
      return visible ? [...ordered, ...untouched] : [...untouched, ...ordered];
    });
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 800);
  };

  const handleCancel = () => {
    setBlocks(initialBlocks);
  };

  const form = (
    <div className="ui-block-page space-y-3">
      <div className="ui-block-main-grid grid grid-cols-1 gap-3">
        <FormSection
          title="Menu Visibility"
          subtitle="Choose which menu items to show or hide on your website."
          className={`${card} space-y-4`}
        >
          <div className="ui-block-visibility-grid grid grid-cols-1 gap-3">
            <FormSection
              title="Show on Website"
              actions={
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-600">
                  {shownBlocks.length}
                </span>
              }
              className="rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-white p-3 shadow-none"
            >
              <DraggableItemList
                items={toListItems(shownBlocks, handleToggle)}
                onReorder={(items) => handleGroupReorder(items, true)}
                variant="flat"
                showAddChild={false}
              />
            </FormSection>

            <FormSection
              title="Hidden from Website"
              actions={
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-500">
                  {hiddenBlocks.length}
                </span>
              }
              className="rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-white p-3 shadow-none"
            >
              <DraggableItemList
                items={toListItems(hiddenBlocks, handleToggle)}
                onReorder={(items) => handleGroupReorder(items, false)}
                variant="flat"
                showAddChild={false}
              />
            </FormSection>
          </div>

          <div className="flex items-start gap-2 rounded-[var(--vendor-radius-panel)] bg-[var(--vendor-primary-btn)]/5 px-3 py-2 text-[11px] font-medium text-[var(--vendor-text-muted)]">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--vendor-primary-btn)]" />
            Hidden items will not appear in your website menu.
          </div>
        </FormSection>

        <FormSection
          title="Menu Order"
          subtitle="Drag and drop to reorder how the menu items appear on your website."
          className={`${card} space-y-4`}
        >
          <div className="ui-block-order-grid grid grid-cols-1 gap-3">
            <DraggableItemList
              items={blocks.map((item, index) => ({
                ...item,
                description: `${index + 1}`,
              }))}
              onReorder={(items) => {
                const orderedIds = items.map((item) => item.id);
                setBlocks((current) =>
                  orderedIds
                    .map((id) => current.find((item) => item.id === id))
                    .filter((item): item is UiBlockItem => Boolean(item)),
                );
              }}
              variant="flat"
              showAddChild={false}
            />

            <div className="ui-block-order-drop flex min-h-[260px] flex-col items-center justify-center rounded-[var(--vendor-radius-panel)] border border-dashed border-[var(--vendor-border)] bg-[var(--vendor-page-bg)] p-4 text-center">
              <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--vendor-primary-btn)]/10 text-[var(--vendor-primary-btn)]">
                <List className="h-5 w-5" />
              </span>
              <p className="text-[13px] font-black text-[var(--vendor-text)]">
                Drag & Drop
              </p>
              <p className="mt-1 text-[11px] font-medium leading-4 text-[var(--vendor-text-muted)]">
                Reorder the menu items as you want them to appear.
              </p>
            </div>
          </div>
        </FormSection>
      </div>
    </div>
  );

  return (
    <WebsiteBuilderLayout
      title="Web UI Block"
      form={form}
      onCancel={handleCancel}
      leftClassName="border-0 bg-transparent p-0 shadow-none"
      primaryButton={{
        label: "Save Changes",
        onClick: handleSave,
        isLoading: isSaving,
      }}
    />
  );
}
