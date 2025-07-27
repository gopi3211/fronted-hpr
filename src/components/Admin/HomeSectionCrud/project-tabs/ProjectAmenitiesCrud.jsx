import React, { useEffect, useState, useRef } from "react";
import {
  getAmenitiesByProjectId,
  createAmenities, // ✅ CORRECT function
} from "../../../../services/hprProjectsService";

const ProjectAmenitiesCrud = React.memo(({ projectId }) => {
  const [infrastructure, setInfrastructure] = useState([]);
  const [features, setFeatures] = useState([]);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!projectId) {
      console.error("❌ Project ID missing");
      return;
    }

    if (!hasFetched.current) {
      console.log("✅ Fetching amenities for Project ID:", projectId);
      fetchData();
      hasFetched.current = true;
    }
  }, [projectId]);

const fetchData = async () => {
  try {
    const res = await getAmenitiesByProjectId(projectId);
    if (Array.isArray(res.data)) {
      const infra = [];
      const feats = [];

      res.data.forEach((entry) => {
        if (entry.infrastructure) {
          infra.push(...JSON.parse(entry.infrastructure));
        }
        if (entry.features) {
          feats.push(...JSON.parse(entry.features));
        }
      });

      setInfrastructure(infra);
      setFeatures(feats);
    }
  } catch (err) {
    console.error("Error fetching amenities:", err);
  }
};


  const handleAddInfrastructure = () => {
    setInfrastructure([...infrastructure, { title: "", description: "" }]);
  };

  const handleAddFeature = () => {
    setFeatures([...features, { feature: "" }]);
  };

  const handleInfraChange = (index, field, value) => {
    const updated = [...infrastructure];
    updated[index][field] = value;
    setInfrastructure(updated);
  };

  const handleFeatureChange = (index, value) => {
    const updated = [...features];
    updated[index].feature = value;
    setFeatures(updated);
  };

  const handleInfraDelete = (index) => {
    const updated = [...infrastructure];
    updated.splice(index, 1);
    setInfrastructure(updated);
  };

  const handleFeatureDelete = (index) => {
    const updated = [...features];
    updated.splice(index, 1);
    setFeatures(updated);
  };



const handleSave = async () => {
  if (!projectId) {
    console.error("❌ Project ID is missing");
    return;
  }

  console.log("✅ Save clicked with Project ID:", projectId);

  const payload = {
    project_id: projectId,
    infrastructure,
    features,
  };

  try {
    await createAmenities(payload); // ✅ Send complete payload
    alert("Saved successfully");
    await fetchData(); // ✅ Re-fetch data so form shows updated items
  } catch (err) {
    console.error("❌ Save failed:", err);
  }
};



  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold mb-4">🏗️ Manage Amenities</h2>

      <div>
        <h3 className="font-bold mb-2">Infrastructure</h3>
        {infrastructure.map((item, index) => (
          <div key={index} className="flex gap-3 mb-2">
            <input
              type="text"
              placeholder="Enter title"
              value={item.title}
              onChange={(e) =>
                handleInfraChange(index, "title", e.target.value)
              }
              className="border p-2 w-1/2"
            />
            <input
              type="text"
              placeholder="Enter description"
              value={item.description}
              onChange={(e) =>
                handleInfraChange(index, "description", e.target.value)
              }
              className="border p-2 w-1/2"
            />
            <button
              onClick={() => handleInfraDelete(index)}
              className="text-white bg-black px-3 py-1"
            >
              🗑️
            </button>
          </div>
        ))}
        <button
          onClick={handleAddInfrastructure}
          className="bg-green-900 text-white px-4 py-2 mt-2"
        >
          + Add Infrastructure
        </button>
      </div>

      <div>
        <h3 className="font-bold mb-2">Features</h3>
        {features.map((item, index) => (
          <div key={index} className="flex gap-3 mb-2">
            <input
              type="text"
              placeholder="Enter feature"
              value={item.feature}
              onChange={(e) => handleFeatureChange(index, e.target.value)}
              className="border p-2 w-full"
            />
            <button
              onClick={() => handleFeatureDelete(index)}
              className="text-white bg-black px-3 py-1"
            >
              🗑️
            </button>
          </div>
        ))}
        <button
          onClick={handleAddFeature}
          className="bg-blue-900 text-white px-4 py-2 mt-2"
        >
          + Add Feature
        </button>
      </div>

      <button
        onClick={handleSave}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
      >
        Save
      </button>
    </div>
  );
});

export default ProjectAmenitiesCrud;
