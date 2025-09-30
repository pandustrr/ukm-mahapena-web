import { useState, useEffect } from "react";
import axios from "axios";
import {
  Plus,
  Edit3,
  Trash2,
  Search,
  Filter,
  BookOpen,
  Tag,
  Calendar,
  User,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Info,
  X,
  Check,
  Loader,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { API_URL } from "../../config/api"; 

// Confirmation Modal Component
const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = "warning",
  confirmText,
  cancelText,
  isLoading,
}) => {
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
          <p className="text-center text-gray-600 mb-6">{message}</p>
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
                  <svg
                    className="w-4 h-4 animate-spin"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    ></path>
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

const ManajemenBlog = () => {
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState({
    type: "",
    id: null,
    name: "",
  });

  // Category form states
  const [formCategory, setFormCategory] = useState({
    id: null,
    name: "",
    status: "active",
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 10;

  const token = sessionStorage.getItem("adminToken");

  // Fetch data
  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/admin/blogs`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = res.data.data?.data || res.data;
      setBlogs(data);
    } catch (err) {
      setError("Gagal memuat data blog");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/admin/blog-categories`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = res.data.data?.data || res.data;
      setCategories(data);
    } catch (err) {
      setError("Gagal memuat data kategori");
    }
  };

  useEffect(() => {
    fetchBlogs();
    fetchCategories();
  }, []);

  // Filter blogs
  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch =
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.content?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || blog.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);

  // Category form handlers
  const handleCategoryChange = (e) => {
    const { name, value } = e.target;
    setFormCategory((prev) => ({ ...prev, [name]: value }));
  };

  const resetCategory = () => {
    setFormCategory({
      id: null,
      name: "",
      status: "active",
    });
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (formCategory.id) {
        await axios.put(
          `${API_URL}/admin/blog-categories/${formCategory.id}`,
          { name: formCategory.name, status: formCategory.status },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSuccess("Kategori berhasil diperbarui");
        resetCategory();
      } else {
        await axios.post(
          `${API_URL}/admin/blog-categories`,
          { name: formCategory.name, status: formCategory.status },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSuccess("Kategori berhasil ditambahkan");
        resetCategory();
      }
      fetchCategories();
    } catch (err) {
      setError("Gagal menyimpan kategori");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditCategory = (category) => {
    setFormCategory(category);
    document
      .getElementById("category-form")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const handleDeleteCategory = (id) => {
    const category = categories.find((c) => c.id === id);
    setDeleteTarget({ type: "kategori", id, name: category?.name || "" });
    setShowDeleteModal(true);
  };

  const handleDeleteBlog = (id) => {
    const blog = blogs.find((b) => b.id === id);
    setDeleteTarget({ type: "blog", id, name: blog?.title || "" });
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      if (deleteTarget.type === "blog") {
        await axios.delete(
          `${API_URL}/admin/blogs/${deleteTarget.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setSuccess("Blog berhasil dihapus");
        fetchBlogs();
      } else {
        await axios.delete(
          `${API_URL}/admin/blog-categories/${deleteTarget.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setSuccess("Kategori berhasil dihapus");
        fetchCategories();
      }
    } catch (err) {
      setError(`Gagal menghapus ${deleteTarget.type}`);
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
      setDeleteTarget({ type: "", id: null, name: "" });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      case "archived":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const truncateText = (text, maxLength) => {
    if (!text) return "-";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Manajemen Blog
          </h1>
          <p className="text-gray-600">
            Kelola konten blog dan kategori artikel
          </p>
        </div>
        <Link
          to="/admin/blogs/create"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 mt-4 sm:mt-0"
        >
          <Plus size={16} />
          Tambah Blog
        </Link>
      </div>

      {/* Notifications */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
          <XCircle size={18} />
          {error}
          <button
            onClick={() => setError("")}
            className="ml-auto text-red-700 hover:text-red-900"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
          <CheckCircle size={18} />
          {success}
          <button
            onClick={() => setSuccess("")}
            className="ml-auto text-green-700 hover:text-green-900"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* ====== CATEGORY SECTION ====== */}
      <div
        id="category-form"
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
            <Tag className="w-4 h-4 text-purple-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-800">
            {formCategory.id ? "Edit Kategori" : "Kelola Kategori"}
          </h2>
        </div>

        <form
          onSubmit={handleCategorySubmit}
          className="flex flex-col md:flex-row gap-3 mb-6"
        >
          <input
            type="text"
            name="name"
            value={formCategory.name}
            onChange={handleCategoryChange}
            placeholder="Nama kategori"
            className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200"
            required
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-800 text-white font-medium rounded-lg transition-colors duration-200"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
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
                onClick={resetCategory}
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
                <th className="px-4 py-3 text-left font-medium text-gray-700">
                  No
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">
                  Nama Kategori
                </th>
                <th className="px-4 py-3 text-center font-medium text-gray-700">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categories.length > 0 ? (
                categories.map((category, index) => {
                  const isEditing = formCategory.id === category.id;
                  return (
                    <tr
                      key={category.id}
                      className={`transition-colors duration-200 ${
                        isEditing
                          ? "bg-green-300 border-l-4 border-purple-500"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <td className="px-4 py-3 text-gray-800 font-medium">
                        {index + 1}
                      </td>
                      <td className="px-4 py-3 text-gray-800 font-medium">
                        {category.name}
                      </td>
                      {/* <td className="px-4 py-3 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          category.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {category.status}
                        </span>
                      </td> */}
                      <td className="px-4 py-3 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleEditCategory(category)}
                            className={`flex items-center gap-1 px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 ${
                              isEditing
                                ? "bg-green-200 text-green-800 hover:bg-green-300"
                                : "bg-yellow-100 hover:bg-yellow-200 text-yellow-700"
                            }`}
                            disabled={isSaving}
                          >
                            <Edit3 size={14} />
                            {isEditing ? "Sedang Diedit" : "Edit"}
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(category.id)}
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
                  <td
                    colSpan="3"
                    className="px-4 py-6 text-center text-gray-500"
                  >
                    Belum ada kategori
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ====== BLOG SECTION ====== */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-blue-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-800">Kelola Blog</h2>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Cari blog..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">Semua Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-600">
              {blogs.length}
            </div>
            <div className="text-gray-600 text-sm">Total Blog</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-600">
              {blogs.filter((b) => b.status === "published").length}
            </div>
            <div className="text-gray-600 text-sm">Published</div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-yellow-600">
              {blogs.filter((b) => b.status === "draft").length}
            </div>
            <div className="text-gray-600 text-sm">Draft</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-gray-600">
              {blogs.filter((b) => b.status === "archived").length}
            </div>
            <div className="text-gray-600 text-sm">Archived</div>
          </div>
        </div>

        {/* Blog Table */}
        <div className="overflow-x-auto">
          <table className="w-full rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-700 min-w-[200px]">
                  Judul Blog
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-700 min-w-[120px]">
                  Kategori
                </th>
                <th className="px-4 py-3 text-center font-medium text-gray-700 min-w-[100px]">
                  Status
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-700 min-w-[120px]">
                  Tanggal
                </th>
                <th className="px-4 py-3 text-center font-medium text-gray-700 min-w-[120px]">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-4 py-6 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Loader className="w-5 h-5 animate-spin text-blue-600" />
                      <span className="text-gray-600">Memuat data...</span>
                    </div>
                  </td>
                </tr>
              ) : currentBlogs.length > 0 ? (
                currentBlogs.map((blog, index) => (
                  <tr
                    key={blog.id}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="px-4 py-3 text-gray-800 font-medium">
                      <div className="max-w-[200px]">
                        <div title={blog.title}>
                          {truncateText(blog.title, 40)}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      <div className="max-w-[120px]">
                        {blog.category?.name || "-"}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          blog.status
                        )}`}
                      >
                        {blog.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-sm">
                      {new Date(blog.created_at).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center gap-2">
                        <Link
                          to={`/admin/blogs/update/${blog.id}`}
                          className="flex items-center gap-1 px-3 py-1 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded-md text-sm font-medium transition-colors duration-200"
                        >
                          <Edit3 size={14} />
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDeleteBlog(blog.id)}
                          className="flex items-center gap-1 px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded-md text-sm font-medium transition-colors duration-200"
                        >
                          <Trash2 size={14} />
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="px-4 py-6 text-center text-gray-500"
                  >
                    {filteredBlogs.length === 0 && blogs.length > 0
                      ? "Tidak ada blog yang sesuai dengan pencarian"
                      : "Belum ada blog"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Menampilkan {indexOfFirstBlog + 1}-
              {Math.min(indexOfLastBlog, filteredBlogs.length)} dari{" "}
              {filteredBlogs.length} blog
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                <ChevronLeft size={16} />
              </button>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-200 ${
                      currentPage === pageNum
                        ? "bg-blue-600 text-white"
                        : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title={`Hapus ${deleteTarget.type === "blog" ? "Blog" : "Kategori"}`}
        message={`Apakah Anda yakin ingin menghapus ${deleteTarget.type} "${deleteTarget.name}"? Data yang dihapus tidak dapat dikembalikan.`}
        type="danger"
        confirmText="Ya, Hapus"
        cancelText="Batal"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default ManajemenBlog;
