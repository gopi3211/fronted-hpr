import React, { useState } from "react";
import ProjectMainCrud from "./project-tabs/ProjectMainCrud";
import ProjectHomeCrud from "./project-tabs/ProjectHomeCrud";
import ProjectGalleryCrud from "./project-tabs/ProjectGalleryCrud";
import ProjectPlanCrud from "./project-tabs/ProjectPlanCrud";
import ProjectLocationCrud from "./project-tabs/ProjectLocationCrud";
import ProjectAmenitiesCrud from "./project-tabs/ProjectAmenitiesCrud";

const tabs = ["PROJECT", "HOME", "GALLERY", "PLAN", "LOCATION", "AMENITIES"];

const HPRProjectsCrudPage = () => {
  const [activeTab, setActiveTab] = useState("PROJECT");
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");

  return (
    <div className="min-h-screen p-6 bg-white">
      <h1 className="text-3xl font-bold text-center text-green-600 mb-6">
        🛠️ HPR Projects Management
      </h1>

      {/* Tabs */}
      <div className="flex flex-wrap gap-4 mb-4 justify-center">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-semibold rounded-md shadow-md transition duration-300 ${
              activeTab === tab
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-green-100"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Category Filter only for PROJECT tab */}
      {activeTab === "PROJECT" && (
        <div className="flex gap-4 justify-center mb-6">
          {["All", "Ongoing", "Completed", "Future"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                selectedCategory === cat
                  ? "bg-green-600 text-white"
                  : "bg-gray-300 text-gray-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Tab Panels */}
      {activeTab === "PROJECT" && (
        <ProjectMainCrud
          onSelectProject={setSelectedProject}
          selectedProject={selectedProject}
          selectedCategory={selectedCategory}
        />
      )}

      {activeTab === "HOME" && selectedProject && (
        <ProjectHomeCrud projectId={selectedProject?.id} />
      )}
      {activeTab === "GALLERY" && selectedProject && (
        <ProjectGalleryCrud projectId={selectedProject?.id} />
      )}
      {activeTab === "PLAN" && selectedProject && (
        <ProjectPlanCrud projectId={selectedProject?.id} />
      )}
      {activeTab === "LOCATION" && selectedProject && (
        <ProjectLocationCrud projectId={selectedProject?.id} />
      )}
      {activeTab === "AMENITIES" && selectedProject && (
        <ProjectAmenitiesCrud projectId={selectedProject?.id} />
      )}

      {!selectedProject && activeTab !== "PROJECT" && (
        <div className="text-center text-red-600 mt-8">
          ⚠️ Please select a project first from the PROJECT tab to continue.
        </div>
      )}
    </div>
  );
};

export default HPRProjectsCrudPage;
