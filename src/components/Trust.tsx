import { Award, ShieldCheck, HeartHandshake } from "lucide-react";
import logo1 from "../assets/modelotrust.webp";
import logo2 from "../assets/modelotrust2.webp";
import logo3 from "../assets/modelotrust3.webp";
import logo4 from "../assets/modelotrust4.webp";
import logo5 from "../assets/modelotrust5.webp";
import logo6 from "../assets/modelotrust6.webp";
import logo7 from "../assets/modelotrust7.webp";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-fade";

const trustImages = [logo1, logo2, logo3, logo4, logo5, logo6, logo7];
const items = [
  { icon: Award, title: "Experiencia", desc: "Años en el mundo del pádel." },
  { icon: ShieldCheck, title: "Calidad", desc: "Solo productos originales." },
  { icon: HeartHandshake, title: "Compromiso", desc: "Contigo y tu juego." },
];
export default function Trust() {
  return (
    <section className="bg-white py-12 lg:py-16">
      <div className="padel-container">
        <div className="overflow-hidden rounded-[8px] bg-neutral-950">
          <div className="grid lg:grid-cols-[1fr_0.95fr]">
            <div className="p-8 text-white lg:p-12">
              <p className="text-[12px] font-black uppercase tracking-[0.16em] text-[#f04b2f]">
                Sobre nosotros
              </p>
              <h2 className="mt-5 text-[30px] font-black uppercase tracking-[-0.04em] lg:text-[38px]">
                Pasión por el pádel
              </h2>
              <p className="mt-5 max-w-xl text-[14px] leading-[1.9] text-white/72">
                En PadelShop somos amantes del pádel. Seleccionamos los mejores
                productos y marcas para ofrecerte calidad, confianza y una mejor
                experiencia de compra.
              </p>
              <button className="mt-8 bg-[#f04b2f] px-7 py-3 text-[12px] font-black uppercase text-white hover:bg-[#d83d24]">
                Conoce más
              </button>
            </div>
            <div className="relative min-h-[320px] overflow-hidden">
 <Swiper
  modules={[Autoplay, EffectFade]}
  effect="fade"
  fadeEffect={{
    crossFade: true,
  }}
  slidesPerView={1}
  loop
  speed={1000}
  autoplay={{
    delay: 2500,
    disableOnInteraction: false,
  }}
  className="h-full"
>
  {trustImages.map((image, index) => (
    <SwiperSlide key={index}>
      <div
        className="h-[320px] w-full bg-cover bg-center lg:h-full"
        style={{
          backgroundImage: `url(${image})`,
        }}
      />
    </SwiperSlide>
  ))}
</Swiper>

  <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-16 bg-[#f04b2f] [clip-path:polygon(0_0,100%_0,0_100%)]" />
</div>
          </div>
        </div>
        <div className="grid gap-4 border-x border-b border-neutral-100 px-4 py-6 sm:grid-cols-3 lg:px-10">
          {items.map((it) => {
            const Icon = it.icon;
            return (
              <div key={it.title} className="flex items-center gap-4">
                <span className="grid h-11 w-11 place-items-center rounded-full border border-[#f04b2f]/25 text-[#f04b2f]">
                  <Icon size={20} />
                </span>
                <div>
                  <h3 className="text-[12px] font-black uppercase">
                    {it.title}
                  </h3>
                  <p className="mt-1 text-[12px] text-neutral-500">{it.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
