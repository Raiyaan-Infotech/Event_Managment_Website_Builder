"use client";

import * as React from "react";
import {
  Calendar,
  ChevronDown,
  FileText,
  GalleryHorizontal,
  Home,
  Link2,
  Mail,
  MessageSquareQuote,
  Plus,
  Users,
} from "lucide-react";
import { WebsiteBuilderLayout } from "../_components/website-builder-layout";
import { FormSection } from "../_components/form-section";
import { BuilderCountedInput } from "../_components/builder-field";
import { ImageUpload } from "../_components/image-upload";
import { ImageCropper } from "../_components/image-cropper-lazy";
import { ToggleField } from "../_components/toggle-field";
import { MultiSelectPages, type MultiSelectOption } from "../_components/multi-select-pages";
import {
  DraggableItemList,
  type DraggableItemListItem,
  type ChildMenuItem,
  type PageOption,
} from "../_components/draggable-item-list";
import {
  useSaveBasicInformation,
  useSaveMenuItems,
  useSaveVendorAbout,
  useVendorAbout,
  useWebsiteBuilderData,
  useWebsitePages,
} from "@/hooks/use-website-builder";
import { useToast } from "@/components/ui/toast";
import { fileToDataUrl, resolveMediaUrl } from "@/lib/utils";
import type { VendorAboutData } from "@/lib/website-builder-api";
import {
  MAINTENANCE_PAGE_SLUG,
  mergeWebsitePages,
  type WebsitePage,
} from "../pages/_lib/page-store";

const FIXED_NAV_ORDER = [
  "home",
  "about-us",
  "pages",
  "service",
  "events",
  "gallery",
  "contact-us",
];
const FIXED_NAV_VALUES = new Set(FIXED_NAV_ORDER);
const EXCLUDED_NAV_VALUES = new Set([
  "privacy-policy",
  "terms-conditions",
  MAINTENANCE_PAGE_SLUG,
]);
const NAV_LABEL_OVERRIDES: Record<string, string> = {
  service: "Service",
};

const STATIC_MENU_OPTIONS: Array<{
  label: string;
  value: string;
  icon: typeof Home;
  url: string;
  locked?: boolean;
  required?: boolean;
}> = [
  { label: "Home", value: "home", icon: Home, url: "/", locked: true, required: true },
  {
    label: "Pages",
    value: "pages",
    icon: FileText,
    url: "/pages",
    required: true,
  },
  {
    label: "Gallery",
    value: "gallery",
    icon: GalleryHorizontal,
    url: "/gallery",
    required: true,
  },
  {
    label: "Contact Us",
    value: "contact-us",
    icon: Mail,
    url: "/contact-us",
    required: true,
  },
];

const STATIC_MENU_OPTION_MAP = new Map(
  STATIC_MENU_OPTIONS.map((item) => [item.value, item]),
);
const STATIC_MENU_VALUES = new Set(STATIC_MENU_OPTIONS.map((item) => item.value));
const REQUIRED_STATIC_MENU_VALUES = new Set(
  STATIC_MENU_OPTIONS.filter((item) => item.required).map((item) => item.value),
);

function isRequiredMenuValue(value: string) {
  return FIXED_NAV_VALUES.has(value) || REQUIRED_STATIC_MENU_VALUES.has(value);
}

function getMenuItemUrl(value: string, fallback?: string) {
  const staticOption = STATIC_MENU_OPTION_MAP.get(value);
  if (staticOption) return staticOption.url;
  return fallback || `/${value}`;
}

function withMenuGuards(item: DraggableItemListItem): DraggableItemListItem {
  const id = String(item.id);
  const staticOption = STATIC_MENU_OPTION_MAP.get(id);
  const required = Boolean(item.required || staticOption?.required || isRequiredMenuValue(id));

  return {
    ...item,
    label: NAV_LABEL_OVERRIDES[id] || item.label || staticOption?.label || id,
    icon: item.icon || staticOption?.icon,
    locked: Boolean(item.locked || staticOption?.locked),
    required,
  };
}

function dedupeMenuItems(items: DraggableItemListItem[]) {
  const seen = new Set<string>();
  const unique: DraggableItemListItem[] = [];

  items.forEach((item) => {
    const id = String(item.id);
    if (!id || seen.has(id) || EXCLUDED_NAV_VALUES.has(id)) return;
    seen.add(id);
    unique.push(withMenuGuards(item));
  });

  return unique;
}

