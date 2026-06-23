"use client";

import * as React from "react";
import { Mail, Phone, MapPin, Send, User, MessageSquare, Tag } from "lucide-react";
import type { ContactData, ThemeColors } from "./preview-shared";
import { useCreateContactMessage } from "@/hooks/use-website-builder";
import { useToast } from "@/components/ui/toast";

// ===== Social icon colours by platform keyword =====
const SOCIAL_COLORS: Record<string, string> = {
  facebook: "#1877F2",
  instagram: "#E1306C",
  twitter: "#000000",
  x: "#000000",
  youtube: "#FF0000",
  linkedin: "#0A66C2",
  whatsapp: "#25D366",
  tiktok: "#010101",
  pinterest: "#E60023",
};

function getSocialColor(iconName: string, label: string): string {
  const key = `${iconName} ${label}`.toLowerCase();
  if (key.includes("twitter") || /\bx\b/.test(key)) return SOCIAL_COLORS.x;
  for (const [platform, color] of Object.entries(SOCIAL_COLORS)) {
    if (platform === "x") continue;
    if (key.includes(platform)) return color;
  }
  return "#64748B";
}

// Simple SVG icons for social platforms
function SocialIcon({ iconName, label }: { iconName: string; label: string }) {
  const key = `${iconName} ${label}`.toLowerCase();

  if (key.includes("facebook"))
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    );

  if (key.includes("instagram"))
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    );

  if (key.includes("twitter") || /\bx\b/.test(key) || key.includes("x-twitter"))
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    );

  if (key.includes("youtube"))
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    );

  if (key.includes("linkedin"))
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    );

  if (key.includes("whatsapp"))
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    );

  // Generic fallback globe icon
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
    </svg>
  );
}

