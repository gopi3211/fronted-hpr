import React, { useEffect, useState } from 'react';
import {
  addGalleryImage,
  getGalleryByProjectId,
  deleteGalleryImage,
} from '../../../../services/hprProjectsService';

const ProjectGalleryCrud = ({ projectId }) => {
  const [images, setImages] = useState([]);
  const [file, setFile] = useState(null);
  const [workDate, setWorkDate] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (projectId) fetchGallery();
  }, [projectId]);

  const fetchGallery = async () => {
    try {
      const res = await getGalleryByProjectId(projectId);
      // ✅ Make sure base64 conversion is correct
      const formatted = res.data?.map(item => ({
        ...item,
   image_url: item.image_blob
  ? `data:image/jpeg;base64,${item.image_blob}`
  : null,

      })) || [];
      setImages(formatted);
    } catch (err) {
      console.error('Error fetching gallery:', err);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !workDate || !description) return alert("All fields required");

    const formData = new FormData();
    formData.append('project_id', projectId);
    formData.append('work_date', workDate);
    formData.append('description', description);
    formData.append('image', file);

    try {
      await addGalleryImage(formData);
      setFile(null);
      setWorkDate('');
      setDescription('');
      fetchGallery();
    } catch (err) {
      console.error('Upload error:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteGalleryImage(id);
      fetchGallery();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  return (
    <div className="bg-gray-100 p-6 rounded shadow mt-10">
      <h2 className="text-xl font-bold mb-4 text-green-700">🖼️ Project Gallery</h2>

      <form onSubmit={handleUpload} className="grid md:grid-cols-4 gap-4 mb-4 items-end">
        <input
          type="date"
          value={workDate}
          onChange={(e) => setWorkDate(e.target.value)}
          className="p-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Work Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="p-2 border rounded"
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
          className="p-2 border rounded"
          required
        />
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
          Upload
        </button>
      </form>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {images.map((img) => (
          <div key={img.id} className="relative group border p-2 rounded shadow bg-white">
            {img.image_url ? (
              <img
                src={img.image_url}
                alt="Gallery"
                className="w-full h-32 object-cover rounded"
              />
            ) : (
              <div className="w-full h-32 bg-gray-200 flex items-center justify-center text-gray-400 text-sm">
                No Image
              </div>
            )}
            <p className="text-xs mt-1 text-gray-700">{img.description}</p>
            <p className="text-[10px] text-gray-500">{new Date(img.work_date).toLocaleDateString()}</p>
            <button
              onClick={() => handleDelete(img.id)}
              className="absolute top-1 right-1 bg-red-600 text-white px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectGalleryCrud;
