import { useState, useEffect } from "react";
import { createClient } from "@neondatabase/neon-js";
import type { Product } from "@/data/products";
import { products as staticProducts } from "@/data/products";

const client = createClient({
  auth: { url: import.meta.env.VITE_NEON_AUTH_URL, allowAnonymous: true },
  dataApi: { url: import.meta.env.VITE_NEON_DATA_API_URL },
});

type DBProduct = {
  id: number;
  name: string;
  image: string;
  gallery_images?: string[] | null;
  desc: string;
  price: number;
  popular: boolean;
  category: string;
  on_sale: boolean;
  is_new: boolean;
  rating: number;
  reviews: number;
  tamano: string;
  material: string;
  instrucciones_cuidado: string;
  dias_entrega: number;
  artesanal: boolean;
  stock: number;
  peso: number;
  is_featured_month?: boolean;
  is_active?: boolean;
};

function mapProduct(p: DBProduct): Product {
  return {
    id: p.id,
    name: p.name,
    image: p.image,
    galleryImages: p.gallery_images ?? [],
    desc: p.desc,
    price: Number(p.price),
    popular: p.popular,
    category: p.category,
    onSale: p.on_sale,
    isNew: p.is_new,
    rating: Number(p.rating),
    reviews: Number(p.reviews),
    tamano: p.tamano,
    material: p.material,
    instruccionesCuidado: p.instrucciones_cuidado,
    diasEntrega: Number(p.dias_entrega),
    artesanal: p.artesanal,
    stock: Number(p.stock),
    peso: Number(p.peso),
    isFeaturedMonth: p.is_featured_month ?? false,
    isActive: p.is_active ?? true,
  };
}

export function useProduct(slug: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const searchTerm = decodeURIComponent(slug)
      .replace(/-/g, " ")
      .trim()
      .toLocaleLowerCase("es");
    const fallback =
      staticProducts.find(
        (product) =>
          product.name.trim().toLocaleLowerCase("es") === searchTerm,
      ) ?? null;
    setProduct(fallback);
    setLoading(true);

    (async () => {
      try {
        const { data, error } = await client
          .from("products")
          .select("*")
          .ilike("name", searchTerm)
          .eq("is_active", true)
          .limit(1);
        if (!cancelled) {
          if (error) throw error;
          const databaseProduct = (data as DBProduct[] | null)?.[0];
          setProduct(databaseProduct ? mapProduct(databaseProduct) : null);
        }
      } catch (e) {
        if (!cancelled) {
          console.warn("Data API unavailable, using static data", e);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  return { product, loading };
}
