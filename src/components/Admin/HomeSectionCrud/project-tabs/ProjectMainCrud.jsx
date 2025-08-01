import React, { useEffect, useRef, useState } from "react";
import ProjectList from "./ProjectList";
import {
  getAllProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../../../../services/hprProjectsService";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ProjectMainCrud = React.memo(({ onSelectProject, selectedProject }) => {
  const [projects, setProjects] = useState([]);
  const [editingProject, setEditingProject] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [projectFilter, setProjectFilter] = useState("");
  const [projectNames, setProjectNames] = useState([]);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isProjectDropdownOpen, setIsProjectDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const categoryDropdownRef = useRef(null);
  const projectDropdownRef = useRef(null);
  const hasFetched = useRef(false);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    category: "",
    short_desc: "",
    logo_url: "",
    banner_url: "",
  });

  useEffect(() => {
    if (!hasFetched.current) {
      fetchProjects();
      hasFetched.current = true;
    }
  }, []);

  useEffect(() => {
    // Extract unique project names
    const uniqueProjects = [...new Set(projects.map((p) => p.name).filter(Boolean))];
    setProjectNames(uniqueProjects);
    // Reset project filter when projects change
    setProjectFilter("");
  }, [projects]);

  useEffect(() => {
    // Close dropdowns when clicking outside
    const handleClickOutside = (event) => {
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(event.target)
      ) {
        setIsCategoryDropdownOpen(false);
      }
      if (
        projectDropdownRef.current &&
        !projectDropdownRef.current.contains(event.target)
      ) {
        setIsProjectDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
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
  toast.success("Project updated successfully!");
} else {
  const res = await createProject(form);
  if (res?.data?.insertId) {
    const newProject = { id: res.data.insertId, ...form };
    onSelectProject(newProject);
    toast.success("Project created successfully!");
  } else {
    toast.error("Failed to create project.");
  }
}

      resetForm();
      setCategoryFilter("All");
      setProjectFilter("");
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
toast.success("Project deleted successfully!");
if (selectedProject?.id === id) {
  onSelectProject(null);
}

      resetForm();
      setCategoryFilter("All");
      setProjectFilter("");
      await fetchProjects();
    } catch (err) {
      console.error("Error deleting project:", err);
    }
  };

  const filteredProjects =
    categoryFilter === "All" && projectFilter === ""
      ? projects
      : projects.filter((p) => {
          const matchesCategory =
            categoryFilter === "All" ||
            p.category?.toLowerCase() === categoryFilter.toLowerCase();
          const matchesProject = projectFilter === "" || p.name === projectFilter;
          return matchesCategory && matchesProject;
        });

  return (
    <motion.div
      className="p-6 max-w-7xl mx-auto space-y-8 bg-gradient-to-br from-lime-50 to-cyan-50 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Back Button */}
      <motion.button
        onClick={() => navigate(-1)}
        className="flex items-center text-cyan-600 hover:text-cyan-700 font-medium transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <svg
          className="w-5 h-5 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back
      </motion.button>

      <motion.h2
        className="text-3xl font-bold text-cyan-800 flex items-center"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <svg
          className="w-6 h-6 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
          />
        </svg>
        Project Management
      </motion.h2>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            className="flex justify-center items-center min-h-[200px]"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="relative w-16 h-16"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
            >
              <div className="absolute inset-0 border-4 border-t-cyan-500 border-cyan-200 rounded-full" />
              <div className="absolute inset-2 border-4 border-t-cyan-600 border-transparent rounded-full" />
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <div className="w-3 h-3 bg-cyan-500 rounded-full" />
              </motion.div>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            {/* Project Form */}
            <motion.form
              onSubmit={handleSubmit}
              className="space-y-4 bg-white p-6 rounded-xl shadow-lg border border-cyan-100"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <input
                type="text"
                placeholder="Project Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-cyan-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white/95 transition-all"
                required
              />
         <select
  value={form.category}
  onChange={(e) => setForm({ ...form, category: e.target.value })}
  required
  className="w-full border border-cyan-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white/95 transition-all"
>
  <option value="">Select Category</option>
  <option value="Ongoing">Ongoing</option>
  <option value="Completed">Completed</option>
  <option value="Future">Future</option>
</select>

              <textarea
                placeholder="Short Description"
                value={form.short_desc}
                onChange={(e) => setForm({ ...form, short_desc: e.target.value })}
                className="w-full border border-cyan-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white/95 transition-all resize-none h-24"
              />
              <input
                type="text"
                placeholder="Logo Image URL"
                value={form.logo_url}
                onChange={(e) => setForm({ ...form, logo_url: e.target.value })}
                className="w-full border border-cyan-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white/95 transition-all"
              />
              {form.logo_url && (
                <motion.img
                  src={form.logo_url}
                  alt="Logo Preview"
                  className="h-24 w-auto rounded-lg shadow-md"
                  onError={(e) => (e.target.src = "/default-image.jpg")}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                />
              )}
              <input
                type="text"
                placeholder="Banner Image URL"
                value={form.banner_url}
                onChange={(e) => setForm({ ...form, banner_url: e.target.value })}
                className="w-full border border-cyan-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white/95 transition-all"
              />
              {form.banner_url && (
                <motion.img
                  src={form.banner_url}
                  alt="Banner Preview"
                  className="h-24 w-auto rounded-lg shadow-md"
                  onError={(e) => (e.target.src = "/default-image.jpg")}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                />
              )}
              <div className="flex gap-4">
                <motion.button
                  type="submit"
                  className="bg-cyan-600 text-white px-6 py-2 rounded-full shadow-md hover:bg-cyan-700 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {editingProject ? "Update Project" : "Create Project"}
                </motion.button>
                {editingProject && (
                  <motion.button
                    type="button"
                    onClick={resetForm}
                    className="bg-gray-500 text-white px-6 py-2 rounded-full shadow-md hover:bg-gray-600 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Cancel
                  </motion.button>
                )}
              </div>
            </motion.form>

            {/* Category and Project Filter */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="relative flex-1" ref={categoryDropdownRef}>
                <motion.button
                  className="w-full bg-cyan-600 text-white px-6 py-2 rounded-full flex items-center justify-center shadow-md hover:bg-cyan-700 transition-colors"
                  onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 4h18M3 12h18M3 20h18"
                    />
                  </svg>
                  {categoryFilter}
                </motion.button>
                <AnimatePresence>
                  {isCategoryDropdownOpen && (
                    <motion.div
                      className="absolute left-0 mt-2 w-full bg-white rounded-lg shadow-lg border border-cyan-100 z-10"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      {["All", "Ongoing", "Completed", "Future"].map((cat) => (
                        <button
                          key={cat}
                          className={`w-full px-4 py-2 text-left text-sm font-semibold text-gray-700 hover:bg-cyan-50 transition-colors ${
                            categoryFilter === cat ? "bg-cyan-100 text-cyan-800" : ""
                          }`}
                          onClick={() => {
                            setCategoryFilter(cat);
                            setIsCategoryDropdownOpen(false);
                          }}
                        >
                          {cat}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="relative flex-1" ref={projectDropdownRef}>
                <motion.button
                  className="w-full bg-cyan-600 text-white px-6 py-2 rounded-full flex items-center justify-center shadow-md hover:bg-cyan-700 transition-colors"
                  onClick={() => setIsProjectDropdownOpen(!isProjectDropdownOpen)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 4h18M3 12h18M3 20h18"
                    />
                  </svg>
                  {projectFilter || "All Projects"}
                </motion.button>
                <AnimatePresence>
                  {isProjectDropdownOpen && (
                    <motion.div
                      className="absolute left-0 mt-2 w-full bg-white rounded-lg shadow-lg border border-cyan-100 z-10 max-h-60 overflow-y-auto"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <button
                        className={`w-full px-4 py-2 text-left text-sm font-semibold text-gray-700 hover:bg-cyan-50 transition-colors ${
                          !projectFilter ? "bg-cyan-100 text-cyan-800" : ""
                        }`}
                        onClick={() => {
                          setProjectFilter("");
                          setIsProjectDropdownOpen(false);
                        }}
                      >
                        All Projects
                      </button>
                      {projectNames.map((project) => (
                        <button
                          key={project}
                          className={`w-full px-4 py-2 text-left text-sm font-semibold text-gray-700 hover:bg-cyan-50 transition-colors ${
                            projectFilter === project ? "bg-cyan-100 text-cyan-800" : ""
                          }`}
                          onClick={() => {
                            setProjectFilter(project);
                            setIsProjectDropdownOpen(false);
                          }}
                        >
                          {project}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Project List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <ProjectList
                projects={filteredProjects}
                categoryFilter={categoryFilter}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onSelect={onSelectProject}
                selectedProject={selectedProject}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

export default ProjectMainCrud;