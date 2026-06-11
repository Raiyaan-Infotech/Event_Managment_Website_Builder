"use client";

import * as React from "react";
import { ChevronRight, FileText, Pencil, Type } from "lucide-react";
import { WebsiteBuilderLayout } from "../_components/website-builder-layout";
import { FormSection } from "../_components/form-section";
import { BuilderCountedInput } from "../_components/builder-field";
import { WebsiteRichTextEditor } from "../_components/rich-text-editor";
import { FormActions } from "../_components/form-actions";
import { cn } from "@/lib/utils";

// ── Types ──────────────────────────────────────────────────────────────────────
type LegalPageId = "terms" | "privacy" | "about";

interface LegalPage {
  id: LegalPageId;
  label: string;
  title: string;
  content: string;
}

const DEFAULT_TERMS_CONTENT = `<h2>1. Introduction</h2><p>Welcome to Eventify. By accessing or using our website and services, you agree to be bound by these Terms &amp; Conditions. Please read them carefully.</p><h2>2. Use of Our Services</h2><p>You agree to use our services only for lawful purposes and in accordance with these Terms. You must not use our services in any way that may harm, disable, or impair our platform.</p><h2>3. User Responsibilities</h2><p>You are responsible for maintaining the confidentiality of your account and for all activities under your account. You agree to provide accurate and complete information.</p><h2>4. Changes to Terms</h2><p>We may update these Terms &amp; Conditions from time to time. We will notify you of any changes by posting the new Terms on this page.</p><h2>5. Limitation of Liability</h2><p>Eventify is not liable for any indirect, incidental, or consequential damages arising from the use of our services.</p>`;

const DEFAULT_PRIVACY_CONTENT = `<h2>1. Information We Collect</h2><p>We collect personal information you provide when booking our services, including name, contact details, and payment information.</p><h2>2. How We Use Your Information</h2><p>Your information is used to process bookings, communicate with you, and improve our services. We do not sell your data to third parties.</p><h2>3. Data Security</h2><p>We implement appropriate security measures to protect your personal information from unauthorized access or disclosure.</p>`;

const DEFAULT_ABOUT_CONTENT = `<h2>Who We Are</h2><p>Eventify is a premier event management company dedicated to creating unforgettable experiences. With over a decade of expertise, we specialize in weddings, corporate events, and private celebrations.</p><h2>Our Mission</h2><p>To deliver flawless, personalized events that exceed expectations and create lasting memories for our clients.</p>`;

export default function PagesPage() {
  const [activePage, setActivePage] = React.useState<LegalPageId>("terms");
  const [pages, setPages] = React.useState<LegalPage[]>([
    { id: "terms",   label: "Terms & Conditions", title: "Terms & Conditions", content: DEFAULT_TERMS_CONTENT },
    { id: "privacy", label: "Privacy Policy",      title: "Privacy Policy",     content: DEFAULT_PRIVACY_CONTENT },
    { id: "about",   label: "About Us",            title: "About Us",           content: DEFAULT_ABOUT_CONTENT },
  ]);
  const [isSaving, setIsSaving] = React.useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 800);
  };

  const handleCancel = () => {
    setPages([
      { id: "terms",   label: "Terms & Conditions", title: "Terms & Conditions", content: DEFAULT_TERMS_CONTENT },
      { id: "privacy", label: "Privacy Policy",      title: "Privacy Policy",     content: DEFAULT_PRIVACY_CONTENT },
      { id: "about",   label: "About Us",            title: "About Us",           content: DEFAULT_ABOUT_CONTENT },
    ]);
    setActivePage("terms");
  };

  const currentPage = pages.find((p) => p.id === activePage)!;

  const updatePage = (patch: Partial<Pick<LegalPage, "title" | "content">>) => {
    setPages((prev) =>
      prev.map((p) => (p.id === activePage ? { ...p, ...patch } : p)),
    );
  };

  const form = (
  <div className="space-y-3">
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-12 lg:h-full lg:min-h-0">

    {/* ── LEFT column ───────────────────────────────────────── */}
    <div className="lg:col-span-4 flex flex-col gap-3">

      {/* Page Selection card */}
      <FormSection
        title="Page Selection"
        subtitle="Choose a legal page to edit"
        icon={<FileText className="h-4 w-4" />}
        className="rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-[var(--vendor-panel-bg)] p-3 shadow-sm"
      >
        <div className="flex flex-col gap-1.5 pt-1">
          {pages.map((page) => {
            const isActive = activePage === page.id;
            return (
              <button
                key={page.id}
                type="button"
                onClick={() => setActivePage(page.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-[var(--vendor-radius-control)] border px-3 py-2.5 text-left transition-all",
                  isActive
                    ? "border-[var(--vendor-primary-btn)]/25 bg-[var(--vendor-primary-btn)]/8 text-[var(--vendor-primary-btn)]"
                    : "border-[var(--vendor-border)] bg-transparent text-[var(--vendor-text-muted)] hover:bg-slate-50 hover:text-[var(--vendor-text)]",
                )}
              >
                {/* file icon box */}
                <span
                  className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-[6px]",
                    isActive
                      ? "bg-[var(--vendor-primary-btn)]/15 text-[var(--vendor-primary-btn)]"
                      : "bg-slate-100 text-slate-400",
                  )}
                >
                  <FileText className="h-3.5 w-3.5" />
                </span>

                <span className="flex-1 text-[12px] font-bold leading-tight">
                  {page.label}
                </span>

                <ChevronRight
                  className={cn(
                    "h-4 w-4 shrink-0",
                    isActive
                      ? "text-[var(--vendor-primary-btn)]"
                      : "text-slate-300",
                  )}
                />
              </button>
            );
          })}
        </div>
      </FormSection>

      {/* Page Title card */}
      <FormSection
        title="Page Title"
        icon={<Type className="h-4 w-4" />}
        className="rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-[var(--vendor-panel-bg)] p-3 shadow-sm"
      >
        <BuilderCountedInput
          label="Page Title"
          value={currentPage.title}
          onChange={(v) => updatePage({ title: v })}
          maxLength={100}
        />
      </FormSection>
    </div>

    {/* ── RIGHT column ──────────────────────────────────────── */}
    <div className="lg:col-span-8 flex flex-col min-h-0 lg:h-full">
      <FormSection
        title="Page Content"
        subtitle="Edit the content for the selected page"
        icon={<Pencil className="h-4 w-4" />}
        className="rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-[var(--vendor-panel-bg)] p-3 shadow-sm flex flex-col flex-1 lg:h-full"
      >
        <WebsiteRichTextEditor
          label=""
          value={currentPage.content}
          onChange={(v) => updatePage({ content: v })}
          height="200px"
          showWordCount
          showCharCount
        />
      </FormSection>
    </div>

    </div>
    {/* <FormActions
      saveLabel="Save Changes"
      onSave={handleSave}
      onCancel={handleCancel}
      isSaving={isSaving}
      layout="end"
      className="mt-2"
    /> */}
  </div>
);

  return (
    <WebsiteBuilderLayout
      title="Legal Pages"
      form={form}
      saveLabel="Save Changes"
      onSave={handleSave}
      onCancel={handleCancel}
      isSaving={isSaving}
      leftClassName="border-0 bg-transparent p-0 shadow-none"
    />
  );
}