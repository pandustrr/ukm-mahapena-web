import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Eye,
  Calendar,
  User,
  Tag,
  ChevronLeft,
  ChevronRight,
  Loader,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

const ManajemenBlog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBlogs, setFilteredBlogs] = useState([]); // data hasil filter
  const [filterStatus, setFilterStatus] = useState("all");
  const MySwal = withReactContent(Swal);

  // pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 5; // jumlah blog per halaman

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://127.0.0.1:8000/api/admin/blogs");
        const data = res.data.data?.data || res.data;
        setBlogs(data);
        setFilteredBlogs(data);
      } catch (err) {
        setError("Gagal memuat data blog");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // efek filter gabungan
  useEffect(() => {
    let results = blogs;

    // filter berdasarkan search
    if (searchTerm !== "") {
      results = results.filter(
        (blog) =>
          blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          blog.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          blog.content?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // filter berdasarkan status
    if (filterStatus !== "all") {
      results = results.filter((blog) => blog.status === filterStatus);
    }

    setFilteredBlogs(results);
  }, [searchTerm, filterStatus, blogs]);

  const handleDelete = async (id) => {
    MySwal.fire({
      title: "Apakah Anda yakin?",
      text: "Anda tidak akan bisa mengembalikan ini!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, hapus!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:8000/api/admin/blogs/${id}`, {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("adminToken")}`,
            },
          });
          MySwal.fire("Dihapus!", "Perubahan tidak disimpan.", "success");
          // refresh state blog agar list terupdate
          setBlogs((prev) => prev.filter((blog) => blog.id !== id));
        } catch (err) {
          console.error(err);
          alert("Gagal menghapus blog");
        }
      }
    });
  };

  // pagination logic
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="animate-spin h-8 w-8 text-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manajemen Blog</h1>
          <p className="text-gray-600">Kelola konten blog UKM</p>
        </div>
        <Link
          to="/admin/blogs/create"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 mt-4 sm:mt-0"
        >
          <Plus size={18} />
          Tambah Blog
        </Link>
      </div>

      {/* Notifications */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
          <CheckCircle size={18} />
          {success}
        </div>
      )}

      {/* Bagian Search & Filter */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Cari blog..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">Semua Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="text-2xl font-bold text-gray-800">{blogs.length}</div>
          <div className="text-gray-600">Total Blog</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="text-2xl font-bold text-green-600">
            {blogs.filter((b) => b.status === "published").length}
          </div>
          <div className="text-gray-600">Published</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="text-2xl font-bold text-yellow-600">
            {blogs.filter((b) => b.status === "draft").length}
          </div>
          <div className="text-gray-600">Draft</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="text-2xl font-bold text-gray-600">
            {blogs.filter((b) => b.status === "archived").length}
          </div>
          <div className="text-gray-600">Archived</div>
        </div>
      </div>

      {/* Blog Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  No
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Judul Blog
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kategori
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    Memuat data...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-red-500">
                    {error}
                  </td>
                </tr>
              ) : blogs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-gray-500">
                    Belum ada blog
                  </td>
                </tr>
              ) : filteredBlogs.length > 0 ? (
                filteredBlogs.map((blog, index) => (
                  <tr key={blog.id} className="border-t">
                    <td className="px-6 py-4">{index + 1}</td>
                    <td className="px-6 py-4">{blog.title}</td>
                    <td className="px-6 py-4">{blog.category?.name || "-"}</td>
                    <td
                      className={`px-6 py-4 capitalize ${getStatusColor(
                        blog.status
                      )}`}
                    >
                      {blog.status}
                    </td>
                    <td className="px-6 py-4">
                      {new Date(blog.created_at).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "long", // <-- otomatis jadi nama bulan
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 flex gap-2">
                      <Link
                        to={`/admin/blogs/update/${blog.id}`}
                        className="text-blue-600 hover:underline"
                      >
                        <Edit size={18} />
                      </Link>
                      <button
                        onClick={() => handleDelete(blog.id)}
                        className="text-red-600 hover:underline"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-gray-500">
                    Tidak ada blog yang ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pesan jika blog tidak ditemukan */}
        {/* {currentBlogs.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-2">
              Tidak ada blog yang ditemukan
            </div>
            <div className="text-sm text-gray-500">
              Coba ubah filter atau kata kunci pencarian
            </div>
          </div>
        )} */}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Menampilkan {indexOfFirstBlog + 1}-
                {Math.min(indexOfLastBlog, filteredBlogs.length)} dari{" "}
                {filteredBlogs.length} blog
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="p-1 rounded border border-gray-300 disabled:opacity-50"
                >
                  <ChevronLeft size={16} />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 rounded text-sm ${
                        currentPage === page
                          ? "bg-blue-600 text-white"
                          : "border border-gray-300 text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}

                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="p-1 rounded border border-gray-300 disabled:opacity-50"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManajemenBlog;
