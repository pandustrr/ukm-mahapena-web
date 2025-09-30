import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Upload } from "lucide-react";
import {API_URL} from "../../config/api"; 

function CreateProker() {
  const [nama, setNama] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [status, setStatus] = useState("");
  const [featuredImage, setFeaturedImage] = useState(null);

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
        navigate("/admin/dashboard", { state: { page: "proker" } });
      }
    });
  };

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
      formData.append("nama", nama);
      formData.append("deskripsi", deskripsi);
      formData.append("tanggal", tanggal);
      formData.append("status", status);

      if (featuredImage) {
        formData.append("featured_image", featuredImage);
      }

      const res = await axios.post(
        `${API_URL}/admin/proker`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("Proker berhasil ditambahkan!");
      MySwal.fire("Ditambahkan!", "Proker berhasil ditambahkan!", "success");
      navigate("/admin/dashboard", { state: { page: "proker" } });

      // reset form
      setTitle("");
      setContent("");
      setFeaturedImage(null);
    } catch (err) {
      console.error(err);
      setMessage("Gagal menambahkan blog");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-2 bg-white p-8 rounded-2xl">
      {/* Header */}
      <div className="border-b pb-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Tambah Program Kerja
        </h1>
        <p className="text-gray-500 text-sm mt-1 capitalize">
          Lengkapi form berikut untuk menambahkan program kerja baru
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
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            placeholder="Masukkan nama proker..."
            className="w-full border-gray-300 rounded-lg p-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder:text-black"
          />
        </div>

        {/* Konten */}
        <div>
          <label className="block font-medium mb-2">Deskripsi</label>
          <textarea
            value={deskripsi}
            onChange={(e) => setDeskripsi(e.target.value)}
            rows="6"
            placeholder="Tulis deskripsi program kerja di sini..."
            className="w-full border-gray-300 rounded-lg p-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder:text-black"
          />
        </div>

        {/* Tanggal */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tanggal
          </label>
          <input
            type="date"
            value={tanggal}
            onChange={(e) => setTanggal(e.target.value)}
            className="w-full border-gray-300 rounded-lg p-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder:text-black"
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Kategori
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full border-gray-300 rounded-lg p-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="" disabled>
              Pilih Status
            </option>
            <option value="pending">Pending</option>
            <option value="berjalan">Berjalan</option>
            <option value="selesai">Selesai</option>
          </select>
        </div>

        {/* Upload Gambar */}
        {/* <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Featured Image
          </label>
          <input
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
          )}
        </div> */}

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

export default CreateProker;
