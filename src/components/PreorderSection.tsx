import { useEffect, useState } from "react";
import { ArrowRight, CalendarClock } from "lucide-react";
import { Product } from "../data/products";
import { getProducts } from "../lib/productService";
import ProductCard from "./ProductCard";

export default function PreorderSection({ onViewDetail }: { onViewDetail: (product: Product) => void }) {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    getProducts().then((items) => setProducts(items.filter((p) => p.isPreorder))).catch(console.error);
  }, []);

  if (!products.length) return null;

  return (
    <section id="preventas" className="padel-container py-10 sm:py-14">
      <div className="mb-6 rounded-2xl bg-neutral-950 px-5 py-5 text-white sm:flex sm:items-center sm:justify-between sm:px-7">
        <div>
          <div className="flex items-center gap-2 text-[#f04b2f]"><CalendarClock size={20} /><span className="text-xs font-black uppercase tracking-[0.18em]">Lanzamientos anticipados</span></div>
          <h2 className="mt-2 text-3xl font-black uppercase">¡Preventa!</h2>
          <p className="mt-1 max-w-2xl text-sm text-neutral-300">Asegura tu producto pagando solo el adelanto indicado. El saldo se cancela al recogerlo en tienda.</p>
        </div>
        <div className="mt-4 flex items-center gap-2 text-sm font-bold sm:mt-0">Reserva antes que nadie <ArrowRight size={17} /></div>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {products.slice(0, 5).map((product) => <ProductCard key={product.id} product={product} onViewDetail={onViewDetail} />)}
      </div>
    </section>
  );
}
