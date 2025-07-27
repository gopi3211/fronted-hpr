import React, { useEffect, useState } from "react";
import { getAmenitiesByProjectId } from "../../services/hprProjectsService";

const ProjectAmenitiesPublic = ({ projectId }) => {
  const [infrastructure, setInfrastructure] = useState([]);
  const [features, setFeatures] = useState([]);

  useEffect(() => {
    if (projectId) {
      fetchAmenities();

      // Optional: auto-refresh every 10s
      const interval = setInterval(fetchAmenities, 10000);
      return () => clearInterval(interval);
    }
  }, [projectId]);

  const fetchAmenities = async () => {
    try {
      const res = await getAmenitiesByProjectId(projectId);
      if (res?.data?.length > 0) {
        const allInfra = [];
        const allFeatures = [];

        res.data.forEach((item) => {
          const infra = safeJsonParse(item.infrastructure);
          const feats = safeJsonParse(item.features);
          if (Array.isArray(infra)) allInfra.push(...infra);
          if (Array.isArray(feats)) allFeatures.push(...feats);
        });

        setInfrastructure(allInfra);
        setFeatures(allFeatures);
      } else {
        setInfrastructure([]);
        setFeatures([]);
      }
    } catch (error) {
      console.error("Failed to load amenities", error);
    }
  };

  const safeJsonParse = (str) => {
    try {
      return JSON.parse(str);
    } catch (err) {
      console.error("JSON parse error:", err);
      return null;
    }
  };

  return (
    <div className="my-10 p-6 bg-gray-50 rounded shadow">
      {/* 🏗️ Infrastructure Section */}
      <h2 className="text-2xl font-bold mb-4">🏗️ Infrastructure</h2>
      {infrastructure.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {infrastructure.map((item, idx) => (
            <div key={idx} className="p-4 bg-white border rounded shadow-sm">
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-sm">No infrastructure details available.</p>
      )}

      {/* ✅ Features Section */}
      <h2 className="text-2xl font-bold mt-8 mb-4">✅ Features</h2>
      {features.length > 0 ? (
        <ul className="list-disc list-inside space-y-1">
          {features.map((item, idx) => (
            <li key={idx} className="text-gray-700">{item.feature}</li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 text-sm">No features listed.</p>
      )}
    </div>
  );
};

export default ProjectAmenitiesPublic;
