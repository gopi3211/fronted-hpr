import React, { useEffect, useState } from 'react';
import {
  addPlan,
  getPlanByProjectId,
  updatePlan,
  deletePlan,
} from '../../../../services/hprProjectsService';

const ProjectPlanCrud = ({ projectId }) => {
  const [plan, setPlan] = useState(null);
  const [form, setForm] = useState({ description: '', file: null });
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (projectId) fetchPlan();
  }, [projectId]);

  const fetchPlan = async () => {
    try {
      const res = await getPlanByProjectId(projectId);
      const data = res.data;

      if (data) {
        let base64Image = null;

        if (data.plan_blob?.data) {
          const uint8Array = new Uint8Array(data.plan_blob.data);
          const binary = uint8Array.reduce((acc, byte) => acc + String.fromCharCode(byte), '');
          base64Image = `data:image/jpeg;base64,${btoa(binary)}`;
        }

        setPlan({
          id: data.id,
          description: data.description,
          image_url: base64Image,
        });
      } else {
        setPlan(null);
      }
    } catch (err) {
      console.error('Fetch plan error:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.description || !projectId || (!form.file && !editing)) {
      alert('All fields required');
      return;
    }

    const formData = new FormData();
    formData.append('description', form.description);
    if (form.file) formData.append('plan', form.file);
    if (!editing) formData.append('project_id', projectId);

    try {
      if (editing && plan?.id) {
        await updatePlan(plan.id, formData);
      } else {
        await addPlan(formData);
      }
      resetForm();
      fetchPlan();
    } catch (err) {
      console.error('Submit error:', err);
    }
  };

  const handleDelete = async () => {
    if (!plan?.id) return;
    try {
      await deletePlan(plan.id);
      setPlan(null);
      resetForm();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleEdit = () => {
    setForm({ description: plan.description, file: null });
    setEditing(true);
  };

  const resetForm = () => {
    setForm({ description: '', file: null });
    setEditing(false);
  };

  return (
    <div className="bg-gray-100 p-6 rounded shadow mt-10">
      <h2 className="text-xl font-bold mb-4 text-green-700">📐 Project Plan</h2>

      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <input
          type="text"
          placeholder="Plan Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="file"
          accept="image/*,.pdf"
          onChange={(e) => setForm({ ...form, file: e.target.files[0] })}
          className="w-full"
        />
        <button className="bg-green-600 text-white px-4 py-2 rounded" type="submit">
          {editing ? 'Update Plan' : 'Add Plan'}
        </button>
      </form>

      {plan && (
        <div className="bg-white p-4 rounded shadow relative">
          <h3 className="font-semibold mb-2">{plan.description}</h3>
          {plan.image_url ? (
            <img
              src={plan.image_url}
              alt="Plan"
              className="w-full h-48 object-cover rounded"
            />
          ) : (
            <p className="text-gray-500 text-sm">No image available</p>
          )}
          <div className="absolute top-2 right-2 flex gap-2">
            <button
              onClick={handleEdit}
              className="text-blue-600 text-sm font-medium"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="text-red-600 text-sm font-medium"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectPlanCrud;
