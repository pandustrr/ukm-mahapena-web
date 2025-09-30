// File: src/pages/admin/ManajemenDivisi.jsx
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import {
    Plus,
    Edit3,
    Trash2,
    Check,
    X,
    Calendar,
    Users,
    Filter,
    AlertTriangle,
    CheckCircle,
    XCircle,
    Info
} from "lucide-react";
import { API_URL } from "../../config/api"; 

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

function ManajemenDivisi() {
    const [divisis, setDivisis] = useState([]);
    const [periodes, setPeriodes] = useState([]);
    const [selectedPeriode, setSelectedPeriode] = useState("");
    const [selectedPeriodeRow, setSelectedPeriodeRow] = useState(null);

    // Modal states
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState({ type: '', id: null, name: '' });
    const [isDeleting, setIsDeleting] = useState(false);

    // State untuk loading
    const [isSaving, setIsSaving] = useState(false);

    const [formDivisi, setFormDivisi] = useState({
        id: null,
        nama_divisi: "",
        singkatan_divisi: "",
        judul_deskripsi: "",
        deskripsi: "",
        pengertian: "",
        periode_id: "",
    });

    const [formPeriode, setFormPeriode] = useState({
        id: null,
        nama_periode: "",
    });

    const token = sessionStorage.getItem("adminToken");

    // ====== FETCH DATA ======
    const fetchDivisis = async () => {
        try {
            const res = await axios.get(`${API_URL}/admin/divisis`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setDivisis(res.data);
        } catch (err) {
            console.error(err);
            alert("Gagal memuat data divisi");
        }
    };

    const fetchPeriodes = async () => {
        try {
            const res = await axios.get(`${API_URL}/admin/periodes`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setPeriodes(res.data);
        } catch (err) {
            console.error(err);
            alert("Gagal memuat data periode");
        }
    };

    useEffect(() => {
        fetchDivisis();
        fetchPeriodes();
    }, []);

    // ====== FORM DIVISI ======
    const handleChangeDivisi = useCallback((e) => {
        const { name, value } = e.target;
        setFormDivisi(prev => ({ ...prev, [name]: value }));
    }, []);

    const resetDivisi = () => {
        setFormDivisi({
            id: null,
            nama_divisi: "",
            singkatan_divisi: "",
            judul_deskripsi: "",
            deskripsi: "",
            pengertian: "",
            periode_id: selectedPeriode || "",
        });
    };

    const handleSubmitDivisi = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const payload = {
                nama_divisi: formDivisi.nama_divisi,
                singkatan_divisi: formDivisi.singkatan_divisi,
                judul_deskripsi: formDivisi.judul_deskripsi,
                deskripsi: formDivisi.deskripsi,
                pengertian: formDivisi.pengertian,
                periode_id: selectedPeriode,
            };

            if (formDivisi.id) {
                await axios.put(
                    `${API_URL}/admin/divisis/${formDivisi.id}`,
                    payload,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                alert("Divisi berhasil diperbarui");
                resetDivisi();
            } else {
                await axios.post(`${API_URL}/admin/divisis`, payload, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                alert("Divisi berhasil ditambahkan");
                resetDivisi();
            }
            fetchDivisis();
        } catch (err) {
            console.error(err);
            if (err.response?.status === 422) {
                alert("Validasi gagal: " + JSON.stringify(err.response.data.errors));
            } else {
                alert("Gagal menyimpan divisi");
            }
        } finally {
            setIsSaving(false);
        }
    };

    const handleEditDivisi = (divisi) => {
        setFormDivisi(divisi);
        // Scroll ke form divisi
        document.getElementById('divisi-form')?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleDeleteDivisi = async (id) => {
        const divisi = divisis.find(d => d.id === id);
        setDeleteTarget({ type: 'divisi', id, name: divisi?.nama_divisi || '' });
        setShowDeleteModal(true);
    };

    // ====== FORM PERIODE ======
    const handleChangePeriode = useCallback((e) => {
        const { name, value } = e.target;
        setFormPeriode(prev => ({ ...prev, [name]: value }));
    }, []);

    const resetPeriode = () => {
        setFormPeriode({
            id: null,
            nama_periode: "",
        });
    };

    const handleSubmitPeriode = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            if (formPeriode.id) {
                await axios.put(
                    `${API_URL}/admin/periodes/${formPeriode.id}`,
                    formPeriode,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                alert("Periode berhasil diperbarui");
                resetPeriode();
            } else {
                await axios.post(`${API_URL}/admin/periodes`, formPeriode, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                alert("Periode berhasil ditambahkan");
                resetPeriode();
            }
            fetchPeriodes();
        } catch (err) {
            console.error(err);
            alert("Gagal menyimpan periode");
        } finally {
            setIsSaving(false);
        }
    };

    const handleEditPeriode = (periode) => {
        setFormPeriode(periode);
        // Scroll ke form periode
        document.getElementById('periode-form')?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleDeletePeriode = async (id) => {
        const periode = periodes.find(p => p.id === id);
        setDeleteTarget({ type: 'periode', id, name: periode?.nama_periode || '' });
        setShowDeleteModal(true);
    };

    // Fungsi untuk memilih periode
    const handleSelectPeriode = (periodeId) => {
        const stringId = String(periodeId);
        setSelectedPeriode(stringId);
        setSelectedPeriodeRow(stringId);
        resetDivisi();
    };

    // Confirm Delete Handler
    const confirmDelete = async () => {
        setIsDeleting(true);
        try {
            if (deleteTarget.type === 'divisi') {
                await axios.delete(`${API_URL}/admin/divisis/${deleteTarget.id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                alert("Divisi berhasil dihapus");
                fetchDivisis();
            } else {
                await axios.delete(`${API_URL}/admin/periodes/${deleteTarget.id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                alert("Periode berhasil dihapus");
                fetchPeriodes();
                // Reset selected periode jika yang dipilih dihapus
                if (String(selectedPeriode) === String(deleteTarget.id)) {
                    setSelectedPeriode("");
                    setSelectedPeriodeRow(null);
                }
            }
        } catch (err) {
            console.error(err);
            alert(`Gagal menghapus ${deleteTarget.type}`);
        } finally {
            setIsDeleting(false);
            setShowDeleteModal(false);
            setDeleteTarget({ type: '', id: null, name: '' });
        }
    };

    // Fungsi untuk memotong teks panjang dan menangani newlines
    const truncateText = (text, maxLength) => {
        if (!text) return '-';

        // Jika teks mengandung newlines, tampilkan dengan line breaks
        if (text.includes('\n')) {
            const lines = text.split('\n');
            const truncatedLines = lines.map(line =>
                line.length > maxLength ? line.substring(0, maxLength) + '...' : line
            );

            return (
                <div className="whitespace-pre-line">
                    {truncatedLines.map((line, index) => (
                        <div key={index}>
                            {line}
                            {index < truncatedLines.length - 1 && <br />}
                        </div>
                    ))}
                </div>
            );
        }

        // Jika tidak ada newlines, potong seperti biasa
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    const filteredDivisis = selectedPeriode
        ? divisis.filter((d) => String(d.periode_id) === String(selectedPeriode))
        : divisis;

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                    Manajemen Divisi & Periode
                </h1>
                <p className="text-gray-600">
                    Kelola data periode dan divisi organisasi
                </p>
            </div>

            {/* ====== PERIODE SECTION ====== */}
            <div id="periode-form" className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-green-600" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-800">
                        {formPeriode.id ? "Edit Periode" : "Kelola Periode"}
                    </h2>
                </div>

                <form onSubmit={handleSubmitPeriode} className="flex flex-col md:flex-row gap-3 mb-6">
                    <input
                        type="text"
                        name="nama_periode"
                        value={formPeriode.nama_periode}
                        onChange={handleChangePeriode}
                        placeholder="Contoh: 2024/2025"
                        className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200"
                        required
                        autoFocus={formPeriode.id ? true : false}
                    />
                    <div className="flex gap-2">
                        <button
                            type="submit"
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200"
                            disabled={isSaving}
                        >
                            {isSaving ? (
                                <>
                                    <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                                    </svg>
                                    Menyimpan...
                                </>
                            ) : formPeriode.id ? (
                                <>
                                    <Check size={16} />
                                    Update
                                </>
                            ) : (
                                <>
                                    <Plus size={16} />
                                    Tambah
                                </>
                            )}
                        </button>
                        {formPeriode.id && (
                            <button
                                type="button"
                                onClick={resetPeriode}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors duration-200"
                                disabled={isSaving}
                            >
                                <X size={16} />
                                Batal
                            </button>
                        )}
                    </div>
                </form>

                <div className="overflow-x-auto">
                    <table className="w-full rounded-lg overflow-hidden">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-3 text-left font-medium text-gray-700">Nama Periode</th>
                                <th className="px-4 py-3 text-center font-medium text-gray-700">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {periodes.length > 0 ? (
                                periodes.map((p) => {
                                    const isSelected = String(selectedPeriodeRow) === String(p.id);
                                    const isEditing = formPeriode.id === p.id;
                                    return (
                                        <tr
                                            key={p.id}
                                            className={`transition-colors duration-200 ${isEditing
                                                ? "bg-green-50 border-l-4 border-green-500"
                                                : isSelected
                                                    ? "bg-blue-50 border-l-4 border-blue-500"
                                                    : "hover:bg-gray-50"
                                                }`}
                                        >
                                            <td className="px-4 py-3 text-gray-800 font-medium">{p.nama_periode}</td>
                                            <td className="px-4 py-3 text-center">
                                                <div className="flex justify-center gap-2 flex-wrap">
                                                    <button
                                                        onClick={() => handleEditPeriode(p)}
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
                                                        onClick={() => handleDeletePeriode(p.id)}
                                                        className="flex items-center gap-1 px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded-md text-sm font-medium transition-colors duration-200"
                                                        disabled={isSaving}
                                                    >
                                                        <Trash2 size={14} />
                                                        Hapus
                                                    </button>
                                                    <button
                                                        onClick={() => handleSelectPeriode(p.id)}
                                                        className={`flex items-center gap-1 px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 ${isSelected
                                                            ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                                                            : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                                                            }`}
                                                        disabled={isSaving}
                                                    >
                                                        <Check size={14} />
                                                        {isSelected ? "Terpilih" : "Pilih"}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="2" className="px-4 py-6 text-center text-gray-500">
                                        Belum ada periode
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ====== DIVISI SECTION ====== */}
            {selectedPeriode && (
                <div id="divisi-form" className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Users className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800">
                                {formDivisi.id ? "Edit Divisi" : "Kelola Divisi"}
                            </h2>
                            <p className="text-sm text-gray-600 flex items-center gap-1">
                                <Filter size={14} />
                                Periode: {periodes.find((p) => String(p.id) === String(selectedPeriode))?.nama_periode || "-"}
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmitDivisi} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <input type="hidden" name="periode_id" value={selectedPeriode} />

                        <input
                            type="text"
                            name="nama_divisi"
                            value={formDivisi.nama_divisi}
                            onChange={handleChangeDivisi}
                            placeholder="Nama Divisi"
                            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                            required
                            disabled={isSaving}
                        />
                        <input
                            type="text"
                            name="singkatan_divisi"
                            value={formDivisi.singkatan_divisi}
                            onChange={handleChangeDivisi}
                            placeholder="Singkatan Divisi"
                            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                            disabled={isSaving}
                        />
                        <textarea
                            name="pengertian"
                            value={formDivisi.pengertian}
                            onChange={handleChangeDivisi}
                            placeholder="Pengertian"
                            rows="3"
                            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 resize-y"
                            disabled={isSaving}
                        ></textarea>
                        <input
                            type="text"
                            name="judul_deskripsi"
                            value={formDivisi.judul_deskripsi}
                            onChange={handleChangeDivisi}
                            placeholder="Judul Deskripsi"
                            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 risize-y"
                            disabled={isSaving}
                        />
                        <textarea
                            name="deskripsi"
                            value={formDivisi.deskripsi}
                            onChange={handleChangeDivisi}
                            placeholder="Deskripsi"
                            rows="3"
                            className="md:col-span-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 resize-y"
                            disabled={isSaving}
                        ></textarea>

                        <div className="md:col-span-2 flex gap-3">
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
                                ) : formDivisi.id ? (
                                    <>
                                        <Check size={16} />
                                        Update Divisi
                                    </>
                                ) : (
                                    <>
                                        <Plus size={16} />
                                        Tambah Divisi
                                    </>
                                )}
                            </button>
                            {formDivisi.id && (
                                <button
                                    type="button"
                                    onClick={resetDivisi}
                                    className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors duration-200"
                                    disabled={isSaving}
                                >
                                    <X size={16} />
                                    Batal Edit
                                </button>
                            )}
                        </div>
                    </form>

                    <div className="overflow-x-auto">
                        <table className="w-full rounded-lg overflow-hidden">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-4 py-3 text-left font-medium text-gray-700 min-w-[150px]">Nama Divisi</th>
                                    <th className="px-4 py-3 text-left font-medium text-gray-700 min-w-[100px]">Singkatan</th>
                                    <th className="px-4 py-3 text-left font-medium text-gray-700 min-w-[200px]">Pengertian</th>
                                    <th className="px-4 py-3 text-left font-medium text-gray-700 min-w-[150px]">Judul Deskripsi</th>
                                    <th className="px-4 py-3 text-left font-medium text-gray-700 min-w-[200px]">Deskripsi</th>
                                    <th className="px-4 py-3 text-center font-medium text-gray-700 min-w-[120px]">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredDivisis.length > 0 ? (
                                    filteredDivisis.map((d) => {
                                        const isEditing = formDivisi.id === d.id;
                                        return (
                                            <tr
                                                key={d.id}
                                                className={`transition-colors duration-200 ${isEditing
                                                        ? "bg-green-50 border-l-4 border-green-500"
                                                        : "hover:bg-gray-50"
                                                    }`}
                                            >
                                                <td className="px-4 py-3 text-gray-800 font-medium">
                                                    <div className="max-w-[150px]">
                                                        <div title={d.nama_divisi}>
                                                            {truncateText(d.nama_divisi, 20)}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-gray-600">
                                                    <div className="max-w-[100px]">
                                                        <div title={d.singkatan_divisi}>
                                                            {truncateText(d.singkatan_divisi, 10)}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-gray-600">
                                                    <div className="max-w-[200px]">
                                                        <div title={d.pengertian} className="whitespace-pre-line">
                                                            {truncateText(d.pengertian, 50)}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-gray-600">
                                                    <div className="max-w-[150px]">
                                                        <div title={d.judul_deskripsi}>
                                                            {truncateText(d.judul_deskripsi, 30)}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-gray-600">
                                                    <div className="max-w-[200px]">
                                                        <div title={d.deskripsi} className="whitespace-pre-line">
                                                            {truncateText(d.deskripsi, 50)}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <div className="flex justify-center gap-2">
                                                        <button
                                                            onClick={() => handleEditDivisi(d)}
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
                                                            onClick={() => handleDeleteDivisi(d.id)}
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
                                        <td colSpan="6" className="px-4 py-6 text-center text-gray-500">
                                            Belum ada divisi untuk periode ini
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            <ConfirmationModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={confirmDelete}
                title={`Hapus ${deleteTarget.type === 'divisi' ? 'Divisi' : 'Periode'}`}
                message={`Apakah Anda yakin ingin menghapus ${deleteTarget.type} "${deleteTarget.name}"? Data yang dihapus tidak dapat dikembalikan.`}
                type="danger"
                confirmText="Ya, Hapus"
                cancelText="Batal"
                isLoading={isDeleting}
            />
        </div>
    );
}

export default ManajemenDivisi;