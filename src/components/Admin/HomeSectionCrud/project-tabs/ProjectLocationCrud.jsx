import React, { useEffect, useState } from 'react';
import {
  addLocation,
  getLocationByProjectId,
  updateLocation,
  deleteLocation,
} from '../../../../services/hprProjectsService';

const ProjectLocationCrud = ({ projectId }) => {
  const [locations, setLocations] = useState([]);
  const [form, setForm] = useState({ title: '', map_url: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    if (projectId) fetchLocations();
  }, [projectId]);

  const fetchLocations = async () => {
    try {
      const res = await getLocationByProjectId(projectId);
      console.log('Fetched locations:', res.data);
      setLocations(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Fetch locations error:', err);
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  const payload = {
    project_id: projectId,
    iframe_link: form.map_url,
  };

  try {
    if (editingId) {
      await updateLocation(editingId, { iframe_link: form.map_url });
    } else {
      await addLocation(payload); // ✅ corrected
    }
    resetForm();
    fetchLocations();
  } catch (err) {
    console.error('Submit error:', err);
  }
};


  const handleEdit = (item) => {
    setForm({ title: item.title, map_url: item.map_url });
    setEditingId(item.id);
  };

  const handleDelete = async (id) => {
    try {
      await deleteLocation(id);
      fetchLocations();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const resetForm = () => {
    setForm({ title: '', map_url: '' });
    setEditingId(null);
  };

  return (
    <div className="bg-gray-100 p-6 rounded shadow mt-10">
      <h2 className="text-xl font-bold mb-4 text-green-700">📍 Project Location</h2>

      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <input
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Google Map URL"
          value={form.map_url}
          onChange={(e) => setForm({ ...form, map_url: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
        <button className="bg-green-600 text-white px-4 py-2 rounded" type="submit">
          {editingId ? 'Update Location' : 'Add Location'}
        </button>
      </form>

      {locations.length === 0 ? (
        <p className="text-gray-500">No locations added yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {locations.map((loc) => (
            <div key={loc.id} className="bg-white p-4 rounded shadow relative">
              <h3 className="font-semibold mb-2">{loc.title}</h3>
              {loc.map_url && (
                <iframe
                  src={loc.map_url}
                  title={`Map-${loc.id}`}
                  className="w-full h-56 border rounded"
                  loading="lazy"
                />
              )}
              <div className="absolute top-2 right-2 flex gap-2">
                <button
                  onClick={() => handleEdit(loc)}
                  className="text-blue-600 text-sm font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(loc.id)}
                  className="text-red-600 text-sm font-medium"
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

export default ProjectLocationCrud;
