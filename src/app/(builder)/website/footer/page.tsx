"use client";

import * as React from "react";
import {
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Twitter,
  Youtube,
} from "lucide-react";
import { WebsiteBuilderLayout } from "../_components/website-builder-layout";
import { FormSection } from "../_components/form-section";
import { ImageUpload } from "../_components/image-upload";
import { ImageCropper } from "../_components/image-cropper-lazy";
import { MultiSelectPages } from "../_components/multi-select-pages";
import {
  BuilderCountedInput,
  BuilderCountedTextarea,
  BuilderSegmentedControl,
} from "../_components/builder-field";
import { ToggleField } from "../_components/toggle-field";
import {
  DesktopMobileToggle,
  type PreviewDevice,
} from "../_components/desktop-mobile-toggle";
import {
  useSaveFooter,
  useSaveVendorAbout,
  useVendorAbout,
  useWebsiteBuilderData,
} from "@/hooks/use-website-builder";
import { useToast } from "@/components/ui/toast";
import { fileToDataUrl, resolveMediaUrl } from "@/lib/utils";
import type { VendorAboutData } from "@/lib/website-builder-api";
import { MAINTENANCE_PAGE_SLUG } from "../pages/_lib/page-store";

type ContactType = "default" | "alternative";

type ContactBlock = {
  mobile: string;
  email: string;
  address: string;
};

type PageOption = {
  label: string;
  value: string;
};

// Footer quick-link options are sourced entirely from the vendor's real pages
// (API), so newly added custom pages appear here automatically. Title-cases a
// stored slug only as a display fallback when a page no longer exists.
const titleCaseSlug = (value: string) =>
  value.replace(/[-_]+/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

const normKey = (value: unknown) =>
  String(value ?? "").toLowerCase().replace(/[^a-z0-9]/g, "");

// Resolve a stored footer value (real slug, id, or a legacy generic key like
// "terms"/"privacy") to the matching real page's slug. Returns null when no
// page matches so stale values are dropped rather than shown as a raw slug.
function resolvePageSlug(
  raw: string,
  pages: Array<Record<string, unknown>>,
): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  const exact = pages.find((page) => {
    const slug = String(page.slug ?? "").replace(/^\/+/, "");
    return slug === trimmed.replace(/^\/+/, "") || String(page.id ?? "") === trimmed;
  });
  if (exact) return String(exact.slug ?? "").replace(/^\/+/, "");

  const target = normKey(trimmed);
  if (!target) return null;
  const fuzzy = pages.find((page) => {
    const slug = normKey(page.slug);
    const title = normKey(page.title);
    return (
      (!!slug && (slug.includes(target) || target.includes(slug))) ||
      (!!title && title.includes(target))
    );
  });
  return fuzzy ? String(fuzzy.slug ?? "").replace(/^\/+/, "") : null;
}

const normalizeSavedPages = (
  raw: string[],
  pages: Array<Record<string, unknown>>,
) => raw.map((value) => resolvePageSlug(value, pages)).filter((value): value is string => !!value);

const socialIcons = [
  { label: "Twitter", icon: Twitter },
  { label: "Instagram", icon: Instagram },
  { label: "Facebook", icon: Facebook },
  { label: "YouTube", icon: Youtube },
];

