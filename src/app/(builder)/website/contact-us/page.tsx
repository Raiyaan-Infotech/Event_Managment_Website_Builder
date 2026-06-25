"use client";

import * as React from "react";
import { Icon } from "@iconify/react";
import {
  ChevronDown,
  Code2,
  FileUp,
  Mail,
  Map as MapIcon,
  MapPin,
  Phone,
  Send,
  Share2,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import {
  useContactCategories,
  useSaveContactSettings,
  useSaveContactSocialLinks,
  useVendorAbout,
  useWebsiteBuilderData,
} from "@/hooks/use-website-builder";
import { WebsiteBuilderLayout } from "../_components/website-builder-layout";
import { FormSection } from "../_components/form-section";
import {
  BuilderCountedInput,
  BuilderCountedTextarea,
  BuilderIconOptionGroup,
} from "../_components/builder-field";
import { ToggleField } from "../_components/toggle-field";
import type { PreviewDevice } from "../_components/desktop-mobile-toggle";

type ContactMode = "static" | "dynamic";
type ContactFieldType =
  | "name"
  | "email"
  | "phone"
  | "message"
  | "dropdown"
  | "checkbox"
  | "radio"
  | "file";

interface ContactFieldInstance {
  id: string;
  type: ContactFieldType;
  label: string;
  placeholder: string;
  required: boolean;
}

interface ContactSocialLink {
  id: string;
  socialLinkId?: string;
  label: string;
  url: string;
  color: string;
  iconName: string;
  show: boolean;
}

type LeafletLatLng = [number, number];

type LeafletInstance = {
  map: (
    element: HTMLElement,
    options?: Record<string, unknown>,
  ) => {
    setView: (center: LeafletLatLng, zoom: number) => LeafletMapInstance;
    remove: () => void;
    invalidateSize: () => void;
  };
  tileLayer: (
    url: string,
    options?: Record<string, unknown>,
  ) => { addTo: (map: LeafletMapInstance) => void };
  marker: (
    center: LeafletLatLng,
    options?: Record<string, unknown>,
  ) => LeafletMarkerInstance;
  divIcon: (options: Record<string, unknown>) => unknown;
};

type LeafletMapInstance = {
  setView: (center: LeafletLatLng, zoom: number) => LeafletMapInstance;
  remove: () => void;
  invalidateSize: () => void;
};

type LeafletMarkerInstance = {
  addTo: (map: LeafletMapInstance) => LeafletMarkerInstance;
  setLatLng: (center: LeafletLatLng) => void;
};

declare global {
  interface Window {
    L?: LeafletInstance;
    __contactLeafletPromise?: Promise<LeafletInstance>;
  }
}

const panelCard =
  "rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-white p-3 shadow-sm";

const INITIAL_FIELDS: ContactFieldInstance[] = [
  {
    id: "name",
    type: "name",
    label: "Name",
    placeholder: "Enter your name",
    required: true,
  },
  {
    id: "email",
    type: "email",
    label: "Email",
    placeholder: "Enter your email",
    required: true,
  },
  {
    id: "message",
    type: "message",
    label: "Message",
    placeholder: "Type your message here...",
    required: true,
  },
];

const DEFAULT_SOCIAL_LINKS: ContactSocialLink[] = [
  {
    id: "facebook",
    label: "Facebook",
    url: "https://facebook.com/yourpage",
    color: "#1877F2",
    iconName: "simple-icons:facebook",
    show: true,
  },
  {
    id: "twitter",
    label: "Twitter",
    url: "https://twitter.com/yourpage",
    color: "#1DA1F2",
    iconName: "simple-icons:x",
    show: true,
  },
  {
    id: "instagram",
    label: "Instagram",
    url: "https://instagram.com/yourpage",
    color: "#E4405F",
    iconName: "simple-icons:instagram",
    show: true,
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    url: "https://linkedin.com/company/yourpage",
    color: "#0A66C2",
    iconName: "simple-icons:linkedin",
    show: true,
  },
];

const DEFAULT_CONTACT_SETTINGS = {
  mode: "static" as ContactMode,
  showSocialLinks: true,
  showGoogleMap: true,
  latitude: "17.385044",
  longitude: "78.486671",
  socialVisibility: {} as Record<string, boolean>,
};

function parseSettingsRecord(value: unknown) {
  if (!value) return {};

  try {
    const parsed = typeof value === "string" ? JSON.parse(value) : value;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return {};
    }
    return parsed as Record<string, unknown>;
  } catch {
    return {};
  }
}

