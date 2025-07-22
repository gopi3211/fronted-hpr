import React, { useEffect, useState } from 'react';
import {
  getAllProjects,
  createProject,
  updateProject,
  deleteProject,
} from '../../../../services/hprProjectsService';





const arrayBufferToBase64 = (buffer) => {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
};













const ProjectMainCrud = ({ onSelectProject, selectedProject }) => {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({
    name: '',
    category: '',
    short_desc: '',
    logo: null,
    banner: null,
  });
  const [editingId, setEditingId] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('All');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await getAllProjects();
      setProjects(res.data || []);
    } catch (err) {
      console.error('Error fetching projects:', err);
    }
  };

  const resetForm = () => {
    setForm({ name: '', category: '', short_desc: '', logo: null, banner: null });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('category', form.category);
    formData.append('short_desc', form.short_desc);
    if (form.logo) formData.append('logo', form.logo);
    if (form.banner) formData.append('banner', form.banner);

    try {
      if (editingId) {
        await updateProject(editingId, formData);
      } else {
        await createProject(formData);
      }
      resetForm();
      fetchProjects();
    } catch (err) {
      console.error('Submit error:', err);
    }
  };

  const handleEdit = (project) => {
    setEditingId(project.id);
    setForm({
      name: project.name,
      category: project.category,
      short_desc: project.short_desc,
      logo: null,
      banner: null,
    });
  };

  const handleDelete = async (id) => {
    try {
      await deleteProject(id);
      if (selectedProject?.id === id) onSelectProject(null);
      fetchProjects();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-green-700">📁 Project List</h2>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow space-y-4">
        <input
          type="text"
          placeholder="Project Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />

        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Select Category</option>
          <option value="Ongoing">Ongoing</option>
          <option value="Completed">Completed</option>
          <option value="Future">Future</option>
        </select>

        <input
          type="text"
          placeholder="Short Description"
          value={form.short_desc}
          onChange={(e) => setForm({ ...form, short_desc: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mt-2">Logo</label>
          <input
            type="file"
            onChange={(e) => setForm({ ...form, logo: e.target.files[0] })}
            className="w-full"
          />
          {form.logo && (
            <img
              src={URL.createObjectURL(form.logo)}
              alt="Logo Preview"
              className="w-32 h-24 object-cover mt-2 border"
            />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mt-2">Banner</label>
          <input
            type="file"
            onChange={(e) => setForm({ ...form, banner: e.target.files[0] })}
            className="w-full"
          />
          {form.banner && (
            <img
              src={URL.createObjectURL(form.banner)}
              alt="Banner Preview"
              className="w-64 h-24 object-cover mt-2 border"
            />
          )}
        </div>

        <div className="flex gap-4">
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
            {editingId ? 'Update Project' : 'Add Project'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      {/* CATEGORY FILTER */}
      <div className="flex gap-2 mb-4">
        {['All', 'Ongoing', 'Completed', 'Future'].map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-3 py-1 rounded text-sm font-semibold border ${
              categoryFilter === cat
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* PROJECT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {projects
          .filter((proj) =>
            categoryFilter === 'All' ? true : proj.category === categoryFilter
          )
          .map((proj) => (
            <div
              key={proj.id}
              className={`p-4 border rounded shadow relative cursor-pointer ${
                selectedProject?.id === proj.id ? 'bg-green-100' : 'bg-white'
              }`}
              onClick={() => onSelectProject(proj)}
            >
              <h3 className="text-lg font-semibold">{proj.name}</h3>
              <p className="text-sm text-gray-600">{proj.short_desc}</p>
              <p className="text-xs italic text-gray-500 mt-1">
                📁 {proj.category}
              </p>

          
          
          
          
              <div className="mt-2 flex gap-2 text-xs">
            


         
         {proj.logo_blob && (
  <img
    src={`data:image/jpeg;base64,${arrayBufferToBase64(proj.logo_blob.data)}`}
    alt="logo"
    className="w-10 h-10 rounded border"
  />
)}

{proj.banner_blob && (
  <img
    src={`data:image/jpeg;base64,${arrayBufferToBase64(proj.banner_blob.data)}`}
    alt="banner"
    className="w-20 h-10 object-cover rounded border"
  />
)}

              </div>

              <div className="absolute top-2 right-2 flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(proj);
                  }}
                  className="text-blue-600 text-xs"
                >
                  Edit
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(proj.id);
                  }}
                  className="text-red-600 text-xs"
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

export default ProjectMainCrud;
