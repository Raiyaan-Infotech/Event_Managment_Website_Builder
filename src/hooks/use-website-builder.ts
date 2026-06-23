"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { UseQueryOptions } from "@tanstack/react-query";
import { websiteBuilderApi } from "@/lib/website-builder-api";

export const websiteBuilderKeys = {
  all: ["vendor-website-builder"] as const,
  data: ["vendor-website-builder", "data"] as const,
  previewData: ["vendor-website-builder", "preview-data"] as const,
  vendorAbout: ["vendor-website-builder", "vendor-about"] as const,
  pages: ["vendor-website-builder", "pages"] as const,
  galleryCategories: ["vendor-website-builder", "gallery-categories"] as const,
  galleryItems: ["vendor-website-builder", "gallery-items"] as const,
  contactCategories: ["vendor-website-builder", "contact-categories"] as const,
  contactMessages: ["vendor-website-builder", "contact-messages"] as const,
  testimonials: ["vendor-website-builder", "testimonials"] as const,
  clients: ["vendor-website-builder", "clients"] as const,
  sponsors: ["vendor-website-builder", "sponsors"] as const,
  sliders: ["vendor-website-builder", "sliders"] as const,
};

type QueryKey = readonly unknown[];
type BuilderQueryOptions<TData> = Omit<
  UseQueryOptions<TData, Error, TData, QueryKey>,
  "queryKey" | "queryFn"
>;

// Scoped invalidation: a save refetches ONLY the section(s) it touched plus the
// aggregate views that mirror every section (builder-data + preview-data).
// Previously every save invalidated `keys.all`, marking ALL 14 section queries
// stale at once — far more refetching than needed. Pass the affected section
// key(s) per mutation instead.
function useBuilderMutation<TPayload, TResult>(
  mutationFn: (payload: TPayload) => Promise<TResult>,
  invalidateKeys: QueryKey[] = [],
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: () => {
      const keys: QueryKey[] = [
        ...invalidateKeys,
        websiteBuilderKeys.data,
        websiteBuilderKeys.previewData,
      ];
      for (const queryKey of keys) {
        queryClient.invalidateQueries({ queryKey });
      }
    },
  });
}

export function useWebsiteBuilderData(
  options?: BuilderQueryOptions<
    Awaited<ReturnType<typeof websiteBuilderApi.getBuilderData>>
  >,
) {
  return useQuery({
    queryKey: websiteBuilderKeys.data,
    queryFn: websiteBuilderApi.getBuilderData,
    ...options,
  });
}

export function useWebsitePreviewData(
  options?: BuilderQueryOptions<
    Awaited<ReturnType<typeof websiteBuilderApi.getPreviewData>>
  >,
) {
  return useQuery({
    queryKey: websiteBuilderKeys.previewData,
    queryFn: websiteBuilderApi.getPreviewData,
    ...options,
  });
}

export function useVendorAbout(
  options?: BuilderQueryOptions<
    Awaited<ReturnType<typeof websiteBuilderApi.getVendorAbout>>
  >,
) {
  return useQuery({
    queryKey: websiteBuilderKeys.vendorAbout,
    queryFn: websiteBuilderApi.getVendorAbout,
    ...options,
  });
}

export function useSubscribePublicNewsletter() {
  return useMutation({
    mutationFn: websiteBuilderApi.subscribePublicNewsletter,
  });
}

export function useLoginPublicClient() {
  return useMutation({
    mutationFn: websiteBuilderApi.loginPublicClient,
  });
}

export function useRegisterPublicClient() {
  return useMutation({
    mutationFn: websiteBuilderApi.registerPublicClient,
  });
}

export function useSaveVendorAbout() {
  return useBuilderMutation<
    Parameters<typeof websiteBuilderApi.saveVendorAbout>[0],
    Awaited<ReturnType<typeof websiteBuilderApi.saveVendorAbout>>
  >(
    websiteBuilderApi.saveVendorAbout,
    [websiteBuilderKeys.vendorAbout],
  );
}

export function useInitializeWebsite() {
  return useBuilderMutation<
    Record<string, unknown>,
    Awaited<ReturnType<typeof websiteBuilderApi.initialize>>
  >(websiteBuilderApi.initialize);
}

