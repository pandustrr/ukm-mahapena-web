import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Editor } from "@tinymce/tinymce-react";
import { API_URL } from "../../config/api"; 

import "tinymce/tinymce"; // core
import "tinymce/icons/default";
import "tinymce/themes/silver";
import "tinymce/models/dom";

// Plugins
import "tinymce/plugins/advlist";
import "tinymce/plugins/autolink";
import "tinymce/plugins/lists";
import "tinymce/plugins/link";
import "tinymce/plugins/image";
import "tinymce/plugins/charmap";
import "tinymce/plugins/preview";
import "tinymce/plugins/anchor";
import "tinymce/plugins/searchreplace";
import "tinymce/plugins/visualblocks";
import "tinymce/plugins/code";
import "tinymce/plugins/fullscreen";
import "tinymce/plugins/insertdatetime";
import "tinymce/plugins/media";
import "tinymce/plugins/table";
import "tinymce/plugins/help";
import "tinymce/plugins/wordcount";
import { Upload } from "lucide-react";

function CreateBlog() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [status, setStatus] = useState("draft");
  const [featuredImage, setFeaturedImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const MySwal = withReactContent(Swal);
  const navigate = useNavigate();
  const token = sessionStorage.getItem("adminToken");

  // ambil kategori dari API
  const handleCancle = () => {
    MySwal.fire({
      title: "Apakah Anda yakin?",
      text: "Anda tidak akan bisa mengembalikan ini!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, batal!",
    }).then((result) => {
      if (result.isConfirmed) {
        MySwal.fire("Dibatalkan!", "Perubahan tidak disimpan.", "success");
        navigate("/admin/dashboard", { state: { page: "blog" } });
      }
    });
  };

  const createExcerpt = (text, wordLimit = 20) => {
    // hapus semua tag html
    const cleanText = text.replace(/<[^>]+>/g, "");

    const words = cleanText.split(" ").filter((w) => w.trim() !== "");
    return (
      words.slice(0, wordLimit).join(" ") +
      (words.length > wordLimit ? "..." : "")
    );
  };

  useEffect(() => {
    axios
      .get(`${API_URL}/admin/blog-categories`)
      .then((res) => setCategories(res.data.data || res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFeaturedImage(file);

    if (file) {
      setPreview(URL.createObjectURL(file)); // bikin URL sementara
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("excerpt", createExcerpt(content, 10));
      formData.append("category_id", categoryId);
      formData.append("author_id", token);
      formData.append("status", status);
      if (featuredImage) {
        formData.append("featured_image", featuredImage);
      }
      formData.append("meta_title", title);
      formData.append("meta_description", createExcerpt(content, 20));

      const res = await axios.post(
        `${API_URL}/admin/blogs`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("Blog berhasil ditambahkan!");
      MySwal.fire("Ditambahkan!", message, "success");
      navigate("/admin/dashboard", { state: { page: "blog" } });

      // reset form
      setTitle("");
      setContent("");
      setCategoryId("");
      setStatus("draft");
      setFeaturedImage(null);
    } catch (err) {
      console.error(err);
      setMessage("Gagal menambahkan blog");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white p-8 rounded-2xl">
      {/* Header */}
      <div className="border-b pb-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Tambah Blog</h1>
        <p className="text-gray-500 text-sm mt-1 capitalize">
          Lengkapi form berikut untuk menambahkan blog baru
        </p>
      </div>

      {message && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 text-blue-700 rounded-md">
          {message}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} method="POST" className="space-y-6">
        {/* Judul */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Judul
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Masukkan judul blog..."
            className="w-full border-gray-300 rounded-lg p-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder:text-black"
          />
        </div>
        {/* // apiKey="g439ip37desi0389rkv49zztfy42nk9kik6fun5x3ii2dpf6" // bisa
        pakai gratis, atau daftar untuk API key */}
        <div>
          <label className="block font-medium mb-2">Konten</label>
          <Editor
            value={content}
            onEditorChange={(newContent) => setContent(newContent)}
            tinymceScriptSrc={"/tinymce/tinymce.min.js"}
            init={{
              license_key: "gpl",
              height: 400,
              base_url: "/tinymce",
              suffix: ".min",
              menubar: true,
              plugins:
                "advlist autolink lists link image charmap preview anchor " +
                "searchreplace visualblocks code fullscreen " +
                "insertdatetime media table help wordcount",
              toolbar:
                "undo redo | formatselect | bold italic backcolor | " +
                "alignleft aligncenter alignright alignjustify | " +
                "bullist numlist outdent indent | removeformat | help",
              skin_url: "/tinymce/skins/ui/oxide",
              content_css: "/tinymce/skins/content/default/content.css",
            }}
          />
        </div>
        {/* Kategori & Status */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kategori
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full border-gray-300 rounded-lg p-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">Pilih kategori</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border-gray-300 rounded-lg p-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>
        {/* Upload Gambar */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Featured Image
          </label>
          {/* <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-1xl py-2 px-4 mt-2 text-sm rounded-md text-gray-600 focus:ring-blue-500"
          />
          {preview && (
            <div className="mt-4">
              <p className="text-gray-600 text-sm mb-2">Preview:</p>
              <div className="rounded-lg p-2 inline-block bg-gray-50">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-56 rounded-lg shadow-md"
                />
              </div>
            </div>
          )} */}
          <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors duration-200">
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-4 text-gray-500">
                <Upload size={24} />
                <span className="text-xs mt-1">Upload Gambar</span>
              </div>
            )}
            <input
              type="file"
              name="featured_image"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>
        {/* Tombol Aksi */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 text-white px-5 py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Menyimpan..." : "Simpan"}
          </button>
          <button
            type="button"
            onClick={handleCancle}
            className="flex-1 bg-gray-100 text-gray-700 px-5 py-3 rounded-lg font-medium hover:bg-gray-200 transition"
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateBlog;
