import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { motion } from 'framer-motion';
import 'react-toastify/dist/ReactToastify.css';

const AboutUsSubsectionCrud = React.memo(() => {
  const API = import.meta.env.VITE_API_BASE_URL + "/about-us/sections";

  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState({ heading: '', description: '', image_url: '' });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const hasFetched = useRef(false);
  const formRef = useRef(null);

  const fetchEntries = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API);
      setEntries(res.data);
    } catch (err) {
      toast.error("Failed to fetch subsections");
      console.error("Fetch error:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!hasFetched.current) {
      fetchEntries();
      hasFetched.current = true;
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.heading || !form.description || !form.image_url) {
      toast.warning("All fields are required.");
      return;
    }

    try {
      if (editingId) {
        await axios.put(`${API}/${editingId}`, form);
        toast.success("Subsection updated successfully");
      } else {
        await axios.post(API, form);
        toast.success("Subsection created successfully");
      }
      fetchEntries();
      resetForm();
    } catch (err) {
      toast.error("Something went wrong while saving");
      console.error("Submit error:", err);
    }
  };

  const handleEdit = (entry) => {
    setEditingId(entry.id);
    setForm({
      heading: entry.heading,
      description: entry.description,
      image_url: entry.image || '',
    });
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this subsection?")) return;
    try {
      await axios.delete(`${API}/${id}`);
      toast.success("Subsection deleted successfully");
      fetchEntries();
    } catch (err) {
      toast.error("Failed to delete subsection");
      console.error("Delete error:", err);
    }
  };

  const resetForm = () => {
    setForm({ heading: '', description: '', image_url: '' });
    setEditingId(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
      <motion.div
        ref={formRef}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow-md"
      >
        <h2 className="text-3xl font-bold text-cyan-800 mb-6">
          {editingId ? "Edit Subsection" : "Create Subsection"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            name="heading"
            value={form.heading}
            onChange={handleChange}
            required
            placeholder="Heading"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-400"
          />
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            rows={4}
            placeholder="Description"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-400"
          />
          <input
            type="text"
            name="image_url"
            value={form.image_url}
            onChange={handleChange}
            placeholder="Image URL"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-400"
          />

          {form.image_url && (
            <img
              src={form.image_url}
              alt="Preview"
              className="w-full max-w-md h-60 object-cover rounded-lg mt-2 border border-cyan-200"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "/default-image.jpg";
              }}
            />
          )}

          <div className="flex gap-4">
            <button
              type="submit"
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition"
            >
              {editingId ? "Update" : "Create"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-3 bg-gray-400 hover:bg-gray-500 text-white rounded-lg font-semibold transition"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </motion.div>

      {/* Entries List */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-4xl mx-auto mt-10 bg-white p-6 rounded-2xl shadow-md"
      >
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Existing Subsections</h3>
        {loading ? (
          <p className="text-center text-gray-500">Loading subsections...</p>
        ) : entries.length === 0 ? (
          <p className="text-center text-gray-400">No entries found.</p>
        ) : (
          <div className="space-y-4">
            {entries.map((entry) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex justify-between items-center border border-gray-100 p-4 rounded-xl hover:shadow-md transition"
              >
                <div className="flex gap-4 items-start">
                  {entry.image && (
                    <img
                      src={entry.image}
                      alt="sub"
                      className="w-24 h-24 object-cover rounded border"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "/default-image.jpg";
                      }}
                    />
                  )}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{entry.heading}</h4>
                    <p className="text-sm text-gray-600 mt-1">{entry.description}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(entry)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
});

export default AboutUsSubsectionCrud;