function useContainerWidth(ref: React.RefObject<HTMLDivElement | null>) {
  const [width, setWidth] = React.useState(0);

  React.useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new ResizeObserver(([entry]) => {
      setWidth(entry.contentRect.width);
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);

  return width;
}

function getStringArray(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
}

export default function FooterPage() {
  const { data: builderData } = useWebsiteBuilderData();
  const { data: vendorData } = useVendorAbout();
  const saveFooter = useSaveFooter();
  const saveVendorAbout = useSaveVendorAbout();
  const { showToast } = useToast();

  const loadedFooterRef = React.useRef(false);
  const loadedVendorRef = React.useRef(false);

  const [companyName, setCompanyName] = React.useState("");
  const [companyLogo, setCompanyLogo] = React.useState("");
  const [shortDescription, setShortDescription] = React.useState("");
  const [showSocialLinks, setShowSocialLinks] = React.useState(true);
  const [topListHeading, setTopListHeading] = React.useState("Quick Links");
  const [selectedPages, setSelectedPages] = React.useState<string[]>([]);
  const [newsletterEnabled, setNewsletterEnabled] = React.useState(true);
  const [contactType, setContactType] = React.useState<ContactType>("default");
  const [defaultContact, setDefaultContact] = React.useState<ContactBlock>({
    mobile: "",
    email: "",
    address: "",
  });
  const [alternativeContact, setAlternativeContact] = React.useState<ContactBlock>({
    mobile: "",
    email: "",
    address: "",
  });
  const [previewDevice, setPreviewDevice] = React.useState<PreviewDevice>("desktop");
  const [isSaving, setIsSaving] = React.useState(false);
  const [imageToCrop, setImageToCrop] = React.useState("");

  const previewRef = React.useRef<HTMLDivElement>(null);
  const previewWidth = useContainerWidth(previewRef);
  const useStackedLayout = previewDevice === "mobile" || (previewWidth > 0 && previewWidth < 520);

  const activeContact =
    contactType === "alternative" ? alternativeContact : defaultContact;

  const pageOptions: PageOption[] = [];
  for (const page of builderData?.pages ?? []) {
    const slug = typeof page.slug === "string" ? page.slug.trim() : "";
    if (
      !slug ||
      slug === MAINTENANCE_PAGE_SLUG ||
      pageOptions.some((option) => option.value === slug)
    ) continue;

    const title =
      typeof page.title === "string" && page.title.trim().length > 0
        ? page.title.trim()
        : slug;

    pageOptions.push({ label: title, value: slug });
  }

  const quickLinkLabels = selectedPages
    .map((value) => pageOptions.find((option) => option.value === value)?.label ?? titleCaseSlug(value))
    .filter(Boolean);

  const copyright = vendorData?.copywrite || "";
  const poweredBy = vendorData?.poweredby || "";

  const applyVendorData = React.useCallback((vendor: VendorAboutData) => {
    setCompanyName(vendor.company_name || "");
    setCompanyLogo(vendor.company_logo || "");
    setShortDescription(vendor.short_description || "");
    setContactType(vendor.contact_mode === "alternative" ? "alternative" : "default");
    setDefaultContact({
      mobile: vendor.company_contact || "",
      email: (vendor.company_email || "").toLowerCase(),
      address: vendor.company_address || "",
    });
    setAlternativeContact({
      mobile: vendor.contact || "",
      email: (vendor.alt_email || "").toLowerCase(),
      address: vendor.address || "",
    });
  }, []);

  const updateActiveContact = (patch: Partial<ContactBlock>) => {
    if (contactType === "alternative") {
      setAlternativeContact((prev) => ({ ...prev, ...patch }));
      return;
    }

    setDefaultContact((prev) => ({ ...prev, ...patch }));
  };

  React.useEffect(() => {
    if (loadedVendorRef.current || !vendorData) return;
    applyVendorData(vendorData);
    loadedVendorRef.current = true;
  }, [applyVendorData, vendorData]);

  React.useEffect(() => {
    if (loadedFooterRef.current || !builderData?.footer) return;

    const footer = builderData.footer as Record<string, unknown>;

    setShowSocialLinks(Boolean(footer.show_social_links ?? true));
    setTopListHeading(String(footer.top_list_heading || "Quick Links"));

    const savedPages =
      getStringArray(footer.add_pages_json).length > 0
        ? getStringArray(footer.add_pages_json)
        : getStringArray(footer.selected_pages);
    setSelectedPages(
      normalizeSavedPages(savedPages, builderData?.pages ?? []),
    );

    setNewsletterEnabled(
      Boolean(footer.show_newsletter ?? footer.newsletter_enabled ?? true),
    );

    loadedFooterRef.current = true;
  }, [builderData]);

  const handleLogoSelect = async (file: File) => {
    try {
      setImageToCrop(await fileToDataUrl(file));
    } catch {
      showToast("Unable to read logo image", "error");
    }
  };

  const handleLogoCropComplete = (croppedBase64: string) => {
    setCompanyLogo(croppedBase64);
    setImageToCrop("");
  };

  const handleSave = async () => {
    setIsSaving(true);

    try {
      await saveVendorAbout.mutateAsync({
        company_name: companyName.trim(),
        company_logo: companyLogo || null,
        short_description: shortDescription.trim(),
        company_contact: defaultContact.mobile.trim(),
        company_email: defaultContact.email.trim().toLowerCase(),
        company_address: defaultContact.address.trim(),
        contact: alternativeContact.mobile.trim(),
        alt_email: alternativeContact.email.trim().toLowerCase(),
        address: alternativeContact.address.trim(),
        contact_mode: contactType,
      });

      await saveFooter.mutateAsync({
        topListHeading: topListHeading.trim(),
        selectedPages,
        newsletterEnabled,
        showSocialLinks,
      });

      showToast("Footer settings saved");
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Unable to save footer settings",
        "error",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setCompanyName("");
    setCompanyLogo("");
    setShortDescription("");
    setShowSocialLinks(false);
    setTopListHeading("");
    setSelectedPages([]);
    setNewsletterEnabled(false);
    setContactType("default");
    setDefaultContact({ mobile: "", email: "", address: "" });
    setAlternativeContact({ mobile: "", email: "", address: "" });
    setImageToCrop("");
    setPreviewDevice("desktop");
  };

  const form = (
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
      <div className="flex min-w-0 flex-col gap-3">
        <FormSection
          title="Company Information"
          className="rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-[var(--vendor-panel-bg)] p-3 shadow-sm"
        >
          <div className="flex min-w-0 flex-col gap-2">
  <div className="w-full max-w-[220px]">
    <ImageUpload
      label="Company Logo"
      value={resolveMediaUrl(companyLogo)}
      recommendedSize="Wide logo ~ 420×120px (transparent PNG)"
      maxFileSize="2MB"
      maxSizeMb={2}
      onFileSelect={handleLogoSelect}
      onRemove={() => setCompanyLogo("")}
      alt="Footer logo"
      previewClassName="h-16 object-contain bg-white p-2"
      uploadClassName="min-h-24"
    />
  </div>

  <BuilderCountedInput
    label="Company Name"
    value={companyName}
    onChange={setCompanyName}
    maxLength={100}
    inputClassName="!h-7 text-[10px]"
  />
  <BuilderCountedTextarea
    label="Short Description"
    value={shortDescription}
    onChange={setShortDescription}
    maxLength={200}
    textareaClassName="!min-h-[5.5rem] resize-y text-[10px]"
  />
</div>
        </FormSection>

        <FormSection
          title="Contact Info"
          className="rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-[var(--vendor-panel-bg)] p-3 shadow-sm space-y-2"
        >
          <BuilderSegmentedControl<ContactType>
            label="Contact Type"
            value={contactType}
            onChange={setContactType}
            options={[
              { label: "Default", value: "default" },
              { label: "Alternative", value: "alternative" },
            ]}
            layout="wrap"
          />

<div className="flex min-w-0 flex-col gap-2">
            <BuilderCountedInput
              label="Mobile"
              value={activeContact.mobile}
              onChange={(value) => updateActiveContact({ mobile: value })}
              maxLength={30}
              inputClassName="!h-7 text-[10px]"
            />
            <BuilderCountedInput
              label="Email"
              value={activeContact.email}
              onChange={(value) => updateActiveContact({ email: value })}
              maxLength={100}
              inputClassName="!h-7 text-[10px]"
            />
          </div>

          <BuilderCountedTextarea
            label="Address"
            value={activeContact.address}
            onChange={(value) => updateActiveContact({ address: value })}
            maxLength={200}
            textareaClassName="!min-h-[3rem] !max-h-[3rem] text-[10px]"
          />
        </FormSection>
      </div>

      <div className="flex min-w-0 flex-col gap-3">
        <FormSection
          title="Menu Settings"
          className="rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-[var(--vendor-panel-bg)] p-3 shadow-sm space-y-2"
        >
          <BuilderCountedInput
            label="Top List Heading"
            value={topListHeading}
            onChange={setTopListHeading}
            maxLength={80}
            inputClassName="!h-7 text-[10px]"
          />
          <MultiSelectPages
            label="Add Pages"
            value={selectedPages}
            options={pageOptions}
            onChange={setSelectedPages}
            placeholder="Add page"
          />
          <ToggleField
            label="Enable Newsletter"
            description="Allow visitors to subscribe to your newsletter."
            checked={newsletterEnabled}
            onCheckedChange={setNewsletterEnabled}
            className="rounded-[var(--vendor-radius-control)] border border-[var(--vendor-border)] bg-slate-50/60 px-2.5 py-2"
          />
          <ToggleField
            label="Show Social Links"
            description="Display social media links in footer."
            checked={showSocialLinks}
            onCheckedChange={setShowSocialLinks}
            className="rounded-[var(--vendor-radius-control)] border border-[var(--vendor-border)] bg-slate-50/60 px-2.5 py-2"
          />
        </FormSection>

        <FormSection
          title="Footer Bottom"
          className="rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-[var(--vendor-panel-bg)] p-3 shadow-sm space-y-2"
        >
<div className="flex min-w-0 flex-col gap-2">
            <BuilderCountedInput
              label="Copyright"
              value={copyright}
              onChange={() => undefined}
              maxLength={120}
              lockInput
              showCount={false}
              labelClassName="text-[9px] font-black uppercase tracking-wide text-slate-500"
              inputClassName="!h-7 text-[10px]"
            />
            <BuilderCountedInput
              label="Powered By"
              value={poweredBy}
              onChange={() => undefined}
              maxLength={80}
              lockInput
              showCount={false}
              labelClassName="text-[9px] font-black uppercase tracking-wide text-slate-500"
              inputClassName="!h-7 text-[10px]"
            />
          </div>
        </FormSection>
      </div>
    </div>
  );

  const previewContent = (
    <div
      ref={previewRef}
      className="flex h-full w-full flex-col justify-end overflow-hidden rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)]"
    >
      <div className="bg-[#0B0D17] text-white">
        <div
          className="gap-4 px-5 pb-4 pt-5"
          style={{
            display: "grid",
            gridTemplateColumns: useStackedLayout ? "1fr" : "1.4fr 1fr 1fr",
          }}
        >
          <div className="flex flex-col gap-2">
            <p className="text-[13px] font-black text-white">{companyName}</p>
            <p className="text-[10px] leading-relaxed text-white/60">
              {shortDescription}
            </p>
            {showSocialLinks ? (
              <div className="mt-1 flex items-center gap-2">
                {socialIcons.map(({ label, icon: Icon }) => (
                  <div
                    key={label}
                    className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-[#6C47FF]"
                  >
                    <Icon className="h-3 w-3 text-white" />
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          <div className="flex flex-col gap-1.5">
            <p className="mb-1 text-[11px] font-black text-white">{topListHeading}</p>
            {quickLinkLabels.length > 0 ? (
              quickLinkLabels.map((label) => (
                <p
                  key={label}
                  className="cursor-pointer text-[10px] text-white/60 transition-colors hover:text-white"
                >
                  {label}
                </p>
              ))
            ) : (
              <p className="text-[10px] italic text-white/30">No pages selected</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <p className="mb-1 text-[11px] font-black text-white">Contact Us</p>
            <div className="flex items-start gap-1.5">
              <Phone className="mt-0.5 h-3 w-3 shrink-0 text-[#6C47FF]" />
              <p className="text-[10px] text-white/60">{activeContact.mobile}</p>
            </div>
            <div className="flex items-start gap-1.5">
              <Mail className="mt-0.5 h-3 w-3 shrink-0 text-[#6C47FF]" />
              <p className="text-[10px] text-white/60">{activeContact.email}</p>
            </div>
            <div className="flex items-start gap-1.5">
              <MapPin className="mt-0.5 h-3 w-3 shrink-0 text-[#6C47FF]" />
              <p className="text-[10px] leading-relaxed text-white/60">
                {activeContact.address}
              </p>
            </div>
            {newsletterEnabled ? (
              <div className="mt-2 flex gap-1">
                <input
                  type="email"
                  placeholder="Your email"
                  readOnly
                  className="min-w-0 flex-1 rounded-l-md bg-white/10 px-2 py-1 text-[9px] text-white outline-none placeholder:text-white/40"
                />
                <div className="shrink-0 cursor-pointer rounded-r-md bg-[#6C47FF] px-2 py-1 text-[9px] font-bold text-white">
                  Subscribe
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-1 border-t border-white/10 px-5 py-2.5">
          <p className="text-[9px] text-white/40">{copyright}</p>
          <p className="text-[9px] text-white/30">{poweredBy}</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <WebsiteBuilderLayout
        title="Footer Settings"
        form={form}
        preview={previewContent}
        previewDevice={previewDevice}
        previewHeaderAction={
          <DesktopMobileToggle value={previewDevice} onChange={setPreviewDevice} />
        }
        onCancel={handleCancel}
        leftClassName="border-0 bg-transparent p-0 shadow-none"
        primaryButton={{
          label: "Save Changes",
          onClick: handleSave,
          isLoading: isSaving,
        }}
        howItWorksLabel="How It Works"
        onHowItWorks={() => alert("This is where you'd explain how to use the footer editor.")}
      />
      <ImageCropper
        open={Boolean(imageToCrop)}
        imageSrc={imageToCrop}
        onClose={() => setImageToCrop("")}
        onCropComplete={handleLogoCropComplete}
        aspectRatio={3.5}
        outputWidth={420}
        outputHeight={120}
        outputType="image/png"
        title="Crop Footer Logo"
      />
    </>
  );
}
