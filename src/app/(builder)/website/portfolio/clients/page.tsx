"use client";

import * as React from "react";
import { CloudUpload, X } from "lucide-react";
import { WebsiteBuilderLayout } from "../../_components/website-builder-layout";

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
  { id: "1", name: "Google", logoUrl: logoDataUrl("Google", "#4285f4", "#34a853") },
  { id: "2", name: "TATA", logoUrl: logoDataUrl("TATA", "#3158b7", "#3158b7") },
  { id: "3", name: "Microsoft", logoUrl: logoDataUrl("Microsoft", "#737373", "#f25022") },
  { id: "4", name: "amazon", logoUrl: logoDataUrl("amazon", "#111827", "#ff9900") },
  { id: "5", name: "IBM", logoUrl: logoDataUrl("IBM", "#0062ff", "#0062ff") },
  { id: "6", name: "Infosys", logoUrl: logoDataUrl("Infosys", "#007cc3", "#007cc3") },
  { id: "7", name: "Coca-Cola", logoUrl: logoDataUrl("Coca-Cola", "#dc2626", "#dc2626") },
  { id: "8", name: "adidas", logoUrl: logoDataUrl("adidas", "#111827", "#111827") },
];

export default function PortfolioClientsPage() {
  const [clients, setClients] = React.useState<ClientLogo[]>(initialClients);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const objectUrlsRef = React.useRef<string[]>([]);

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
      setClients((current) => [
        ...current,
        { id: `${Date.now()}-${Math.random()}`, name: file.name.replace(/\.[^.]+$/, ""), logoUrl: url },
      ]);
    });
  };

  const removeClient = (id: string) => {
    setClients((current) => current.filter((c) => c.id !== id));
  };

  const form = (
    <div className="space-y-4">
      {/* Section header */}
      <div>
        <h2 className="text-[13px] font-black text-[var(--vendor-text)]">Client Logos</h2>
        <p className="mt-0.5 text-[11px] text-[var(--vendor-text-muted)]">
          Upload and manage client logos. These will be displayed on the website.
        </p>
      </div>

      {/* Drag-and-drop upload zone */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
        onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
        className="flex h-[140px] w-full cursor-pointer flex-col items-center justify-center gap-1 rounded-[var(--vendor-radius-panel)] border-2 border-dashed border-[var(--vendor-primary-btn)]/40 bg-white transition-colors hover:border-[var(--vendor-primary-btn)] hover:bg-[var(--vendor-primary-btn)]/5"
      >
        <CloudUpload className="h-7 w-7 text-[var(--vendor-primary-btn)]" />
        <p className="text-[12px] font-semibold text-[var(--vendor-primary-btn)]">
          Drag &amp; drop logo images here
        </p>
        <p className="text-[11px] text-[var(--vendor-text-muted)]">or click to browse</p>
        <p className="text-[10px] text-[var(--vendor-text-muted)]">JPG, PNG, SVG or WebP (Max. 2MB each)</p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => { handleFiles(e.target.files); e.target.value = ""; }}
        />
      </div>

      {/* Thumbnail grid */}
      {clients.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {clients.map((client) => (
            <div key={client.id} className="relative">
              <div className="flex h-[72px] items-center justify-center overflow-hidden rounded-[var(--vendor-radius-control)] border border-[var(--vendor-border)] bg-white p-2">
                <img src={client.logoUrl} alt={client.name} className="max-h-full max-w-full object-contain" />
              </div>
              <button
                type="button"
                onClick={() => removeClient(client.id)}
                className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-slate-700 text-white shadow hover:bg-rose-500"
                aria-label={`Remove ${client.name}`}
              >
                <X className="h-2.5 w-2.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Footer hint */}
      <p className="text-[11px] text-[var(--vendor-text-muted)]">
        You can upload up to 30 logos.
      </p>
    </div>
  );

  const preview = (
    <div className="grid grid-cols-3 gap-4">
      {clients.map((client) => (
        <div
          key={client.id}
          className="flex h-[130px] items-center justify-center rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-white p-5 shadow-sm"
        >
          <img src={client.logoUrl} alt={client.name} className="max-h-full max-w-full object-contain" />
        </div>
      ))}
    </div>
  );

  return (
    <WebsiteBuilderLayout
      title="Portfolio - Clients"
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Portfolio", href: "/website/portfolio" },
        { label: "Clients" },
      ]}
      form={form}
      preview={preview}
      previewTitle="Live Preview"
      previewSubtitle="This is how the client logo wall will appear on the website."
      saveLabel="Save Changes"
      contentClassName="xl:grid-cols-[minmax(340px,32fr)_minmax(0,68fr)]"
    />
  );
}
