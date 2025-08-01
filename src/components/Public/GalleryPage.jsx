import React, { useEffect, useState, useRef } from "react";
import { getGalleryByCategory } from "../../services/hprProjectsService";
import Footer from "../Home/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const categories = ["Ongoing Projects", "Completed Projects", "Future Projects"];
const BASE_URL = import.meta.env.VITE_API_BASE_URL.replace("/api/v1", "");

const GalleryPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("Ongoing Projects");
  const [images, setImages] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const [projectNames, setProjectNames] = useState([]);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isProjectDropdownOpen, setIsProjectDropdownOpen] = useState(false);
  const categoryDropdownRef = useRef(null);
  const projectDropdownRef = useRef(null);

  useEffect(() => {
    fetchGalleryData();
  }, [selectedCategory]);

  useEffect(() => {
    // Extract unique project names for the selected category
    const uniqueProjects = [...new Set(images.map((img) => img.project_name).filter(Boolean))];
    setProjectNames(uniqueProjects);
    // Reset project filter when category changes
    setSelectedProject("");
  }, [images]);

  useEffect(() => {
    // Filter images based on search query and selected project
    const filtered = images.filter((img) => {
      const matchesSearch = img.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesProject = selectedProject ? img.project_name === selectedProject : true;
      return matchesSearch && matchesProject;
    });
    setFilteredImages(filtered);
  }, [searchQuery, selectedProject, images]);

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

  const fetchGalleryData = async () => {
    try {
      setLoading(true);
      const categoryMap = {
        "Ongoing Projects": "Ongoing",
        "Completed Projects": "Completed",
        "Future Projects": "Future",
      };

      const res = await getGalleryByCategory(categoryMap[selectedCategory]);
      const formatted = res?.data?.map((item) => ({
        ...item,
        image_url: item.image_url?.replace("http://localhost:5000", BASE_URL) || null,
      })) || [];

      setImages(formatted);
      setFilteredImages(formatted);
    } catch (err) {
      console.error("Error loading gallery:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const noImagesFallback = (
    <motion.div
      className="col-span-full flex flex-col items-center justify-center text-center py-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <DotLottieReact
        src="https://lottie.host/9343030f-63b0-4db2-a343-fe8d1fc61f79/nMsgnUsjDM.lottie"
        loop
        autoplay
        style={{ width: "180px", height: "180px" }}
      />
      <p className="text-lg font-medium text-gray-600 mt-4">
        Images will be uploaded soon!
      </p>
    </motion.div>
  );

  return (
    <motion.div
      className="flex flex-col min-h-screen bg-gradient-to-br from-lime-50 to-cyan-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.h1
            className="text-4xl font-bold text-cyan-800 mb-8 text-center"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            HPR Infra - Gallery
          </motion.h1>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
            <motion.div
              className="relative w-full sm:w-1/2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Search images by description..."
                className="w-full px-4 py-2 rounded-full border border-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white/95 shadow-sm text-gray-700 transition-all duration-300"
              />
              <svg
                className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </motion.div>
            <div className="flex gap-4">
              <div className="relative" ref={categoryDropdownRef}>
                <motion.button
                  className="bg-cyan-600 text-white px-6 py-2 rounded-full flex items-center justify-center shadow-md hover:bg-cyan-700 transition-colors"
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
                  {selectedCategory}
                </motion.button>
                <AnimatePresence>
                  {isCategoryDropdownOpen && (
                    <motion.div
className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-lg border border-cyan-100 z-10"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          className={`w-full px-4 py-2 text-left text-sm font-semibold text-gray-700 hover:bg-cyan-50 transition-colors ${
                            selectedCategory === cat ? "bg-cyan-100 text-cyan-800" : ""
                          }`}
                          onClick={() => {
                            setSelectedCategory(cat);
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
              <div className="relative" ref={projectDropdownRef}>
                <motion.button
                  className="bg-cyan-600 text-white px-6 py-2 rounded-full flex items-center justify-center shadow-md hover:bg-cyan-700 transition-colors"
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
                  {selectedProject || "All Projects"}
                </motion.button>
                <AnimatePresence>
                  {isProjectDropdownOpen && (
                    <motion.div
className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-lg border border-cyan-100 z-10 max-h-60 overflow-y-auto"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <button
                        className={`w-full px-4 py-2 text-left text-sm font-semibold text-gray-700 hover:bg-cyan-50 transition-colors ${
                          !selectedProject ? "bg-cyan-100 text-cyan-800" : ""
                        }`}
                        onClick={() => {
                          setSelectedProject("");
                          setIsProjectDropdownOpen(false);
                        }}
                      >
                        All Projects
                      </button>
                      {projectNames.map((project) => (
                        <button
                          key={project}
                          className={`w-full px-4 py-2 text-left text-sm font-semibold text-gray-700 hover:bg-cyan-50 transition-colors ${
                            selectedProject === project ? "bg-cyan-100 text-cyan-800" : ""
                          }`}
                          onClick={() => {
                            setSelectedProject(project);
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
            </div>
          </div>

          {/* Loader or Gallery Grid */}
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
                key="gallery"
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {filteredImages.length === 0 ? (
                  noImagesFallback
                ) : (
                  filteredImages.map((img, index) => (
                    <motion.div
                      key={index}
                      className="bg-white rounded-xl shadow-md p-4 hover:shadow-xl transition-all duration-300 border border-cyan-100"
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      whileHover={{ scale: 1.03, boxShadow: "0 10px 20px rgba(0, 172, 193, 0.2)" }}
                    >
                      {img.image_url ? (
                        <motion.img
                          src={img.image_url}
                          alt={img.description || "Gallery"}
                          className="w-full h-56 object-cover rounded-lg mb-3"
                          loading="lazy"
                          initial={{ scale: 1.1 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.8 }}
                        />
                      ) : (
                        <div className="w-full h-56 bg-gray-100 flex items-center justify-center text-sm text-gray-500 rounded-lg">
                          No Image
                        </div>
                      )}
                      <p className="text-sm font-semibold text-cyan-800 line-clamp-2">
                        {img.description || "No description provided."}
                      </p>
                      {img.project_name && (
                        <p className="text-xs text-gray-600 mt-1">{img.project_name}</p>
                      )}
                      {img.work_date && (
                        <p className="text-xs text-gray-600 mt-1">
                          {new Date(img.work_date).toLocaleDateString()}
                        </p>
                      )}
                    </motion.div>
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <footer className="w-full mt-auto">
        <Footer />
      </footer>
    </motion.div>
  );
};

export default GalleryPage;