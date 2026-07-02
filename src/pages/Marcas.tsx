import Header from "../components/Header";
import Brands from "../components/Brands";
import Footer from "../components/Footer";

export default function Marcas() {
  return (
    <div className="min-h-screen bg-white">
      <Header onSearch={() => {}} />

      <section className="pt-24 pb-12 px-6 bg-neutral-50 text-neutral-950">
        <div className="max-w-7xl mx-auto">
          <span className="text-[#e84c2b] font-bold uppercase text-sm">
            Marcas top
          </span>
          <h1 className="mt-3 text-4xl md:text-5xl font-black uppercase tracking-tight">
            Marcas oficiales
          </h1>
          <p className="mt-4 max-w-2xl text-neutral-950/70 text-lg">
            Trabajamos con marcas reconocidas para jugadores principiantes, intermedios y avanzados.
          </p>
        </div>
      </section>

      <Brands />
      <Footer />
    </div>
  );
}