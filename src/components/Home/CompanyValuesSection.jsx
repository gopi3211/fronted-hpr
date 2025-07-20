import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_API_BASE_URL + '/home/company-values';

const CompanyValuesSection = () => {
  const [values, setValues] = useState([]);

  const fetchValues = async () => {
    try {
      const res = await axios.get(API);
      setValues(res.data.data);
    } catch (err) {
      console.error('Error fetching company values:', err);
    }
  };

  useEffect(() => {
    fetchValues();
  }, []);

  return (
    <section className="bg-gradient-to-b from-[#f9f9f9] to-white py-20 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center text-[#567D46] mb-16">
          Why Choose HPR Infra
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {values.map((item, index) => (
            <div
              key={item.id}
              className={`flex flex-col md:flex-row ${
                index % 2 !== 0 ? 'md:flex-row-reverse' : ''
              } bg-white rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 overflow-hidden`}
            >
              <div className="md:w-1/2 w-full h-64 md:h-auto">
                <img
                  src={`data:image/jpeg;base64,${item.image}`}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="md:w-1/2 w-full flex flex-col justify-center p-8 text-center md:text-left">
                <h3 className="text-2xl font-bold text-[#23424A] mb-4">{item.title}</h3>
                <p className="text-lg leading-relaxed text-gray-800">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CompanyValuesSection;
