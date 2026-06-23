"use client";

import * as React from "react";
import { Icon } from "@iconify/react";
import { ChevronDown, Mail, Menu, Phone, UserRound, X } from "lucide-react";
import type {
  HeaderSettings,
  NavItem,
  SocialLink,
  ThemeColors,
} from "./preview-shared";
import { isExternalHref, viewKeyFromHref } from "./preview-shared";

type HeaderSectionProps = {
  theme: ThemeColors;
  header: HeaderSettings;
  navItems: NavItem[];
  socialLinks: SocialLink[];
  companyName: string;
  city: string;
  companyLogo: string;
  phone: string;
  email: string;
  activeKey: string;
  onNavigate: (href: string) => void;
  onAuth?: (view: "login" | "signup") => void;
};

function HeaderSectionBase({
  theme,
  header,
  navItems,
  socialLinks,
  companyName,
  city,
  companyLogo,
  phone,
  email,
  activeKey,
  onNavigate,
  onAuth,
}: HeaderSectionProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleNavClick = (event: React.MouseEvent, item: { href?: string }) => {
    if (isExternalHref(item.href)) return;
    event.preventDefault();
    setMobileMenuOpen(false);
    onNavigate(String(item.href || "/"));
  };

  return (
    <header className="w-full">
      {/* Top bar */}
      <div
        className="border-b border-white/10 text-white"
        style={{ backgroundColor: theme.primaryButton }}
      >
        <div className="mx-auto flex min-h-8 w-full max-w-[1280px] items-center justify-between gap-3 px-4 text-[11px] font-medium sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3 overflow-hidden text-white/90">
            {phone ? (
              <span className="flex shrink-0 items-center gap-1.5 whitespace-nowrap">
                <Phone className="h-3 w-3" />
                {phone}
              </span>
            ) : null}
            {phone && email ? <span className="h-4 w-px bg-white/35" /> : null}
            {email ? (
              <span className="hidden min-w-0 items-center gap-1.5 truncate sm:flex">
                <Mail className="h-3 w-3 shrink-0" />
                <span className="truncate">{email}</span>
              </span>
            ) : null}
          </div>
          {header.showSocialIcons && socialLinks.length ? (
            <div className="flex shrink-0 items-center gap-3">
              {socialLinks.map((link) => (
               <a 
                  key={`${link.label}-${link.href}`}
                  href={link.href}
                  aria-label={link.label}
                  className="flex h-5 w-5 items-center justify-center text-white/85 transition hover:text-white"
                >
                  <Icon icon={link.iconName} className="h-3.5 w-3.5" />
                </a>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      {/* Main nav bar */}
      <div className="shadow-sm" style={{ backgroundColor: "#FFFFFF" }}>
        <div className="mx-auto flex min-h-[74px] w-full max-w-[1280px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">

          {/* Logo */}
          <a
            href="/"
            onClick={(event) => handleNavClick(event, { href: "/" })}
            className="flex min-w-0 items-center gap-3"
          >
            {companyLogo ? (
              <img
                src={companyLogo}
                alt={`${companyName} logo`}
                className="h-12 max-w-[170px] shrink-0 object-contain"
              />
            ) : (
              <span
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[14px] font-black"
                style={{
                  backgroundColor: theme.primaryButton,
                  color: "#FFFFFF",
                }}
              >
                {companyName
                  .split(/\s+/)
                  .slice(0, 2)
                  .map((part) => part[0])
                  .join("")
                  .toUpperCase()}
              </span>
            )}
            <span className="min-w-0">
              <span
                className="block truncate text-[14px] font-black uppercase leading-4 tracking-[0.12em]"
                style={{ color: theme.primaryButton }}
              >
                {companyName}
              </span>
              {city ? (
                <span
                  className="block truncate text-[10px] font-semibold uppercase tracking-[0.18em]"
                  style={{ color: theme.primaryButton }}
                >
                  {city}
                </span>
              ) : null}
            </span>
          </a>

          {/* Desktop nav */}
          <nav
            className="hidden items-center gap-7 text-[13px] font-bold lg:flex"
            style={{ color: theme.primaryButton }}
          >
            {navItems.map((item) => {
              const isActive = viewKeyFromHref(item.href) === activeKey;

              if (item.children.length) {
                return (
                  <div key={`${item.id}-${item.href}`} className="group relative">
                    <a
                      href={item.href}
                      onClick={(event) => handleNavClick(event, item)}
                      className="flex items-center gap-1 py-7 transition hover:opacity-70"
                      style={{ color: isActive ? theme.primaryButton : undefined, fontWeight: isActive ? 900 : undefined }}
                    >
                      {item.label}
                      <ChevronDown className="h-3.5 w-3.5 transition group-hover:rotate-180" />
                    </a>
                    <div className="invisible absolute left-0 top-full z-30 min-w-[200px] -translate-y-1 rounded-[var(--preview-card-radius)] border border-slate-100 bg-white py-2 opacity-0 shadow-xl transition-all duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                      {item.children.map((child) => (
                      <a  
                          key={`${child.label}-${child.href}`}
                          href={child.href}
                          onClick={(event) => handleNavClick(event, child)}
                          className="block px-4 py-2 text-[12px] font-semibold text-slate-700 transition hover:bg-slate-50"
                          style={{ color: theme.primaryButton }}
                        >
                          {child.label}
                        </a>
                      ))}
                    </div>
                  </div>
                );
              }

              return (
                <a
                  key={`${item.id}-${item.href}`}
                  href={item.href}
                  onClick={(event) => handleNavClick(event, item)}
                  className="group flex items-center gap-1 py-7 transition hover:opacity-70"
                  style={{ color: theme.primaryButton, fontWeight: isActive ? 900 : undefined }}
                >
                  <span className="relative">
                    {item.label}
                    {isActive ? (
                      <span
                        className="absolute -bottom-6 left-0 h-0.5 w-full rounded-full"
                        style={{ backgroundColor: theme.primaryButton }}
                      />
                    ) : null}
                  </span>
                </a>
              );
            })}
          </nav>

          {/* Desktop auth buttons */}
          <div className="hidden items-center gap-2 lg:flex">
            {header.showLogin ? (
              <button
                type="button"
                onClick={() => onAuth?.("login")}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-[4px] border px-4 text-[12px] font-bold shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                style={{
                  backgroundColor: "#FFFFFF",
                  color: theme.primaryButton,
                  borderColor: theme.primaryButton,
                }}
              >
                <UserRound className="h-3.5 w-3.5" />
                Login
              </button>
            ) : null}
            {header.showSignIn ? (
              <button
                type="button"
                onClick={() => onAuth?.("signup")}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-[4px] px-4 text-[12px] font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:opacity-90 hover:shadow-md"
                style={{ backgroundColor: theme.primaryButton, color: "#FFFFFF" }}
              >
                Get Started
              </button>
            ) : null}
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="flex h-10 w-10 items-center justify-center rounded-[4px] border border-slate-200 bg-white text-slate-950 shadow-sm lg:hidden"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen ? (
          <nav className="border-t border-slate-200 bg-white px-4 py-3 lg:hidden">
            <div className="mx-auto flex max-w-[1280px] flex-col gap-1">
              {navItems.map((item) => (
                <React.Fragment key={`${item.id}-${item.href}-mobile`}>
                  <a
                    href={item.href}
                    onClick={(event) => handleNavClick(event, item)}
                    className="rounded-[4px] px-3 py-2 text-[13px] font-bold hover:bg-slate-100"
                    style={{ color: theme.primaryButton }}
                  >
                    {item.label}
                  </a>
                  {item.children.map((child) => (
                    <a
                      key={`${child.label}-${child.href}-mobile`}
                      href={child.href}
                      onClick={(event) => handleNavClick(event, child)}
                      className="rounded-[4px] px-3 py-2 pl-8 text-[12px] font-semibold hover:bg-slate-100"
                      style={{ color: theme.primaryButton }}
                    >
                      {child.label}
                    </a>
                  ))}
                </React.Fragment>
              ))}
            </div>
          </nav>
        ) : null}
      </div>
    </header>
  );
}

export const HeaderSection = React.memo(HeaderSectionBase);