"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { WebsiteBuilderLayout } from "../../_components/website-builder-layout";
import { ImageUpload } from "../../_components/image-upload";
import { ImageCropper } from "../../_components/image-cropper-lazy";
import { BuilderCountedInput } from "../../_components/builder-field";
import { Button } from "@/components/ui/button";
import {
  DraggableItemList,
  type DraggableItemListItem,
} from "../../_components/draggable-item-list";
import { useToast } from "@/components/ui/toast";
import { resolveMediaUrl } from "@/lib/utils";
import {
  useCreateSponsor,
  useDeleteSponsor,
  useSponsors,
  useUpdateSponsor,
  useUploadVendorMedia,
} from "@/hooks/use-website-builder";
import type { VendorWebsiteSponsorRecord } from "@/lib/website-builder-api";

interface Sponsor {
  id: string;
  recordId?: number;
  name: string;
  logoUrl: string;
  rawLogoUrl: string | null;
  websiteUrl: string | null;
  sortOrder: number;
  status: boolean;
  logoFile?: File | null;
}

const card =
  "rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-[var(--vendor-panel-bg)] p-3 shadow-sm";

function mapRecordToSponsor(
  record: VendorWebsiteSponsorRecord,
  index: number,
): Sponsor {
  return {
    id: String(record.id),
    recordId: record.id,
    name: record.name || "Sponsor",
    logoUrl: record.logo_url ? resolveMediaUrl(record.logo_url) : "",
    rawLogoUrl: record.logo_url || null,
    websiteUrl: record.website_url || null,
    sortOrder: record.sort_order || index + 1,
    status: record.is_active === true || record.is_active === 1,
    logoFile: null,
  };
}

