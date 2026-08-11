import { neonData } from "@/lib/neon-data";

export interface SiteSettings {
  homeDesktopImages: string[];
  homeMobileImages: string[];
  productsHeaderImage: string;
  promotionsHeaderImage: string;
  promotionsMobileImage: string;
  homePromotionImage: string;
  promotionEndAt: string;
}

export const defaultSiteSettings: SiteSettings = {
  homeDesktopImages: [
    "/images/portada.webp",
    "/images/portada2.webp",
    "/images/portada3.webp",
  ],
  homeMobileImages: [
    "/images/portada-m.webp",
    "/images/portada2-m.webp",
    "/images/portada3-m.webp",
  ],
  productsHeaderImage: "/images/portada-productos.webp",
  promotionsHeaderImage: "/images/portada-promociones.webp",
  promotionsMobileImage: "/images/promo-m.webp",
  homePromotionImage: "/images/portada-ofertas.webp",
  promotionEndAt: "2026-08-26T23:59:59-05:00",
};

interface DBSiteSettings {
  home_desktop_images: string[];
  home_mobile_images: string[];
  products_header_image: string;
  promotions_header_image: string;
  promotions_mobile_image: string;
  home_promotion_image: string;
  promotion_end_at: string;
}

export function mapSiteSettings(data: DBSiteSettings): SiteSettings {
  return {
    homeDesktopImages: data.home_desktop_images,
    homeMobileImages: data.home_mobile_images,
    productsHeaderImage: data.products_header_image,
    promotionsHeaderImage: data.promotions_header_image,
    promotionsMobileImage: data.promotions_mobile_image,
    homePromotionImage: data.home_promotion_image,
    promotionEndAt: data.promotion_end_at,
  };
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const { data, error } = await neonData
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .single();

  if (error) throw error;
  return mapSiteSettings(data as DBSiteSettings);
}

export async function updateSiteSettings(settings: SiteSettings) {
  const { error } = await neonData
    .from("site_settings")
    .update({
      home_desktop_images: settings.homeDesktopImages,
      home_mobile_images: settings.homeMobileImages,
      products_header_image: settings.productsHeaderImage,
      promotions_header_image: settings.promotionsHeaderImage,
      promotions_mobile_image: settings.promotionsMobileImage,
      home_promotion_image: settings.homePromotionImage,
      promotion_end_at: settings.promotionEndAt,
      updated_at: new Date().toISOString(),
    })
    .eq("id", 1);
  if (error) throw error;
}
