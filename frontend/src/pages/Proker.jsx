// File: src/pages/Proker.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import { CrossIcon, Loader } from "lucide-react";

const Proker = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [proker, setProker] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProker, setSelectedProker] = useState(null);

    useEffect(() => {
        const fetchProker = async () => {
            try {
                setLoading(true);

                const res = await axios.get("http://localhost:8000/api/proker");
                console.log(res.data);

                setProker(res.data || []); // pastikan sesuai struktur API kamu
            } catch (err) {
                console.error("Gagal mengambil data proker:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProker();
    }, []);

    return (
        <div className="pt-24 pb-16 bg-white dark:bg-blue-900">
            {/* Header */}
            <section className="py-12 bg-gradient-to-r from-[#113F67] to-[#3674B5] dark:from-blue-100 dark:to-blue-300 text-white dark:text-gray-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl font-bold mb-4">Program Kerja</h1>
                    <p className="text-xl">
                        Berbagai program unggulan kami untuk pengembangan mahasiswa
                    </p>
                </div>
            </section>

            {/* Program List */}

            <section className="py-16 bg-white dark:bg-blue-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Judul Section */}
                    <div className="text-center mb-12 fade-in">
                        <h2 className="text-3xl font-bold text-[#3674B5] dark:text-blue-100">
                            Program Unggulan
                        </h2>
                        <div className="w-20 h-1 bg-[#A1E3F9] mx-auto mt-4"></div>
                    </div>

                    {/* Grid Proker */}
                    {loading ? (
                        <div className="flex items-center justify-center h-64">
                            <Loader className="animate-spin h-8 w-8 text-blue-600" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {proker.length > 0 ? (
                                proker.map((item, index) => (
                                    <div
                                        key={index}
                                        onClick={() => {
                                            setSelectedProker({
                                                ...item,
                                                gambar: item.featured_image, // alias
                                            });
                                        }}
                                        className="fade-in bg-white dark:bg-transparent dark:border dark:border-white rounded-xl shadow-md hover:shadow-xl hover:bg-gray-100 dark:hover:bg-gray-500 cursor-pointer transition-all duration-300 overflow-hidden"
                                    >
                                        {/* Thumbnail jika ada */}
                                        <img
                                            src={
                                                item.featured_image
                                                    ? `http://localhost:8000/storage/${item.featured_image}`
                                                    : "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                                            }
                                            alt={item.nama}
                                            className="w-full h-48 object-cover"
                                        />
                                        <div className="p-6">
                                            <h3 className="text-xl font-semibold text-[#3674B5] dark:text-blue-100 mb-3">
                                                {item.nama}
                                            </h3>
                                            <p
                                                className="text-gray-600 dark:text-gray-100 line-clamp-3"
                                                dangerouslySetInnerHTML={{ __html: item.deskripsi }}
                                            />
                                            <p className="text-sm text-gray-500 dark:text-gray-100 mt-2">
                                                {new Date(item.tanggal).toLocaleDateString("id-ID", {
                                                    day: "2-digit",
                                                    month: "long",
                                                    year: "numeric",
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 text-center col-span-3">
                                    Belum ada program kerja.
                                </p>
                            )}
                        </div>
                    )}
                </div>

                {/* Modal Detail Proker */}
                {selectedProker && (
                    <div className="fixed inset-0 bg-[#00000066] backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full relative overflow-y-auto max-h-[90vh] animate-slide-up">
                            {/* Tombol Close */}
                            <button
                                className="absolute top-3 right-5 cursor-pointer text-gray-600 hover:text-gray-900 text-2xl"
                                onClick={() => setSelectedProker(null)}
                            >
                                <CrossIcon size={18} className="rotate-45 inline-block" />
                            </button>

                            {/* Isi Modal */}
                            <div className="p-6 mt-8">
                                <img
                                    src={
                                        selectedProker.gambar
                                            ? `http://localhost:8000/storage/${selectedProker.gambar}`
                                            : "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                                    }
                                    alt={selectedProker.nama}
                                    className="w-full h-64 object-cover rounded-lg mb-4"
                                />

                                <h2 className="text-2xl font-bold text-[#3674B5] mb-4">
                                    {selectedProker.nama}
                                </h2>

                                <div
                                    className="text-gray-700 prose max-w-none leading-relaxed mb-4"
                                    dangerouslySetInnerHTML={{ __html: selectedProker.deskripsi }}
                                />

                                <p className="text-sm text-gray-500">
                                    {new Date(selectedProker.tanggal).toLocaleDateString(
                                        "id-ID",
                                        {
                                            day: "2-digit",
                                            month: "long",
                                            year: "numeric",
                                        }
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </section>

            <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.4s ease-out;
        }
      `}</style>
        </div>
    );
};

export default Proker;