export function useSaveWebsiteSettings() {
  return useBuilderMutation<
    Record<string, unknown>,
    Awaited<ReturnType<typeof websiteBuilderApi.saveWebsiteSettings>>
  >(websiteBuilderApi.saveWebsiteSettings);
}

export function useSaveBasicInformation() {
  return useBuilderMutation<
    Record<string, unknown>,
    Awaited<ReturnType<typeof websiteBuilderApi.saveBasicInformation>>
  >(
    websiteBuilderApi.saveBasicInformation,
  );
}

export function useSaveSocialLinks() {
  return useBuilderMutation<
    Array<Record<string, unknown>>,
    Awaited<ReturnType<typeof websiteBuilderApi.saveSocialLinks>>
  >(
    websiteBuilderApi.saveSocialLinks,
  );
}

export function useWebsitePages() {
  return useQuery({
    queryKey: websiteBuilderKeys.pages,
    queryFn: websiteBuilderApi.listPages,
  });
}

export function useCreateWebsitePage() {
  return useBuilderMutation<
    Record<string, unknown>,
    Awaited<ReturnType<typeof websiteBuilderApi.createPage>>
  >(websiteBuilderApi.createPage, [websiteBuilderKeys.pages]);
}

export function useUpdateWebsitePage() {
  return useBuilderMutation<
    {
      id: number | string;
      payload: Record<string, unknown>;
    },
    Awaited<ReturnType<typeof websiteBuilderApi.updatePage>>
  >(({ id, payload }) => websiteBuilderApi.updatePage(id, payload), [websiteBuilderKeys.pages]);
}

export function useDeleteWebsitePage() {
  return useBuilderMutation<
    number | string,
    Awaited<ReturnType<typeof websiteBuilderApi.deletePage>>
  >(websiteBuilderApi.deletePage, [websiteBuilderKeys.pages]);
}

export function useSaveHeroSection() {
  return useBuilderMutation<
    Record<string, unknown>,
    Awaited<ReturnType<typeof websiteBuilderApi.saveHeroSection>>
  >(
    websiteBuilderApi.saveHeroSection,
  );
}

export function useSliders() {
  return useQuery({
    queryKey: websiteBuilderKeys.sliders,
    queryFn: websiteBuilderApi.listSliders,
  });
}

export function useCreateSlider() {
  return useBuilderMutation<
    Record<string, unknown>,
    Awaited<ReturnType<typeof websiteBuilderApi.createSlider>>
  >(websiteBuilderApi.createSlider, [websiteBuilderKeys.sliders]);
}

export function useUpdateSlider() {
  return useBuilderMutation<
    {
      id: number | string;
      payload: Record<string, unknown>;
    },
    Awaited<ReturnType<typeof websiteBuilderApi.updateSlider>>
  >(({ id, payload }) => websiteBuilderApi.updateSlider(id, payload), [websiteBuilderKeys.sliders]);
}

export function useReplaceSliderItems() {
  return useBuilderMutation<
    {
      sliderId: number | string;
      items: Array<Record<string, unknown>>;
    },
    Awaited<ReturnType<typeof websiteBuilderApi.replaceSliderItems>>
  >(({ sliderId, items }) => websiteBuilderApi.replaceSliderItems(sliderId, items), [websiteBuilderKeys.sliders]);
}

export function useSaveFooter() {
  return useBuilderMutation<
    Record<string, unknown>,
    Awaited<ReturnType<typeof websiteBuilderApi.saveFooter>>
  >(websiteBuilderApi.saveFooter);
}

export function useSaveSeo() {
  return useBuilderMutation<
    Record<string, unknown>,
    Awaited<ReturnType<typeof websiteBuilderApi.saveSeo>>
  >(websiteBuilderApi.saveSeo);
}

export function useSaveMenuItems() {
  return useBuilderMutation<
    Array<Record<string, unknown>>,
    Awaited<ReturnType<typeof websiteBuilderApi.saveMenuItems>>
  >(
    websiteBuilderApi.saveMenuItems,
  );
}

export function useSaveUiBlocks() {
  return useBuilderMutation<
    Array<Record<string, unknown>>,
    Awaited<ReturnType<typeof websiteBuilderApi.saveUiBlocks>>
  >(
    websiteBuilderApi.saveUiBlocks,
  );
}

