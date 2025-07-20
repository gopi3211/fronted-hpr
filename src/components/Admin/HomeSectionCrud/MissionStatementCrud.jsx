import React, { useEffect, useState } from "react";
import axios from "axios";

const MissionStatementCrud = () => {
  const [heading, setHeading] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_BASE_URL + "/mission";

  // Fetch existing mission statement on mount
  const fetchMission = async () => {
    try {
      const res = await axios.get(API_URL);
      if (res.data?.data) {
        setHeading(res.data.data.heading);
        setDescription(res.data.data.description);
      }
    } catch (err) {
      console.error("Failed to fetch mission statement", err);
    }
  };

  useEffect(() => {
    fetchMission();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!heading || !description) {
      alert("Please fill in both heading and description.");
      return;
    }

    setLoading(true);
    try {
      await axios.put(API_URL, { heading, description });
      alert("Mission statement updated successfully!");
    } catch (err) {
      console.error("Failed to update mission", err);
      alert("Update failed. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-32 px-4 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Update Mission Statement
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Heading</label>
            <input
              type="text"
              value={heading}
              onChange={(e) => setHeading(e.target.value)}
              placeholder="Enter mission heading"
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-lime-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
              placeholder="Enter mission description"
              className="w-full p-3 border rounded-md resize-none focus:ring-2 focus:ring-lime-500"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-md font-semibold transition duration-200"
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
