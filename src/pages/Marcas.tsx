import Header from "../components/Header";
import Brands from "../components/Brands";
import Footer from "../components/Footer";
import { ArrowRight, ShieldCheck, Truck, BadgeCheck } from "lucide-react";

export default function Marcas() {
  const scrollToBrands = () => {
    document.getElementById("marcas")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white">
      <Header onSearch={() => {}} />

      <section className="pt-28 pb-16 px-6 bg-gradient-to-br from-neutral-50 via-white to-neutral-100 text-neutral-950">
        <div className="max-w-7xl mx-auto grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-center">
          <div>
            <span className="text-[#e84c2b] font-black uppercase text-sm tracking-[0.2em]">
              Marcas oficiales
            </span>

            <h1 className="mt-4 text-4xl md:text-6xl font-black uppercase tracking-tight leading-tight">
              Las mejores marcas del pádel mundial
            </h1>

            <p className="mt-5 max-w-2xl text-neutral-600 text-lg">
              Encuentra palas, zapatillas, ropa y accesorios de marcas reconocidas para jugadores principiantes, intermedios y avanzados.
            </p>

            <button
              onClick={scrollToBrands}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#f04b2f] px-7 py-3 text-sm font-black uppercase text-white transition hover:bg-black"
            >
              Explorar marcas
              <ArrowRight size={18} />
            </button>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="flex items-center gap-2 text-sm font-bold text-neutral-700">
                <BadgeCheck className="text-[#f04b2f]" size={18} />
                Originales
              </div>
              <div className="flex items-center gap-2 text-sm font-bold text-neutral-700">
                <ShieldCheck className="text-[#f04b2f]" size={18} />
                Garantía
              </div>
              <div className="flex items-center gap-2 text-sm font-bold text-neutral-700">
                <Truck className="text-[#f04b2f]" size={18} />
                Envíos a Perú
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="grid grid-cols-2 gap-4">
              {["ADIDAS", "NOX", "BABOLAT", "HEAD"].map((brand) => (
                <div
                  key={brand}
                  className="grid h-28 place-items-center rounded-2xl bg-neutral-50 border border-neutral-200"
                >
                  <span className="text-xl font-black">{brand}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Brands />

      <Footer />
    </div>
  );
}