"use client";

import { apiRequest } from "@/lib/api-client";

export type WebsiteColorPalette = {
  id: number;
  name: string;
  primary_bg_color: string | null;
  primary_text_color: string | null;
  secondary_text_color: string | null;
  paragraph_color: string | null;
};

export type WebsiteBuilderData = {
  colorPalettes?: WebsiteColorPalette[];
  website?: Record<string, unknown> | null;
  basicInformation?: Record<string, unknown> | null;
  socialLinks?: Array<Record<string, unknown>>;
  pages?: Array<Record<string, unknown>>;
  menuItems?: Array<Record<string, unknown>>;
  uiBlocks?: Array<Record<string, unknown>>;
  heroSection?: Record<string, unknown> | null;
  sliders?: Array<Record<string, unknown>>;
  sliderItems?: Array<Record<string, unknown>>;
  galleryCategories?: Array<Record<string, unknown>>;
  galleryItems?: Array<Record<string, unknown>>;
  contactSettings?: Record<string, unknown> | null;
  contactSocialLinks?: Array<Record<string, unknown>>;
  contactCategories?: Array<Record<string, unknown>>;
  contactMessages?: Array<Record<string, unknown>>;
  testimonials?: Array<Record<string, unknown>>;
  clients?: Array<Record<string, unknown>>;
  sponsors?: Array<Record<string, unknown>>;
  footer?: Record<string, unknown> | null;
  seo?: Record<string, unknown> | null;
};

export type VendorAboutData = {
  id: number;
  company_name: string;
  company_logo: string | null;
  short_description: string | null;
  company_contact: string | null;
  company_email: string | null;
  company_address: string | null;
  latitude?: string | number | null;
  longitude?: string | number | null;
  contact: string | null;
  alt_contact: string | null;
  alt_email: string | null;
  address: string | null;
  alt_address: string | null;
  contact_mode: "default" | "alternative" | null;
  copywrite: string | null;
  poweredby: string | null;
  district?: { id: number; name: string } | null;
  locality?: { id: number; name: string; pincode?: string | null } | null;
  city?: string | null;
};

export type VendorWebsitePageRecord = {
  id: number;
  page_type: string | null;
  title: string;
  slug: string;
  content: string | null;
  excerpt: string | null;
  seo_title: string | null;
  seo_description: string | null;
  seo_keywords: string | null;
  og_image_url: string | null;
  status: string | null;
  sort_order: number | null;
  is_system: boolean | number | null;
  is_active: boolean | number | null;
};

export type VendorWebsiteGalleryCategoryRecord = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  sort_order: number | null;
  is_active: boolean | number | null;
};

export type VendorWebsiteGalleryItemRecord = {
  id: number;
  category_id: number | null;
  event_name: string;
  event_type: string | null;
  city: string | null;
  image_url: string | null;
  alt_text: string | null;
  sort_order: number | null;
  is_active: boolean | number | null;
};

export type VendorWebsiteContactCategoryRecord = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  sort_order: number | null;
  is_active: boolean | number | null;
};

export type VendorWebsiteContactMessageRecord = {
  id: number;
  category_id: number | null;
  name: string | null;
  email: string | null;
  phone: string | null;
  subject: string | null;
  message: string | null;
  status: string | null;
  metadata_json: Record<string, unknown> | null;
  is_active: boolean | number | null;
  created_at?: string | null;
};

export type VendorWebsiteTestimonialRecord = {
  id: number;
  customer_name: string;
  photo_url: string | null;
  event_name: string | null;
  feedback: string | null;
  rating: number | null;
  show_rating: boolean | number | null;
  is_featured: boolean | number | null;
  sort_order: number | null;
  is_active: boolean | number | null;
};

export type VendorWebsiteClientRecord = {
  id: number;
  name: string;
  logo_url: string | null;
  website_url: string | null;
  sort_order: number | null;
  is_active: boolean | number | null;
};

export type VendorWebsiteSponsorRecord = {
  id: number;
  name: string;
  logo_url: string | null;
  website_url: string | null;
  sort_order: number | null;
  is_active: boolean | number | null;
};

