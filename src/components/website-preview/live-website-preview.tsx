"use client";

import * as React from "react";
import type {
  VendorAboutData,
  WebsiteBuilderData,
} from "@/lib/website-builder-api";
import { cn, resolveMediaUrl } from "@/lib/utils";
import {
  type AnyRecord,
  buildAuthPanel,
  buildContact,
  buildFooter,
  buildGalleryCategories,
  buildGalleryItems,
  buildHero,
  buildLegalPages,
  buildLogos,
  buildNavItems,
  buildPhone,
  buildSlides,
  buildSliderMeta,
  buildSocialLinks,
  buildTestimonials,
  findPageForViewKey,
  parseHeaderSettings,
  parseThemeColors,
  stringValue,
  viewKeyFromHref,
} from "./sections/preview-shared";
import { HeaderSection } from "./sections/header-section";
import { HeroSection } from "./sections/hero-section";
import { SliderSection } from "./sections/slider-section";
import { GallerySection } from "./sections/gallery-section";
import { TestimonialsSection } from "./sections/testimonials-section";
import { LogoWallSection } from "./sections/logo-wall-section";
import { ContactSection } from "./sections/contact-section";
import { LegalPagesSection } from "./sections/legal-pages-section";
import { FooterSection } from "./sections/footer-section";
import { AuthPreviewModal, type AuthView } from "./sections/auth-preview-modal";

function toPublicSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function LiveWebsitePreview({
  builderData,
  vendorData,
  className,
}: {
  builderData?: WebsiteBuilderData;
  vendorData?: VendorAboutData;
  className?: string;
}) {
  const theme = parseThemeColors(builderData);
  const header = parseHeaderSettings(builderData);
  const hero = buildHero(builderData);
  const navItems = buildNavItems(builderData);
  const socialLinks = buildSocialLinks(builderData);
  const sliderMeta = buildSliderMeta(builderData);
  const slides = buildSlides(builderData, sliderMeta);
  const galleryCategories = buildGalleryCategories(builderData);
  const galleryItems = buildGalleryItems(builderData);
  const testimonials = buildTestimonials(builderData);
  const clients = buildLogos(builderData?.clients as AnyRecord[] | undefined);
  const sponsors = buildLogos(builderData?.sponsors as AnyRecord[] | undefined);
  const contact = buildContact(builderData, vendorData);
  const legalPages = buildLegalPages(builderData);
  const footer = buildFooter(builderData, vendorData);
  const basicInformation = (builderData?.basicInformation || {}) as AnyRecord;
  const phone = buildPhone(header, vendorData);
  const email = stringValue(header.email, vendorData?.company_email, vendorData?.alt_email);
  const companyName = stringValue(
    vendorData?.company_name,
    basicInformation.company_name,
    "Royal Moments Events",
  );
  const city = stringValue(
    vendorData?.locality?.name,
    vendorData?.district?.name,
    vendorData?.city,
    basicInformation.city,
  );
  const companyLogo = resolveMediaUrl(stringValue(vendorData?.company_logo));
  const authPanelRaw = buildAuthPanel(builderData);
  const authPanel = {
    ...authPanelRaw,
    backgroundImage: resolveMediaUrl(authPanelRaw.backgroundImage),
  };
  const vendorSlug = toPublicSlug(companyName);

  const [authView, setAuthView] = React.useState<AuthView | null>(null);

  // SPA-style navigation: clicking a nav/footer/page link swaps the <main>
  // content while the header + footer stay fixed. activeKey is the canonical
  // view key for the currently shown page.
  const [activeKey, setActiveKey] = React.useState("home");
  const handleNavigate = React.useCallback((href: string) => {
    setActiveKey(viewKeyFromHref(href));
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

  const activePage = findPageForViewKey(activeKey, legalPages);

  const homeMain = (
    <>
      <HeroSection hero={hero} theme={theme} />

      {slides.length > 0 && sliderMeta ? (
        <SliderSection slides={slides} meta={sliderMeta} theme={theme} />
      ) : null}

      <GallerySection categories={galleryCategories} items={galleryItems} theme={theme} />

      <TestimonialsSection testimonials={testimonials} theme={theme} />

      {/* Portfolio — client + sponsor logo walls */}
      <LogoWallSection
        title="Our Clients"
        members={clients}
        theme={theme}
        kind="clients"
      />
      <LogoWallSection
        title="Our Sponsors"
        members={sponsors}
        theme={theme}
        kind="sponsors"
        muted
      />

      {contact ? <ContactSection contact={contact} theme={theme} /> : null}
    </>
  );

  let mainContent: React.ReactNode;
  if (activeKey === "gallery") {
    mainContent = (
      <GallerySection categories={galleryCategories} items={galleryItems} theme={theme} />
    );
  } else if (activeKey === "contact" && contact) {
    mainContent = <ContactSection contact={contact} theme={theme} />;
  } else if (activePage) {
    mainContent = <LegalPagesSection pages={[activePage]} theme={theme} />;
  } else {
    mainContent = homeMain;
  }

  return (
    <div
      className={cn(
        "min-h-screen w-full overflow-hidden bg-white text-slate-950",
        className,
      )}
      style={
        {
          "--preview-primary-text": theme.primaryText,
          "--preview-secondary-text": theme.secondaryText,
          "--preview-primary-button": theme.primaryButton,
          "--preview-card-radius": "12px",
          color: theme.primaryText,
          fontFamily:
            'Inter, "Inter Fallback", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        } as React.CSSProperties
      }
    >
      <HeaderSection
        theme={theme}
        header={header}
        navItems={navItems}
        socialLinks={socialLinks}
        companyName={companyName}
        city={city}
        companyLogo={companyLogo}
        phone={phone}
        email={email}
        activeKey={activeKey}
        onNavigate={handleNavigate}
        onAuth={setAuthView}
      />

      <main>{mainContent}</main>

      {footer.present ? (
        <FooterSection
          footer={footer}
          socialLinks={socialLinks}
          theme={theme}
          vendorSlug={vendorSlug}
          onNavigate={handleNavigate}
        />
      ) : null}

      {authView ? (
        <AuthPreviewModal
          view={authView}
          onChangeView={setAuthView}
          onClose={() => setAuthView(null)}
          theme={theme}
          panel={authPanel}
          companyName={companyName}
          companyLogo={companyLogo}
          city={city}
          vendorSlug={vendorSlug}
          onNavigate={handleNavigate}
        />
      ) : null}
    </div>
  );
}