function normalizeMenuItems(
  items: DraggableItemListItem[],
  fallbackMap?: Map<string, DraggableItemListItem>,
) {
  const next = dedupeMenuItems(items);
  const ids = new Set(next.map((item) => String(item.id)));

  FIXED_NAV_ORDER.forEach((id) => {
    if (ids.has(id)) return;
    const fallback = fallbackMap?.get(id);
    const staticFallback = STATIC_MENU_OPTION_MAP.get(id);
    if (!fallback && !staticFallback) return;
    next.push(
      withMenuGuards(
        fallback || {
          id: staticFallback?.value || id,
          label: staticFallback?.label || id,
          icon: staticFallback?.icon,
          children: [],
        },
      ),
    );
    ids.add(id);
  });

  next.sort((left, right) => {
    const leftIndex = FIXED_NAV_ORDER.indexOf(String(left.id));
    const rightIndex = FIXED_NAV_ORDER.indexOf(String(right.id));
    if (leftIndex >= 0 && rightIndex >= 0) return leftIndex - rightIndex;
    if (leftIndex >= 0) return -1;
    if (rightIndex >= 0) return 1;
    return 0;
  });

  return next;
}

function ensureRequiredSelection(values: string[], menuItems: DraggableItemListItem[]) {
  const required = menuItems
    .filter((item) => item.required)
    .map((item) => String(item.id));

  return Array.from(new Set([...required, ...values]));
}

function filterMenuItemsBySelection(
  items: DraggableItemListItem[],
  selectedValues: string[],
  fallbackMap?: Map<string, DraggableItemListItem>,
) {
  const selectedSet = new Set(selectedValues);

  return normalizeMenuItems(
    items.filter((item) => {
      const id = String(item.id);
      if (EXCLUDED_NAV_VALUES.has(id)) return false;
      return item.required || selectedSet.has(id);
    }),
    fallbackMap,
  );
}

function syncMenuItemsWithSelection(
  currentItems: DraggableItemListItem[],
  selectedValues: string[],
  fallbackMap: Map<string, DraggableItemListItem>,
) {
  const selectedSet = new Set(selectedValues);
  const nextItems = currentItems.filter(
    (item) => {
      const id = String(item.id);
      if (EXCLUDED_NAV_VALUES.has(id)) return false;
      return item.required || selectedSet.has(id);
    },
  );
  const existingIds = new Set(nextItems.map((item) => String(item.id)));

  selectedValues.forEach((value) => {
    if (EXCLUDED_NAV_VALUES.has(value)) return;
    if (existingIds.has(value)) return;
    const fallback = fallbackMap.get(value);
    if (!fallback) return;
    nextItems.push(fallback);
    existingIds.add(value);
  });

  return filterMenuItemsBySelection(nextItems, selectedValues, fallbackMap);
}

function buildDefaultSelectedValues(
  menuItems: DraggableItemListItem[],
) {
  return ensureRequiredSelection(FIXED_NAV_ORDER, menuItems);
}

function normalizeSavedMenuId(item: Record<string, unknown>) {
  const rawUrl = String(item.url || "");
  const rawPageId = String(item.page_id || "");

  if (rawPageId) return rawPageId;
  if (rawUrl === "/" || rawUrl === "#home") return "home";
  if (rawUrl === "/gallery") return "gallery";
  if (rawUrl === "/contact" || rawUrl === "/contact-us") return "contact-us";
  return String(rawUrl || item.id || "").replace(/^\/+/, "");
}

function getPageIcon(page: WebsitePage) {
  const slug = page.slug.toLowerCase();
  if (slug === "about-us") return Users;
  if (slug === "service") return MessageSquareQuote;
  if (slug === "events") return Calendar;
  return FileText;
}

