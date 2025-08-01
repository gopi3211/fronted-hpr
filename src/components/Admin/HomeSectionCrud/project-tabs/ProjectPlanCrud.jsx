import React, { useEffect, useRef, useState } from 'react';
import {
  addPlan,
  getPlanByProjectId,
  deletePlan,
} from '../../../../services/hprProjectsService';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const ProjectPlanCrud = React.memo(({ projectId }) => {
  const [plan, setPlan] = useState(null);
  const [form, setForm] = useState({ description: '', file_url: '' });
  const hasFetched = useRef(false);
  const navigate = useNavigate();

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
          file_url: data.plan_url,
        });
      } else {
        setPlan(null);
      }
    } catch (err) {
      toast.error('Failed to fetch plan');
      console.error('Fetch plan error:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { description, file_url } = form;

    if (!description || !file_url) {
      toast.error('Both description and file URL are required.');
      return;
    }

    const payload = {
      project_id: projectId,
      description,
      plan_url: file_url,
    };

    try {
      await addPlan(payload);
      toast.success('Plan added successfully!');
      resetForm();
      hasFetched.current = false;
      fetchPlan();
    } catch (err) {
      toast.error('Add plan failed');
      console.error('Add plan error:', err);
    }
  };

  const handleDelete = async () => {
    if (!plan?.id) return;
    try {
      await deletePlan(plan.id);
      toast.success('Plan deleted');
      setPlan(null);
      resetForm();
      hasFetched.current = false;
    } catch (err) {
      toast.error('Delete failed');
      console.error('Delete plan error:', err);
    }
  };

  const resetForm = () => {
    setForm({ description: '', file_url: '' });
  };

  const isPDF = (url = '') => url?.toLowerCase().endsWith('.pdf');

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-lime-50 to-cyan-50 py-10 px-4 sm:px-6 lg:px-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-xl p-6">
        <motion.button
          onClick={() => navigate(-1)}
          className="mb-6 text-cyan-700 hover:text-cyan-900 flex items-center font-semibold"
          whileHover={{ scale: 1.05 }}
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </motion.button>

        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">📐 Project Plan</h2>

        <form onSubmit={handleSubmit} className="space-y-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Plan Description</label>
            <input
              type="text"
              placeholder="Enter plan description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-4 py-2 border border-cyan-200 rounded-lg shadow-sm focus:ring-2 focus:ring-cyan-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Plan File URL (PDF or Image)</label>
            <input
              type="text"
              placeholder="Paste file URL"
              value={form.file_url}
              onChange={(e) => setForm({ ...form, file_url: e.target.value })}
              className="w-full px-4 py-2 border border-cyan-200 rounded-lg shadow-sm focus:ring-2 focus:ring-cyan-500"
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
                    onError={(e) => (e.target.src = '/default-image.jpg')}
                  />
                )}
              </div>
            )}
          </div>

          <motion.button
            className="px-6 py-2 bg-green-600 text-white rounded-full shadow-md hover:bg-green-700 transition"
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Add Plan
          </motion.button>
        </form>

        {plan && (
          <motion.div
            className="bg-white p-4 rounded-lg shadow-md relative"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
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

            <button
              onClick={handleDelete}
              className="absolute top-3 right-3 text-red-600 text-sm font-medium hover:text-red-800"
            >
              Delete
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
});

export default ProjectPlanCrud;
