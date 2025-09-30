import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import {
    Plus,
    Edit3,
    Trash2,
    Check,
    X,
    Image,
    Upload,
    AlertTriangle,
    CheckCircle,
    XCircle,
    Info
} from "lucide-react";
import  { API_URL, STORAGE_URL } from "../../config/api"; 

// Pindahkan ConfirmationModal ke luar komponen utama
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, type = "warning", confirmText, cancelText, isLoading }) => {
    if (!isOpen) return null;

    const getTypeStyles = () => {
        switch (type) {
            case "danger":
                return {
                    icon: XCircle,
                    buttonBg: "bg-red-600 hover:bg-red-700",
                };
            case "success":
                return {
                    icon: CheckCircle,
                    buttonBg: "bg-green-600 hover:bg-green-700",
                };
            case "info":
                return {
                    icon: Info,
                    buttonBg: "bg-blue-600 hover:bg-blue-700",
                };
            default:
                return {
                    icon: AlertTriangle,
                    buttonBg: "bg-yellow-500 hover:bg-yellow-600",
                };
        }
    };

    const typeStyles = getTypeStyles();
    const IconComponent = typeStyles.icon;

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
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                            <IconComponent className="w-6 h-6 text-red-600" />
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
                            {cancelText}
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={isLoading}
                            className={`flex-1 px-4 py-2 ${typeStyles.buttonBg} text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 flex items-center justify-center gap-2`}
                        >
                            {isLoading ? (
                                <>
                                    <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                                    </svg>
                                    Loading...
                                </>
                            ) : (
                                confirmText
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

function ManajemenPortofolio() {
    const [portofolios, setPortofolios] = useState([]);
    const [formData, setFormData] = useState({
        judul: "",
        deskripsi: "",
        tahun: "",
        gambar: null,
    });
    const [editingId, setEditingId] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);

    // Modal states
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState({ id: null, name: '' });
    const [isDeleting, setIsDeleting] = useState(false);

    // State untuk loading
    const [isSaving, setIsSaving] = useState(false);

    const token = sessionStorage.getItem("adminToken");

    // Ambil data portofolio dari backend
    const fetchData = async () => {
        try {
            const res = await axios.get(`${API_URL}/admin/portofolio`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setPortofolios(res.data);
        } catch (err) {
            console.error("Gagal ambil data portofolio:", err);
            alert("Gagal memuat data portofolio");
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Tangani input form
    const handleChange = useCallback((e) => {
        if (e.target.name === "gambar") {
            const file = e.target.files[0];
            setFormData(prev => ({ ...prev, gambar: file }));

            // Create preview URL
            if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setPreviewImage(reader.result);
                };
                reader.readAsDataURL(file);
            } else {
                setPreviewImage(null);
            }
        } else {
            const { name, value } = e.target;
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    }, []);

    const resetForm = () => {
        setFormData({
            judul: "",
            deskripsi: "",
            tahun: "",
            gambar: null,
        });
        setEditingId(null);
        setPreviewImage(null);
        // Reset file input
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) fileInput.value = '';
    };

    // Simpan / Update portofolio
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            const form = new FormData();
            form.append("judul", formData.judul);
            form.append("deskripsi", formData.deskripsi);
            form.append("tahun", formData.tahun);
            if (formData.gambar) form.append("gambar", formData.gambar);

            if (editingId) {
                // update
                await axios.post(
                    `${API_URL}/admin/portofolio/${editingId}?_method=PUT`,
                    form,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );
                alert("Portofolio berhasil diperbarui");
            } else {
                // create
                await axios.post(`${API_URL}/admin/portofolio`, form, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                });
                alert("Portofolio berhasil ditambahkan");
            }

            resetForm();
            fetchData();
        } catch (err) {
            console.error("Gagal simpan portofolio:", err);
            if (err.response?.status === 422) {
                alert("Validasi gagal: " + JSON.stringify(err.response.data.errors));
            } else {
                alert("Gagal menyimpan portofolio");
            }
        } finally {
            setIsSaving(false);
        }
    };

    // Edit portofolio
    const handleEdit = (item) => {
        setFormData({
            judul: item.judul,
            deskripsi: item.deskripsi,
            tahun: item.tahun,
            gambar: null,
        });
        setEditingId(item.id);

        // Set preview image dari data yang ada
        if (item.gambar) {
            setPreviewImage(`${STORAGE_URL}/${item.gambar}`);
        } else {
            setPreviewImage(null);
        }

        // Scroll ke form
        document.getElementById('portofolio-form')?.scrollIntoView({ behavior: 'smooth' });
    };

    // Hapus portofolio
    const handleDelete = async (id) => {
        const portofolio = portofolios.find(p => p.id === id);
        setDeleteTarget({ id, name: portofolio?.judul || '' });
        setShowDeleteModal(true);
    };

    // Confirm Delete Handler
    const confirmDelete = async () => {
        setIsDeleting(true);
        try {
            await axios.delete(`${API_URL}/admin/portofolio/${deleteTarget.id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert("Portofolio berhasil dihapus");
            fetchData();
        } catch (err) {
            console.error("Gagal hapus portofolio:", err);
            alert("Gagal menghapus portofolio");
        } finally {
            setIsDeleting(false);
            setShowDeleteModal(false);
            setDeleteTarget({ id: null, name: '' });
        }
    };

    // Fungsi untuk memotong teks panjang
    const truncateText = (text, maxLength) => {
        if (!text) return '-';
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                    Manajemen Portofolio
                </h1>
                <p className="text-gray-600">
                    Kelola data portofolio dan prestasi organisasi
                </p>
            </div>

            {/* Form Section */}
            <div id="portofolio-form" className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Image className="w-4 h-4 text-blue-600" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-800">
                        {editingId ? "Edit Portofolio" : "Tambah Portofolio"}
                    </h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="text"
                            name="judul"
                            value={formData.judul}
                            onChange={handleChange}
                            placeholder="Judul Prestasi"
                            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                            required
                            disabled={isSaving}
                        />
                        <input
                            type="text"
                            name="tahun"
                            value={formData.tahun}
                            onChange={handleChange}
                            placeholder="Tahun (contoh: 2024)"
                            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                            disabled={isSaving}
                        />
                    </div>

                    <textarea
                        name="deskripsi"
                        value={formData.deskripsi}
                        onChange={handleChange}
                        placeholder="Deskripsi prestasi atau portofolio"
                        rows="4"
                        className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 resize"
                        disabled={isSaving}
                    ></textarea>

                    {/* File Upload with Preview */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Upload Gambar
                        </label>
                        <div className="flex items-center gap-4">
                            <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors duration-200">
                                {previewImage ? (
                                    <img src={previewImage} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                                ) : (
                                    <div className="flex flex-col items-center justify-center p-4 text-gray-500">
                                        <Upload size={24} />
                                        <span className="text-xs mt-1">Upload Foto</span>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    name="gambar"
                                    accept="image/*"
                                    onChange={handleChange}
                                    className="hidden"
                                    disabled={isSaving}
                                />
                            </label>
                            <div className="text-sm text-gray-500">
                                <p>Format: JPG, PNG, GIF</p>
                                <p>Maksimal: 2MB</p>
                                {editingId && !previewImage && (
                                    <p className="text-blue-600 text-xs mt-2">
                                        * Kosongkan jika tidak ingin mengubah gambar
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                            disabled={isSaving}
                        >
                            {isSaving ? (
                                <>
                                    <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                                    </svg>
                                    Menyimpan...
                                </>
                            ) : editingId ? (
                                <>
                                    <Check size={16} />
                                    Update Portofolio
                                </>
                            ) : (
                                <>
                                    <Plus size={16} />
                                    Tambah Portofolio
                                </>
                            )}
                        </button>
                        {editingId && (
                            <button
                                type="button"
                                onClick={resetForm}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors duration-200"
                                disabled={isSaving}
                            >
                                <X size={16} />
                                Batal Edit
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Daftar Portofolio
                </h3>

                <div className="overflow-x-auto">
                    <table className="w-full rounded-lg overflow-hidden">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-3 text-left font-medium text-gray-700 min-w-[200px]">Judul</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-700 min-w-[80px]">Tahun</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-700 min-w-[250px]">Deskripsi</th>
                                <th className="px-4 py-3 text-center font-medium text-gray-700 min-w-[120px]">Gambar</th>
                                <th className="px-4 py-3 text-center font-medium text-gray-700 min-w-[140px]">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {portofolios.length > 0 ? (
                                portofolios.map((item) => {
                                    const isEditing = editingId === item.id;
                                    return (
                                        <tr
                                            key={item.id}
                                            className={`transition-colors duration-200 ${isEditing
                                                    ? "bg-green-50 border-l-4 border-green-500"
                                                    : "hover:bg-gray-50"
                                                }`}
                                        >
                                            <td className="px-4 py-3 text-gray-800 font-medium">
                                                <div className="max-w-[200px]">
                                                    <div title={item.judul}>
                                                        {truncateText(item.judul, 30)}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-gray-600">
                                                {item.tahun || '-'}
                                            </td>
                                            <td className="px-4 py-3 text-gray-600">
                                                <div className="max-w-[250px]">
                                                    <div title={item.deskripsi}>
                                                        {truncateText(item.deskripsi, 60)}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                {item.gambar ? (
                                                    <div className="flex justify-center">
                                                        <img
                                                            src={`${STORAGE_URL}/${item.gambar}`}
                                                            alt={item.judul}
                                                            className="h-16 w-16 object-cover rounded-lg border border-gray-200"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="flex justify-center">
                                                        <div className="h-16 w-16 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                                                            <Image size={20} className="text-gray-400" />
                                                        </div>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <div className="flex justify-center gap-2">
                                                    <button
                                                        onClick={() => handleEdit(item)}
                                                        className={`flex items-center gap-1 px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 ${isEditing
                                                                ? "bg-green-200 text-green-800 hover:bg-green-300"
                                                                : "bg-yellow-100 hover:bg-yellow-200 text-yellow-700"
                                                            }`}
                                                        disabled={isSaving}
                                                    >
                                                        <Edit3 size={14} />
                                                        {isEditing ? "Sedang Diedit" : "Edit"}
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(item.id)}
                                                        className="flex items-center gap-1 px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded-md text-sm font-medium transition-colors duration-200"
                                                        disabled={isSaving}
                                                    >
                                                        <Trash2 size={14} />
                                                        Hapus
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                                        Belum ada portofolio
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <ConfirmationModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={confirmDelete}
                title="Hapus Portofolio"
                message={`Apakah Anda yakin ingin menghapus portofolio "${deleteTarget.name}"? Data yang dihapus tidak dapat dikembalikan.`}
                type="danger"
                confirmText="Ya, Hapus"
                cancelText="Batal"
                isLoading={isDeleting}
            />
        </div>
    );
}

export default ManajemenPortofolio;