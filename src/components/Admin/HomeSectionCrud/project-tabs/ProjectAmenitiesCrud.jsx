import React, { useEffect, useState } from 'react';
import {
  addAmenities,
  getAmenitiesByProjectId,
  updateAmenities,
  deleteAmenities,
} from '../../../../services/hprProjectsService';

const ProjectAmenitiesCrud = ({ projectId }) => {
  const [amenities, setAmenities] = useState([]);
  const [form, setForm] = useState({ title: '', description: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchAmenities();
  }, [projectId]);

  const fetchAmenities = async () => {
    try {
      const res = await getAmenitiesByProjectId(projectId);
      setAmenities(res.data || []);
    } catch (err) {
      console.error('Fetch amenities error:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form };

    try {
      if (editingId) {
        await updateAmenities(editingId, payload);
      } else {
        await addAmenities(projectId, payload);
      }
      resetForm();
      fetchAmenities();
    } catch (err) {
      console.error('Submit error:', err);
    }
  };

  const handleEdit = (item) => {
    setForm({ title: item.title, description: item.description });
    setEditingId(item.id);
  };

  const handleDelete = async (id) => {
    try {
      await deleteAmenities(id);
      fetchAmenities();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const resetForm = () => {
    setForm({ title: '', description: '' });
    setEditingId(null);
  };

  return (
    <div className="bg-gray-100 p-6 rounded shadow mt-10">
      <h2 className="text-xl font-bold mb-4 text-green-700">🏞️ Project Amenities</h2>

      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <input
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
        <button className="bg-green-600 text-white px-4 py-2 rounded" type="submit">
          {editingId ? 'Update Amenity' : 'Add Amenity'}
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {amenities.map((item) => (
          <div key={item.id} className="bg-white p-4 rounded shadow relative">
            <h3 className="font-semibold text-lg">{item.title}</h3>
            <p className="text-sm text-gray-700 mt-1">{item.description}</p>
            <div className="absolute top-2 right-2 flex gap-2">
              <button
                onClick={() => handleEdit(item)}
                className="text-blue-600 text-sm font-medium"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="text-red-600 text-sm font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectAmenitiesCrud;
