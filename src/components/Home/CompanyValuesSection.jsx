import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_API_BASE_URL + '/home/company-values';

const CompanyValuesSection = React.memo(() => {
  const [values, setValues] = useState([]);
  const hasFetched = useRef(false);

  const fetchValues = async () => {
    try {
      const res = await axios.get(API);
      setValues(res.data.data || []);
      console.log('[CompanyValues] Data fetched:', res.data.data);
    } catch (err) {
      console.error('[CompanyValues] Fetch error:', err);
    }
  };

  useEffect(() => {
    if (!hasFetched.current) {
      fetchValues();
      hasFetched.current = true;
    }
  }, []);

  return (
    <section className="bg-gradient-to-b from-[#f1fdf6] to-white py-20 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center text-[#2d6a4f] mb-16 drop-shadow-sm">
          Why Choose HPR Infra
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {values.map((item, index) => (
            <div
              key={item.id}
              className={`flex flex-col md:flex-row ${
                index % 2 !== 0 ? 'md:flex-row-reverse' : ''
              } bg-white rounded-3xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden border border-gray-100`}
            >
              <div className="md:w-1/2 w-full h-64 md:h-auto">
<img
  src={item.image_url}

                  alt={item.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="md:w-1/2 w-full flex flex-col justify-center p-8 text-center md:text-left bg-white">
                <h3 className="text-2xl font-semibold text-[#1b4332] mb-3">{item.title}</h3>
                <p className="text-[17px] leading-relaxed text-gray-700 tracking-wide">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

export default CompanyValuesSection;
