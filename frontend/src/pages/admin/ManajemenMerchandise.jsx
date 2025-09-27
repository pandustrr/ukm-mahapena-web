// File: src/pages/admin/ManajemenMerchandise.jsx
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import {
    Plus,
    Edit3,
    Trash2,
    Check,
    X,
    ShoppingBag,
    Filter,
    AlertTriangle,
    CheckCircle,
    XCircle,
    Info,
    Image as ImageIcon
} from "lucide-react";

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

function ManajemenMerchandise() {
    const [merchandises, setMerchandises] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedCategoryRow, setSelectedCategoryRow] = useState(null);

    // State untuk input size dan color
    const [sizeInput, setSizeInput] = useState("");
    const [colorInput, setColorInput] = useState("");

    // Modal states
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState({ type: '', id: null, name: '' });
    const [isDeleting, setIsDeleting] = useState(false);

    // State untuk loading
    const [isSaving, setIsSaving] = useState(false);

    const [formMerchandise, setFormMerchandise] = useState({
        id: null,
        category_id: "",
        name: "",
        price: "",
        stock: "",
        description: "",
        sizes: [],
        colors: [],
        image: null,
        imagePreview: ""
    });

    const [formCategory, setFormCategory] = useState({
        id: null,
        name: "",
    });

    const token = sessionStorage.getItem("adminToken");

    // ====== FETCH DATA ======
    const fetchMerchandises = async () => {
        try {
            const res = await axios.get("http://localhost:8000/api/admin/merchandises", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMerchandises(res.data);
        } catch (err) {
            console.error(err);
            alert("Gagal memuat data merchandise");
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await axios.get("http://localhost:8000/api/admin/categories", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCategories(res.data);
            // Set kategori pertama sebagai default jika belum ada yang dipilih
            if (!selectedCategory && res.data.length > 0) {
                setSelectedCategory(res.data[0].id.toString());
            }
        } catch (err) {
            console.error(err);
            alert("Gagal memuat data kategori");
        }
    };

    useEffect(() => {
        fetchMerchandises();
        fetchCategories();
    }, []);

    // ====== FUNGSI SIZE & COLOR ======
    const handleAddSize = () => {
        if (sizeInput.trim() && !formMerchandise.sizes.includes(sizeInput.trim())) {
            setFormMerchandise({
                ...formMerchandise,
                sizes: [...formMerchandise.sizes, sizeInput.trim()]
            });
            setSizeInput("");
        }
    };

    const handleRemoveSize = (size) => {
        setFormMerchandise({
            ...formMerchandise,
            sizes: formMerchandise.sizes.filter(s => s !== size)
        });
    };

    const handleAddColor = () => {
        if (colorInput.trim() && !formMerchandise.colors.includes(colorInput.trim())) {
            setFormMerchandise({
                ...formMerchandise,
                colors: [...formMerchandise.colors, colorInput.trim()]
            });
            setColorInput("");
        }
    };

    const handleRemoveColor = (color) => {
        setFormMerchandise({
            ...formMerchandise,
            colors: formMerchandise.colors.filter(c => c !== color)
        });
    };

    // ====== FORM MERCHANDISE ======
    const handleChangeMerchandise = (e) => {
        if (e.target.name === 'image') {
            const file = e.target.files[0];
            if (file) {
                setFormMerchandise({
                    ...formMerchandise,
                    image: file,
                    imagePreview: URL.createObjectURL(file)
                });
            }
        } else {
            setFormMerchandise({ ...formMerchandise, [e.target.name]: e.target.value });
        }
    };

    const resetMerchandise = () => {
        setFormMerchandise({
            id: null,
            category_id: selectedCategory || "",
            name: "",
            price: "",
            stock: "",
            description: "",
            sizes: [],
            colors: [],
            image: null,
            imagePreview: ""
        });
        setSizeInput("");
        setColorInput("");
    };

    const handleSubmitMerchandise = async (e) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            const formData = new FormData();
            formData.append('category_id', parseInt(selectedCategory));
            formData.append('name', formMerchandise.name);
            formData.append('price', parseFloat(formMerchandise.price));
            formData.append('stock', parseInt(formMerchandise.stock));
            formData.append('description', formMerchandise.description);

            formMerchandise.sizes.forEach((s) => formData.append("sizes[]", s));
            formMerchandise.colors.forEach((c) => formData.append("colors[]", c));

            if (formMerchandise.image && formMerchandise.image instanceof File) {
                formData.append('image', formMerchandise.image);
            }

            if (formMerchandise.id) {
                await axios.post(
                    `http://localhost:8000/api/admin/merchandises/${formMerchandise.id}?_method=PUT`,
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                );
                alert("Merchandise berhasil diperbarui");
            } else {
                await axios.post("http://localhost:8000/api/admin/merchandises", formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    },
                });
                alert("Merchandise berhasil ditambahkan");
            }
            resetMerchandise();
            fetchMerchandises();
        } catch (err) {
            console.error(err);
            if (err.response?.status === 422) {
                const errors = err.response.data.errors || err.response.data.message;
                if (typeof errors === 'object') {
                    const errorMessages = Object.values(errors).flat().join('\n');
                    alert("Validasi gagal:\n" + errorMessages);
                } else {
                    alert("Validasi gagal: " + errors);
                }
            } else {
                alert("Gagal menyimpan merchandise: " + (err.response?.data?.message || err.message));
            }
        } finally {
            setIsSaving(false);
        }
    };

    const handleEditMerchandise = (merchandise) => {
        setFormMerchandise({
            ...merchandise,
            category_id: merchandise.category_id?.toString() || "",
            price: merchandise.price?.toString() || "",
            stock: merchandise.stock?.toString() || "",
            sizes: merchandise.sizes || [],
            colors: merchandise.colors || [],
            image: null,
            imagePreview: merchandise.image
                ? `http://localhost:8000/storage/${merchandise.image}`
                : ""
        });

        document.getElementById('merch-form')?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleDeleteMerchandise = async (id) => {
        const merchandise = merchandises.find(m => m.id === id);
        setDeleteTarget({ type: 'merchandise', id, name: merchandise?.name || '' });
        setShowDeleteModal(true);
    };

    // ====== FORM CATEGORY ======
    const handleChangeCategory = useCallback((e) => {
        const { name, value } = e.target;
        setFormCategory(prev => ({
            ...prev,
            [name]: value,
        }));
    }, []);

    const handleSubmitCategory = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            if (formCategory.id) {
                // Update kategori
                await axios.put(
                    `http://localhost:8000/api/admin/categories/${formCategory.id}`,
                    { name: formCategory.name },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                alert("Kategori berhasil diperbarui");
                resetCategoryForm();
            } else {
                // Tambah kategori baru
                await axios.post("http://localhost:8000/api/admin/categories",
                    { name: formCategory.name },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                alert("Kategori berhasil ditambahkan");
                resetCategoryForm();
            }
            fetchCategories();
        } catch (err) {
            console.error(err);
            alert("Gagal menyimpan kategori: " + (err.response?.data?.message || err.message));
        } finally {
            setIsSaving(false);
        }
    };

    const resetCategoryForm = () => {
        setFormCategory({
            id: null,
            name: "",
        });
    };

    // Saat klik tombol edit kategori - isi form dengan data kategori
    const handleEditCategory = (category) => {
        setFormCategory({
            id: category.id,
            name: category.name,
        });
        // Scroll ke form kategori
        document.getElementById('category-form')?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleDeleteCategory = async (id) => {
        const category = categories.find(c => c.id === id);
        setDeleteTarget({ type: 'kategori', id, name: category?.name || '' });
        setShowDeleteModal(true);
    };

    // Fungsi untuk memilih kategori
    const handleSelectCategory = (categoryId) => {
        const stringId = String(categoryId);
        setSelectedCategory(stringId);
        setSelectedCategoryRow(stringId);
        setFormMerchandise({
            id: null,
            category_id: stringId,
            name: "",
            price: "",
            stock: "",
            description: "",
            sizes: [],
            colors: [],
            image: null,
            imagePreview: ""
        });
        setSizeInput("");
        setColorInput("");
    };

    // Confirm Delete Handler
    const confirmDelete = async () => {
        setIsDeleting(true);
        try {
            if (deleteTarget.type === 'merchandise') {
                await axios.delete(`http://localhost:8000/api/admin/merchandises/${deleteTarget.id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                alert("Merchandise berhasil dihapus");
                fetchMerchandises();
            } else {
                await axios.delete(`http://localhost:8000/api/admin/categories/${deleteTarget.id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                alert("Kategori berhasil dihapus");
                fetchCategories();
                if (String(selectedCategory) === String(deleteTarget.id)) {
                    setSelectedCategory("");
                    setSelectedCategoryRow(null);
                }
            }
        } catch (err) {
            console.error(err);
            alert(`Gagal menghapus ${deleteTarget.type}: ` + (err.response?.data?.message || err.message));
        } finally {
            setIsDeleting(false);
            setShowDeleteModal(false);
            setDeleteTarget({ type: '', id: null, name: '' });
        }
    };

    const filteredMerchandises = selectedCategory
        ? merchandises.filter((m) => String(m.category_id) === String(selectedCategory))
        : merchandises;

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* Loading Overlay */}
            {loading && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <div className="flex items-center gap-3">
                            <svg className="w-6 h-6 animate-spin text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                            </svg>
                            <p className="text-lg text-gray-700">Loading...</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                    Manajemen Merchandise & Kategori
                </h1>
                <p className="text-gray-600">
                    Kelola data kategori dan merchandise
                </p>
            </div>

            {/* ====== KATEGORI SECTION ====== */}
            <div id="category-form" className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <ShoppingBag className="w-4 h-4 text-green-600" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-800">
                        {formCategory.id ? "Edit Kategori" : "Kelola Kategori"}
                    </h2>
                </div>

                <form onSubmit={handleSubmitCategory} className="flex flex-col md:flex-row gap-3 mb-6">
                    <input
                        type="text"
                        name="name"
                        value={formCategory.name}
                        onChange={handleChangeCategory}
                        placeholder="Nama Kategori"
                        className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200"
                        required
                        autoFocus={formCategory.id ? true : false}
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
                            ) : formCategory.id ? (
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
                        {formCategory.id && (
                            <button
                                type="button"
                                onClick={resetCategoryForm}
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
                                <th className="px-4 py-3 text-left font-medium text-gray-700">Nama Kategori</th>
                                <th className="px-4 py-3 text-center font-medium text-gray-700">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {categories.length > 0 ? (
                                categories.map((c) => {
                                    const isSelected = String(selectedCategoryRow) === String(c.id);
                                    const isEditing = formCategory.id === c.id;
                                    return (
                                        <tr
                                            key={c.id}
                                            className={`transition-colors duration-200 ${isEditing
                                                ? "bg-green-50 border-l-4 border-green-500"
                                                : isSelected
                                                    ? "bg-blue-50 border-l-4 border-blue-500"
                                                    : "hover:bg-gray-50"
                                                }`}
                                        >
                                            <td className="px-4 py-3 text-gray-800 font-medium">{c.name}</td>
                                            <td className="px-4 py-3 text-center">
                                                <div className="flex justify-center gap-2 flex-wrap">
                                                    <button
                                                        onClick={() => handleEditCategory(c)}
                                                        className={`flex items-center gap-1 px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 ${isEditing
                                                            ? "bg-green-200 text-green-800 hover:bg-green-300"
                                                            : "bg-yellow-100 hover:bg-yellow-200 text-yellow-700"
                                                            }`}
                                                        disabled={loading}
                                                    >
                                                        <Edit3 size={14} />
                                                        {isEditing ? "Sedang Diedit" : "Edit"}
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteCategory(c.id)}
                                                        className="flex items-center gap-1 px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded-md text-sm font-medium transition-colors duration-200"
                                                        disabled={loading}
                                                    >
                                                        <Trash2 size={14} />
                                                        Hapus
                                                    </button>
                                                    <button
                                                        onClick={() => handleSelectCategory(c.id)}
                                                        className={`flex items-center gap-1 px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 ${isSelected
                                                            ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                                                            : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                                                            }`}
                                                        disabled={loading}
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
                                        Belum ada kategori
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ====== MERCHANDISE SECTION ====== */}
            {selectedCategory && (
                <div id="merch-form" className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <ShoppingBag className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800">
                                {formMerchandise.id ? "Edit Merchandise" : "Tambah Merchandise Baru"}
                            </h2>
                            <p className="text-sm text-gray-600 flex items-center gap-1">
                                <Filter size={14} />
                                Kategori: {categories.find((c) => String(c.id) === String(selectedCategory))?.name || "-"}
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmitMerchandise} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <input
                            type="hidden"
                            name="category_id"
                            value={selectedCategory}
                        />

                        <div className="md:col-span-2">
                            <label className="block mb-1 font-medium">Nama Merchandise *</label>
                            <input
                                type="text"
                                name="name"
                                value={formMerchandise.name}
                                onChange={handleChangeMerchandise}
                                placeholder="Nama Merchandise"
                                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                                required
                                disabled={isSaving}
                            />
                        </div>

                        <div>
                            <label className="block mb-1 font-medium">Harga *</label>
                            <input
                                type="number"
                                name="price"
                                value={formMerchandise.price}
                                onChange={handleChangeMerchandise}
                                placeholder="Harga"
                                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                                required
                                disabled={isSaving}
                                min="0"
                                step="0.01"
                            />
                        </div>

                        <div>
                            <label className="block mb-1 font-medium">Stock *</label>
                            <input
                                type="number"
                                name="stock"
                                value={formMerchandise.stock}
                                onChange={handleChangeMerchandise}
                                placeholder="Stok"
                                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                                required
                                disabled={isSaving}
                                min="0"
                            />
                        </div>

                        {/* Sizes */}
                        <div className="md:col-span-2">
                            <label className="block mb-1 font-medium">Sizes</label>
                            <div className="flex gap-2 items-center">
                                <input
                                    type="text"
                                    value={sizeInput}
                                    onChange={(e) => setSizeInput(e.target.value)}
                                    placeholder="Masukkan size"
                                    className="border border-gray-300 p-2 rounded flex-1"
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSize())}
                                    disabled={isSaving}
                                />
                                <button
                                    type="button"
                                    onClick={handleAddSize}
                                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-200"
                                    disabled={isSaving}
                                >
                                    Tambah
                                </button>
                            </div>
                            <div className="mt-2 flex gap-2 flex-wrap">
                                {formMerchandise.sizes.map((s, i) => (
                                    <span key={i} className="bg-gray-200 px-3 py-1 rounded-full flex items-center gap-1">
                                        {s}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveSize(s)}
                                            className="text-red-500 font-bold text-sm"
                                            disabled={isSaving}
                                        >
                                            &times;
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Colors */}
                        <div className="md:col-span-2">
                            <label className="block mb-1 font-medium">Colors</label>
                            <div className="flex gap-2 items-center">
                                <input
                                    type="text"
                                    value={colorInput}
                                    onChange={(e) => setColorInput(e.target.value)}
                                    placeholder="Masukkan color"
                                    className="border border-gray-300 p-2 rounded flex-1"
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddColor())}
                                    disabled={isSaving}
                                />
                                <button
                                    type="button"
                                    onClick={handleAddColor}
                                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-200"
                                    disabled={isSaving}
                                >
                                    Tambah
                                </button>
                            </div>
                            <div className="mt-2 flex gap-2 flex-wrap">
                                {formMerchandise.colors.map((c, i) => (
                                    <span key={i} className="bg-gray-200 px-3 py-1 rounded-full flex items-center gap-1">
                                        {c}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveColor(c)}
                                            className="text-red-500 font-bold text-sm"
                                            disabled={isSaving}
                                        >
                                            &times;
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block mb-1 font-medium">Deskripsi</label>
                            <textarea
                                name="description"
                                value={formMerchandise.description}
                                onChange={handleChangeMerchandise}
                                placeholder="Deskripsi merchandise"
                                rows="3"
                                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 resize-y"
                                disabled={isSaving}
                            ></textarea>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Gambar Merchandise</label>
                            <div className="flex items-center gap-4">
                                <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors duration-200">
                                    {formMerchandise.imagePreview ? (
                                        <img
                                            src={formMerchandise.imagePreview}
                                            alt="Preview"
                                            className="w-full h-full object-cover rounded-lg"
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center p-4 text-gray-500">
                                            <ImageIcon size={24} />
                                            <span className="text-xs mt-1">Upload Gambar</span>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        name="image"
                                        onChange={handleChangeMerchandise}
                                        className="hidden"
                                        accept="image/*"
                                        disabled={isSaving}
                                    />
                                </label>
                                <div className="flex flex-col gap-2">
                                    {formMerchandise.image && (
                                        <p className="text-sm text-green-600">File baru dipilih: {formMerchandise.image.name}</p>
                                    )}
                                    {formMerchandise.id && formMerchandise.imagePreview && !formMerchandise.image && (
                                        <p className="text-sm text-gray-500">Gambar saat ini akan dipertahankan</p>
                                    )}
                                    {formMerchandise.id && formMerchandise.image && (
                                        <p className="text-sm text-yellow-600">Gambar akan diganti saat disimpan</p>
                                    )}
                                </div>
                            </div>
                        </div>

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
                                        Processing...
                                    </>
                                ) : formMerchandise.id ? (
                                    <>
                                        <Check size={16} />
                                        Update Merchandise
                                    </>
                                ) : (
                                    <>
                                        <Plus size={16} />
                                        Tambah Merchandise
                                    </>
                                )}
                            </button>
                            {formMerchandise.id && (
                                <button
                                    type="button"
                                    onClick={resetMerchandise}
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
                                    <th className="px-4 py-3 text-left font-medium text-gray-700">Gambar</th>
                                    <th className="px-4 py-3 text-left font-medium text-gray-700">Nama</th>
                                    <th className="px-4 py-3 text-left font-medium text-gray-700">Harga</th>
                                    <th className="px-4 py-3 text-left font-medium text-gray-700">Stok</th>
                                    <th className="px-4 py-3 text-left font-medium text-gray-700">Terjual</th>
                                    <th className="px-4 py-3 text-left font-medium text-gray-700">Penjualan</th> {/* ✅ Kolom baru */}
                                    <th className="px-4 py-3 text-left font-medium text-gray-700">Ukuran</th>
                                    <th className="px-4 py-3 text-left font-medium text-gray-700">Warna</th>
                                    <th className="px-4 py-3 text-center font-medium text-gray-700">Aksi</th>
                                </tr>
                            </thead>

                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredMerchandises.length > 0 ? (
                                    filteredMerchandises.map((m) => {
                                        const isEditing = formMerchandise.id === m.id;
                                        const totalPenjualan = (m.sold ?? 0) * (m.price ?? 0); // ✅ Hitung total penjualan

                                        return (
                                            <tr
                                                key={m.id}
                                                className={`transition-colors duration-200 ${isEditing
                                                        ? "bg-green-50 border-l-4 border-green-500"
                                                        : "hover:bg-gray-50"
                                                    }`}
                                            >
                                                <td className="px-4 py-3">
                                                    {m.image ? (
                                                        <img
                                                            src={`http://localhost:8000/storage/${m.image}`}
                                                            alt={m.name}
                                                            className="w-12 h-12 object-cover rounded"
                                                            onError={(e) => {
                                                                e.target.src =
                                                                    "https://via.placeholder.com/64?text=No+Image";
                                                            }}
                                                        />
                                                    ) : (
                                                        <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                                                            <ImageIcon size={20} className="text-gray-400" />
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-gray-800 font-medium">{m.name}</td>
                                                <td className="px-4 py-3 text-gray-600">
                                                    Rp {Number(m.price).toLocaleString("id-ID")}
                                                </td>
                                                <td className="px-4 py-3 text-gray-600">{m.stock}</td>
                                                <td className="px-4 py-3 text-gray-600">{m.sold ?? 0}</td>
                                                <td className="px-4 py-3 text-gray-600">
                                                    Rp {totalPenjualan.toLocaleString("id-ID")} {/* ✅ Penjualan */}
                                                </td>
                                                <td className="px-4 py-3 text-gray-600">
                                                    {m.sizes && m.sizes.length > 0 ? (
                                                        <div className="flex flex-col gap-1">
                                                            {m.sizes.map((size, i) => (
                                                                <span
                                                                    key={i}
                                                                    className="bg-gray-200 px-2 py-1 rounded text-xs"
                                                                >
                                                                    {size}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        "-"
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-gray-600">
                                                    {m.colors && m.colors.length > 0 ? (
                                                        <div className="flex flex-col gap-1">
                                                            {m.colors.map((color, i) => (
                                                                <span
                                                                    key={i}
                                                                    className="bg-gray-200 px-2 py-1 rounded text-xs"
                                                                >
                                                                    {color}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        "-"
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <div className="flex justify-center gap-2">
                                                        <button
                                                            onClick={() => handleEditMerchandise(m)}
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
                                                            onClick={() => handleDeleteMerchandise(m.id)}
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
                                        <td colSpan="9" className="px-4 py-6 text-center text-gray-500">
                                            Belum ada merchandise untuk kategori ini
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
                title={`Hapus ${deleteTarget.type === 'merchandise' ? 'Merchandise' : 'Kategori'}`}
                message={`Apakah Anda yakin ingin menghapus ${deleteTarget.type} "${deleteTarget.name}"? Data yang dihapus tidak dapat dikembalikan.`}
                type="danger"
                confirmText="Ya, Hapus"
                cancelText="Batal"
                isLoading={isDeleting}
            />
        </div>
    );
}

export default ManajemenMerchandise;