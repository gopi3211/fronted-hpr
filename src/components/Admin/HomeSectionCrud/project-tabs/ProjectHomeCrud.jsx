import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getHomeByProjectId,
  createHome,
  updateHome,
  deleteHome,
} from '../../../../services/hprProjectsService';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const ProjectHomeCrud = React.memo(({ projectId }) => {
  const [homeData, setHomeData] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', brochure_url: '', image_url: '' });
  const [editingId, setEditingId] = useState(null);
  const hasFetched = useRef(false);
  const navigate = useNavigate();

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
      toast.error('Error fetching home data');
      console.error('Error fetching home data:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form, project_id: projectId };
      if (editingId) {
        await updateHome(editingId, payload);
        toast.success('Project home updated successfully!');
      } else {
        await createHome(payload);
        toast.success('Project home created successfully!');
      }
      await fetchHomeData();
    } catch (err) {
      toast.error('Submit failed');
      console.error('Submit error:', err);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteHome(editingId);
      toast.success('Project home deleted');
      setHomeData(null);
      setForm({ title: '', description: '', brochure_url: '', image_url: '' });
      setEditingId(null);
    } catch (err) {
      toast.error('Delete failed');
      console.error('Delete error:', err);
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-lime-50 to-cyan-50 py-10 px-4 sm:px-6 lg:px-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-xl p-6 sm:p-10">
        <motion.button
          onClick={() => navigate(-1)}
          className="mb-6 text-cyan-700 hover:text-cyan-900 flex items-center font-semibold"
          whileHover={{ scale: 1.05 }}
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </motion.button>

        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">🏠 Project Home Section</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-4 py-2 border border-cyan-200 rounded-lg shadow-sm focus:ring-2 focus:ring-cyan-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-4 py-2 border border-cyan-200 rounded-lg shadow-sm focus:ring-2 focus:ring-cyan-500 resize-none"
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Brochure URL</label>
              <input
                type="text"
                value={form.brochure_url}
                onChange={(e) => setForm({ ...form, brochure_url: e.target.value })}
                className="w-full px-4 py-2 border border-cyan-200 rounded-lg shadow-sm focus:ring-2 focus:ring-cyan-500"
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
                className="w-full px-4 py-2 border border-cyan-200 rounded-lg shadow-sm focus:ring-2 focus:ring-cyan-500"
              />
              {form.image_url && (
                <img
                  src={form.image_url}
                  alt="Preview"
                  className="mt-2 w-full h-40 object-cover border rounded-md shadow"
                  onError={(e) => (e.target.src = "/default-image.jpg")}
                />
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-4 pt-4">
            <motion.button
              type="submit"
              className="bg-cyan-600 text-white px-6 py-2 rounded-full shadow-md hover:bg-cyan-700 transition"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {editingId ? 'Update' : 'Create'}
            </motion.button>
            {editingId && (
              <motion.button
                type="button"
                onClick={handleDelete}
                className="bg-red-600 text-white px-6 py-2 rounded-full shadow-md hover:bg-red-700 transition"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Delete
              </motion.button>
            )}
          </div>
        </form>
      </div>
    </motion.div>
  );
});

export default ProjectHomeCrud;
