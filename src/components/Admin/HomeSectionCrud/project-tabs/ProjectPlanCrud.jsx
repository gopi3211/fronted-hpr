import React, { useEffect, useRef, useState } from 'react';
import {
  addPlan,
  getPlanByProjectId,
  deletePlan,
} from '../../../../services/hprProjectsService';

const ProjectPlanCrud = React.memo(({ projectId }) => {
  const [plan, setPlan] = useState(null);
  const [form, setForm] = useState({ description: '', file_url: '' });
  const hasFetched = useRef(false);

  useEffect(() => {
    if (projectId && !hasFetched.current) {
      fetchPlan();
      hasFetched.current = true;
    }
  }, [projectId]);

  const fetchPlan = async () => {
    try {
      const res = await getPlanByProjectId(projectId);
      const data = res.data;

      if (data) {
        setPlan({
          id: data.id,
          description: data.description,
file_url: data.plan_url,        });
      } else {
        setPlan(null);
      }
    } catch (err) {
      console.error('Fetch plan error:', err);
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  const { description, file_url } = form;
  if (!description || !file_url) {
    alert('Both description and file URL are required.');
    return;
  }

  const payload = {
    project_id: projectId,
    description,
    plan_url: file_url, // ✅ backend expects 'plan_url'
  };

  try {
    await addPlan(payload);
    resetForm();
    hasFetched.current = false;
    fetchPlan();
  } catch (err) {
    console.error('Add plan error:', err);
  }
};


  const handleDelete = async () => {
    if (!plan?.id) return;
    try {
      await deletePlan(plan.id);
      setPlan(null);
      resetForm();
      hasFetched.current = false;
    } catch (err) {
      console.error('Delete plan error:', err);
    }
  };

  const resetForm = () => {
    setForm({ description: '', file_url: '' });
  };

  const isPDF = (url = '') => url?.toLowerCase().endsWith('.pdf');

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">📐 Project Plan</h2>

        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Plan Description
            </label>
            <input
              type="text"
              placeholder="Enter plan description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Plan File URL (Image or PDF)
            </label>
            <input
              type="text"
              placeholder="Paste image or PDF URL"
              value={form.file_url}
              onChange={(e) => setForm({ ...form, file_url: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-md"
              required
            />
            {form.file_url && (
              <div className="mt-3">
                {isPDF(form.file_url) ? (
                  <a
                    href={form.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    📄 Preview PDF
                  </a>
                ) : (
                  <img
                    src={form.file_url}
                    alt="Plan Preview"
                    className="w-full h-48 object-contain rounded-md"
                    onError={(e) => {
                      e.target.src = '/default-avatar.png';
                    }}
                  />
                )}
              </div>
            )}
          </div>

          <button
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            type="submit"
          >
            Add Plan
          </button>
        </form>

        {plan && (
          <div className="bg-white p-4 rounded-lg shadow-md relative">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {plan.description}
            </h3>

            {isPDF(plan.file_url) ? (
              <a
                href={plan.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                📄 View PDF Plan
              </a>
            ) : (
              <img
                src={plan.file_url}
                alt="Plan"
                loading="lazy"
                className="w-full h-48 object-contain rounded-md mb-2"
              />
            )}

            <div className="absolute top-3 right-3">
              <button
                onClick={handleDelete}
                className="text-red-600 text-sm font-medium hover:text-red-800"
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

export default ProjectPlanCrud;
