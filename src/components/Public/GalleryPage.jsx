import React, { useEffect, useState } from "react";
import { getGalleryByCategory } from "../../services/hprProjectsService";

const categories = ["Ongoing Projects", "Completed Projects", "Future Projects"];

const GalleryPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("Ongoing Projects");
  const [images, setImages] = useState([]);

  useEffect(() => {
    fetchGalleryData();
  }, [selectedCategory]);

  const fetchGalleryData = async () => {
    try {
const categoryMap = {
  "Ongoing Projects": "Ongoing",
  "Completed Projects": "Completed",
  "Future Projects": "Future",
};

const res = await getGalleryByCategory(categoryMap[selectedCategory]);
      const formatted = res.data?.map(item => ({
        ...item,
        image_url: item.image_blob ? `data:image/jpeg;base64,${item.image_blob}` : null,
      })) || [];
      setImages(formatted);
    } catch (err) {
      console.error("Error loading gallery:", err);
    }
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">HPR Infra - Gallery</h1>

      <div className="flex justify-center gap-4 mb-6 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`px-4 py-2 rounded ${
              selectedCategory === cat
                ? "bg-green-600 text-white"
                : "bg-white text-green-700 border border-green-600"
            }`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {images.length === 0 ? (
          <p className="col-span-3 text-center text-gray-500">No images available.</p>
        ) : (
          images.map((img, index) => (
            <div key={index} className="border rounded p-2 shadow bg-gray-50">
              {img.image_url ? (
                <img
                  src={img.image_url}
                  alt="Gallery"
                  className="w-full h-48 object-cover mb-2 rounded"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-sm text-gray-500">No Image</div>
              )}
              <p className="text-sm font-semibold">{img.description}</p>
              <p className="text-xs text-gray-600">{new Date(img.work_date).toLocaleDateString()}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default GalleryPage;
