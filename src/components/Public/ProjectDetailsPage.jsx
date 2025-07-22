import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const TABS = ["HOME", "GALLERY", "PLAN", "LOCATION", "AMENITIES"];

const ProjectDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("HOME");

  // ✅ TEMPORARY static project data (replace with dynamic fetch later)
  const project = {
    name: "HPR Avani",
    location: "Kandi, Hyderabad",
    description:
      "Discover plots designed to elevate your lifestyle and offer long-term value. Located near IIT Kandi Hyderabad, this project combines strategic location with thoughtfully planned infrastructure, making it an ideal setting to build your dream home. With all essential amenities in place—from wide roads and underground drainage to electricity and green spaces—this development offers the perfect blend of comfort, convenience, and future growth potential.",
    brochureUrl: "#",
    banner: "/default-image.jpg",
    gallery: [
      {
        date: "2025/27/06",
        images: ["/ongoing.jpg", "/ongoing.jpg", "/ongoing.jpg"],
      },
      {
        date: "2024/03/04",
        images: ["/completed.jpg"],
      },
    ],
    planImage: "/hero2.jpg",
    locationEmbed:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.544587497608!2d78.318748!3d17.436066!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcbf1047f68fdf7%3A0x2fd92c0e9984a0c4!2sHPR%20Avani!5e0!3m2!1sen!2sin!4v1689932437512!5m2!1sen!2sin",
    amenities: [
      "Compound wall",
      "Underground drainage",
      "Water pipeline",
      "Septic tank",
      "Overhead tank / Overhead water tank",
      "Underground electricity and street lights",
      "Cement roads",
      "Rainwater harvesting",
      "Landscaping with greenery",
      "Grand entrance arch",
      "Clubhouse with indoor, outdoor games and swimming pool",
    ],
    features: [
      "HMDA RERA Approved",
      "100% Vaastu compliant",
      "2 mins. away from SRO Sangareddy",
      "5 mins. away from IIT Kandi",
      "10 mins. away from Sangareddy",
    ],
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id, activeTab]);

  return (
    <div className="pt-24 px-6 pb-16 bg-white min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-gray-600 font-semibold text-sm">
          Ongoing Projects / <span className="text-green-600">{project.name}</span>
        </p>
        <button
          onClick={() => navigate("/projects")}
          className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded"
        >
          Back to projects
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 border-b pb-2 mb-8">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`text-sm font-semibold px-4 py-1 border-b-4 transition ${
              activeTab === tab
                ? "border-green-600 text-green-600"
                : "border-transparent text-gray-600 hover:text-green-600"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab: HOME */}
      {activeTab === "HOME" && (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Premium plots in {project.location}
          </h2>
          <p className="text-gray-600 max-w-3xl">{project.description}</p>
          <a
            href={project.brochureUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 font-semibold flex items-center gap-1"
          >
            HPR AVANI BROCHURE <span>📄</span>
          </a>
          <img
            src={project.banner}
            alt="Project Banner"
            className="w-full max-w-sm rounded shadow-md mt-6"
          />
        </div>
      )}

      {/* Tab: GALLERY */}
      {activeTab === "GALLERY" && (
        <div>
          <p className="text-lg font-semibold mb-6">
            Road and Other works at {project.name}
          </p>
          {project.gallery.map((group, i) => (
            <div key={i} className="mb-10">
              <p className="text-green-700 font-medium text-md mb-2">
                Work status as on date {group.date}
              </p>
              <div className="flex gap-4 flex-wrap">
                {group.images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`Gallery ${i}-${index}`}
                    className="w-40 h-40 object-cover rounded shadow"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab: PLAN */}
      {activeTab === "PLAN" && (
        <div className="flex justify-center items-center">
          <img
            src={project.planImage}
            alt="Project Layout Plan"
            className="rounded shadow max-w-full max-h-[600px]"
          />
        </div>
      )}

      {/* Tab: LOCATION */}
      {activeTab === "LOCATION" && (
        <div className="w-full flex justify-center">
          <iframe
            src={project.locationEmbed}
            title="Google Map"
            width="100%"
            height="450"
            allowFullScreen=""
            loading="lazy"
            className="rounded border w-full max-w-5xl"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      )}

      {/* Tab: AMENITIES */}
      {activeTab === "AMENITIES" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-lg font-semibold mb-2">Amenities</h3>
            <ul className="list-disc list-inside text-gray-700">
              {project.amenities.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Features</h3>
            <ul className="list-disc list-inside text-gray-700">
              {project.features.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetailsPage;
