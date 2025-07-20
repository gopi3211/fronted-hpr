import React, { useState, useEffect } from "react";
import axios from "axios";

const HeroCarouselCrud = () => {
  const [slides, setSlides] = useState([]);
  const [heading, setHeading] = useState("");
  const [subheading, setSubheading] = useState("");
  const [image, setImage] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const API = import.meta.env.VITE_API_BASE_URL + "/hero-carousel";

  const fetchSlides = async () => {
    try {
      const res = await axios.get(API);
      setSlides(res.data.data);
    } catch (err) {
      console.error("Failed to fetch slides", err);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!heading || !subheading || (!image && !editingId)) {
      alert("All fields are required.");
      return;
    }

    const formData = new FormData();
    formData.append("heading", heading);
    formData.append("subheading", subheading);
    if (image) formData.append("image", image);

    try {
      if (editingId) {
        await axios.put(`${API}/${editingId}`, formData);
        setEditingId(null);
      } else {
        await axios.post(API, formData);
      }

      setHeading("");
      setSubheading("");
      setImage(null);
      fetchSlides();
    } catch (err) {
      console.error("Error submitting form", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/${id}`);
      fetchSlides();
    } catch (err) {
      console.error("Failed to delete", err);
    }
  };

  const handleEdit = (slide) => {
    setEditingId(slide.id);
    setHeading(slide.heading);
    setSubheading(slide.subheading);
  };

  return (
    <div className="pt-32 px-4 bg-gray-50 min-h-screen">
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">All CRUD  </h1>



      <h2 className="text-3xl font-bold text-gray-800 mb-6">Hero Carsouls</h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Heading</label>
            <input
              type="text"
              placeholder="Enter heading"
              value={heading}
              onChange={(e) => setHeading(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-lime-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Subheading</label>
            <input
              type="text"
              placeholder="Enter subheading"
              value={subheading}
              onChange={(e) => setSubheading(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-lime-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              className="w-full"
            />
          </div>

          <button
            type="submit"
            className={`w-full py-2 rounded-md font-semibold text-white ${
              editingId ? "bg-yellow-500 hover:bg-yellow-600" : "bg-green-600 hover:bg-green-700"
            } transition duration-200`}
          >
            {editingId ? "Update Slide" : "Add Slide"}
          </button>
        </form>

        {/* Slide Cards */}
        <h3 className="text-xl font-semibold text-gray-700 mt-10 mb-4">All Slides</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {slides.map((slide) => (
            <div
              key={slide.id}
              className="bg-white rounded-lg shadow-md overflow-hidden transition hover:shadow-lg"
            >
              <img
                src={`data:image/jpeg;base64,${btoa(
                  new Uint8Array(slide.image.data).reduce(
                    (data, byte) => data + String.fromCharCode(byte),
                    ""
                  )
                )}`}
                alt={slide.heading}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h4 className="text-lg font-bold text-gray-800">{slide.heading}</h4>
                <p className="text-gray-600 text-sm mt-1">{slide.subheading}</p>

                <div className="mt-4 flex justify-between">
                  <button
                    onClick={() => handleEdit(slide)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(slide.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};




 
      // <div className="max-w-5xl mx-auto">
       
       
       
       
       
       
       
      //   <h2 className="text-3xl font-bold text-gray-800 mb-6">Projects Section CRUD</h2>



      //   {/* Form */}
      //   <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 space-y-4">
      //     <div>
      //       <label className="block text-gray-700 font-medium mb-1">Title</label>
      //       <input
      //         type="text"
      //         placeholder="Enter project title"
      //         value={title}
      //         onChange={(e) => setTitle(e.target.value)}
      //         className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-lime-500"
      //       />
      //     </div>

      //     <div>
      //       <label className="block text-gray-700 font-medium mb-1">Description</label>
      //       <textarea
      //         placeholder="Enter project description"
      //         value={description}
      //         onChange={(e) => setDescription(e.target.value)}
      //         className="w-full px-4 py-2 border rounded-md h-24 focus:outline-none focus:ring-2 focus:ring-lime-500"
      //       />
      //     </div>

      //     <div>
      //       <label className="block text-gray-700 font-medium mb-1">Image</label>
      //       <input
      //         type="file"
      //         accept="image/*"
      //         onChange={(e) => {
      //           const file = e.target.files[0];
      //           setImage(file);
      //           if (file) setPreviewImage(URL.createObjectURL(file));
      //         }}
      //         className="w-full"
      //       />
      //       {previewImage && (
      //         <img
      //           src={previewImage}
      //           alt="Preview"
      //           className="mt-3 w-full h-48 object-cover rounded"
      //         />
      //       )}
      //     </div>

      //     <button
      //       type="submit"
      //       className={`w-full py-2 rounded-md font-semibold text-white ${
      //         editingId ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-600 hover:bg-green-700'
      //       } transition duration-200`}
      //     >
      //       {editingId ? 'Update Project' : 'Add Project'}
      //     </button>
      //   </form>

      //   {/* Cards */}
      //   <h3 className="text-xl font-semibold text-gray-700 mt-10 mb-4">All Projects</h3>
      //   {loading ? (
      //     <p className="text-gray-600">Loading...</p>
      //   ) : (
      //     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      //       {projects.map((project) => (
      //         <div
      //           key={project.id}
      //           className="bg-white rounded-lg shadow-md overflow-hidden transition hover:shadow-lg"
      //         >
      //           <img
      //             src={`data:image/jpeg;base64,${project.image}`}
      //             alt={project.title}
      //             className="w-full h-48 object-cover"
      //           />
      //           <div className="p-4">
      //             <h4 className="text-lg font-bold text-gray-800">{project.title}</h4>
      //             <p className="text-gray-600 text-sm mt-1">{project.description}</p>

      //             <div className="mt-4 flex justify-between">
      //               <button
      //                 onClick={() => handleEdit(project)}
      //                 className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
      //               >
      //                 Edit
      //               </button>
      //               <button
      //                 onClick={() => handleDelete(project.id)}
      //                 className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
      //               >
      //                 Delete
      //               </button>
      //             </div>
      //           </div>
      //         </div>
      //       ))}
      //     </div>
      //   )}
      // </div>


















export default HeroCarouselCrud;
