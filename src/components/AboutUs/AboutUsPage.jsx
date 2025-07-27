import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Footer from '../Home/Footer';

const AboutUsPage = () => {
  const [aboutData, setAboutData] = useState(null);
  const [subsections, setSubsections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [partners, setPartners] = useState([]);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";

  useEffect(() => {
   AOS.init({
  duration: 1000,
  disable: 'mobile', // ✅ smoother on phones
});

  }, []);




useEffect(() => {
  setLoading(true); // ✅ Show spinner immediately on mount

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-12 h-12 border-4 border-lime-600 border-dashed rounded-full animate-spin" />
    </div>
  );
}
  if (!aboutData) return <div className="pt-24 text-center text-red-500">No data found.</div>;

const imageUrl = aboutData.image && !imageError
  ? aboutData.image
  : '/default-image.jpg';



  return (
    <div className="pt-24 bg-gray-50 font-sans">
      {/* ✅ Hero Banner */}
      <section className="relative h-[85vh] md:h-[90vh] overflow-hidden -mt-24" data-aos="zoom-in">
   <img
  src={imageUrl}
  alt="Banner"
  onError={() => setImageError(true)}
  loading="lazy"
  className="absolute top-0 left-0 w-full h-full object-cover brightness-75"
/>

        <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-white text-center px-6">
          <h1 className="text-4xl md:text-6xl font-extrabold drop-shadow-xl mb-4">
            {aboutData.heading}
          </h1>
          <p className="max-w-3xl text-lg md:text-xl text-gray-200 leading-relaxed">
            {aboutData.description}
          </p>
        </div>
      </section>

      {/* ✅ Intro Section */}
      <section className="py-20 px-4 md:px-16 text-center space-y-4 bg-white shadow-sm" data-aos="fade-up">
        <h2 className="text-3xl md:text-4xl font-bold text-lime-700">Explore Our Story</h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Scroll down to discover more about HPR Infra — our legacy, our vision, and the values that define us.
        </p>
      </section>

      {/* ✅ Subsections */}
      <div className="px-4 md:px-16 space-y-16 py-16 bg-white">
        {subsections.map((item, idx) => {
          const isEven = idx % 2 === 0;
const subsectionImg = item.image || '/default-image.jpg';


          return (
            <div
              key={item.id}
              className={`flex flex-col md:flex-row ${!isEven ? 'md:flex-row-reverse' : ''} items-center bg-white rounded-3xl shadow-lg overflow-hidden`}
              data-aos="fade-up"
            >
              {item.image && (
                <div className="md:w-1/2 w-full h-64 md:h-[320px]">
                <img
  src={subsectionImg}
  alt={item.heading}
  className="w-full h-full object-cover"
  loading="lazy"
  onError={(e) => (e.target.src = "/default-image.jpg")}
/>

                </div>
              )}
              <div className="md:w-1/2 w-full p-6 md:p-10 text-gray-800">
                <h3 className="text-2xl md:text-3xl font-bold mb-4 text-[#23424A]">{item.heading}</h3>
                <p className="text-base leading-relaxed text-gray-700">{item.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ✅ Partners */}
      <section className="py-20 px-4 md:px-16 bg-gray-50" data-aos="fade-up">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-lime-700 mb-10">Our Partners</h2>

        {partners.length === 0 ? (
          <p className="text-center text-gray-500">No partners listed yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {partners.map((partner) => (
              <div
                key={partner.id}
                className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition text-center"
                data-aos="fade-up"
              >
                <h3 className="text-xl font-semibold mb-2 text-[#23424A]">{partner.name}</h3>
                <p className="text-gray-600 text-sm">{partner.description}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ✅ Footer */}
      <Footer />
    </div>
  );
};

export default AboutUsPage;
