import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getProjectById,
  getHomeByProjectId,
  getGalleryByProjectId,
  getPlanByProjectId,
  getLocationByProjectId
} from "../../services/hprProjectsService";
import ProjectAmenitiesPublic from "./ProjectAmenitiesPublic";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const IMAGE_BASE_URL = API_BASE_URL.replace("/api/v1", "");
const tabs = ["Home", "Gallery", "Plan", "Location", "Amenities"];

const ProjectDetailsPage = () => {
  const { id } = useParams();
  const [selectedTab, setSelectedTab] = useState("Home");
  const [project, setProject] = useState(null);
  const [home, setHome] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [plan, setPlan] = useState(null);
  const [location, setLocation] = useState([]);
  const [loading, setLoading] = useState(true);

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
    } finally {
      setLoading(false);
    }
  };

  const renderTabContent = () => {
    switch (selectedTab) {
      case "Home":
        return home ? (
          <div className="bg-white py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                Home Section
              </h2>
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{home.title}</h3>
                <p className="text-lg text-gray-600 mb-4">{home.description}</p>

                {home.image_filename && (
                <img
  src={`${IMAGE_BASE_URL}/uploads/project-images/${home.image_filename}`}
  alt="Home"
  className="w-full max-w-2xl h-auto rounded-md shadow-sm mx-auto"
  loading="lazy"
/>

                )}

                {home.brochure_filename && (
                  <div className="mt-4 text-center">
<a
  href={`${IMAGE_BASE_URL}/uploads/project-brochures/${home.brochure_filename}`}
  download="brochure.pdf"

                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition-colors duration-200"
                    >
                      📄 Download Brochure
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">Loading Home content...</p>
        );

     case "Gallery":
  return (
    <div className="bg-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          Gallery Section
        </h2>
        {gallery.length === 0 ? (
          <p className="text-gray-500 text-sm text-center">No gallery items available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {gallery.map((item, index) => {
              const baseURL = API_BASE_URL.replace("/api/v1", "");
              const imageURL = item.image_filename
                ? `${baseURL}/uploads/project-images/${item.image_filename}`
                : "/default-image.jpg";

              console.log("📷 GALLERY IMG URL:", imageURL); // ✅ debug

              return (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-md p-4 hover:shadow-xl transition-all duration-300"
                >
                  <img
                    src={imageURL}
                    alt="Gallery"
                    className="w-full h-48 object-cover rounded-md mb-3"
                    loading="lazy"
                  />
                  <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
                  <p className="text-xs text-gray-500 mt-1">{item.work_date}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );


      case "Plan":
        return plan ? (
          <div className="bg-white py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                Plan Section
              </h2>
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{plan.description}</h3>
                {plan.plan_filename ? (
           <img
  src={`${IMAGE_BASE_URL}/uploads/project-images/${plan.plan_filename}`}
                    alt="Plan"
                    className="w-full max-w-2xl h-auto rounded-md shadow-sm mx-auto"
                    loading="lazy"
                  />
                ) : (
                  <p className="text-gray-500 text-sm text-center italic">No plan uploaded.</p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-sm text-center py-8 italic">Plan not available.</p>
        );

      case "Location":
        return location && location.length > 0 ? (
          <div className="bg-white py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                Location Section
              </h2>
              <div className="space-y-6">
                {location.map((loc) => (
                  <div key={loc.id} className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{loc.title}</h3>
                    <div className="w-full h-96 rounded-md overflow-hidden">
                      <iframe
                        src={loc.map_url}
                        title={`Map-${loc.id}`}
                        className="w-full h-full"
                        loading="lazy"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-sm text-center py-8 italic">Location not available.</p>
        );

      case "Amenities":
        return (
          <div className="bg-white py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                Amenities Section
              </h2>
              <ProjectAmenitiesPublic projectId={id} />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-white pt-24">
        <DotLottieReact
          src="https://lottie.host/89abc775-d6a9-4278-91e8-93588bb9b5a3/GZ2c5sHZ6m.lottie"
          autoplay
          loop
          style={{ width: 150, height: 150 }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          {project?.name || "Loading Project..."}
        </h1>

        <div className="flex gap-3 justify-center mb-8 flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 text-sm font-semibold rounded-md shadow-sm transition-colors duration-200 ${
                selectedTab === tab
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-blue-50"
              }`}
              onClick={() => setSelectedTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-md">{renderTabContent()}</div>
      </div>
    </div>
  );
};

export default ProjectDetailsPage;
