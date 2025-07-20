import React, { useEffect, useState } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const HeroCarousel = () => {
  const [slides, setSlides] = useState([]);
  const API = import.meta.env.VITE_API_BASE_URL + "/hero-carousel";

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const res = await axios.get(API);
        const formatted = res.data?.data?.map((slide) => ({
          heading: slide.heading,
          subheading: slide.subheading,
          image: `data:image/jpeg;base64,${btoa(
            new Uint8Array(slide.image.data).reduce(
              (data, byte) => data + String.fromCharCode(byte),
              ""
            )
          )}`,
        })) || [];
        setSlides(formatted);
      } catch (err) {
        console.error("Error fetching slides", err);
      }
    };

    fetchSlides();
  }, []);

  if (slides.length === 0) {
    return <div className="text-center py-32 text-xl">Loading hero section...</div>;
  }

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
