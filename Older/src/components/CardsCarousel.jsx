import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

const CardCarousel = ({ cards }) => {
  return (
    <div className="lg:hidden py-5">
      <Swiper
        modules={[Autoplay, Pagination]}
        slidesPerView={1.2}
        centeredSlides={true}
        spaceBetween={20}
        loop={true}
        grabCursor={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        className="!pb-12"
      >
        {cards.map((card, index) => (
          <SwiperSlide key={index}>
            {({ isActive }) => (
              <div
                className={`transition-all duration-500 ${
                  isActive
                    ? "scale-100 opacity-100"
                    : "scale-90 opacity-60 blur-[2px]"
                }`}
              >
                <div className="relative w-full h-100 rounded-3xl overflow-hidden bg-white/10 backdrop-blur-2xl border border-white/20">

                  {/* Glow Background */}
                  <div
                    className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${card.gradient} opacity-20 blur-[100px]`}
                  />

                  <div className="relative p-6 flex flex-col h-full">
                    <h3 className="text-2xl font-semibold text-white text-center uppercase  mb-3">
                      {card.title}
                    </h3>

                    <div
                      className={`h-1 w-full rounded-full bg-gradient-to-r ${card.gradient}`}
                    />

                    {card.icons && (
                      <div className="grid grid-cols-2 gap-3 mt-5">
                        {card.icons.map(({ Icon, color }, i) => (
                          <div
                            key={i}
                            className="p-2 rounded-lg flex items-center justify-center bg-white/10 border border-white/20"
                          >
                            <Icon className={`text-2xl ${color}`} />
                          </div>
                        ))}
                      </div>
                    )}

                    <p className="mt-6 text-lg text-center text-gray-300 leading-relaxed">
                      {card.smdesc}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default CardCarousel;
