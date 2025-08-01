import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { motion } from "framer-motion";
import "react-toastify/dist/ReactToastify.css";

const API = import.meta.env.VITE_API_BASE_URL + "/home/testimonials";

const TestimonialsCrud = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const formRef = useRef(null);

  const fetchData = async () => {
    try {
      const res = await axios.get(API);
      setTestimonials(res.data.data);
    } catch (err) {
      toast.error("Failed to fetch testimonials");
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !message || (!image && !editingId)) {
      toast.warning("All fields are required.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("message", message);
    if (image) formData.append("image", image);

    try {
      if (editingId) {
        await axios.put(`${API}/${editingId}`, formData);
        toast.success("Testimonial updated");
      } else {
        await axios.post(API, formData);
        toast.success("Testimonial added");
      }
      resetForm();
      fetchData();
    } catch (err) {
      toast.error("Submit failed");
      console.error("Submit error:", err);
    }
  };

  const resetForm = () => {
    setName("");
    setMessage("");
    setImage(null);
    setPreview(null);
    setEditingId(null);
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setName(item.name);
    setMessage(item.message);
    setPreview(item.image_url || null);
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this testimonial?")) {
      try {
        await axios.delete(`${API}/${id}`);
        toast.success("Testimonial deleted");
        fetchData();
      } catch (err) {
        toast.error("Delete failed");
        console.error("Delete error:", err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-cyan-800 mb-8 text-center">
          Manage Testimonials
        </h2>

        {/* Form Section */}
        <motion.form
          ref={formRef}
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-10 space-y-6 border border-cyan-100"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                placeholder="Customer name"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-400"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message
              </label>
              <input
                type="text"
                placeholder="Testimonial message"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-400"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Photo
              </label>
              <input
                type="file"
                accept="image/*"
                className="w-full p-2 border border-gray-300 rounded-md"
                onChange={handleImageChange}
              />
              {preview && (
                <img
                  src={preview}
                  alt="Preview"
                  className="mt-3 w-16 h-16 rounded-full object-cover border"
                />
              )}
              {image && (
                <p className="text-sm text-gray-600 mt-2">Selected: {image.name}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className={`px-6 py-2 rounded-lg font-semibold text-white transition-colors duration-200 ${
                editingId
                  ? "bg-yellow-500 hover:bg-yellow-600"
                  : "bg-green-500 hover:bg-green-600"
              }`}
            >
              {editingId ? "Update Testimonial" : "Add Testimonial"}
            </button>
          </div>
        </motion.form>

        {/* Testimonials Grid */}
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          All Testimonials
        </h3>
        {testimonials.length === 0 ? (
          <p className="text-gray-500 text-sm text-center">Testimonials Available.</p>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {testimonials.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-lg shadow-md p-4 hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={item.image_url || "/default-avatar.png"}
                    alt={item.name}
                    className="w-14 h-14 rounded-full object-cover border border-gray-300"
                  />
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{item.name}</h4>
                    <p className="text-sm text-gray-600 line-clamp-2">{item.message}</p>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm"
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TestimonialsCrud;
