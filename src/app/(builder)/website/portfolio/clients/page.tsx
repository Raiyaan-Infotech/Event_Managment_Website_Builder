"use client";

import * as React from "react";
import { X } from "lucide-react";
import { WebsiteBuilderLayout } from "../../_components/website-builder-layout";
import { FormSection } from "../../_components/form-section";
import { MultiImageUpload, type MultiImageUploadItem } from "../../_components/multi-image-upload";
import { Image as ImageIcon } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface ClientLogo {
  id: string;
  name: string;
  logoUrl: string;
}

function logoDataUrl(name: string, color: string, accent: string) {
  const initials = name.split(/\s+/).filter(Boolean).slice(0, 2)
    .map((part) => part[0]?.toUpperCase()).join("");
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
  { id: "1", name: "Google",    logoUrl: logoDataUrl("Google",    "#4285f4", "#34a853") },
  { id: "2", name: "TATA",      logoUrl: logoDataUrl("TATA",      "#3158b7", "#3158b7") },
  { id: "3", name: "Microsoft", logoUrl: logoDataUrl("Microsoft", "#737373", "#f25022") },
  { id: "4", name: "amazon",    logoUrl: logoDataUrl("amazon",    "#111827", "#ff9900") },
  { id: "5", name: "IBM",       logoUrl: logoDataUrl("IBM",       "#0062ff", "#0062ff") },
  { id: "6", name: "Infosys",   logoUrl: logoDataUrl("Infosys",   "#007cc3", "#007cc3") },
  { id: "7", name: "Coca-Cola", logoUrl: logoDataUrl("Coca-Cola", "#dc2626", "#dc2626") },
  { id: "8", name: "adidas",    logoUrl: logoDataUrl("adidas",    "#111827", "#111827") },
];

const card = "rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-[var(--vendor-panel-bg)] p-3 shadow-sm";

// ─── Live Preview ─────────────────────────────────────────────────────────────
function ClientLogosPreview({ clients }: { clients: ClientLogo[] }) {
  return (
    <div className={`${card} space-y-3`}>
      {/* Header */}
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
        <span className="text-[12px] font-semibold text-[var(--vendor-text)]">Live Preview</span>
        <span className="text-[11px] text-[var(--vendor-text-muted)]">
          — This is how the client logo wall will appear on the website.
        </span>
      </div>

      {/* 3-col logo grid */}
      {clients.length > 0 ? (
        <div className="grid grid-cols-3 gap-3">
          {clients.map((client) => (
            <div
              key={client.id}
              className="flex h-[110px] items-center justify-center overflow-hidden rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-white p-4"
            >
              <img
                src={client.logoUrl}
                alt={client.name}
                className="max-h-full max-w-full object-contain"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex h-[200px] items-center justify-center rounded-[var(--vendor-radius-panel)] border border-dashed border-[var(--vendor-border)] bg-slate-50">
          <p className="text-[11px] text-[var(--vendor-text-muted)]">No logos uploaded yet.</p>
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function PortfolioClientsPage() {
  const [clients, setClients] = React.useState<ClientLogo[]>(initialClients);
  const objectUrlsRef = React.useRef<string[]>([]);
  const [isSaving, setIsSaving] = React.useState(false);

  const handleSave = () => { setIsSaving(true); setTimeout(() => setIsSaving(false), 800); };
  const handleCancel = () => {
    objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    objectUrlsRef.current = [];
    setClients(initialClients);
  };

  React.useEffect(() => {
    return () => { objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url)); };
  }, []);

  const handleAdd = (files: File[]) => {
    files.forEach((file) => {
      const url = URL.createObjectURL(file);
      objectUrlsRef.current.push(url);
      setClients((prev) => [...prev, {
        id: `${Date.now()}-${Math.random()}`,
        name: file.name.replace(/\.[^.]+$/, ""),
        logoUrl: url,
      }]);
    });
  };

  const removeClient = (id: string) => setClients((prev) => prev.filter((c) => c.id !== id));

  const form = (
    <div className="grid gap-3 grid-cols-1 lg:grid-cols-[340px_1fr] items-start">

      {/* ── Left: Upload + Thumbnail grid ── */}
      <div className={`${card} space-y-3`}>
        <div>
          <p className="text-[13px] font-black text-[var(--vendor-text)]">Client Logos</p>
          <p className="text-[10px] text-[var(--vendor-text-muted)]">
            Upload and manage client logos. These will be displayed on the website.
          </p>
        </div>

        {/* Drag & drop upload zone */}
        <MultiImageUpload
          items={clients.map((c) => ({ id: c.id, imageUrl: c.logoUrl, alt: c.name }))}
          onAdd={handleAdd}
          onRemove={(item) => removeClient(item.id as string)}
          maxItems={30}
          accept="image/*"
          tileSize={88}
          variant="fullwidth"
          uploadHeight={160}
          hint="JPG, PNG, SVG or WebP (Max. 2MB each)"
        />
      </div>

      {/* ── Right: Live Preview ── */}
      <ClientLogosPreview clients={clients} />

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
      leftClassName="border-0 bg-transparent p-0 shadow-none"
      primaryButton={{
        label: "Save Changes",
        onClick: handleSave,
        isLoading: isSaving,
      }}
      howItWorksLabel="How It Works"
      onHowItWorks={() =>
        alert("This is where you'd explain how to use the client logos editor.")
      }
    />
  );
}
