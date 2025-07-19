// src/components/HeroCarousel.jsx
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const slides = [
  {
    image: "/hero1.jpg",
    heading: "Your Dream Home Awaits",
    subheading: "Discover premium properties tailored to your needs.",
  },
  {
    image: "/hero2.jpg",
    heading: "Trusted Real Estate Experts",
    subheading: "Delivering excellence in Hyderabad for over a decade.",
  },
  {
    image: "/hero3.jpg",
    heading: "Invest Smart, Live Better",
    subheading: "Secure your future with prime real estate locations.",
  },
];

const HeroCarousel = () => {
  return (
    <div className="w-full h-[100vh] relative">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        autoplay={{ delay: 4000 }}
        loop={true}
        pagination={{ clickable: true }}
        navigation={true}
        className="w-full h-full"
      >
        {slides.map((slide, idx) => (
          <SwiperSlide key={idx}>
            <div
              className="w-full h-full bg-cover bg-center relative"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="absolute inset-0 bg-black/50 z-10" />
              <div className="relative z-20 h-full flex flex-col justify-center items-center text-center text-white px-4">
                <h2 className="text-4xl md:text-6xl font-bold drop-shadow-lg">
                  {slide.heading}
                </h2>
                <p className="mt-4 text-lg md:text-2xl max-w-2xl drop-shadow-md">
                  {slide.subheading}
                </p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HeroCarousel;
