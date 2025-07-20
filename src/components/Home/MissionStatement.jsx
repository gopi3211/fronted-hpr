import React, { useEffect, useState } from "react";
import axios from "axios";

const MissionStatement = () => {
  const [mission, setMission] = useState({ heading: "", description: "" });

  const API = import.meta.env.VITE_API_BASE_URL + "/mission";

  useEffect(() => {
    const fetchMission = async () => {
      try {
        const res = await axios.get(API);
        setMission(res.data.data);
      } catch (err) {
        console.error("Failed to fetch mission statement", err);
      }
    };

    fetchMission();
  }, []);

  return (
    <section className="bg-gray-50 py-12 px-6">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-3xl md:text-4xl font-bold text-green-700 text-center mb-4">
          {mission.heading || "Loading..."}
        </h2>
        <p className="text-gray-700 text-lg text-center leading-relaxed">
          {mission.description || "Please check back later."}
        </p>
      </div>
    </section>
  );
};

export default MissionStatement;
