import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';

const AboutUsSubsectionCrud = React.memo(() => {
  const API = import.meta.env.VITE_API_BASE_URL + "/about-us/sections";
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState({ heading: '', description: '', image: null });
  const [editingId, setEditingId] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const hasFetched = useRef(false);

  const fetchEntries = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API);
      setEntries(res.data);
    } catch (err) {
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
    const { name, value, files } = e.target;
    if (name === 'image') {
      const file = files[0];
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl); // ✅ Cleanup old blob
      }
      setForm((prev) => ({ ...prev, image: file }));
      if (file) setPreviewUrl(URL.createObjectURL(file));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("heading", form.heading);
    formData.append("description", form.description);
    if (form.image) formData.append("image", form.image);

    try {
      if (editingId) {
        await axios.put(`${API}/${editingId}`, formData);
      } else {
        await axios.post(API, formData);
      }
      fetchEntries();
      resetForm();
    } catch (err) {
      console.error("Submit error:", err);
    }
  };

  const handleEdit = (entry) => {
    setEditingId(entry.id);
    setForm({
      heading: entry.heading,
      description: entry.description,
      image: null,
    });
    if (entry.image) setPreviewUrl(entry.image);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/${id}`);
      fetchEntries();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const resetForm = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl); // ✅ Clean preview blob
    }
    setForm({ heading: '', description: '', image: null });
    setPreviewUrl(null);
    setEditingId(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow-md">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-6">
          {editingId ? "Edit Subsection" : "Create Subsection"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            name="heading"
            value={form.heading}
            onChange={handleChange}
            required
            placeholder="Heading"
            className="w-full px-4 py-3 border rounded-lg"
          />
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            rows={4}
            placeholder="Description"
            className="w-full px-4 py-3 border rounded-lg"
          />
          <input type="file" name="image" onChange={handleChange} accept="image/*" />
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full max-w-md h-60 object-cover rounded-lg mt-2"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "/default-image.jpg";
              }}
            />
          )}
          <div className="flex gap-4">
            <button type="submit" className="px-6 py-3 bg-lime-600 text-white rounded-lg">
              {editingId ? "Update" : "Create"}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm} className="px-6 py-3 bg-gray-400 text-white rounded-lg">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Entries List */}
      <div className="max-w-4xl mx-auto mt-10 bg-white p-6 rounded-2xl shadow-md">
        <h3 className="text-2xl font-bold mb-4">Existing Subsections</h3>
        {loading ? (
          <p className="text-center text-gray-600">Loading subsections...</p>
        ) : entries.length === 0 ? (
          <p>No entries found.</p>
        ) : (
          <div className="space-y-4">
            {entries.map((entry) => (
              <div key={entry.id} className="flex justify-between items-center border p-4 rounded-lg">
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
                    <h4 className="text-lg font-semibold">{entry.heading}</h4>
                    <p className="text-sm text-gray-600">{entry.description}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(entry)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
});

export default AboutUsSubsectionCrud;
