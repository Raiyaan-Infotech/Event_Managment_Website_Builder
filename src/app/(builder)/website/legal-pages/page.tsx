"use client";

import * as React from "react";
import { WebsiteBuilderLayout } from "../_components/website-builder-layout";
import { FormSection } from "../_components/form-section";
import { BuilderCountedInput } from "../_components/builder-field";
import { WebsiteRichTextEditor } from "../_components/rich-text-editor";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

// ── Types ──────────────────────────────────────────────────────────────────────
type LegalPageId = "terms" | "privacy";

interface LegalPage {
  id: LegalPageId;
  label: string;
  title: string;
  content: string;
  enabled: boolean; // ← added
}

const DEFAULT_TERMS_CONTENT = `<h2>1. Introduction</h2><p>Welcome to Eventify. By accessing or using our website and services, you agree to be bound by these Terms &amp; Conditions. Please read them carefully.</p><h2>2. Use of Our Services</h2><p>You agree to use our services only for lawful purposes and in accordance with these Terms. You must not use our services in any way that may harm, disable, or impair our platform.</p><h2>3. User Responsibilities</h2><p>You are responsible for maintaining the confidentiality of your account and for all activities under your account. You agree to provide accurate and complete information.</p><h2>4. Changes to Terms</h2><p>We may update these Terms &amp; Conditions from time to time. We will notify you of any changes by posting the new Terms on this page.</p><h2>5. Limitation of Liability</h2><p>Eventify is not liable for any indirect, incidental, or consequential damages arising from the use of our services.</p>`;

const DEFAULT_PRIVACY_CONTENT = `<h2>1. Information We Collect</h2><p>We collect personal information you provide when booking our services, including name, contact details, and payment information.</p><h2>2. How We Use Your Information</h2><p>Your information is used to process bookings, communicate with you, and improve our services. We do not sell your data to third parties.</p><h2>3. Data Security</h2><p>We implement appropriate security measures to protect your personal information from unauthorized access or disclosure.</p>`;

const INITIAL_PAGES: LegalPage[] = [
  { id: "terms",   label: "Terms & Conditions", title: "Terms & Conditions", content: DEFAULT_TERMS_CONTENT,   enabled: true },
  { id: "privacy", label: "Privacy Policy",      title: "Privacy Policy",     content: DEFAULT_PRIVACY_CONTENT, enabled: true },
];

export default function PagesPage() {
  const [activePage, setActivePage] = React.useState<LegalPageId>("terms");
  const [pages, setPages] = React.useState<LegalPage[]>(INITIAL_PAGES);
  const [isSaving, setIsSaving] = React.useState(false);

  const handleSave = () => { setIsSaving(true); setTimeout(() => setIsSaving(false), 800); };
  const handleCancel = () => { setPages(INITIAL_PAGES); setActivePage("terms"); };

  const currentPage = pages.find((p) => p.id === activePage)!;

  const updatePage = (patch: Partial<Pick<LegalPage, "title" | "content" | "enabled">>) => {
    setPages((prev) => prev.map((p) => (p.id === activePage ? { ...p, ...patch } : p)));
  };

  const form = (
    <div className="space-y-3">

      {/* ── Page Selection (tabs) ── */}
      <FormSection
        title="Select Legal Page"
        className="rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-[var(--vendor-panel-bg)] p-3 shadow-sm"
      >
        <div className="flex gap-0 rounded-[var(--vendor-radius-control)] border border-[var(--vendor-border)] overflow-hidden">
          {pages.map((page, index) => {
            const isActive = activePage === page.id;
            return (
              <button
                key={page.id}
                type="button"
                onClick={() => setActivePage(page.id)}
                className={cn(
                  "flex-1 px-4 py-2 text-[12px] font-semibold transition-all text-center",
                  index !== 0 && "border-l border-[var(--vendor-border)]",
                  isActive
                    ? "bg-[var(--vendor-primary-btn)]/10 text-[var(--vendor-primary-btn)]"
                    : "bg-transparent text-[var(--vendor-text-muted)] hover:bg-slate-50 hover:text-[var(--vendor-text)]",
                )}
              >
                {page.label}
              </button>
            );
          })}
        </div>
      </FormSection>

      {/* ── Page Title ── */}
      <FormSection
        title="Page Title"
        className="rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-[var(--vendor-panel-bg)] p-3 shadow-sm"
        actions={
          // ← same pattern as hero page Button 1 / Button 2
          <Switch
            checked={currentPage.enabled}
            onCheckedChange={(enabled) => updatePage({ enabled })}
          />
        }
      >
        <BuilderCountedInput
          label="Page Title"
          value={currentPage.title}
          onChange={(v) => updatePage({ title: v })}
          maxLength={100}
        />
      </FormSection>

      {/* ── Page Content ── */}
      <FormSection
        title="Page Content"
        className="rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-[var(--vendor-panel-bg)] p-3 shadow-sm"
      >
        <WebsiteRichTextEditor
          label=""
          value={currentPage.content}
          onChange={(v) => updatePage({ content: v })}
          height="420px"
          showWordCount
          showCharCount
        />
      </FormSection>

    </div>
  );

  return (
    <WebsiteBuilderLayout
      title="Legal Pages"
      form={form}
      onCancel={handleCancel}
      leftClassName="border-0 bg-transparent p-0 shadow-none"
      primaryButton={{
        label: "Save Changes",
        onClick: handleSave,
        isLoading: isSaving,
      }}
      howItWorksLabel="How It Works"
      onHowItWorks={() =>
        alert("This is where you'd explain how to use the page editor.")
      }
    />
  );
}