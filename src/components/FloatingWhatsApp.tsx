import { buildWhatsAppAdvisorUrl } from "../data/products";

export default function FloatingWhatsApp() {
  return (
    <a
      href={buildWhatsAppAdvisorUrl()}
      target="_blank"
      rel="noreferrer"
      aria-label="Hablar con PadelShop por WhatsApp"
      className="group fixed bottom-5 right-5 z-[90] flex items-center gap-3 md:bottom-7 md:right-7"
    >
      <span className="pointer-events-none hidden translate-x-2 rounded-xl bg-neutral-950 px-4 py-2 text-sm font-bold text-white opacity-0 shadow-xl transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100 sm:block">
        ¿Necesitas ayuda? Escríbenos
      </span>
      <span className="relative grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_10px_30px_rgba(37,211,102,0.38)] transition duration-200 hover:scale-110 md:h-16 md:w-16">
        <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366]/25" />
        <svg viewBox="0 0 32 32" aria-hidden="true" className="relative h-8 w-8 fill-current md:h-9 md:w-9">
          <path d="M16.03 3.2A12.66 12.66 0 0 0 5.1 22.25L3.2 28.8l6.7-1.76A12.7 12.7 0 1 0 16.03 3.2Zm0 22.93a10.5 10.5 0 0 1-5.35-1.46l-.38-.23-3.98 1.05 1.06-3.88-.25-.4a10.47 10.47 0 1 1 8.9 4.92Zm5.75-7.84c-.31-.16-1.86-.92-2.15-1.02-.29-.1-.5-.16-.71.16-.21.31-.82 1.02-1 1.23-.19.21-.37.24-.69.08-.31-.16-1.32-.49-2.52-1.56a9.42 9.42 0 0 1-1.75-2.18c-.18-.31-.02-.48.14-.64.14-.14.31-.37.47-.55.16-.18.21-.31.31-.52.11-.21.06-.39-.02-.55-.08-.16-.71-1.71-.97-2.34-.26-.62-.52-.54-.71-.55h-.61c-.21 0-.55.08-.84.39-.29.31-1.1 1.08-1.1 2.63s1.13 3.05 1.29 3.26c.16.21 2.22 3.39 5.38 4.75.75.32 1.34.52 1.79.66.75.24 1.44.21 1.98.13.6-.09 1.86-.76 2.12-1.5.26-.73.26-1.36.18-1.5-.08-.13-.29-.21-.6-.37Z" />
        </svg>
        <span className="absolute -right-0.5 -top-0.5 h-4 w-4 rounded-full border-2 border-white bg-red-500" />
      </span>
    </a>
  );
}
