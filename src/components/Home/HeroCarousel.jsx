import React, { useEffect, useState } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const HeroCarousel = () => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const API = import.meta.env.VITE_API_BASE_URL + "/hero-carousel";

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const res = await axios.get(API);
        const formatted = res.data?.data?.map((slide) => {
          const blob = new Blob([new Uint8Array(slide.image.data)], {
            type: "image/jpeg",
          });
          return {
            heading: slide.heading,
            subheading: slide.subheading,
            image: URL.createObjectURL(blob),
          };
        }) || [];
        setSlides(formatted);
      } catch (err) {
        console.error("Error fetching slides", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSlides();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-[100vh] flex justify-center items-center bg-gray-100">
        <div className="w-12 h-12 border-4 border-green-600 border-dashed rounded-full animate-spin" />
      </div>
    );
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
