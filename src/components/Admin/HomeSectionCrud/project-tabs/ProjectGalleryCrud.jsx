import React, { useEffect, useRef, useState } from 'react';
import {
  addGalleryImage,
  getGalleryByProjectId,
  deleteGalleryImage,
} from '../../../../services/hprProjectsService';

const IMAGE_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace('/api/v1', '') || '';

const ProjectGalleryCrud = React.memo(({ projectId }) => {
  const [images, setImages] = useState([]);
  const [imageUrl, setImageUrl] = useState('');
  const [workDate, setWorkDate] = useState('');
  const [description, setDescription] = useState('');
  const hasFetched = useRef(false);

  useEffect(() => {
    if (projectId && !hasFetched.current) {
      fetchGallery();
      hasFetched.current = true;
    }
  }, [projectId]);

  const fetchGallery = async () => {
    try {
      const res = await getGalleryByProjectId(projectId);
      const formatted = res.data?.map((item) => ({
        ...item,
        image_url: item.image_url?.replace('http://localhost:5000', IMAGE_BASE_URL) || null,
      })) || [];
      setImages(formatted);
    } catch (err) {
      console.error('Error fetching gallery:', err);
    }
  };

  const resetForm = () => {
    setWorkDate('');
    setDescription('');
    setImageUrl('');
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!workDate || !description || !imageUrl) return alert('All fields are required');

    const payload = {
      project_id: projectId,
      work_date: workDate,
      description: description,
      image_url: imageUrl,
    };

    try {
      await addGalleryImage(payload);
      resetForm();
      setTimeout(fetchGallery, 300);
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
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">🖼️ Project Gallery</h2>

        <form
          onSubmit={handleUpload}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6 items-end"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Work Date</label>
            <input
              type="date"
              value={workDate}
              onChange={(e) => setWorkDate(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md bg-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <input
              type="text"
              placeholder="Enter work description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md bg-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
            <input
              type="text"
              placeholder="Paste image URL"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md bg-white"
              required
            />
            {imageUrl && (
              <img
                src={imageUrl}
                alt="Preview"
                className="mt-2 w-full h-24 object-cover rounded-md border"
              />
            )}
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Upload
            </button>
          </div>
        </form>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((img) => (
            <div
              key={img.id}
              className="relative group border border-gray-200 rounded-lg shadow-md bg-white p-3 hover:shadow-xl transition-all duration-300"
            >
              {img.image_url ? (
                <img
                  src={img.image_url}
                  alt="Gallery"
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = '/default-avatar.png';
                  }}
                  className="w-full h-32 object-cover rounded-md mb-2"
                />
              ) : (
                <div className="w-full h-32 bg-gray-100 flex items-center justify-center text-gray-500 text-sm rounded-md">
                  No Image
                </div>
              )}
              <p className="text-sm text-gray-600 line-clamp-2 mb-1">{img.description}</p>
              <p className="text-xs text-gray-500">
                {new Date(img.work_date).toLocaleDateString()}
              </p>
              <div className="absolute top-2 right-2">
                <button
                  onClick={() => handleDelete(img.id)}
                  className="bg-red-600 text-white px-2 py-1 text-xs rounded-md"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

export default ProjectGalleryCrud;
