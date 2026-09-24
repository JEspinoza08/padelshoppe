import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  HelpCircle,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Truck,
} from "lucide-react";
import { Link } from "react-router-dom";

import { buildWhatsAppAdvisorUrl } from "../data/products";
import { getProducts } from "../lib/productService";
import type { Product } from "../data/products";

const brandInfo: Record<string, {
  description: string;
  idealFor: string;
  level: string;
}> = {
  Adidas: {
    description: "Ideal para jugadores que buscan potencia, tecnología y diseño deportivo.",
    idealFor: "Potencia",
    level: "Intermedio - Avanzado",
  },
  NOX: {
    description: "Perfecta para quienes buscan control, precisión y sensación profesional.",
    idealFor: "Control",
    level: "Todos los niveles",
  },
  Babolat: {
    description: "Una marca enfocada en ataque, velocidad y juego agresivo.",
    idealFor: "Ataque",
    level: "Intermedio - Avanzado",
  },
};

const defaultBrandInfo = {
  description:
    "Productos seleccionados para jugadores que buscan calidad, rendimiento y confianza.",
  idealFor: "Todo tipo de jugador",
  level: "Todos los niveles",
};

export default function Brands() {
    const [dbProducts, setDbProducts] = useState<Product[]>([]);

    const availableBrands = useMemo(() => {
  return Array.from(
    new Set(
      dbProducts
        .map((product) => product.brand?.trim())
        .filter((brand): brand is string => Boolean(brand)),
    ),
  ).sort((a, b) => a.localeCompare(b, "es"));
}, [dbProducts]);

useEffect(() => {
  getProducts()
    .then(setDbProducts)
    .catch((error) => {
      console.error("Error cargando productos:", error);
      setDbProducts([]);
    });
}, []);

const normalizeBrand = (value?: string) =>
  value?.trim().toLowerCase() ?? "";

  return (
    <section id="marcas" className="bg-white py-16 lg:py-24">
      <div className="padel-container">
        <div className="mb-12 text-center">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#f04b2f]">
            Calidad garantizada
          </p>
          <h2 className="mt-3 text-3xl font-black uppercase lg:text-5xl">
            Marcas destacadas
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-neutral-500">
            Elige tu marca favorita según tu estilo de juego, nivel y tipo de producto.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {availableBrands.map((brand) => {
            const totalProducts = dbProducts.filter(
  (p) => normalizeBrand(p.brand) === normalizeBrand(brand)
).length;
            const info = brandInfo[brand] ?? defaultBrandInfo;

            return (
              <Link
                key={brand}
                to={`/palas?brand=${encodeURIComponent(brand)}`}
                className="group rounded-[1.7rem] border border-neutral-200 bg-neutral-50 p-6 transition hover:-translate-y-1 hover:border-[#f04b2f] hover:bg-white hover:shadow-xl"
              >
                <div className="flex h-24 items-center justify-center rounded-2xl bg-white border border-neutral-200">
                  <span className="text-2xl font-black uppercase text-neutral-900">
                    {brand}
                  </span>
                </div>

                <h3 className="mt-6 text-xl font-black uppercase">{brand}</h3>

                <p className="mt-3 min-h-[72px] text-sm leading-6 text-neutral-500">
                  {info.description}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-neutral-700 border">
                    {totalProducts} productos
                  </span>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-neutral-700 border">
                    {info.idealFor}
                  </span>
                </div>

                <div className="mt-6 flex items-center gap-2 text-sm font-black uppercase text-[#f04b2f]">
                  Ver colección
                  <ArrowRight size={17} className="transition group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-20 grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] bg-neutral-950 p-8 text-white">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#f04b2f]">
              Guía rápida
            </p>
            <h3 className="mt-3 text-3xl font-black uppercase">
              ¿Qué marca elegir?
            </h3>
            <p className="mt-4 text-white/70">
              Si aún no sabes qué marca va mejor contigo, esta comparación te ayuda a decidir más rápido.
            </p>

            <div className="mt-8 space-y-4">
              {availableBrands.map((brand) => {
  const info = brandInfo[brand] ?? defaultBrandInfo;

                return (
                  <div
                    key={brand}
                    className="grid gap-3 rounded-2xl bg-white/10 p-4 sm:grid-cols-3"
                  >
                    <strong>{brand}</strong>
                    <span className="text-white/70">{info.idealFor}</span>
                    <span className="text-white/70">{info.level}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-[2rem] border border-neutral-200 bg-neutral-50 p-8">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#f04b2f]">
              Beneficios
            </p>
            <h3 className="mt-3 text-3xl font-black uppercase">
              Compra con confianza
            </h3>

            <div className="mt-8 grid gap-4">
              <Benefit icon={<BadgeCheck />} title="Productos originales" text="Trabajamos con marcas reconocidas y productos seleccionados." />
              <Benefit icon={<ShieldCheck />} title="Garantía garantizada" text="Compra segura con respaldo y asesoría personalizada." />
              <Benefit icon={<Truck />} title="Envíos a todo Perú" text="Recibe tus productos de pádel de forma rápida y segura." />
              <Benefit icon={<Sparkles />} title="Asesoría personalizada" text="Te ayudamos a elegir la marca y producto ideal para tu juego." />
            </div>
          </div>
        </div>

        <div className="mt-20 rounded-[2rem] bg-[#f04b2f] p-8 text-center text-white lg:p-12">
          <HelpCircle className="mx-auto mb-4" size={42} />
          <h3 className="text-3xl font-black uppercase">
            ¿No sabes qué marca elegir?
          </h3>
          <p className="mx-auto mt-4 max-w-2xl text-white/85">
            Escríbenos por WhatsApp y te ayudamos a elegir según tu nivel, estilo de juego y presupuesto.
          </p>

          <a
            href={buildWhatsAppAdvisorUrl()}
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-black uppercase text-neutral-950 transition hover:bg-neutral-950 hover:text-white"
          >
            <MessageCircle size={18} />
            Pedir asesoría
          </a>
        </div>
      </div>
    </section>
  );
}

function Benefit({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="flex gap-4 rounded-2xl bg-white p-4 border border-neutral-200">
      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#f04b2f]/10 text-[#f04b2f]">
        {icon}
      </div>
      <div>
        <h4 className="font-black">{title}</h4>
        <p className="mt-1 text-sm leading-6 text-neutral-500">{text}</p>
      </div>
    </div>
  );
}