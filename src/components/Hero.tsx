import hero from '../assets/hero.webp';
import hero2 from '../assets/hero2.webp';
import hero3 from '../assets/hero3.webp';
import hero4 from '../assets/hero4.webp';
import hero5 from '../assets/hero5.webp';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';

const heroImages = [hero, hero2, hero3, hero4, hero5];

import 'swiper/css';
import 'swiper/css/pagination';

interface HeroProps { onShopNow: () => void; }

export default function Hero({ onShopNow }: HeroProps) {
  return (
    <section id="inicio" className="bg-white">
      <div className="mx-auto w-full max-w-[1550px] px-8 py-8">
        <Swiper
  modules={[Autoplay, Pagination]}
  slidesPerView={1}
  loop
  speed={900}
  autoplay={{
    delay: 4500,
    disableOnInteraction: false,
  }}
  pagination={{
    clickable: true,
  }}
  grabCursor
  className="h-[320px] overflow-hidden rounded-[8px] sm:h-[450px] lg:h-[620px] xl:h-[680px]"
>
  {heroImages.map((image, index) => (
    <SwiperSlide key={index}>
      <button
        onClick={onShopNow}
        className="group relative block h-[320px] w-full overflow-hidden rounded-[8px] sm:h-[450px] lg:h-[620px] xl:h-[680px]"
      >
        <img
  src={image}
  alt={`Hero ${index + 1}`}
  className="absolute inset-0 h-full w-full object-cover object-center transition duration-500 group-hover:scale-[1.02]"
/>

        <div className="absolute inset-0 bg-black/5" />
      </button>
    </SwiperSlide>
  ))}
</Swiper>
      </div>
    </section>
  );
}