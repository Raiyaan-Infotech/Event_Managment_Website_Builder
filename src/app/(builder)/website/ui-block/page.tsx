"use client";

import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Eye,
  EyeOff,
  FileText,
  Folder,
  GalleryHorizontal,
  GripVertical,
  Info,
  List,
  Lock,
  Mail,
  Monitor,
  MoreVertical,
  Palette,
  RotateCcw,
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
  useSaveUiBlocks,
  useWebsiteBuilderData,
  useWebsitePages,
  websiteBuilderKeys,
} from "@/hooks/use-website-builder";
import {
  UI_BLOCK_REQUIRED_KEYS,
  coerceUiBlockVisible,
} from "../_lib/ui-block-visibility";
import {
  INITIAL_PAGES,
  mergeWebsitePages,
  type WebsitePage,
} from "../pages/_lib/page-store";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

type UiBlockFilter = "all" | "visible" | "hidden";

interface UiBlockItem {
  id: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  visible: boolean;
  locked: boolean;
  required: boolean;
}

const card =
  "rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-[var(--vendor-panel-bg)] shadow-sm";

const initialBlocks: UiBlockItem[] = [
  {
    id: "basic-information",
    label: "Header",
    description: "Website logo, company name, and header details.",
    icon: FileText,
    visible: true,
    locked: true,
    required: true,
  },
  {
    id: "nav-menu",
    label: "Nav Menu",
    description: "Website navigation menu settings.",
    icon: List,
    visible: true,
    locked: true,
    required: true,
  },
  {
    id: "ui-block",
    label: "Web UI Block",
    description: "Sidebar visibility and block ordering.",
    icon: Monitor,
    visible: true,
    locked: true,
    required: true,
  },
  {
    id: "seo",
    label: "SEO Settings",
    description: "Search engine metadata settings.",
    icon: Search,
    visible: false,
    locked: false,
    required: false,
  },
  {
    id: "footer",
    label: "Footer Settings",
    description: "Website footer configuration.",
    icon: Settings,
    visible: true,
    locked: true,
    required: true,
  },
  {
    id: "theme-color",
    label: "Theme Color",
    description: "Website theme color configuration.",
    icon: Palette,
    visible: true,
    locked: true,
    required: true,
  },
  {
    id: "pages",
    label: "Pages",
    description: "Create and manage website pages.",
    icon: FileText,
    visible: true,
    locked: false,
    required: true,
  },
  {
    id: "contact_us",
    label: "Contact Us",
    description: "Contact form builder module.",
    icon: Mail,
    visible: true,
    locked: false,
    required: true,
  },
  {
    id: "hero-section",
    label: "Hero Section",
    description: "Homepage hero section content.",
    icon: Monitor,
    visible: true,
    locked: false,
    required: true,
  },
  {
    id: "basic-slider",
    label: "Simple Slider",
    description: "Basic homepage slider.",
    icon: SlidersHorizontal,
    visible: false,
    locked: false,
    required: false,
  },
  {
    id: "advance-slider",
    label: "Advance Slider",
    description: "Advanced homepage slider.",
    icon: SlidersHorizontal,
    visible: true,
    locked: false,
    required: false,
  },
  {
    id: "gallery-images",
    label: "Gallery Images",
    description: "Gallery image management.",
    icon: GalleryHorizontal,
    visible: true,
    locked: false,
    required: true,
  },
  {
    id: "gallery-categories",
    label: "Gallery Categories",
    description: "Gallery category management.",
    icon: Folder,
    visible: true,
    locked: true,
    required: true,
  },
  {
    id: "testimonials",
    label: "Testimonials",
    description: "Customer testimonial management.",
    icon: Star,
    visible: true,
    locked: false,
    required: false,
  },
  {
    id: "basic-sponsors",
    label: "Sponsors",
    description: "Sponsor logo section.",
    icon: Users,
    visible: false,
    locked: false,
    required: false,
  },
  {
    id: "basic-clients",
    label: "Clients",
    description: "Client logo section.",
    icon: Users,
    visible: false,
    locked: false,
    required: false,
  },
];

function getBlockConfig(block: Record<string, unknown> | undefined) {
  const raw = block?.config_json;
  if (!raw) return {};
  if (typeof raw === "object") return raw as Record<string, unknown>;
  if (typeof raw !== "string") return {};

  try {
    return JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return {};
  }
}

function toPageBlock(page: WebsitePage): UiBlockItem {
  const id = `page:${page.slug}`;
  const isRequired = UI_BLOCK_REQUIRED_KEYS.has(id);
  return {
    id,
    label: page.title,
    description: page.isSystem ? "System page module." : "Custom page module.",
    icon: FileText,
    visible: true,
    locked: isRequired,
    required: isRequired,
  };
}

