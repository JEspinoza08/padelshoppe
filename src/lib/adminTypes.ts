export type AdminProductVariant = {
  id?: string;
  product_id?: string;
  variant_type: "size" | "shoe_size";
  variant_value: string;
  stock: number;
  is_active: boolean;
};

export type AdminProduct = {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  original_price: number | null;
  label: string;
  image_url: string;
  description: string;
  features: string[];
  recommended_for: string;
  level: string[];
  play_style: string;
  weight: string | null;
  is_offer: boolean;
  stock: number;
  has_variants: boolean;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  product_variants?: AdminProductVariant[];
};

export type ProductFormValues = Omit<
  AdminProduct,
  "id" | "created_at" | "updated_at"
> & {
  id?: string;
};