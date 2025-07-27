import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

const MissionStatement = React.memo(() => {
  const [mission, setMission] = useState({ heading: "", description: "" });
  const dataRef = useRef(null);

  const API = import.meta.env.VITE_API_BASE_URL + "/mission";

  useEffect(() => {
    const fetchMission = async () => {
      if (dataRef.current) {
        setMission(dataRef.current);
        return;
      }
      try {
        const res = await axios.get(API);
        dataRef.current = res.data.data;
        setMission(res.data.data);
      } catch (err) {
        console.error("Failed to fetch mission statement", err);
      }
    };
    fetchMission();
  }, []);

  return (
    <section className="bg-gradient-to-br from-[#f1fdf6] to-white py-20 px-6 md:px-10">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-lg px-8 md:px-16 py-14 text-center border border-gray-100">
        <h2 className="text-3xl md:text-5xl font-extrabold text-[#2d6a4f] mb-6 tracking-tight drop-shadow-sm">
          {mission.heading || "Loading..."}
        </h2>
        <p className="text-lg md:text-xl text-gray-700 leading-relaxed tracking-wide">
          {mission.description || "Please check back later."}
        </p>
      </div>
    </section>
  );
});

export default MissionStatement;
