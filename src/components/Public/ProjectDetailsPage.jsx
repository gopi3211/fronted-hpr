import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getProjectById,
  getHomeByProjectId,
  getGalleryByProjectId,
  getPlanByProjectId,
  getLocationByProjectId
} from "../../services/hprProjectsService";
import ProjectAmenitiesPublic from "./ProjectAmenitiesPublic"; // ✅ CORRECT

const tabs = ["Home", "Gallery", "Plan", "Location", "Amenities"];

const ProjectDetailsPage = () => {
  const { id } = useParams();
  const [selectedTab, setSelectedTab] = useState("Home");
  const [project, setProject] = useState(null);
  const [home, setHome] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [plan, setPlan] = useState(null);
  const [location, setLocation] = useState([]);

  useEffect(() => {
    fetchAllData();
  }, [id]);

  const fetchAllData = async () => {
    try {
      const [p, h, g, pl, loc] = await Promise.all([
        getProjectById(id),
        getHomeByProjectId(id),
        getGalleryByProjectId(id),
        getPlanByProjectId(id),
        getLocationByProjectId(id)
      ]);

      setProject(p.data);
      setHome(h.data);
      setGallery(g.data);
      setPlan(pl.data);
      setLocation(loc.data || []);
    } catch (err) {
      console.error("Error loading project data:", err);
    }
  };

  const renderTabContent = () => {
    switch (selectedTab) {
      case "Home":
        return home ? (
          <div className="p-4">
            <h2 className="text-2xl font-bold mb-2">{home.title}</h2>
            <p className="mb-4">{home.description}</p>
            {home.image && (
              <img
                src={`data:image/png;base64,${home.image}`}
                alt="Home"
                className="rounded shadow w-full max-w-2xl"
              />
            )}
            {home.brochure_blob && (
              <div className="mt-4">
                <a
                  href={`data:application/pdf;base64,${home.brochure_blob}`}
                  download="brochure.pdf"
                  className="text-blue-600 underline"
                >
                  📄 Download Brochure
                </a>
              </div>
            )}
          </div>
        ) : <p>Loading Home content...</p>;

      case "Gallery":
        return (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4">
            {gallery.map((item, index) => (
              <div key={index} className="border p-2 shadow rounded">
                <img
                  src={`data:image/png;base64,${item.image_blob}`}
                  alt="Gallery"
                  className="w-full h-48 object-cover mb-2 rounded"
                />
                <p className="text-sm text-gray-700">{item.description}</p>
                <p className="text-xs text-gray-500">{item.work_date}</p>
              </div>
            ))}
          </div>
        );

      case "Plan":
        return plan ? (
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2">{plan.description}</h3>
            {plan.plan_blob?.data ? (() => {
              try {
                const base64 = btoa(
                  new Uint8Array(plan.plan_blob.data)
                    .reduce((acc, byte) => acc + String.fromCharCode(byte), "")
                );
                return (
                  <img
                    src={`data:image/png;base64,${base64}`}
                    alt="Plan"
                    className="max-w-full rounded"
                  />
                );
              } catch (err) {
                console.error("Plan image render failed:", err);
                return <p className="text-red-500">Failed to load image</p>;
              }
            })() : (
              <p className="text-gray-500 italic">No plan uploaded.</p>
            )}
          </div>
        ) : <p>Plan not available.</p>;

      case "Location":
        return location && location.length > 0 ? (
          <div className="p-4 space-y-6">
            {location.map((loc) => (
              <div key={loc.id} className="w-full h-96 border rounded overflow-hidden">
                <h3 className="text-lg font-semibold mb-2">{loc.title}</h3>
                <iframe
                  src={loc.map_url}
                  title={`Map-${loc.id}`}
                  className="w-full h-full"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic">Location not available.</p>
        );

      case "Amenities":
        return <ProjectAmenitiesPublic projectId={id} />;

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">
        {project?.name || "Loading..."}
      </h1>

      <div className="flex gap-4 justify-center mb-6 flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 rounded ${
              selectedTab === tab
                ? "bg-blue-600 text-white"
                : "bg-white text-blue-600 border border-blue-600"
            }`}
            onClick={() => setSelectedTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-white rounded shadow">{renderTabContent()}</div>
    </div>
  );
};

export default ProjectDetailsPage;

