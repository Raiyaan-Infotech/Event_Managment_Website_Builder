import type {
  VendorAboutData,
  WebsiteBuilderData,
} from "@/lib/website-builder-api";
import { resolveMediaUrl } from "@/lib/utils";

export type AnyRecord = Record<string, unknown>;

export type HeroButton = {
  enabled: boolean;
  label: string;
  link: string;
  style: "Primary" | "Outline" | "Ghost";
  color: string;
};

export type NavItem = {
  id: string;
  label: string;
  href: string;
  children: Array<{ label: string; href: string }>;
};

export type SlideItem = {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  buttonLabel: string;
  buttonColor: string;
  buttonTextColor: string;
  buttonLink: string;
  // advanced slider fields
  titleColor: string;
  descriptionColor: string;
  overlayOpacity: number;
  brightness: number;
  blur: number;
};

export type SliderMeta = {
  type: "simple" | "advanced";
  height: string;
  autoplay: boolean;
  autoplaySpeed: number;
  // advanced global config (per-slide overrides these)
  globalTitleColor: string;
  globalDescriptionColor: string;
  globalOverlayOpacity: number;
  globalBrightness: number;
  globalBlur: number;
};

export type GalleryCategory = {
  id: number;
  name: string;
  slug: string;
  sortOrder: number;
};

export type GalleryItem = {
  id: number;
  categoryId: number | null;
  eventName: string;
  eventType: string;
  imageUrl: string;
  altText: string;
  sortOrder: number;
};

const FALLBACK_NAV: NavItem[] = [
  { id: "home", label: "Home", href: "/", children: [] },
  { id: "about-us", label: "About Us", href: "/about-us", children: [] },
  { id: "pages", label: "Pages", href: "/pages", children: [] },
  { id: "service", label: "Service", href: "/service", children: [] },
  { id: "events", label: "Events", href: "/events", children: [] },
  { id: "gallery", label: "Gallery", href: "/gallery", children: [] },
  { id: "contact-us", label: "Contact Us", href: "/contact-us", children: [] },
];

