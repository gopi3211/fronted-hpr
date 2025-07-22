import React from "react";
import { Link } from "react-router-dom";

const HPRProjectsPublicPage = () => {
  return (
    <div className="pt-24 bg-white min-h-screen">
      {/* 🔶 Banner Image */}
      <div
        className="w-full h-[350px] bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: "url('/ongoing.jpg')" }}
      >
        <h1 className="text-4xl md:text-5xl font-bold text-white bg-black/50 px-6 py-2 rounded-md">
          Our Projects
        </h1>
      </div>

      {/* 🔷 Ongoing Projects */}
      <section className="px-6 py-10">
        <h2 className="text-3xl font-semibold mb-6 text-blue-800">Ongoing Projects</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {/* Project 1 */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden border">
            <img src="/default-image.jpg" alt="Project 1" className="w-full h-40 object-cover" />
            <div className="p-4">
              <h3 className="text-xl font-bold">HPR Avani</h3>
              <p className="text-gray-600">Short description of the project.</p>
              <Link
                to="/project-details/1"
                className="mt-3 inline-block bg-[#a8cf45] text-white px-4 py-2 rounded hover:bg-[#8bbc28]"
              >
                More Details
              </Link>
            </div>
          </div>

          {/* Project 2 */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden border">
            <img src="/default-image.jpg" alt="Project 2" className="w-full h-40 object-cover" />
            <div className="p-4">
              <h3 className="text-xl font-bold">HPR Beachwoods</h3>
              <p className="text-gray-600">Short description of the project.</p>
              <Link
                to="/project-details/2"
                className="mt-3 inline-block bg-[#a8cf45] text-white px-4 py-2 rounded hover:bg-[#8bbc28]"
              >
                More Details
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 🔷 Completed Projects */}
      <section className="px-6 py-10">
        <h2 className="text-3xl font-semibold mb-6 text-blue-800">Completed Projects</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {/* Completed Project */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden border">
            <img src="/completed.jpg" alt="Completed Project" className="w-full h-40 object-cover" />
            <div className="p-4">
              <h3 className="text-xl font-bold">HPR Completed Site</h3>
              <p className="text-gray-600">Completed project description.</p>
              <Link
                to="/project-details/3"
                className="mt-3 inline-block bg-[#a8cf45] text-white px-4 py-2 rounded hover:bg-[#8bbc28]"
              >
                More Details
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HPRProjectsPublicPage;
