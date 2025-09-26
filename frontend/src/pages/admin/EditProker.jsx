import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { ArrowLeft, Save, X, Upload, Calendar, FileText, AlertTriangle, Image } from "lucide-react";

function EditProker() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [preview, setPreview] = useState(null);
    const [featuredImage, setFeaturedImage] = useState(null);
    const { id } = useParams();
    
    const [form, setForm] = useState({
        nama: "",
        deskripsi: "",
        tanggal: "",
        status: "",
    });

    // Modal states
    const [showCancelModal, setShowCancelModal] = useState(false);

    const MySwal = withReactContent(Swal);
    const token = sessionStorage.getItem("adminToken");
    const navigate = useNavigate();

    // Modal Component
    const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, isLoading }) => {
        if (!isOpen) return null;

        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div 
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
                    onClick={onClose}
                />
                <div className="relative w-full max-w-md bg-white rounded-xl shadow-xl border border-gray-200">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200 z-10"
                        disabled={isLoading}
                    >
                        <X size={20} />
                    </button>
                    <div className="p-6">
                        <div className="flex justify-center mb-4">
                            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                                <AlertTriangle className="w-6 h-6 text-yellow-600" />
                            </div>
                        </div>
                        <h2 className="text-lg font-semibold text-center text-gray-800 mb-2">
                            {title}
                        </h2>
                        <p className="text-center text-gray-600 mb-6">
                            {message}
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={onClose}
                                disabled={isLoading}
                                className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors duration-200 disabled:opacity-50"
                            >
                                Tidak
                            </button>
                            <button
                                onClick={onConfirm}
                                disabled={isLoading}
                                className="flex-1 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50"
                            >
                                Ya, Batal
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const handleCancel = () => {
        setShowCancelModal(true);
    };

    const confirmCancel = () => {
        setShowCancelModal(false);
        navigate("/admin/dashboard", { state: { page: "proker" } });
    };

    useEffect(() => {
        const fetchProker = async () => {
            try {
                const res = await axios.get(`http://localhost:8000/api/admin/proker/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
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
                setMessage("Gagal mengambil data proker");
            }
        };

        fetchProker();
    }, [id, token]);

    const handleChange = (e) => {
        if (!e || !e.target) return;

        const { name, value, type, files } = e.target;

        if (type === "file") {
            const file = files && files[0];
            setFeaturedImage(file);
            if (file) {
                setPreview(URL.createObjectURL(file)); // buat preview
            }
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }
    };

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

            await axios.post(`http://localhost:8000/api/admin/proker/${id}`, payload, {
                headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` },
            });

            setMessage("Proker berhasil diubah!");
            MySwal.fire({
                title: "Berhasil!",
                text: "Proker berhasil diubah!",
                icon: "success",
                confirmButtonColor: "#3b82f6",
            });
            navigate("/admin/dashboard", { state: { page: "proker" } });
        } catch (err) {
            console.error(err);
            setMessage("Gagal Mengubah Proker");
            MySwal.fire({
                title: "Error!",
                text: "Gagal mengubah proker",
                icon: "error",
                confirmButtonColor: "#3b82f6",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex items-center gap-4 mb-4">
                        <button
                            onClick={() => navigate("/admin/dashboard", { state: { page: "proker" } })}
                            className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                        >
                            <ArrowLeft size={20} />
                            Kembali
                        </button>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                <FileText className="w-4 h-4 text-blue-600" />
                            </div>
                            <h1 className="text-2xl font-bold text-gray-800">
                                Edit Program Kerja
                            </h1>
                        </div>
                        <p className="text-gray-600">
                            Perbarui informasi program kerja UKM Mahapena
                        </p>
                    </div>
                </div>

                {/* Message */}
                {message && (
                    <div className={`mb-4 p-4 rounded-lg border ${
                        message.includes("berhasil") 
                            ? "bg-green-50 border-green-200 text-green-700" 
                            : "bg-red-50 border-red-200 text-red-700"
                    }`}>
                        {message}
                    </div>
                )}

                {/* Form */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Nama */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nama Program Kerja
                            </label>
                            <input
                                type="text"
                                name="nama"
                                value={form.nama}
                                onChange={handleChange}
                                placeholder="Masukkan nama program kerja..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                                required
                            />
                        </div>

                        {/* Deskripsi */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Deskripsi
                            </label>
                            <textarea
                                value={form.deskripsi}
                                name="deskripsi"
                                onChange={handleChange}
                                rows="6"
                                placeholder="Tulis deskripsi program kerja di sini..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 resize-none"
                                required
                            />
                        </div>

                        {/* Tanggal dan Status */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tanggal Pelaksanaan
                                </label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="date"
                                        name="tanggal"
                                        value={form.tanggal}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Status
                                </label>
                                <select
                                    value={form.status}
                                    name="status"
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                                    required
                                >
                                    <option value="" disabled>
                                        Pilih Status
                                    </option>
                                    <option value="Pending">Pending</option>
                                    <option value="Berjalan">Berjalan</option>
                                    <option value="Selesai">Selesai</option>
                                </select>
                            </div>
                        </div>

                        {/* Upload Gambar */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Featured Image
                            </label>
                            <div className="flex items-center gap-4">
                                <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors duration-200">
                                    {preview ? (
                                        <img src={preview} alt="Preview" className="w-full h-full object-cover rounded-lg" />
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
                                        onChange={handleChange}
                                        className="hidden"
                                    />
                                </label>
                                <div className="text-sm text-gray-500">
                                    <p>Format: JPG, PNG</p>
                                    <p>Maksimal: 2MB</p>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-6 border-t border-gray-200">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 flex-1 justify-center"
                            >
                                {loading ? (
                                    <>
                                        <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                                        </svg>
                                        Menyimpan...
                                    </>
                                ) : (
                                    <>
                                        <Save size={16} />
                                        Simpan Perubahan
                                    </>
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={handleCancel}
                                disabled={loading}
                                className="flex items-center gap-2 px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 flex-1 justify-center"
                            >
                                <X size={16} />
                                Batal
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Cancel Confirmation Modal */}
            <ConfirmationModal
                isOpen={showCancelModal}
                onClose={() => setShowCancelModal(false)}
                onConfirm={confirmCancel}
                title="Batalkan Perubahan"
                message="Apakah Anda yakin ingin membatalkan perubahan? Semua data yang belum disimpan akan hilang."
                isLoading={false}
            />
        </div>
    );
}

export default EditProker;