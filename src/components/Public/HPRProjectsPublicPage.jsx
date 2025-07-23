import React, { useEffect, useState } from "react";
import { getAllProjects } from "../../services/hprProjectsService";
import { Link } from "react-router-dom";

const HPRProjectsPublicPage = () => {
  const [ongoingProjects, setOngoingProjects] = useState([]);
  const [completedProjects, setCompletedProjects] = useState([]);
  const [futureProjects, setFutureProjects] = useState([]);
  const [loading, setLoading] = useState(true); // ✅ added

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true); // ✅ start loader
      const res = await getAllProjects();
      const data = res.data;

      const ongoing = data.filter((p) => p.category?.toLowerCase() === "ongoing");
      const completed = data.filter((p) => p.category?.toLowerCase() === "completed");
      const future = data.filter((p) => p.category?.toLowerCase() === "future");

      setOngoingProjects(ongoing);
      setCompletedProjects(completed);
      setFutureProjects(future);
    } catch (err) {
      console.error("Failed to fetch projects", err);
    } finally {
      setLoading(false); // ✅ stop loader
    }
  };

  const renderProjectCard = (project) => {
    const imageSrc = project.logo_blob?.data
      ? `data:image/jpeg;base64,${btoa(
          new Uint8Array(project.logo_blob.data).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ""
          )
        )}`
      : "/placeholder.jpg";

    return (
      <div key={project.id} className="border rounded shadow p-4 w-full sm:w-64 bg-white">
        <img
          src={imageSrc}
          alt={project.name}
          className="w-full h-40 object-cover mb-4 rounded"
        />
        <h2 className="text-xl font-semibold mb-2">{project.name}</h2>
        <p className="text-gray-600 mb-3">{project.short_desc}</p>
        <Link
          to={`/project-details/${project.id}`}
          className="text-blue-600 font-medium hover:underline"
        >
          View More →
        </Link>
      </div>
    );
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-center">Our Projects</h1>

      {loading ? (
<div className="flex justify-center items-center h-40">
  <div className="w-12 h-12 border-4 border-green-500 border-dashed rounded-full animate-spin"></div>
</div>
      ) : (
        <>
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Ongoing Projects</h2>
            <div className="flex flex-wrap gap-6">
              {ongoingProjects.length > 0 ? (
                ongoingProjects.map(renderProjectCard)
              ) : (
                <p>No ongoing projects available.</p>
              )}
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Completed Projects</h2>
            <div className="flex flex-wrap gap-6">
              {completedProjects.length > 0 ? (
                completedProjects.map(renderProjectCard)
              ) : (
                <p>No completed projects available.</p>
              )}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Future Projects</h2>
            <div className="flex flex-wrap gap-6">
              {futureProjects.length > 0 ? (
                futureProjects.map(renderProjectCard)
              ) : (
                <p>No future projects available.</p>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default HPRProjectsPublicPage;
