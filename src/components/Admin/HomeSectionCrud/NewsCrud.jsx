import React, { useEffect, useState } from "react";
import {
  getAllNews,
  createNews,
  deleteNews,
  uploadBanner,
  getBanner,
} from "../../../services/newsService";

const NewsCrud = () => {
  const [newsList, setNewsList] = useState([]);
  const [form, setForm] = useState({
    title: "",
    short_description: "",
    full_description: "",
    posted_date: "",
    image_urls: [""], // initialize with one empty field
  });

  const [bannerUrl, setBannerUrl] = useState("");
  const [bannerPreview, setBannerPreview] = useState("");

  const fetchNews = async () => {
    try {
      const res = await getAllNews();
      setNewsList(res.data.data);
    } catch (err) {
      console.error("Fetch news error:", err);
    }
  };

  const handleUploadBanner = async () => {
    if (!bannerUrl) return alert("Please enter a banner URL.");
    try {
      await uploadBanner({ banner_url: bannerUrl });
      alert("Banner uploaded successfully");
      setBannerPreview(`${bannerUrl}?t=${Date.now()}`);
    } catch (err) {
      console.error("Banner upload error:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createNews({
        ...form,
        image_urls: form.image_urls.filter((url) => url.trim() !== ""),
      });
      alert("News added successfully");
      setForm({
        title: "",
        short_description: "",
        full_description: "",
        posted_date: "",
        image_urls: [""],
      });
      fetchNews();
    } catch (err) {
      console.error("Create news error:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNews(id);
      fetchNews();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  useEffect(() => {
    fetchNews();
    (async () => {
      try {
        const res = await getBanner();
        if (res?.data?.banner_url) {
          setBannerUrl(res.data.banner_url);
          setBannerPreview(res.data.banner_url);
        }
      } catch (err) {
        console.error("Banner load error:", err);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow-md">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">News & Updates CRUD</h2>

        {/* Banner Upload Section */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-2">News Banner</h3>
          {bannerPreview && (
            <img
              src={bannerPreview}
              alt="Banner"
              className="w-full max-w-2xl h-60 object-cover rounded-lg border border-gray-200 shadow"
            />
          )}
          <div className="mt-3 flex gap-3 items-center">
            <input
              type="text"
              value={bannerUrl}
              onChange={(e) => setBannerUrl(e.target.value)}
              placeholder="Paste banner image URL"
              className="w-full border rounded px-3 py-2 text-sm"
            />
            <button
              onClick={handleUploadBanner}
              className="bg-lime-600 text-white px-4 py-2 rounded hover:bg-lime-700"
            >
              Upload
            </button>
          </div>
        </div>

        {/* Add News Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full border px-4 py-2 rounded bg-white"
            required
          />
          <input
            type="text"
            placeholder="Short Description"
            value={form.short_description}
            onChange={(e) =>
              setForm({ ...form, short_description: e.target.value })
            }
            className="w-full border px-4 py-2 rounded bg-white"
            required
          />
          <textarea
            placeholder="Full Description"
            value={form.full_description}
            onChange={(e) =>
              setForm({ ...form, full_description: e.target.value })
            }
            className="w-full border px-4 py-3 rounded bg-white resize-none"
            rows={5}
            required
          />
          <input
            type="date"
            value={form.posted_date}
            onChange={(e) =>
              setForm({ ...form, posted_date: e.target.value })
            }
            className="w-full border px-4 py-2 rounded bg-white"
            required
          />

          {/* Dynamic Image URLs */}
          <div className="space-y-2">
            <label className="block font-medium text-sm text-gray-700">
              News Image URLs
            </label>
            {form.image_urls.map((url, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <input
                  type="text"
                  value={url}
                  onChange={(e) => {
                    const newUrls = [...form.image_urls];
                    newUrls[idx] = e.target.value;
                    setForm({ ...form, image_urls: newUrls });
                  }}
                  placeholder={`Image URL ${idx + 1}`}
                  className="flex-1 border px-3 py-2 rounded text-sm"
                />
                <button
                  type="button"
                  onClick={() => {
                    const newUrls = form.image_urls.filter((_, i) => i !== idx);
                    setForm({ ...form, image_urls: newUrls });
                  }}
                  className="text-red-600 text-sm"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                setForm({ ...form, image_urls: [...form.image_urls, ""] })
              }
              className="text-sm text-blue-600 mt-1"
            >
              + Add Image URL
            </button>
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
          >
            Add News
          </button>
        </form>
      </div>

      {/* News List */}
      <div className="max-w-4xl mx-auto mt-10 bg-white p-6 rounded-2xl shadow-md">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">All News Entries</h3>
        {newsList.length === 0 ? (
          <p className="text-gray-500 text-center">No news added yet.</p>
        ) : (
          <div className="space-y-4">
            {newsList.map((item) => (
              <div
                key={item.id}
                className="p-4 bg-gray-50 border border-gray-200 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center"
              >
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">{item.title}</h4>
                  <p className="text-sm text-gray-600">{item.short_description}</p>
                  <p className="text-sm text-gray-500 mt-1">📅 {item.posted_date}</p>
                </div>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="mt-3 sm:mt-0 bg-red-600 text-white text-sm px-4 py-2 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsCrud;