export function isRecord(value: unknown): value is AnyRecord {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

export function parseRecord(value: unknown): AnyRecord {
  if (!value) return {};
  try {
    const parsed = typeof value === "string" ? JSON.parse(value) : value;
    return isRecord(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

export function stringValue(...values: unknown[]) {
  for (const value of values) {
    const next = String(value ?? "").trim();
    if (next) return next;
  }
  return "";
}

export function boolValue(value: unknown, fallback = false) {
  if (value === undefined || value === null || value === "") return fallback;
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value !== 0;
  return !["0", "false", "no", "off"].includes(String(value).toLowerCase());
}

export function normalizeHref(value: unknown) {
  const raw = String(value ?? "").trim();
  if (!raw) return "#";
  if (/^(https?:)?\/\//i.test(raw) || raw.startsWith("#")) return raw;
  return `/${raw.replace(/^\/+/, "")}`;
}

export function stripHtml(html: string) {
  return String(html ?? "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

// True when an href points outside the previewed site (real URL or bare anchor)
// — these must not trigger the in-preview SPA view swap.
export function isExternalHref(href: unknown) {
  const raw = String(href ?? "").trim();
  return !raw || raw === "#" || /^(https?:)?\/\//i.test(raw) || raw.startsWith("#") || /^(mailto:|tel:)/i.test(raw);
}

// Collapse any internal href into a canonical "view key" so the single-page
// preview can decide which view to render and which nav item is active.
// Home, the gallery showcase, and the contact section each get their own view;
// any other slug is treated as a custom/legal page slug.
export function viewKeyFromHref(href: unknown): string {
  const key = String(href ?? "").replace(/^\/+/, "").replace(/\/+$/, "").toLowerCase();
  if (key === "" || key === "/" || key === "home") return "home";
  if (key.includes("gallery")) return "gallery";
  if (key.includes("contact")) return "contact";
  if (key.includes("testimonial")) return "home";
  return key;
}

// Resolve a view key to the page it refers to. Tries an exact slug match first,
// then falls back to a fuzzy contains-match so the footer's generic default
// option values (e.g. "terms", "privacy") still resolve to real pages whose
// slugs are "terms-and-condition", "privacy-policy", etc.
export function findPageForViewKey(
  key: string,
  pages: LegalPage[],
): LegalPage | null {
  if (!key || key === "home" || key === "gallery" || key === "contact") return null;

  const exact = pages.find((page) => viewKeyFromHref(page.slug) === key);
  if (exact) return exact;

  const norm = (value: unknown) =>
    String(value ?? "").toLowerCase().replace(/[^a-z0-9]/g, "");
  const target = norm(key);
  if (!target) return null;

  return (
    pages.find((page) => {
      const slug = norm(page.slug);
      const title = norm(page.title);
      return (
        (slug && (slug.includes(target) || target.includes(slug))) ||
        (title && title.includes(target))
      );
    }) || null
  );
}

// Admin-created default website palette — the 4 semantic colors applied to every
// vendor site UNLESS the vendor turns on their own custom colors in the builder.
// (`primaryBg` = header/footer/button bg + text highlight; `primaryText` = UI
// block headings; `secondaryText` = sub-text under headings; `paragraph` =
// terms & conditions / privacy body.)
export const ADMIN_THEME_COLORS = {
  primaryBg: "#7C3AED",
  primaryText: "#0F172A",
  secondaryText: "#64748B",
  paragraph: "#475569",
};

// Map a palette row (admin or custom) to the 4 semantic colors, with fallbacks.
function colorsFromPalette(palette?: {
  primary_bg_color?: string | null;
  primary_text_color?: string | null;
  secondary_text_color?: string | null;
  paragraph_color?: string | null;
}) {
  return {
    primaryBg: stringValue(palette?.primary_bg_color, ADMIN_THEME_COLORS.primaryBg),
    primaryText: stringValue(palette?.primary_text_color, ADMIN_THEME_COLORS.primaryText),
    secondaryText: stringValue(palette?.secondary_text_color, ADMIN_THEME_COLORS.secondaryText),
    paragraph: stringValue(palette?.paragraph_color, ADMIN_THEME_COLORS.paragraph),
  };
}

export function parseThemeColors(builderData?: WebsiteBuilderData) {
  const website = builderData?.website as AnyRecord | null | undefined;
  const settings = parseRecord(website?.settings_json);
  const colors = isRecord(settings.colors) ? settings.colors : settings;
  const useCustom = boolValue(
    settings.use_custom_colors ?? colors.use_custom_colors,
    false,
  );
  const palettes = builderData?.colorPalettes || [];
  const paletteId = settings.palette_id ?? colors.palette_id;

  let resolved;
  if (useCustom) {
    // Vendor's own custom palette (back-compat with the legacy primary_button_color).
    resolved = colorsFromPalette({
      primary_bg_color: stringValue(colors.primary_bg_color, colors.primary_button_color) || null,
      primary_text_color: (colors.primary_text_color as string) ?? null,
      secondary_text_color: (colors.secondary_text_color as string) ?? null,
      paragraph_color: (colors.paragraph_color as string) ?? null,
    });
  } else {
    // Selected admin palette → else the first active palette → else defaults.
    const picked =
      palettes.find((item) => String(item.id) === String(paletteId)) || palettes[0];
    resolved = colorsFromPalette(picked);
  }

  return {
    primaryText: resolved.primaryText,
    primaryButton: resolved.primaryBg,
    secondaryText: resolved.secondaryText,
    paragraph: resolved.paragraph,
  };
}

export function parseHeaderSettings(builderData?: WebsiteBuilderData) {
  const basic = (builderData?.basicInformation || {}) as AnyRecord;
  const savedSettings = parseRecord(basic.social_links_json);
  return {
    headerColor: stringValue(
      basic.header_color,
      savedSettings.header_color,
      savedSettings.headerColor,
      "#FFFFFF",
    ),
    showSocialIcons: boolValue(
      basic.show_social_icons ?? savedSettings.show_social_icons ?? savedSettings.showSocialIcons,
      true,
    ),
    showLogin: boolValue(
      basic.show_login ?? savedSettings.show_login ?? savedSettings.showLogin,
      true,
    ),
    showSignIn: boolValue(
      basic.show_signin ??
        savedSettings.show_signin ??
        savedSettings.showSignIn ??
        savedSettings.show_sign_in,
      true,
    ),
    mobile: stringValue(basic.mobile),
    mobileCountryCode: stringValue(basic.mobile_country_code, "+91"),
    email: stringValue(basic.email).toLowerCase(),
  };
}

export function buildPhone(header: HeaderSettings, vendorData?: VendorAboutData) {
  const raw = stringValue(
    header.mobile,
    vendorData?.company_contact,
    vendorData?.contact,
    vendorData?.alt_contact,
  );
  if (!raw) return "";
  if (raw.startsWith("+")) return raw;
  return `${header.mobileCountryCode} ${raw}`.trim();
}

export function buildSocialLinks(builderData?: WebsiteBuilderData) {
  return (builderData?.socialLinks || [])
    .filter((item) => boolValue(item.is_active ?? item.active, true))
    .map((item) => {
      const label = stringValue(item.label, item.social_network, item.name, item.icon, "Social");
      return {
        label,
        href: normalizeHref(item.url ?? item.link ?? item.href),
        iconName: stringValue(item.icon_key, item.icon, "simple-icons:linktree"),
      };
    })
    .filter((item) => item.href !== "#")
    .slice(0, 5);
}

export function buildPageHref(pageId: unknown, builderData?: WebsiteBuilderData) {
  const raw = String(pageId ?? "").trim();
  if (!raw) return "";
  const matchedPage = (builderData?.pages || []).find((page) => {
    const id = String(page.id ?? "");
    const slug = String(page.slug ?? "").replace(/^\/+/, "");
    return id === raw || slug === raw.replace(/^\/+/, "");
  });
  if (matchedPage) return normalizeHref(matchedPage.slug);
  if (raw === "home") return "/";
  return normalizeHref(raw);
}

export function buildNavItems(builderData?: WebsiteBuilderData) {
  const rawItems = (builderData?.menuItems || [])
    .filter((item) => !item.parent_id && boolValue(item.is_visible, true))
    .sort((left, right) => Number(left.sort_order || 0) - Number(right.sort_order || 0));

  if (!rawItems.length) return FALLBACK_NAV;

  const childrenByParent = new Map<string, Array<{ label: string; href: string }>>();
  (builderData?.menuItems || [])
    .filter((item) => item.parent_id && boolValue(item.is_visible, true))
    .sort((left, right) => Number(left.sort_order || 0) - Number(right.sort_order || 0))
    .forEach((item) => {
      const parentId = String(item.parent_id);
      const children = childrenByParent.get(parentId) || [];
      children.push({
        label: stringValue(item.label, "Page"),
        href: normalizeHref(item.url || buildPageHref(item.page_id, builderData)),
      });
      childrenByParent.set(parentId, children);
    });

  return rawItems.map((item) => {
    const id = String(item.client_id || item.page_id || item.url || item.id || "");
    const label = stringValue(item.label, id === "service" ? "Service" : id || "Menu");
    const href = normalizeHref(item.url || buildPageHref(item.page_id, builderData));
    return { id, label, href, children: childrenByParent.get(String(item.id)) || [] };
  });
}

export function parseHeroButton(
  value: unknown,
  builderData: WebsiteBuilderData | undefined,
  fallback: HeroButton,
): HeroButton {
  const record = parseRecord(value);
  const enabled = boolValue(record.enabled, fallback.enabled);
  const label = stringValue(record.label, fallback.label);
  const linkFromTarget =
    record.linkType === "page"
      ? buildPageHref(record.pageId, builderData)
      : normalizeHref(record.customUrl || record.link);
  return {
    enabled,
    label,
    link: linkFromTarget || fallback.link,
    style:
      record.style === "Outline" || record.style === "Ghost" || record.style === "Primary"
        ? record.style
        : fallback.style,
    color: stringValue(record.color, fallback.color),
  };
}

export function buildHero(builderData?: WebsiteBuilderData) {
  const hero = (builderData?.heroSection || {}) as AnyRecord;
  const theme = parseThemeColors(builderData);
  const button1 = parseHeroButton(hero.button_1_json ?? hero.btn1, builderData, {
    enabled: true,
    label: "Book Consultation",
    link: "/contact-us",
    style: "Primary",
    color: theme.primaryButton,
  });
  const button2 = parseHeroButton(hero.button_2_json ?? hero.btn2, builderData, {
    enabled: true,
    label: "Explore Events",
    link: "/events",
    style: "Outline",
    color: "#FFFFFF",
  });
  return {
    imageUrl: resolveMediaUrl(stringValue(hero.image_url)),
    badgeText: stringValue(hero.badge_text, "Best Event Management"),
    title: stringValue(hero.title, "Creating Unforgettable Moments"),
    description: stringValue(
      hero.description,
      "We create beautiful, memorable and perfect events that stay with you forever.",
    ),
    height: stringValue(hero.hero_height, "medium"),
    overlayEnabled: boolValue(hero.overlay_enabled, true),
    overlayColor: stringValue(hero.overlay_color, "#050505"),
    overlayOpacity: Number(hero.overlay_opacity ?? 62),
    contentAlignment: stringValue(hero.content_alignment, "left"),
    buttonLayout: stringValue(hero.button_layout, "left"),
    // Button colors are driven by the palette (Primary Bg), not removed pickers.
    button1: { ...button1, color: theme.primaryButton },
    button2: { ...button2, color: theme.primaryButton },
  };
}

// Parse slider meta from sliders[0]
export function buildSliderMeta(builderData?: WebsiteBuilderData): SliderMeta | null {
  const sliders = (builderData as AnyRecord)?.sliders as AnyRecord[] | undefined;
  if (!sliders?.length) return null;

  const slider = sliders[0];
  const config = parseRecord(slider.config_json);

  return {
    type: slider.slider_type === "advanced" ? "advanced" : "simple",
    height: stringValue(slider.slider_height, "medium"),
    autoplay: boolValue(slider.autoplay, true),
    autoplaySpeed: Number(slider.autoplay_speed ?? 5000),
    globalTitleColor: stringValue(config.title_color, "#FFFFFF"),
    globalDescriptionColor: stringValue(config.description_color, "#E6E6E6"),
    globalOverlayOpacity: Number(config.overlay_opacity ?? 55),
    globalBrightness: Number(config.brightness ?? 100),
    globalBlur: Number(config.blur ?? 0),
  };
}

// Build slides from sliderItems — works for both simple and advanced
export function buildSlides(builderData?: WebsiteBuilderData, meta?: SliderMeta | null): SlideItem[] {
  const items = (builderData as AnyRecord)?.sliderItems as AnyRecord[] | undefined;
  if (!items?.length) return [];

  return items
    .filter((item) => boolValue(item.is_active, true) && item.status !== "draft")
    .sort((a, b) => Number(a.sort_order || 0) - Number(b.sort_order || 0))
    .map((item) => {
      const buttonLink = item.button_url
        ? normalizeHref(item.button_url)
        : item.button_page_id
          ? buildPageHref(item.button_page_id, builderData)
          : "#";

      // Per-slide advanced fields fall back to global config
      const titleColor = stringValue(item.title_color, meta?.globalTitleColor, "#FFFFFF");
      const descriptionColor = stringValue(item.description_color, meta?.globalDescriptionColor, "#E6E6E6");
      const overlayOpacity = Number(item.overlay_opacity ?? meta?.globalOverlayOpacity ?? 55);
      const brightness = Number(item.brightness ?? meta?.globalBrightness ?? 100);
      const blur = Number(item.blur ?? meta?.globalBlur ?? 0);

      return {
        id: Number(item.id),
        title: stringValue(item.title, "Unforgettable Events"),
        description: stringValue(item.description, ""),
        imageUrl: resolveMediaUrl(stringValue(item.image_url)),
        buttonLabel: stringValue(item.button_label, ""),
        buttonColor: stringValue(item.button_color, "#7C3AED"),
        buttonTextColor: stringValue(item.button_text_color, "#FFFFFF"),
        buttonLink,
        titleColor,
        descriptionColor,
        overlayOpacity,
        brightness,
        blur,
      };
    });
}

// ===== GALLERY: categories + items =====
export function buildGalleryCategories(builderData?: WebsiteBuilderData): GalleryCategory[] {
  const categories = (builderData as AnyRecord)?.galleryCategories as AnyRecord[] | undefined;
  if (!categories?.length) return [];

  return categories
    .filter((item) => boolValue(item.is_active, true))
    .sort((a, b) => Number(a.sort_order || 0) - Number(b.sort_order || 0))
    .map((item) => ({
      id: Number(item.id),
      name: stringValue(item.name, "Category"),
      slug: stringValue(item.slug, String(item.id)),
      sortOrder: Number(item.sort_order || 0),
    }));
}

export function buildGalleryItems(builderData?: WebsiteBuilderData): GalleryItem[] {
  const items = (builderData as AnyRecord)?.galleryItems as AnyRecord[] | undefined;
  if (!items?.length) return [];

  return items
    .filter((item) => boolValue(item.is_active, true))
    .sort((a, b) => Number(a.sort_order || 0) - Number(b.sort_order || 0))
    .map((item) => ({
      id: Number(item.id),
      categoryId: item.category_id !== undefined && item.category_id !== null ? Number(item.category_id) : null,
      eventName: stringValue(item.event_name, "Event"),
      eventType: stringValue(item.event_type),
      imageUrl: resolveMediaUrl(stringValue(item.image_url)),
      altText: stringValue(item.alt_text, item.event_name, "Gallery image"),
      sortOrder: Number(item.sort_order || 0),
    }));
}

// ===== FOOTER =====
export function buildFooter(builderData?: WebsiteBuilderData, vendorData?: VendorAboutData) {
  const footer = (builderData?.footer || {}) as AnyRecord;
  const pages = builderData?.pages || [];
  const rawLinks = Array.isArray(footer.add_pages_json)
    ? footer.add_pages_json
    : Array.isArray(footer.quick_links_json)
      ? footer.quick_links_json
      : [];
  const norm = (value: unknown) =>
    String(value ?? "").toLowerCase().replace(/[^a-z0-9]/g, "");
  const quickLinks = (rawLinks as unknown[])
    .map((value) => {
      const raw = String(value ?? "").trim();
      if (!raw) return null;
      const target = norm(raw);
      // Exact slug/id match first, then fuzzy contains-match so generic values
      // like "terms"/"privacy" resolve to real "terms-and-condition" pages.
      const page =
        pages.find((item) => {
          const slug = String(item.slug ?? "").replace(/^\/+/, "");
          return slug === raw.replace(/^\/+/, "") || String(item.id ?? "") === raw;
        }) ||
        pages.find((item) => {
          const slug = norm(item.slug);
          const title = norm(item.title);
          return (
            !!target &&
            ((!!slug && (slug.includes(target) || target.includes(slug))) ||
              (!!title && title.includes(target)))
          );
        });
      // Only show links that resolve to a real page, and always label them with
      // the page's title — never a raw slug.
      if (!page) return null;
      return { label: stringValue(page.title, raw), href: normalizeHref(page.slug) };
    })
    .filter(Boolean) as Array<{ label: string; href: string }>;

  const isAlt = stringValue(footer.contact_type) === "alternative";
  return {
    present: Boolean(builderData?.footer),
    logoUrl: resolveMediaUrl(stringValue(footer.logo_url, vendorData?.company_logo)),
    companyName: stringValue(footer.company_name, vendorData?.company_name, "Company"),
    description: stringValue(footer.description, vendorData?.short_description),
    topListHeading: stringValue(footer.top_list_heading, "Quick Links"),
    quickLinks,
    showNewsletter: boolValue(footer.show_newsletter, true),
    showSocialLinks: boolValue(footer.show_social_links, true),
    mobile: stringValue(footer.mobile, isAlt ? vendorData?.contact : vendorData?.company_contact),
    email: stringValue(footer.email, isAlt ? vendorData?.alt_email : vendorData?.company_email).toLowerCase(),
    address: stringValue(footer.address, isAlt ? vendorData?.alt_address : vendorData?.company_address),
    copyright: stringValue(footer.copyright_text, vendorData?.copywrite, "All rights reserved."),
    poweredBy: stringValue(footer.powered_by_text, vendorData?.poweredby),
  };
}

// ===== TESTIMONIALS =====
export function buildTestimonials(builderData?: WebsiteBuilderData) {
  return (builderData?.testimonials || [])
    .filter((item) => boolValue(item.is_active, true))
    .sort((a, b) => Number(a.sort_order || 0) - Number(b.sort_order || 0))
    .map((item) => ({
      id: Number(item.id),
      name: stringValue(item.customer_name, "Customer"),
      event: stringValue(item.event_name),
      feedback: stripHtml(stringValue(item.feedback)),
      photoUrl: resolveMediaUrl(stringValue(item.photo_url)),
      rating: Math.max(0, Math.min(5, Math.round(Number(item.rating ?? 5)))),
      showRating: boolValue(item.show_rating, true),
    }));
}

// ===== PORTFOLIO LOGO WALLS (clients / sponsors) =====
export function buildLogos(list?: Array<AnyRecord>) {
  return (list || [])
    .filter((item) => boolValue(item.is_active, true))
    .sort((a, b) => Number(a.sort_order || 0) - Number(b.sort_order || 0))
    .map((item) => ({
      id: String(item.id),
      name: stringValue(item.name, ""),
      photoUrl: resolveMediaUrl(stringValue(item.logo_url)),
      href: normalizeHref(item.website_url),
    }))
    // Keep an entry if it has a logo OR a name — name-only clients/sponsors
    // must still render (with their name) instead of being dropped.
    .filter((item) => Boolean(item.photoUrl) || Boolean(item.name));
}

// ===== CONTACT =====
export function buildContact(builderData?: WebsiteBuilderData, vendorData?: VendorAboutData) {
  if (!builderData?.contactSettings) return null;
  const contact = builderData.contactSettings as AnyRecord;
  const mode = stringValue(contact.mode) === "dynamic" ? "dynamic" : "static";

  const rawContactSocialLinks = ((builderData as AnyRecord)?.contactSocialLinks as AnyRecord[] | undefined || [])
    .filter((item) => boolValue(item.is_active, true) && boolValue(item.is_visible, true))
    .sort((a, b) => Number(a.sort_order || 0) - Number(b.sort_order || 0));

  // Build a map from the main socialLinks by id
  const socialLinksMap = new Map(
    (builderData?.socialLinks || []).map((s) => [Number((s as AnyRecord).id), s as AnyRecord])
  );

  const contactSocialLinks = rawContactSocialLinks
    .map((item) => {
      const matched = socialLinksMap.get(Number(item.social_link_id));
      if (!matched) return null;
      const label = stringValue(matched.label, matched.social_network, matched.name, matched.icon, "Social");
      const href = normalizeHref(matched.url ?? matched.link ?? matched.href);
      if (href === "#") return null;
      return {
        label,
        href,
        iconName: stringValue(matched.icon_key, matched.icon, "globe"),
      };
    })
    .filter(Boolean) as Array<{ label: string; href: string; iconName: string }>;

  // Fall back to the vendor's main social links when no contact-specific
  // selection exists, so "Follow Us" still shows the brand icons.
  const socialLinks = contactSocialLinks.length
    ? contactSocialLinks
    : buildSocialLinks(builderData);

  return {
    mode: mode as "dynamic" | "static",
    email: stringValue(contact.email, vendorData?.company_email).toLowerCase(),
    mobile: stringValue(contact.mobile, vendorData?.company_contact),
    address: stringValue(contact.address, vendorData?.company_address),
    mapEnabled: boolValue(contact.google_map_enabled, true),
    // Map coordinates come from the vendor record (vendors.latitude/longitude).
    latitude: stringValue(vendorData?.latitude, contact.latitude),
    longitude: stringValue(vendorData?.longitude, contact.longitude),
    socialLinksEnabled: boolValue(contact.social_links_enabled, true),
    contactFormEnabled: boolValue(contact.contact_form_enabled, true),
    categories: (builderData.contactCategories || [])
      .filter((item) => boolValue(item.is_active, true))
      .sort((a, b) => Number(a.sort_order || 0) - Number(b.sort_order || 0))
      .map((item) => ({ id: Number(item.id), name: stringValue(item.name) }))
      .filter((item) => Boolean(item.name)),
    socialLinks,
  };
}

// ===== LEGAL / CUSTOM PAGES =====
export function buildLegalPages(builderData?: WebsiteBuilderData) {
  return (builderData?.pages || [])
    .filter(
      (item) =>
        boolValue(item.is_active, true) &&
        stringValue(item.status, "published") !== "draft" &&
        stripHtml(stringValue(item.content)).length > 0,
    )
    .sort((a, b) => Number(a.sort_order || 0) - Number(b.sort_order || 0))
    .map((item) => ({
      id: Number(item.id),
      title: stringValue(item.title, "Page"),
      slug: stringValue(item.slug),
      content: stringValue(item.content),
    }));
}

export function getHeroMinHeight(height: string) {
  // The public header occupies 106px (32px top bar + 74px navigation).
  // Medium/Large heroes should still complete the first viewport on tall
  // screens instead of exposing the next section beneath them.
  const viewportHeight = "calc(100dvh - 106px)";
  if (height === "small") return "420px";
  if (height === "large") return `max(760px, ${viewportHeight})`;
  if (height === "fullscreen") return viewportHeight;
  return `max(600px, ${viewportHeight})`;
}

export function getSliderMinHeight(height: string) {
  if (height === "small") return "400px";
  if (height === "large") return "700px";
  if (height === "medium-500") return "500px";
  if (height === "fullscreen") return "100vh";
  return "600px";
}

// ===== Derived prop types (one source of truth for the section components) =====
export type ThemeColors = ReturnType<typeof parseThemeColors>;
export type HeaderSettings = ReturnType<typeof parseHeaderSettings>;
export type HeroData = ReturnType<typeof buildHero>;
export type SocialLink = ReturnType<typeof buildSocialLinks>[number];
export type Testimonial = ReturnType<typeof buildTestimonials>[number];
export type Logo = ReturnType<typeof buildLogos>[number];
export type ContactData = NonNullable<ReturnType<typeof buildContact>>;
export type LegalPage = ReturnType<typeof buildLegalPages>[number];
export type FooterData = ReturnType<typeof buildFooter>;

// ===== Login / Get-Started side panel =========================================
// The auth modal's left brand panel (eyebrow + title + description + a few
// highlight bullets). Logo/name/city stay dynamic from vendor data; only this
// marketing copy is vendor-configurable via the Login Page builder screen.
export type AuthPanelContent = {
  enabled: boolean;
  eyebrow: string;
  title: string;
  description: string;
  bullets: string[];
  /** When true (and an image is set) the image is used as the panel background. */
  showBackgroundImage: boolean;
  /** Optional background image; falls back to the solid brand color. */
  backgroundImage: string;
};

// Defaults mirror the original hard-coded panel so an unconfigured site looks
// exactly as before.
export const DEFAULT_AUTH_PANEL: AuthPanelContent = {
  enabled: true,
  eyebrow: "Event workspace",
  title: "Everything for your event, in one place.",
  description:
    "Manage enquiries, bookings and event details from one secure account.",
  bullets: ["Enquiries and bookings", "Event updates", "Account preferences"],
  showBackgroundImage: false,
  backgroundImage: "",
};

export function buildAuthPanel(builderData?: WebsiteBuilderData): AuthPanelContent {
  const website = builderData?.website as AnyRecord | null | undefined;
  const settings = parseRecord(website?.settings_json);

  // ✅ snake_case to match DB
  const configured = isRecord(settings.auth_panel);
  const raw = configured ? (settings.auth_panel as AnyRecord) : {};

  const bullets = configured
    ? (Array.isArray(raw.bullets) ? raw.bullets : [])
        .map((item) => String(item ?? "").trim())
        .filter(Boolean)
    : DEFAULT_AUTH_PANEL.bullets;

  return {
    enabled: boolValue(raw.enabled, DEFAULT_AUTH_PANEL.enabled),
    eyebrow: stringValue(raw.eyebrow, DEFAULT_AUTH_PANEL.eyebrow),
    title: stringValue(raw.title, DEFAULT_AUTH_PANEL.title),
    description: stringValue(raw.description, DEFAULT_AUTH_PANEL.description),
    bullets,
    showBackgroundImage: boolValue(
      raw.showBackgroundImage ?? raw.show_background_image,
      DEFAULT_AUTH_PANEL.showBackgroundImage,
    ),
    backgroundImage: stringValue(
      raw.backgroundImage,
      raw.background_image,
      DEFAULT_AUTH_PANEL.backgroundImage,
    ),
  };
}