function parseContactSettings(value: unknown) {
  const root = parseSettingsRecord(value);
  const contact =
    root.contact_us && typeof root.contact_us === "object" && !Array.isArray(root.contact_us)
      ? (root.contact_us as Record<string, unknown>)
      : root;
  const visibility =
    contact.social_visibility &&
    typeof contact.social_visibility === "object" &&
    !Array.isArray(contact.social_visibility)
      ? (contact.social_visibility as Record<string, boolean>)
      : {};

  return {
    mode: (contact.mode === "dynamic" ? "dynamic" : "static") as ContactMode,
    showSocialLinks: Boolean(
      contact.show_social_links ??
        contact.showSocialLinks ??
        DEFAULT_CONTACT_SETTINGS.showSocialLinks,
    ),
    showGoogleMap: Boolean(
      contact.show_google_map ??
        contact.showGoogleMap ??
        DEFAULT_CONTACT_SETTINGS.showGoogleMap,
    ),
    latitude: String(contact.latitude || DEFAULT_CONTACT_SETTINGS.latitude),
    longitude: String(contact.longitude || DEFAULT_CONTACT_SETTINGS.longitude),
    socialVisibility: visibility,
  };
}

function mapBuilderSocialLinks(
  links: Array<{
    id?: string | number | null;
    icon_key?: string | null;
    icon?: string | null;
    label?: string | null;
    url?: string | null;
    icon_color?: string | null;
    color?: string | null;
  }> = [],
  legacyVisibility: Record<string, boolean> = {},
  contactSocialLinks: Array<Record<string, unknown>> = [],
): ContactSocialLink[] {
  const contactVisibility = new Map(
    contactSocialLinks
      .filter((item) => item.social_link_id != null)
      .map((item) => [
        String(item.social_link_id),
        Boolean(item.is_visible ?? item.isVisible ?? item.is_active ?? true),
      ]),
  );

  if (!links.length) {
    return DEFAULT_SOCIAL_LINKS.map((link) => ({
      ...link,
      show: legacyVisibility[link.id] ?? true,
    }));
  }

  return links.map((link, index) => {
    const fallback = DEFAULT_SOCIAL_LINKS[index] || DEFAULT_SOCIAL_LINKS[0];
    const id = String(link.id || link.icon_key || link.icon || fallback.id);
    const socialLinkId = link.id == null ? undefined : String(link.id);

    return {
      id,
      socialLinkId,
      label: String(link.label || fallback.label),
      url: String(link.url || fallback.url),
      color: String(link.icon_color || link.color || fallback.color),
      iconName: String(link.icon_key || link.icon || fallback.iconName),
      show:
        (socialLinkId ? contactVisibility.get(socialLinkId) : undefined) ??
        legacyVisibility[id] ??
        legacyVisibility[String(link.icon_key || link.icon || "")] ??
        true,
    };
  });
}

