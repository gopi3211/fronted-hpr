import React, { useMemo } from "react";

const IMAGE_BASE_URL = import.meta.env.VITE_API_BASE_URL.replace("/api/v1", "");

const ProjectList = ({
  projects,
  categoryFilter,
  onEdit,
  onDelete,
  onSelect,
  selectedProject,
}) => {
  const filteredProjects = useMemo(() => {
    return projects.filter((p) =>
      categoryFilter === "All" ? true : p.category === categoryFilter
    );
  }, [projects, categoryFilter]);

  const visibleProjects = useMemo(() => {
    if (selectedProject?.id) {
      return filteredProjects.filter((p) => p.id === selectedProject.id);
    }
    return filteredProjects;
  }, [filteredProjects, selectedProject]);

  const handleProjectSelect = (e) => {
    const selectedId = parseInt(e.target.value);
    const selected = projects.find((p) => p.id === selectedId);
    if (selected) {
      onSelect(selected);
      const el = document.getElementById(`project-${selectedId}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    } else {
      onSelect(null);
    }
  };

  return (
    <div className="relative">
      {/* 🔽 Top-right Project Selector */}
      <div className="flex justify-end mb-4">
        <select
          className="p-2 border border-gray-300 rounded-md"
          value={selectedProject?.id || ""}
          onChange={handleProjectSelect}
        >
          <option value="">🔍 Show All Projects</option>
          {projects.map((proj) => (
            <option key={proj.id} value={proj.id}>
              {proj.name}
            </option>
          ))}
        </select>
      </div>

      {/* 🧱 Project Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleProjects.map((proj) => (
          <div
            key={proj.id}
            id={`project-${proj.id}`}
            className={`p-5 border rounded shadow-md transition-all cursor-pointer ${
              selectedProject?.id === proj.id
                ? "border-green-500 scale-105"
                : "hover:shadow-lg"
            }`}
            onClick={() => onSelect(proj)}
          >
            <h3 className="text-lg font-semibold">{proj.name}</h3>
            <p className="text-sm">{proj.short_desc}</p>
            <p className="text-xs text-gray-500 italic">{proj.category}</p>

            <div className="flex gap-2 mt-2">
              {proj.logo_url && (
                <img
                  src={proj.logo_url.replace("http://localhost:5000", IMAGE_BASE_URL)}
                  alt="logo"
                  className="w-10 h-10 object-cover border rounded"
                  onError={(e) => {
                    e.target.src = "/default-avatar.png"; // fallback
                  }}
                />
              )}
              {proj.banner_url && (
                <img
                  src={proj.banner_url.replace("http://localhost:5000", IMAGE_BASE_URL)}
                  alt="banner"
                  className="w-20 h-10 object-cover border rounded"
                  onError={(e) => {
                    e.target.src = "/default-avatar.png"; // fallback
                  }}
                />
              )}
            </div>

            <div className="flex gap-2 mt-3">
              <button
                onClick={() => onEdit(proj)}
                className="text-blue-500 text-xs"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(proj.id)}
                className="text-red-500 text-xs"
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

export default ProjectList;
