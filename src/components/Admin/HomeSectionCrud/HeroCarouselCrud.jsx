import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const HeroCarouselCrud = () => {
  const [slides, setSlides] = useState([]);
  const [heading, setHeading] = useState("");
  const [subheading, setSubheading] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [editingId, setEditingId] = useState(null);
  const dataRef = useRef(null);
  const formRef = useRef(null);

  const API = import.meta.env.VITE_API_BASE_URL + "/hero-carousel";

  const fetchSlides = async () => {
    try {
      const res = await axios.get(API);
      dataRef.current = res.data.data;
      setSlides(res.data.data);
    } catch (err) {
      toast.error("Failed to fetch slides");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const resetForm = () => {
    setHeading("");
    setSubheading("");
    setImageUrl("");
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!heading || !subheading || !imageUrl) {
      toast.warn("All fields are required");
      return;
    }

    const payload = { heading, subheading, image: imageUrl };

    try {
      if (editingId) {
        await axios.put(`${API}/${editingId}`, payload);
        toast.success("Slide updated successfully");
      } else {
        await axios.post(API, payload);
        toast.success("Slide added successfully");
      }

      resetForm();
      await fetchSlides();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Server error");
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this slide?")) return;
    try {
      await axios.delete(`${API}/${id}`);
      toast.success("Slide deleted");
      await fetchSlides();
    } catch (err) {
      toast.error("Failed to delete slide");
      console.error(err);
    }
  };

  const handleEdit = (slide) => {
    setEditingId(slide.id);
    setHeading(slide.heading);
    setSubheading(slide.subheading);
    setImageUrl(slide.image);
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-cyan-800 mb-6 text-center">
          Hero Carousel Management
        </h1>

        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-lg p-6 space-y-4 border border-cyan-100"
        >
          <input
            type="text"
            placeholder="Enter heading"
            value={heading}
            onChange={(e) => setHeading(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-400"
          />
          <input
            type="text"
            placeholder="Enter subheading"
            value={subheading}
            onChange={(e) => setSubheading(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-400"
          />
          <input
            type="text"
            placeholder="Paste image URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-400"
          />
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Preview"
              className="w-full h-40 object-cover mt-2 rounded-lg border border-cyan-200"
            />
          )}

          <button
            type="submit"
            className={`w-full py-2 rounded-lg font-semibold text-white transition-all duration-200 ${
              editingId
                ? "bg-yellow-500 hover:bg-yellow-600"
                : "bg-green-500 hover:bg-green-600"
            }`}
          >
            {editingId ? "Update Slide" : "Add Slide"}
          </button>
        </form>

        {/* Slides Display */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          {slides.map((slide) => (
            <div
              key={slide.id}
              className="bg-white rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all overflow-hidden"
            >
              <img
                src={slide.image}
                alt={slide.heading}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h4 className="text-lg font-semibold text-gray-800">
                  {slide.heading}
                </h4>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {slide.subheading}
                </p>
                <div className="mt-4 flex justify-between">
                  <button
                    onClick={() => handleEdit(slide)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(slide.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroCarouselCrud;
