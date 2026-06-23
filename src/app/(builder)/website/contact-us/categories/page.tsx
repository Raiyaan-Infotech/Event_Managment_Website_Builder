"use client";

import * as React from "react";
import { Edit2, Search } from "lucide-react";
import { WebsiteBuilderLayout } from "../../_components/website-builder-layout";
import { FormSection } from "../../_components/form-section";
import {
  BuilderCountedInput,
  BuilderCountedTextarea,
} from "../../_components/builder-field";
import { ConfirmDeleteButton } from "../../_components/confirm-delete-button";
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
  useContactCategories,
  useCreateContactCategory,
  useDeleteContactCategory,
  useUpdateContactCategory,
} from "@/hooks/use-website-builder";
import { toSlug } from "../../gallery/_lib/gallery-categories";

// The "Other"/"Others" category is a permanent fallback for the contact form and
// must never be deletable.
function isOtherCategory(name: string) {
  return ["other", "others"].includes(name.trim().toLowerCase());
}

type CategoryStatus = "active" | "inactive";

type ContactCategory = {
  id: string;
  recordId: number | string;
  name: string;
  slug: string;
  description: string;
  order: number;
  status: CategoryStatus;
};

const emptyForm = {
  name: "",
  slug: "",
  description: "",
  status: "active" as CategoryStatus,
  order: 1,
};

function mapCategories(records: Array<Record<string, unknown>>): ContactCategory[] {
  return records
    .map((record, index) => {
      const status: CategoryStatus =
        record.is_active === false || record.is_active === 0
          ? "inactive"
          : "active";

      return {
        id: String(record.id ?? index + 1),
        recordId: String(record.id ?? index + 1),
        name: String(record.name || ""),
        slug: String(record.slug || toSlug(String(record.name || ""))),
        description: String(record.description || ""),
        order: Number(record.sort_order || index + 1),
        status,
      };
    })
    .sort((left, right) => left.order - right.order);
}

export default function ContactCategoriesPage() {
  const { data: categoryRecords = [] } = useContactCategories();
  const createCategory = useCreateContactCategory();
  const updateCategory = useUpdateContactCategory();
  const deleteCategory = useDeleteContactCategory();

  const [query, setQuery] = React.useState("");
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [form, setForm] = React.useState(emptyForm);
  const [isSaving, setIsSaving] = React.useState(false);

  const categories = React.useMemo(
    () => mapCategories(categoryRecords as Array<Record<string, unknown>>),
    [categoryRecords],
  );

  React.useEffect(() => {
    if (editingId) return;
    setForm((current) =>
      current.name || current.slug || current.description
        ? current
        : { ...emptyForm, order: categories.length + 1 },
    );
  }, [categories.length, editingId]);

  const filteredCategories = React.useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return categories;
    return categories.filter(
      (category) =>
        category.name.toLowerCase().includes(normalized) ||
        category.slug.toLowerCase().includes(normalized),
    );
  }, [categories, query]);

  const startAdd = () => {
    setEditingId(null);
    setForm({ ...emptyForm, order: categories.length + 1 });
  };

  const startEdit = (category: ContactCategory) => {
    setEditingId(category.id);
    setForm({
      name: category.name,
      slug: category.slug,
      description: category.description,
      status: category.status,
      order: category.order,
    });
  };

  const buildPayload = React.useCallback(
    () => ({
      name: form.name.trim(),
      slug: toSlug(form.slug || form.name),
      description: form.description.trim(),
      sort_order: form.order,
      is_active: form.status === "active",
    }),
    [form],
  );

  const saveCategory = async () => {
    if (!form.name.trim() || !toSlug(form.slug || form.name)) return;

    setIsSaving(true);
    try {
      if (editingId) {
        await updateCategory.mutateAsync({ id: editingId, payload: buildPayload() });
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

  const updateStatus = async (category: ContactCategory, active: boolean) => {
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
  };

  const formContent = (
    <div className="flex min-h-0 w-full flex-col gap-3">
      <FormSection
        title={editingId ? "Edit Category" : "Add New Category"}
        subtitle="Create the categories visitors can choose from in the dynamic contact form."
        className="w-full rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-white p-3 shadow-sm"
        contentClassName="grid gap-3 lg:grid-cols-2 xl:grid-cols-3"
      >
        <BuilderCountedInput
          label="Category Name"
          required
          value={form.name}
          onChange={(value) =>
            setForm((current) => ({ ...current, name: value, slug: toSlug(value) }))
          }
          maxLength={80}
          placeholder="e.g. Wedding Enquiry"
        />
        <BuilderCountedInput
          label="Slug"
          required
          value={form.slug}
          onChange={(value) =>
            setForm((current) => ({ ...current, slug: toSlug(value) }))
          }
          maxLength={80}
          placeholder="e.g. wedding-enquiry"
        />
        <BuilderCountedTextarea
          label="Description"
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
          <PrimaryButton type="button" onClick={saveCategory} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Category"}
          </PrimaryButton>
        </div>
      </FormSection>

      <FormSection
        title="Contact Categories"
        className="w-full rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-white p-3 shadow-sm"
        actions={
          <div className="relative hidden w-[240px] sm:block">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search categories..."
              className="h-8 !pl-8 text-[11px]"
            />
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

        <Table className="min-w-[680px] text-[11px]">
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-50">
              <TableHead className="w-[48px]">#</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Order</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCategories.length ? (
              filteredCategories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-bold">{category.order}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-bold text-slate-900">{category.name}</p>
                      {category.description ? (
                        <p className="mt-0.5 line-clamp-1 text-[10px] font-medium text-slate-500">
                          {category.description}
                        </p>
                      ) : null}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="rounded bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-500">
                      {category.slug}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={category.status === "active"}
                      onCheckedChange={(checked) => updateStatus(category, checked)}
                    />
                  </TableCell>
                  <TableCell className="font-semibold">{category.order}</TableCell>
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
                        className="text-rose-500 hover:text-rose-600 disabled:text-slate-300"
                        itemLabel={category.name}
                        onConfirm={() => handleDelete(category.id)}
                        disabled={isOtherCategory(category.name)}
                        title={
                          isOtherCategory(category.name)
                            ? 'The "Other" category cannot be deleted'
                            : undefined
                        }
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="py-8 text-center text-[11px] text-slate-500">
                  No contact categories found yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </FormSection>
    </div>
  );

  return (
    <WebsiteBuilderLayout
      title="Contact Categories"
      subtitle="Create categories used by the dynamic contact form."
      form={formContent}
      onReset={startAdd}
      onDelete={editingId ? () => handleDelete(editingId) : undefined}
      deleteDisabled={!editingId || isOtherCategory(form.name)}
      deleteItemLabel={form.name || "contact category"}
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
