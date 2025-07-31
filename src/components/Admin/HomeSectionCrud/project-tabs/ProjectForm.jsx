import React, { useEffect, useState } from "react";

const ProjectForm = ({ editingProject, onSubmit, onCancel }) => {
  const [form, setForm] = useState({
    name: "",
    category: "",
    short_desc: "",
    logo_url: "",
    banner_url: "",
  });

  useEffect(() => {
    if (editingProject) {
      setForm({
        name: editingProject.name || "",
        category: editingProject.category || "",
        short_desc: editingProject.short_desc || "",
        logo_url: editingProject.logo_url || "",
        banner_url: editingProject.banner_url || "",
      });
    } else {
      setForm({
        name: "",
        category: "",
        short_desc: "",
        logo_url: "",
        banner_url: "",
      });
    }
  }, [editingProject]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      category: form.category,
      short_desc: form.short_desc,
      logo_url: form.logo_url,
      banner_url: form.banner_url,
    };
    onSubmit(payload);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 shadow rounded space-y-4"
    >
      <input
        type="text"
        placeholder="Project Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className="w-full p-3 border rounded"
        required
      />

      <select
        value={form.category}
        onChange={(e) => setForm({ ...form, category: e.target.value })}
        className="w-full p-3 border rounded"
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
        className="w-full p-3 border rounded"
        required
      />

      <input
        type="text"
        placeholder="Logo Image URL"
        value={form.logo_url}
        onChange={(e) => setForm({ ...form, logo_url: e.target.value })}
        className="w-full p-3 border rounded"
      />
      {form.logo_url && (
        <img
          src={form.logo_url}
          alt="Logo Preview"
          className="h-16 w-16 object-cover rounded border"
          onError={(e) => (e.target.src = "/default-avatar.png")}
        />
      )}

      <input
        type="text"
        placeholder="Banner Image URL"
        value={form.banner_url}
        onChange={(e) => setForm({ ...form, banner_url: e.target.value })}
        className="w-full p-3 border rounded"
      />
      {form.banner_url && (
        <img
          src={form.banner_url}
          alt="Banner Preview"
          className="h-16 w-32 object-cover rounded border"
          onError={(e) => (e.target.src = "/default-avatar.png")}
        />
      )}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          {editingProject ? "Update Project" : "Add Project"}
        </button>
        {editingProject && (
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-400 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default ProjectForm;
