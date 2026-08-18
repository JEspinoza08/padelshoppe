import { Truck, ShieldCheck, BadgeCheck, Headphones } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/css";

const benefits = [
  {
    icon: Truck,
    title: "Envíos a todo el Perú",
    desc: "Entrega a nivel nacional",
  },
  { icon: ShieldCheck, title: "Compra segura", desc: "Tus datos protegidos" },
  {
    icon: BadgeCheck,
    title: "Productos originales",
    desc: "Calidad garantizada",
  },
  {
    icon: Headphones,
    title: "Atención al cliente",
    desc: "Estamos para ayudarte",
  },
];

export default function Benefits() {
  return (
    <section className="border-y border-neutral-100 bg-white py-5 lg:py-7">
      <div className="padel-container">
        {/* Mobile carrusel */}
        <div className="lg:hidden">
          <Swiper
  modules={[Autoplay]}
  loop
  speed={2000}
  autoplay={{
    delay: 0,
    disableOnInteraction: false,
    pauseOnMouseEnter: false,
  }}
  allowTouchMove={false}
  spaceBetween={12}
  slidesPerView={1.15}
>
            {benefits.map((b) => {
              const Icon = b.icon;

              return (
                <SwiperSlide key={b.title}>
                  <div className="flex min-h-[92px] items-center gap-4 rounded-2xl border border-neutral-100 bg-white px-4 py-4 shadow-sm">
                    <Icon
                      className="text-neutral-950"
                      size={28}
                      strokeWidth={1.8}
                    />
                    <div>
                      <h3 className="text-[12px] font-black uppercase leading-tight text-neutral-950">
                        {b.title}
                      </h3>
                      <p className="mt-1 text-[12px] text-neutral-500">
                        {b.desc}
                      </p>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>

        {/* Desktop normal */}
        <div className="hidden grid-cols-2 gap-5 lg:grid lg:grid-cols-4">
          {benefits.map((b) => {
            const Icon = b.icon;

            return (
              <div
                key={b.title}
                className="flex items-center gap-4 bg-white px-2 py-3"
              >
                <Icon
                  className="text-neutral-950"
                  size={30}
                  strokeWidth={1.8}
                />
                <div>
                  <h3 className="text-[12px] font-black uppercase leading-tight text-neutral-950">
                    {b.title}
                  </h3>
                  <p className="mt-1 text-[12px] text-neutral-500">{b.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}