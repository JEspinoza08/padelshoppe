import { useState } from 'react';
import { Menu, X, Search, ShoppingBag, User, Instagram, MessageCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { buildWhatsAppAdvisorUrl } from '../data/products';

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
    <span className="inline-flex items-center text-[22px] font-black tracking-[-0.04em] leading-none">
      <span className="text-black">PADEL</span><span className="text-[#f04b2f]">SHOP</span>
    </span>
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
    <header className="sticky top-0 z-50 bg-white shadow-[0_1px_0_rgba(0,0,0,0.08)]">
      <div className="bg-[#080808] text-white">
        <div className="padel-container flex h-[34px] items-center justify-between text-[11px] font-black uppercase tracking-[0.08em]">
          <span className="mx-auto sm:mx-0">🚚 Envíos a todo el Perú</span>
          <div className="hidden sm:flex items-center gap-4 text-white/80">
            <a href="https://instagram.com/padelshop.pe" target="_blank" rel="noreferrer" aria-label="Instagram" className="hover:text-[#f04b2f]"><Instagram size={14} /></a>
            <a href={buildWhatsAppAdvisorUrl()} target="_blank" rel="noreferrer" aria-label="WhatsApp" className="hover:text-[#f04b2f]"><MessageCircle size={14} /></a>
          </div>
        </div>
      </div>

      <div className="padel-container flex h-[70px] items-center gap-7">
        <Link to="/" className="flex items-center shrink-0" aria-label="PadelShop Perú">
          <BrandLogo />
        </Link>

        <nav className="hidden lg:flex items-center gap-7 text-[12px] font-black uppercase tracking-[-0.01em]">
          {navLinks.map((link) => (
            <button key={link.href} onClick={() => go(link.href)} className="text-neutral-950 hover:text-[#f04b2f] transition">{link.label}</button>
          ))}
        </nav>

        <form onSubmit={submit} className="ml-auto hidden md:flex w-[330px] items-center rounded-full border border-neutral-200 bg-white px-5 py-2.5 shadow-[0_1px_10px_rgba(0,0,0,0.04)] focus-within:border-[#f04b2f]">
          <input value={searchValue} onChange={(e) => setSearchValue(e.target.value)} placeholder="Buscar productos..." className="w-full bg-transparent text-[13px] text-neutral-900 outline-none placeholder:text-neutral-400" />
          <Search size={17} className="text-neutral-600" />
        </form>

        <div className="flex items-center gap-3 text-neutral-950">
          <button aria-label="Cuenta" className="hidden sm:grid h-9 w-9 place-items-center rounded-full hover:bg-neutral-100"><User size={19} /></button>
          <button aria-label="Carrito" className="relative grid h-9 w-9 place-items-center rounded-full hover:bg-neutral-100"><ShoppingBag size={19} /><span className="absolute -right-0.5 top-0 h-3 w-3 rounded-full bg-[#f04b2f] ring-2 ring-white" /></button>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden grid h-9 w-9 place-items-center rounded-full bg-neutral-950 text-white">{mobileOpen ? <X size={18} /> : <Menu size={18} />}</button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-neutral-200 bg-white lg:hidden">
          <div className="padel-container py-4 space-y-2">
            <form onSubmit={submit} className="mb-3 flex items-center rounded-full border border-neutral-200 bg-neutral-50 px-4 py-2">
              <input value={searchValue} onChange={(e) => setSearchValue(e.target.value)} placeholder="Buscar productos..." className="w-full bg-transparent text-sm outline-none" />
              <Search size={16} />
            </form>
            {navLinks.map((link) => <button key={link.href} onClick={() => go(link.href)} className="block w-full rounded-xl px-4 py-3 text-left text-sm font-black uppercase hover:bg-neutral-50">{link.label}</button>)}
            <a href={buildWhatsAppAdvisorUrl()} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 font-black text-white"><MessageCircle size={18}/> WhatsApp</a>
          </div>
        </div>
      )}
    </header>
  );
}
