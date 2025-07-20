import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AboutUsSubsectionCrud = () => {
  const API = import.meta.env.VITE_API_BASE_URL + "/about-us/sections";

  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState({ heading: '', description: '', image: null });
  const [editingId, setEditingId] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const fetchEntries = async () => {
    try {
      const res = await axios.get(API);
      setEntries(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      const file = files[0];
      setForm({ ...form, image: file });
      if (file) setPreviewUrl(URL.createObjectURL(file));
    } else {
      setForm({ ...form, [name]: value });
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
      setForm({ heading: '', description: '', image: null });
      setPreviewUrl(null);
      setEditingId(null);
    } catch (err) {
      console.error("Submit error:", err);
    }
  };

  const handleEdit = (entry) => {
    setEditingId(entry.id);
    setForm({ heading: entry.heading, description: entry.description, image: null });
    setPreviewUrl(entry.image);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/${id}`);
      fetchEntries();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">About Us Subsections (CRUD)</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="heading"
          placeholder="Heading"
          value={form.heading}
          onChange={handleChange}
          required
          className="w-full border px-4 py-2 rounded"
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          required
          className="w-full border px-4 py-2 rounded"
        ></textarea>
        <input type="file" name="image" onChange={handleChange} className="w-full" />
        {previewUrl && (
          <img src={previewUrl} alt="Preview" className="h-48 w-full object-cover rounded" />
        )}
        <button
          type="submit"
          className="bg-lime-600 text-white px-6 py-2 rounded hover:bg-lime-700"
        >
          {editingId ? 'Update' : 'Create'}
        </button>
      </form>

      <div className="mt-8 space-y-4">
        <h3 className="text-xl font-semibold mb-2">Existing Entries</h3>
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="flex justify-between items-center p-4 border rounded"
          >
            <div className="flex gap-4 items-center">
              {entry.image && (
                <img src={entry.image} alt="section" className="w-20 h-20 object-cover rounded" />
              )}
              <div>
                <h4 className="font-bold">{entry.heading}</h4>
                <p className="text-sm text-gray-600">{entry.description}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(entry)} className="bg-blue-500 text-white px-4 py-1 rounded">
                Edit
              </button>
              <button onClick={() => handleDelete(entry.id)} className="bg-red-500 text-white px-4 py-1 rounded">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AboutUsSubsectionCrud;
