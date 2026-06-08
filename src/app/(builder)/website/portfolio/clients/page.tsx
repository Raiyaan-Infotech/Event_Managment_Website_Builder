"use client";

import * as React from "react";
import { GripVertical, Plus, Trash2 } from "lucide-react";
import { WebsiteBuilderLayout } from "../../_components/website-builder-layout";
import { ImageUpload } from "../../_components/image-upload";
import { BuilderCountedInput } from "../../_components/builder-field";
import { PrimaryButton, OutlineButton } from "@/components/ui/button";

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
  const [clientName, setClientName] = React.useState("");
  const [draftLogo, setDraftLogo] = React.useState<string | null>(null);
  const objectUrlsRef = React.useRef<string[]>([]);

  React.useEffect(() => {
    return () => {
      objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const handleLogoSelect = (file: File) => {
    if (draftLogo?.startsWith("blob:")) URL.revokeObjectURL(draftLogo);
    const nextUrl = URL.createObjectURL(file);
    objectUrlsRef.current.push(nextUrl);
    setDraftLogo(nextUrl);
  };

  const addClient = () => {
    const name = clientName.trim();
    if (!name) return;
    setClients((current) => [
      ...current,
      {
        id: `${Date.now()}`,
        name,
        logoUrl: draftLogo ?? logoDataUrl(name, "#2563eb", "#7c3aed"),
      },
    ]);
    setClientName("");
    setDraftLogo(null);
  };

  const removeClient = (id: string) => {
    setClients((current) => current.filter((client) => client.id !== id));
  };

  const form = (
    <div className="space-y-6">
      <section className="space-y-4">
        <div>
          <h2 className="text-[15px] font-black text-[var(--vendor-text)]">Add New Client</h2>
        </div>
        <ImageUpload
          key={draftLogo ?? "empty-client-logo"}
          value={draftLogo}
          label="Upload Logo"
          title="Drag & drop client logo here"
          browseText="or click to browse"
          hint="JPG, PNG, SVG or WebP"
          recommendedSize="(Max. 2MB)"
          size="wide"
          dropzoneClassName="h-[170px]"
          previewClassName="h-[170px]"
          onFileSelect={handleLogoSelect}
          onRemove={() => setDraftLogo(null)}
        />
        <BuilderCountedInput
          label="Client Name"
          value={clientName}
          onChange={setClientName}
          maxLength={100}
          placeholder="Enter client name"
        />
        <div className="flex justify-end">
          <PrimaryButton type="button" size="sm" onClick={addClient} className="h-9 px-5">
            <Plus className="h-4 w-4" />
            Add Client
          </PrimaryButton>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-[13px] font-black text-[var(--vendor-text)]">
          Added Clients ({clients.length})
        </h2>
        <div className="space-y-2">
          {clients.map((client) => (
            <div
              key={client.id}
              className="flex items-center gap-3 rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-white px-3 py-2 shadow-sm"
            >
              <GripVertical className="h-4 w-4 shrink-0 cursor-grab text-[var(--vendor-text-muted)]" />
              <div className="flex h-9 w-16 shrink-0 items-center justify-center overflow-hidden rounded-[var(--vendor-radius-control)] border border-[var(--vendor-border)] bg-white p-1">
                <img src={client.logoUrl} alt={client.name} className="max-h-full max-w-full object-contain" />
              </div>
              <p className="min-w-0 flex-1 truncate text-[12px] font-black text-[var(--vendor-text)]">
                {client.name}
              </p>
              <OutlineButton
                type="button"
                size="icon-xs"
                onClick={() => removeClient(client.id)}
                className="text-rose-500 hover:text-rose-600"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </OutlineButton>
            </div>
          ))}
        </div>
        <p className="text-[12px] font-medium text-[var(--vendor-text-muted)]">
          You can upload up to 30 clients.
        </p>
      </section>
    </div>
  );

  const preview = (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {clients.map((client) => (
        <div
          key={client.id}
          className="flex h-[190px] items-center justify-center rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-white p-8 shadow-sm"
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
