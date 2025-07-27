import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_API_BASE_URL + '/home/company-values';

const CompanyValuesCrud = React.memo(() => {
  const [values, setValues] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const hasFetched = useRef(false);

  const fetchValues = async () => {
    console.log('[CompanyValues] Fetching...');
    try {
      const res = await axios.get(API);
      setValues(res.data.data || []);
      console.log('[CompanyValues] Data:', res.data.data);
    } catch (err) {
      console.error('[CompanyValues] Fetch Error:', err);
    }
  };

  useEffect(() => {
    if (!hasFetched.current) {
      fetchValues();
      hasFetched.current = true;
    }
  }, []);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setImage(null);
    setPreviewImage(null);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || (!image && !editingId)) {
      alert('All fields are required.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    if (image instanceof File) formData.append('image', image);

    try {
      if (editingId) {
        await axios.put(`${API}/${editingId}`, formData);
        alert('Value updated');
      } else {
        await axios.post(API, formData);
        alert('Value added');
      }
      resetForm();
      fetchValues();
    } catch (err) {
      console.error('[CompanyValues] Submit Error:', err);
      alert('Operation failed');
    }
  };

  const handleEdit = (value) => {
    setTitle(value.title);
    setDescription(value.description);
    setEditingId(value.id);
setPreviewImage(value.image_url);  // ✅
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this value?')) return;
    try {
      await axios.delete(`${API}/${id}`);
      alert('Deleted');
      fetchValues();
    } catch (err) {
      console.error('[CompanyValues] Delete Error:', err);
      alert('Delete failed');
    }
  };

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          Company Values Management
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white shadow rounded-xl p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md resize-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                setImage(file);
                setPreviewImage(file ? URL.createObjectURL(file) : null);
              }}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            {previewImage && (
              <img
                src={previewImage}
                alt="Preview"
                className="w-full h-40 object-cover mt-2 rounded"
                loading="lazy"
              />
            )}
          </div>
          <button
            type="submit"
            className={`w-full py-2 rounded text-white font-semibold ${
              editingId ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {editingId ? 'Update Value' : 'Add Value'}
          </button>
        </form>

        {/* List */}
        <h3 className="text-xl font-semibold mt-10 mb-4">All Company Values</h3>
        {values.length === 0 ? (
          <p className="text-center text-gray-500">No values found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {values.map((val) => (
              <div key={val.id} className="bg-white rounded shadow p-4 hover:shadow-md transition">
            <img
  src={val.image_url}  // ✅ correct - full backend URL
  alt={val.title}
  className="w-full h-40 object-cover rounded"
  loading="lazy"
/>

                <h4 className="text-lg font-semibold mt-2">{val.title}</h4>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{val.description}</p>
                <div className="mt-3 flex justify-between gap-2">
                  <button
                    onClick={() => handleEdit(val)}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(val.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
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

export default CompanyValuesCrud;
