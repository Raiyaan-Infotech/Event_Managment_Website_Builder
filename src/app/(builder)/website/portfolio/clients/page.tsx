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
  useClients,
  useCreateClient,
  useDeleteClient,
  useUpdateClient,
  useUploadVendorMedia,
} from "@/hooks/use-website-builder";
import type { VendorWebsiteClientRecord } from "@/lib/website-builder-api";

interface ClientLogo {
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

function mapRecordToClient(
  record: VendorWebsiteClientRecord,
  index: number,
): ClientLogo {
  return {
    id: String(record.id),
    recordId: record.id,
    name: record.name || "Client",
    logoUrl: record.logo_url ? resolveMediaUrl(record.logo_url) : "",
    rawLogoUrl: record.logo_url || null,
    websiteUrl: record.website_url || null,
    sortOrder: record.sort_order || index + 1,
    status: record.is_active === true || record.is_active === 1,
    logoFile: null,
  };
}

function ClientLogosPreview({ clients }: { clients: ClientLogo[] }) {
  const activeClients = clients.filter((client) => client.status && client.logoUrl);

  return (
    <div className={`${card} space-y-3`}>
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
        <span className="text-[12px] font-semibold text-[var(--vendor-text)]">
          Live Preview
        </span>
        <span className="text-[11px] text-[var(--vendor-text-muted)]">
          This is how the client logo wall will appear on the website.
        </span>
      </div>

      {activeClients.length > 0 ? (
        <div className="flex flex-wrap justify-center gap-3">
          {activeClients.map((client) => (
            <div
              key={client.id}
              className="flex h-[160px] w-[240px] shrink-0 items-center justify-center overflow-hidden rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-white"
            >
              <img
                src={client.logoUrl}
                alt={client.name}
                className="h-full w-full rounded-[var(--vendor-radius-panel)] object-cover object-center"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex h-[200px] items-center justify-center rounded-[var(--vendor-radius-panel)] border border-dashed border-[var(--vendor-border)] bg-slate-50">
          <p className="text-[11px] text-[var(--vendor-text-muted)]">
            No logos uploaded yet.
          </p>
        </div>
      )}
    </div>
  );
}

export default function PortfolioClientsPage() {
  const { data: clientRecords = [] } = useClients();
  const createClient = useCreateClient();
  const updateClient = useUpdateClient();
  const deleteClient = useDeleteClient();
  const uploadVendorMedia = useUploadVendorMedia();
  const { showToast } = useToast();

  const [clients, setClients] = React.useState<ClientLogo[]>([]);
  const [clientName, setClientName] = React.useState("");
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
    setClientName("");
    setEditingId(null);
    const mapped = [...clientRecords]
      .sort(
        (left, right) =>
          (left.sort_order ?? Number.MAX_SAFE_INTEGER) -
          (right.sort_order ?? Number.MAX_SAFE_INTEGER),
      )
      .map((record, index) => mapRecordToClient(record, index));
    setClients(mapped);
  }, [clientRecords, revokeAllObjectUrls]);

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
    setClientName("");
    setDraftLogo(null);
    setDraftLogoFile(null);
  };

  const handleEdit = (id: string) => {
    const target = clients.find((item) => item.id === id);
    if (!target) return;
    setEditingId(id);
    setClientName(target.name);
    setDraftLogo(target.logoUrl || null);
    setDraftLogoFile(null);
  };

  const addOrUpdateClient = () => {
    const name = clientName.trim();
    if (!name || !draftLogo) return;

    if (editingId) {
      setClients((current) =>
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

    setClients((current) => [
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

  const removeClient = (id: string) => {
    if (id === editingId) resetForm();
    setClients((current) => {
      const target = current.find((item) => item.id === id);
      revokeObjectUrl(target?.logoUrl);
      objectUrlsRef.current = objectUrlsRef.current.filter((url) => url !== target?.logoUrl);

      return current
        .filter((item) => item.id !== id)
        .map((item, index) => ({ ...item, sortOrder: index + 1 }));
    });
  };

  const handleReorder = (reordered: DraggableItemListItem[]) => {
    setClients(
      reordered
        .map((item) => clients.find((client) => client.id === item.id))
        .filter((item): item is ClientLogo => Boolean(item))
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
        clientRecords.map((record) => String(record.id)),
      );
      const currentPersistedIds = new Set(
        clients.filter((item) => item.recordId).map((item) => String(item.recordId)),
      );

      const removedRecords = clientRecords.filter(
        (record) => !currentPersistedIds.has(String(record.id)),
      );
      await Promise.all(removedRecords.map((record) => deleteClient.mutateAsync(record.id)));

      for (const [index, client] of clients.entries()) {
        let nextRawLogoUrl = client.rawLogoUrl;
        let nextLogoUrl = client.logoUrl;

        if (client.logoFile) {
          const uploaded = await uploadVendorMedia.mutateAsync({
            file: client.logoFile,
            folder: "clients",
          });
          nextRawLogoUrl = uploaded.url;
          nextLogoUrl = resolveMediaUrl(uploaded.url);
        }

        const payload = {
          name: client.name.trim(),
          logo_url: nextRawLogoUrl,
          website_url: client.websiteUrl,
          sort_order: index + 1,
          is_active: client.status,
        };

        if (client.recordId && persistedIds.has(String(client.recordId))) {
          await updateClient.mutateAsync({
            id: client.recordId,
            payload,
          });
        } else {
          await createClient.mutateAsync(payload);
        }

        if (client.logoFile) {
          revokeObjectUrl(client.logoUrl);
        }

        setClients((current) =>
          current.map((item) =>
            item.id === client.id
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
        (url) => !clients.some((client) => client.logoUrl === url && !client.logoFile),
      );
      showToast("Client logos saved");
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Unable to save client logos",
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
    setClientName("");
    setEditingId(null);
    const mapped = [...clientRecords]
      .sort(
        (left, right) =>
          (left.sort_order ?? Number.MAX_SAFE_INTEGER) -
          (right.sort_order ?? Number.MAX_SAFE_INTEGER),
      )
      .map((record, index) => mapRecordToClient(record, index));
    setClients(mapped);
  };

  const clientItems: DraggableItemListItem[] = clients.map((client) => ({
    id: client.id,
    label: client.name,
  }));

  const form = (
    <div className="grid grid-cols-1 items-start gap-3 lg:grid-cols-[300px_1fr]">
      <div className={`${card} space-y-3`}>
        <div>
          <p className="text-[13px] font-black text-[var(--vendor-text)]">
            Add New Client
          </p>
        </div>

        <BuilderCountedInput
          label="Client Name"
          value={clientName}
          onChange={setClientName}
          maxLength={100}
          placeholder="Enter client name"
          className="space-y-0.5"
        />

        <div className="space-y-0.5">
          <p className="text-[11px] font-medium text-[var(--vendor-text)]">
            Upload Logo
          </p>
          <ImageUpload
            key={draftLogo ?? "empty"}
            value={draftLogo ?? undefined}
            label="Client Logo"
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
          onClick={addOrUpdateClient}
          disabled={!clientName.trim() || !draftLogo}
          className="w-full justify-center gap-1.5"
        >
          <Plus className="h-3.5 w-3.5" />
          {editingId ? "Update Client" : "Add Client"}
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
            Added Clients ({clients.length})
          </p>

          <DraggableItemList
            showAddChild={false}
            items={clientItems}
            variant="flat"
            onReorder={handleReorder}
            onEdit={(item) => handleEdit(String(item.id))}
            onDelete={(item) => removeClient(String(item.id))}
            emptyText="No clients added yet."
          />

          <p className="pt-2 text-[10px] text-[var(--vendor-text-muted)]">
            You can upload up to 30 clients.
          </p>
        </div>
      </div>

      <ClientLogosPreview clients={clients} />
    </div>
  );

  return (
    <>
      <WebsiteBuilderLayout
        title="Portfolio - Clients"
        form={form}
        onCancel={handleCancel}
        onDelete={
          editingId
            ? async () => {
                const target = clients.find((client) => client.id === editingId);
                if (target?.recordId) await deleteClient.mutateAsync(target.recordId);
                removeClient(editingId);
              }
            : undefined
        }
        deleteItemLabel={clientName || "client"}
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
        title="Crop Client Logo"
      />
    </>
  );
}
