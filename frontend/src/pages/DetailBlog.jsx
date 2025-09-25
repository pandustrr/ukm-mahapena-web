import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { ArrowLeftCircle, Loader } from "lucide-react";

export default function BlogDetail() {
    const { id } = useParams(); // Ambil id blog dari URL
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch data blog sesuai id
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
            <div className="flex items-center justify-center h-64">
                <Loader className="animate-spin h-8 w-8 text-blue-600" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-10">
            <div className="mb-6">
                <Link
                    to="/blog"
                    className="inline-flex items-center text-blue-600 font-medium hover:underline"
                >
                    <ArrowLeftCircle size={22} className="mr-2" />
                    Kembali
                </Link>
            </div>

            {/* Gambar Utama */}
            <div className="mb-6">
                <img
                    src={`http://localhost:8000/storage/${blog.featured_image}`}
                    alt={blog.title}
                    className="w-full rounded-lg shadow-md object-cover max-h-[400px]"
                />
            </div>

            {/* Judul */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
                {blog.title}
            </h1>

            {/* Info Tambahan */}
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                {/* <span>{new Date(blog.created_at).toLocaleDateString("id-ID")}</span> */}
                <span>
                    {new Date(blog.created_at).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "long", // <-- otomatis jadi nama bulan
                        year: "numeric",
                    })}
                </span>
                <span>•</span>
                <span className="capitalize">{blog.category?.name}</span>
                <span>•</span>
                <span className="capitalize">{blog.status}</span>
            </div>

            {/* Konten */}
            <div
                className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: blog.content }}
            />
        </div>
    );
}