export type VendorWebsiteSliderRecord = {
  id: number;
  slider_type: string | null;
  title: string | null;
  slider_height: string | null;
  autoplay: boolean | number | null;
  autoplay_speed: number | null;
  config_json: Record<string, unknown> | null;
  is_active: boolean | number | null;
};

export type VendorWebsiteSliderItemRecord = {
  id: number;
  slider_id: number;
  title: string;
  description: string | null;
  image_url: string | null;
  button_label: string | null;
  button_page_id: number | string | null;
  button_url: string | null;
  button_color: string | null;
  button_text_color: string | null;
  sort_order: number | null;
  status: string | null;
  is_active: boolean | number | null;
};

export type VendorUploadResult = {
  path?: string;
  name?: string;
  filename?: string;
  url: string;
};

export type PublicNewsletterSubscribePayload = {
  vendorSlug: string;
  email: string;
  name?: string;
  mobile?: string;
};

export type PublicClientLoginPayload = {
  vendorSlug: string;
  email: string;
  password: string;
};

export type PublicClientRegisterPayload = {
  vendorSlug: string;
  name: string;
  email: string;
  mobile: string;
  password: string;
  subscribe_newsletter?: boolean;
};

export type PublicClientLoginResult = {
  handoff_token: string;
};

const builderBase = "/vendors/website";

