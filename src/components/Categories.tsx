import { categories } from "../data/products";
interface CategoriesProps {
  onSelect: (categoryId: string) => void;
}
export default function Categories({ onSelect }: CategoriesProps) {
  return (
    <section id="categorias" className="bg-white py-12 lg:py-16">
      <div className="padel-container">
        <div className="mb-7 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-[25px] font-black uppercase tracking-[-0.04em] text-neutral-950 lg:text-[31px]">
              Categorías principales
            </h2>
          </div>
          <button
            onClick={() => onSelect("palas")}
            className="hidden text-[12px] font-black text-neutral-800 hover:text-[#f04b2f] sm:block"
          >
            Ver todo
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {categories.slice(0, 5).map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelect(cat.id)}
              className="group relative aspect-[1.12] overflow-hidden rounded-[8px] bg-neutral-950 text-left shadow-[0_8px_25px_rgba(0,0,0,0.08)]"
            >
              <img
                src={cat.image}
                alt={cat.label}
                className="absolute inset-0 h-full w-full object-cover opacity-75 transition duration-500 group-hover:scale-110 group-hover:opacity-50"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                <h3 className="text-[15px] font-black uppercase tracking-[-0.02em]">
                  {cat.label}
                </h3>
                <p className="mt-0.5 text-[11px] font-bold text-white/85">
                  Ver productos
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
