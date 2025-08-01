import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL;

const ProjectsSection = React.memo(() => {
  const [projectData, setProjectData] = useState([]);
  const [loading, setLoading] = useState(true);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!hasFetched.current) {
      fetchProjects();
      hasFetched.current = true;
    }
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await axios.get(`${baseURL}/home/projects`, { timeout: 5000 });
      setProjectData(res.data.data);
    } catch (err) {
      console.error('[ProjectsSection] Failed to fetch projects:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-gradient-to-b from-[#e9f0ea] to-white py-20 px-6 md:px-16">
      <div className="max-w-[1400px] mx-auto">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center text-[#4E7938] mb-16 tracking-tight drop-shadow-sm animate-fade-in-up">
          Our Projects
        </h2>

        {loading ? (
          <div className="grid md:grid-cols-3 gap-10">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-md p-6 h-[340px] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid gap-10 md:grid-cols-3">
            {projectData.map((project) => (
              <div
                key={project.id}
                className="bg-white/80 backdrop-blur-md rounded-2xl shadow-md hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 ease-in-out border border-gray-100 animate-fade-in-up"
              >
                {project.image ? (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-48 object-cover rounded-t-2xl"
                    loading="lazy"
                    onLoad={() => console.log(`[Image Loaded] ${project.image}`)}
                    onError={(e) => {
                      console.error(`[Image Load ERROR] ${project.image}`);
                      e.target.src = 'https://via.placeholder.com/300x200?text=Image+Error';
                    }}
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500 text-sm rounded-t-2xl">
                    No Image
                  </div>
                )}

                <div className="p-6 md:p-8">
                  <h3 className="text-2xl font-bold text-[#23424A] mb-3 line-clamp-1">
                    {project.title}
                  </h3>
                  <p className="text-base text-gray-700 leading-relaxed line-clamp-3 mb-5">
                    {project.description}
                  </p>
                  <a
                    href="#"
                    className="text-[#4E7938] font-semibold hover:underline inline-block transition"
                  >
                    Continue →
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
});

export default ProjectsSection;
