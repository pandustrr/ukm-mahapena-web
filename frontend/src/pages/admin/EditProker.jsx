import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Editor } from "@tinymce/tinymce-react";

function EditProker() {
    const [nama, setNama] = useState("");
    const [deskripsi, setDeskripsi] = useState("");
    const [tanggal, setTanggal] = useState("");
    const [status, setStatus] = useState("");
    const [featuredImage, setFeaturedImage] = useState(null);

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [preview, setPreview] = useState(null);
    const { id } = useParams();
    const [form, setForm] = useState({
        nama: "",
        deskripsi: "",
        tanggal: "",
        status: "",
        image: null, // simpan file
    });

    const MySwal = withReactContent(Swal);
    const navigate = useNavigate();

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

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const res = await axios.get(`http://localhost:8000/api/proker/${id}`);
                const proker = res.data;
                console.log(proker);
                setForm({
                    nama: proker.nama || "",
                    deskripsi: proker.deskripsi || "",
                    tanggal: proker.tanggal || "",
                    status: proker.status || "",
                });
                // set preview ke gambar lama
                if (proker.featured_image) {
                    setPreview(`http://localhost:8000/storage/${proker.featured_image}`);
                }
            } catch (err) {
                console.error("Gagal mengambil data proker", err);
            }
        };

        fetchBlog();
    }, [id]);

    const handleChange = (e) => {
        if (!e || !e.target) return;

        const { name, value, type, files } = e.target;

        if (type === "file") {
            setFeaturedImage(files && files[0]);
            setPreview(URL.createObjectURL(files[0])); // buat preview
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }
    };

    //   const handleFileChange = (e) => {
    //     const file = e.target.files[0];
    //     setFeaturedImage(file);

    //     if (file) {
    //       setPreview(URL.createObjectURL(file)); // bikin URL sementara
    //     } else {
    //       setPreview(null);
    //     }
    //   };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = new FormData();
            payload.append("nama", form.nama);
            payload.append("deskripsi", form.deskripsi);
            payload.append("tanggal", form.tanggal);
            payload.append("status", form.status);

            if (featuredImage) {
                payload.append("featured_image", featuredImage);
            }

            // gunakan method override supaya Laravel menerima sebagai PUT
            payload.append("_method", "PUT");

            await axios.post(`http://localhost:8000/api/proker/${id}`, payload, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            // kembalikan ke Admin Dashboard dan render page 'blog'
            // jika kamu pakai state (setActivePage) pas di parent, gunakan itu:
            if (typeof setActivePage === "function") {
                setActivePage("blog");
            } else {
                // fallback: gunakan navigate dengan state
                navigate("/admin/dashboard", { state: { page: "proker" } });
            }

            setMessage("Proker berhasil diubah!");
            MySwal.fire("Diubah!", "Proker berhasil diubah!", "success");
            navigate("/admin/dashboard", { state: { page: "proker" } });
        } catch (err) {
            console.error(err);
            setMessage("Gagal Mengubah Proker");
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
                        name="nama"
                        value={form.nama}
                        onChange={handleChange}
                        placeholder="Masukkan nama proker..."
                        className="w-full border-gray-300 rounded-lg p-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder:text-black"
                    />
                </div>

                {/* Konten */}
                <div>
                    <label className="block font-medium mb-2">Deskripsi</label>
                    <textarea
                        value={form.deskripsi}
                        name="deskripsi"
                        onChange={handleChange}
                        rows="6"
                        placeholder="Tulis deskrip program kerja di sini..."
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
                        name="tanggal"
                        value={form.tanggal}
                        onChange={handleChange}
                        className="w-full border-gray-300 rounded-lg p-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder:text-black"
                    />
                </div>

                {/* Status */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Kategori
                    </label>
                    <select
                        value={form.status}
                        name="status"
                        onChange={handleChange}
                        className="w-full border-gray-300 rounded-lg p-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                        <option value="" disabled>
                            Pilih Status
                        </option>
                        <option value="Pending">Pending</option>
                        <option value="Berjalan">Berjalan</option>
                        <option value="Selesai">Selesai</option>
                    </select>
                </div>

                {/* Upload Gambar */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Featured Image
                    </label>
                    <input
                        type="file"
                        name="featured_image"
                        accept="image/*"
                        onChange={handleChange}
                        className="w-1xl py-2 px-4 mt-2 text-sm rounded-md text-gray-600 focus:ring-blue-500"
                    />
                    {/* Preview */}
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

export default EditProker;
