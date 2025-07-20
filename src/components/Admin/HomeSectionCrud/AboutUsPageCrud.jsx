import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AboutUsPageCrud = () => {
  const [formData, setFormData] = useState({ heading: '', description: '', image: null });
  const [aboutUsData, setAboutUsData] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";

  const fetchAboutUs = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/about-us`);
      setAboutUsData(res.data);
    } catch (error) {
      console.error('Error fetching About Us data:', error);
    }
  };

  useEffect(() => {
    fetchAboutUs();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      const file = files[0];
      setFormData({ ...formData, image: file });
      if (file) {
        setPreviewUrl(URL.createObjectURL(file)); // ✅ Local preview
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('heading', formData.heading);
    data.append('description', formData.description);
    if (formData.image) data.append('image', formData.image);

    try {
      if (editingId) {
        await axios.put(`${API_BASE_URL}/about-us/${editingId}`, data);
        setEditingId(null);
      } else {
        await axios.post(`${API_BASE_URL}/about-us`, data);
      }
      fetchAboutUs();
      setFormData({ heading: '', description: '', image: null });
      setPreviewUrl(null);
    } catch (error) {
      console.error('Error submitting About Us data:', error);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData({ heading: item.heading, description: item.description, image: null });

    // ✅ Load preview from base64 image
    if (item.image) {
      setPreviewUrl(item.image); // Base64 from backend
    } else {
      setPreviewUrl(null);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/about-us/${id}`);
      fetchAboutUs();
    } catch (error) {
      console.error('Error deleting About Us data:', error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">About Us Section (CRUD)</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="heading"
          placeholder="Heading"
          value={formData.heading}
          onChange={handleChange}
          className="w-full border border-gray-300 px-4 py-2 rounded"
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border border-gray-300 px-4 py-2 rounded"
          required
        ></textarea>
        <input
          type="file"
          name="image"
          onChange={handleChange}
          className="w-full border border-gray-300 px-4 py-2 rounded"
        />

        {/* ✅ Image Preview Section */}
        {previewUrl && (
          <div className="mb-4">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-60 object-cover rounded shadow-md"
            />
          </div>
        )}

        <button
          type="submit"
          className="bg-[#a8cf45] text-white px-6 py-2 rounded hover:bg-lime-600"
        >
          {editingId ? 'Update' : 'Create'}
        </button>
      </form>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Existing Entries</h3>
        <div className="grid gap-4">
         
         
         
{aboutUsData.map((item) => (
  <div
    key={item.id}
    className="border border-gray-300 p-4 rounded flex justify-between items-center"
  >
    <div className="flex items-center gap-4">
      {item.image && (
        <img
          src={item.image}
          alt="Entry"
          className="w-20 h-20 object-cover rounded"
        />
      )}
      <div>
        <h4 className="font-bold">{item.heading}</h4>
        <p className="text-sm text-gray-600">{item.description}</p>
      </div>
    </div>
    <div className="flex gap-2">
      <button
        onClick={() => handleEdit(item)}
        className="px-4 py-1 text-sm bg-blue-500 text-white rounded"
      >
        Edit
      </button>
      <button
        onClick={() => handleDelete(item.id)}
        className="px-4 py-1 text-sm bg-red-500 text-white rounded"
      >
        Delete
      </button>
    </div>
  </div>
))}





        </div>
      </div>




    </div>
  );
};

export default AboutUsPageCrud;
