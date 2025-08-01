import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { motion, AnimatePresence } from "framer-motion";
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
        const res = await axios.get(API, { timeout: 5000 });
        const data = res.data?.data || [];

        // Preload images with priority for first slide
        await Promise.allSettled(
          data.map(
            (item, index) =>
              new Promise((resolve) => {
                const img = new Image();
                img.src = item.image;
                img.priority = index === 0 ? "high" : "low";
                img.onload = resolve;
                img.onerror = resolve;
              })
          )
        );

        dataRef.current = data;
        setSlides(data);
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
      <motion.div
        className="w-full h-[100vh] flex justify-center items-center bg-gradient-to-br from-lime-100 via-white to-lime-100"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="relative w-20 h-20"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
        >
          <div className="absolute inset-0 border-4 border-t-lime-500 border-lime-200 rounded-full" />
          <div className="absolute inset-2 border-4 border-t-lime-600 border-transparent rounded-full" />
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <div className="w-4 h-4 bg-lime-500 rounded-full" />
          </motion.div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="w-full h-[100vh] relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        loop={slides.length > 1}
        pagination={{
          clickable: true,
          bulletClass: "swiper-pagination-bullet bg-white/50",
          bulletActiveClass: "swiper-pagination-bullet-active bg-lime-500",
        }}
        navigation={{
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        }}
        className="w-full h-full"
        speed={800}
      >
        {slides.map((slide, idx) => (
          <SwiperSlide key={idx}>
            <motion.div
              className="w-full h-full bg-cover bg-center relative"
              style={{ backgroundImage: `url(${slide.image})` }}
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-black/50 to-black/30 z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
              />
              <motion.div
                className="relative z-20 h-full flex flex-col justify-center items-center text-center text-white px-4"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <motion.h2
                  className="text-3xl md:text-6xl font-extrabold drop-shadow-xl tracking-tight"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  {slide.heading}
                </motion.h2>
                <motion.p
                  className="mt-4 text-lg md:text-2xl max-w-2xl drop-shadow-md opacity-90 leading-relaxed"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  {slide.subheading}
                </motion.p>
              </motion.div>
            </motion.div>
          </SwiperSlide>
        ))}
        <div className="swiper-button-next !text-lime-500 !w-12 !h-12 after:!text-2xl hover:!bg-lime-500/20 rounded-full transition-all" />
        <div className="swiper-button-prev !text-lime-500 !w-12 !h-12 after:!text-2xl hover:!bg-lime-500/20 rounded-full transition-all" />
      </Swiper>
    </motion.div>
  );
});

export default HeroCarousel;