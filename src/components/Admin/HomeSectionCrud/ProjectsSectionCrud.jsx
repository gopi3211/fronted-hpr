import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { motion } from 'framer-motion';
import 'react-toastify/dist/ReactToastify.css';

const baseURL = import.meta.env.VITE_API_BASE_URL;

const ProjectsSectionCrud = React.memo(() => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [editingId, setEditingId] = useState(null);
  const cached = useRef(false);
  const formRef = useRef(null);

  useEffect(() => {
    if (!cached.current) {
      fetchProjects();
      cached.current = true;
    }
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await axios.get(`${baseURL}/home/projects`);
      setProjects(res.data.data);
    } catch (err) {
      toast.error('Failed to fetch projects');
      console.error('[fetchProjects] Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !image) {
      toast.warning('All fields are required.');
      return;
    }

    const payload = { title, description, image };

    try {
      if (editingId) {
        await axios.put(`${baseURL}/home/projects/${editingId}`, payload);
        toast.success('Project updated successfully!');
      } else {
        await axios.post(`${baseURL}/home/projects`, payload);
        toast.success('Project added successfully!');
      }
      resetForm();
      fetchProjects();
    } catch (err) {
      toast.error('Operation failed. See console for details.');
      console.error('[handleSubmit] Error:', err);
    }
  };

  const handleEdit = (project) => {
    setTitle(project.title);
    setDescription(project.description);
    setImage(project.image);
    setEditingId(project.id);
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      await axios.delete(`${baseURL}/home/projects/${id}`);
      toast.success('Project deleted successfully!');
      fetchProjects();
    } catch (err) {
      toast.error('Failed to delete project.');
      console.error('[handleDelete] Error:', err);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setImage('');
    setEditingId(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-cyan-800 mb-6 text-center">
          Projects Section Management
        </h2>

        <motion.form
          ref={formRef}
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-xl shadow-md p-6 space-y-6 border border-cyan-100"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-400"
              placeholder="Enter project title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg h-24 resize-none focus:ring-2 focus:ring-cyan-400"
              placeholder="Enter project description"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
            <input
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-400"
              placeholder="https://example.com/image.jpg"
              required
            />
            {image && (
              <img
                src={image}
                alt="Preview"
                className="mt-3 w-full h-48 object-cover rounded-lg border border-cyan-200"
                onError={() =>
                  console.error('[Image Preview] Failed to load image:', image)
                }
              />
            )}
          </div>

          <button
            type="submit"
            className={`w-full py-2 rounded-lg font-semibold text-white transition-colors duration-200 ${
              editingId
                ? 'bg-yellow-500 hover:bg-yellow-600'
                : 'bg-green-500 hover:bg-green-600'
            }`}
          >
            {editingId ? 'Update Project' : 'Add Project'}
          </button>
        </motion.form>

        <h3 className="text-xl font-semibold text-gray-800 mt-10 mb-4">All Projects</h3>
        {loading ? (
          <p className="text-gray-600 text-center">Loading...</p>
        ) : projects.length === 0 ? (
          <p className="text-gray-500 text-sm text-center">No projects available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <motion.div
                key={project.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all border border-gray-100"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {project.image ? (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-48 object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
                    No Image
                  </div>
                )}
                <div className="p-4">
                  <h4 className="text-lg font-semibold text-gray-900">{project.title}</h4>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{project.description}</p>
                  <div className="mt-4 flex justify-between gap-2">
                    <button
                      onClick={() => handleEdit(project)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
});

export default ProjectsSectionCrud;
