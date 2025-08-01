import React, { useEffect, useState } from "react";
import { getAllNews, getBanner, getNewsById } from "../../services/newsService";
import Footer from "../Home/Footer";
import { motion, AnimatePresence } from "framer-motion";

const NewsPage = () => {
  const [banner, setBanner] = useState(null);
  const [newsList, setNewsList] = useState([]);
  const [modal, setModal] = useState({ open: false, content: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [newsRes, bannerRes] = await Promise.all([getAllNews(), getBanner()]);
      setNewsList(newsRes.data.data);

      if (bannerRes?.data?.banner_url) {
        setBanner(`${bannerRes.data.banner_url}?t=${Date.now()}`);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const openModal = async (id) => {
    try {
      const res = await getNewsById(id);
      setModal({ open: true, content: res.data.data });
    } catch (err) {
      console.error("Error opening modal:", err);
    }
  };

  const closeModal = () => setModal({ open: false, content: null });

  return (
    <motion.div
      className="flex flex-col min-h-screen bg-gradient-to-br from-lime-50 to-cyan-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              className="flex justify-center items-center min-h-[400px]"
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
            >
              {/* Top News Banner */}
              {banner && (
                <motion.div
                  className="w-full overflow-hidden max-h-[400px]"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6 }}
                >
                  <img
                    src={banner}
                    alt="News Banner"
                    className="w-full h-[400px] object-cover object-center shadow-lg"
                    loading="lazy"
                  />
                </motion.div>
              )}

              {/* News Cards */}
              <div className="max-w-6xl mx-auto px-4 pb-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
                {newsList.map((news, index) => (
                  <motion.div
                    key={news.id}
                    className="bg-white shadow-md border border-cyan-100 rounded-xl overflow-hidden hover:shadow-xl transition-all flex flex-col justify-between"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ scale: 1.03, boxShadow: "0 10px 20px rgba(0, 172, 193, 0.2)" }}
                  >
                    {/* Image Thumbnail Grid */}
                    <div className="grid grid-cols-2 gap-1 h-40 overflow-hidden">
                      {news.images && news.images.length > 0 ? (
                        news.images.slice(0, 4).map((img, i) => (
                          <motion.img
                            key={i}
                            src={img.image_url || "/default-image.jpg"}
                            alt={`thumbnail-${i}`}
                            className="w-full h-full object-cover"
                            loading="lazy"
                            initial={{ scale: 1.1 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.8 }}
                          />
                        ))
                      ) : (
                        <img
                          src="/default-image.jpg"
                          alt="default"
                          className="col-span-2 w-full h-full object-cover"
                          loading="lazy"
                        />
                      )}
                    </div>

                    {/* Text Content */}
                    <div className="p-5 flex flex-col justify-between h-full">
                      <div>
                        <motion.h2
                          className="text-lg font-semibold text-cyan-800 mb-2 truncate"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.4, delay: 0.2 }}
                        >
                          {news.title}
                        </motion.h2>
                        <motion.p
                          className="text-sm text-gray-600 mb-2 line-clamp-3"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.4, delay: 0.3 }}
                        >
                          {news.short_description}
                        </motion.p>
                        <motion.p
                          className="text-xs text-gray-500 flex items-center"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.4, delay: 0.4 }}
                        >
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          {new Date(news.posted_date).toLocaleDateString()}
                        </motion.p>
                      </div>
                      <motion.button
                        onClick={() => openModal(news.id)}
                        className="mt-4 w-fit px-4 py-2 text-sm font-medium bg-cyan-600 text-white rounded-full hover:bg-cyan-700 transition-colors shadow-sm"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Read More
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="w-full mt-auto">
        <Footer />
      </footer>

      {/* News Modal */}
      <AnimatePresence>
        {modal.open && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="bg-white rounded-xl overflow-hidden max-w-3xl w-full relative max-h-[90vh] shadow-2xl"
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Modal Top Banner */}
              <motion.img
                src={
                  modal.content?.images?.length > 0
                    ? modal.content.images[0].image_url || "/default-image.jpg"
                    : "/default-image.jpg"
                }
                alt="modal-news-banner"
                className="w-full h-60 object-cover"
                loading="lazy"
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.8 }}
              />

              <div className="p-6 overflow-y-auto max-h-[calc(90vh-60px)]">
                <motion.button
                  onClick={closeModal}
                  className="absolute top-2 right-4 text-2xl font-bold text-gray-500 hover:text-gray-800"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  &times;
                </motion.button>

                <motion.h2
                  className="text-2xl font-bold text-cyan-800 mb-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  {modal.content?.title}
                </motion.h2>
                <motion.p
                  className="text-sm text-gray-500 mb-4 flex items-center"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  {new Date(modal.content?.posted_date).toLocaleDateString()}
                </motion.p>
                <motion.p
                  className="text-base text-gray-800 whitespace-pre-line mb-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                  {modal.content?.full_description}
                </motion.p>

                {/* All Additional Images */}
                {modal.content?.images?.length > 1 && (
                  <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                  >
                    {modal.content.images.slice(1).map((img, idx) => (
                      <motion.img
                        key={idx}
                        src={img.image_url || "/default-image.jpg"}
                        alt={`news-img-${idx + 1}`}
                        className="w-full h-48 object-cover rounded-lg border border-cyan-100"
                        loading="lazy"
                        initial={{ scale: 1.1 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.8 }}
                      />
                    ))}
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default NewsPage;