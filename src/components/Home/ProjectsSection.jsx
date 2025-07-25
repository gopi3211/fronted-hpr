import React, { useEffect, useState } from 'react';
import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL;

const ProjectsSection = () => {
  const [projectData, setProjectData] = useState([]);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await axios.get(`${baseURL}/home/projects`);
      setProjectData(res.data.data);
    } catch (err) {
      console.error('Failed to fetch projects:', err);
    }
  };

  return (
    <section className="bg-gradient-to-b from-[#e9f0ea] to-white py-20 px-6 md:px-16">
      <div className="max-w-[1400px] mx-auto">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center text-[#4E7938] mb-16 tracking-tight drop-shadow-sm">
          Our Projects
        </h2>

        <div className="grid gap-10 md:grid-cols-3">
          {projectData.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transform hover:-translate-y-1 transition duration-300 ease-in-out border border-gray-100"
            >
              {/* Project Image */}
              <img
                src={`data:image/jpeg;base64,${project.image}`}
                alt={project.title}
                className="rounded-t-2xl w-full h-60 object-cover"
                loading="lazy"
              />

              {/* Content */}
              <div className="p-6 md:p-8">
                <h3 className="text-2xl font-bold text-[#23424A] mb-3">{project.title}</h3>
                <p className="text-base leading-relaxed text-gray-700 mb-5">
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
      </div>
    </section>
  );
};

export default ProjectsSection;
