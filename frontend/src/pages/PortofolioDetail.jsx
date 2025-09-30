import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import { API_URL, STORAGE_URL } from "../config/api";

const PortofolioDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);

    useEffect(() => {
        axios
            .get(`${API_URL}/portofolio/${id}`)
            .then((res) => setData(res.data))
            .catch((err) => console.error("Gagal ambil detail:", err));
    }, [id]);

    if (!data) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/20 dark:from-slate-900 dark:via-slate-800 dark:to-slate-800 relative overflow-hidden">
                {/* Background Elements */}
                <div className="absolute inset-0">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#A1E3F9]/20 to-[#3674B5]/10 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
                    <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-[#5682B1]/15 to-[#3674B5]/10 rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3"></div>
                </div>
                
                <div className="flex items-center justify-center min-h-screen relative z-10">
                    <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-[#3674B5] to-[#5682B1] rounded-full flex items-center justify-center shadow-lg animate-pulse">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"></path>
                            </svg>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400">Memuat data...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/20 dark:from-slate-900 dark:via-slate-800 dark:to-slate-800 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0">
                <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#A1E3F9]/20 to-[#3674B5]/10 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-[#5682B1]/15 to-[#3674B5]/10 rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3"></div>
            </div>

            <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-28">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="group flex items-center gap-2 mb-8 px-4 py-2 text-[#3674B5] dark:text-[#A1E3F9] bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-slate-600 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-[#3674B5] hover:text-white dark:hover:bg-[#A1E3F9] dark:hover:text-slate-800"
                >
                    <ArrowLeft size={18} className="transition-transform duration-300 group-hover:-translate-x-1" />
                    Kembali
                </button>

                {/* Main Content Container */}
                <div className="bg-white/80 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700 overflow-hidden">
                    {/* Image Section */}
                    {data.gambar && (
                        <div className="relative">
                            <img
                                src={`${STORAGE_URL}/${data.gambar}`}
                                alt={data.judul}
                                className="w-full h-64 md:h-96 object-cover"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                }}
                            />
                            <div className="w-full h-64 md:h-96 hidden items-center justify-center bg-gradient-to-r from-[#3674B5] to-[#5682B1] text-white font-bold text-6xl">
                                {data.judul.charAt(0).toUpperCase()}
                            </div>
                            
                            {/* Gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                        </div>
                    )}

                    {/* Content Section */}
                    <div className="p-6 md:p-8">
                        {/* Title */}
                        <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-[#3674B5] to-[#5682B1] bg-clip-text text-transparent mb-4">
                            {data.judul}
                        </h1>

                        {/* Meta Information */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 pb-6 border-b border-gray-200 dark:border-slate-600">
                            {/* Year Badge */}
                            <div className="inline-flex items-center">
                                <span className="px-4 py-2 text-sm font-semibold text-[#3674B5] dark:text-[#A1E3F9] bg-[#3674B5]/10 dark:bg-[#A1E3F9]/10 rounded-full border border-[#3674B5]/20 dark:border-[#A1E3F9]/20">
                                    Tahun: {data.tahun}
                                </span>
                            </div>
                            
                            {/* Created Date */}
                            <div className="text-right">
                                <p className="text-xs text-gray-500 dark:text-gray-400 italic mb-1">
                                    Dibuat:
                                </p>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                    {new Date(data.created_at).toLocaleDateString("id-ID", {
                                        day: "2-digit",
                                        month: "long",
                                        year: "numeric"
                                    })} {new Date(data.created_at).toLocaleTimeString("id-ID", {
                                        hour: "2-digit",
                                        minute: "2-digit"
                                    })}
                                </p>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="prose prose-gray dark:prose-invert max-w-none">
                            <div className="text-base md:text-lg text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                                {data.deskripsi}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-20 right-8 w-4 h-4 bg-gradient-to-r from-[#3674B5] to-[#A1E3F9] rounded-full opacity-20"></div>
                <div className="absolute bottom-20 left-8 w-3 h-3 bg-gradient-to-r from-[#5682B1] to-[#A1E3F9] rounded-full opacity-30"></div>
            </div>
        </div>
    );
};

export default PortofolioDetail;