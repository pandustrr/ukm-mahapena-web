// File: src/pages/Blog.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import { Loader } from "lucide-react";
import { Link } from "react-router-dom";

const Blog = () => {
    // const [isVisible, setIsVisible] = useState(false);
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);

    // fetch api
    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                setLoading(true);

                const res = await axios.get("http://localhost:8000/api/admin/blogs");
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
        <div className="pt-24 pb-16 bg-white dark:bg-blue-900">
            {/* Header */}
            <section className="py-12 bg-gradient-to-r from-[#113F67] to-[#3674B5] dark:from-blue-100 dark:to-blue-300 text-white dark:text-gray-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl font-bold mb-4">Blog Mahapena</h1>
                    <p className="text-xl">
                        Artikel dan berita terbaru seputar kegiatan kami
                    </p>
                </div>
            </section>

            <section className="py-16 bg-white dark:bg-blue-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12 fade-in">
                        <h2 className="text-3xl font-bold text-[#3674B5] dark:text-blue-100">
                            Artikel Terbaru
                        </h2>
                        <div className="w-20 h-1 bg-[#A1E3F9] mx-auto mt-4"></div>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center h-64">
                            <Loader className="animate-spin h-8 w-8 text-blue-600" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {articles
                                .filter((article) => article.status === "published")
                                .map((article, index) => (
                                    <div
                                        key={index}
                                        className="fade-in bg-white dark:bg-blue-900 dark:border dark:border-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
                                    >
                                        <img
                                            src={
                                                article.featured_image
                                                    ? `http://localhost:8000/storage/${article.featured_image}`
                                                    : "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                                            }
                                            alt={article.title}
                                            className="w-full h-48 object-cover"
                                        />
                                        <div className="p-6">
                                            <span className="text-sm text-gray-500 dark:text-gray-100">
                                                {new Date(article.created_at).toLocaleDateString(
                                                    "id-ID",
                                                    {
                                                        day: "2-digit",
                                                        month: "long",
                                                        year: "numeric",
                                                    }
                                                )}
                                            </span>
                                            <h3 className="text-xl font-semibold text-[#3674B5] dark:text-blue-100 mb-3 mt-2">
                                                {article.title}
                                            </h3>
                                            <p className="text-gray-600 dark:text-gray-100 mb-4">
                                                {article.content.replace(/<[^>]+>/g, "").slice(0, 100)}
                                                ...
                                            </p>
                                            <button className="text-[#113F67] dark:text-[#91bbe0] font-medium hover:text-[#3674B5] transition-colors">
                                                <Link to={`/blog/detail/${article.id}`}>
                                                    Baca Selengkapnya →
                                                </Link>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    )}
                </div>
            </section>

            {/* <style jsx>{`
        .fade-in {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .fade-in.visible {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style> */}
        </div>
    );
};

export default Blog;
