import React, { useEffect, useState } from "react";
import {
  getAmenitiesByProjectId,
  createAmenities,
  updateAmenities,
  deleteAmenities,
} from "../../../../services/hprProjectsService";
import { toast } from "react-toastify";

const ProjectAmenitiesCrud = ({ selectedProject }) => {
  const [amenitiesId, setAmenitiesId] = useState(null);
  const [infrastructure, setInfrastructure] = useState([{ title: "", description: "" }]);
  const [features, setFeatures] = useState([{ feature: "" }]);

  useEffect(() => {
    if (selectedProject?.id) fetchAmenities();
  }, [selectedProject]);

  const fetchAmenities = async () => {
    try {
      const res = await getAmenitiesByProjectId(selectedProject.id);
      if (res?.length > 0) {
        const data = res[0];
        setAmenitiesId(data.id);
        setInfrastructure(JSON.parse(data.infrastructure));
        setFeatures(JSON.parse(data.features));
      } else {
        setAmenitiesId(null);
        setInfrastructure([{ title: "", description: "" }]);
        setFeatures([{ feature: "" }]);
      }
    } catch (err) {
      toast.error("Failed to fetch amenities");
    }
  };

  const handleInfraChange = (index, key, value) => {
    const updated = [...infrastructure];
    updated[index][key] = value;
    setInfrastructure(updated);
  };

  const handleFeatureChange = (index, value) => {
    const updated = [...features];
    updated[index].feature = value;
    setFeatures(updated);
  };

  const addInfra = () => setInfrastructure([...infrastructure, { title: "", description: "" }]);
  const addFeature = () => setFeatures([...features, { feature: "" }]);

  const removeInfra = (index) => {
    const updated = [...infrastructure];
    updated.splice(index, 1);
    setInfrastructure(updated);
  };

  const removeFeature = (index) => {
    const updated = [...features];
    updated.splice(index, 1);
    setFeatures(updated);
  };

  const handleSave = async () => {
    const payload = {
      project_id: selectedProject.id,
      infrastructure: JSON.stringify(infrastructure),
      features: JSON.stringify(features),
    };

    try {
      if (amenitiesId) {
        await updateAmenities(amenitiesId, payload);
        toast.success("Amenities updated");
      } else {
        await createAmenities(payload);
        toast.success("Amenities added");
      }
      fetchAmenities(); // refresh
    } catch (err) {
      toast.error("Save failed");
    }
  };

  const handleDelete = async () => {
    if (!amenitiesId) return;
    try {
      await deleteAmenities(amenitiesId);
      toast.success("Deleted successfully");
      setAmenitiesId(null);
      setInfrastructure([{ title: "", description: "" }]);
      setFeatures([{ feature: "" }]);
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="p-6 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Manage Amenities</h2>

      <h3 className="text-lg font-semibold mt-4">Infrastructure</h3>
      {infrastructure.map((item, idx) => (
        <div key={idx} className="flex gap-2 mt-2">
          <input
            type="text"
            className="border p-2 w-1/3"
            placeholder="Title"
            value={item.title}
            onChange={(e) => handleInfraChange(idx, "title", e.target.value)}
          />
          <input
            type="text"
            className="border p-2 w-2/3"
            placeholder="Description"
            value={item.description}
            onChange={(e) => handleInfraChange(idx, "description", e.target.value)}
          />
          <button onClick={() => removeInfra(idx)} className="text-red-500">🗑</button>
        </div>
      ))}
      <button onClick={addInfra} className="mt-2 text-green-600">+ Add Infrastructure</button>

      <h3 className="text-lg font-semibold mt-6">Features</h3>
      {features.map((item, idx) => (
        <div key={idx} className="flex gap-2 mt-2">
          <input
            type="text"
            className="border p-2 w-full"
            placeholder="Feature"
            value={item.feature}
            onChange={(e) => handleFeatureChange(idx, e.target.value)}
          />
          <button onClick={() => removeFeature(idx)} className="text-red-500">🗑</button>
        </div>
      ))}
      <button onClick={addFeature} className="mt-2 text-blue-600">+ Add Feature</button>

      <div className="flex gap-4 mt-6">
        <button onClick={handleSave} className="bg-green-600 text-white px-4 py-2 rounded">Save</button>
        {amenitiesId && (
          <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
        )}
      </div>
    </div>
  );
};

export default ProjectAmenitiesCrud;
