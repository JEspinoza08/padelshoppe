import { useEffect, useRef, useState } from "react";
import { ArrowRight, Volume2, VolumeX, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SESSION_KEY = "padelshop:nox-2027-launch-seen";
type Stage = "preparing" | "reveal" | "video";

export default function NoxLaunchPopup() {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [open, setOpen] = useState(() => !sessionStorage.getItem(SESSION_KEY));
  const [stage, setStage] = useState<Stage>("preparing");
  const [videoReady, setVideoReady] = useState(false);
  const [muted, setMuted] = useState(false);
  const [autoplayWithSoundBlocked, setAutoplayWithSoundBlocked] = useState(false);
  const [introElapsed, setIntroElapsed] = useState(false);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => event.key === "Escape" && closePopup();
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  // El modal aparece inmediatamente. La intro dura ~2.2 s para crear tensión,
  // pero nunca dejamos al usuario atrapado esperando eventos de buffering de Safari/iOS.
  useEffect(() => {
    if (!open) return;

    const video = videoRef.current;
    video?.load();

    const revealTimer = window.setTimeout(() => setStage("reveal"), 1350);
    const introTimer = window.setTimeout(() => setIntroElapsed(true), 2200);

    return () => {
      window.clearTimeout(revealTimer);
      window.clearTimeout(introTimer);
    };
  }, [open]);

  useEffect(() => {
    if (!open || !introElapsed) return;

    // Si ya hay datos, hacemos BOOM a los ~2.2 s. Si iOS no dispara canPlay/loadedData,
    // damos un margen corto y mostramos el reproductor igualmente (con poster) en vez
    // de congelar la experiencia en 86 %.
    if (videoReady || (videoRef.current?.readyState ?? 0) >= 2) {
      setStage("video");
      return;
    }

    const safetyTimer = window.setTimeout(() => setStage("video"), 900);
    return () => window.clearTimeout(safetyTimer);
  }, [open, introElapsed, videoReady]);

  useEffect(() => {
    if (stage !== "video" || !videoRef.current) return;
    const video = videoRef.current;
    video.currentTime = 0;
    video.muted = false;
    setMuted(false);
    setAutoplayWithSoundBlocked(false);

    // Intentamos primero el lanzamiento con sonido. Chrome/Safari pueden bloquear
    // autoplay con audio si todavía no hubo interacción del usuario. Si ocurre,
    // iniciamos el video silenciado sin cortar el BOOM y dejamos un CTA claro
    // para activar el sonido con un toque.
    video.play().catch(() => {
      video.muted = true;
      setMuted(true);
      setAutoplayWithSoundBlocked(true);
      video.play().catch(() => undefined);
    });
  }, [stage]);

  const markSeen = () => sessionStorage.setItem(SESSION_KEY, "1");
  const closePopup = () => {
    markSeen();
    videoRef.current?.pause();
    setOpen(false);
  };

  const goToCollection = () => {
    markSeen();
    videoRef.current?.pause();
    setOpen(false);
    navigate("/palas?brand=NOX");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleSound = () => {
    const video = videoRef.current;
    if (!video) return;
    const nextMuted = !muted;
    video.muted = nextMuted;
    setMuted(nextMuted);
    if (!nextMuted) setAutoplayWithSoundBlocked(false);
    if (video.paused) video.play().catch(() => undefined);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-3 backdrop-blur-md sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="nox-launch-title"
      onMouseDown={(event) => event.target === event.currentTarget && closePopup()}
    >
      <div className="relative w-full max-w-5xl overflow-hidden rounded-2xl border border-white/10 bg-neutral-950 text-white shadow-2xl sm:rounded-3xl">
        <button type="button" onClick={closePopup} aria-label="Cerrar lanzamiento NOX 2027" className="absolute right-3 top-3 z-30 grid h-10 w-10 place-items-center rounded-full bg-black/70 text-white backdrop-blur transition hover:bg-white hover:text-black sm:right-4 sm:top-4">
          <X size={21} />
        </button>

        <div className="relative aspect-video w-full overflow-hidden bg-black">
          {/* Se mantiene montado detrás de la intro para precargar desde el primer instante. */}
          <video
            ref={videoRef}
            className={`absolute inset-0 h-full w-full object-contain transition duration-700 ${stage === "video" ? "scale-100 opacity-100" : "scale-[1.015] opacity-0"}`}
            playsInline
            muted={muted}
            preload="auto"
            poster="/images/nox-nueva-coleccion-poster.webp"
            onCanPlay={() => setVideoReady(true)}
            onLoadedData={() => setVideoReady(true)}
            onLoadedMetadata={() => {
              if ((videoRef.current?.readyState ?? 0) >= 2) setVideoReady(true);
            }}
            aria-label="Video de lanzamiento de la colección NOX 2027"
          >
            <source src="/videos/nox-nueva-coleccion.mp4" type="video/mp4" />
          </video>

          {stage !== "video" && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-neutral-950 px-6 text-center">
              <div className="mb-5 text-[10px] font-black uppercase tracking-[0.32em] text-[#f04b2f] sm:text-xs">NOX · 2027</div>
              <div className="min-h-[76px] sm:min-h-[92px]">
                <h2 id="nox-launch-title" className="animate-[fadeIn_.45s_ease-out] text-2xl font-black uppercase leading-tight sm:text-4xl md:text-5xl">
                  {stage === "preparing" ? "Estamos preparando algo buenísimo para ti" : "Aprecia nuestra nueva colección 2027"}
                </h2>
                <p className="mt-3 text-xs text-neutral-400 sm:text-sm">
                  {stage === "preparing" ? "Un lanzamiento que vale la pena esperar." : "Prepárate. Esto es NOX."}
                </p>
              </div>

              <div className="mt-7 w-full max-w-sm overflow-hidden rounded-full bg-white/10">
                <div className={`h-1 rounded-full bg-white transition-all ease-out ${stage === "preparing" ? "w-[58%] duration-700" : videoReady ? "w-full duration-500" : "w-[86%] duration-[1800ms]"}`} />
              </div>
              <span className="mt-3 text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500">
                {videoReady ? "Todo listo" : "Preparando experiencia"}
              </span>
            </div>
          )}

          {stage === "video" && (
            <>
              <button type="button" onClick={toggleSound} className="absolute bottom-3 left-3 z-20 inline-flex items-center gap-2 rounded-full bg-black/70 px-3 py-2 text-[10px] font-black uppercase tracking-wider text-white backdrop-blur transition hover:bg-white hover:text-black sm:bottom-4 sm:left-4" aria-label={muted ? "Activar sonido" : "Silenciar video"}>
                {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                {muted ? (autoplayWithSoundBlocked ? "Toca para escuchar" : "Activar sonido") : "Sonido activado"}
              </button>
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/45 to-transparent" />
            </>
          )}
        </div>

        <div className={`flex flex-col gap-4 px-5 py-5 transition duration-500 sm:flex-row sm:items-center sm:justify-between sm:px-7 sm:py-6 ${stage === "video" ? "translate-y-0 opacity-100" : "translate-y-2 opacity-60"}`}>
          <div className="pr-2">
            <div className="mb-1.5 flex items-center gap-2 text-[#f04b2f]"><span className="h-2 w-2 rounded-full bg-[#f04b2f]" /><span className="text-[11px] font-black uppercase tracking-[0.2em] sm:text-xs">Nuevo lanzamiento</span></div>
            <h3 className="text-2xl font-black uppercase leading-none sm:text-3xl">NOX 2027 · Nueva colección</h3>
            <p className="mt-2 text-sm text-neutral-400">Descubre lo nuevo de NOX y sé de los primeros en conocer la colección.</p>
          </div>
          <button type="button" onClick={goToCollection} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-black uppercase tracking-wide text-neutral-950 transition hover:bg-[#f04b2f] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#f04b2f] focus:ring-offset-2 focus:ring-offset-neutral-950">
            Descubrir colección <ArrowRight size={17} />
          </button>
        </div>
      </div>
    </div>
  );
}
