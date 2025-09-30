import { useEffect, useState } from "react";
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
  Info,
  Image,
  Upload
} from "lucide-react";
import { API_URL, STORAGE_URL } from "../../config/api"; 

function ManajemenPengurus() {
  const [pengurus, setPengurus] = useState([]);
  const [divisis, setDivisis] = useState([]);
  const [periodes, setPeriodes] = useState([]);

  // filter state
  const [selectedPeriode, setSelectedPeriode] = useState("");
  const [selectedDivisi, setSelectedDivisi] = useState("");

  // form state
  const [formData, setFormData] = useState({
    id: null,
    nama: "",
    jabatan: "",
    prodi: "",
    angkatan: "",
    foto: null,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const token = sessionStorage.getItem("adminToken");
  const api = axios.create({
    baseURL: `${API_URL}/admin`,
    headers: { Authorization: `Bearer ${token}` },
  });

  // Modal Components
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

  const fetchPeriodes = async () => {
    try {
      const res = await api.get("/periodes");
      setPeriodes(res.data);
    } catch (err) {
      console.error("Gagal ambil periode:", err);
    }
  };

  const fetchDivisis = async (periodeId) => {
    if (!periodeId) return setDivisis([]);
    try {
      const res = await api.get(`/divisi/periode/${periodeId}`);
      setDivisis(res.data);
    } catch (err) {
      console.error("Gagal ambil divisi:", err);
    }
  };

  const fetchPengurus = async () => {
    try {
      const res = await api.get("/pengurus");
      let data = res.data;
      if (selectedPeriode) {
        data = data.filter((p) => p.periode_id == selectedPeriode);
      }
      if (selectedDivisi) {
        data = data.filter((p) => p.divisi_id == selectedDivisi);
      }
      setPengurus(data);
    } catch (err) {
      console.error("Gagal ambil pengurus:", err);
    }
  };

  useEffect(() => {
    fetchPeriodes();
    fetchPengurus();
  }, []);

  useEffect(() => {
    fetchDivisis(selectedPeriode);
    fetchPengurus();
  }, [selectedPeriode, selectedDivisi]);

  // Handle file upload and preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, foto: file });

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // CRUD Pengurus
  const handleSubmitPengurus = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    const payload = new FormData();
    payload.append("periode_id", selectedPeriode);
    payload.append("divisi_id", selectedDivisi);
    payload.append("nama", formData.nama);
    payload.append("jabatan", formData.jabatan);
    payload.append("prodi", formData.prodi);
    payload.append("angkatan", formData.angkatan);
    if (formData.foto) payload.append("foto", formData.foto);

    try {
      if (isEditing) {
        await api.post(`/pengurus/${formData.id}?_method=PUT`, payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post("/pengurus", payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      resetFormPengurus();
      fetchPengurus();
    } catch (err) {
      console.error("Gagal simpan:", err);
      alert("Gagal menyimpan data pengurus");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditPengurus = (p) => {
    setSelectedPeriode(p.periode_id);
    setSelectedDivisi(p.divisi_id);
    setFormData({
      id: p.id,
      nama: p.nama,
      jabatan: p.jabatan,
      prodi: p.prodi,
      angkatan: p.angkatan,
      foto: null,
    });
    setPreviewImage(p.foto ? `${STORAGE_URL}/${p.foto}` : null);
    setIsEditing(true);
  };

  const handleDeleteClick = (pengurus) => {
    setDeleteTarget(pengurus);
    setShowDeleteModal(true);
  };

  const handleDeletePengurus = async () => {
    setIsDeleting(true);
    try {
      await api.delete(`/pengurus/${deleteTarget.id}`);
      fetchPengurus();
      setShowDeleteModal(false);
      setDeleteTarget(null);
    } catch (err) {
      console.error("Gagal hapus:", err);
      alert("Gagal menghapus pengurus");
    } finally {
      setIsDeleting(false);
    }
  };

  const resetFormPengurus = () => {
    setFormData({
      id: null,
      nama: "",
      jabatan: "",
      prodi: "",
      angkatan: "",
      foto: null,
    });
    setPreviewImage(null);
    setIsEditing(false);
  };

  // Fungsi untuk mendapatkan nama periode dan divisi yang dipilih
  const getSelectedPeriodeName = () => {
    if (!selectedPeriode) return "";
    const periode = periodes.find(p => p.id == selectedPeriode);
    return periode ? periode.nama_periode : "";
  };

  const getSelectedDivisiName = () => {
    if (!selectedDivisi) return "";
    const divisi = divisis.find(d => d.id == selectedDivisi);
    return divisi ? divisi.nama_divisi : "";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Manajemen Pengurus
        </h1>
        <p className="text-gray-600">
          Kelola data pengurus organisasi
        </p>
      </div>

      {/* Filter Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <Filter className="w-4 h-4 text-blue-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-800">Filter Pengurus</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Pilih Periode */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Periode</label>
            <select
              value={selectedPeriode}
              onChange={(e) => {
                setSelectedPeriode(e.target.value);
                setSelectedDivisi("");
              }}
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
            >
              <option value="">-- Pilih Periode --</option>
              {periodes.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nama_periode}
                </option>
              ))}
            </select>
          </div>

          {/* Pilih Divisi */}
          {selectedPeriode && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Divisi</label>
              <select
                value={selectedDivisi}
                onChange={(e) => setSelectedDivisi(e.target.value)}
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
              >
                <option value="">-- Pilih Divisi --</option>
                {divisis.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.nama_divisi}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Form Section */}
      {selectedPeriode && selectedDivisi && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <Users className="w-4 h-4 text-green-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800">
              {isEditing ? "Edit Pengurus" : "Tambah Pengurus Baru"}
            </h2>
          </div>

          <form onSubmit={handleSubmitPengurus} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="hidden" name="periode_id" value={selectedPeriode} />
            <input type="hidden" name="divisi_id" value={selectedDivisi} />

            <input
              type="text"
              placeholder="Nama"
              value={formData.nama}
              onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
              required
            />
            <input
              type="text"
              placeholder="Jabatan"
              value={formData.jabatan}
              onChange={(e) => setFormData({ ...formData, jabatan: e.target.value })}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
              required
            />
            <input
              type="text"
              placeholder="Program Studi"
              value={formData.prodi}
              onChange={(e) => setFormData({ ...formData, prodi: e.target.value })}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
              required
            />
            <input
              type="text"
              placeholder="Angkatan"
              value={formData.angkatan}
              onChange={(e) => setFormData({ ...formData, angkatan: e.target.value })}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
              required
            />

            {/* File Upload with Preview */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Foto Profil</label>
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
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                <div className="text-sm text-gray-500">
                  <p>Format: JPG, PNG</p>
                  <p>Maksimal: 2MB</p>
                </div>
              </div>
            </div>

            <div className="md:col-span-2 flex gap-3">
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                    </svg>
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Plus size={16} />
                    {isEditing ? "Update Pengurus" : "Tambah Pengurus"}
                  </>
                )}
              </button>
              {isEditing && (
                <button
                  type="button"
                  onClick={resetFormPengurus}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors duration-200"
                >
                  <X size={16} />
                  Batal
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* Tabel Pengurus */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center gap-3 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="w-4 h-4 text-purple-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800">Daftar Pengurus</h2>
          </div>

          {/* Keterangan Filter yang Dipilih */}
          {(selectedPeriode || selectedDivisi) && (
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-blue-50 px-3 py-1.5 rounded-lg">
              <Filter size={14} />
              <div className="flex flex-col leading-tight">
                {selectedPeriode && (
                  <span>
                    Periode: {getSelectedPeriodeName()}
                  </span>
                )}
                {selectedDivisi && (
                  <span>
                    Divisi: {getSelectedDivisiName()}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Foto</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Nama</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Jabatan</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Program Studi</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Angkatan</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Divisi</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Periode</th>
                <th className="px-4 py-3 text-center font-medium text-gray-700">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pengurus.length > 0 ? (
                pengurus.map((p) => {
                  // Deteksi apakah baris ini sedang diedit
                  const isEditingRow = formData.id === p.id;
                  
                  return (
                    <tr 
                      key={p.id} 
                      className={`transition-colors duration-200 ${
                        isEditingRow 
                          ? "bg-green-50 border-l-4 border-green-500" // Highlight baris yang sedang diedit
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <td className="px-4 py-3">
                        {p.foto ? (
                          <img
                            src={`${STORAGE_URL}/${p.foto}`}
                            alt={p.nama}
                            className="w-10 h-10 object-cover rounded-full"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <Image size={16} className="text-gray-500" />
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-800 font-medium">{p.nama}</td>
                      <td className="px-4 py-3 text-gray-600">{p.jabatan}</td>
                      <td className="px-4 py-3 text-gray-600">{p.prodi}</td>
                      <td className="px-4 py-3 text-gray-600">{p.angkatan}</td>
                      <td className="px-4 py-3 text-gray-600">{p.divisi?.nama_divisi}</td>
                      <td className="px-4 py-3 text-gray-600">{p.periode?.nama_periode}</td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleEditPengurus(p)}
                            className={`flex items-center gap-1 px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 ${
                              isEditingRow
                                ? "bg-green-200 text-green-800 hover:bg-green-300" // Tombol hijau saat sedang diedit
                                : "bg-yellow-100 hover:bg-yellow-200 text-yellow-700"
                            }`}
                            disabled={isSaving}
                          >
                            <Edit3 size={14} />
                            {isEditingRow ? "Sedang Diedit" : "Edit"} {/* Teks berubah */}
                          </button>
                          <button
                            onClick={() => handleDeleteClick(p)}
                            className="flex items-center gap-1 px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded-md text-sm font-medium transition-colors duration-200"
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
                  <td colSpan="8" className="px-4 py-6 text-center text-gray-500">
                    {selectedPeriode && selectedDivisi
                      ? "Belum ada pengurus untuk filter yang dipilih"
                      : "Pilih periode dan/atau divisi untuk melihat data pengurus"}
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
        onConfirm={handleDeletePengurus}
        title="Hapus Pengurus"
        message={`Apakah Anda yakin ingin menghapus pengurus "${deleteTarget?.nama}"? Data yang dihapus tidak dapat dikembalikan.`}
        type="danger"
        confirmText="Ya, Hapus"
        cancelText="Batal"
        isLoading={isDeleting}
      />
    </div>
  );
}

export default ManajemenPengurus;