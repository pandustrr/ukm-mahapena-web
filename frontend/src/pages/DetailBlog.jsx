import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { ArrowLeft, Loader } from "lucide-react";

export default function BlogDetail() {
    const { id } = useParams();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`http://localhost:8000/api/blogs/${id}`);
                const blog = res.data.data;
                setBlog(blog);
            } catch (err) {
                console.error("Gagal mengambil data blog:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchBlog();
    }, [id]);

    if (loading) {
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
                            <Loader className="animate-spin w-8 h-8 text-white" />
                        </div>
                        <p className="text-gray-500 dark:text-gray-400">Memuat artikel...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!blog) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/20 dark:from-slate-900 dark:via-slate-800 dark:to-slate-800 relative overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#A1E3F9]/20 to-[#3674B5]/10 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
                    <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-[#5682B1]/15 to-[#3674B5]/10 rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3"></div>
                </div>
                
                <div className="flex items-center justify-center min-h-screen relative z-10">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-4">Artikel tidak ditemukan</h1>
                        <Link 
                            to="/blog"
                            className="text-[#3674B5] dark:text-[#A1E3F9] font-medium hover:underline"
                        >
                            Kembali ke Blog
                        </Link>
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

            <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-28">
                {/* Back Button */}
                <div className="mb-8">
                    <Link
                        to="/blog"
                        className="group inline-flex items-center gap-2 px-4 py-2 text-[#3674B5] dark:text-[#A1E3F9] bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-slate-600 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-[#3674B5] hover:text-white dark:hover:bg-[#A1E3F9] dark:hover:text-slate-800"
                    >
                        <ArrowLeft size={18} className="transition-transform duration-300 group-hover:-translate-x-1" />
                        Kembali ke Blog
                    </Link>
                </div>

                {/* Main Content Container */}
                <article className="bg-white/80 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700 overflow-hidden">
                    {/* Featured Image */}
                    <div className="relative">
                        <img
                            src={`http://localhost:8000/storage/${blog.featured_image}`}
                            alt={blog.title}
                            className="w-full h-64 md:h-96 object-cover"
                            onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                            }}
                        />
                        <div className="w-full h-64 md:h-96 hidden items-center justify-center bg-gradient-to-r from-[#3674B5] to-[#5682B1] text-white font-bold text-6xl">
                            {blog.title.charAt(0).toUpperCase()}
                        </div>
                        
                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                        
                        {/* Category Badge */}
                        <div className="absolute top-6 left-6">
                            <span className="px-4 py-2 bg-[#3674B5]/90 backdrop-blur-sm text-white text-sm font-semibold rounded-full border border-white/20">
                                {blog.category?.name || 'Artikel'}
                            </span>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-6 md:p-8">
                        {/* Title */}
                        <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-[#3674B5] to-[#5682B1] bg-clip-text text-transparent mb-6 leading-tight">
                            {blog.title}
                        </h1>

                        {/* Meta Information */}
                        <div className="flex flex-wrap items-center gap-4 mb-8 pb-6 border-b border-gray-200 dark:border-slate-600">
                            {/* Date */}
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                </svg>
                                <span>
                                    {new Date(blog.created_at).toLocaleDateString("id-ID", {
                                        day: "2-digit",
                                        month: "long",
                                        year: "numeric",
                                    })}
                                </span>
                            </div>
                            
                            
                            {/* Status Badge */}
                            {blog.status && (
                                <>
                                    <span className="text-gray-400">•</span>
                                    <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium rounded-full border border-green-200 dark:border-green-700 capitalize">
                                        {blog.status}
                                    </span>
                                </>
                            )}
                        </div>

                        {/* Content */}
                        <div className="prose prose-gray dark:prose-invert prose-lg max-w-none">
                            <div
                                className="text-gray-700 dark:text-gray-300 leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: blog.content }}
                            />
                        </div>
                    </div>
                </article>

                {/* Navigation Footer */}
                <div className="mt-8 text-center">
                    <Link
                        to="/blog"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#3674B5] to-[#5682B1] text-white font-semibold rounded-xl hover:from-[#5682B1] hover:to-[#A1E3F9] transition-all duration-300 hover:scale-105 hover:shadow-lg"
                    >
                        <ArrowLeft size={16} />
                        Lihat Artikel Lainnya
                    </Link>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-20 right-8 w-4 h-4 bg-gradient-to-r from-[#3674B5] to-[#A1E3F9] rounded-full opacity-20"></div>
                <div className="absolute bottom-20 left-8 w-3 h-3 bg-gradient-to-r from-[#5682B1] to-[#A1E3F9] rounded-full opacity-30"></div>
            </div>
        </div>
    );
}