function buildMenuOptions(websitePages: WebsitePage[]) {
  const pageOptions = websitePages
    .filter((page) => !EXCLUDED_NAV_VALUES.has(page.slug))
    .map((page) => ({
      label: page.slug === "service" ? "Service" : page.title,
      value: page.slug,
      icon: getPageIcon(page),
    }));
  const pageOptionMap = new Map(pageOptions.map((item) => [item.value, item]));
  const staticOptionMap = new Map(STATIC_MENU_OPTIONS.map((item) => [item.value, item]));
  const fixedOptions = FIXED_NAV_ORDER.map(
    (value) => pageOptionMap.get(value) || staticOptionMap.get(value),
  ).filter(Boolean) as Array<{ label: string; value: string; icon: typeof Home }>;
  const fixedValueSet = new Set(fixedOptions.map((item) => item.value));
  const options = [
    ...fixedOptions,
    ...pageOptions.filter((item) => !fixedValueSet.has(item.value)),
  ];
  const seen = new Set<string>();

  return options.filter((item) => {
    if (seen.has(item.value)) return false;
    seen.add(item.value);
    return true;
  });
}

function buildInitialMenuItems(websitePages: WebsitePage[]) {
  return normalizeMenuItems(
    buildMenuOptions(websitePages).map((item) => ({
      id: item.value,
      label: item.label,
      icon: item.icon,
      rightContent:
        item.value === "service" ? (
          <ChevronDown className="h-4 w-4 text-slate-400" />
        ) : undefined,
      children: [],
    })) satisfies DraggableItemListItem[],
  );
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
      const childIsCustom = String(item.item_type || "") === "custom";
      // Page children: the backend coerces the slug `page_id` to null (INT
      // column) and keeps the slug in `url` as "/slug". Normalize it back to the
      // bare slug so it matches the page fallback map (otherwise "/about-us"
      // fails `fallbackMap.has(...)` and the child is dropped on refresh) and so
      // it round-trips correctly on the next save.
      const childLink = childIsCustom
        ? String(item.url || "")
        : normalizeSavedMenuId(item);
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
  const selectedPageIds: string[] = [];

  topLevel.forEach((item) => {
    const id = normalizeSavedMenuId(item);
    if (EXCLUDED_NAV_VALUES.has(id)) return;
    const isCustom = String(item.item_type || "") === "custom";
    const isKnownStatic = STATIC_MENU_VALUES.has(id);
    if (!isCustom && !isKnownStatic && !fallbackMap.has(id)) {
      return;
    }

    const fallback = fallbackMap.get(id);
    const guardedItem = withMenuGuards({
      id,
      label: String(item.label || fallback?.label || id),
      icon: fallback?.icon || Link2,
      description: item.item_type === "custom" ? String(item.url || "") : undefined,
      rightContent: fallback?.rightContent,
      children: childrenByParent.get(String(item.id)) || [],
    });
    menuItems.push(guardedItem);
    if (
      guardedItem.required ||
      !["0", "false", "no", "off"].includes(String(item.is_visible ?? true).toLowerCase())
    ) {
      selectedPageIds.push(String(guardedItem.id));
    }
  });

  const normalizedItems = normalizeMenuItems(menuItems, fallbackMap);

  return {
    menuItems: normalizedItems,
    selectedPages: ensureRequiredSelection(selectedPageIds, normalizedItems),
  };
}

function parseHeaderSettingsRecord(value: unknown) {
  if (!value) return {};

  try {
    const parsed = typeof value === "string" ? JSON.parse(value) : value;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return {};
    }
    return parsed as Record<string, unknown>;
  } catch {
    return {};
  }
}

function parseNavHeaderSettings(value: unknown) {
  const record = parseHeaderSettingsRecord(value);
  return {
    showLogin: Boolean(record.show_login ?? record.showLogin ?? true),
    showSignIn: Boolean(
      record.show_signin ??
        record.showSignIn ??
        record.show_sign_in ??
        record.showSignInButton ??
        true,
    ),
  };
}