export function useGalleryCategories() {
  return useQuery({
    queryKey: websiteBuilderKeys.galleryCategories,
    queryFn: websiteBuilderApi.listGalleryCategories,
  });
}

export function useCreateGalleryCategory() {
  return useBuilderMutation<
    Record<string, unknown>,
    Awaited<ReturnType<typeof websiteBuilderApi.createGalleryCategory>>
  >(websiteBuilderApi.createGalleryCategory, [websiteBuilderKeys.galleryCategories]);
}

export function useUpdateGalleryCategory() {
  return useBuilderMutation<
    {
      id: number | string;
      payload: Record<string, unknown>;
    },
    Awaited<ReturnType<typeof websiteBuilderApi.updateGalleryCategory>>
  >(({ id, payload }) => websiteBuilderApi.updateGalleryCategory(id, payload), [websiteBuilderKeys.galleryCategories]);
}

export function useDeleteGalleryCategory() {
  return useBuilderMutation<
    number | string,
    Awaited<ReturnType<typeof websiteBuilderApi.deleteGalleryCategory>>
  >(websiteBuilderApi.deleteGalleryCategory, [websiteBuilderKeys.galleryCategories]);
}

export function useGalleryItems() {
  return useQuery({
    queryKey: websiteBuilderKeys.galleryItems,
    queryFn: websiteBuilderApi.listGalleryItems,
  });
}

export function useCreateGalleryItem() {
  return useBuilderMutation<
    Record<string, unknown>,
    Awaited<ReturnType<typeof websiteBuilderApi.createGalleryItem>>
  >(websiteBuilderApi.createGalleryItem, [websiteBuilderKeys.galleryItems]);
}

export function useUpdateGalleryItem() {
  return useBuilderMutation<
    {
      id: number | string;
      payload: Record<string, unknown>;
    },
    Awaited<ReturnType<typeof websiteBuilderApi.updateGalleryItem>>
  >(({ id, payload }) => websiteBuilderApi.updateGalleryItem(id, payload), [websiteBuilderKeys.galleryItems]);
}

export function useDeleteGalleryItem() {
  return useBuilderMutation<
    number | string,
    Awaited<ReturnType<typeof websiteBuilderApi.deleteGalleryItem>>
  >(websiteBuilderApi.deleteGalleryItem, [websiteBuilderKeys.galleryItems]);
}

export function useContactCategories() {
  return useQuery({
    queryKey: websiteBuilderKeys.contactCategories,
    queryFn: websiteBuilderApi.listContactCategories,
  });
}

export function useCreateContactCategory() {
  return useBuilderMutation<
    Record<string, unknown>,
    Awaited<ReturnType<typeof websiteBuilderApi.createContactCategory>>
  >(websiteBuilderApi.createContactCategory, [websiteBuilderKeys.contactCategories]);
}

export function useUpdateContactCategory() {
  return useBuilderMutation<
    {
      id: number | string;
      payload: Record<string, unknown>;
    },
    Awaited<ReturnType<typeof websiteBuilderApi.updateContactCategory>>
  >(({ id, payload }) => websiteBuilderApi.updateContactCategory(id, payload), [websiteBuilderKeys.contactCategories]);
}

export function useDeleteContactCategory() {
  return useBuilderMutation<
    number | string,
    Awaited<ReturnType<typeof websiteBuilderApi.deleteContactCategory>>
  >(websiteBuilderApi.deleteContactCategory, [websiteBuilderKeys.contactCategories]);
}

export function useSaveContactSettings() {
  return useBuilderMutation<
    Record<string, unknown>,
    Awaited<ReturnType<typeof websiteBuilderApi.saveContactSettings>>
  >(websiteBuilderApi.saveContactSettings);
}

export function useSaveContactSocialLinks() {
  return useBuilderMutation<
    Array<Record<string, unknown>>,
    Awaited<ReturnType<typeof websiteBuilderApi.saveContactSocialLinks>>
  >(websiteBuilderApi.saveContactSocialLinks);
}

export function useContactMessages() {
  return useQuery({
    queryKey: websiteBuilderKeys.contactMessages,
    queryFn: websiteBuilderApi.listContactMessages,
  });
}