function SponsorsLivePreview({ sponsors }: { sponsors: Sponsor[] }) {
  const activeSponsors = sponsors.filter((sponsor) => sponsor.status && sponsor.logoUrl);

  return (
    <div className={`${card} space-y-3`}>
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
        <span className="text-[12px] font-semibold text-[var(--vendor-text)]">
          Live Preview
        </span>
        <span className="text-[11px] text-[var(--vendor-text-muted)]">
          This is how the sponsor wall will appear on the website.
        </span>
      </div>

      {activeSponsors.length > 0 ? (
        <div className="flex flex-wrap justify-center gap-3">
          {activeSponsors.map((sponsor) => (
            <div
              key={sponsor.id}
              className="flex h-[160px] w-[240px] shrink-0 items-center justify-center overflow-hidden rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-white"
            >
              <img
                src={sponsor.logoUrl}
                alt={sponsor.name}
                className="h-full w-full rounded-[var(--vendor-radius-panel)] object-cover object-center"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex h-[200px] items-center justify-center rounded-[var(--vendor-radius-panel)] border border-dashed border-[var(--vendor-border)] bg-slate-50">
          <p className="text-[11px] text-[var(--vendor-text-muted)]">
            No sponsors added yet.
          </p>
        </div>
      )}
    </div>
  );
}

export default function PortfolioSponsorsPage() {
  const { data: sponsorRecords = [] } = useSponsors();
  const createSponsor = useCreateSponsor();
  const updateSponsor = useUpdateSponsor();
  const deleteSponsor = useDeleteSponsor();
  const uploadVendorMedia = useUploadVendorMedia();
  const { showToast } = useToast();

  const [sponsors, setSponsors] = React.useState<Sponsor[]>([]);
  const [sponsorName, setSponsorName] = React.useState("");
  const [draftLogo, setDraftLogo] = React.useState<string | null>(null);
  const [draftLogoFile, setDraftLogoFile] = React.useState<File | null>(null);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [isSaving, setIsSaving] = React.useState(false);
  const objectUrlsRef = React.useRef<string[]>([]);

  const [cropperOpen, setCropperOpen] = React.useState(false);
  const [imageToCrop, setImageToCrop] = React.useState("");
  const [pendingCropFile, setPendingCropFile] = React.useState<File | null>(null);

  const revokeObjectUrl = (url?: string | null) => {
    if (url?.startsWith("blob:")) {
      URL.revokeObjectURL(url);
    }
  };

  const revokeAllObjectUrls = React.useCallback(() => {
    objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    objectUrlsRef.current = [];
  }, []);

  React.useEffect(() => {
    revokeAllObjectUrls();
    setDraftLogo(null);
    setDraftLogoFile(null);
    setSponsorName("");
    setEditingId(null);
    const mapped = [...sponsorRecords]
      .sort(
        (left, right) =>
          (left.sort_order ?? Number.MAX_SAFE_INTEGER) -
          (right.sort_order ?? Number.MAX_SAFE_INTEGER),
      )
      .map((record, index) => mapRecordToSponsor(record, index));
    setSponsors(mapped);
  }, [sponsorRecords, revokeAllObjectUrls]);

  React.useEffect(() => () => revokeAllObjectUrls(), [revokeAllObjectUrls]);

  const handleLogoSelect = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setPendingCropFile(file);
      setImageToCrop(String(reader.result || ""));
      setCropperOpen(true);
    };
    reader.onerror = () => {
      showToast("Unable to read the selected file", "error");
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = (croppedBase64: string) => {
    const sourceFile = pendingCropFile;
    if (!sourceFile) {
      setCropperOpen(false);
      setImageToCrop("");
      return;
    }

    fetch(croppedBase64)
      .then((response) => response.blob())
      .then((blob) => {
        const extension = sourceFile.name.includes(".")
          ? sourceFile.name.slice(sourceFile.name.lastIndexOf("."))
          : ".jpg";
        const croppedFile = new File(
          [blob],
          `${sourceFile.name.replace(/\.[^.]+$/, "")}-cropped${extension}`,
          { type: blob.type || sourceFile.type || "image/jpeg" },
        );

        if (draftLogo) {
          revokeObjectUrl(draftLogo);
          objectUrlsRef.current = objectUrlsRef.current.filter((url) => url !== draftLogo);
        }

        setDraftLogo(croppedBase64);
        setDraftLogoFile(croppedFile);
        setPendingCropFile(null);
        setImageToCrop("");
        setCropperOpen(false);
      });
  };

  const resetForm = () => {
    setEditingId(null);
    setSponsorName("");
    setDraftLogo(null);
    setDraftLogoFile(null);
  };

  const handleEdit = (id: string) => {
    const target = sponsors.find((item) => item.id === id);
    if (!target) return;
    setEditingId(id);
    setSponsorName(target.name);
    setDraftLogo(target.logoUrl || null);
    setDraftLogoFile(null);
  };

  const addOrUpdateSponsor = () => {
    const name = sponsorName.trim();
    if (!name || !draftLogo) return;

    if (editingId) {
      setSponsors((current) =>
        current.map((item) =>
          item.id === editingId
            ? {
                ...item,
                name,
                logoUrl: draftLogo,
                // keep the existing logo unless a new one was cropped this edit
                logoFile: draftLogoFile ?? item.logoFile ?? null,
                rawLogoUrl: draftLogoFile ? null : item.rawLogoUrl,
              }
            : item,
        ),
      );
      resetForm();
      return;
    }

    setSponsors((current) => [
      ...current,
      {
        id: `draft-${Date.now()}`,
        name,
        logoUrl: draftLogo,
        rawLogoUrl: null,
        websiteUrl: null,
        sortOrder: current.length + 1,
        status: true,
        logoFile: draftLogoFile,
      },
    ]);

    resetForm();
  };

  const removeSponsor = (id: string) => {
    if (id === editingId) resetForm();
    setSponsors((current) => {
      const target = current.find((item) => item.id === id);
      revokeObjectUrl(target?.logoUrl);
      objectUrlsRef.current = objectUrlsRef.current.filter((url) => url !== target?.logoUrl);

      return current
        .filter((item) => item.id !== id)
        .map((item, index) => ({ ...item, sortOrder: index + 1 }));
    });
  };

  const handleReorder = (reordered: DraggableItemListItem[]) => {
    setSponsors(
      reordered
        .map((item) => sponsors.find((sponsor) => sponsor.id === item.id))
        .filter((item): item is Sponsor => Boolean(item))
        .map((item, index) => ({
          ...item,
          sortOrder: index + 1,
        })),
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const persistedIds = new Set(
        sponsorRecords.map((record) => String(record.id)),
      );
      const currentPersistedIds = new Set(
        sponsors.filter((item) => item.recordId).map((item) => String(item.recordId)),
      );

      const removedRecords = sponsorRecords.filter(
        (record) => !currentPersistedIds.has(String(record.id)),
      );
      await Promise.all(removedRecords.map((record) => deleteSponsor.mutateAsync(record.id)));

      for (const [index, sponsor] of sponsors.entries()) {
        let nextRawLogoUrl = sponsor.rawLogoUrl;
        let nextLogoUrl = sponsor.logoUrl;

        if (sponsor.logoFile) {
          const uploaded = await uploadVendorMedia.mutateAsync({
            file: sponsor.logoFile,
            folder: "sponsors",
          });
          nextRawLogoUrl = uploaded.url;
          nextLogoUrl = resolveMediaUrl(uploaded.url);
        }

        const payload = {
          name: sponsor.name.trim(),
          logo_url: nextRawLogoUrl,
          website_url: sponsor.websiteUrl,
          sort_order: index + 1,
          is_active: sponsor.status,
        };

        if (sponsor.recordId && persistedIds.has(String(sponsor.recordId))) {
          await updateSponsor.mutateAsync({
            id: sponsor.recordId,
            payload,
          });
        } else {
          await createSponsor.mutateAsync(payload);
        }

        if (sponsor.logoFile) {
          revokeObjectUrl(sponsor.logoUrl);
        }

        setSponsors((current) =>
          current.map((item) =>
            item.id === sponsor.id
              ? {
                  ...item,
                  logoUrl: nextLogoUrl,
                  rawLogoUrl: nextRawLogoUrl,
                  logoFile: null,
                }
              : item,
          ),
        );
      }

      objectUrlsRef.current = objectUrlsRef.current.filter(
        (url) => !sponsors.some((sponsor) => sponsor.logoUrl === url && !sponsor.logoFile),
      );
      showToast("Sponsors saved");
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Unable to save sponsors",
        "error",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    revokeAllObjectUrls();
    setDraftLogo(null);
    setDraftLogoFile(null);
    setSponsorName("");
    setEditingId(null);
    const mapped = [...sponsorRecords]
      .sort(
        (left, right) =>
          (left.sort_order ?? Number.MAX_SAFE_INTEGER) -
          (right.sort_order ?? Number.MAX_SAFE_INTEGER),
      )
      .map((record, index) => mapRecordToSponsor(record, index));
    setSponsors(mapped);
  };

  const sponsorItems: DraggableItemListItem[] = sponsors.map((sponsor) => ({
    id: sponsor.id,
    label: sponsor.name,
  }));

  const form = (
    <div className="grid grid-cols-1 items-start gap-3 lg:grid-cols-[300px_1fr]">
      <div className={`${card} space-y-3`}>
        <div>
          <p className="text-[13px] font-black text-[var(--vendor-text)]">
            Add New Sponsor
          </p>
        </div>

        <BuilderCountedInput
          label="Sponsor Name"
          value={sponsorName}
          onChange={setSponsorName}
          maxLength={100}
          placeholder="Enter sponsor name"
          className="space-y-0.5"
        />

        <div className="space-y-0.5">
          <p className="text-[11px] font-medium text-[var(--vendor-text)]">
            Upload Logo
          </p>
          <ImageUpload
            key={draftLogo ?? "empty"}
            value={draftLogo ?? undefined}
            label="Sponsor Logo"
            recommendedSize="600x400px"
            maxFileSize="2MB"
            maxSizeMb={2}
            onFileSelect={handleLogoSelect}
            onRemove={() => {
              if (draftLogo) {
                revokeObjectUrl(draftLogo);
                objectUrlsRef.current = objectUrlsRef.current.filter(
                  (url) => url !== draftLogo,
                );
              }
              setDraftLogo(null);
              setDraftLogoFile(null);
            }}
          />
        </div>

        <Button
          type="button"
          onClick={addOrUpdateSponsor}
          disabled={!sponsorName.trim() || !draftLogo}
          className="w-full justify-center gap-1.5"
        >
          <Plus className="h-3.5 w-3.5" />
          {editingId ? "Update Sponsor" : "Add Sponsor"}
        </Button>
        {editingId ? (
          <button
            type="button"
            onClick={resetForm}
            className="w-full text-center text-[11px] font-semibold text-[var(--vendor-text-muted)] hover:text-[var(--vendor-text)]"
          >
            Cancel edit
          </button>
        ) : null}

        <div className="border-t border-[var(--vendor-border)] pt-2">
          <p className="mb-2 text-[12px] font-black text-[var(--vendor-text)]">
            Added Sponsors ({sponsors.length})
          </p>

          <DraggableItemList
            showAddChild={false}
            items={sponsorItems}
            variant="flat"
            onReorder={handleReorder}
            onEdit={(item) => handleEdit(String(item.id))}
            onDelete={(item) => removeSponsor(String(item.id))}
            emptyText="No sponsors added yet."
          />

          <p className="pt-2 text-[10px] text-[var(--vendor-text-muted)]">
            You can upload up to 30 sponsors.
          </p>
        </div>
      </div>

      <SponsorsLivePreview sponsors={sponsors} />
    </div>
  );

  return (
    <>
      <WebsiteBuilderLayout
        title="Portfolio - Sponsors"
        form={form}
        onCancel={handleCancel}
        onDelete={
          editingId
            ? async () => {
                const target = sponsors.find((sponsor) => sponsor.id === editingId);
                if (target?.recordId) await deleteSponsor.mutateAsync(target.recordId);
                removeSponsor(editingId);
              }
            : undefined
        }
        deleteItemLabel={sponsorName || "sponsor"}
        isSaving={isSaving}
        leftClassName="border-0 bg-transparent p-0 shadow-none"
        primaryButton={{
          label: editingId ? "Update" : "Save",
          onClick: handleSave,
          isLoading: isSaving,
        }}
      />
      <ImageCropper
        open={cropperOpen}
        imageSrc={imageToCrop}
        onClose={() => {
          setCropperOpen(false);
          setImageToCrop("");
          setPendingCropFile(null);
        }}
        onCropComplete={handleCropComplete}
        aspectRatio={3 / 2}
        outputWidth={600}
        outputHeight={400}
        title="Crop Sponsor Logo"
      />
    </>
  );
}
