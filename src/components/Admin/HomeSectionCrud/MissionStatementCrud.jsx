import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const MissionStatementCrud = () => {
  const [heading, setHeading] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const dataRef = useRef(null); // ✅ Cache mission data

  const API_URL = import.meta.env.VITE_API_BASE_URL + "/mission";

  // ✅ Fetch and cache mission data
  const fetchMission = async () => {
    if (dataRef.current) {
      const cached = dataRef.current;
      setHeading(cached.heading);
      setDescription(cached.description);
      return;
    }

    try {
      const res = await axios.get(API_URL);
      if (res.data?.data) {
        const { heading, description } = res.data.data;
        setHeading(heading);
        setDescription(description);
        dataRef.current = res.data.data; // ✅ Save to cache
      }
    } catch (err) {
      console.error("Failed to fetch mission statement", err);
    }
  };

  useEffect(() => {
    fetchMission();
  }, []);

  // ✅ Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!heading || !description) {
      alert("Please fill in both heading and description.");
      return;
    }

    setLoading(true);
    try {
      await axios.put(API_URL, { heading, description });
      dataRef.current = { heading, description }; // ✅ Update cache
      alert("Mission statement updated successfully!");
    } catch (err) {
      console.error("Failed to update mission", err);
      alert("Update failed. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          Update Mission Statement
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Heading
            </label>
            <input
              type="text"
              value={heading}
              onChange={(e) => setHeading(e.target.value)}
              placeholder="Enter mission heading"
              className="w-full p-3 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
              placeholder="Enter mission description"
              className="w-full p-3 border border-gray-300 rounded-md bg-white resize-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-green-600 text-white rounded-md font-semibold hover:bg-green-700 transition-colors duration-200 disabled:bg-green-400 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "Saving..." : "Update Mission Statement"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default MissionStatementCrud;
