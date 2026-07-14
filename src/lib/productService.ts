import { supabase } from "./supabase";
import { Product } from "../data/products";

let productsCache: Promise<Product[]> | null = null;

export function getProducts(): Promise<Product[]> {
  if (!productsCache) {
    productsCache = fetchProducts().catch((error) => {
      productsCache = null;
      throw error;
    });
  }

  return productsCache;
}

async function fetchProducts(): Promise<Product[]> {
  const controller = new AbortController();

  const timeout = setTimeout(() => {
    controller.abort();
  }, 10000);

  try {
    const { data, error } = await supabase
      .from("products")
      .select(`
        *,
        product_variants (*)
      `)
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .abortSignal(controller.signal);

    if (error) throw error;

    return (data || []).map((p: any) => ({
      id: p.id,
      name: p.name,
      brand: p.brand,
      category: p.category,
      price: Number(p.price),
      originalPrice: p.original_price ? Number(p.original_price) : undefined,
      label: p.label,
      image: p.image_url,
      description: p.description,
      features: p.features || [],
      recommendedFor: p.recommended_for,
      level: p.level || [],
      playStyle: p.play_style,
      weight: p.weight || undefined,
      isOffer: p.is_offer,
      stock: p.stock,
      hasVariants: p.has_variants,
      variants: (p.product_variants || []).map((v: any) => ({
        id: v.id,
        productId: v.product_id,
        variantType: v.variant_type,
        variantValue: v.variant_value,
        stock: v.stock,
        isActive: v.is_active,
      })),
    }));
  } finally {
    clearTimeout(timeout);
  }
}