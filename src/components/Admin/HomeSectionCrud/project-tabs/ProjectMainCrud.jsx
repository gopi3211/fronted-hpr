import React, { useEffect, useRef, useState } from "react";
import ProjectList from "./ProjectList";
import {
  getAllProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../../../../services/hprProjectsService";

const ProjectMainCrud = React.memo(({ onSelectProject, selectedProject }) => {
  const [projects, setProjects] = useState([]);
  const [editingProject, setEditingProject] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [form, setForm] = useState({
    name: "",
    category: "",
    short_desc: "",
    logo_url: "",
    banner_url: "",
  });

  const hasFetched = useRef(false);

  useEffect(() => {
    if (!hasFetched.current) {
      fetchProjects();
      hasFetched.current = true;
    }
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await getAllProjects();
      const fetched = res?.data?.data || res?.data || [];
      setProjects(fetched);

      if (fetched.length === 0) {
        onSelectProject(null);
      }
    } catch (err) {
      console.error("Error fetching projects:", err);
      setProjects([]);
      onSelectProject(null);
    }
  };

  const resetForm = () => {
    setForm({
      name: "",
      category: "",
      short_desc: "",
      logo_url: "",
      banner_url: "",
    });
    setEditingProject(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProject) {
        await updateProject(editingProject.id, form);
      } else {
        const res = await createProject(form);
        if (res?.data?.insertId) {
          const newProject = { id: res.data.insertId, ...form };
          onSelectProject(newProject);
        }
      }
      resetForm();
      setCategoryFilter("All");
      await fetchProjects();
    } catch (err) {
      console.error("Error saving project:", err);
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setForm({
      name: project.name || "",
      category: project.category || "",
      short_desc: project.short_desc || "",
      logo_url: project.logo_url || "",
      banner_url: project.banner_url || "",
    });
  };

  const handleDelete = async (id) => {
    try {
      await deleteProject(id);
      if (selectedProject?.id === id) {
        onSelectProject(null);
      }
      resetForm();
      setCategoryFilter("All");
      await fetchProjects();
    } catch (err) {
      console.error("Error deleting project:", err);
    }
  };

  const filteredProjects =
    categoryFilter === "All"
      ? projects
      : projects.filter(
          (p) =>
            p.category?.toLowerCase() === categoryFilter.toLowerCase()
        );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <h2 className="text-3xl font-bold text-gray-900">📁 Project Management</h2>

      {/* ✅ Project Form */}
      <form onSubmit={handleSubmit} className="space-y-4 bg-gray-100 p-6 rounded shadow">
        <input
          type="text"
          placeholder="Project Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Category"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <textarea
          placeholder="Short Description"
          value={form.short_desc}
          onChange={(e) => setForm({ ...form, short_desc: e.target.value })}
          className="w-full border px-3 py-2 rounded"
        />

        {/* ✅ Logo Image URL */}
        <input
          type="text"
          placeholder="Logo Image URL"
          value={form.logo_url}
          onChange={(e) => setForm({ ...form, logo_url: e.target.value })}
          className="w-full border px-3 py-2 rounded"
        />
        {form.logo_url && (
          <img
            src={form.logo_url}
            alt="Logo Preview"
            className="h-24 w-auto rounded shadow"
          />
        )}

        {/* ✅ Banner Image URL */}
        <input
          type="text"
          placeholder="Banner Image URL"
          value={form.banner_url}
          onChange={(e) => setForm({ ...form, banner_url: e.target.value })}
          className="w-full border px-3 py-2 rounded"
        />
        {form.banner_url && (
          <img
            src={form.banner_url}
            alt="Banner Preview"
            className="h-24 w-auto rounded shadow"
          />
        )}

        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            {editingProject ? "Update Project" : "Create Project"}
          </button>
          {editingProject && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* ✅ Category Filter */}
      <div className="flex gap-2 flex-wrap">
        {["All", "Ongoing", "Completed", "Future"].map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-4 py-2 rounded ${
              categoryFilter === cat
                ? "bg-green-600 text-white"
                : "bg-gray-300 text-black"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ✅ Project List */}
      <ProjectList
        projects={filteredProjects}
        categoryFilter={categoryFilter}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onSelect={onSelectProject}
        selectedProject={selectedProject}
      />
    </div>
  );
});

export default ProjectMainCrud;
