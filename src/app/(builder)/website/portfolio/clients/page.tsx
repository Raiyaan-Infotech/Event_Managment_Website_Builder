"use client";

import * as React from "react";
import { CloudUpload, X } from "lucide-react";
import { WebsiteBuilderLayout } from "../../_components/website-builder-layout";
import { FormSection } from "../../_components/form-section";

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
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <div className="lg:col-span-4 space-y-5">
        <FormSection title="Upload Client Logos">
          <div
            role="button"
            tabIndex={0}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
            onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
            className="flex h-[180px] w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-[var(--vendor-radius-panel)] border-2 border-dashed border-[var(--vendor-primary-btn)]/40 bg-white transition-all hover:border-[var(--vendor-primary-btn)] hover:bg-[var(--vendor-primary-btn)]/5"
          >
            <CloudUpload className="h-8 w-8 text-[var(--vendor-primary-btn)]" />
            <p className="text-[12px] font-black text-[var(--vendor-primary-btn)] text-center px-4">
              Drag &amp; drop logo images here
            </p>
            <p className="text-[10px] text-[var(--vendor-text-muted)]">or click to browse</p>
            <p className="text-[9px] text-[var(--vendor-text-muted)]">JPG, PNG, SVG or WebP (Max. 2MB)</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => { handleFiles(e.target.files); e.target.value = ""; }}
            />
          </div>
          <p className="text-[10px] text-[var(--vendor-text-muted)] mt-1.5">
            You can upload up to 30 logos.
          </p>
        </FormSection>
      </div>

      <div className="lg:col-span-8 space-y-5">
        <FormSection title="Client Logo Directory">
          {clients.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {clients.map((client) => (
                <div key={client.id} className="relative group">
                  <div className="flex h-[110px] items-center justify-center overflow-hidden rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-white p-4 transition-all group-hover:shadow-sm">
                    <img src={client.logoUrl} alt={client.name} className="max-h-full max-w-full object-contain" />
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
              <p className="text-[12px] font-bold text-[var(--vendor-text-muted)]">No client logos uploaded yet</p>
              <p className="text-[11px] text-[var(--vendor-text-muted)] mt-1">Use the upload box on the left to add your first client logos.</p>
            </div>
          )}
        </FormSection>
      </div>
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
      saveLabel="Save Changes"
    />
  );
}
