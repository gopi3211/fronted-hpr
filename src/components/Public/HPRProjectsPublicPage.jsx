import React, { useEffect, useRef, useState } from "react";
import { getAllProjects } from "../../services/hprProjectsService";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "../Home/Footer";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const HPRProjectsPublicPage = () => {
  const [ongoingProjects, setOngoingProjects] = useState([]);
  const [completedProjects, setCompletedProjects] = useState([]);
  const [futureProjects, setFutureProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const hasFetched = useRef(false);

  useEffect(() => {
    fetchProjects();
    const interval = setInterval(fetchProjects, 30000); // Auto-refresh
    return () => clearInterval(interval);
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await getAllProjects();
      const data = res?.data?.data || res?.data || [];

      const ongoing = data.filter((p) => p.category?.toLowerCase() === "ongoing");
      const completed = data.filter((p) => p.category?.toLowerCase() === "completed");
      const future = data.filter((p) => p.category?.toLowerCase() === "future");

      setOngoingProjects(ongoing);
      setCompletedProjects(completed);
      setFutureProjects(future);
    } catch (err) {
      console.error("Failed to fetch projects", err);
    } finally {
      setLoading(false);
    }
  };

  const renderProjectCard = (project) => {
    const isValid = (val) => typeof val === "string" && val.trim() !== "";

    const imageSrc = isValid(project.logo_url)
      ? project.logo_url
      : isValid(project.banner_url)
      ? project.banner_url
      : "/default-image.jpg";

    return (
      <motion.div
        key={project.id}
        className="relative bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-lime-100"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        whileHover={{ scale: 1.03 }}
      >
        <motion.img
          src={imageSrc}
          alt={project.name}
          loading="lazy"
          className="w-full h-48 object-cover"
          onError={(e) => (e.target.src = "/default-image.jpg")}
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8 }}
        />
        <div className="p-5">
          <motion.h2
            className="text-xl font-semibold mb-2 text-lime-800 truncate"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {project.name}
          </motion.h2>
          <motion.p
            className="text-gray-600 mb-4 line-clamp-2 text-sm leading-relaxed"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            viewport={{ once: true }}
          >
            {project.short_desc}
          </motion.p>
          <Link
            to={`/project-details/${project.id}`}
            className="inline-flex items-center text-lime-600 font-medium hover:text-lime-700 transition-colors"
          >
            View More
            <svg
              className="w-4 h-4 ml-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </motion.div>
    );
  };

  const noProjectsFallback = (
    <motion.div
      className="col-span-full flex flex-col items-center justify-center text-center py-10"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <DotLottieReact
        src="https://lottie.host/9343030f-63b0-4db2-a343-fe8d1fc61f79/nMsgnUsjDM.lottie"
        loop
        autoplay
        style={{ width: "180px", height: "180px" }}
      />
      <p className="text-lg font-medium text-gray-600 mt-4">
        Projects will be uploaded soon!
      </p>
    </motion.div>
  );

  return (
    <motion.div
      className="flex flex-col min-h-screen bg-gradient-to-br from-lime-50 to-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.h1
            className="text-4xl font-bold mb-8 text-center text-lime-800"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Our Projects
          </motion.h1>

          <div className="text-center mb-8">
            <motion.button
              onClick={fetchProjects}
              className="bg-lime-600 text-white px-6 py-3 rounded-full hover:bg-lime-700 transition-colors flex items-center justify-center mx-auto shadow-md"
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
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.582m0 0a8.001 8.001 0 01-15.356-2m15.356 2H15"
                />
              </svg>
              Refresh Projects
            </motion.button>
          </div>

          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                className="flex justify-center items-center min-h-[50vh]"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="relative w-16 h-16"
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                >
                  <div className="absolute inset-0 border-4 border-t-lime-500 border-lime-200 rounded-full" />
                  <div className="absolute inset-2 border-4 border-t-lime-600 border-transparent rounded-full" />
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    <div className="w-3 h-3 bg-lime-500 rounded-full" />
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
                <section className="mb-12">
                  <motion.h2
                    className="text-2xl font-semibold mb-6 text-lime-800"
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                  >
                    Ongoing Projects
                  </motion.h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {ongoingProjects.length > 0
                      ? ongoingProjects.map(renderProjectCard)
                      : noProjectsFallback}
                  </div>
                </section>

                <section className="mb-12">
                  <motion.h2
                    className="text-2xl font-semibold mb-6 text-lime-800"
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                  >
                    Completed Projects
                  </motion.h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {completedProjects.length > 0
                      ? completedProjects.map(renderProjectCard)
                      : noProjectsFallback}
                  </div>
                </section>

                <section>
                  <motion.h2
                    className="text-2xl font-semibold mb-6 text-lime-800"
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                  >
                    Future Projects
                  </motion.h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {futureProjects.length > 0
                      ? futureProjects.map(renderProjectCard)
                      : noProjectsFallback}
                  </div>
                </section>
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

export default HPRProjectsPublicPage;