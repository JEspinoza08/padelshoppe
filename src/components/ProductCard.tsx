import { Product } from "../data/products";

interface ProductCardProps {
  product: Product;
  onViewDetail: (product: Product) => void;
}

export default function ProductCard({
  product,
  onViewDetail,
}: ProductCardProps) {
  // Un producto está agotado cuando:
  // - No tiene variantes y su stock es 0.
  // - Tiene variantes, pero ninguna variante activa tiene stock.
  //
  // IMPORTANTE:
  // Una preventa NO se considera agotada aunque tenga stock físico 0,
  // porque precisamente todavía no ha ingresado el producto.
  const isOutOfStock =
    !product.isPreorder &&
    (product.variants && product.variants.length > 0
      ? !product.variants.some(
          (variant) =>
            variant.active !== false && (variant.stock ?? 0) > 0,
        )
      : (product.stock ?? 0) <= 0);

  return (
    <article className="group rounded-[7px] border border-neutral-200 bg-white transition hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(0,0,0,0.10)]">
      <div className="relative aspect-[0.96] overflow-hidden rounded-t-[7px] bg-white">
        <img
          src={product.image}
          alt={product.name}
          className={`h-full w-full object-contain p-3 transition duration-500 group-hover:scale-105 sm:p-6 ${
            isOutOfStock ? "opacity-60" : ""
          }`}
          loading="lazy"
        />

        <span
          className={`absolute left-3 top-3 rounded-[3px] px-2 py-1 text-[9px] font-black uppercase text-white ${
            isOutOfStock ? "bg-neutral-900" : "bg-[#f04b2f]"
          }`}
        >
          {isOutOfStock
            ? "Agotado"
            : product.isPreorder
              ? "Preventa"
              : product.label}
        </span>
      </div>

      <div className="border-t border-neutral-100 p-3 sm:p-4">
        <p className="text-[10px] font-black uppercase tracking-wide text-neutral-400">
          {product.brand}
        </p>

        <button
          onClick={() => onViewDetail(product)}
          className="mt-1 min-h-[40px] text-left text-[11px] font-bold leading-snug text-neutral-950 hover:text-[#f04b2f] sm:text-[13px]"
        >
          {product.name}
        </button>

        {product.isPreorder && (
          <p className="mt-2 text-[11px] font-bold text-[#f04b2f]">
            Reserva con {product.preorderPercentage || 50}% · recojo en tienda
          </p>
        )}

        {isOutOfStock && (
          <p className="mt-2 text-[11px] font-black uppercase text-neutral-500">
            Producto agotado
          </p>
        )}

        <div className="mt-3 flex items-baseline gap-2">
          <strong className="text-[14px] font-black text-neutral-950 sm:text-[16px]">
            S/ {product.price.toLocaleString("es-PE")}
          </strong>

          {product.originalPrice && (
            <span className="text-[11px] text-neutral-400 line-through">
              S/ {product.originalPrice.toLocaleString("es-PE")}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}