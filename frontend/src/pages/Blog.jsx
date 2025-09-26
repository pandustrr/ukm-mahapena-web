import { useState, useEffect } from "react";
import axios from "axios";
import { Loader } from "lucide-react";
import { Link } from "react-router-dom";

const Blog = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = sessionStorage.getItem("adminToken");

    useEffect(() => {
        setIsVisible(true);

        const handleScroll = () => {
            const elements = document.querySelectorAll(".fade-in");
            elements.forEach((el) => {
                const elementTop = el.getBoundingClientRect().top;
                if (elementTop < window.innerHeight - 100) {
                    el.classList.add("visible");
                }
            });
        };

        window.addEventListener("scroll", handleScroll);
        handleScroll();

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // fetch api
    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                setLoading(true);

                const res = await axios.get("http://localhost:8000/api/blogs");

                // asumsi API kamu return { data: [...] }
                const payload = res.data;
                let list = [];

                // beberapa kemungkinan struktur response:
                if (Array.isArray(payload)) {
                    // API mengembalikan array langsung
                    list = payload;
                } else if (Array.isArray(payload.data)) {
                    // { data: [...] }
                    list = payload.data;
                } else if (payload.data && Array.isArray(payload.data.data)) {
                    // { data: { current_page:..., data: [...] } } (laravel paginate)
                    list = payload.data.data;
                } else {
                    // fallback: ambil property pertama yang berupa array (jika ada)
                    const maybeArray = Object.values(payload).find((v) =>
                        Array.isArray(v)
                    );
                    list = Array.isArray(maybeArray) ? maybeArray : [];
                }

                console.log("Normalized list (array):", list);
                setArticles(list);
            } catch (err) {
                console.error("Gagal mengambil data blog:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, []);

    return (
        <div className="overflow-hidden bg-white dark:bg-slate-900">
            {/* Hero Section */}
            <section className="relative pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden">
                {/* Background Image */}
                <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: `url(https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80)`
                    }}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#000000]/80 to-[#113F67]/60 dark:from-[#000000]/90 dark:to-[#113F67]/70"></div>
                    <div className="absolute inset-0 bg-[#000000]/20 dark:bg-[#000000]/30"></div>
                </div>

                <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1
                        className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white transform transition-all duration-1000 ${isVisible
                            ? "translate-y-0 opacity-100"
                            : "translate-y-10 opacity-0"
                            }`}
                    >
                        Blog{" "}
                        <span className="bg-gradient-to-r from-[#A1E3F9] to-[#FFFFFF] bg-clip-text text-transparent">
                            Mahapena
                        </span>
                    </h1>
                    <p className="text-lg md:text-xl text-white/90 mb-10 max-w-3xl mx-auto leading-relaxed">
                        Artikel dan berita terbaru seputar kegiatan kami
                    </p>
                </div>

                {/* Wave Divider */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 1440 120"
                        preserveAspectRatio="none"
                        className="w-full h-16 fill-white dark:fill-slate-900"
                    >
                        <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
                    </svg>
                </div>
            </section>

            {/* Articles Section */}
            <section className="py-16 bg-white dark:bg-slate-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Section Header */}
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white mb-4">
                            Artikel Terbaru
                        </h2>
                        <div className="w-20 h-1 bg-gradient-to-r from-[#3674B5] to-[#A1E3F9] mx-auto rounded-full mb-6"></div>
                        <p className="text-slate-600 dark:text-slate-300 text-lg max-w-2xl mx-auto">
                            Koleksi artikel dan berita terbaru dari UKM Mahapena
                        </p>
                    </div>

                    {/* Loading State */}
                    {loading ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="text-center">
                                <Loader className="animate-spin h-12 w-12 text-[#3674B5] mx-auto mb-4" />
                                <p className="text-slate-600 dark:text-slate-300">Memuat artikel...</p>
                            </div>
                        </div>
                    ) : articles.filter((article) => article.status === "published").length === 0 ? (
                        <div className="text-center py-16">
                            <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
                                <svg className="w-8 h-8 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                                </svg>
                            </div>
                            <h4 className="text-lg font-medium text-slate-500 dark:text-slate-400 mb-2">Belum Ada Artikel</h4>
                            <p className="text-slate-400 dark:text-slate-500">Artikel akan segera tersedia</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
                            {articles
                                .filter((article) => article.status === "published")
                                .map((article, index) => (
                                    <article
                                        key={index}
                                        className="fade-in bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-slate-200/50 dark:border-slate-700/50 group hover:scale-105 hover:-translate-y-1"
                                    >
                                        {/* Featured Image */}
                                        <div className="relative h-32 sm:h-40 md:h-44 lg:h-48 overflow-hidden bg-gradient-to-br from-[#3674B5]/10 to-[#A1E3F9]/20">
                                            {article.featured_image ? (
                                                <img
                                                    src={`http://localhost:8000/storage/${article.featured_image}`}
                                                    alt={article.title}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                    onError={(e) => {
                                                        e.target.style.display = 'none';
                                                        e.target.nextSibling.style.display = 'flex';
                                                    }}
                                                />
                                            ) : null}
                                            <div className="w-full h-full hidden items-center justify-center bg-gradient-to-br from-[#3674B5] to-[#5682B1] text-white">
                                                <div className="text-center">
                                                    <div className="w-12 h-12 md:w-16 md:h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                                                        <svg className="w-6 h-6 md:w-8 md:h-8" fill="currentColor" viewBox="0 0 24 24">
                                                            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
                                                        </svg>
                                                    </div>
                                                    <span className="text-xs md:text-sm font-medium">{article.title.charAt(0).toUpperCase()}</span>
                                                </div>
                                            </div>

                                            {/* Category Badge */}
                                            <div className="absolute top-2 left-2 md:top-4 md:left-4">
                                                <span className="px-2 py-1 md:px-3 bg-[#3674B5] text-white text-xs font-medium rounded-full">
                                                    Artikel
                                                </span>
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="p-3 md:p-4 lg:p-6">
                                            {/* Meta Info */}
                                            <div className="flex items-center gap-2 text-xs md:text-sm text-slate-500 dark:text-slate-400 mb-2 md:mb-3">
                                                <div className="flex items-center gap-1">
                                                    <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                                    </svg>
                                                    <span className="hidden sm:inline">
                                                        {new Date(article.created_at).toLocaleDateString("id-ID", {
                                                            day: "numeric",
                                                            month: "short",
                                                            year: "numeric"
                                                        })}
                                                    </span>
                                                    <span className="sm:hidden">
                                                        {new Date(article.created_at).toLocaleDateString("id-ID", {
                                                            day: "2-digit",
                                                            month: "short"
                                                        })}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Title */}
                                            <h3 className="text-sm md:text-base lg:text-lg font-bold text-slate-800 dark:text-white mb-2 md:mb-3 line-clamp-2 group-hover:text-[#3674B5] dark:group-hover:text-[#A1E3F9] transition-colors">
                                                {article.title}
                                            </h3>

                                            {/* Excerpt - Hidden on mobile for space */}
                                            <p className="hidden md:block text-slate-600 dark:text-slate-300 mb-3 md:mb-4 line-clamp-2 lg:line-clamp-3 text-sm leading-relaxed">
                                                {article.content.replace(/<[^>]+>/g, "").slice(0, 80)}...
                                            </p>

                                            {/* Read More */}
                                            <Link
                                                to={`/blog/detail/${article.id}`}
                                                className="inline-flex items-center gap-1 md:gap-2 text-[#3674B5] dark:text-[#A1E3F9] font-medium text-xs md:text-sm hover:gap-2 md:hover:gap-3 transition-all duration-300 group/link"
                                            >
                                                <span className="hidden sm:inline">Baca Selengkapnya</span>
                                                <span className="sm:hidden">Baca</span>
                                                <svg className="w-3 h-3 md:w-4 md:h-4 transition-transform group-hover/link:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                                                </svg>
                                            </Link>
                                        </div>

                                        {/* Bottom Border Accent */}
                                        <div className="h-1 bg-gradient-to-r from-[#3674B5] to-[#A1E3F9] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                                    </article>
                                ))}
                        </div>
                    )}
                </div>
            </section>

            <style jsx>{`
                .fade-in {
                    opacity: 0;
                    transform: translateY(20px);
                    transition: opacity 0.6s ease, transform 0.6s ease;
                }
                .fade-in.visible {
                    opacity: 1;
                    transform: translateY(0);
                }
                .line-clamp-2 {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
                .line-clamp-3 {
                    display: -webkit-box;
                    -webkit-line-clamp: 3;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }

                /* Custom scrollbar */
                ::-webkit-scrollbar {
                    width: 8px;
                }
                ::-webkit-scrollbar-track {
                    background: rgb(248 250 252);
                }
                .dark ::-webkit-scrollbar-track {
                    background: rgb(15 23 42);
                }
                ::-webkit-scrollbar-thumb {
                    background: rgb(148 163 184);
                    border-radius: 4px;
                }
                ::-webkit-scrollbar-thumb:hover {
                    background: rgb(100 116 139);
                }
                .dark ::-webkit-scrollbar-thumb {
                    background: rgb(71 85 105);
                }
                .dark ::-webkit-scrollbar-thumb:hover {
                    background: rgb(51 65 85);
                }

                /* Enhanced mobile optimizations */
                @media (max-width: 640px) {
                    .fade-in {
                        transform: scale(0.98) translateY(10px);
                    }
                    .fade-in.visible {
                        transform: scale(1) translateY(0);
                    }
                }

                /* Tablet optimizations */
                @media (min-width: 768px) and (max-width: 1023px) {
                    .grid-cols-2.lg\\:grid-cols-4 {
                        grid-template-columns: repeat(3, minmax(0, 1fr));
                    }
                }
            `}</style>
        </div>
    );
};

export default Blog;