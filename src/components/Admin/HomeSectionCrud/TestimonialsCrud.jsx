import React, { useEffect, useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_BASE_URL + "/home/testimonials";

const TestimonialsCrud = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const fetchData = async () => {
    try {
      const res = await axios.get(API);
      setTestimonials(res.data.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !message || (!image && !editingId)) {
      alert("All fields are required.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("message", message);
    if (image) formData.append("image", image);

    try {
      if (editingId) {
        await axios.put(`${API}/${editingId}`, formData);
      } else {
        await axios.post(API, formData);
      }
      resetForm();
      fetchData();
    } catch (err) {
      console.error("Submit error:", err);
    }
  };

  const resetForm = () => {
    setName("");
    setMessage("");
    setImage(null);
    setPreview(null);
    setEditingId(null);
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setName(item.name);
    setMessage(item.message);
    setPreview(`data:image/jpeg;base64,${item.image}`);
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this testimonial?")) {
      await axios.delete(`${API}/${id}`);
      fetchData();
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold text-[#23424A] mb-6">Manage Testimonials</h2>

      {/* Form Section */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end mb-10"
      >
        <div className="flex flex-col">
          <label className="font-semibold mb-1">Name</label>
          <input
            type="text"
            placeholder="Customer name"
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label className="font-semibold mb-1">Message</label>
          <input
            type="text"
            placeholder="Testimonial message"
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label className="font-semibold mb-1">Photo</label>
          <input
            type="file"
            className="border rounded-lg px-3 py-2"
            onChange={handleImageChange}
          />
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="mt-2 h-16 w-16 rounded-full object-cover border"
            />
          )}
        </div>

        <div className="md:col-span-3 flex justify-end mt-4">
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold shadow"
          >
            {editingId ? "Update Testimonial" : "Add Testimonial"}
          </button>
        </div>
      </form>

      {/* Testimonials Grid */}
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {testimonials.map((item) => (
          <div
            key={item.id}
            className="bg-gray-100 p-4 rounded-xl shadow hover:shadow-lg transition-all duration-200"
          >
            <div className="flex items-center gap-3 mb-3">
              <img
                src={`data:image/jpeg;base64,${item.image}`}
                alt={item.name}
                className="w-14 h-14 rounded-full object-cover border"
              />
              <div>
                <h4 className="font-bold text-md">{item.name}</h4>
                <p className="text-sm text-gray-600">{item.message}</p>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => handleEdit(item)}
                className="text-blue-600 hover:underline text-sm font-semibold"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="text-red-600 hover:underline text-sm font-semibold"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestimonialsCrud;
