import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_API_BASE_URL + '/home/company-values';

const CompanyValuesCrud = () => {
  const [values, setValues] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchValues = async () => {
    try {
      const res = await axios.get(API);
      setValues(res.data.data);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchValues();
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
        alert('Value updated successfully');
      } else {
        await axios.post(API, formData);
        alert('Value added successfully');
      }
      resetForm();
      fetchValues();
    } catch (err) {
      console.error('Submit error:', err);
      alert('Operation failed');
    }
  };

  const handleEdit = (value) => {
    setTitle(value.title);
    setDescription(value.description);
    setPreviewImage(`data:image/jpeg;base64,${value.image}`);
    setEditingId(value.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this value?')) return;
    try {
      await axios.delete(`${API}/${id}`);
      alert('Value deleted');
      fetchValues();
    } catch (err) {
      console.error('Delete error:', err);
      alert('Delete failed');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Company Values CRUD</h2>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 space-y-4">
        <div>
          <label className="block font-medium mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 border rounded-md h-24"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              setImage(file);
              setPreviewImage(file ? URL.createObjectURL(file) : null);
            }}
          />
          {previewImage && (
            <img src={previewImage} alt="Preview" className="mt-3 w-full h-48 object-cover" />
          )}
        </div>
        <button
          type="submit"
          className={`w-full py-2 text-white font-semibold rounded-md ${
            editingId ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {editingId ? 'Update Value' : 'Add Value'}
        </button>
      </form>

      {/* List */}
      <h3 className="text-xl font-semibold text-gray-700 mt-10 mb-4">All Values</h3>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {values.map((val) => (
            <div key={val.id} className="bg-white p-4 shadow rounded-lg">
              <img
                src={`data:image/jpeg;base64,${val.image}`}
                alt={val.title}
                className="w-full h-40 object-cover rounded mb-3"
              />
              <h4 className="text-lg font-bold">{val.title}</h4>
              <p className="text-sm text-gray-600">{val.description}</p>
              <div className="mt-4 flex justify-between">
                <button
                  onClick={() => handleEdit(val)}
                  className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(val.id)}
                  className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CompanyValuesCrud;
