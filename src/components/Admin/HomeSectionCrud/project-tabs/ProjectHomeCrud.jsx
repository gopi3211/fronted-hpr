import React, { useEffect, useRef, useState } from 'react';
import {
  getHomeByProjectId,
  createHome,
  updateHome,
  deleteHome,
} from '../../../../services/hprProjectsService';

const ProjectHomeCrud = React.memo(({ projectId }) => {
  const [homeData, setHomeData] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', brochure_url: '', image_url: '' });
  const [editingId, setEditingId] = useState(null);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (projectId && !hasFetched.current) {
      fetchHomeData();
      hasFetched.current = true;
    }
  }, [projectId]);

  const fetchHomeData = async () => {
    try {
      const res = await getHomeByProjectId(projectId);
      if (res.data) {
        setHomeData(res.data);
        setForm({
          title: res.data.title || '',
          description: res.data.description || '',
          brochure_url: res.data.brochure_url || '',
          image_url: res.data.image_url || '',
        });
        setEditingId(res.data.id);
      } else {
        setHomeData(null);
        setForm({ title: '', description: '', brochure_url: '', image_url: '' });
        setEditingId(null);
      }
    } catch (err) {
      console.error('Error fetching home data:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form, project_id: projectId };
      if (editingId) {
        await updateHome(editingId, payload);
      } else {
        await createHome(payload);
      }
      await fetchHomeData();
    } catch (err) {
      console.error('Submit error:', err);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteHome(editingId);
      setHomeData(null);
      setForm({ title: '', description: '', brochure_url: '', image_url: '' });
      setEditingId(null);
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          🏠 Project Home Content
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-md"
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Brochure URL</label>
              <input
                type="text"
                value={form.brochure_url}
                onChange={(e) => setForm({ ...form, brochure_url: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              {form.brochure_url && (
                <a
                  href={form.brochure_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline mt-2 inline-block"
                >
                  📄 View Brochure
                </a>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
              <input
                type="text"
                value={form.image_url}
                onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              {form.image_url && (
                <img
                  src={form.image_url}
                  alt="Preview"
                  className="mt-2 w-48 h-32 object-cover border rounded-md"
                />
              )}
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            <button
              type="submit"
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              {editingId ? 'Update' : 'Create'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={handleDelete}
                className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
});

export default ProjectHomeCrud;
