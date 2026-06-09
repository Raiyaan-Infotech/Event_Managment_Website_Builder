"use client";

import * as React from "react";
import {
  Edit2,
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Trash2,
  Users,
  Youtube,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { OutlineButton, PrimaryButton } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { WebsiteBuilderLayout } from "../_components/website-builder-layout";
import { FormSection } from "../_components/form-section";
import { ImageUpload } from "../_components/image-upload";
import { ColorPickerInput } from "../_components/color-picker-input";
import {
  DesktopMobileToggle,
  type PreviewDevice,
} from "../_components/desktop-mobile-toggle";
import {
  BuilderCountedInput,
  BuilderCountedTextarea,
  BuilderSegmentedControl,
} from "../_components/builder-field";
import { FormActions } from "../_components/form-actions";

type ContactType = "default" | "alternative";

interface SocialLink {
  id: string;
  label: string;
  url: string;
  color: string;
  icon: React.ComponentType<{ className?: string }>;
}

const initialSocialLinks: SocialLink[] = [
  {
    id: "whatsapp",
    label: "WhatsApp",
    url: "https://wa.me/919876543210",
    color: "#25D366",
    icon: Phone,
  },
  {
    id: "instagram",
    label: "Instagram",
    url: "https://instagram.com/royalmoments",
    color: "#E4405F",
    icon: Instagram,
  },
  {
    id: "facebook",
    label: "Facebook",
    url: "https://facebook.com/royalmoments",
    color: "#1877F2",
    icon: Facebook,
  },
  {
    id: "youtube",
    label: "YouTube",
    url: "https://youtube.com/@royalmoments",
    color: "#FF0000",
    icon: Youtube,
  },
];

// ─── HeaderPreview ────────────────────────────────────────────────────────────

function HeaderPreview({
  device,
  companyName,
  city,
  mobile,
  email,
  address,
  socialLinks,
}: {
  device: PreviewDevice;
  companyName: string;
  city: string;
  mobile: string;
  email: string;
  address: string;
  socialLinks: SocialLink[];
}) {
  const navItems = ["Home", "About Us", "Services", "Events", "Gallery", "Contact Us"];
  const isMobile = device === "mobile";

  return (
    <div className="overflow-hidden rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-white shadow-sm">
      {/* Browser chrome bar */}
      <div className="flex items-center gap-2 border-b border-[var(--vendor-border)] bg-slate-50 px-3 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
        <div className="ml-3 flex-1 truncate rounded bg-white px-3 py-1 text-[11px] font-semibold text-slate-500">
          {companyName.toLowerCase().replace(/\s+/g, "")}.yourdomain.com
        </div>
      </div>

      <div className="overflow-hidden">
        <div
          className={
            isMobile
              ? "mx-auto max-w-[390px] border-x border-[var(--vendor-border)]"
              : [
                  "origin-top-left",
                  // below xl: preview is full-width panel → use larger scale
                  "scale-[0.62] w-[161%]",
                  "sm:scale-[0.68] sm:w-[147%]",
                  "md:scale-[0.74] md:w-[135%]",
                  "lg:scale-[0.78] lg:w-[128%]",
                  // xl+: preview is 45% right column → tighter, needs smaller scale
                  "xl:scale-[0.62] xl:w-[161%]",
                  "2xl:scale-[0.72] 2xl:w-[139%]",
                ].join(" ")
          }
        >
          {/* Desktop-only top bar */}
          {!isMobile ? (
            <div className="flex items-center justify-between bg-[#101010] px-8 py-3 text-xs font-semibold text-white">
              <div className="flex items-center gap-5">
                <span className="inline-flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5" />
                  {mobile}
                </span>
                <span className="h-4 w-px bg-white/30" />
                <span className="inline-flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5" />
                  {email}
                </span>
              </div>
              <div className="flex items-center gap-4">
                {socialLinks.slice(1).map((item) => {
                  const Icon = item.icon;
                  return <Icon key={item.id} className="h-4 w-4" />;
                })}
              </div>
            </div>
          ) : null}

          {/* Logo + nav bar */}
          <div className="flex items-center justify-between bg-white px-8 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-[var(--vendor-radius-control)] border border-[var(--vendor-primary-btn)]/20 bg-[var(--vendor-primary-btn)]/10 text-[var(--vendor-primary-btn)]">
                <span className="text-lg font-black">
                  {companyName.slice(0, 2).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="max-w-40 truncate text-base font-black tracking-tight text-slate-950">
                  {companyName}
                </p>
                <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-slate-500">
                  Events
                </p>
              </div>
            </div>

            {isMobile ? (
              <button className="flex h-10 w-10 items-center justify-center rounded-[var(--vendor-radius-control)] border border-slate-200 text-slate-950">
                <span className="text-xl leading-none">☰</span>
              </button>
            ) : (
              <div className="flex min-w-0 items-center gap-5 text-sm font-bold text-slate-950">
                {navItems.map((item, index) => (
                  <span
                    key={item}
                    className={`whitespace-nowrap ${index === 0 ? "text-[var(--vendor-primary-btn)]" : ""}`}
                  >
                    {item}
                  </span>
                ))}
                <PrimaryButton className="h-11 px-5">Book Now</PrimaryButton>
              </div>
            )}
          </div>

          {/* Hero */}
          <section className="relative min-h-[380px] overflow-hidden bg-slate-950">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_74%_16%,rgba(255,255,255,0.22),transparent_22%),linear-gradient(120deg,rgba(7,10,18,0.92),rgba(7,10,18,0.58)),linear-gradient(135deg,#21101a,#7d2647_42%,#241016)]" />
            <div className="absolute right-10 top-10 h-56 w-56 rounded-full bg-[var(--vendor-primary-btn)]/20 blur-3xl" />
            <div className="relative flex min-h-[380px] items-center px-8 py-12">
              <div className="max-w-xl text-white">
                <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[var(--vendor-primary-btn)]">
                  We create memorable moments
                </p>
                <h2 className="mt-4 text-5xl font-black leading-tight tracking-tight">
                  Creating Unforgettable{" "}
                  <span className="text-[var(--vendor-primary-btn)]">Moments</span>
                </h2>
                <p className="mt-5 max-w-lg text-base font-medium leading-8 text-white/85">
                  We create beautiful, memorable and perfect events that stay with you forever.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <PrimaryButton className="h-11 px-7">Book Consultation</PrimaryButton>
                  <OutlineButton
                    className="h-11 border-white/50 bg-transparent px-7 text-white hover:bg-white/10"
                  >
                    Explore Events
                  </OutlineButton>
                </div>
              </div>
            </div>
          </section>

          {/* Stats */}
          <div className="relative mx-5 -mt-9 grid grid-cols-2 gap-3 rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-white p-5 shadow-lg md:grid-cols-4">
            {[
              ["500+", "Events Completed"],
              ["10+", "Years Experience"],
              ["250+", "Happy Clients"],
              ["50+", "Team Members"],
            ].map(([value, label]) => (
              <div key={label} className="text-center">
                <Users className="mx-auto mb-2 h-5 w-5 text-[var(--vendor-primary-btn)]" />
                <p className="text-lg font-black text-slate-950">{value}</p>
                <p className="text-[11px] font-semibold text-slate-500">{label}</p>
              </div>
            ))}
          </div>

          {/* About */}
          <section className="grid gap-8 px-8 py-10 md:grid-cols-[0.8fr_1fr]">
            <div>
              <p className="text-[11px] font-black uppercase tracking-widest text-[var(--vendor-primary-btn)]">
                About Us
              </p>
              <h3 className="mt-2 text-2xl font-black text-slate-950">We Plan, You Celebrate</h3>
              <p className="mt-4 text-sm font-medium leading-7 text-slate-600">
                {companyName} is a premier event planning company located in {city}. {address}
              </p>
              <PrimaryButton className="mt-6">Learn  More</PrimaryButton>
            </div>
            <div className="min-h-48 rounded-[var(--vendor-radius-panel)] bg-[radial-gradient(circle_at_40%_20%,rgba(255,255,255,0.28),transparent_24%),linear-gradient(135deg,#3a1522,#a84455_48%,#1d1018)]" />
          </section>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function WebsiteHeaderPage() {
  const [device, setDevice] = React.useState<PreviewDevice>("desktop");
  const [companyName, setCompanyName] = React.useState("Royal Moments Events");
  const [city, setCity] = React.useState("New Delhi, India");
  const [contactType, setContactType] = React.useState<ContactType>("default");
  const [mobile, setMobile] = React.useState("+91 98765 43210");
  const [email, setEmail] = React.useState("info@royalmoments.com");
  const [address, setAddress] = React.useState(
    "123, Wedding Avenue, Connaught Place, New Delhi - 110001",
  );
  const [socialLinks, setSocialLinks] = React.useState<SocialLink[]>(initialSocialLinks);

  const updateSocialLink = (
    id: string,
    patch: Partial<Pick<SocialLink, "label" | "url" | "color">>,
  ) => {
    setSocialLinks((current) =>
      current.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    );
  };

  const form = (
    <div className="space-y-2">
      {/* Page Title to match mockup design */}
      <div className="mb-0.5 px-1">
        <h1 className="text-[14px] font-black leading-tight text-[var(--vendor-text)]">
          Basic Information
        </h1>
        <p className="mt-0.5 text-[9px] font-medium text-[var(--vendor-text-muted)]">
          Manage your website basic information
        </p>
      </div>

      {/* ── Header Information ──────────────────────────────────────────────── */}
      <FormSection
        title="Header Information"
        className="rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-[var(--vendor-panel-bg)] p-2 shadow-sm"
      >
        {/*
          3-col layout: [CompanyName] [Logo] [City]
          The form column width varies by screen:
            - mobile  → 1 col (stack everything)
            - sm 640+ → 3 cols: [1fr auto 1fr]  (logo auto-sizes itself)
          We deliberately DON'T use md/lg here because those are viewport breakpoints,
          not form-column breakpoints. sm (640px) is a safe threshold — the two-panel
          layout only activates at lg (1024px), so at sm the form still fills the full
          content area which is wide enough for 3 columns.
        */}
        <div className="grid items-start gap-2 sm:grid-cols-[1fr_auto_1fr]">
          <BuilderCountedInput
            label="Company Name"
            required
            value={companyName}
            onChange={setCompanyName}
            maxLength={100}
          />
          <ImageUpload
            compact
            label="Company Logo"
            hint="PNG, JPG, SVG (Max. 2MB)"
            recommendedSize="Recommended: 1920x800px"
          />
          <BuilderCountedInput
            label="City"
            required
            value={city}
            onChange={setCity}
            maxLength={100}
          />
        </div>
      </FormSection>

      {/* ── Contact Information ─────────────────────────────────────────────── */}
      <FormSection
        title="Contact Information"
        className="rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-[var(--vendor-panel-bg)] p-2 shadow-sm"
      >
        <BuilderSegmentedControl
          label="Type"
          value={contactType}
          onChange={setContactType}
          options={[
            { label: "Default", value: "default" },
            { label: "Alternative", value: "alternative" },
          ]}
        />

        {/*
          3-col: [Mobile] [Email] [Address]
          Same reasoning — sm (640px) is safe for 3 equal columns here.
          On mobile: Mobile + Email sit side-by-side (sm:grid-cols-2),
          Address spans both. At md+ all three are in one row.
        */}
        <div className="grid items-start gap-2 sm:grid-cols-2 md:grid-cols-3">
          <BuilderCountedInput
            label="Mobile"
            required
            value={mobile}
            onChange={setMobile}
            maxLength={20}
          />
          <BuilderCountedInput
            label="Email"
            required
            value={email}
            onChange={setEmail}
            maxLength={100}
          />
          <div className="sm:col-span-2 md:col-span-1">
            <BuilderCountedInput
              label="Address"
              required
              value={address}
              onChange={setAddress}
              maxLength={200}
            />
          </div>
        </div>
      </FormSection>

      {/* ── Social Links ────────────────────────────────────────────────────── */}
      <FormSection
        title="Social Links"
        className="rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-[var(--vendor-panel-bg)] p-2 shadow-sm"
      >
        {/* overflow-x-auto keeps the table scrollable inside the panel on narrow screens */}
        <div className="overflow-x-auto rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)]">
          <Table className="min-w-[600px]">
            <TableHeader>
              <TableRow>
                <TableHead className="h-8 text-[9px] px-2.5">Icon</TableHead>
                <TableHead className="h-8 text-[9px] px-2.5">Icon Color</TableHead>
                <TableHead className="h-8 text-[9px] px-2.5">Label</TableHead>
                <TableHead className="h-8 text-[9px] px-2.5">URL</TableHead>
                <TableHead className="h-8 text-right text-[9px] px-2.5">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {socialLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <TableRow key={item.id}>
                    <TableCell className="py-0.5 px-2">
                      <span
                        className="flex h-7 w-7 items-center justify-center rounded-[var(--vendor-radius-control)] text-white"
                        style={{ backgroundColor: item.color }}
                      >
                        <Icon className="h-3.5 w-3.5" />
                      </span>
                    </TableCell>
                    <TableCell className="py-0.5 px-2">
                      <ColorPickerInput
                        value={item.color}
                        onChange={(color) => updateSocialLink(item.id, { color })}
                        className="min-w-[7rem]"
                        compact
                      />
                    </TableCell>
                    <TableCell className="py-0.5 px-2">
                      <Input
                        value={item.label}
                        className="h-7 min-w-[6rem] text-[10px] font-semibold px-2"
                        onChange={(event) =>
                          updateSocialLink(item.id, { label: event.target.value })
                        }
                      />
                    </TableCell>
                    <TableCell className="py-0.5 px-2">
                      <Input
                        value={item.url}
                        className="h-7 min-w-[12rem] text-[10px] font-semibold px-2"
                        onChange={(event) =>
                          updateSocialLink(item.id, { url: event.target.value })
                        }
                      />
                    </TableCell>
                    <TableCell className="py-0.5 px-2 text-right">
                      <div className="inline-flex gap-1">
                        <Button type="button" variant="outline" size="icon-xs">
                          <Edit2 className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon-xs"
                          className="text-rose-500 hover:text-rose-600"
                          onClick={() =>
                            setSocialLinks((current) =>
                              current.filter((link) => link.id !== item.id),
                            )
                          }
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        <PrimaryButton
          size="xs"
          className="h-7 text-[10px] px-2.5"
          onClick={() =>
            setSocialLinks((current) => [
              ...current,
              {
                id: `custom-${Date.now()}`,
                label: "New Link",
                url: "https://",
                color: "#6C47FF",
                icon: MapPin,
              },
            ])
          }
        >
          Add Social Link
        </PrimaryButton>
      </FormSection>

      <div className="flex justify-center pt-0.5">
        <FormActions layout="end" className="justify-center" />
      </div>
    </div>
  );

  return (
    <WebsiteBuilderLayout
      title="Header"
      hideHeader={true}
      form={form}
      preview={
        <HeaderPreview
          device={device}
          companyName={companyName}
          city={city}
          mobile={mobile}
          email={email}
          address={address}
          socialLinks={socialLinks}
        />
      }
      previewTitle="Live Website Preview"
      previewSubtitle="This is how your header will appear on your website."
      previewActions={<DesktopMobileToggle value={device} onChange={setDevice} />}
      saveLabel="Save Changes"
      contentClassName="xl:grid-cols-[minmax(0,55fr)_minmax(0,45fr)]"
      leftClassName="border-0 bg-transparent p-0 shadow-none"
    />
  );
}