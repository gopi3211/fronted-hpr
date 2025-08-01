import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { motion } from "framer-motion";
import 'react-toastify/dist/ReactToastify.css';

const MissionStatementCrud = () => {
  const [heading, setHeading] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const dataRef = useRef(null);
  const formRef = useRef(null);

  const API_URL = import.meta.env.VITE_API_BASE_URL + "/mission";

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
        dataRef.current = res.data.data;
      }
    } catch (err) {
      toast.error("Failed to fetch mission");
      console.error("Fetch Error:", err);
    }
  };

  useEffect(() => {
    fetchMission();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!heading || !description) {
      toast.warning("Heading and description are required");
      return;
    }

    setLoading(true);
    try {
      await axios.put(API_URL, { heading, description });
      dataRef.current = { heading, description };
      toast.success("Mission statement updated!");
      formRef.current?.scrollIntoView({ behavior: "smooth" });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Update failed");
      console.error("Update Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
      <motion.div
        ref={formRef}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 border border-cyan-100"
      >
        <h1 className="text-3xl font-bold text-cyan-800 mb-6 text-center">
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
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400"
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
              className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400"
              required
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-cyan-600 text-white rounded-lg font-semibold hover:bg-cyan-700 transition-all duration-200 disabled:bg-cyan-400 disabled:cursor-not-allowed"
          >
            {loading ? "Saving..." : "Update Mission Statement"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default MissionStatementCrud;
