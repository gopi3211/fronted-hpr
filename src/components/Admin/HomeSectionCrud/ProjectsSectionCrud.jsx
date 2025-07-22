import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const baseURL = import.meta.env.VITE_API_BASE_URL;

const ProjectsSectionCrud = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await axios.get(`${baseURL}/home/projects`);
      setProjects(res.data.data);
    } catch (err) {
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
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
if (image) {
  formData.append('image', image);
}


    try {
      if (editingId) {
        await axios.put(`${baseURL}/home/projects/${editingId}`, formData);
        alert('Project updated successfully');
      } else {
        await axios.post(`${baseURL}/home/projects`, formData);
        alert('Project added successfully');
      }
      resetForm();
      fetchProjects();
    } catch (err) {
      console.error('Error submitting project:', err);
      alert('Operation failed.');
    }
  };

  const handleEdit = (project) => {
    setTitle(project.title);
    setDescription(project.description);
    setPreviewImage(`data:image/jpeg;base64,${project.image}`);
    setEditingId(project.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      await axios.delete(`${baseURL}/home/projects/${id}`);
      alert('Project deleted successfully');
      fetchProjects();
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete project');
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setImage(null);
    setPreviewImage(null);
    setEditingId(null);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Projects Section CRUD</h2>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 space-y-4">
        <div>
          <label className="block text-gray-700 font-medium mb-1">Title</label>
          <input
            type="text"
            placeholder="Enter project title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-lime-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Description</label>
          <textarea
            placeholder="Enter project description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 border rounded-md h-24 focus:outline-none focus:ring-2 focus:ring-lime-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              setImage(file);
              if (file) setPreviewImage(URL.createObjectURL(file));
            }}
            className="w-full"
          />
          {previewImage && (
            <img
              src={previewImage}
              alt="Preview"
              className="mt-3 w-full h-48 object-cover rounded"
            />
          )}
        </div>

        <button
          type="submit"
          className={`w-full py-2 rounded-md font-semibold text-white ${
            editingId ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-600 hover:bg-green-700'
          } transition duration-200`}
        >
          {editingId ? 'Update Project' : 'Add Project'}
        </button>
      </form>

      {/* Cards */}
      <h3 className="text-xl font-semibold text-gray-700 mt-10 mb-4">All Projects</h3>
      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-lg shadow-md overflow-hidden transition hover:shadow-lg"
            >
              <img
                src={`data:image/jpeg;base64,${project.image}`}
                alt={project.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h4 className="text-lg font-bold text-gray-800">{project.title}</h4>
                <p className="text-gray-600 text-sm mt-1">{project.description}</p>

                <div className="mt-4 flex justify-between">
                  <button
                    onClick={() => handleEdit(project)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
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
  );
};

export default ProjectsSectionCrud;
