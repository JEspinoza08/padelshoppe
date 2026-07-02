import { Product } from "../data/products";
interface ProductCardProps {
  product: Product;
  onViewDetail: (product: Product) => void;
}
export default function ProductCard({
  product,
  onViewDetail,
}: ProductCardProps) {
  return (
    <article className="group rounded-[7px] border border-neutral-200 bg-white transition hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(0,0,0,0.10)]">
      <div className="relative aspect-[0.96] overflow-hidden rounded-t-[7px] bg-white">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-contain p-6 transition duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <span className="absolute left-3 top-3 rounded-[3px] bg-[#f04b2f] px-2 py-1 text-[9px] font-black uppercase text-white">
          {product.label}
        </span>
      </div>
      <div className="border-t border-neutral-100 p-4">
        <p className="text-[10px] font-black uppercase tracking-wide text-neutral-400">
          {product.brand}
        </p>
        <button
          onClick={() => onViewDetail(product)}
          className="mt-1 min-h-[42px] text-left text-[13px] font-bold leading-snug text-neutral-950 hover:text-[#f04b2f]"
        >
          {product.name}
        </button>
        <div className="mt-3 flex items-baseline gap-2">
          <strong className="text-[16px] font-black text-neutral-950">
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
