import React, { useEffect, useRef, useState } from "react";
import ProjectForm from "./ProjectForm";
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

      // 🧠 if no data, clear selected state
      if (fetched.length === 0) {
        onSelectProject(null);
      }
    } catch (err) {
      console.error("Error fetching projects:", err);
      setProjects([]); // fallback safe
      onSelectProject(null);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingProject) {
        await updateProject(editingProject.id, formData);
      } else {
        const response = await createProject(formData);
        if (response?.data?.insertId) {
          const newProject = { id: response.data.insertId, ...formData };
          onSelectProject(newProject);
          setTimeout(() => {
            const el = document.getElementById(`project-${newProject.id}`);
            if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
          }, 300);
        }
      }

      setEditingProject(null);
      setCategoryFilter("All"); // ✅ Always reset filter
      await fetchProjects();
    } catch (err) {
      console.error("Error submitting project:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteProject(id);
      if (selectedProject?.id === id) {
        onSelectProject(null);
      }
      setEditingProject(null);
      setCategoryFilter("All"); // ✅ Always reset filter
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

      <ProjectForm
        editingProject={editingProject}
        onSubmit={handleSubmit}
        onCancel={() => setEditingProject(null)}
        key={editingProject ? editingProject.id : "new"} // force reset form
      />

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

      <ProjectList
        projects={filteredProjects}
        categoryFilter={categoryFilter}
        onEdit={setEditingProject}
        onDelete={handleDelete}
        onSelect={onSelectProject}
        selectedProject={selectedProject}
      />
    </div>
  );
});

export default ProjectMainCrud;
