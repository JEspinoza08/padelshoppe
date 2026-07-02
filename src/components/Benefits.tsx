import { Truck, ShieldCheck, BadgeCheck, Headphones } from 'lucide-react';
const benefits = [
  { icon: Truck, title: 'Envíos a todo el Perú', desc: 'Entrega a nivel nacional' },
  { icon: ShieldCheck, title: 'Compra segura', desc: 'Tus datos protegidos' },
  { icon: BadgeCheck, title: 'Productos originales', desc: 'Calidad garantizada' },
  { icon: Headphones, title: 'Atención al cliente', desc: 'Estamos para ayudarte' },
];
export default function Benefits() {
  return <section className="border-y border-neutral-100 bg-white py-7"><div className="padel-container grid grid-cols-2 gap-5 lg:grid-cols-4">{benefits.map((b)=>{const Icon=b.icon;return <div key={b.title} className="flex items-center gap-4 bg-white px-2 py-3"><Icon className="text-neutral-950" size={30} strokeWidth={1.8}/><div><h3 className="text-[12px] font-black uppercase leading-tight text-neutral-950">{b.title}</h3><p className="mt-1 text-[12px] text-neutral-500">{b.desc}</p></div></div>})}</div></section>
}
