import { useState } from 'react';
import { Menu, X, Search, ShoppingBag, User, Instagram, MessageCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { buildWhatsAppAdvisorUrl } from '../data/products';
import logo from "../assets/logo.png";

const navLinks = [
  { label: 'Palas', href: '/palas' },
  { label: 'Zapatillas', href: '/zapatillas' },
  { label: 'Ropa', href: '/ropa' },
  { label: 'Accesorios', href: '/accesorios' },
  { label: 'Ofertas', href: '/ofertas' },
  { label: 'Marcas', href: '/marcas' },
];

interface HeaderProps { onSearch: (query: string) => void; }

function BrandLogo() {
  return (
    <img
      src={logo}
      alt="PadelShop Perú"
      className="h-16 w-auto object-contain"
    />
  );
}
export default function Header({ onSearch }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const navigate = useNavigate();

  const go = (href: string) => {
    setMobileOpen(false);
    navigate(href);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchValue);
    if (location.pathname !== '/') navigate('/');
    setTimeout(() => document.getElementById('productos')?.scrollIntoView({ behavior: 'smooth' }), 80);
  };

  return (
  <header className="sticky top-0 z-50 bg-white">
    <div className="h-[6px] bg-[#f04b2f]" />

    <div className="padel-container flex h-[92px] items-center">
      <Link
        to="/"
        className="flex shrink-0 items-center"
        aria-label="PadelShop Perú"
      >
        <BrandLogo />
      </Link>

      <nav className="mx-auto hidden items-center gap-10 text-[14px] font-medium text-neutral-800 lg:flex">
        {navLinks.map((link) => (
          <button
            key={link.href}
            onClick={() => go(link.href)}
            className="transition hover:text-[#f04b2f]"
          >
            {link.label}
          </button>
        ))}
      </nav>

      <div className="ml-auto flex items-center gap-5 text-neutral-950 lg:ml-0">
        <button
          aria-label="Cuenta"
          className="hidden place-items-center rounded-full transition hover:text-[#f04b2f] sm:grid"
        >
          <User size={23} strokeWidth={1.5} />
        </button>

        <button
          aria-label="Buscar"
          onClick={() =>
            document.getElementById("mobile-search")?.classList.toggle("hidden")
          }
          className="grid place-items-center rounded-full transition hover:text-[#f04b2f]"
        >
          <Search size={26} strokeWidth={1.4} />
        </button>

        <button
          aria-label="Carrito"
          className="relative grid place-items-center rounded-full transition hover:text-[#f04b2f]"
        >
          <ShoppingBag size={23} strokeWidth={1.5} />
        </button>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="grid place-items-center rounded-full lg:hidden"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </div>

    <form
      id="mobile-search"
      onSubmit={submit}
      className="hidden border-t border-neutral-100 bg-white px-7 py-4"
    >
      <div className="flex items-center rounded-full border border-neutral-200 px-5 py-3">
        <input
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Buscar productos..."
          className="w-full bg-transparent text-sm outline-none"
        />
        <Search size={18} />
      </div>
    </form>

    {mobileOpen && (
      <div className="border-t border-neutral-200 bg-white lg:hidden">
        <div className="space-y-2 px-7 py-4">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => go(link.href)}
              className="block w-full rounded-xl px-4 py-3 text-left text-sm font-semibold uppercase hover:bg-neutral-50"
            >
              {link.label}
            </button>
          ))}

          <a
            href={buildWhatsAppAdvisorUrl()}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 font-black text-white"
          >
            <MessageCircle size={18} /> WhatsApp
          </a>
        </div>
      </div>
    )}
  </header>
);
}
