import React, { useEffect, useRef, useState } from "react";
import { getAllProjects } from "../../services/hprProjectsService";
import { Link } from "react-router-dom";
import Footer from "../Home/Footer";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const STATIC_BASE_URL = API_BASE_URL.replace("/api/v1", ""); // ✅ for static image access

const HPRProjectsPublicPage = () => {
  const [ongoingProjects, setOngoingProjects] = useState([]);
  const [completedProjects, setCompletedProjects] = useState([]);
  const [futureProjects, setFutureProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const hasFetched = useRef(false);

  useEffect(() => {
    fetchProjects(); // initial load
    const interval = setInterval(fetchProjects, 30000); // ✅ auto-refresh every 30s
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

    const imageSrc = isValid(project.logo_filename)
      ? `${STATIC_BASE_URL}/uploads/project-images/${project.logo_filename}`
      : isValid(project.banner_filename)
      ? `${STATIC_BASE_URL}/uploads/project-images/${project.banner_filename}`
      : "/default-image.jpg";

    return (
      <div
        key={project.id}
        className="border rounded-lg shadow-md p-4 bg-white hover:shadow-lg transition-shadow"
      >
        <img
          src={imageSrc}
          alt={project.name}
          loading="lazy"
          className="w-full h-40 object-cover mb-4 rounded"
        />
        <h2 className="text-xl font-semibold mb-2">{project.name}</h2>
        <p className="text-gray-600 mb-3 line-clamp-2">{project.short_desc}</p>
        <Link
          to={`/project-details/${project.id}`}
          className="text-blue-600 font-medium hover:underline"
        >
          View More →
        </Link>
      </div>
    );
  };

  const noProjectsFallback = (
    <div className="col-span-full flex flex-col items-center justify-center text-center py-10">
      <DotLottieReact
        src="https://lottie.host/9343030f-63b0-4db2-a343-fe8d1fc61f79/nMsgnUsjDM.lottie"
        loop
        autoplay
        style={{ width: "180px", height: "180px" }}
      />
      <p className="text-lg font-medium text-gray-600 mt-4">
        Projects will be uploaded soon!
      </p>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-grow py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-center">Our Projects</h1>

          <div className="text-center mb-6">
            <button
              onClick={fetchProjects}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            >
              🔄 Refresh Projects
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center min-h-[50vh]">
              <div className="w-12 h-12 border-4 border-green-500 border-dashed rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              {/* 🔵 Ongoing Projects */}
              <section className="mb-10">
                <h2 className="text-2xl font-semibold mb-4">Ongoing Projects</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {ongoingProjects.length > 0
                    ? ongoingProjects.map(renderProjectCard)
                    : noProjectsFallback}
                </div>
              </section>

              {/* ✅ Completed Projects */}
              <section className="mb-10">
                <h2 className="text-2xl font-semibold mb-4">Completed Projects</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {completedProjects.length > 0
                    ? completedProjects.map(renderProjectCard)
                    : noProjectsFallback}
                </div>
              </section>

              {/* 🔮 Future Projects */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">Future Projects</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {futureProjects.length > 0
                    ? futureProjects.map(renderProjectCard)
                    : noProjectsFallback}
                </div>
              </section>
            </>
          )}
        </div>
      </main>

      <footer className="w-full mt-auto">
        <Footer />
      </footer>
    </div>
  );
};

export default HPRProjectsPublicPage;
