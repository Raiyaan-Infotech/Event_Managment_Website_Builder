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
  const navItems = [
    "Home",
    "About Us",
    "Services",
    "Events",
    "Gallery",
    "Contact Us",
  ];
  const isMobile = device === "mobile";

  return (
    <div className="overflow-hidden rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-white shadow-sm">
      <div className="flex items-center gap-2 border-b border-[var(--vendor-border)] bg-slate-50 px-3 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
        <div className="ml-3 flex-1 rounded bg-white px-3 py-1 text-[11px] font-semibold text-slate-500">
          {companyName.toLowerCase().replace(/\s+/g, "")}.yourdomain.com
        </div>
      </div>

      <div
        className={
          isMobile
            ? "mx-auto max-w-[390px] border-x border-[var(--vendor-border)]"
            : "origin-top-left scale-[0.78] w-[128%]"
        }
      >
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
              <Button className="h-11 px-5">Book Now</Button>
            </div>
          )}
        </div>

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
                <span className="text-[var(--vendor-primary-btn)]">
                  Moments
                </span>
              </h2>
              <p className="mt-5 max-w-lg text-base font-medium leading-8 text-white/85">
                We create beautiful, memorable and perfect events that stay with
                you forever.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button className="h-11 px-7">Book Consultation</Button>
                <Button
                  variant="outline"
                  className="h-11 border-white/50 bg-transparent px-7 text-white hover:bg-white/10"
                >
                  Explore Events
                </Button>
              </div>
            </div>
          </div>
        </section>

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
              <p className="text-[11px] font-semibold text-slate-500">
                {label}
              </p>
            </div>
          ))}
        </div>

        <section className="grid gap-8 px-8 py-10 md:grid-cols-[0.8fr_1fr]">
          <div>
            <p className="text-[11px] font-black uppercase tracking-widest text-[var(--vendor-primary-btn)]">
              About Us
            </p>
            <h3 className="mt-2 text-2xl font-black text-slate-950">
              We Plan, You Celebrate
            </h3>
            <p className="mt-4 text-sm font-medium leading-7 text-slate-600">
              {companyName} is a premier event planning company located in{" "}
              {city}. {address}
            </p>
            <Button className="mt-6">Learn More</Button>
          </div>
          <div className="min-h-48 rounded-[var(--vendor-radius-panel)] bg-[radial-gradient(circle_at_40%_20%,rgba(255,255,255,0.28),transparent_24%),linear-gradient(135deg,#3a1522,#a84455_48%,#1d1018)]" />
        </section>
      </div>
    </div>
  );
}

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
  const [socialLinks, setSocialLinks] =
    React.useState<SocialLink[]>(initialSocialLinks);

  const updateSocialLink = (
    id: string,
    patch: Partial<Pick<SocialLink, "label" | "url" | "color">>,
  ) => {
    setSocialLinks((current) =>
      current.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    );
  };

  const form = (
    <div className="space-y-4">
      <FormSection
        title="Header Information"
        subtitle="Manage the main website header details shown in your public website."
        className="rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-[var(--vendor-panel-bg)] p-4 shadow-sm"
      >
        <div className="grid items-start gap-4 md:grid-cols-[330px_150px_310px]">
          <BuilderCountedInput
            label="Company Name"
            required
            value={companyName}
            onChange={setCompanyName}
            maxLength={100}
            className="w-[330px] max-w-full"
          />
          <ImageUpload
            compact // ← smaller padding
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
            className="w-[310px] max-w-full"
          />
        </div>
      </FormSection>

      <FormSection
        title="Contact Information"
        className="rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-[var(--vendor-panel-bg)] p-4 shadow-sm"
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

        <div className="grid items-start gap-4 md:grid-cols-[220px_270px_310px]">
          <BuilderCountedInput
            label="Mobile"
            required
            value={mobile}
            onChange={setMobile}
            maxLength={20}
            className="w-[220px] max-w-full"
          />
          <BuilderCountedInput
            label="Email"
            required
            value={email}
            onChange={setEmail}
            maxLength={100}
            className="w-[270px] max-w-full"
          />
          <BuilderCountedTextarea
            label="Address"
            required
            value={address}
            onChange={setAddress}
            maxLength={200}
            className="w-[310px] max-w-full"
            textareaClassName="min-h-[68px]"
          />
        </div>
      </FormSection>

      <FormSection
        title="Social Links"
        subtitle="These links appear in the header top bar and public website navigation."
        className="rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-[var(--vendor-panel-bg)] p-4 shadow-sm"
      >
        <div className="overflow-hidden rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="h-9 text-[11px]">Icon</TableHead>
                <TableHead className="h-9 text-[11px]">Icon Color</TableHead>
                <TableHead className="h-9 text-[11px]">Label</TableHead>
                <TableHead className="h-9 text-[11px]">URL</TableHead>
                <TableHead className="h-9 text-right text-[11px]">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {socialLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <TableRow key={item.id}>
                    <TableCell className="py-1.5">
                      <span
                        className="flex h-8 w-8 items-center justify-center rounded-[var(--vendor-radius-control)] text-white"
                        style={{ backgroundColor: item.color }}
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                    </TableCell>
                    <TableCell className="py-1.5">
                      <ColorPickerInput
                        value={item.color}
                        onChange={(color) =>
                          updateSocialLink(item.id, { color })
                        }
                        className="min-w-32"
                      />
                    </TableCell>
                    <TableCell className="py-1.5">
                      <Input
                        value={item.label}
                        className="h-8 text-[12px] font-semibold"
                        onChange={(event) =>
                          updateSocialLink(item.id, {
                            label: event.target.value,
                          })
                        }
                      />
                    </TableCell>
                    <TableCell className="py-1.5">
                      <Input
                        value={item.url}
                        className="h-8 text-[12px] font-semibold"
                        onChange={(event) =>
                          updateSocialLink(item.id, { url: event.target.value })
                        }
                      />
                    </TableCell>
                    <TableCell className="py-1.5 text-right">
                      <div className="inline-flex gap-2">
                        <Button type="button" variant="outline" size="icon-sm">
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon-sm"
                          className="text-rose-500 hover:text-rose-600"
                          onClick={() =>
                            setSocialLinks((current) =>
                              current.filter((link) => link.id !== item.id),
                            )
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
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
        </Button>
      </FormSection>

      <div className="rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-[var(--vendor-panel-bg)] p-4 shadow-sm">
        <FormActions layout="end" />
      </div>
    </div>
  );

  return (
    <WebsiteBuilderLayout
      title="Header"
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
      previewActions={
        <DesktopMobileToggle value={device} onChange={setDevice} />
      }
      saveLabel="Save Changes"
      contentClassName="xl:grid-cols-[minmax(640px,55fr)_minmax(560px,45fr)]"
      leftClassName="border-0 bg-transparent p-0 shadow-none"
    />
  );
}
