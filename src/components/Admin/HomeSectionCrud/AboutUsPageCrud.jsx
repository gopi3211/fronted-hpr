// File: AboutUsPageCrud.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AboutUsPageCrud = () => {
  const [formData, setFormData] = useState({ heading: '', description: '', image_url: '' });
  const [aboutUsData, setAboutUsData] = useState([]);
  const [editingId, setEditingId] = useState(null);

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
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API_BASE_URL}/about-us/${editingId}`, formData);
        setEditingId(null);
      } else {
        await axios.post(`${API_BASE_URL}/about-us`, formData);
      }
      fetchAboutUs();
      setFormData({ heading: '', description: '', image_url: '' });
    } catch (error) {
      console.error('Error submitting About Us data:', error);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      heading: item.heading,
      description: item.description,
      image_url: item.image || '',
    });
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
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-6">
            {editingId ? 'Edit About Us Section' : 'Create About Us Section'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Heading</label>
              <input
                type="text"
                name="heading"
                value={formData.heading}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                rows="5"
                value={formData.description}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg"
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
              <input
                type="text"
                name="image_url"
                value={formData.image_url}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg"
              />
              {formData.image_url && (
                <img
                  src={formData.image_url}
                  alt="Preview"
                  className="mt-3 w-full max-w-sm h-48 object-cover rounded-lg border"
                />
              )}
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700"
            >
              {editingId ? 'Update' : 'Create'}
            </button>
          </form>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Existing Entries</h3>
          {aboutUsData.length === 0 ? (
            <p className="text-gray-500 text-center">No entries found.</p>
          ) : (
            <div className="grid gap-6">
              {aboutUsData.map((item) => (
                <div
                  key={item.id}
                  className="border border-gray-200 rounded-lg p-6 bg-gray-50 flex justify-between items-center"
                >
                  <div className="flex items-center gap-4">
                    {item.image && (
                      <img
                        src={item.image}
                        alt="About Us"
                        className="w-24 h-24 object-cover rounded"
                      />
                    )}
                    <div>
                      <h4 className="text-lg font-semibold">{item.heading}</h4>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
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
    </div>
  );
};

export default AboutUsPageCrud;
