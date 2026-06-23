import type { LucideIcon } from "lucide-react";
import {
  Award,
  Calendar,
  FileText,
  Folder,
  GalleryHorizontal,
  LogIn,
  Mail,
  Menu,
  Monitor,
  Palette,
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
    title: "Website Builder",
    items: [
      { label: "Header", icon: FileText, href: "/website/basic-information" },
      { label: "Nav Menu", icon: Menu, href: "/website/menu" },
      { label: "Login Page", icon: LogIn, href: "/website/login-page" },
      { label: "Web UI Block", icon: Monitor, href: "/website/ui-block" },
      { label: "SEO Settings", icon: Search, href: "/website/seo" },
      { label: "Footer Settings", icon: Settings, href: "/website/footer" },
      { label: "Theme Color", icon: Palette, href: "/website/theme-color" },
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
          { label: "Service", icon: FileText, href: "/website/pages/service/edit" },
        ],
      },
      {
        label: "Contact Us",
        icon: Mail,
        href: "/website/contact-us",
        children: [
          { label: "Contact Settings", icon: Mail, href: "/website/contact-us" },
          { label: "Categories", icon: Folder, href: "/website/contact-us/categories" },
          { label: "Contact List", icon: FileText, href: "/website/contact-us/list" },
        ],
      },
      { label: "Hero Section", icon: Monitor, href: "/website/hero-section" },
      {
        label: "Slider",
        icon: Folder,
        href: "/website/slider",
        children: [
          { label: "Simple Slider", icon: Folder, href: "/website/simple-slider" },
          { label: "Advance Slider", icon: Calendar, href: "/website/advance-slider" },
        ],
      },
      {
        label: "Gallery",
        icon: GalleryHorizontal,
        href: "/website/gallery",
        children: [
          { label: "Gallery Images", icon: GalleryHorizontal, href: "/website/gallery" },
          { label: "Gallery Categories", icon: Folder, href: "/website/gallery/categories" },
        ],
      },
      { label: "Testimonials", icon: Star, href: "/website/testimonials" },
    ],
  },
  {
    title: "Portfolio",
    items: [
      { label: "Sponsors", icon: Award, href: "/website/portfolio/sponsors" },
      { label: "Clients", icon: Users, href: "/website/portfolio/clients" },
    ],
  },
];

export function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
