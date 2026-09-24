import { ArrowRight, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function NoxCollectionVideo() {
  const navigate = useNavigate();

  const goToNox = () => {
    navigate("/palas?brand=NOX");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="padel-container py-10 sm:py-14" aria-labelledby="nox-collection-title">
      <div className="overflow-hidden rounded-3xl bg-neutral-950 text-white shadow-xl">
        <div className="grid items-center lg:grid-cols-[0.82fr_1.45fr]">
          <div className="order-2 px-6 py-8 sm:px-9 sm:py-10 lg:order-1 lg:px-10 xl:px-12">
            <div className="mb-4 flex items-center gap-2 text-[#f04b2f]">
              <span className="h-2 w-2 rounded-full bg-[#f04b2f]" />
              <span className="text-xs font-black uppercase tracking-[0.2em]">NOX · Nueva colección</span>
            </div>

            <h2 id="nox-collection-title" className="text-3xl font-black uppercase leading-[0.95] sm:text-4xl xl:text-5xl">
              100% Pure<br />Padel
            </h2>
            <p className="mt-4 max-w-md text-sm leading-6 text-neutral-300 sm:text-base">
              Conoce la nueva generación NOX: innovación, rendimiento y diseño creados para llevar tu juego al siguiente nivel.
            </p>

            <button
              type="button"
              onClick={goToNox}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-black uppercase tracking-wide text-neutral-950 transition hover:bg-[#f04b2f] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#f04b2f] focus:ring-offset-2 focus:ring-offset-neutral-950"
            >
              Ver colección NOX <ArrowRight size={17} />
            </button>
          </div>

          <div className="order-1 relative bg-black lg:order-2">
            <video
              className="aspect-video h-full w-full object-cover"
              controls
              playsInline
              preload="metadata"
              poster="/images/nox-nueva-coleccion-poster.webp"
              aria-label="Video de la nueva colección NOX"
            >
              <source src="/videos/nox-nueva-coleccion.mp4" type="video/mp4" />
              Tu navegador no soporta la reproducción de video.
            </video>
            <div className="pointer-events-none absolute left-4 top-4 flex items-center gap-2 rounded-full bg-black/65 px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-white backdrop-blur-sm sm:left-5 sm:top-5">
              <Play size={13} fill="currentColor" /> Video oficial
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
