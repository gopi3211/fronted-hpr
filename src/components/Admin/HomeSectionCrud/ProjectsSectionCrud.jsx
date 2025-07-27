import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const baseURL = import.meta.env.VITE_API_BASE_URL;

const ProjectsSectionCrud = React.memo(() => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();

  const cached = useRef(false);

  useEffect(() => {
    console.log('[useEffect] Component mounted');
    if (!cached.current) {
      console.log('[useEffect] Fetching projects...');
      fetchProjects();
      cached.current = true;
    }
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await axios.get(`${baseURL}/home/projects`);
      console.log('[fetchProjects] API Response:', res.data);
      setProjects(res.data.data);
    } catch (err) {
      console.error('[fetchProjects] Error fetching projects:', err);
    } finally {
      setLoading(false);
      console.log('[fetchProjects] Loading set to false');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('[handleSubmit] Submitting form...');
    if (!title || !description || (!image && !editingId)) {
      alert('All fields are required.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    if (image) {
      formData.append('image', image);
    }

    try {
      if (editingId) {
        console.log(`[handleSubmit] Updating project ID ${editingId}`);
        await axios.put(`${baseURL}/home/projects/${editingId}`, formData);
        alert('Project updated successfully');
      } else {
        console.log('[handleSubmit] Creating new project');
        await axios.post(`${baseURL}/home/projects`, formData);
        alert('Project added successfully');
      }
      resetForm();
      fetchProjects();
    } catch (err) {
      console.error('[handleSubmit] Error:', err);
      alert('Operation failed.');
    }
  };

  const handleEdit = (project) => {
    console.log('[handleEdit] Editing project:', project);

    setTitle(project.title);
    setDescription(project.description);
    setEditingId(project.id);

    const imagePath = `${baseURL.replace('/api/v1', '')}/uploads/project-images/${project.image}`;
    console.log('[handleEdit] Constructed previewImage path:', imagePath);

    setPreviewImage(imagePath);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      console.log(`[handleDelete] Deleting project ID ${id}`);
      await axios.delete(`${baseURL}/home/projects/${id}`);
      alert('Project deleted successfully');
      fetchProjects();
    } catch (err) {
      console.error('[handleDelete] Error:', err);
      alert('Failed to delete project');
    }
  };

  const resetForm = () => {
    console.log('[resetForm] Resetting form...');
    setTitle('');
    setDescription('');
    setImage(null);
    setPreviewImage(null);
    setEditingId(null);
  };

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Projects Section Management</h2>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                console.log('[Form] Title changed:', e.target.value);
              }}
              className="w-full p-3 border border-gray-300 rounded-md bg-white"
              placeholder="Enter project title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                console.log('[Form] Description changed:', e.target.value);
              }}
              className="w-full p-3 border border-gray-300 rounded-md bg-white h-24 resize-none"
              placeholder="Enter project description"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                console.log('[Form] Selected image file:', file);
                setImage(file);
                if (file) {
                  const blobUrl = URL.createObjectURL(file);
                  console.log('[Form] Setting preview image from blob:', blobUrl);
                  setPreviewImage(blobUrl);
                }
              }}
              className="w-full p-2 border border-gray-300 rounded-md bg-white"
            />
            {previewImage && (
              <img
                src={previewImage}
                alt="Preview"
                className="mt-3 w-full h-48 object-cover rounded-md"
                onError={() => console.error('[Image Preview] Failed to load image:', previewImage)}
              />
            )}
          </div>

          <button
            type="submit"
            className={`w-full py-2 rounded-md font-semibold text-white ${
              editingId ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-green-600 hover:bg-green-700'
            } transition-colors duration-200`}
          >
            {editingId ? 'Update Project' : 'Add Project'}
          </button>
        </form>

        <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">All Projects</h3>
        {loading ? (
          <p className="text-gray-600 text-center">Loading...</p>
        ) : projects.length === 0 ? (
          <p className="text-gray-500 text-sm text-center">No projects available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div key={project.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300">
                {project.image ? (
                  <img
                    src={`${baseURL.replace('/api/v1', '')}/uploads/project-images/${project.image}`}
                    alt={project.title}
                    className="w-full h-48 object-cover"
                    loading="lazy"
                    onError={() => console.error('[Card Image] Failed to load:', project.image)}
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
                      className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded-md text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
});

export default ProjectsSectionCrud;
