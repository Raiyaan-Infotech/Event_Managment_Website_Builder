import type { LucideIcon } from "lucide-react";
import {
  Award,
  Calendar,
  FileText,
  Folder,
  GalleryHorizontal,
  Menu,
  Monitor,
  Search,
  Settings,
  Star,
  Users,
} from "lucide-react";

export interface NavItem {
  label: string;
  icon: LucideIcon;
  href: string;
  children?: NavItem[];
}

export interface NavSection {
  title?: string;
  items: NavItem[];
}

export const navSections: NavSection[] = [
  {
    title: "Website Setup",
    items: [
      { label: "Basic Information", icon: FileText, href: "/website/basic-information" },
    ],
  },
  {
    title: "Content",
    items: [
      {
        label: "Pages",
        icon: FileText,
        href: "/website/pages",
        children: [
          { label: "Create Page", icon: FileText, href: "/website/pages/create" },
          { label: "About Us", icon: FileText, href: "/website/pages/about-us/edit" },
          { label: "Services", icon: FileText, href: "/website/pages/services/edit" },
        ],
      },
      { label: "Nav Menu", icon: Menu, href: "/website/menu" },
      { label: "Web UI Block", icon: Monitor, href: "/website/ui-block" },
      { label: "Hero Section", icon: Monitor, href: "/website/hero-section" },
      {
        label : "Slider",
        icon: Folder,
        href: "/website/slider",
        children: [
          { label: "Simple Slider", icon: Folder, href: "/website/simple-slider" },
          { label: "Advance Slider", icon: Calendar, href: "/website/advance-slider" },
        ],
      },
      { label: "Gallery", icon: GalleryHorizontal, href: "/website/gallery" },
      { label: "Testimonials", icon: Star, href: "/website/testimonials" },
    ],
  },
  {
    title: "Portfolio",
    items: [
      { label: "Clients", icon: Users, href: "/website/portfolio/clients" },
      { label: "Sponsors", icon: Award, href: "/website/portfolio/sponsors" },
    ],
  },
  {
    title: "Footer",
    items: [
      { label: "Footer Settings", icon: Settings, href: "/website/footer" },
      { label: "Legal Pages", icon: FileText, href: "/website/legal-pages" },
    ],
  },
  {
    title: "Settings",
    items: [
      { label: "SEO Settings", icon: Search, href: "/website/seo" },
    ],
  },
];

export function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
