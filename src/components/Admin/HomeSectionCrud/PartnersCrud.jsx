import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PartnersCrud = () => {
  const [partners, setPartners] = useState([]);
  const [form, setForm] = useState({ name: '', description: '' });
  const [editingId, setEditingId] = useState(null);

  const API = import.meta.env.VITE_API_BASE_URL + '/partners';

  // ✅ Fetch existing partners
  const fetchPartners = async () => {
    try {
      const res = await axios.get(API);
      console.log("API response for partners:", res.data);
setPartners(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  // ✅ Handle input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Submit (Create or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API}/${editingId}`, form);
      } else {
        await axios.post(API, form);
      }
      setForm({ name: '', description: '' });
      setEditingId(null);
      fetchPartners();
    } catch (err) {
      console.error('Submit error:', err);
    }
  };

  // ✅ Edit button
  const handleEdit = (item) => {
    setForm({ name: item.name, description: item.description });
    setEditingId(item.id);
  };

  // ✅ Delete
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/${id}`);
      fetchPartners();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-16">
      <h2 className="text-2xl font-bold mb-4 text-lime-700">Our Partners (CRUD)</h2>

      {/* ✅ Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Partner Name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 px-4 py-2 rounded"
        />
        <textarea
          name="description"
          placeholder="Partner Description"
          value={form.description}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 px-4 py-2 rounded"
        />
        <button
          type="submit"
          className="bg-lime-600 text-white px-6 py-2 rounded hover:bg-lime-700"
        >
          {editingId ? 'Update' : 'Create'}
        </button>
      </form>

      {/* ✅ Partner List with Edit/Delete */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Existing Partners</h2>
        {partners.length === 0 ? (
          <p className="text-gray-500">No partners added yet.</p>
        ) : (
          <div className="space-y-4">
            {partners.map((partner) => (
              <div
                key={partner.id}
                className="p-4 bg-white rounded-md shadow border-l-4 border-lime-600 flex justify-between items-start"
              >
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{partner.name}</h3>
                  <p className="text-gray-600">{partner.description}</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Added on: {new Date(partner.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="flex flex-col gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(partner)}
                    className="px-4 py-1 text-sm bg-blue-500 text-white rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(partner.id)}
                    className="px-4 py-1 text-sm bg-red-500 text-white rounded"
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
};

export default PartnersCrud;