function loadLeaflet() {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Leaflet can only load in the browser"));
  }

  if (window.L) {
    return Promise.resolve(window.L);
  }

  if (window.__contactLeafletPromise) {
    return window.__contactLeafletPromise;
  }

  window.__contactLeafletPromise = new Promise<LeafletInstance>((resolve, reject) => {
    if (!document.querySelector('link[data-contact-leaflet-css="true"]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      link.dataset.contactLeafletCss = "true";
      document.head.appendChild(link);
    }

    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[data-contact-leaflet-js="true"]',
    );

    if (existingScript) {
      existingScript.addEventListener("load", () => {
        if (window.L) resolve(window.L);
      });
      existingScript.addEventListener("error", () =>
        reject(new Error("Failed to load Leaflet")),
      );
      return;
    }

    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.async = true;
    script.dataset.contactLeafletJs = "true";
    script.onload = () => {
      if (window.L) {
        resolve(window.L);
      } else {
        reject(new Error("Leaflet did not initialize"));
      }
    };
    script.onerror = () => reject(new Error("Failed to load Leaflet"));
    document.body.appendChild(script);
  });

  return window.__contactLeafletPromise;
}

function readMapCenter(latitude: string, longitude: string): LeafletLatLng {
  const lat = Number.parseFloat(latitude);
  const lng = Number.parseFloat(longitude);

  if (Number.isFinite(lat) && Number.isFinite(lng)) {
    return [lat, lng];
  }

  return [
    Number.parseFloat(DEFAULT_CONTACT_SETTINGS.latitude),
    Number.parseFloat(DEFAULT_CONTACT_SETTINGS.longitude),
  ];
}

function ContactInfoCards({
  email,
  mobile,
  address,
  previewDevice,
  compact = false,
}: {
  email: string;
  mobile: string;
  address: string;
  previewDevice: PreviewDevice;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        "grid gap-3",
        previewDevice === "mobile" ? "grid-cols-1" : "md:grid-cols-3",
      )}
    >
      {[
        { label: "Email", value: email, icon: Mail },
        { label: "Mobile", value: mobile, icon: Phone },
        { label: "Address", value: address, icon: MapPin },
      ].map((item) => {
        const ItemIcon = item.icon;

        return (
          <div
            key={item.label}
            className={cn(
              "rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-white text-center shadow-xs",
              compact ? "min-h-[130px] p-4" : "min-h-[148px] p-5",
            )}
          >
            <div
              className={cn(
                "mx-auto flex items-center justify-center rounded-full bg-[var(--vendor-primary-btn)]/10 text-[var(--vendor-primary-btn)]",
                compact ? "h-11 w-11" : "h-14 w-14",
              )}
            >
              <ItemIcon className={compact ? "h-5 w-5" : "h-6 w-6"} />
            </div>
            <p className="mt-3 text-[11px] font-black uppercase text-slate-900 sm:text-[12px]">
              {item.label}
            </p>
            <p className="mx-auto mt-1.5 max-w-[220px] whitespace-pre-line text-[10px] font-semibold leading-4 text-slate-700 sm:text-[11px] sm:leading-5">
              {item.value || "-"}
            </p>
          </div>
        );
      })}
    </div>
  );
}

function SocialPreview({ socialLinks }: { socialLinks: ContactSocialLink[] }) {
  const visibleSocialLinks = socialLinks.filter((link) => link.show);

  return (
    <div className="text-center">
      <p className="text-[12px] font-black uppercase text-slate-900">Follow Us</p>
      <span className="mx-auto mt-2 block h-1 w-8 rounded-full bg-[var(--vendor-primary-btn)]" />
      <div className="mt-5 flex flex-wrap justify-center gap-4">
        {visibleSocialLinks.map((link) => (
          <span
            key={link.id}
            className="flex h-10 w-10 items-center justify-center rounded-full text-white shadow-sm"
            style={{ backgroundColor: link.color }}
            title={link.label}
          >
            <Icon icon={link.iconName} className="h-4 w-4" />
          </span>
        ))}
      </div>
    </div>
  );
}

