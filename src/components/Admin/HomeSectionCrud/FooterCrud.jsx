// ✅ FooterCrud.jsx
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
    logo: null
  });
  const [editingId, setEditingId] = useState(null);

  const fetchFooter = async () => {
    try {
      const res = await axios.get(API);
      setFooter(res.data.data ? [res.data.data] : []);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchFooter();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setForm({ ...form, logo: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.keys(form).forEach((key) => formData.append(key, form[key]));

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
        logo: null
      });
      setEditingId(null);
      fetchFooter();
    } catch (err) {
      console.error("Submit error:", err);
    }
  };

  const handleEdit = (item) => {
    setForm({ ...item, logo: null });
    setEditingId(item.id);
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this footer?")) {
      try {
        await axios.delete(`${API}/${id}`);
        fetchFooter();
      } catch (err) {
        console.error("Delete error:", err);
      }
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-[#23424A] mb-4">Footer Section</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {["tagline", "address", "phone", "email", "facebook", "instagram", "linkedin"].map((field) => (
          <input
            key={field}
            type="text"
            name={field}
            placeholder={field.replace("_", " ")}
            value={form[field] || ""}
            onChange={handleChange}
            className="border p-2 rounded"
          />
        ))}
        <input type="file" accept="image/*" onChange={handleFileChange} className="col-span-full" />
        <button className="bg-green-600 text-white px-4 py-2 rounded-md col-span-full">
          {editingId ? "Update" : "Add"}
        </button>
      </form>

      <div className="space-y-4">
        {footer.map((item) => (
          <div key={item.id} className="p-4 border rounded-lg flex justify-between items-center">
            <div>
              <p className="font-bold">{item.tagline}</p>
              <p>{item.address}</p>
              <p>{item.phone} | {item.email}</p>
              <div className="text-sm text-blue-600 space-x-2">
                <a href={item.facebook} target="_blank">Facebook</a>
                <a href={item.instagram} target="_blank">Instagram</a>
                <a href={item.linkedin} target="_blank">LinkedIn</a>
              </div>
              {item.logo && (
                <img src={`data:image/png;base64,${item.logo}`} alt="logo" className="h-12 mt-2" />
              )}
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(item)} className="text-blue-600 font-semibold">Edit</button>
              <button onClick={() => handleDelete(item.id)} className="text-red-600 font-semibold">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FooterCrud;