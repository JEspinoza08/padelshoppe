export type Category =
  | "palas"
  | "zapatillas"
  | "bolsos"
  | "accesorios"
  | "ropa"
  | "ofertas";
export type Brand = "Adidas" | "NOX" | "Babolat";
export type Level = "Principiante" | "Intermedio" | "Avanzado";
export type PlayStyle = "Control" | "Potencia" | "Equilibrio";
export type Weight = "Ligera" | "Pesada";
export type Label = "Nuevo" | "Oferta" | "Más vendido" | "Recomendado";

import pala1 from "../assets/productos/optimizado/palas/AT10_Luxury_Genius_12K_Alum_Xtreme_2026_by_Agustin_Tapia.webp";
import categoria1 from "../assets/palas.webp";
import categoria2 from "../assets/zapatillas.webp";
import categoria3 from "../assets/bolsos.webp";
import categoria4 from "../assets/accesorio.webp";
import categoria5 from "../assets/ropa.webp";

export type VariantType = "size" | "shoe_size";

export interface ProductVariant {
  id: string;
  productId: string | number;
  variantType: VariantType;
  variantValue: string;
  stock: number;
  isActive: boolean;
}

export interface Product {
  id: string | number;
  name: string;
  brand: Brand;
  category: Category;
  price: number;
  originalPrice?: number;
  label: Label;
  image: string;
  description: string;
  features: string[];
  recommendedFor: string;
  level: Level[];
  playStyle: PlayStyle;
  weight?: Weight;
  isOffer: boolean;
  stock?: number;
  hasVariants?: boolean;
variants?: ProductVariant[];
}

export const products: Product[] = [
  {
    id: 1,
    name: "NOX AT10 Luxury Genius 12K Alum Xtreme 2026",
    brand: "NOX",
    category: "palas",
    price: 1899,
    label: "Nuevo",
    image: pala1,
    description:
      "Pala premium de la línea AT10, diseñada para jugadores que buscan potencia, control y salida de bola profesional.",
    features: [
      "Carbono 12K",
      "Formato lágrima",
      "Balance medio-alto",
      "Acabado premium",
      "Uso avanzado",
    ],
    recommendedFor:
      "Jugadores avanzados que buscan una pala potente y precisa.",
    level: ["Avanzado"],
    playStyle: "Potencia",
    weight: "Pesada",
    isOffer: false,
  },
];
export const categories = [
  { id: "palas", label: "Palas", icon: "🏓", image: categoria1 },
  { id: "zapatillas", label: "Zapatillas", icon: "👟", image: categoria2 },
  { id: "bolsos", label: "Bolsos y Mochilas", icon: "🎒", image: categoria3 },
  { id: "accesorios", label: "Accesorios", icon: "⚡", image: categoria4 },
  { id: "ropa", label: "Ropa Deportiva", icon: "👕", image: categoria5 },
];

export const brands: Brand[] = ["Adidas", "NOX", "Babolat"];

export const WHATSAPP_NUMBER = "51950221282";

export function buildWhatsAppUrl(productName: string, price: number): string {
  const message = `Hola PadelShop Perú, estoy interesado en el producto: ${productName} - Precio: S/ ${price}. ¿Me podrían brindar más información?`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function buildWhatsAppAdvisorUrl(): string {
  const message =
    "Hola PadelShop Perú, me gustaría recibir asesoría personalizada para elegir el mejor equipamiento de pádel.";
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