function MapPreview({
  latitude,
  longitude,
  compact = false,
}: {
  latitude: string;
  longitude: string;
  compact?: boolean;
}) {
  const mapRef = React.useRef<HTMLDivElement | null>(null);
  const leafletMapRef = React.useRef<LeafletMapInstance | null>(null);
  const markerRef = React.useRef<LeafletMarkerInstance | null>(null);
  const center = React.useMemo(
    () => readMapCenter(latitude, longitude),
    [latitude, longitude],
  );

  React.useEffect(() => {
    let cancelled = false;

    loadLeaflet()
      .then((leaflet) => {
        if (cancelled || !mapRef.current) return;

        if (!leafletMapRef.current) {
          const map = leaflet
            .map(mapRef.current, {
              attributionControl: false,
              scrollWheelZoom: false,
              zoomControl: true,
            })
            .setView(center, 11);

          leaflet
            .tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
              maxZoom: 19,
            })
            .addTo(map);

          const markerIcon = leaflet.divIcon({
            className: "",
            html: '<span style="display:block;width:22px;height:22px;border-radius:999px;background:#EF4444;border:4px solid #fff;box-shadow:0 8px 22px rgba(15,23,42,.28);"></span>',
            iconSize: [22, 22],
            iconAnchor: [11, 11],
          });

          markerRef.current = leaflet
            .marker(center, { icon: markerIcon })
            .addTo(map);
          leafletMapRef.current = map;
          window.setTimeout(() => map.invalidateSize(), 120);
          return;
        }

        leafletMapRef.current.setView(center, 11);
        markerRef.current?.setLatLng(center);
        window.setTimeout(() => leafletMapRef.current?.invalidateSize(), 80);
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, [center]);

  React.useEffect(() => {
    return () => {
      leafletMapRef.current?.remove();
      leafletMapRef.current = null;
      markerRef.current = null;
    };
  }, []);

  return (
    <div className="relative overflow-hidden rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-slate-100">
      <div
        ref={mapRef}
        className={cn("w-full", compact ? "h-[240px]" : "h-[260px] sm:h-[320px]")}
      />
      <div className="pointer-events-none absolute left-4 top-4 flex items-center gap-2 rounded bg-white/95 px-3 py-2 text-[11px] font-bold text-slate-700 shadow-sm">
        <MapIcon className="h-4 w-4 text-[var(--vendor-primary-btn)]" />
        Leaflet Map
      </div>
    </div>
  );
}

function DynamicFieldPreview({
  fields,
  previewDevice,
  categories,
}: {
  fields: ContactFieldInstance[];
  previewDevice: PreviewDevice;
  categories: Array<{ id: string; name: string }>;
}) {
  return (
    <div
      className={cn(
        "mx-auto grid max-w-3xl gap-4",
        previewDevice === "mobile" ? "grid-cols-1" : "md:grid-cols-2",
      )}
    >
      {fields.map((field, index) => {
        const isMessage = field.type === "message";
        const isFullWidth =
          isMessage || field.type === "dropdown" || field.type === "file";

        return (
          <React.Fragment key={field.id}>
            <div
              className={cn(
                "space-y-1.5",
                previewDevice !== "mobile" && isFullWidth && "md:col-span-2",
              )}
            >
              <p className="text-[11px] font-semibold text-slate-600">
                {field.label}
                {field.required ? <span className="ml-1 text-rose-500">*</span> : null}
              </p>
              {field.type === "message" ? (
                <Textarea
                  placeholder={field.placeholder}
                  className="min-h-[120px] resize-none text-[12px]"
                />
              ) : field.type === "dropdown" ? (
                <div className="flex h-10 items-center justify-between rounded-[var(--vendor-radius-control)] border border-[var(--vendor-border)] bg-white px-3 text-[12px] font-medium text-slate-400">
                  <span>{field.placeholder}</span>
                  <ChevronDown className="h-4 w-4" />
                </div>
              ) : field.type === "checkbox" ? (
                <label className="flex h-10 items-center gap-2 rounded-[var(--vendor-radius-control)] border border-[var(--vendor-border)] px-3 text-[12px] font-medium text-slate-600">
                  <input type="checkbox" className="h-4 w-4" />
                  <span>{field.label}</span>
                </label>
              ) : field.type === "radio" ? (
                <label className="flex h-10 items-center gap-2 rounded-[var(--vendor-radius-control)] border border-[var(--vendor-border)] px-3 text-[12px] font-medium text-slate-600">
                  <input type="radio" className="h-4 w-4" />
                  <span>{field.label}</span>
                </label>
              ) : field.type === "file" ? (
                <label className="flex h-10 cursor-pointer items-center gap-2 rounded-[var(--vendor-radius-control)] border border-dashed border-[var(--vendor-border)] px-3 text-[12px] font-medium text-slate-500">
                  <FileUp className="h-4 w-4" />
                  <span>{field.placeholder}</span>
                </label>
              ) : (
                <Input placeholder={field.placeholder} className="h-10 text-[12px]" />
              )}
            </div>
            {index === 1 ? (
              <div
                className={cn(
                  "space-y-1.5",
                  previewDevice !== "mobile" && "md:col-span-2",
                )}
              >
                <p className="text-[11px] font-semibold text-slate-600">
                  Category <span className="ml-1 text-rose-500">*</span>
                </p>
                <div className="flex h-10 items-center justify-between rounded-[var(--vendor-radius-control)] border border-[var(--vendor-border)] bg-white px-3 text-[12px] font-medium text-slate-400">
                  <span>Select a Category</span>
                  <ChevronDown className="h-4 w-4" />
                </div>
              </div>
            ) : null}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function ContactPagePreview({
  mode,
  title,
  description,
  submitLabel,
  privacyNote,
  fields,
  categories,
  previewDevice,
  email,
  mobile,
  address,
  socialLinks,
  showSocialLinks,
  showGoogleMap,
  latitude,
  longitude,
}: {
  mode: ContactMode;
  title: string;
  description: string;
  submitLabel: string;
  privacyNote: string;
  fields: ContactFieldInstance[];
  categories: Array<{ id: string; name: string }>;
  previewDevice: PreviewDevice;
  email: string;
  mobile: string;
  address: string;
  socialLinks: ContactSocialLink[];
  showSocialLinks: boolean;
  showGoogleMap: boolean;
  latitude: string;
  longitude: string;
}) {
  const isDynamic = mode === "dynamic";

  return (
    <div className="rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-white p-4 shadow-sm sm:p-5">
      <div className="mx-auto max-w-5xl rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-white px-4 py-5 shadow-sm sm:px-5 sm:py-6">
        <div className="text-center">
          <p className="text-[9px] font-black uppercase tracking-wide text-[var(--vendor-primary-btn)]">
            Get In Touch
          </p>
          <h2 className="mt-1.5 text-[20px] font-black uppercase leading-tight text-slate-950 sm:text-[24px]">
            {isDynamic ? title : "Contact Us"}
          </h2>
          <span className="mx-auto mt-2.5 block h-0.5 w-10 rounded-full bg-[var(--vendor-primary-btn)]" />
          <p className="mx-auto mt-3 max-w-xl text-[10px] font-medium leading-4 text-slate-600">
            {isDynamic
              ? description
              : "We are here to help and answer any question you might have."}
          </p>
        </div>

        {!isDynamic ? (
          <div className="mt-8">
            <ContactInfoCards
              email={email}
              mobile={mobile}
              address={address}
              previewDevice={previewDevice}
            />
          </div>
        ) : null}

        {isDynamic ? (
          <>
            <div className="mt-6">
              <DynamicFieldPreview
                fields={fields}
                previewDevice={previewDevice}
                categories={categories}
              />
            </div>
            <div className="mt-5 flex flex-col items-center gap-2.5">
              <Button className="h-9 px-4 text-[11px] font-bold">
                <Send className="h-3.5 w-3.5" />
                {submitLabel}
              </Button>
              {privacyNote ? (
                <p className="flex items-center gap-1.5 text-center text-[10px] font-medium text-slate-400">
                  <Shield className="h-3 w-3" />
                  {privacyNote}
                </p>
              ) : null}
            </div>
          </>
        ) : null}

        {showSocialLinks ? (
          <div className="mt-6">
            <SocialPreview socialLinks={socialLinks} />
          </div>
        ) : null}

        {showGoogleMap ? (
          <div className="mt-6">
            <MapPreview latitude={latitude} longitude={longitude} compact={isDynamic} />
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default function ContactUsBuilderPage() {
  const { data: builderData } = useWebsiteBuilderData();
  const { data: vendorData } = useVendorAbout();
  const { data: contactCategoryRecords = [] } = useContactCategories();
  const saveContactSettings = useSaveContactSettings();
  const saveContactSocialLinks = useSaveContactSocialLinks();
  const { showToast } = useToast();

  const loadedRef = React.useRef(false);
  const [mode, setMode] = React.useState<ContactMode>("static");
  const [previewDevice, setPreviewDevice] = React.useState<PreviewDevice>("desktop");
  const [showSocialLinks, setShowSocialLinks] = React.useState(true);
  const [showGoogleMap, setShowGoogleMap] = React.useState(true);
  const [email, setEmail] = React.useState("");
  const [mobile, setMobile] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [latitude, setLatitude] = React.useState(DEFAULT_CONTACT_SETTINGS.latitude);
  const [longitude, setLongitude] = React.useState(DEFAULT_CONTACT_SETTINGS.longitude);
  const [socialLinks, setSocialLinks] = React.useState<ContactSocialLink[]>(DEFAULT_SOCIAL_LINKS);
  const [isSaving, setIsSaving] = React.useState(false);

  const formTitle = "Contact Us";
  const formDescription =
    "We'd love to hear from you! Send us a message and we'll respond as soon as possible.";
  const submitLabel = "Send Message";
  const privacyNote =
    "Your information is safe with us. We don't share your details with anyone.";
  const [formFields] = React.useState<ContactFieldInstance[]>(INITIAL_FIELDS);
  const contactCategories = React.useMemo(
    () =>
      (contactCategoryRecords as Array<Record<string, unknown>>)
        .filter((category) => category.is_active !== false && category.is_active !== 0)
        .map((category) => ({
          id: String(category.id || ""),
          name: String(category.name || "Contact Enquiry"),
        })),
    [contactCategoryRecords],
  );

  React.useEffect(() => {
    if (loadedRef.current || !builderData || !vendorData) return;

    const basicInformation = builderData.basicInformation as
      | Record<string, unknown>
      | null
      | undefined;
    const contactSettings = (builderData.contactSettings || {}) as Record<string, unknown>;
    const legacySettings = parseContactSettings(basicInformation?.social_links_json);

    setMode((contactSettings.mode === "dynamic" ? "dynamic" : contactSettings.mode === "static" ? "static" : legacySettings.mode) as ContactMode);
    setShowSocialLinks(Boolean(contactSettings.social_links_enabled ?? legacySettings.showSocialLinks));
    setShowGoogleMap(Boolean(contactSettings.google_map_enabled ?? legacySettings.showGoogleMap));
    setLatitude(String(vendorData.latitude || DEFAULT_CONTACT_SETTINGS.latitude));
    setLongitude(String(vendorData.longitude || DEFAULT_CONTACT_SETTINGS.longitude));
    setEmail(String(contactSettings.email || vendorData.company_email || vendorData.alt_email || ""));
    setMobile(String(contactSettings.mobile || vendorData.company_contact || vendorData.contact || vendorData.alt_contact || ""));
    setAddress(String(contactSettings.address || vendorData.company_address || vendorData.address || vendorData.alt_address || ""));
    setSocialLinks(
      mapBuilderSocialLinks(
        builderData.socialLinks,
        legacySettings.socialVisibility,
        builderData.contactSocialLinks,
      ),
    );

    loadedRef.current = true;
  }, [builderData, vendorData]);

  const updateSocialLink = (id: string, patch: Partial<ContactSocialLink>) => {
    setSocialLinks((current) =>
      current.map((link) => (link.id === id ? { ...link, ...patch } : link)),
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const savedSettings = await saveContactSettings.mutateAsync({
        mode,
        email: email.trim(),
        mobile: mobile.trim(),
        address: address.trim(),
        contact_form_enabled: mode === "dynamic",
        social_links_enabled: showSocialLinks,
        google_map_enabled: showGoogleMap,
        is_active: true,
      });
      const contactSettingId = savedSettings.id || builderData?.contactSettings?.id;

      if (contactSettingId) {
        await saveContactSocialLinks.mutateAsync(
          socialLinks
            .filter((link) => link.socialLinkId)
            .map((link, index) => ({
              contact_setting_id: contactSettingId,
              social_link_id: link.socialLinkId,
              sort_order: index + 1,
              is_visible: link.show,
              is_active: true,
            })),
        );
      }

      showToast("Contact Us saved");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to save Contact Us";
      showToast(message, "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setMode("static");
    setShowSocialLinks(false);
    setShowGoogleMap(false);
    setEmail("");
    setMobile("");
    setAddress("");
    setLatitude("");
    setLongitude("");
    setSocialLinks((current) =>
      current.map((link) => ({ ...link, show: false })),
    );
    setPreviewDevice("desktop");
  };

  const editorChooser = (
    <FormSection
      title="Choose Your Editor"
      subtitle="Select how you want to build your contact section."
      className={panelCard}
    >
      <BuilderIconOptionGroup
        value={mode}
        onChange={setMode}
        columns="2"
        className="[&>button]:flex-row [&>button]:items-center [&>button]:justify-start [&>button]:gap-2.5"
        optionClassName="min-h-[52px] rounded-[10px] px-3 py-2 text-left [&>span:first-child]:flex [&>span:first-child]:h-8 [&>span:first-child]:w-8 [&>span:first-child]:shrink-0 [&>span:first-child]:items-center [&>span:first-child]:justify-center [&>span:first-child]:rounded-[8px] [&>span:first-child]:bg-[var(--vendor-primary-btn)]/10 [&>span:last-child]:text-left [&>span:last-child]:text-[12px] [&>span:last-child]:font-bold"
        options={[
          {
            value: "static",
            label: "Static (Information)",
            icon: <Share2 className="h-4 w-4" />,
          },
          {
            value: "dynamic",
            label: "Dynamic (Form)",
            icon: <Code2 className="h-4 w-4" />,
          },
        ]}
      />
    </FormSection>
  );

  const componentVisibilitySection = (
    <FormSection title="Enable / Disable Components" className={panelCard}>
      <div className="space-y-2">
        <ToggleField
          label="Contact Details"
          description="Contact information is required and always visible."
          checked
          disabled
          onCheckedChange={() => undefined}
          className="bg-white"
        />
        <ToggleField
          label="Social Links"
          description="Show selected social links."
          checked={showSocialLinks}
          onCheckedChange={setShowSocialLinks}
          className="bg-white"
        />
        <ToggleField
          label="Google Map"
          description="Show map from vendor location."
          checked={showGoogleMap}
          onCheckedChange={setShowGoogleMap}
          className="bg-white"
        />
      </div>
    </FormSection>
  );

  const contactInformationSection = (
    <FormSection title="Contact Information" className={panelCard}>
      <div className="grid grid-cols-[72px_minmax(0,1fr)] gap-2">
        <p className="flex items-center gap-2 text-[11px] font-bold text-[var(--vendor-text-muted)]">
          <Mail className="h-3.5 w-3.5" />
          Email
        </p>
        <BuilderCountedInput
          value={email}
          onChange={setEmail}
          maxLength={100}
          className="space-y-0"
        />
        <p className="flex items-center gap-2 text-[11px] font-bold text-[var(--vendor-text-muted)]">
          <Phone className="h-3.5 w-3.5" />
          Mobile
        </p>
        <BuilderCountedInput
          value={mobile}
          onChange={setMobile}
          maxLength={20}
          className="space-y-0"
        />
        <p className="flex items-center gap-2 text-[11px] font-bold text-[var(--vendor-text-muted)]">
          <MapPin className="h-3.5 w-3.5" />
          Address
        </p>
        <BuilderCountedTextarea
          value={address}
          onChange={setAddress}
          maxLength={220}
          textareaClassName="min-h-[92px]"
          className="space-y-0"
        />
      </div>
    </FormSection>
  );

  const socialLinksSection = (
    <FormSection title="Social Links" className={panelCard}>
      <Table className="min-w-[520px]">
        <TableHeader>
          <TableRow className="bg-slate-50 hover:bg-slate-50">
            <TableHead className="w-9">#</TableHead>
            <TableHead>Social Network</TableHead>
            <TableHead>Link</TableHead>
            <TableHead className="w-16 text-center">Show</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {socialLinks.map((link, index) => (
            <TableRow key={link.id}>
              <TableCell className="font-bold text-[var(--vendor-text-muted)]">
                {index + 1}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[7px] text-white"
                    style={{ backgroundColor: link.color }}
                  >
                    <Icon icon={link.iconName} className="h-3.5 w-3.5" />
                  </span>
                  <span className="min-w-[78px] text-[11px] font-bold text-[var(--vendor-text)]">
                    {link.label}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <Input
                  value={link.url}
                  readOnly
                  className="h-8 bg-slate-50 text-[11px]"
                />
              </TableCell>
              <TableCell className="text-center">
                <Switch
                  checked={link.show}
                  onCheckedChange={(checked) => updateSocialLink(link.id, { show: checked })}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </FormSection>
  );

  const googleMapSection = (
    <FormSection title="Google Map " className={panelCard}>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <BuilderCountedInput
          label="Latitude"
          value={latitude}
          onChange={setLatitude}
          maxLength={30}
          lockInput
        />
        <BuilderCountedInput
          label="Longitude"
          value={longitude}
          onChange={setLongitude}
          maxLength={30}
          lockInput
        />
      </div>
    </FormSection>
  );

  const form = (
    <div className="space-y-3">
      {editorChooser}
      {componentVisibilitySection}
      {mode === "static" ? contactInformationSection : null}
      {socialLinksSection}
      {googleMapSection}
    </div>
  );

  const preview = (
    <ContactPagePreview
      mode={mode}
      title={formTitle}
      description={formDescription}
      submitLabel={submitLabel}
      privacyNote={privacyNote}
      fields={formFields}
      categories={contactCategories}
      previewDevice={previewDevice}
      email={email}
      mobile={mobile}
      address={address}
      socialLinks={socialLinks}
      showSocialLinks={showSocialLinks}
      showGoogleMap={showGoogleMap}
      latitude={latitude}
      longitude={longitude}
    />
  );

  return (
    <WebsiteBuilderLayout
      title="Contact Us"
      subtitle="Create and manage your contact form. Choose a method to build your form."
      form={form}
      preview={preview}
      previewTitle={mode === "static" ? "Preview (Static)" : "Preview (Dynamic)"}
      previewSubtitle={
        mode === "static"
          ? "This is how your contact information will appear on the website."
          : "This is how your contact page and form will appear on the website."
      }
      previewDevice={previewDevice}
      onPreviewDeviceChange={setPreviewDevice}
      onHowItWorks={() =>
        showToast("Use Static for vendor contact info or Dynamic for a contact form.")
      }
      howItWorksLabel="How It Works"
      isSaving={isSaving}
      onSave={handleSave}
      onReset={handleReset}
      saveLabel="Save Changes"
      previewTip="Contact details are always visible. Social links and Google Map can be toggled."
    />
  );
}
