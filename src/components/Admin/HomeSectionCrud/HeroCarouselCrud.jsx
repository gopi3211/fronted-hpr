import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const HeroCarouselCrud = () => {
  const [slides, setSlides] = useState([]);
  const [heading, setHeading] = useState("");
  const [subheading, setSubheading] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [editingId, setEditingId] = useState(null);
  const dataRef = useRef(null);

  const API = import.meta.env.VITE_API_BASE_URL + "/hero-carousel";

  const fetchSlides = async () => {
    if (dataRef.current) {
      setSlides(dataRef.current);
      return;
    }
    try {
      const res = await axios.get(API);
      dataRef.current = res.data.data;
      setSlides(res.data.data);
    } catch (err) {
      console.error("Failed to fetch slides", err);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!heading || !subheading || !imageUrl) {
      alert("All fields are required.");
      return;
    }

    const payload = {
      heading,
      subheading,
      image: imageUrl,
    };

    try {
      if (editingId) {
        await axios.put(`${API}/${editingId}`, payload);
        setEditingId(null);
      } else {
        await axios.post(API, payload);
      }

      setHeading("");
      setSubheading("");
      setImageUrl("");
      dataRef.current = null;
      fetchSlides();
    } catch (err) {
      console.error("Error submitting form", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/${id}`);
      dataRef.current = null;
      fetchSlides();
    } catch (err) {
      console.error("Failed to delete", err);
    }
  };

  const handleEdit = (slide) => {
    setEditingId(slide.id);
    setHeading(slide.heading);
    setSubheading(slide.subheading);
    setImageUrl(slide.image);
  };

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          Hero Carousel Management
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-lg p-6 space-y-4"
        >
          <input
            type="text"
            placeholder="Enter heading"
            value={heading}
            onChange={(e) => setHeading(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-md"
          />
          <input
            type="text"
            placeholder="Enter subheading"
            value={subheading}
            onChange={(e) => setSubheading(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-md"
          />
          <input
            type="text"
            placeholder="Paste image URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-md"
          />
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Preview"
              className="w-full h-40 object-cover mt-2 rounded-md border"
            />
          )}

          <button
            type="submit"
            className={`w-full py-2 rounded-md font-semibold text-white ${
              editingId
                ? "bg-yellow-600 hover:bg-yellow-700"
                : "bg-green-600 hover:bg-green-700"
            } transition-colors duration-200`}
          >
            {editingId ? "Update Slide" : "Add Slide"}
          </button>
        </form>

        {/* Slides */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          {slides.map((slide) => (
            <div
              key={slide.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <img
                src={slide.image}
                alt={slide.heading}
                loading="lazy"
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h4 className="text-lg font-semibold">{slide.heading}</h4>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {slide.subheading}
                </p>
                <div className="mt-4 flex justify-between">
                  <button
                    onClick={() => handleEdit(slide)}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded-md text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(slide.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm"
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
