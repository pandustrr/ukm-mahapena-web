import { useEffect, useState } from "react";
import axios from "axios";
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  Users, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  Image,
  Upload,
  GraduationCap
} from "lucide-react";

function ManajemenAlumni() {
  const [alumnis, setAlumnis] = useState([]);
  const [formData, setFormData] = useState({
    nama: "",
    prodi: "",
    angkatan: "",
    pekerjaan: "",
    deskripsi: "",
    foto: null,
  });
  const [editingId, setEditingId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  
  // Modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const token = sessionStorage.getItem("adminToken");
  const api = axios.create({
    baseURL: "http://localhost:8000/api/admin",
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

  // Ambil data alumni
  const fetchData = async () => {
    try {
      const res = await api.get("/alumni");
      setAlumnis(res.data);
    } catch (err) {
      console.error("Gagal ambil data alumni:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Input handler
  const handleChange = (e) => {
    if (e.target.name === "foto") {
      const file = e.target.files[0];
      setFormData({ ...formData, foto: file });
      
      // Create preview
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewImage(reader.result);
        };
        reader.readAsDataURL(file);
      }
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  // Simpan / Update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const form = new FormData();
      form.append("nama", formData.nama);
      form.append("prodi", formData.prodi);
      form.append("angkatan", formData.angkatan);
      form.append("pekerjaan", formData.pekerjaan);
      form.append("deskripsi", formData.deskripsi);
      if (formData.foto) form.append("foto", formData.foto);

      if (editingId) {
        await api.post(
          `/alumni/${editingId}?_method=PUT`,
          form,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        await api.post("/alumni", form, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      setFormData({
        nama: "",
        prodi: "",
        angkatan: "",
        pekerjaan: "",
        deskripsi: "",
        foto: null,
      });
      setEditingId(null);
      setPreviewImage(null);
      fetchData();
    } catch (err) {
      console.error("Gagal simpan alumni:", err);
      alert("Gagal menyimpan data alumni");
    } finally {
      setIsSaving(false);
    }
  };

  // Edit
  const handleEdit = (item) => {
    setFormData({
      nama: item.nama,
      prodi: item.prodi,
      angkatan: item.angkatan,
      pekerjaan: item.pekerjaan,
      deskripsi: item.deskripsi,
      foto: null,
    });
    setPreviewImage(item.foto ? `http://localhost:8000/storage/${item.foto}` : null);
    setEditingId(item.id);
  };

  // Hapus
  const handleDeleteClick = (alumni) => {
    setDeleteTarget(alumni);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await api.delete(`/alumni/${deleteTarget.id}`);
      fetchData();
      setShowDeleteModal(false);
      setDeleteTarget(null);
    } catch (err) {
      console.error("Gagal hapus alumni:", err);
      alert("Gagal menghapus alumni");
    } finally {
      setIsDeleting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      nama: "",
      prodi: "",
      angkatan: "",
      pekerjaan: "",
      deskripsi: "",
      foto: null,
    });
    setPreviewImage(null);
    setEditingId(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Manajemen Alumni
        </h1>
        <p className="text-gray-600">
          Kelola data alumni organisasi
        </p>
      </div>

      {/* Form Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <GraduationCap className="w-4 h-4 text-blue-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-800">
            {editingId ? "Edit Alumni" : "Tambah Alumni Baru"}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="nama"
            placeholder="Nama Lengkap"
            value={formData.nama}
            onChange={handleChange}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
            required
          />
          <input
            type="text"
            name="prodi"
            placeholder="Program Studi"
            value={formData.prodi}
            onChange={handleChange}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
          />
          <input
            type="text"
            name="angkatan"
            placeholder="Angkatan"
            value={formData.angkatan}
            onChange={handleChange}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
          />
          <input
            type="text"
            name="pekerjaan"
            placeholder="Pekerjaan"
            value={formData.pekerjaan}
            onChange={handleChange}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
          />
          
          {/* Deskripsi dengan textarea untuk menampung teks lebih panjang */}
          <div className="md:col-span-2">
            <textarea
              name="deskripsi"
              placeholder="Deskripsi (riwayat pekerjaan, prestasi, dll.)"
              value={formData.deskripsi}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 resize-none"
            />
          </div>
          
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
                  name="foto"
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
                  {editingId ? "Update Alumni" : "Tambah Alumni"}
                </>
              )}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors duration-200"
              >
                <X size={16} />
                Batal
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Tabel Alumni */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
            <Users className="w-4 h-4 text-purple-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-800">Daftar Alumni</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Foto</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Nama</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Program Studi</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Angkatan</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Pekerjaan</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Deskripsi</th>
                <th className="px-4 py-3 text-center font-medium text-gray-700">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {alumnis.length > 0 ? (
                alumnis.map((item) => {
                  // Deteksi apakah baris ini sedang diedit
                  const isEditingRow = editingId === item.id;
                  
                  return (
                    <tr 
                      key={item.id} 
                      className={`transition-colors duration-200 ${
                        isEditingRow 
                          ? "bg-green-50 border-l-4 border-green-500" // Highlight baris yang sedang diedit
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <td className="px-4 py-3">
                        {item.foto ? (
                          <img
                            src={`http://localhost:8000/storage/${item.foto}`}
                            alt={item.nama}
                            className="w-10 h-10 object-cover rounded-full"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <Image size={16} className="text-gray-500" />
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-800 font-medium">{item.nama}</td>
                      <td className="px-4 py-3 text-gray-600">{item.prodi}</td>
                      <td className="px-4 py-3 text-gray-600">{item.angkatan}</td>
                      <td className="px-4 py-3 text-gray-600">{item.pekerjaan}</td>
                      <td className="px-4 py-3 text-gray-600">
                        <div className="max-w-xs truncate" title={item.deskripsi}>
                          {item.deskripsi}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleEdit(item)}
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
                            onClick={() => handleDeleteClick(item)}
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
                  <td colSpan="7" className="px-4 py-6 text-center text-gray-500">
                    Belum ada data alumni
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
        onConfirm={handleDelete}
        title="Hapus Alumni"
        message={`Apakah Anda yakin ingin menghapus alumni "${deleteTarget?.nama}"? Data yang dihapus tidak dapat dikembalikan.`}
        type="danger"
        confirmText="Ya, Hapus"
        cancelText="Batal"
        isLoading={isDeleting}
      />
    </div>
  );
}

export default ManajemenAlumni;