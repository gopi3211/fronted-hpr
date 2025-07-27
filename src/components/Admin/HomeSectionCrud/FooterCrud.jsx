import React, { useEffect, useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_BASE_URL + "/home/footer";

const FooterCrud = () => {
  const [footer, setFooter] = useState([]);
  const [form, setForm] = useState({
    tagline: "",
    address: "",
    phone: "",
    email: "",
    facebook: "",
    instagram: "",
    linkedin: "",
    logo: null,
  });
  const [editingId, setEditingId] = useState(null);
  const [previewLogo, setPreviewLogo] = useState(null);

  const fetchFooter = async () => {
    try {
      const res = await axios.get(API);
      if (res.data && res.data.data) {
        setFooter([res.data.data]);
        setForm({ ...res.data.data, logo: null });
        setEditingId(res.data.data.id);
      
    setPreviewLogo(res.data.data.logo_url || null);



      }
    } catch (err) {
      console.error("[FETCH ERROR] Footer:", err);
    }
  };

  useEffect(() => {
    fetchFooter();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setForm({ ...form, logo: file });
    setPreviewLogo(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.keys(form).forEach((key) => {
        if (key === "logo" && form.logo) {
          formData.append("logo", form.logo);
        } else if (key !== "logo") {
          formData.append(key, form[key]);
        }
      });

      if (editingId) {
        await axios.put(`${API}/${editingId}`, formData);
      } else {
        await axios.post(API, formData);
      }

      setForm({
        tagline: "",
        address: "",
        phone: "",
        email: "",
        facebook: "",
        instagram: "",
        linkedin: "",
        logo: null,
      });
      setPreviewLogo(null);
      setEditingId(null);
      fetchFooter();
    } catch (err) {
      console.error("[SUBMIT ERROR] Footer:", err);
    }
  };

  const handleEdit = (item) => {
    setForm({ ...item, logo: null });
    setEditingId(item.id);
    setPreviewLogo(
      item.logo
        ? `${import.meta.env.VITE_API_BASE_URL}/uploads/footer-logos/${item.logo}`
        : null
    );
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this footer?")) {
      try {
        await axios.delete(`${API}/${id}`);
        fetchFooter();
      } catch (err) {
        console.error("[DELETE ERROR] Footer:", err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Footer Management
        </h2>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-lg p-6 mb-8 grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {["tagline", "address", "phone", "email", "facebook", "instagram", "linkedin"].map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                {field}
              </label>
              <input
                type="text"
                name={field}
                value={form[field] || ""}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md"
              />
            </div>
          ))}

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Logo</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full"
            />
            {previewLogo && (
              <img
                src={previewLogo}
                alt="Logo Preview"
                className="mt-3 w-24 h-12 object-contain rounded-md"
              />
            )}
          </div>

          <button
            type="submit"
            className={`md:col-span-2 py-2 px-4 rounded-md font-semibold text-white ${
              editingId ? "bg-yellow-600" : "bg-green-600"
            }`}
          >
            {editingId ? "Update Footer" : "Add Footer"}
          </button>
        </form>

        {footer.length === 0 ? (
          <p className="text-gray-500 text-sm text-center">No footer data available.</p>
        ) : (
          <div className="space-y-4">
            {footer.map((item) => (
              <div
                key={item.id}
                className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center"
              >
                <div>
                  <p className="text-lg font-semibold text-gray-900">{item.tagline}</p>
                  <p className="text-sm text-gray-600">{item.address}</p>
                  <p className="text-sm text-gray-600">{item.phone} | {item.email}</p>
                  <div className="text-sm text-blue-600 space-x-4 mt-2">
                    {item.facebook && <a href={item.facebook}>Facebook</a>}
                    {item.instagram && <a href={item.instagram}>Instagram</a>}
                    {item.linkedin && <a href={item.linkedin}>LinkedIn</a>}
                  </div>
{item.logo_url && (
  <img
    src={item.logo_url}
    alt="Footer Logo"
    className="mt-3 w-24 h-12 object-contain rounded-md"
  />
)}

                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="bg-blue-600 text-white px-3 py-1 rounded-md"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded-md"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FooterCrud;
