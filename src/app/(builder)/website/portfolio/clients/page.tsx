"use client";

import * as React from "react";
import { CloudUpload, X } from "lucide-react";
import { WebsiteBuilderLayout } from "../../_components/website-builder-layout";
import { FormSection } from "../../_components/form-section";
import {
  MultiImageUpload,
  type MultiImageUploadItem,
} from "../../_components/multi-image-upload";

interface ClientLogo {
  id: string;
  name: string;
  logoUrl: string;
}

function logoDataUrl(name: string, color: string, accent: string) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="360" height="240" viewBox="0 0 360 240">
      <rect width="360" height="240" rx="24" fill="#ffffff"/>
      <circle cx="95" cy="120" r="34" fill="${accent}" opacity=".95"/>
      <text x="182" y="132" text-anchor="middle" font-family="Inter, Arial" font-size="42" font-weight="800" fill="${color}">${name}</text>
      <text x="95" y="132" text-anchor="middle" font-family="Inter, Arial" font-size="24" font-weight="900" fill="#ffffff">${initials}</text>
    </svg>
  `)}`;
}

const initialClients: ClientLogo[] = [
  {
    id: "1",
    name: "Google",
    logoUrl: logoDataUrl("Google", "#4285f4", "#34a853"),
  },
  { id: "2", name: "TATA", logoUrl: logoDataUrl("TATA", "#3158b7", "#3158b7") },
  {
    id: "3",
    name: "Microsoft",
    logoUrl: logoDataUrl("Microsoft", "#737373", "#f25022"),
  },
  {
    id: "4",
    name: "amazon",
    logoUrl: logoDataUrl("amazon", "#111827", "#ff9900"),
  },
  { id: "5", name: "IBM", logoUrl: logoDataUrl("IBM", "#0062ff", "#0062ff") },
  {
    id: "6",
    name: "Infosys",
    logoUrl: logoDataUrl("Infosys", "#007cc3", "#007cc3"),
  },
  {
    id: "7",
    name: "Coca-Cola",
    logoUrl: logoDataUrl("Coca-Cola", "#dc2626", "#dc2626"),
  },
  {
    id: "8",
    name: "adidas",
    logoUrl: logoDataUrl("adidas", "#111827", "#111827"),
  },
];

export default function PortfolioClientsPage() {
  const [clients, setClients] = React.useState<ClientLogo[]>(initialClients);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const objectUrlsRef = React.useRef<string[]>([]);
  const [isSaving, setIsSaving] = React.useState(false);

  const handleAdd = (files: File[]) => {
    files.forEach((file) => {
      const url = URL.createObjectURL(file);
      objectUrlsRef.current.push(url);
      setClients((prev) => [
        ...prev,
        {
          id: `${Date.now()}-${Math.random()}`,
          name: file.name.replace(/\.[^.]+$/, ""),
          logoUrl: url,
        },
      ]);
    });
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 800);
  };

  const handleCancel = () => {
    objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    objectUrlsRef.current = [];
    setClients(initialClients);
  };

  React.useEffect(() => {
    return () => {
      objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) return;
      const url = URL.createObjectURL(file);
      objectUrlsRef.current.push(url);
      setClients((prev) => [
        ...prev,
        {
          id: `${Date.now()}-${Math.random()}`,
          name: file.name.replace(/\.[^.]+$/, ""),
          logoUrl: url,
        },
      ]);
    });
  };

  const removeClient = (id: string) => {
    setClients((prev) => prev.filter((c) => c.id !== id));
  };

  const form = (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* ── Upload Column ── */}
        <div className="lg:col-span-4 space-y-5">
          <FormSection title="Upload Client Logos">
            <MultiImageUpload
              items={clients.map((c) => ({
                id: c.id,
                imageUrl: c.logoUrl,
                alt: c.name,
              }))}
              onAdd={handleAdd}
              onRemove={(item) => removeClient(item.id as string)}
              maxItems={30}
              accept="image/*"
              tileSize={92}
              variant="fullwidth"
              uploadHeight={180}
              hideTiles
              hint="JPG, PNG, SVG or WebP (Max. 2MB)"
            />
          </FormSection>
        </div>

        {/* ── Logo Grid Column ── */}
        <div className="lg:col-span-8 space-y-5">
          <FormSection title="Client Logo Directory">
            {clients.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {clients.map((client) => (
                  <div key={client.id} className="relative group">
                    <div className="flex h-[110px] items-center justify-center overflow-hidden rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-white p-4 transition-all group-hover:shadow-sm">
                      <img
                        src={client.logoUrl}
                        alt={client.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeClient(client.id)}
                      className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-slate-800 text-white shadow-md hover:bg-rose-500 transition-colors"
                      aria-label={`Remove ${client.name}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-[180px] flex-col items-center justify-center rounded-[var(--vendor-radius-panel)] border border-dashed border-[var(--vendor-border)] bg-slate-50/50 p-6 text-center">
                <p className="text-[12px] font-bold text-[var(--vendor-text-muted)]">
                  No client logos uploaded yet
                </p>
                <p className="text-[11px] text-[var(--vendor-text-muted)] mt-1">
                  Use the upload box on the left to add your first client logos.
                </p>
              </div>
            )}
          </FormSection>
        </div>
      </div>
    </div>
  );

  return (
    <WebsiteBuilderLayout
      title="Portfolio - Clients"
      form={form}
      saveLabel="Save Changes"
      onSave={handleSave}
      onCancel={handleCancel}
      isSaving={isSaving}
    />
  );
}
