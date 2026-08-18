import { useEffect, useState } from "react";
import { X, ShoppingCart, Check, Star } from "lucide-react";
import { Product } from "../data/products";
import { useCart } from "../context/CartContext";
import Toast from "./Toast";

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

export default function ProductModal({ product, onClose }: ProductModalProps) {
  useEffect(() => {
    if (!product) return;
    document.body.style.overflow = "hidden";
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", esc);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", esc);
    };
  }, [product, onClose]);
  const { addToCart } = useCart();
  const [selectedVariantId, setSelectedVariantId] = useState("");
  const [toast, setToast] = useState<{
  type: "success" | "error" | "warning" | "info";
  title: string;
  message?: string;
} | null>(null);

  if (!product) return null;

  const availableVariants =
    product.variants?.filter((v) => v.isActive && v.stock > 0) || [];

  const selectedVariant = availableVariants.find(
    (v) => v.id === selectedVariantId,
  );

  const needsVariant = product.hasVariants && availableVariants.length > 0;

  const hasStock = product.hasVariants
    ? availableVariants.length > 0
    : Number(product.stock) > 0;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative max-h-[92vh] w-full max-w-6xl overflow-y-auto rounded-2xl bg-white shadow-2xl animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-neutral-950 text-white"
        >
          <X size={20} />
        </button>
        <div className="grid lg:grid-cols-2">
          <div className="bg-neutral-50 p-6 lg:p-10">
            <div className="grid gap-4 sm:grid-cols-[70px_1fr] sm:gap-5">
              <div className="hidden space-y-3 sm:block">
                <div className="rounded-lg border border-[#f04b2f] bg-white p-2">
                  <img
                    src={product.image}
                    className="aspect-square object-contain"
                  />
                </div>
              </div>
              <div className="grid min-h-[260px] place-items-center sm:min-h-[420px]">
                <img
                  src={product.image}
                  alt={product.name}
                  className="max-h-[260px] w-full object-contain sm:max-h-[520px]"
                />
              </div>
            </div>
          </div>
          <div className="p-6 lg:p-10">
            <span className="rounded bg-[#f04b2f] px-2 py-1 text-[10px] font-black uppercase text-white">
              {product.label}
            </span>
            <h2 className="mt-4 text-3xl font-black text-neutral-950">
              {product.name}
            </h2>
            <div className="mt-3 flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className="fill-amber-400 text-amber-400"
                />
              ))}
            </div>
            <div className="mt-5 flex items-baseline gap-3">
              <strong className="text-3xl font-black">
                S/ {product.price.toLocaleString("es-PE")}
              </strong>
              {product.originalPrice && (
                <span className="text-lg text-neutral-400 line-through">
                  S/ {product.originalPrice.toLocaleString("es-PE")}
                </span>
              )}
            </div>
            <div className="mt-3">
              {hasStock ? (
                <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-black uppercase text-green-700">
                  Con stock
                </span>
              ) : (
                <span className="inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-black uppercase text-red-700">
                  Sin stock
                </span>
              )}
            </div>
            <p className="mt-5 text-sm leading-relaxed text-neutral-600">
              {product.description}
            </p>
            <div className="mt-6">
              <h3 className="mb-3 text-sm font-black uppercase">
                Características
              </h3>
              <ul className="space-y-2">
                {product.features.map((f) => (
                  <li key={f} className="flex gap-2 text-sm text-neutral-600">
                    <Check
                      size={16}
                      className="mt-0.5 shrink-0 text-[#f04b2f]"
                    />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-6 rounded-xl bg-neutral-50 p-4">
              <h3 className="text-sm font-black uppercase">Recomendado para</h3>
              <p className="mt-1 text-sm text-neutral-600">
                {product.recommendedFor}
              </p>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {product.level.map((l) => (
                <span
                  key={l}
                  className="rounded-full border border-neutral-200 px-3 py-1 text-xs font-bold text-neutral-600"
                >
                  {l}
                </span>
              ))}
              <span className="rounded-full bg-[#f04b2f]/10 px-3 py-1 text-xs font-bold text-[#f04b2f]">
                {product.playStyle}
              </span>
            </div>
            {needsVariant && (
              <div className="mt-6">
                <h3 className="mb-3 text-sm font-black uppercase">
                  {product.category === "zapatillas"
                    ? "Selecciona tu número"
                    : "Selecciona tu talla"}
                </h3>

                <div className="flex flex-wrap gap-2">
                  {availableVariants.map((variant) => (
                    <button
                      key={variant.id}
                      type="button"
                      onClick={() => setSelectedVariantId(variant.id)}
                      className={`rounded-xl border px-4 py-2 text-sm font-black ${
                        selectedVariantId === variant.id
                          ? "border-[#f04b2f] bg-[#f04b2f] text-white"
                          : "border-neutral-200 bg-white text-neutral-700"
                      }`}
                    >
                      {variant.variantValue}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            <div className="mt-8 grid gap-3 sm:grid-cols-[1fr_auto]">
              <button
                type="button"
                disabled={!hasStock}
                onClick={() => {
                  if (!hasStock) return;

                  if (needsVariant && !selectedVariant) {
                    setToast({
  type: "warning",
  title: "Selecciona una opción",
  message:
    product.category === "zapatillas"
      ? "Elige tu número antes de agregar el producto al carrito."
      : "Elige tu talla antes de agregar el producto al carrito.",
});
                    return;
                  }

                  addToCart(
  product,
  selectedVariant
    ? {
        id: selectedVariant.id,
        type: selectedVariant.variantType,
        value: selectedVariant.variantValue,
      }
    : undefined,
);

onClose();

setTimeout(() => {
  window.dispatchEvent(new Event("cart:add-animation"));
}, 250);
                }}
                className={`padel-btn gap-2 ${
  !hasStock ? "cursor-not-allowed opacity-50" : ""
}`}
              >
                <ShoppingCart size={18} />
                {hasStock ? "Agregar al carrito" : "Sin stock"}
              </button>
            </div>
          </div>
        </div>
      </div>
      {toast && (
  <Toast
    type={toast.type}
    title={toast.title}
    message={toast.message}
    onClose={() => setToast(null)}
  />
)}
    </div>
  );
}