export function useCreateContactMessage() {
  return useBuilderMutation<
    Record<string, unknown>,
    Awaited<ReturnType<typeof websiteBuilderApi.createContactMessage>>
  >(websiteBuilderApi.createContactMessage, [websiteBuilderKeys.contactMessages]);
}

export function useUpdateContactMessage() {
  return useBuilderMutation<
    {
      id: number | string;
      payload: Record<string, unknown>;
    },
    Awaited<ReturnType<typeof websiteBuilderApi.updateContactMessage>>
  >(({ id, payload }) => websiteBuilderApi.updateContactMessage(id, payload), [websiteBuilderKeys.contactMessages]);
}

export function useDeleteContactMessage() {
  return useBuilderMutation<
    number | string,
    Awaited<ReturnType<typeof websiteBuilderApi.deleteContactMessage>>
  >(websiteBuilderApi.deleteContactMessage, [websiteBuilderKeys.contactMessages]);
}

export function useTestimonials() {
  return useQuery({
    queryKey: websiteBuilderKeys.testimonials,
    queryFn: websiteBuilderApi.listTestimonials,
  });
}

export function useCreateTestimonial() {
  return useBuilderMutation<
    Record<string, unknown>,
    Awaited<ReturnType<typeof websiteBuilderApi.createTestimonial>>
  >(websiteBuilderApi.createTestimonial, [websiteBuilderKeys.testimonials]);
}

export function useUpdateTestimonial() {
  return useBuilderMutation<
    {
      id: number | string;
      payload: Record<string, unknown>;
    },
    Awaited<ReturnType<typeof websiteBuilderApi.updateTestimonial>>
  >(({ id, payload }) => websiteBuilderApi.updateTestimonial(id, payload), [websiteBuilderKeys.testimonials]);
}

export function useDeleteTestimonial() {
  return useBuilderMutation<
    number | string,
    Awaited<ReturnType<typeof websiteBuilderApi.deleteTestimonial>>
  >(websiteBuilderApi.deleteTestimonial, [websiteBuilderKeys.testimonials]);
}

export function useClients() {
  return useQuery({
    queryKey: websiteBuilderKeys.clients,
    queryFn: websiteBuilderApi.listClients,
  });
}

export function useCreateClient() {
  return useBuilderMutation<
    Record<string, unknown>,
    Awaited<ReturnType<typeof websiteBuilderApi.createClient>>
  >(websiteBuilderApi.createClient, [websiteBuilderKeys.clients]);
}

export function useUpdateClient() {
  return useBuilderMutation<
    {
      id: number | string;
      payload: Record<string, unknown>;
    },
    Awaited<ReturnType<typeof websiteBuilderApi.updateClient>>
  >(({ id, payload }) => websiteBuilderApi.updateClient(id, payload), [websiteBuilderKeys.clients]);
}

export function useDeleteClient() {
  return useBuilderMutation<
    number | string,
    Awaited<ReturnType<typeof websiteBuilderApi.deleteClient>>
  >(websiteBuilderApi.deleteClient, [websiteBuilderKeys.clients]);
}

export function useSponsors() {
  return useQuery({
    queryKey: websiteBuilderKeys.sponsors,
    queryFn: websiteBuilderApi.listSponsors,
  });
}

export function useCreateSponsor() {
  return useBuilderMutation<
    Record<string, unknown>,
    Awaited<ReturnType<typeof websiteBuilderApi.createSponsor>>
  >(websiteBuilderApi.createSponsor, [websiteBuilderKeys.sponsors]);
}

export function useUpdateSponsor() {
  return useBuilderMutation<
    {
      id: number | string;
      payload: Record<string, unknown>;
    },
    Awaited<ReturnType<typeof websiteBuilderApi.updateSponsor>>
  >(({ id, payload }) => websiteBuilderApi.updateSponsor(id, payload), [websiteBuilderKeys.sponsors]);
}

export function useDeleteSponsor() {
  return useBuilderMutation<
    number | string,
    Awaited<ReturnType<typeof websiteBuilderApi.deleteSponsor>>
  >(websiteBuilderApi.deleteSponsor, [websiteBuilderKeys.sponsors]);
}

export function useUploadVendorMedia() {
  return useMutation({
    mutationFn: ({ file, folder }: { file: File; folder?: string }) =>
      websiteBuilderApi.uploadVendorMedia(file, folder),
  });
}
