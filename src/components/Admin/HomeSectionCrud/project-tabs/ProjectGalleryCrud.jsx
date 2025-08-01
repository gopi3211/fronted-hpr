import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  addGalleryImage,
  getGalleryByProjectId,
  deleteGalleryImage,
} from '../../../../services/hprProjectsService';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const IMAGE_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace('/api/v1', '') || '';

const ProjectGalleryCrud = React.memo(({ projectId }) => {
  const [images, setImages] = useState([]);
  const [imageUrl, setImageUrl] = useState('');
  const [workDate, setWorkDate] = useState('');
  const [description, setDescription] = useState('');
  const hasFetched = useRef(false);
  const navigate = useNavigate();

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
      toast.error('Failed to fetch gallery');
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
    if (!workDate || !description || !imageUrl) return toast.error('All fields are required');

    const payload = {
      project_id: projectId,
      work_date: workDate,
      description,
      image_url: imageUrl,
    };

    try {
      await addGalleryImage(payload);
      toast.success('Image uploaded successfully!');
      resetForm();
      setTimeout(fetchGallery, 300);
    } catch (err) {
      toast.error('Failed to upload image');
      console.error('Upload error:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteGalleryImage(id);
      toast.success('Image deleted');
      fetchGallery();
    } catch (err) {
      toast.error('Delete failed');
      console.error('Delete error:', err);
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-lime-50 to-cyan-50 py-10 px-4 sm:px-6 lg:px-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-xl p-6">
        <motion.button
          onClick={() => navigate(-1)}
          className="mb-6 text-cyan-700 hover:text-cyan-900 flex items-center font-semibold"
          whileHover={{ scale: 1.05 }}
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </motion.button>

        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">🖼️ Project Gallery</h2>

        <form
          onSubmit={handleUpload}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6 items-end"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Work Date</label>
            <div className="relative">
              <input
                type="date"
                value={workDate}
                onChange={(e) => setWorkDate(e.target.value)}
                className="w-full p-3 border border-cyan-200 rounded-md pr-10"
                required
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                📅
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <input
              type="text"
              placeholder="Enter work description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 border border-cyan-200 rounded-md"
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
              className="w-full p-3 border border-cyan-200 rounded-md"
              required
            />
            {imageUrl && (
              <img
                src={imageUrl}
                alt="Preview"
                className="mt-2 w-full h-24 object-cover rounded-md border"
                onError={(e) => (e.target.src = '/default-image.jpg')}
              />
            )}
          </div>

          <div className="flex gap-2">
            <motion.button
              type="submit"
              className="px-6 py-3 bg-green-600 text-white rounded-md shadow hover:bg-green-700 transition"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Upload
            </motion.button>
          </div>
        </form>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {images.map((img) => (
            <motion.div
              key={img.id}
              className="relative group border border-cyan-100 rounded-lg shadow bg-white p-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {img.image_url ? (
                <img
                  src={img.image_url}
                  alt="Gallery"
                  loading="lazy"
                  onError={(e) => (e.target.src = '/default-image.jpg')}
                  className="w-full h-32 object-cover rounded-md mb-2"
                />
              ) : (
                <div className="w-full h-32 bg-gray-100 flex items-center justify-center text-gray-500 text-sm rounded-md">
                  No Image
                </div>
              )}
              <p className="text-sm text-gray-700 font-medium line-clamp-2 mb-1">{img.description}</p>
              <p className="text-xs text-gray-500">
                {new Date(img.work_date).toLocaleDateString()}
              </p>
              <button
                onClick={() => handleDelete(img.id)}
                className="absolute top-2 right-2 px-2 py-1 text-xs rounded-md bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
});

export default ProjectGalleryCrud;
