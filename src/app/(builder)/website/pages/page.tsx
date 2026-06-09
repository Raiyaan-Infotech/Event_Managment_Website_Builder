"use client";
import * as React from "react";
import { WebsiteBuilderLayout } from "../_components/website-builder-layout";
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
import { WebsiteRichTextEditor } from "../_components/rich-text-editor";
import { FormActions } from "../_components/form-actions";
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
import { cn } from "@/lib/utils";

function HeaderPreview({
  device,
  companyName,
  city,
  mobile,
  email,
  address,
  socialLinks = [],
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
          {(companyName ?? "").toLowerCase().replace(/\s+/g, "") || "yourcompany"}.yourdomain.com
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
      </div>
    </div>
  );
}

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

// ── Types ──────────────────────────────────────────────────────────────────────
type LegalPageId = "terms" | "privacy" | "about";

interface LegalPage {
  id: LegalPageId;
  label: string;
  title: string;
  content: string;
}

const DEFAULT_TERMS_CONTENT = `<h2>1. Introduction</h2><p>Welcome to Eventify. By accessing or using our website and services, you agree to be bound by these Terms &amp; Conditions. Please read them carefully.</p><h2>2. Use of Our Services</h2><p>You agree to use our services only for lawful purposes and in accordance with these Terms. You must not use our services in any way that may harm, disable, or impair our platform.</p><h2>3. Bookings and Payments</h2><p>All bookings are subject to availability. Payments must be made in full or as specified during the booking process. We reserve the right to cancel any booking if payment is not received.</p><h2>4. Cancellations and Refunds</h2><p>Cancellations made by the client may be eligible for a refund as per our Refund Policy. Please review our policy for more details.</p><h2>5. Limitation of Liability</h2><p>Eventify is not liable for any indirect, incidental, or consequential damages arising from the use of our services.</p><h2>6. Changes to Terms</h2><p>We may update these Terms &amp; Conditions from time to time. Continued use of our services constitutes acceptance of the updated terms.</p>`;

const DEFAULT_PRIVACY_CONTENT = `<h2>1. Information We Collect</h2><p>We collect personal information you provide when booking our services, including name, contact details, and payment information.</p><h2>2. How We Use Your Information</h2><p>Your information is used to process bookings, communicate with you, and improve our services. We do not sell your data to third parties.</p><h2>3. Data Security</h2><p>We implement appropriate security measures to protect your personal information from unauthorized access or disclosure.</p>`;

