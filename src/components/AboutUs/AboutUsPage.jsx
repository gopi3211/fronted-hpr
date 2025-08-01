import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import Footer from '../Home/Footer';

const AboutUsPage = () => {
  const [aboutData, setAboutData] = useState(null);
  const [subsections, setSubsections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [partners, setPartners] = useState([]);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [res1, res2, res3] = await Promise.all([
          axios.get(`${API_BASE_URL}/about-us`),
          axios.get(`${API_BASE_URL}/about-us/sections`),
          axios.get(`${API_BASE_URL}/partners`),
        ]);
        if (res1.data.length > 0) {
          setAboutData(res1.data[res1.data.length - 1]);
        }
        setSubsections(res2.data);
        setPartners(Array.isArray(res3.data) ? res3.data : []);
      } catch (error) {
        console.error("Error fetching About Us data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-lime-50">
        <motion.div
          className="relative w-16 h-16"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        >
          <div className="absolute inset-0 border-4 border-t-lime-500 border-lime-200 rounded-full" />
          <div className="absolute inset-2 border-4 border-t-transparent border-lime-600 rounded-full" />
        </motion.div>
      </div>
    );
  }

  if (!aboutData) {
    return (
      <div className="pt-24 text-center text-red-500 font-semibold text-lg">
        No data found.
      </div>
    );
  }

  const imageUrl = aboutData.image || "/default-image.jpg";

  return (
    <div className="pt-24 bg-gray-50 font-sans">
      {/* Hero Section */}
      <section className="relative h-[85vh] md:h-[90vh] overflow-hidden -mt-24">
        <motion.img
          src={imageUrl}
          alt="Banner"
          loading="lazy"
          onError={(e) => (e.target.src = "/default-image.jpg")}
          className="absolute top-0 left-0 w-full h-full object-cover brightness-[0.65]"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center px-6">
          <motion.h1
            className="text-4xl md:text-6xl font-extrabold drop-shadow-2xl mb-4 tracking-tight"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {aboutData.heading}
          </motion.h1>
          <motion.p
            className="max-w-3xl text-lg md:text-xl text-gray-100 leading-relaxed"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {aboutData.description}
          </motion.p>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-20 px-4 md:px-16 text-center bg-gradient-to-br from-white to-lime-100">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-lime-800"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
transition={{ duration: 0.6 }}
viewport={{ once: true, amount: 0.1 }}

        >
          Explore Our Story
        </motion.h2>
        <motion.p
          className="text-gray-600 text-lg max-w-2xl mx-auto mt-4 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
viewport={{ once: true, amount: 0.1 }}
        >
          Scroll down to discover more about HPR Infra — our legacy, our vision, and the values that define us.
        </motion.p>
      </section>

      {/* Subsections */}
      <div className="px-4 md:px-16 space-y-20 py-16 bg-white">
        <AnimatePresence>
          {subsections.map((item, idx) => {
            const isEven = idx % 2 === 0;
            const img = item.image || "/default-image.jpg";
            return (
              <motion.div
                key={item.id}
                className={`flex flex-col md:flex-row ${!isEven ? "md:flex-row-reverse" : ""} items-center bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300`}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
viewport={{ once: true, amount: 0.1 }}
              >
                <div className="md:w-1/2 w-full h-64 md:h-[360px]">
                  <motion.img
                    src={img}
                    alt={item.heading}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => (e.target.src = "/default-image.jpg")}
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.8 }}
                  />
                </div>
                <div className="md:w-1/2 w-full p-6 md:p-10 bg-white text-gray-800">
                  <motion.h3
                    className="text-2xl md:text-3xl font-bold mb-4 text-lime-800"
                    initial={{ opacity: 0, x: isEven ? -20 : 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
viewport={{ once: true, amount: 0.1 }}
                  >
                    {item.heading}
                  </motion.h3>
                  <motion.p
                    className="text-base leading-relaxed text-gray-700"
                    initial={{ opacity: 0, x: isEven ? -20 : 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
viewport={{ once: true, amount: 0.1 }}
                  >
                    {item.description}
                  </motion.p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Partners Section */}
      <section className="py-20 px-4 md:px-16 bg-gradient-to-t from-lime-50 to-white">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-center text-lime-800 mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
viewport={{ once: true, amount: 0.1 }}
        >
          Our Partners
        </motion.h2>

        {partners.length === 0 ? (
          <p className="text-center text-gray-500 font-medium">No partners listed yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {partners.map((partner) => (
              <motion.div
                key={partner.id}
                className="bg-white/95 backdrop-blur-md p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-lime-100 text-center"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
viewport={{ once: true, amount: 0.1 }}
                whileHover={{ scale: 1.03 }}
              >
                <h3 className="text-xl font-semibold mb-2 text-lime-800">{partner.name}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{partner.description}</p>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default AboutUsPage;