// ===== Static map placeholder with pin =====
function MapPlaceholder({ address, theme }: { address: string; theme: ThemeColors }) {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-xl bg-slate-100">
      {/* Grid lines to mimic a map */}
      <svg className="absolute inset-0 h-full w-full opacity-30" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="map-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#94a3b8" strokeWidth="0.5" />
          </pattern>
          <pattern id="map-road-h" width="120" height="120" patternUnits="userSpaceOnUse">
            <rect width="120" height="8" y="56" fill="#cbd5e1" />
          </pattern>
          <pattern id="map-road-v" width="120" height="120" patternUnits="userSpaceOnUse">
            <rect width="8" height="120" x="56" fill="#cbd5e1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="#f1f5f9" />
        <rect width="100%" height="100%" fill="url(#map-grid)" />
        <rect width="100%" height="100%" fill="url(#map-road-h)" />
        <rect width="100%" height="100%" fill="url(#map-road-v)" />
        {/* Blocks */}
        <rect x="5%" y="10%" width="18%" height="14%" rx="2" fill="#e2e8f0" />
        <rect x="28%" y="5%" width="22%" height="18%" rx="2" fill="#e2e8f0" />
        <rect x="55%" y="8%" width="16%" height="12%" rx="2" fill="#e2e8f0" />
        <rect x="75%" y="5%" width="20%" height="20%" rx="2" fill="#e2e8f0" />
        <rect x="5%" y="30%" width="15%" height="22%" rx="2" fill="#e2e8f0" />
        <rect x="25%" y="28%" width="25%" height="20%" rx="2" fill="#e2e8f0" />
        <rect x="55%" y="25%" width="18%" height="25%" rx="2" fill="#e2e8f0" />
        <rect x="78%" y="30%" width="17%" height="18%" rx="2" fill="#e2e8f0" />
        <rect x="5%" y="60%" width="20%" height="16%" rx="2" fill="#e2e8f0" />
        <rect x="30%" y="58%" width="18%" height="20%" rx="2" fill="#e2e8f0" />
        <rect x="55%" y="60%" width="22%" height="15%" rx="2" fill="#e2e8f0" />
        <rect x="80%" y="58%" width="15%" height="20%" rx="2" fill="#e2e8f0" />
      </svg>

      {/* Pin */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-full shadow-lg"
          style={{ backgroundColor: theme.primaryButton }}
        >
          <MapPin className="h-5 w-5 text-white" />
        </div>
        <div
          className="mx-auto mt-0.5 h-2 w-0.5 opacity-60"
          style={{ backgroundColor: theme.primaryButton }}
        />
      </div>

      {/* Address card */}
      {address && (
        <div className="absolute bottom-4 left-4 right-4 rounded-xl border border-slate-200 bg-white p-3 shadow-md">
          <div className="flex items-start gap-2">
            <div
              className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
              style={{ backgroundColor: `${theme.primaryButton}1A` }}
            >
              <MapPin className="h-3.5 w-3.5" style={{ color: theme.primaryButton }} />
            </div>
            <div>
              <p className="text-[12px] font-bold text-slate-900">Our Location</p>
              <p className="mt-0.5 text-[11px] leading-relaxed text-slate-500">{address}</p>
              <button
                type="button"
                className="mt-1.5 flex items-center gap-1 text-[11px] font-semibold"
                style={{ color: theme.primaryButton }}
              >
                <span>{'\u2197'}</span> Get Directions
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ===== Real Google map (from vendor lat/long) with placeholder fallback =====
function LocationMap({
  latitude,
  longitude,
  address,
  theme,
}: {
  latitude: string;
  longitude: string;
  address: string;
  theme: ThemeColors;
}) {
  const lat = Number.parseFloat(latitude);
  const lng = Number.parseFloat(longitude);
  const hasCoords = Number.isFinite(lat) && Number.isFinite(lng);

  if (!hasCoords) return <MapPlaceholder address={address} theme={theme} />;

  const embedSrc = `https://maps.google.com/maps?q=${lat},${lng}&z=15&hl=en&output=embed`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

  return (
    <div className="relative h-full w-full overflow-hidden rounded-xl bg-slate-100">
      <iframe
        title="Our location"
        src={embedSrc}
        className="h-full min-h-[300px] w-full border-0"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
      {address ? (
        <div className="pointer-events-none absolute bottom-4 left-4 right-4 rounded-xl border border-slate-200 bg-white p-3 shadow-md">
          <div className="flex items-start gap-2">
            <div
              className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
              style={{ backgroundColor: `${theme.primaryButton}1A` }}
            >
              <MapPin className="h-3.5 w-3.5" style={{ color: theme.primaryButton }} />
            </div>
            <div className="min-w-0">
              <p className="text-[12px] font-bold text-slate-900">Our Location</p>
              <p className="mt-0.5 break-words text-[11px] leading-relaxed text-slate-500">{address}</p>
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="pointer-events-auto mt-1.5 inline-flex items-center gap-1 text-[11px] font-semibold"
                style={{ color: theme.primaryButton }}
              >
                <span>{'\u2197'}</span> Get Directions
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

// ===== Info card with sub-text support =====
function InfoCard({
  icon,
  label,
  value,
  subText,
  theme,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  subText?: string;
  theme: ThemeColors;
}) {
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <span
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
        style={{ backgroundColor: `${theme.primaryButton}1A`, color: theme.primaryButton }}
      >
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-[13px] font-black text-slate-900">{label}</p>
        <p className="mt-0.5 break-words text-[13px] font-semibold text-slate-600">{value}</p>
        {subText && (
          <p className="mt-0.5 text-[11px] text-slate-400">{subText}</p>
        )}
      </div>
    </div>
  );
}

// ===== CONTACT SECTION =====
function ContactSectionBase({
  contact,
  theme,
}: {
  contact: ContactData;
  theme: ThemeColors;
}) {
  const isDynamic = contact.mode === "dynamic";
  const createMessage = useCreateContactMessage();
  const { showToast } = useToast();

  const [form, setForm] = React.useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    categoryId: "",
    categoryOther: "",
  });

  const selectedCategory = contact.categories.find(
    (item) => String(item.id) === form.categoryId,
  );
  const isOtherCategory = (selectedCategory?.name || "")
    .trim()
    .toLowerCase()
    .startsWith("other");

  const updateForm = (patch: Partial<typeof form>) =>
    setForm((current) => ({ ...current, ...patch }));

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      showToast("Please fill in your name, email and message.", "error");
      return;
    }
    try {
      await createMessage.mutateAsync({
        category_id: form.categoryId ? Number(form.categoryId) : null,
        category_other: isOtherCategory ? form.categoryOther.trim() || null : null,
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || null,
        message: form.message.trim(),
      });
      showToast("Message sent successfully.");
      setForm({ name: "", email: "", phone: "", message: "", categoryId: "", categoryOther: "" });
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Unable to send your message.",
        "error",
      );
    }
  };

  const infoCards = [
    { icon: <Mail className="h-5 w-5" />, label: "Email", value: contact.email, subText: "We typically reply within a few hours." },
    { icon: <Phone className="h-5 w-5" />, label: "Mobile", value: contact.mobile, subText: " " },
    { icon: <MapPin className="h-5 w-5" />, label: "Address", value: contact.address, subText: "We'd love to see you!" },
  ].filter((card) => card.value);

  // ── Shared social links block ──────────────────────────────────────────────
  const SocialLinks = () =>
    contact.socialLinksEnabled && contact.socialLinks.length > 0 ? (
      <div className="mt-10 text-center">
        <p className="mt-4 text-[28px] font-black leading-tight tracking-tight sm:text-[36px]">Follow Us</p>
        <div
          className="mx-auto mb-5 h-[3px] w-8 rounded-full"
          style={{ backgroundColor: theme.primaryButton }}
        />
        <div className="flex flex-wrap items-center justify-center gap-3">
          {contact.socialLinks.map((link) => {
            const color = getSocialColor(link.iconName, link.label);
            return (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
                className="flex h-11 w-11 items-center justify-center rounded-full text-white transition-transform hover:scale-110"
                style={{ backgroundColor: color }}
              >
                <SocialIcon iconName={link.iconName} label={link.label} />
              </a>
            );
          })}
        </div>
      </div>
    ) : null;

  return (
    <section id="contact" className="w-full border-t border-slate-100 bg-white py-16 sm:py-20">
      <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-10 text-center">
          <h2
            className="mt-4 text-[28px] font-black leading-tight tracking-tight sm:text-[36px]"
            style={{ color: theme.primaryText }}
          >
            Contact Us
          </h2>
          <div
            className="mx-auto mt-3 h-[3px] w-12 rounded-full"
            style={{ backgroundColor: theme.primaryButton }}
          />
          <p
            className="mx-auto mt-4 max-w-xl text-[13px] font-medium"
            style={{ color: theme.secondaryText }}
          >
            {isDynamic
              ? "We'd love to hear from you! Send us a message and we'll respond as soon as possible."
              : "We are here to help and answer any question you might have."}
          </p>
        </div>

        {isDynamic ? (
          <>
            {/* Two-column: form + map */}
            <div className="flex flex-col gap-6">

              {/* LEFT — Form */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <h3 className="mb-1 text-[16px] font-black text-slate-900">Send Us a Message</h3>
                <div
                  className="mb-5 h-[3px] w-8 rounded-full"
                  style={{ backgroundColor: theme.primaryButton }}
                />

                <div className="grid gap-3 sm:grid-cols-2">
                  {/* Name */}
                  <div className="relative">
                    <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      placeholder="Your Name"
                      value={form.name}
                      onChange={(e) => updateForm({ name: e.target.value })}
                      className="h-11 w-full rounded-[8px] border border-slate-200 bg-white pl-9 pr-4 text-[13px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2"
                      style={{ "--tw-ring-color": `${theme.primaryButton}40` } as React.CSSProperties}
                    />
                  </div>

                  {/* Email */}
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      placeholder="Your Email"
                      type="email"
                      value={form.email}
                      onChange={(e) => updateForm({ email: e.target.value })}
                      className="h-11 w-full rounded-[8px] border border-slate-200 bg-white pl-9 pr-4 text-[13px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2"
                      style={{ "--tw-ring-color": `${theme.primaryButton}40` } as React.CSSProperties}
                    />
                  </div>

                  {/* Category */}
                  {contact.categories.length > 0 && (
                    <div className="relative sm:col-span-2">
                      <Tag className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <select
                        value={form.categoryId}
                        onChange={(e) => updateForm({ categoryId: e.target.value })}
                        className="h-11 w-full appearance-none rounded-[8px] border border-slate-200 bg-white pl-9 pr-8 text-[13px] text-slate-700 focus:outline-none focus:ring-2"
                        style={{ "--tw-ring-color": `${theme.primaryButton}40` } as React.CSSProperties}
                      >
                        <option value="">Select a Category</option>
                        {contact.categories.map((item) => (
                          <option key={item.id} value={String(item.id)}>{item.name}</option>
                        ))}
                      </select>
                      <svg
                        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                      >
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </div>
                  )}

                  {/* Other category text */}
                  {isOtherCategory && (
                    <input
                      placeholder="Please specify your enquiry"
                      value={form.categoryOther}
                      onChange={(e) => updateForm({ categoryOther: e.target.value })}
                      className="h-11 w-full rounded-[8px] border border-slate-200 bg-white px-4 text-[13px] placeholder:text-slate-400 focus:outline-none focus:ring-2 sm:col-span-2"
                      style={{ "--tw-ring-color": `${theme.primaryButton}40` } as React.CSSProperties}
                    />
                  )}

                  {/* Message */}
                  <div className="relative sm:col-span-2">
                    <MessageSquare className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <textarea
                      placeholder="Your Message"
                      rows={4}
                      value={form.message}
                      onChange={(e) => updateForm({ message: e.target.value })}
                      className="w-full rounded-[8px] border border-slate-200 bg-white pb-3 pl-9 pr-4 pt-3 text-[13px] placeholder:text-slate-400 focus:outline-none focus:ring-2"
                      style={{ "--tw-ring-color": `${theme.primaryButton}40` } as React.CSSProperties}
                    />
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={createMessage.isPending}
                  className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-[8px] text-[13px] font-bold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                  style={{ backgroundColor: theme.primaryButton }}
                >
                  <Send className="h-4 w-4" />
                  {createMessage.isPending ? "Sending..." : "Send Message"}
                </button>
              </div>

              {/* RIGHT — Map */}
              {contact.mapEnabled && (
                <div className="min-h-[360px] overflow-hidden rounded-2xl border border-slate-200 shadow-sm lg:min-h-0">
                  <div className="flex h-full flex-col">
                    <div className="border-b border-slate-100 px-6 py-4">
                      <h3 className="text-[16px] font-black text-slate-900">Our Location</h3>
                      <div
                        className="mt-1.5 h-[3px] w-8 rounded-full"
                        style={{ backgroundColor: theme.primaryButton }}
                      />
                    </div>
                    <div className="flex-1 p-3">
                      <LocationMap
                        latitude={contact.latitude}
                        longitude={contact.longitude}
                        address={contact.address}
                        theme={theme}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <SocialLinks />
          </>
        ) : (
          /* ── STATIC MODE ─────────────────────────────────────────────── */
          <>
            {/* Two-column: info cards (left) + map (right) */}
            <div className="grid gap-6 lg:grid-cols-2">

              {/* LEFT — stacked info cards */}
              <div className="flex flex-col gap-4">
                {infoCards.map((card) => (
                  <InfoCard
                    key={card.label}
                    icon={card.icon}
                    label={card.label}
                    value={card.value}
                    subText={card.subText}
                    theme={theme}
                  />
                ))}
              </div>

              {/* RIGHT — map */}
              {contact.mapEnabled && (
                <div className="min-h-[360px] overflow-hidden rounded-2xl border border-slate-200 shadow-sm lg:min-h-0">
                  <LocationMap
                    latitude={contact.latitude}
                    longitude={contact.longitude}
                    address={contact.address}
                    theme={theme}
                  />
                </div>
              )}
            </div>

            {/* Social links — now present in static mode too */}
            <SocialLinks />
          </>
        )}
      </div>
    </section>
  );
}

export const ContactSection = React.memo(ContactSectionBase);