function dedupeBlocks(items: UiBlockItem[]) {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = String(item.id || "").trim();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function buildDefaultBlocks(pageBlocks: UiBlockItem[]) {
  const uniquePageBlocks = dedupeBlocks(pageBlocks);
  const pagesIndex = initialBlocks.findIndex((item) => item.id === "pages");
  if (pagesIndex < 0) return dedupeBlocks([...initialBlocks, ...uniquePageBlocks]);

  return dedupeBlocks([
    ...initialBlocks.slice(0, pagesIndex + 1),
    ...uniquePageBlocks,
    ...initialBlocks.slice(pagesIndex + 1),
  ]);
}

function buildUiBlockPayload(items: UiBlockItem[]) {
  return dedupeBlocks(items).map((block, index) => ({
    block_key: block.id,
    label: block.label,
    variant_key: "default",
    is_visible: block.required || UI_BLOCK_REQUIRED_KEYS.has(block.id) ? true : block.visible,
    sort_order: index + 1,
    config_json: {
      lockPosition: block.locked,
      requiredBlock: block.required || UI_BLOCK_REQUIRED_KEYS.has(block.id),
    },
    is_active: true,
  }));
}

function buildBlocksFromApi(
  uiBlocks: Array<Record<string, unknown>> | undefined,
  defaultBlocks: UiBlockItem[],
) {
  if (!uiBlocks?.length) {
    return defaultBlocks;
  }

  const defaultBlockMap = new Map(defaultBlocks.map((item) => [item.id, item]));
  const apiBlockMap = new Map(
    uiBlocks.map((block) => [String(block.block_key || block.id || ""), block]),
  );
  const ordered: UiBlockItem[] = [];

  uiBlocks.forEach((block) => {
    const key = String(block.block_key || block.id || "");
    if (!key) return;

    const fallback = defaultBlockMap.get(key);
    if (!fallback) return;

    const config = getBlockConfig(block);
    const savedLabel = String(block.label || "");
    const isRequired = Boolean(config.requiredBlock ?? fallback.required) ||
      UI_BLOCK_REQUIRED_KEYS.has(key);
    ordered.push({
      ...fallback,
      label:
        key === "basic-information" && savedLabel === "Basic Information"
          ? fallback.label
          : savedLabel || fallback.label,
      visible: isRequired ? true : coerceUiBlockVisible(block.is_visible, fallback.visible),
      // Position-lock is independent of "required": a block can be required
      // (always visible) yet still be reorderable (e.g. Hero, Gallery, Contact).
      locked: Boolean(config.lockPosition ?? fallback.locked),
      required: isRequired,
    });
  });

  const missing = defaultBlocks.filter((item) => !apiBlockMap.has(item.id));
  return dedupeBlocks([...ordered, ...missing]);
}

function enforceSingleActiveSlider(
  items: UiBlockItem[],
  changedId?: string,
) {
  const simpleId = "basic-slider";
  const advanceId = "advance-slider";
  const simple = items.find((item) => item.id === simpleId);
  const advance = items.find((item) => item.id === advanceId);

  if (!simple?.visible || !advance?.visible) {
    return items;
  }

  const keepId = changedId === simpleId ? simpleId : advanceId;
  const hideId = keepId === simpleId ? advanceId : simpleId;
  return items.map((item) =>
    item.id === hideId ? { ...item, visible: false } : item,
  );
}

function moveBlock(items: UiBlockItem[], fromIndex: number, toIndex: number) {
  if (fromIndex === toIndex) return items;
  const next = [...items];
  const moved = next[fromIndex];
  if (!moved || moved.locked) return items;

  next.splice(fromIndex, 1);
  next.splice(toIndex, 0, moved);
  return next;
}

export default function UiBlockPage() {
  const queryClient = useQueryClient();
  const { data: builderData } = useWebsiteBuilderData();
  const { data: pageRecords = [] } = useWebsitePages();
  const saveUiBlocks = useSaveUiBlocks();
  const { showToast } = useToast();
  const loadedFromApiRef = React.useRef(false);
  const dragIndex = React.useRef<number | null>(null);
  const [blocks, setBlocks] = React.useState<UiBlockItem[]>(initialBlocks);
  const [filter, setFilter] = React.useState<UiBlockFilter>("all");
  const [isSaving, setIsSaving] = React.useState(false);

  const websitePages = React.useMemo(
    () => (pageRecords.length > 0 ? mergeWebsitePages(pageRecords) : INITIAL_PAGES),
    [pageRecords],
  );
  const defaultBlocks = React.useMemo(
    () => buildDefaultBlocks(websitePages.map(toPageBlock)),
    [websitePages],
  );

  const visibleCount = blocks.filter((item) => item.visible).length;
  const hiddenCount = blocks.length - visibleCount;

  const filteredBlocks = React.useMemo(() => {
    if (filter === "visible") return blocks.filter((item) => item.visible);
    if (filter === "hidden") return blocks.filter((item) => !item.visible);
    return blocks;
  }, [blocks, filter]);

  const syncUiBlocksCache = React.useCallback(
    (nextBlocks: UiBlockItem[]) => {
      queryClient.setQueryData(
        websiteBuilderKeys.data,
        (current: Record<string, unknown> | undefined) => ({
          ...(current || {}),
          uiBlocks: buildUiBlockPayload(nextBlocks),
        }),
      );
    },
    [queryClient],
  );

  const updateBlocks = React.useCallback(
    (updater: (current: UiBlockItem[]) => UiBlockItem[]) => {
      setBlocks((current) => {
        const next = dedupeBlocks(updater(current));
        syncUiBlocksCache(next);
        return next;
      });
    },
    [syncUiBlocksCache],
  );

  React.useEffect(() => {
    if (loadedFromApiRef.current) return;

    const nextBlocks = buildBlocksFromApi(builderData?.uiBlocks, defaultBlocks);
    setBlocks(nextBlocks);
    loadedFromApiRef.current = true;
  }, [builderData, defaultBlocks]);

  React.useEffect(() => {
    if (!loadedFromApiRef.current) return;

    setBlocks((current) => {
      const defaultMap = new Map(defaultBlocks.map((item) => [item.id, item]));

      // Keep the CURRENT (possibly custom-dragged) order. Only drop blocks whose
      // underlying page no longer exists, and refresh icon/description/required
      // from the defaults. This must NOT re-sort to defaultBlocks order, or a
      // visibility toggle (which refreshes defaultBlocks via the cache) would
      // collapse the vendor's arranged order back to default.
      const merged = current
        .filter((item) => defaultMap.has(item.id))
        .map((item) => {
          const defaultBlock = defaultMap.get(item.id)!;
          return {
            ...defaultBlock,
            ...item,
            icon: defaultBlock.icon,
            description: defaultBlock.description,
            required: defaultBlock.required || item.required,
          };
        });

      // Insert any newly added blocks (e.g. a freshly created page) at their
      // default position relative to the blocks already kept.
      const result = [...merged];
      const seen = new Set(result.map((item) => item.id));
      defaultBlocks.forEach((defaultBlock, idx) => {
        if (seen.has(defaultBlock.id)) return;
        let insertAt = result.length;
        for (let i = idx - 1; i >= 0; i -= 1) {
          const pos = result.findIndex((b) => b.id === defaultBlocks[i].id);
          if (pos >= 0) {
            insertAt = pos + 1;
            break;
          }
        }
        result.splice(insertAt, 0, defaultBlock);
        seen.add(defaultBlock.id);
      });

      return dedupeBlocks(result);
    });
  }, [defaultBlocks]);

  const handleVisibilityChange = (id: string, visible: boolean) => {
    if (UI_BLOCK_REQUIRED_KEYS.has(id)) return;
    updateBlocks((current) =>
      enforceSingleActiveSlider(
        current.map((item) =>
          item.id === id ? { ...item, visible } : item,
        ),
        id,
      ),
    );
  };

  const handleDragStart = (index: number) => {
    if (filter !== "all" || blocks[index]?.locked) return;
    dragIndex.current = index;
  };

  const handleDrop = (targetIndex: number) => {
    if (filter !== "all" || dragIndex.current === null) {
      dragIndex.current = null;
      return;
    }

    const fromIndex = dragIndex.current;
    dragIndex.current = null;
    updateBlocks((current) => moveBlock(current, fromIndex, targetIndex));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveUiBlocks.mutateAsync(buildUiBlockPayload(blocks));
      showToast("UI blocks saved");
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Unable to save UI blocks",
        "error",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    const resetBlocks = buildBlocksFromApi(builderData?.uiBlocks, defaultBlocks);
    setBlocks(resetBlocks);
    syncUiBlocksCache(resetBlocks);
  };

  const handleResetDefaults = () => {
    const resetBlocks = dedupeBlocks(defaultBlocks);
    setBlocks(resetBlocks);
    setFilter("all");
    syncUiBlocksCache(resetBlocks);
    showToast("UI blocks reset to default order");
  };

  const filterButton = (value: UiBlockFilter, label: string, count: number) => (
    <button
      type="button"
      onClick={() => setFilter(value)}
      className={cn(
        "inline-flex h-8 items-center gap-2 rounded-[var(--vendor-radius-control)] border px-3 text-[11px] font-bold transition",
        filter === value
          ? "border-[var(--vendor-primary-btn)] bg-[var(--vendor-primary-btn)]/10 text-[var(--vendor-primary-btn)]"
          : "border-transparent bg-slate-50 text-[var(--vendor-text-muted)] hover:bg-slate-100",
      )}
    >
      {label}
      <span
        className={cn(
          "rounded-full px-1.5 py-0.5 text-[10px]",
          value === "visible"
            ? "bg-emerald-100 text-emerald-600"
            : value === "hidden"
              ? "bg-rose-100 text-rose-600"
              : "bg-[var(--vendor-primary-btn)]/10 text-[var(--vendor-primary-btn)]",
        )}
      >
        {count}
      </span>
    </button>
  );

  const form = (
    <div className="ui-block-page grid grid-cols-1 gap-3">
      <FormSection
        title="UI Blocks"
        subtitle="Manage the sections that appear in this builder sidebar."
        className={`${card} p-4`}
      >
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            {filterButton("all", "All Blocks", blocks.length)}
            {filterButton("visible", "Visible", visibleCount)}
            {filterButton("hidden", "Hidden", hiddenCount)}
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleResetDefaults}
            className="h-8 px-3 text-[11px]"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </Button>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[620px]">
            <div className="grid grid-cols-[minmax(260px,1fr)_150px_120px] gap-3 border-b border-[var(--vendor-border)] px-3 pb-2 text-[9px] font-black uppercase tracking-[0.08em] text-[var(--vendor-text-muted)]">
              <span>Block / Section</span>
              <span>Status</span>
              <span className="text-right">Actions</span>
            </div>

            <div className="divide-y divide-[var(--vendor-border)]">
              {filteredBlocks.map((item) => {
                const realIndex = blocks.findIndex((block) => block.id === item.id);
                const Icon = item.icon;
                const dragDisabled = filter !== "all" || item.locked;

                return (
                  <div
                    key={item.id}
                    draggable={!dragDisabled}
                    onDragStart={() => handleDragStart(realIndex)}
                    onDragOver={(event) => {
                      if (!dragDisabled) event.preventDefault();
                    }}
                    onDrop={() => handleDrop(realIndex)}
                    className={cn(
                      "grid cursor-pointer grid-cols-[minmax(260px,1fr)_150px_120px] items-center gap-3 px-3 py-2.5 transition",
                      "hover:bg-slate-50",
                    )}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <GripVertical
                        className={cn(
                          "h-4 w-4 shrink-0",
                          dragDisabled
                            ? "text-slate-300"
                            : "cursor-grab text-[var(--vendor-text-muted)]",
                        )}
                      />
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--vendor-radius-control)] bg-[var(--vendor-primary-btn)]/10 text-[var(--vendor-primary-btn)]">
                        <Icon className="h-4 w-4" />
                      </span>
                      <div className="min-w-0">
                        <div className="flex min-w-0 items-center gap-2">
                          <p className="truncate text-[12px] font-black text-[var(--vendor-text)]">
                            {item.label}
                          </p>
                          {item.required ? (
                            <span className="shrink-0 rounded-full bg-[var(--vendor-primary-btn)]/10 px-1.5 py-0.5 text-[9px] font-black text-[var(--vendor-primary-btn)]">
                              Required
                            </span>
                          ) : null}
                        </div>
                        <p className="truncate text-[10px] font-medium text-[var(--vendor-text-muted)]">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] font-semibold text-[var(--vendor-text-muted)]">
                      {item.visible ? (
                        <Eye className="h-3.5 w-3.5 text-[var(--vendor-primary-btn)]" />
                      ) : (
                        <EyeOff className="h-3.5 w-3.5 text-slate-400" />
                      )}
                      <span>{item.visible ? "Visible" : "Hidden"}</span>
                      <Switch
                        checked={item.visible}
                        disabled={item.required || UI_BLOCK_REQUIRED_KEYS.has(item.id)}
                        onCheckedChange={(visible) =>
                          handleVisibilityChange(item.id, visible)
                        }
                        className="ml-auto"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-2">
                      <Lock
                        className={cn(
                          "h-3.5 w-3.5",
                          item.locked
                            ? "text-[var(--vendor-primary-btn)]"
                            : "text-slate-300",
                        )}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-xs"
                        disabled
                        aria-label={`Open ${item.label} settings`}
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {filter !== "all" ? (
          <div className="mt-3 flex items-start gap-2 rounded-[var(--vendor-radius-panel)] bg-[var(--vendor-primary-btn)]/5 px-3 py-2 text-[11px] font-medium text-[var(--vendor-text-muted)]">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--vendor-primary-btn)]" />
            Switch to All Blocks to reorder the sidebar. Filtered views are for visibility review.
          </div>
        ) : null}
      </FormSection>
    </div>
  );

  return (
    <WebsiteBuilderLayout
      title="Web UI Block"
      form={form}
      onCancel={handleResetDefaults}
      leftClassName="border-0 bg-transparent p-0 shadow-none"
      primaryButton={{
        label: "Save Changes",
        onClick: handleSave,
        isLoading: isSaving,
      }}
    />
  );
}