export const websiteBuilderApi = {
  getVendorAbout: () => apiRequest<VendorAboutData>("/vendors/auth/about"),
  saveVendorAbout: (payload: Partial<VendorAboutData>) =>
    apiRequest<VendorAboutData>("/vendors/auth/about", {
      method: "PUT",
      body: payload,
    }),
  initialize: (payload: Record<string, unknown> = {}) =>
    apiRequest(`${builderBase}/initialize`, { method: "POST", body: payload }),
  getBuilderData: () =>
    apiRequest<WebsiteBuilderData>(`${builderBase}/builder-data`),
  getPreviewData: () =>
    apiRequest<WebsiteBuilderData>(`${builderBase}/preview-payload`),
  subscribePublicNewsletter: ({
    vendorSlug,
    email,
    name,
    mobile,
  }: PublicNewsletterSubscribePayload) =>
    apiRequest(`/public/vendors/${encodeURIComponent(vendorSlug)}/newsletter-subscribe`, {
      method: "POST",
      body: { email, name, mobile },
    }),
  loginPublicClient: ({ vendorSlug, email, password }: PublicClientLoginPayload) =>
    apiRequest<PublicClientLoginResult>(
      `/public/vendors/${encodeURIComponent(vendorSlug)}/login-client`,
      {
        method: "POST",
        body: { email, password },
        skipAuthRedirect: true,
      },
    ),
  registerPublicClient: ({
    vendorSlug,
    name,
    email,
    mobile,
    password,
    subscribe_newsletter,
  }: PublicClientRegisterPayload) =>
    apiRequest(`/public/vendors/${encodeURIComponent(vendorSlug)}/register-client`, {
      method: "POST",
      body: { name, email, mobile, password, subscribe_newsletter },
      skipAuthRedirect: true,
    }),
  saveWebsiteSettings: (payload: Record<string, unknown>) =>
    apiRequest(`${builderBase}`, {
      method: "PUT",
      body: payload,
    }),
  saveBasicInformation: (payload: Record<string, unknown>) =>
    apiRequest(`${builderBase}/basic-information`, {
      method: "PUT",
      body: payload,
    }),
  saveSocialLinks: (items: Array<Record<string, unknown>>) =>
    apiRequest(`${builderBase}/social-links`, {
      method: "PUT",
      body: { items },
    }),
  listPages: () => apiRequest<VendorWebsitePageRecord[]>(`${builderBase}/pages`),
  createPage: (payload: Record<string, unknown>) =>
    apiRequest<VendorWebsitePageRecord>(`${builderBase}/pages`, {
      method: "POST",
      body: payload,
    }),
  updatePage: (id: number | string, payload: Record<string, unknown>) =>
    apiRequest<VendorWebsitePageRecord>(`${builderBase}/pages/${id}`, {
      method: "PUT",
      body: payload,
    }),
  deletePage: (id: number | string) =>
    apiRequest<{ id: number }>(`${builderBase}/pages/${id}`, {
      method: "DELETE",
    }),
  listGalleryCategories: () =>
    apiRequest<VendorWebsiteGalleryCategoryRecord[]>(`${builderBase}/gallery/categories`),
  createGalleryCategory: (payload: Record<string, unknown>) =>
    apiRequest<VendorWebsiteGalleryCategoryRecord>(`${builderBase}/gallery/categories`, {
      method: "POST",
      body: payload,
    }),
  updateGalleryCategory: (id: number | string, payload: Record<string, unknown>) =>
    apiRequest<VendorWebsiteGalleryCategoryRecord>(`${builderBase}/gallery/categories/${id}`, {
      method: "PUT",
      body: payload,
    }),
  deleteGalleryCategory: (id: number | string) =>
    apiRequest<{ id: number }>(`${builderBase}/gallery/categories/${id}`, {
      method: "DELETE",
    }),
  listGalleryItems: () =>
    apiRequest<VendorWebsiteGalleryItemRecord[]>(`${builderBase}/gallery/items`),
  createGalleryItem: (payload: Record<string, unknown>) =>
    apiRequest<VendorWebsiteGalleryItemRecord>(`${builderBase}/gallery/items`, {
      method: "POST",
      body: payload,
    }),
  updateGalleryItem: (id: number | string, payload: Record<string, unknown>) =>
    apiRequest<VendorWebsiteGalleryItemRecord>(`${builderBase}/gallery/items/${id}`, {
      method: "PUT",
      body: payload,
    }),
  deleteGalleryItem: (id: number | string) =>
    apiRequest<{ id: number }>(`${builderBase}/gallery/items/${id}`, {
      method: "DELETE",
    }),
  listContactCategories: () =>
    apiRequest<VendorWebsiteContactCategoryRecord[]>(`${builderBase}/contact/categories`),
  createContactCategory: (payload: Record<string, unknown>) =>
    apiRequest<VendorWebsiteContactCategoryRecord>(`${builderBase}/contact/categories`, {
      method: "POST",
      body: payload,
    }),
  updateContactCategory: (id: number | string, payload: Record<string, unknown>) =>
    apiRequest<VendorWebsiteContactCategoryRecord>(`${builderBase}/contact/categories/${id}`, {
      method: "PUT",
      body: payload,
    }),
  deleteContactCategory: (id: number | string) =>
    apiRequest<{ id: number }>(`${builderBase}/contact/categories/${id}`, {
      method: "DELETE",
    }),
  saveContactSettings: (payload: Record<string, unknown>) =>
    apiRequest<Record<string, unknown>>(`${builderBase}/contact/settings`, {
      method: "PUT",
      body: payload,
    }),
  saveContactSocialLinks: (items: Array<Record<string, unknown>>) =>
    apiRequest<Array<Record<string, unknown>>>(`${builderBase}/contact/social-links`, {
      method: "PUT",
      body: { items },
    }),
  listContactMessages: () =>
    apiRequest<VendorWebsiteContactMessageRecord[]>(`${builderBase}/contact/messages`),
  createContactMessage: (payload: Record<string, unknown>) =>
    apiRequest<VendorWebsiteContactMessageRecord>(`${builderBase}/contact/messages`, {
      method: "POST",
      body: payload,
    }),
  updateContactMessage: (id: number | string, payload: Record<string, unknown>) =>
    apiRequest<VendorWebsiteContactMessageRecord>(`${builderBase}/contact/messages/${id}`, {
      method: "PUT",
      body: payload,
    }),
  deleteContactMessage: (id: number | string) =>
    apiRequest<{ id: number }>(`${builderBase}/contact/messages/${id}`, {
      method: "DELETE",
    }),
  listTestimonials: () =>
    apiRequest<VendorWebsiteTestimonialRecord[]>(`${builderBase}/testimonials`),
  createTestimonial: (payload: Record<string, unknown>) =>
    apiRequest<VendorWebsiteTestimonialRecord>(`${builderBase}/testimonials`, {
      method: "POST",
      body: payload,
    }),
  updateTestimonial: (id: number | string, payload: Record<string, unknown>) =>
    apiRequest<VendorWebsiteTestimonialRecord>(`${builderBase}/testimonials/${id}`, {
      method: "PUT",
      body: payload,
    }),
  deleteTestimonial: (id: number | string) =>
    apiRequest<{ id: number }>(`${builderBase}/testimonials/${id}`, {
      method: "DELETE",
    }),
  listClients: () =>
    apiRequest<VendorWebsiteClientRecord[]>(`${builderBase}/portfolio/clients`),
  createClient: (payload: Record<string, unknown>) =>
    apiRequest<VendorWebsiteClientRecord>(`${builderBase}/portfolio/clients`, {
      method: "POST",
      body: payload,
    }),
  updateClient: (id: number | string, payload: Record<string, unknown>) =>
    apiRequest<VendorWebsiteClientRecord>(`${builderBase}/portfolio/clients/${id}`, {
      method: "PUT",
      body: payload,
    }),
  deleteClient: (id: number | string) =>
    apiRequest<{ id: number }>(`${builderBase}/portfolio/clients/${id}`, {
      method: "DELETE",
    }),
  listSponsors: () =>
    apiRequest<VendorWebsiteSponsorRecord[]>(`${builderBase}/portfolio/sponsors`),
  createSponsor: (payload: Record<string, unknown>) =>
    apiRequest<VendorWebsiteSponsorRecord>(`${builderBase}/portfolio/sponsors`, {
      method: "POST",
      body: payload,
    }),
  updateSponsor: (id: number | string, payload: Record<string, unknown>) =>
    apiRequest<VendorWebsiteSponsorRecord>(`${builderBase}/portfolio/sponsors/${id}`, {
      method: "PUT",
      body: payload,
    }),
  deleteSponsor: (id: number | string) =>
    apiRequest<{ id: number }>(`${builderBase}/portfolio/sponsors/${id}`, {
      method: "DELETE",
    }),
  uploadVendorMedia: async (file: File, folder = "website/gallery") => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);
    const result = await apiRequest<{ file: VendorUploadResult }>("/vendors/auth/upload", {
      method: "POST",
      body: formData,
    });
    return result.file;
  },
  saveHeroSection: (payload: Record<string, unknown>) =>
    apiRequest(`${builderBase}/hero-section`, {
      method: "PUT",
      body: payload,
    }),
  listSliders: () => apiRequest<VendorWebsiteSliderRecord[]>(`${builderBase}/sliders`),
  createSlider: (payload: Record<string, unknown>) =>
    apiRequest<VendorWebsiteSliderRecord>(`${builderBase}/sliders`, {
      method: "POST",
      body: payload,
    }),
  updateSlider: (id: number | string, payload: Record<string, unknown>) =>
    apiRequest<VendorWebsiteSliderRecord>(`${builderBase}/sliders/${id}`, {
      method: "PUT",
      body: payload,
    }),
  deleteSlider: (id: number | string) =>
    apiRequest<{ id: number }>(`${builderBase}/sliders/${id}`, {
      method: "DELETE",
    }),
  listSliderItems: (sliderId: number | string) =>
    apiRequest<VendorWebsiteSliderItemRecord[]>(`${builderBase}/sliders/${sliderId}/items`),
  replaceSliderItems: (sliderId: number | string, items: Array<Record<string, unknown>>) =>
    apiRequest<VendorWebsiteSliderItemRecord[]>(`${builderBase}/sliders/${sliderId}/items`, {
      method: "PUT",
      body: { items },
    }),
  saveFooter: (payload: Record<string, unknown>) =>
    apiRequest(`${builderBase}/footer`, {
      method: "PUT",
      body: payload,
    }),
  saveSeo: (payload: Record<string, unknown>) =>
    apiRequest(`${builderBase}/seo`, {
      method: "PUT",
      body: payload,
    }),
  saveMenuItems: (items: Array<Record<string, unknown>>) =>
    apiRequest(`${builderBase}/menu-items`, {
      method: "PUT",
      body: { items },
    }),
  saveUiBlocks: (items: Array<Record<string, unknown>>) =>
    apiRequest(`${builderBase}/ui-blocks`, {
      method: "PUT",
      body: { items },
    }),
};
