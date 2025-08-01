import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';

const API = import.meta.env.VITE_API_BASE_URL + '/home/testimonials';

const TestimonialCarousel = () => {
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await axios.get(API);
        setTestimonials(res.data?.data || []);
      } catch (err) {
        console.error('Failed to fetch testimonials:', err);
      }
    };

    fetchTestimonials();
  }, []);

  return (
    <section className="relative py-20 bg-gradient-to-r from-[#ECFBF3] via-[#d7f4ff] to-[#ECFBF3] overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent)] animate-pulse-slow" />
      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-center mb-12 text-4xl md:text-5xl font-extrabold text-[#2d6a4f] drop-shadow-sm animate-fade-in-up">
          What Our Clients Say
        </h2>

        {testimonials.length === 0 ? (
          <p className="text-center text-gray-500">No testimonials available.</p>
        ) : (
          <Swiper
            modules={[Autoplay, Pagination]}
            autoplay={{ delay: 3500, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            loop={testimonials.length > 1}
            className="max-w-3xl mx-auto"
          >
            {testimonials.map((t) => (
              <SwiperSlide key={t.id}>
                <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 p-8 md:p-10 text-center animate-fade-in-up">
                  <img
                    src={t.image_url || '/default-avatar.png'}
                    alt={t.name}
                    className="mx-auto rounded-full border-4 border-green-400 shadow-md mb-6"
                    style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = '/default-avatar.png';
                    }}
                  />
                  <h5 className="text-xl font-bold mb-2 text-[#017DB9]">{t.name}</h5>
                  <p className="text-gray-700 text-base leading-relaxed max-w-xl mx-auto">
                    {t.message}
                  </p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </section>
  );
};

export default TestimonialCarousel;
