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
      { label: "Bookings", icon: Calendar, href: "/bookings" },
      { label: "Leads", icon: Users, href: "/leads" },
      { label: "Customers", icon: Users, href: "/customers" },
      { label: "Payments", icon: CreditCard, href: "/payments" },
    ],
  },
  {
    title: "WEBSITE BUILDER",
    items: [
      { label: "Website Setup", icon: Monitor, href: "/website" },
      { label: "Header", icon: Home, href: "/website/header" },
      { label: "Menu", icon: Menu, href: "/website/menu" },
      { label: "HeroSection", icon: Home, href: "/website/hero-section" },
      { label: "Simple Slider", icon: Folder, href: "/website/simple-slider" },
      { label: "Advance Slider", icon: Calendar, href: "/website/advance-slider" },
      {
        label: "Portfolio",
        icon: ImageIcon,
        href: "/website/portfolio",
        children: [
          { label: "Clients", icon: Users, href: "/website/portfolio/clients" },
          { label: "Sponsors", icon: Award, href: "/website/portfolio/sponsors" },
        ],
      },
      { label: "Gallery", icon: GalleryHorizontal, href: "/website/gallery" },
      { label: "Testimonials", icon: Star, href: "/website/testimonials" },
      { label: "Contact Information", icon: Phone, href: "/website/contact-information" },
      { label: "Footer", icon: CreditCard, href: "/website/footer" },
      { label: "SEO", icon: Search, href: "/website/seo" },
      { label: "Pages", icon: FileText, href: "/website/pages" },
      { label: "Preview & Publish", icon: Send, href: "/website/preview-publish" },
    ],
  },
  {
    items: [
      { label: "Reviews", icon: Star, href: "/reviews" },
      { label: "Analytics", icon: BarChart3, href: "/analytics" },
      { label: "Settings", icon: Settings, href: "/settings" },
    ],
  },
];

export function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
