import { SlidersHorizontal, X } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { brands, Product, Category } from "../data/products";
import { getProducts } from "../lib/productService";
import ProductCard from "./ProductCard";

interface ProductsSectionProps {
  onViewDetail: (product: Product) => void;
  initialCategory?: Category | null;
  searchQuery?: string;
  selectedBrand?: string;
}
const allCategories: { id: Category; label: string }[] = [
  { id: "palas", label: "Palas" },
  { id: "zapatillas", label: "Zapatillas" },
  { id: "bolsos", label: "Bolsos" },
  { id: "accesorios", label: "Accesorios" },
  { id: "ropa", label: "Ropa" },
];
export default function ProductsSection({
  onViewDetail,
  initialCategory,
  searchQuery,
  selectedBrand,
}: ProductsSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    initialCategory || null,
  );
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const INITIAL_VISIBLE = 8;
  const [showAllProducts, setShowAllProducts] = useState(false);
  useEffect(() => {
  let mounted = true;

  setLoadingProducts(true);

  getProducts()
    .then((data) => {
      if (mounted) setProducts(data);
    })
    .catch((error) => {
      console.error("Error cargando productos:", error);
      if (mounted) setProducts([]);
    })
    .finally(() => {
      if (mounted) setLoadingProducts(false);
    });

  return () => {
    mounted = false;
  };
}, []);
  useEffect(() => {
  if (selectedBrand) {
    setSelectedBrands([selectedBrand]);
  }
}, [selectedBrand]);
  useEffect(() => {
    if (initialCategory !== undefined) setSelectedCategory(initialCategory);
  }, [initialCategory]);
  const filtered = useMemo(
    () =>
      products.filter((p) => {
        if (selectedCategory && p.category !== selectedCategory) return false;
        if (selectedBrands.length > 0 && !selectedBrands.includes(p.brand))
          return false;
        if (searchQuery?.trim()) {
          const q = searchQuery.toLowerCase();
          return (
            p.name.toLowerCase().includes(q) ||
            p.brand.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q)
          );
        }
        return true;
      }),
    [products, selectedCategory, selectedBrands, searchQuery],
  );
  const visibleProducts = showAllProducts
  ? filtered
  : filtered.slice(0, INITIAL_VISIBLE);

 useEffect(() => {
  setShowAllProducts(false);
}, [selectedCategory, selectedBrands, searchQuery, selectedBrand]);

  const toggleBrand = (b: string) =>
    setSelectedBrands((v) =>
      v.includes(b) ? v.filter((x) => x !== b) : [...v, b],
    );
  const FilterPanel = () => (
    <aside className="space-y-7">
      <div>
        <h4 className="mb-3 text-xs font-black uppercase text-neutral-950">
          Categorías
        </h4>
        <div className="space-y-1">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`block w-full rounded-lg px-3 py-2 text-left text-sm font-semibold ${selectedCategory === null ? "bg-[#f04b2f] text-white" : "text-neutral-600 hover:bg-neutral-50"}`}
          >
            Todas las categorías
          </button>
          {allCategories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`block w-full rounded-lg px-3 py-2 text-left text-sm font-semibold ${selectedCategory === c.id ? "bg-[#f04b2f] text-white" : "text-neutral-600 hover:bg-neutral-50"}`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>
      <div>
        <h4 className="mb-3 text-xs font-black uppercase text-neutral-950">
          Marcas
        </h4>
        <div className="space-y-2">
          {brands.map((b) => (
            <label
              key={b}
              className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-neutral-600"
            >
              <input
                type="checkbox"
                checked={selectedBrands.includes(b)}
                onChange={() => toggleBrand(b)}
                className="accent-[#f04b2f]"
              />
              {b}
            </label>
          ))}
        </div>
      </div>
      <button
        onClick={() => {
          setSelectedCategory(null);
          setSelectedBrands([]);
        }}
        className="w-full rounded-md border border-neutral-200 py-2 text-xs font-black uppercase hover:border-[#f04b2f] hover:text-[#f04b2f]"
      >
        Limpiar filtros
      </button>
    </aside>
  );
  return (
    <section id="productos" className="bg-white py-12 lg:py-16">
      <div className="padel-container">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-[25px] font-black uppercase tracking-[-0.04em] lg:text-[31px]">
              Productos destacados
            </h2>
            <div className="mt-4 flex gap-8 text-[12px] font-black uppercase">
              <span className="border-b-2 border-[#f04b2f] pb-2 text-[#f04b2f]">
                Novedades
              </span>
            </div>
          </div>
          <button
            onClick={() => setShowFilters(true)}
            className="flex items-center justify-center gap-2 rounded-md border border-neutral-200 bg-white px-4 py-3 text-xs font-black uppercase lg:hidden"
          >
            <SlidersHorizontal size={16} /> Filtros
          </button>
        </div>
        <div className="grid gap-8 lg:grid-cols-[230px_1fr]">
          <div className="hidden rounded-[8px] border border-neutral-200 bg-white p-5 lg:block">
            <FilterPanel />
          </div>
          <div>
            {loadingProducts ? (
              <p className="py-10 text-center text-neutral-500">
                Cargando productos...
              </p>
            ) : filtered.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-neutral-300 bg-white p-10 text-center text-neutral-500">
                No encontramos productos con esos filtros.
              </div>
            ) : (
              <>
    <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
      {visibleProducts.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onViewDetail={onViewDetail}
        />
      ))}
    </div>

    {filtered.length > INITIAL_VISIBLE && (
      <div className="mt-8 flex justify-center">
        <button
          onClick={() => setShowAllProducts((v) => !v)}
          className="rounded-md bg-[#f04b2f] px-6 py-3 text-xs font-black uppercase text-white transition hover:bg-[#d93f25]"
        >
          {showAllProducts ? "Mostrar menos productos" : "Mostrar más productos"}
        </button>
      </div>
    )}
  </>
              
            )}
          </div>
        </div>
      </div>
      {showFilters && (
        <div className="fixed inset-0 z-[80] bg-black/50 lg:hidden">
          <div className="ml-auto h-full w-80 max-w-full bg-white p-5">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="font-black uppercase">Filtros</h3>
              <button onClick={() => setShowFilters(false)}>
                <X />
              </button>
            </div>
            <FilterPanel />
          </div>
        </div>
      )}
    </section>
  );
}
