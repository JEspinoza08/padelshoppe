import hero from '../assets/hero.webp';
import hero2 from '../assets/hero2.webp';
import hero3 from '../assets/hero3.webp';
import hero4 from '../assets/hero4.webp';
import hero5 from '../assets/hero5.webp';

import heromobile1 from '../assets/heromobile1.webp';
import heromobile2 from '../assets/heromobile2.webp';
import heromobile3 from '../assets/heromobile3.webp';
import heromobile4 from '../assets/heromobile4.webp';
import heromobile5 from '../assets/heromobile5.webp';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';

const heroSlides = [
  { image: hero, mobileImage: heromobile1, brand: 'NOX' },
  { image: hero2, mobileImage: heromobile2, brand: 'NOX' },
  { image: hero3, mobileImage: heromobile3, brand: 'NOX' },
  { image: hero4, mobileImage: heromobile4, brand: 'Adidas' },
  { image: hero5, mobileImage: heromobile5, brand: 'Babolat' },
];

interface HeroProps {
  onShopNow: (brand?: string) => void;
}

export default function Hero({ onShopNow }: HeroProps) {
  return (
    <section id="inicio" className="bg-white pb-4 sm:pt-6">
      <div className="mx-auto w-full max-w-[1550px] px-0 sm:px-8">
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
          className="aspect-[4/5] w-full overflow-hidden rounded-none sm:aspect-auto sm:h-[450px] sm:rounded-[8px] lg:h-[620px] xl:h-[680px]"
        >
          {heroSlides.map((slide, index) => (
            <SwiperSlide key={index}>
              <button
                onClick={() => onShopNow(slide.brand)}
                className="group relative block aspect-[4/5] w-full overflow-hidden rounded-none sm:aspect-auto sm:h-[450px] sm:rounded-[8px] lg:h-[620px] xl:h-[680px]"
              >
                <picture>
                  <source media="(max-width: 640px)" srcSet={slide.mobileImage} />

                  <img
                    src={slide.image}
                    alt={`Hero ${index + 1}`}
                    className="absolute inset-0 h-full w-full object-cover object-center transition duration-500 group-hover:scale-[1.02]"
                  />
                </picture>

                <div className="absolute inset-0 bg-black/5" />
              </button>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}