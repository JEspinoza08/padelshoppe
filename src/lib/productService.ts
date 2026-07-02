import { supabase } from './supabase';
import { Product } from '../data/products';

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return (data || []).map((p) => ({
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
  }));
}