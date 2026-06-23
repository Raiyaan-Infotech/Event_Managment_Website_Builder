"use client";

import * as React from "react";
import {
  Calendar,
  ChevronDown,
  FileText,
  Link2,
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
import {
  useSaveMenuItems,
  useWebsiteBuilderData,
  useWebsitePages,
} from "@/hooks/use-website-builder";
import { useToast } from "@/components/ui/toast";
import {
  mergeWebsitePages,
  type WebsitePage,
} from "../pages/_lib/page-store";

function getPageIcon(page: WebsitePage) {
  const slug = page.slug.toLowerCase();
  if (slug === "about-us") return Users;
  if (slug === "services") return MessageSquareQuote;
  if (slug === "events") return Calendar;
  return FileText;
}

function buildMenuOptions(websitePages: WebsitePage[]) {
  return websitePages.map((page) => ({
    label: page.title,
    value: page.slug,
    icon: getPageIcon(page),
  }));
}

function buildInitialMenuItems(websitePages: WebsitePage[]) {
  return buildMenuOptions(websitePages).map((item) => ({
    id: item.value,
    label: item.label,
    icon: item.icon,
    rightContent:
      item.value === "services" ? (
        <ChevronDown className="h-4 w-4 text-slate-400" />
      ) : undefined,
    children: [],
  })) satisfies DraggableItemListItem[];
}

function applyMenuDataFromApi(
  rawMenuItems: Array<Record<string, unknown>>,
  fallbackMap: Map<string, DraggableItemListItem>,
) {
  const topLevel = rawMenuItems.filter((item) => !item.parent_id);
  const childrenByParent = new Map<string, ChildMenuItem[]>();

  rawMenuItems
    .filter((item) => item.parent_id)
    .forEach((item) => {
      const childLink = String(item.page_id || item.url || "");
      const childIsCustom = String(item.item_type || "") === "custom";
      if (!childIsCustom && childLink && !fallbackMap.has(childLink)) {
        return;
      }

      const parentId = String(item.parent_id);
      const child: ChildMenuItem = {
        id: String(item.id || item.page_id || item.label),
        label: String(item.label || ""),
        link: childLink,
      };
      childrenByParent.set(parentId, [
        ...(childrenByParent.get(parentId) || []),
        child,
      ]);
    });

  const menuItems: DraggableItemListItem[] = [];

  topLevel.forEach((item) => {
    const id = String(item.page_id || item.url || item.id);
    const isCustom = String(item.item_type || "") === "custom";
    if (!isCustom && !fallbackMap.has(id)) {
      return;
    }

    const fallback = fallbackMap.get(id);
    menuItems.push({
      id,
      label: String(item.label || fallback?.label || id),
      icon: fallback?.icon || Link2,
      description: item.item_type === "custom" ? String(item.url || "") : undefined,
      rightContent: fallback?.rightContent,
      children: childrenByParent.get(String(item.id)) || [],
    });
  });

  return {
    menuItems,
    selectedPages: menuItems.map((item) => String(item.id)),
  };
}

export default function WebsiteMenuPage() {
  const { data: builderData } = useWebsiteBuilderData();
  const { data: pageRecords = [] } = useWebsitePages();
  const saveMenuItems = useSaveMenuItems();
  const { showToast } = useToast();
  const loadedFromApiRef = React.useRef(false);
  const initializedDefaultsRef = React.useRef(false);

  const websitePages = React.useMemo(() => mergeWebsitePages(pageRecords), [pageRecords]);
  const pageOptions = React.useMemo<MultiSelectOption[]>(
    () => buildMenuOptions(websitePages).map(({ label, value }) => ({ label, value })),
    [websitePages],
  );
  const childPageOptions = React.useMemo<PageOption[]>(
    () => buildMenuOptions(websitePages),
    [websitePages],
  );
  const initialMenuItems = React.useMemo(
    () => buildInitialMenuItems(websitePages),
    [websitePages],
  );
  const initialMenuItemMap = React.useMemo(
    () => new Map(initialMenuItems.map((item) => [String(item.id), item])),
    [initialMenuItems],
  );
  const defaultSelectedPages = React.useMemo(
    () => initialMenuItems.map((item) => String(item.id)),
    [initialMenuItems],
  );

  const [menuHeading, setMenuHeading] = React.useState("Nav Menu");
  const [selectedPages, setSelectedPages] = React.useState<string[]>([]);
  const [menuItems, setMenuItems] = React.useState<DraggableItemListItem[]>([]);
  const [isSaving, setIsSaving] = React.useState(false);

  React.useEffect(() => {
    if (initializedDefaultsRef.current || loadedFromApiRef.current || initialMenuItems.length === 0) {
      return;
    }

    setSelectedPages(defaultSelectedPages);
    setMenuItems(initialMenuItems);
    initializedDefaultsRef.current = true;
  }, [defaultSelectedPages, initialMenuItems]);

  React.useEffect(() => {
    if (loadedFromApiRef.current || !builderData?.menuItems?.length) return;

    const resolved = applyMenuDataFromApi(
      builderData.menuItems as Array<Record<string, unknown>>,
      initialMenuItemMap,
    );
    setMenuItems(resolved.menuItems);
    setSelectedPages(resolved.selectedPages);
    loadedFromApiRef.current = true;
  }, [builderData, initialMenuItemMap]);

  const handleSave = async () => {
    setIsSaving(true);

    try {
      const items = menuItems.flatMap((item, index) => {
        const itemId = String(item.id);
        const isCustom = itemId.startsWith("custom-");

        const parentRow = {
          client_id: itemId,
          label: item.label,
          item_type: isCustom ? "custom" : "page",
          page_id: isCustom ? null : itemId,
          url: isCustom ? item.description || "" : `/${itemId}`,
          target: "_self",
          sort_order: index + 1,
          is_visible: selectedPages.includes(itemId),
          is_active: true,
        };

        const childRows = (item.children || []).map((child, childIndex) => ({
          parent_client_id: itemId,
          label: child.label,
          item_type: "page",
          page_id: child.link,
          url: `/${child.link}`,
          target: "_self",
          sort_order: childIndex + 1,
          is_visible: true,
          is_active: true,
        }));

        return [parentRow, ...childRows];
      });

      await saveMenuItems.mutateAsync(items);
      showToast("Nav menu saved");
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Unable to save nav menu",
        "error",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setMenuHeading("Nav Menu");

    if (builderData?.menuItems?.length) {
      const resolved = applyMenuDataFromApi(
        builderData.menuItems as Array<Record<string, unknown>>,
        initialMenuItemMap,
      );
      setMenuItems(resolved.menuItems);
      setSelectedPages(resolved.selectedPages);
      return;
    }

    setSelectedPages(defaultSelectedPages);
    setMenuItems(initialMenuItems);
  };

  const handleAddChild = (parentId: string | number, child: ChildMenuItem) => {
    setMenuItems((prev) =>
      prev.map((item) =>
        item.id === parentId
          ? { ...item, children: [...(item.children ?? []), child] }
          : item,
      ),
    );
  };

  const handleDeleteChild = (parentId: string | number, childId: string) => {
    setMenuItems((prev) =>
      prev.map((item) =>
        item.id === parentId
          ? { ...item, children: (item.children ?? []).filter((child) => child.id !== childId) }
          : item,
      ),
    );
  };

  const handleAddCustomLink = (name: string, link: string) => {
    const newItem: DraggableItemListItem = {
      id: `custom-${Date.now()}`,
      label: name,
      icon: Link2,
      children: [],
      description: link || undefined,
    };

    setMenuItems((prev) => [...prev, newItem]);
  };

  const form = (
    <div className="space-y-3">
      <FormSection
        title="Nav Menu Settings"
        className="rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-[var(--vendor-panel-bg)] p-4 shadow-sm space-y-3"
      >
        <BuilderCountedInput
          label="Nav Menu Heading"
          value={menuHeading}
          onChange={setMenuHeading}
          maxLength={60}
          lockInput
        />

        <p className="text-[10px] font-medium text-[var(--vendor-text-muted)]">
          This list is now connected to the Pages module and updates from your saved pages.
        </p>

        <MultiSelectPages
          label="Select Pages"
          value={selectedPages}
          options={pageOptions}
          onChange={setSelectedPages}
          placeholder="Add page"
        />
      </FormSection>

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
            setMenuItems((currentItems) => currentItems.filter((row) => row.id !== item.id))
          }
          onAddChild={handleAddChild}
          onDeleteChild={handleDeleteChild}
        />

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

function AddCustomLinkRow({
  onAdd,
}: {
  onAdd: (name: string, link: string) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [link, setLink] = React.useState("");

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
        className="flex h-10 w-full items-center justify-center gap-2 rounded-[var(--vendor-radius-control)] border border-dashed border-[var(--vendor-primary-btn)]/50 text-[12px] font-bold text-[var(--vendor-primary-btn)] transition-colors hover:bg-[var(--vendor-primary-btn)]/5"
      >
        <Plus className="h-4 w-4" />
        Add Custom Link
      </button>
    );
  }

  return (
    <div className="space-y-2.5 rounded-[var(--vendor-radius-control)] border border-[var(--vendor-primary-btn)]/40 bg-[var(--vendor-primary-btn)]/5 p-3">
      <p className="text-[12px] font-bold text-[var(--vendor-primary-btn)]">
        New Custom Link
      </p>

      <div className="space-y-1.5">
        <label className="text-[11px] font-bold text-[var(--vendor-text-muted)]">
          Menu Name
        </label>
        <input
          type="text"
          placeholder="e.g. Blog, Portfolio..."
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="w-full rounded-[var(--vendor-radius-control)] border border-[var(--vendor-border)] bg-[var(--vendor-panel-bg)] px-3 py-2 text-[13px] text-[var(--vendor-text)] outline-none focus:border-[var(--vendor-primary-btn)]"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-[11px] font-bold text-[var(--vendor-text-muted)]">
          Link URL
        </label>
        <input
          type="text"
          placeholder="https://..."
          value={link}
          onChange={(event) => setLink(event.target.value)}
          className="w-full rounded-[var(--vendor-radius-control)] border border-[var(--vendor-border)] bg-[var(--vendor-panel-bg)] px-3 py-2 text-[13px] text-[var(--vendor-text)] outline-none focus:border-[var(--vendor-primary-btn)]"
        />
      </div>

      <div className="flex gap-2 pt-0.5">
        <button
          type="button"
          onClick={handleCancel}
          className="flex-1 rounded-[var(--vendor-radius-control)] border border-[var(--vendor-border)] py-1.5 text-[12px] font-semibold text-[var(--vendor-text-muted)] transition-colors hover:bg-[var(--vendor-border)]/30"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleAdd}
          className="flex-1 rounded-[var(--vendor-radius-control)] bg-[var(--vendor-primary-btn)] py-1.5 text-[12px] font-bold text-white transition-opacity hover:opacity-90"
        >
          Add
        </button>
      </div>
    </div>
  );
}
