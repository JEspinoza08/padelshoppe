import { useEffect, useState } from "react";
import banner from "../assets/Banner.webp";
import { useNavigate } from "react-router-dom";
import { Product } from "../data/products";
import { getProducts } from "../lib/productService";
interface CategoryBannerProps {
  onViewDetail: (product: Product) => void;
}

export default function CategoryBanner({ onViewDetail }: CategoryBannerProps) {
  const navigate = useNavigate();
  const [luxuryProducts, setLuxuryProducts] = useState<Product[]>([]);

  const go = (href: string) => {
    navigate(href);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
  getProducts()
    .then((data) => {
      const palasLuxury = data.filter((product) =>
        product.name.toLowerCase().includes("luxury")
      );

      setLuxuryProducts(palasLuxury);
    })
    .catch(console.error);
}, []);

  return (
    <section className="bg-white py-10">
      <div className="padel-container">
        <div
          className="relative min-h-[300px] overflow-hidden rounded-[8px] bg-black bg-cover bg-center lg:min-h-[390px]"
          style={{
            backgroundImage: `url(${banner})`,
          }}
        >
          <div className="absolute inset-0 bg-black/20" />

          <div className="relative z-10 flex h-full min-h-[300px] items-end p-8 lg:min-h-[390px] lg:p-12">
            <div className="text-white">
              <h2 className="text-[34px] font-black uppercase leading-none tracking-[-0.04em] lg:text-[48px]">
                Palas de <br /> Pádel
              </h2>

              <button
                onClick={() => go("/palas")}
                className="mt-5 text-[12px] font-black uppercase text-white underline underline-offset-4 hover:text-[#f04b2f]"
              >
                Ver todos los modelos
              </button>
            </div>
          </div>
        </div>
        <div className="pt-10">
  <h2 className="mb-8 text-center text-[28px] font-black uppercase tracking-[-0.04em] text-neutral-950 lg:text-[34px]">
    Luxury Series
  </h2>

  <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
    {luxuryProducts.map((product) => (
      <div
  key={product.id}
  onClick={() => onViewDetail(product)}
  className="group cursor-pointer text-center"
>
        <div className="flex h-[180px] items-center justify-center bg-white sm:h-[250px]">
          <img
            src={product.image}
            alt={product.name}
            className="h-full object-contain transition duration-300 group-hover:scale-105"
          />
        </div>

        <p className="mt-1 min-h-[40px] text-[11px] font-bold leading-snug text-neutral-950 group-hover:text-[#f04b2f] sm:text-[13px]">
  {product.name}
</p>

        <p className="mt-2 text-[14px] font-black text-neutral-950 sm:text-[15px]">
  S/ {product.price.toLocaleString("es-PE")}
</p>
      </div>
    ))}
  </div>
</div>
      </div>
    </section>
  );
}