import type { LucideIcon } from "lucide-react";
import {
  Award,
  BarChart3,
  Calendar,
  CreditCard,
  FileText,
  Folder,
  GalleryHorizontal,
  Home,
  ImageIcon,
  LayoutDashboard,
  Menu,
  Monitor,
  Phone,
  Search,
  Send,
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
    items: [
      { label: "Dashboard", icon: LayoutDashboard, href: "/" },
    ],
  },
  {
    title: "Website Setup",
    items: [
      { label: "Basic Information", icon: FileText, href: "/website/basic-information" },
      { label: "Contact Information", icon: Phone, href: "/website/contact-information" },
      { label: "Social Links", icon: Users, href: "/website/social-links" },
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
          { label: "About Us", icon: FileText, href: "/website/pages/about-us/edit" },
          { label: "Services", icon: FileText, href: "/website/pages/services/edit" },
          { label: "Events", icon: FileText, href: "/website/pages/events/edit" },
          { label: "Create Page", icon: FileText, href: "/website/pages/create" },
        ],
      },
      { label: "Nav Menu", icon: Menu, href: "/website/menu" },
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
      { label: "Events", icon: Calendar, href: "/website/portfolio/events" },
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
      { label: "Preview & Publish", icon: Send, href: "/website/preview-publish" },
    ],
  },
];

export function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
