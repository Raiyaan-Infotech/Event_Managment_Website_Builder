import type {
  VendorWebsiteGalleryCategoryRecord,
  VendorWebsiteGalleryItemRecord,
} from "@/lib/website-builder-api";

export type GalleryCategoryStatus = "active" | "inactive";

export interface GalleryCategory {
  id: string;
  recordId: number;
  name: string;
  slug: string;
  description: string;
  images: number;
  status: GalleryCategoryStatus;
  order: number;
}

export function toSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function isActiveFlag(value: boolean | number | null | undefined) {
  return value === true || value === 1;
}

export function mapGalleryCategories(
  categories: VendorWebsiteGalleryCategoryRecord[] = [],
  galleryItems: VendorWebsiteGalleryItemRecord[] = [],
): GalleryCategory[] {
  const imageCounts = new Map<number, number>();
  galleryItems.forEach((item) => {
    if (!item.category_id) return;
    imageCounts.set(item.category_id, (imageCounts.get(item.category_id) || 0) + 1);
  });

  return [...categories]
    .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0) || a.id - b.id)
    .map((category, index) => ({
      id: String(category.id),
      recordId: category.id,
      name: category.name || "",
      slug: category.slug || toSlug(category.name || ""),
      description: category.description || "",
      images: imageCounts.get(category.id) || 0,
      status: isActiveFlag(category.is_active) ? "active" : "inactive",
      order: category.sort_order || index + 1,
    }));
}

export function buildGalleryFilterOptions(categories: GalleryCategory[]) {
  return categories
    .filter((category) => category.status === "active")
    .sort((a, b) => a.order - b.order)
    .map((category) => ({
      id: category.recordId,
      label: category.name,
      value: category.slug,
    }));
}

