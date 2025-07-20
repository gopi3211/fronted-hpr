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
        <h2 className="text-5xl font-extrabold text-center text-[#4E7938] mb-16 tracking-wide">
          Our Projects
        </h2>

        <div className="grid gap-10 md:grid-cols-3">
         {projectData.map((project) => (
  <div key={project.id}

              className="bg-gradient-to-b from-white to-[#F1F5F9] rounded-2xl shadow-xl hover:shadow-2xl hover:scale-[1.02] transform transition duration-300 ease-in-out"
            >
              <img
  src={`data:image/jpeg;base64,${project.image}`}
  alt={project.title}
  className="rounded-t-2xl w-full h-64 object-cover"
/>

              <div className="p-8">
                <h3 className="text-2xl font-bold text-[#23424A] mb-4">{project.title}</h3>
                <p className="text-[16px] leading-relaxed text-gray-800 mb-6">
                  {project.description}
                </p>
                <a href="#" className="text-green-700 font-semibold hover:underline inline-block">
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
