import React, { useEffect, useState } from 'react';
import {
  getHomeByProjectId,
  createHome,
  updateHome,
  deleteHome,
} from '../../../../services/hprProjectsService';

const ProjectHomeCrud = ({ projectId }) => {
  const [homeData, setHomeData] = useState(null);
  const [form, setForm] = useState({ title: '', description: '' });
  const [brochureFile, setBrochureFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    if (projectId) fetchHomeData();
  }, [projectId]);

  const fetchHomeData = async () => {
    try {
      const res = await getHomeByProjectId(projectId);
      if (res.data) {
        setHomeData(res.data);
        setForm({
          title: res.data.title || '',
          description: res.data.description || '',
        });
        setEditingId(res.data.id);
      } else {
        setHomeData(null);
        setForm({ title: '', description: '' });
        setEditingId(null);
      }
    } catch (err) {
      console.error('Error fetching home data:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("project_id", projectId);
      formData.append("title", form.title);
      formData.append("description", form.description);
      if (brochureFile) formData.append("brochure", brochureFile);
      if (imageFile) formData.append("image", imageFile);

      if (editingId) {
        await updateHome(editingId, formData);
      } else {
        await createHome(formData);
      }

      fetchHomeData();
      setBrochureFile(null);
      setImageFile(null);
    } catch (err) {
      console.error("Submit error:", err);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteHome(editingId);
      setHomeData(null);
      setForm({ title: '', description: '' });
      setEditingId(null);
      setBrochureFile(null);
      setImageFile(null);
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const getImagePreview = () => {
    if (imageFile) return URL.createObjectURL(imageFile);
    if (homeData?.image) return `data:image/jpeg;base64,${homeData.image}`;
    return null;
  };

  const getPdfBlobUrl = () => {
    if (brochureFile) return URL.createObjectURL(brochureFile);
    if (homeData?.brochure) {
      const binary = Uint8Array.from(homeData.brochure.data);
      const blob = new Blob([binary], { type: "application/pdf" });
      return URL.createObjectURL(blob);
    }
    return null;
  };

  return (
    <div className="bg-gray-100 p-6 rounded shadow mt-4">
      <h2 className="text-xl font-bold mb-4 text-green-700">🏠 Project Home Content</h2>

      {/* Form Section */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
        <div className="flex flex-col gap-2">
          <label className="font-semibold">Upload Brochure (PDF)</label>
          <input type="file" accept="application/pdf" onChange={(e) => setBrochureFile(e.target.files[0])} />
          {brochureFile && <p className="text-sm text-gray-700">📄 {brochureFile.name}</p>}

          <label className="font-semibold mt-2">Upload Image (JPEG/PNG)</label>
          <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />
          {getImagePreview() && (
            <img src={getImagePreview()} alt="Preview" className="w-48 h-32 object-cover border mt-2" />
          )}
        </div>

        <div className="flex gap-4 mt-4">
          <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">
            {editingId ? 'Update' : 'Create'}
          </button>
          {editingId && (
            <button type="button" onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded">
              Delete
            </button>
          )}
        </div>
      </form>

      {/* ✅ Display Section Below Form */}
      {homeData && (
        <div className="mt-8 bg-white rounded p-4 border">
          <h3 className="text-lg font-semibold text-blue-700 mb-2">🔎 Current Saved Data</h3>
          <p className="mb-2"><strong>Title:</strong> {homeData.title}</p>
          <p className="mb-2"><strong>Description:</strong> {homeData.description}</p>
        
{getPdfBlobUrl() && (
  <div className="mb-4">
    <strong>Brochure:</strong>{" "}
    <a
      href={getPdfBlobUrl()}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-600 underline"
    >
      📄 View Brochure
    </a>
    <embed
      src={getPdfBlobUrl()}
      type="application/pdf"
      width="100%"
      height="500px"
      className="mt-2 border rounded"
    />
  </div>
)}






          {getImagePreview() && (
            <div>
              <strong>Image:</strong>
              <img src={getImagePreview()} alt="Saved" className="w-48 h-32 object-cover border mt-2" />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectHomeCrud;
