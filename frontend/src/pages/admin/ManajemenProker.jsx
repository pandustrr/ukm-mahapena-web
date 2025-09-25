import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Edit, Trash2, Loader } from "lucide-react";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

function ManajemenProker() {
    const [proker, setProker] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const MySwal = withReactContent(Swal);

    useEffect(() => {
        const fetchProker = async () => {
            try {
                setLoading(true);
                const res = await axios.get("http://127.0.0.1:8000/api/admin/proker");
                const data = res.data.data?.data || res.data;
                setProker(data);
            } catch (err) {
                setError("Gagal memuat data proker");
            } finally {
                setLoading(false);
            }
        };

        fetchProker();
    }, []);

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
                    await axios.delete(`http://127.0.0.1:8000/api/admin/proker/${id}`, {
                        headers: {
                            Authorization: `Bearer ${sessionStorage.getItem("adminToken")}`,
                        },
                    });
                    MySwal.fire("Dihapus!", "Proker berhasil dihapus.", "success");
                    setProker((prev) => prev.filter((proker) => proker.id !== id));
                } catch (err) {
                    console.error(err);
                    alert("Gagal menghapus proker");
                }
            }
        });
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
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Kelola Program Kerja</h1>
                <Link
                    to="/admin/proker/create"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 mt-4 sm:mt-0"
                >
                    <Plus size={18} />
                    Tambah Proker
                </Link>
            </div>

            {/* Tabel */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    No
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Nama Program
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Deskripsi
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
                            ) : proker.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-4 text-gray-500">
                                        Belum ada proker
                                    </td>
                                </tr>
                            ) : proker.length > 0 ? (
                                proker.map((proker, index) => (
                                    <tr key={index} className="border-t">
                                        <td className="px-6 py-4">{index + 1}</td>
                                        <td className="px-6 py-4">{proker.nama}</td>
                                        <td className={`px-6 py-4`}>
                                            {proker.deskripsi?.slice(0, 50)}...
                                        </td>
                                        <td className="px-6 py-4">
                                            {new Date(proker.tanggal).toLocaleDateString("id-ID", {
                                                day: "2-digit",
                                                month: "long", // <-- otomatis jadi nama bulan
                                                year: "numeric",
                                            })}
                                        </td>
                                        <td className="px-6 py-4 flex gap-2">
                                            <Link
                                                to={`/admin/proker/update/${proker.id}`}
                                                className="text-blue-600 hover:underline"
                                            >
                                                <Edit size={20} />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(proker.id)}
                                                className="text-red-600 cursor-pointer hover:underline"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="5"
                                        className="px-6 py-4 text-center text-gray-500"
                                    >
                                        Belum ada program kerja
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default ManajemenProker;
