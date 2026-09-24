import { useEffect, useState } from "react";
import banner from "../assets/Banner.webp";
import { useNavigate } from "react-router-dom";
import { Product } from "../data/products";
import { getProducts } from "../lib/productService";

interface CategoryBannerProps {
  onViewDetail: (product: Product) => void;
}

export default function CategoryBanner({
  onViewDetail,
}: CategoryBannerProps) {
  const navigate = useNavigate();
  const [luxuryProducts, setLuxuryProducts] = useState<Product[]>([]);

  const go = (href: string) => {
    navigate(href);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Determina si un producto está realmente agotado.
  // Las preventas NO se consideran agotadas aunque tengan stock físico 0.
  const isOutOfStock = (product: Product) => {
    if (product.isPreorder) {
      return false;
    }

    // Si tiene variantes, basta con que una variante activa
    // tenga stock para considerar disponible el producto.
    if (product.variants && product.variants.length > 0) {
      return !product.variants.some(
        (variant) =>
          variant.active !== false && (variant.stock ?? 0) > 0,
      );
    }

    // Producto sin variantes.
    return (product.stock ?? 0) <= 0;
  };

  useEffect(() => {
    getProducts()
      .then((data) => {
        const luxury = data
          .filter((product) =>
            product.name.toLowerCase().includes("luxury"),
          )
          .sort((a, b) => {
  const aOutOfStock = isOutOfStock(a);
  const bOutOfStock = isOutOfStock(b);

  // PRIORIDAD 1:
  // Disponibles primero, agotados al final.
  if (aOutOfStock !== bOutOfStock) {
    return aOutOfStock ? 1 : -1;
  }

  // PRIORIDAD 2:
  // Dentro de disponibles o agotados,
  // las palas aparecen primero.
  const aIsPala = a.category === "palas";
  const bIsPala = b.category === "palas";

  if (aIsPala !== bIsPala) {
    return aIsPala ? -1 : 1;
  }

  // Mantener el orden original.
  return 0;
});

        setLuxuryProducts(luxury);
      })
      .catch(console.error);
  }, []);

  return (
    <section className="bg-white py-10">
      <div className="padel-container">
        {/* BANNER */}
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

        {/* LUXURY SERIES */}
        <div className="pt-10">
          <h2 className="mb-8 text-center text-[28px] font-black uppercase tracking-[-0.04em] text-neutral-950 lg:text-[34px]">
            Luxury Series
          </h2>

          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {luxuryProducts.map((product) => {
              const outOfStock = isOutOfStock(product);

              return (
                <div
                  key={product.id}
                  onClick={() => onViewDetail(product)}
                  className="group cursor-pointer text-center"
                >
                  {/* IMAGEN */}
                  <div className="relative flex h-[180px] items-center justify-center bg-white sm:h-[250px]">
                    <img
                      src={product.image}
                      alt={product.name}
                      className={`h-full object-contain transition duration-300 group-hover:scale-105 ${
                        outOfStock ? "opacity-60" : ""
                      }`}
                    />

                    {/* ETIQUETA AGOTADO */}
                    {outOfStock && (
                      <span className="absolute left-2 top-2 rounded-[3px] bg-neutral-900 px-2 py-1 text-[9px] font-black uppercase text-white sm:left-3 sm:top-3 sm:text-[10px]">
                        Agotado
                      </span>
                    )}

                    {/* ETIQUETA PREVENTA */}
                    {product.isPreorder && (
                      <span className="absolute left-2 top-2 rounded-[3px] bg-[#f04b2f] px-2 py-1 text-[9px] font-black uppercase text-white sm:left-3 sm:top-3 sm:text-[10px]">
                        Preventa
                      </span>
                    )}
                  </div>

                  {/* NOMBRE */}
                  <p className="mt-1 min-h-[40px] text-[11px] font-bold leading-snug text-neutral-950 group-hover:text-[#f04b2f] sm:text-[13px]">
                    {product.name}
                  </p>

                  {/* MENSAJE AGOTADO */}
                  {outOfStock && (
                    <p className="mt-1 text-[10px] font-black uppercase text-neutral-500">
                      Producto agotado
                    </p>
                  )}

                  {/* MENSAJE PREVENTA */}
                  {product.isPreorder && (
                    <p className="mt-1 text-[10px] font-black text-[#f04b2f] sm:text-[11px]">
                      Reserva con {product.preorderPercentage || 50}%
                    </p>
                  )}

                  {/* PRECIO */}
                  <p className="mt-2 text-[14px] font-black text-neutral-950 sm:text-[15px]">
                    S/ {product.price.toLocaleString("es-PE")}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}