export default function WebsiteMenuPage() {
  const { data: builderData } = useWebsiteBuilderData();
  const { data: vendorData } = useVendorAbout();
  const { data: pageRecords = [] } = useWebsitePages();
  const saveBasicInformation = useSaveBasicInformation();
  const saveMenuItems = useSaveMenuItems();
  const saveVendorAbout = useSaveVendorAbout();
  const { showToast } = useToast();
  const loadedFromApiRef = React.useRef(false);
  const initializedDefaultsRef = React.useRef(false);
  const loadedNavSettingsRef = React.useRef(false);

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
    () => buildDefaultSelectedValues(initialMenuItems),
    [initialMenuItems],
  );

  const [menuHeading, setMenuHeading] = React.useState("Nav Menu");
  const [companyName, setCompanyName] = React.useState("");
  const [companyLogo, setCompanyLogo] = React.useState("");
  const [city, setCity] = React.useState("");
  const [showLogin, setShowLogin] = React.useState(true);
  const [showSignIn, setShowSignIn] = React.useState(true);
  const [selectedPages, setSelectedPages] = React.useState<string[]>([]);
  const [menuItems, setMenuItems] = React.useState<DraggableItemListItem[]>([]);
  const [isSaving, setIsSaving] = React.useState(false);
  const [imageToCrop, setImageToCrop] = React.useState("");

  const applyVendorData = React.useCallback((vendor: VendorAboutData) => {
    setCompanyName(vendor.company_name || "");
    setCompanyLogo(vendor.company_logo || "");
    setCity(
      vendor.locality?.name ||
        vendor.district?.name ||
        vendor.city ||
        "",
    );
  }, []);

  React.useEffect(() => {
    if (vendorData) applyVendorData(vendorData);
  }, [applyVendorData, vendorData]);

  React.useEffect(() => {
    if (loadedNavSettingsRef.current || !builderData) return;
    const basicInformation = builderData.basicInformation as
      | Record<string, unknown>
      | null
      | undefined;
    const settings = parseNavHeaderSettings(
      basicInformation?.social_links_json,
    );
    setShowLogin(Boolean(basicInformation?.show_login ?? settings.showLogin));
    setShowSignIn(Boolean(basicInformation?.show_signin ?? settings.showSignIn));
    loadedNavSettingsRef.current = true;
  }, [builderData]);

  React.useEffect(() => {
    if (initializedDefaultsRef.current || loadedFromApiRef.current || initialMenuItems.length === 0) {
      return;
    }

    const normalizedItems = normalizeMenuItems(initialMenuItems, initialMenuItemMap);
    const normalizedSelection = ensureRequiredSelection(defaultSelectedPages, normalizedItems);
    setSelectedPages(normalizedSelection);
    setMenuItems(
      filterMenuItemsBySelection(normalizedItems, normalizedSelection, initialMenuItemMap),
    );
    initializedDefaultsRef.current = true;
  }, [defaultSelectedPages, initialMenuItemMap, initialMenuItems]);

  React.useEffect(() => {
    if (loadedFromApiRef.current || !builderData?.menuItems?.length) return;

    const resolved = applyMenuDataFromApi(
      builderData.menuItems as Array<Record<string, unknown>>,
      initialMenuItemMap,
    );
    const normalizedSelection = ensureRequiredSelection(
      resolved.selectedPages,
      resolved.menuItems,
    );
    setSelectedPages(normalizedSelection);
    setMenuItems(
      filterMenuItemsBySelection(
        resolved.menuItems,
        normalizedSelection,
        initialMenuItemMap,
      ),
    );
    loadedFromApiRef.current = true;
  }, [builderData, initialMenuItemMap]);

  const handleSave = async () => {
    setIsSaving(true);

    try {
      const items = menuItems.flatMap((item, index) => {
        const itemId = String(item.id);
        const isCustom = itemId.startsWith("custom-");
        const isStatic = STATIC_MENU_VALUES.has(itemId);

        const parentRow = {
          client_id: itemId,
          label: item.label,
          item_type: isCustom ? "custom" : "page",
          page_id: isCustom ? null : itemId,
          url: getMenuItemUrl(itemId, item.description),
          target: "self",
          sort_order: index + 1,
          is_visible: item.required || selectedPages.includes(itemId),
          is_active: true,
        };

        const childRows = (item.children || []).map((child, childIndex) => {
          const childPageId = child.link || child.iconKey || "";
          return {
            parent_client_id: itemId,
            label: child.label,
            item_type: "page",
            page_id: childPageId,
            url: childPageId.startsWith("http") ? childPageId : `/${childPageId}`,
            target: "self",
            sort_order: childIndex + 1,
            is_visible: true,
            is_active: true,
          };
        });

        return [parentRow, ...childRows];
      });

      await Promise.all([
        saveVendorAbout.mutateAsync({
          company_name: companyName.trim(),
          company_logo: companyLogo || null,
        }),
        saveBasicInformation.mutateAsync({
          show_login: showLogin,
          show_signin: showSignIn,
          social_links_json: {
            ...parseHeaderSettingsRecord(
              (builderData?.basicInformation as Record<string, unknown> | null | undefined)
                ?.social_links_json,
            ),
            show_login: showLogin,
            show_signin: showSignIn,
          },
          is_active: true,
        }),
        saveMenuItems.mutateAsync(items),
      ]);
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
    setMenuHeading("");
    setCompanyName("");
    setCompanyLogo("");
    setCity("");
    setShowLogin(false);
    setShowSignIn(false);
    setSelectedPages([]);
    setMenuItems([]);
    setImageToCrop("");
  };

  const handleSelectedPagesChange = (nextValues: string[]) => {
    const normalizedSelection = ensureRequiredSelection(nextValues, menuItems);
    setSelectedPages(normalizedSelection);
    setMenuItems((currentItems) =>
      syncMenuItemsWithSelection(
        currentItems,
        normalizedSelection,
        initialMenuItemMap,
      ),
    );
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

    setMenuItems((prev) => normalizeMenuItems([...prev, newItem], initialMenuItemMap));
    setSelectedPages((prev) => Array.from(new Set([...prev, String(newItem.id)])));
  };

  const handleLogoSelect = async (file: File) => {
    try {
      setImageToCrop(await fileToDataUrl(file));
    } catch {
      showToast("Unable to read logo image", "error");
    }
  };

  const handleLogoCropComplete = (croppedBase64: string) => {
    setCompanyLogo(croppedBase64);
    setImageToCrop("");
  };

  const form = (
    <div className="space-y-3">
      <FormSection
        title="Nav Menu Brand"
        subtitle="This logo, company name, and city will be used in the website navigation."
        className="rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-[var(--vendor-panel-bg)] p-4 shadow-sm"
      >
        <div className="grid gap-3 lg:grid-cols-[140px_minmax(0,1fr)]">
          <ImageUpload
            label="Company Logo"
            value={resolveMediaUrl(companyLogo)}
            recommendedSize="Wide logo ~ 420×120px (transparent PNG)"
            maxFileSize="2MB"
            maxSizeMb={2}
            onFileSelect={handleLogoSelect}
            onRemove={() => setCompanyLogo("")}
            alt="Company logo"
            previewClassName="h-16 object-contain bg-white p-2"
            uploadClassName="min-h-24"
          />

          <div className="grid content-start gap-3 sm:grid-cols-2">
            <BuilderCountedInput
              label="Company Name"
              value={companyName}
              onChange={setCompanyName}
              maxLength={100}
            />
            <ToggleField
              label="Login"
              description="Show or hide the Login button in the website navigation."
              checked={showLogin}
              onCheckedChange={setShowLogin}
            />
            <BuilderCountedInput
              label="City"
              value={city}
              onChange={setCity}
              maxLength={100}
              lockInput
            />
            <ToggleField
              label="Get Started"
              description="Show or hide the Get Started button in the website navigation."
              checked={showSignIn}
              onCheckedChange={setShowSignIn}
            />
          </div>
        </div>
      </FormSection>

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
          onChange={handleSelectedPagesChange}
          placeholder="Add page"
          lockedValues={menuItems.filter((item) => item.required).map((item) => String(item.id))}
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
          onReorder={(nextItems) => setMenuItems(normalizeMenuItems(nextItems, initialMenuItemMap))}
          onDelete={(item) =>
            {
              const itemId = String(item.id);
              setSelectedPages((currentValues) =>
                currentValues.filter((value) => value !== itemId),
              );
              setMenuItems((currentItems) =>
              normalizeMenuItems(
                currentItems.filter((row) => row.id !== item.id),
                initialMenuItemMap,
              ),
              );
            }
          }
          onAddChild={handleAddChild}
          onDeleteChild={handleDeleteChild}
        />

        <AddCustomLinkRow onAdd={handleAddCustomLink} />
      </FormSection>
      <ImageCropper
        open={Boolean(imageToCrop)}
        imageSrc={imageToCrop}
        onClose={() => setImageToCrop("")}
        onCropComplete={handleLogoCropComplete}
        aspectRatio={3.5}
        outputWidth={420}
        outputHeight={120}
        outputType="image/png"
        title="Crop Nav Logo"
      />
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
