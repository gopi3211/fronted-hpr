import React, { useEffect, useState } from "react";
import { getGalleryByCategory } from "../../services/hprProjectsService";
import Footer from "../Home/Footer";
import { DotLottieReact } from "@lottiefiles/dotlottie-react"; // ✅ Import Lottie

const categories = ["Ongoing Projects", "Completed Projects", "Future Projects"];

const GalleryPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("Ongoing Projects");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGalleryData();
  }, [selectedCategory]);

  const fetchGalleryData = async () => {
    try {
      setLoading(true);

      const categoryMap = {
        "Ongoing Projects": "Ongoing",
        "Completed Projects": "Completed",
        "Future Projects": "Future",
      };

      const res = await getGalleryByCategory(categoryMap[selectedCategory]);

      const formatted = res.data?.map(item => ({
        ...item,
        image_url: item.image_blob
          ? `data:image/jpeg;base64,${item.image_blob}`
          : null,
      })) || [];

      setImages(formatted);
    } catch (err) {
      console.error("Error loading gallery:", err);
    } finally {
      setLoading(false);
    }
  };

  const noImagesFallback = (
    <div className="col-span-full flex flex-col items-center justify-center text-center py-10">
      <DotLottieReact
        src="https://lottie.host/9343030f-63b0-4db2-a343-fe8d1fc61f79/nMsgnUsjDM.lottie"
        loop
        autoplay
        style={{ width: "180px", height: "180px" }}
      />
      <p className="text-lg font-medium text-gray-600 mt-4">
        Images will be uploaded soon!
      </p>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            HPR Infra - Gallery
          </h1>

          {/* Category Tabs */}
          <div className="flex justify-center gap-3 mb-8 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors ${
                  selectedCategory === cat
                    ? "bg-green-600 text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
                }`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Loader or Gallery Grid */}
          {loading ? (
            <div className="flex justify-center items-center min-h-[200px]">
              <div className="w-10 h-10 border-4 border-green-500 border-dashed rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {images.length === 0 ? (
                noImagesFallback
              ) : (
                images.map((img, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg shadow-md p-3 hover:shadow-xl transition-all duration-300"
                  >
                    {img.image_url ? (
                      <img
                        src={img.image_url}
                        alt="Gallery"
                        className="w-full h-48 object-cover rounded-md mb-2"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-sm text-gray-500 rounded-md">
                        No Image
                      </div>
                    )}
                    <p className="text-sm font-semibold text-gray-900 line-clamp-2">
                      {img.description}
                    </p>
                    <p className="text-xs text-gray-600">
                      {new Date(img.work_date).toLocaleDateString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </main>

      <footer className="w-full mt-auto">
        <Footer />
      </footer>
    </div>
  );
};

export default GalleryPage;
