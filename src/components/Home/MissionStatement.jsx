import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

const MissionStatement = React.memo(() => {
  const [mission, setMission] = useState({ heading: "", description: "" });
  const [loading, setLoading] = useState(true);
  const dataRef = useRef(null);

  const API = import.meta.env.VITE_API_BASE_URL + "/mission";

  useEffect(() => {
    const fetchMission = async () => {
      if (dataRef.current) {
        setMission(dataRef.current);
        setLoading(false);
        return;
      }
      try {
        const res = await axios.get(API);
        dataRef.current = res.data.data;
        setMission(res.data.data);
      } catch (err) {
        console.error("Failed to fetch mission statement", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMission();
  }, []);

  return (
    <section className="bg-gradient-to-br from-[#f1fdf6] to-white py-20 px-6 md:px-10">
      <div className="max-w-5xl mx-auto bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl px-8 md:px-16 py-14 text-center border border-gray-100 transition-all duration-500 animate-fade-in-up">
        {loading ? (
          <>
            <div className="h-8 md:h-12 w-2/3 mx-auto bg-gray-200 rounded-lg mb-6 animate-pulse" />
            <div className="h-5 md:h-6 w-5/6 mx-auto bg-gray-200 rounded-md animate-pulse" />
            <div className="h-5 md:h-6 w-5/6 mx-auto bg-gray-200 rounded-md mt-2 animate-pulse" />
          </>
        ) : (
          <>
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#2d6a4f] mb-6 tracking-tight drop-shadow-sm">
              {mission.heading}
            </h2>
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed tracking-wide">
              {mission.description}
            </p>
          </>
        )}
      </div>
    </section>
  );
});

export default MissionStatement;
