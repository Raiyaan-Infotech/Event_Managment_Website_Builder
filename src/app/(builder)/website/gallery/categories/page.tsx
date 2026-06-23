"use client";

import * as React from "react";
import { Edit2, GripVertical, Search } from "lucide-react";
import { WebsiteBuilderLayout } from "../../_components/website-builder-layout";
import { FormSection } from "../../_components/form-section";
import {
  BuilderCountedInput,
  BuilderCountedTextarea,
} from "../../_components/builder-field";
import { Button, OutlineButton, PrimaryButton } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useCreateGalleryCategory,
  useDeleteGalleryCategory,
  useGalleryCategories,
  useGalleryItems,
  useUpdateGalleryCategory,
} from "@/hooks/use-website-builder";
import {
  mapGalleryCategories,
  toSlug,
  type GalleryCategory,
  type GalleryCategoryStatus,
} from "../_lib/gallery-categories";
import { ConfirmDeleteButton } from "../../_components/confirm-delete-button";

const emptyForm = {
  name: "",
  slug: "",
  description: "",
  status: "active" as GalleryCategoryStatus,
  order: 1,
};

export default function GalleryCategoriesPage() {
  const { data: categoryRecords = [] } = useGalleryCategories();
  const { data: galleryItems = [] } = useGalleryItems();
  const createCategory = useCreateGalleryCategory();
  const updateCategory = useUpdateGalleryCategory();
  const deleteCategory = useDeleteGalleryCategory();

  const [query, setQuery] = React.useState("");
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [form, setForm] = React.useState(emptyForm);
  const [isSaving, setIsSaving] = React.useState(false);
  const [orderedCategories, setOrderedCategories] = React.useState<GalleryCategory[]>([]);
  const dragItemIndex = React.useRef<number | null>(null);
  const dragOverItemIndex = React.useRef<number | null>(null);
  const [draggingIndex, setDraggingIndex] = React.useState<number | null>(null);
  const [overIndex, setOverIndex] = React.useState<number | null>(null);

  const categories = React.useMemo(
    () => mapGalleryCategories(categoryRecords, galleryItems),
    [categoryRecords, galleryItems],
  );

  React.useEffect(() => {
    setOrderedCategories(categories);
  }, [categories]);

  const filteredCategories = React.useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return orderedCategories;
    return orderedCategories.filter(
      (category) =>
        category.name.toLowerCase().includes(normalized) ||
        category.slug.toLowerCase().includes(normalized),
    );
  }, [orderedCategories, query]);

  const startAdd = React.useCallback(() => {
    setEditingId(null);
    setForm({
      ...emptyForm,
      order: Math.max(orderedCategories.length, 0) + 1,
    });
  }, [orderedCategories.length]);

  React.useEffect(() => {
    if (!orderedCategories.length || editingId !== null) return;
    setForm((current) =>
      current.name || current.slug || current.description
        ? current
        : { ...emptyForm, order: orderedCategories.length + 1 },
    );
  }, [orderedCategories.length, editingId]);

  const startEdit = (category: GalleryCategory) => {
    setEditingId(category.id);
    setForm({
      name: category.name,
      slug: category.slug,
      description: category.description,
      status: category.status,
      order: category.order,
    });
  };

  const buildPayload = React.useCallback(() => ({
    name: form.name.trim(),
    slug: toSlug(form.slug || form.name),
    description: form.description.trim(),
    sort_order: form.order,
    is_active: form.status === "active",
  }), [form]);

  const saveCategory = async () => {
    if (!form.name.trim() || !toSlug(form.slug || form.name)) return;

    setIsSaving(true);
    try {
      if (editingId) {
        await updateCategory.mutateAsync({
          id: editingId,
          payload: buildPayload(),
        });
      } else {
        const created = await createCategory.mutateAsync(buildPayload());
        setEditingId(String(created.id));
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteCategory.mutateAsync(id);
    if (editingId === id) startAdd();
  };

  const updateStatus = async (category: GalleryCategory, active: boolean) => {
    await updateCategory.mutateAsync({
      id: category.recordId,
      payload: {
        name: category.name,
        slug: category.slug,
        description: category.description,
        sort_order: category.order,
        is_active: active,
      },
    });
    if (editingId === category.id) {
      setForm((current) => ({
        ...current,
        status: active ? "active" : "inactive",
      }));
    }
  };

  const moveToOrder = async (category: GalleryCategory, nextOrderValue: string) => {
    const nextOrder = Math.max(1, Number(nextOrderValue) || 1);
    await updateCategory.mutateAsync({
      id: category.recordId,
      payload: {
        name: category.name,
        slug: category.slug,
        description: category.description,
        sort_order: nextOrder,
        is_active: category.status === "active",
      },
    });
    if (editingId === category.id) {
      setForm((current) => ({
        ...current,
        order: nextOrder,
      }));
    }
  };

  const resetDragState = () => {
    dragItemIndex.current = null;
    dragOverItemIndex.current = null;
    setDraggingIndex(null);
    setOverIndex(null);
  };

  const handleDragStart = (event: React.DragEvent, index: number) => {
    if (query.trim()) return;
    dragItemIndex.current = index;
    dragOverItemIndex.current = index;
    setDraggingIndex(index);
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", String(filteredCategories[index]?.id ?? index));
  };

  const handleDragEnter = (index: number) => {
    if (query.trim() || dragItemIndex.current === null) return;
    dragOverItemIndex.current = index;
    setOverIndex(index);
  };

  const handleReorder = async () => {
    if (
      query.trim() ||
      dragItemIndex.current === null ||
      dragOverItemIndex.current === null ||
      dragItemIndex.current === dragOverItemIndex.current
    ) {
      resetDragState();
      return;
    }

    const reordered = [...orderedCategories];
    const [moved] = reordered.splice(dragItemIndex.current, 1);
    reordered.splice(dragOverItemIndex.current, 0, moved);
    const normalized = reordered.map((item, index) => ({
      ...item,
      order: index + 1,
    }));

    setOrderedCategories(normalized);
    resetDragState();

    await Promise.all(
      normalized.map((item) =>
        updateCategory.mutateAsync({
          id: item.recordId,
          payload: {
            name: item.name,
            slug: item.slug,
            description: item.description,
            sort_order: item.order,
            is_active: item.status === "active",
          },
        }),
      ),
    );

    if (editingId) {
      const current = normalized.find((item) => item.id === editingId);
      if (current) {
        setForm((prev) => ({
          ...prev,
          order: current.order,
        }));
      }
    }
  };

  const formContent = (
    <div className="flex min-h-0 w-full flex-col gap-3">
      <FormSection
        title={editingId ? "Edit Category" : "Add New Category"}
        className="w-full rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-white p-3 shadow-sm"
        contentClassName="grid gap-3 lg:grid-cols-2 xl:grid-cols-3"
      >
        <BuilderCountedInput
          label="Category Name"
          required
          value={form.name}
          onChange={(value) =>
            setForm((current) => ({
              ...current,
              name: value,
              slug: toSlug(value),
            }))
          }
          maxLength={80}
          placeholder="e.g. Wedding"
        />
        <BuilderCountedInput
          label="Slug"
          required
          value={form.slug}
          onChange={(value) =>
            setForm((current) => ({ ...current, slug: toSlug(value) }))
          }
          maxLength={80}
          placeholder="e.g. wedding"
        />
        <BuilderCountedTextarea
          label="Description (Optional)"
          value={form.description}
          onChange={(value) =>
            setForm((current) => ({ ...current, description: value }))
          }
          maxLength={180}
          placeholder="Write a short description..."
          textareaClassName="min-h-[86px]"
        />
        <div className="space-y-1.5">
          <p className="text-[10px] font-semibold text-slate-600">Status</p>
          <div className="flex h-9 w-full items-center justify-between rounded-[var(--vendor-radius-control)] border border-[var(--vendor-border)] bg-white px-3 shadow-xs">
            <span className="text-[11px] font-bold capitalize text-slate-700">
              {form.status}
            </span>
            <Switch
              checked={form.status === "active"}
              onCheckedChange={(checked) =>
                setForm((current) => ({
                  ...current,
                  status: checked ? "active" : "inactive",
                }))
              }
            />
          </div>
        </div>
        <BuilderCountedInput
          label="Display Order"
          value={String(form.order)}
          onChange={(value) =>
            setForm((current) => ({
              ...current,
              order: Math.max(1, Number(value.replace(/\D/g, "")) || 1),
            }))
          }
          maxLength={3}
          showCount={false}
        />
        <div className="grid grid-cols-2 gap-2 pt-2 xl:self-end">
          <OutlineButton type="button" onClick={startAdd}>
            Cancel
          </OutlineButton>
          <PrimaryButton
            type="button"
            onClick={saveCategory}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save Category"}
          </PrimaryButton>
        </div>
      </FormSection>

      <FormSection
        title="Categories"
        className="w-full rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-white p-3 shadow-sm"
        actions={
          <div className="gallery-category-actions flex items-center gap-2">
            <div className="gallery-category-actions-search relative hidden w-[220px] sm:block">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search categories..."
                className="h-8 !pl-8 text-[11px]"
              />
            </div>
          </div>
        }
      >
        <div className="relative block sm:hidden">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search categories..."
            className="h-8 !pl-8 text-[11px]"
          />
        </div>

        <Table className="gallery-category-table min-w-[780px] text-[11px]">
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-50">
              <TableHead className="w-[40px]" />
              <TableHead className="w-[48px]">#</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Images</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Order</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCategories.length ? (
              filteredCategories.map((category, index) => (
                <TableRow
                  key={category.id}
                  className={
                    draggingIndex === index
                      ? "opacity-40"
                      : overIndex === index && draggingIndex !== index
                        ? "bg-[var(--vendor-primary-btn)]/10"
                        : undefined
                  }
                >
                  <TableCell>
                    <button
                      type="button"
                      draggable={!query.trim()}
                      onDragStart={(event) => handleDragStart(event, index)}
                      onDragEnter={() => handleDragEnter(index)}
                      onDragOver={(event) => {
                        if (query.trim()) return;
                        event.preventDefault();
                        event.dataTransfer.dropEffect = "move";
                      }}
                      onDrop={(event) => {
                        event.preventDefault();
                        void handleReorder();
                      }}
                      onDragEnd={resetDragState}
                      className={`flex ${
                        query.trim()
                          ? "cursor-not-allowed opacity-50"
                          : "cursor-grab text-slate-400 active:cursor-grabbing"
                      }`}
                    >
                      <GripVertical className="h-4 w-4 text-slate-400" />
                    </button>
                  </TableCell>
                  <TableCell className="font-bold">{category.order}</TableCell>
                  <TableCell>
                    <span className="font-bold text-slate-900">{category.name}</span>
                  </TableCell>
                  <TableCell>
                    <span className="rounded bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-500">
                      {category.slug}
                    </span>
                  </TableCell>
                  <TableCell className="font-semibold">{category.images}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-2">
                      <Switch
                        checked={category.status === "active"}
                        onCheckedChange={(checked) => updateStatus(category, checked)}
                      />
                    </span>
                  </TableCell>
                  <TableCell>
                    <select
                      value={category.order}
                      onChange={(event) => moveToOrder(category, event.target.value)}
                      className="h-8 rounded-[var(--vendor-radius-control)] border border-[var(--vendor-border)] bg-white px-2 text-[11px] font-bold outline-none focus:border-[var(--vendor-primary-btn)]"
                    >
                      {orderedCategories.map((_, index) => (
                        <option key={index + 1} value={index + 1}>
                          {index + 1}
                        </option>
                      ))}
                    </select>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1.5">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon-xs"
                        onClick={() => startEdit(category)}
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>
                      <ConfirmDeleteButton
                        className="text-rose-500 hover:text-rose-600"
                        itemLabel={category.name}
                        onConfirm={() => handleDelete(category.id)}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="py-8 text-center text-[11px] text-slate-500"
                >
                  No categories found yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <div className="flex items-center justify-between pt-2 text-[11px] font-medium text-slate-500">
          <span>
            Showing {filteredCategories.length} of {categories.length} categories
          </span>
          <span className="rounded-[var(--vendor-radius-control)] bg-[var(--vendor-primary-btn)] px-3 py-1.5 text-white">
            1
          </span>
        </div>
      </FormSection>
    </div>
  );

  return (
    <WebsiteBuilderLayout
      title=" Categories"
      subtitle="Create and manage categories that organize your gallery images."
      form={formContent}
      onReset={startAdd}
      onDelete={editingId ? () => handleDelete(editingId) : undefined}
      deleteDisabled={!editingId}
      deleteItemLabel={form.name || "gallery category"}
      primaryButton={{
        label: editingId ? "Update Category" : "Save Category",
        onClick: saveCategory,
        isLoading: isSaving,
        disabled: !form.name.trim() || !toSlug(form.slug || form.name),
      }}
      leftClassName="border-0 bg-transparent p-0 shadow-none"
    />
  );
}
