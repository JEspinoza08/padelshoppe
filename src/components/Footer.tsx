import { Instagram, Facebook, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { buildWhatsAppAdvisorUrl } from "../data/products";
const links = [
  { label: "Palas", href: "/palas" },
  { label: "Zapatillas", href: "/zapatillas" },
  { label: "Ropa", href: "/ropa" },
  { label: "Accesorios", href: "/accesorios" },
  { label: "Ofertas", href: "/ofertas" },
  { label: "Marcas", href: "/marcas" },
];
function BrandLogo() {
  return (
    <span className="text-[23px] font-black tracking-[-0.05em]">
      <span>PADEL</span>
      <span className="text-[#f04b2f]">SHOP</span>
    </span>
  );
}
export default function Footer() {
  return (
    <footer className="bg-[#080808] text-white">
      <div className="padel-container py-12">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <BrandLogo />
            <p className="mt-5 text-[13px] leading-relaxed text-white/60">
              Tu tienda especialista en pádel. Las mejores marcas y productos
              para tu juego.
            </p>
            <div className="mt-6 flex gap-4 text-white/70">
              <a
                href="https://instagram.com/padelshop.pe"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#f04b2f]"
              >
                <Instagram size={18} />
              </a>
              <a
                href={buildWhatsAppAdvisorUrl()}
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#f04b2f]"
              >
                <MessageCircle size={18} />
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-[13px] font-black uppercase">Categorías</h3>
            <div className="mt-4 space-y-2">
              {links.map((l) => (
                <Link
                  key={l.href}
                  to={l.href}
                  className="block text-[13px] text-white/60 hover:text-[#f04b2f]"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-[13px] font-black uppercase">Información</h3>
            <div className="mt-4 space-y-2 text-[13px] text-white/60">
              <p>Quiénes somos</p>
              <p>Preguntas frecuentes</p>
              <p>Términos y condiciones</p>
              <p>Política de privacidad</p>
              <p>Libro de reclamaciones</p>
            </div>
          </div>
          <div>
            <h3 className="text-[13px] font-black uppercase">Contacto</h3>
            <div className="mt-4 space-y-2 text-[13px] text-white/60">
              <p>WhatsApp: +51 950 221 282</p>
              <p>Email: info@padelshop.pe</p>
              <p>Envíos a todo el Perú</p>
            </div>
            <div className="mt-6 text-[12px] font-black uppercase text-white">
              Pagos con Tarjeta · Transferencia Interbancaria · Yape · Plin
            </div>
          </div>
        </div>
        <div className="mt-10 border-t border-white/10 pt-6 text-[12px] text-white/40">
          © 2026 PadelShop Perú. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