const DEFAULT_ABOUT_CONTENT = `<h2>Who We Are</h2><p>Eventify is a premier event management company dedicated to creating unforgettable experiences. With over a decade of expertise, we specialize in weddings, corporate events, and private celebrations.</p><h2>Our Mission</h2><p>To deliver flawless, personalized events that exceed expectations and create lasting memories for our clients.</p>`;
export default function PagesPage() {
  const [device, setDevice] = React.useState<PreviewDevice>("desktop");
  const [companyName, setCompanyName] = React.useState("Royal Moments Events");
  const [city, setCity] = React.useState("New Delhi, India");
  const [mobile, setMobile] = React.useState("+91 98765 43210");
  const [email, setEmail] = React.useState("info@royalmoments.com");
  const [address, setAddress] = React.useState(
    "123, Wedding Avenue, Connaught Place, New Delhi - 110001",
  );
  const [activePage, setActivePage] = React.useState<LegalPageId>("terms");
const [pages, setPages] = React.useState<LegalPage[]>([
  { id: "terms",   label: "Terms & Conditions", title: "Terms & Conditions", content: DEFAULT_TERMS_CONTENT },
  { id: "privacy", label: "Privacy Policy",      title: "Privacy Policy",     content: DEFAULT_PRIVACY_CONTENT },
  { id: "about",   label: "About Us",            title: "About Us",           content: DEFAULT_ABOUT_CONTENT },
]);

const currentPage = pages.find((p) => p.id === activePage)!;

const updatePage = (patch: Partial<Pick<LegalPage, "title" | "content">>) => {
  setPages((prev) =>
    prev.map((p) => (p.id === activePage ? { ...p, ...patch } : p)),
  );
};
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
  <div className="space-y-0 rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-[var(--vendor-panel-bg)] shadow-sm overflow-hidden">
    {/* Tab selector */}
    <div className="flex border-b border-[var(--vendor-border)]">
      {pages.map((page) => (
        <button
          key={page.id}
          type="button"
          onClick={() => setActivePage(page.id)}
          className={cn(
            "flex-1 px-4 py-3 text-[13px] font-bold transition-colors",
            activePage === page.id
              ? "border-b-2 border-[var(--vendor-primary-btn)] bg-[var(--vendor-primary-btn)]/5 text-[var(--vendor-primary-btn)]"
              : "text-[var(--vendor-text-muted)] hover:bg-[var(--vendor-border)]/30 hover:text-[var(--vendor-text)]",
          )}
        >
          {page.label}
        </button>
      ))}
    </div>

    <div className="space-y-5 p-5">
      {/* Page Title */}
      <BuilderCountedInput
        label="Page Title"
        value={currentPage.title}
        onChange={(v) => updatePage({ title: v })}
        maxLength={100}
      />

      {/* Page Content */}
      <WebsiteRichTextEditor
        label="Page Content"
        value={currentPage.content}
        onChange={(v) => updatePage({ content: v })}
        height="420px"
        showWordCount
        showCharCount={false}
      />
    </div>

    {/* Footer actions */}
    <div className="border-t border-[var(--vendor-border)] p-5">
      <FormActions cancelLabel="Reset" layout="default" />
    </div>
  </div>
);
// ── Page Content Preview ───────────────────────────────────────────────────────
function LegalPagePreview({
  device,
  title,
  content,
}: {
  device: PreviewDevice;
  title: string;
  content: string;
}) {
  return (
    <div className="overflow-hidden rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-white shadow-sm">
      {/* Browser chrome */}
      <div className="flex items-center gap-2 border-b border-[var(--vendor-border)] bg-slate-50 px-3 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
        <div className="ml-3 flex-1 rounded bg-white px-3 py-1 text-[11px] font-semibold text-slate-500">
          yourvendor.com/legal
        </div>
      </div>

      {/* Scaled preview */}
      <div className={device === "mobile" ? "mx-auto max-w-[390px] border-x border-[var(--vendor-border)]" : ""}>
        {/* Navbar stub */}
        <div className="flex items-center justify-between border-b border-slate-100 px-8 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-[var(--vendor-radius-control)] bg-[var(--vendor-primary-btn)]/10 text-[var(--vendor-primary-btn)]">
              <span className="text-sm font-black">EV</span>
            </div>
            <span className="text-sm font-black text-slate-900">Eventify</span>
          </div>
          {device === "desktop" && (
            <div className="flex items-center gap-6 text-[13px] font-semibold text-slate-700">
              {["Home", "About Us", "Services", "Events", "Contact"].map((item) => (
                <span key={item}>{item}</span>
              ))}
              <Button size="sm">Get a Quote</Button>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="px-8 py-8">
          <h1 className="mb-2 text-[28px] font-black text-slate-900">{title}</h1>
          <p className="mb-6 text-[12px] font-semibold text-slate-400">
            Last Updated: May 20, 2024
          </p>
          <div
            className="prose prose-sm max-w-none text-slate-700 [&_h2]:mt-6 [&_h2]:text-[16px] [&_h2]:font-black [&_h2]:text-slate-900 [&_p]:text-[13px] [&_p]:leading-6"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </div>
    </div>
  );
}
  return (
    <WebsiteBuilderLayout
      title="Pages"
      form={form}
      preview={
        <LegalPagePreview
          device={device}
          title={currentPage.title}
          content={currentPage.content}
        />
      }
      previewTitle="Live Website Preview"
      previewSubtitle="This is how your pages will appear on your website."
      previewActions={
        <DesktopMobileToggle value={device} onChange={setDevice} />
      }
      saveLabel="Save Changes"
      contentClassName="xl:grid-cols-[55fr_45fr]"
      leftClassName="border-0 bg-transparent p-0 shadow-none"
    />
  );
}
