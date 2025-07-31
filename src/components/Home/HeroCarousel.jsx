import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const HeroCarousel = React.memo(() => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const dataRef = useRef(null);

  const API = import.meta.env.VITE_API_BASE_URL + "/hero-carousel";

  useEffect(() => {
    const fetchSlides = async () => {
      if (dataRef.current) {
        setSlides(dataRef.current);
        setLoading(false);
        return;
      }
      try {
        const res = await axios.get(API);
        dataRef.current = res.data?.data || [];
        setSlides(dataRef.current);
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
              style={{
                backgroundImage: `url(${slide.image})`, // ✅ Final change here
              }}
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
});

export default HeroCarousel;
