// File: src/pages/Beranda.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";

const Beranda = ({ setCurrentPage }) => {
    // Terima prop setCurrentPage
    const [isVisible, setIsVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const [articles, setArticles] = useState([]);
    const [proker, setProker] = useState([]);

    useEffect(() => {
        AOS.init({
            duration: 1000, // durasi animasi
            once: true, // animasi hanya sekali
        });
    }, []);

    useEffect(() => {
        const fetchProker = async () => {
            try {
                setLoading(true);

                const res = await axios.get("http://localhost:8000/api/proker");
                console.log(res.data);
                // console.log("Isi proker state:", res.data);
                // console.log("Apakah array?", Array.isArray(res.data));

                setProker(res.data); // pastikan sesuai struktur API kamu
            } catch (err) {
                console.error("Gagal mengambil data proker:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProker();
    }, []);

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

    const getUpcomingProker = (proker) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // reset jam

        return proker.filter((item) => {
            const prokerDate = new Date(item.tanggal);
            prokerDate.setHours(0, 0, 0, 0);
            return prokerDate >= today;
        });
    };

    return (
        <div className="">
            {/* Hero Section */}
            <section className="pt-28 pb-20 h-[40rem] flex justify-center items-center md:pt-36 md:pb-28 relative text-white dark:text-[#A1E3F9] overflow-hidden">
                {/* Background Image */}
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage:
                            "url('https://i.pinimg.com/1200x/a6/bd/4d/a6bd4db7ee7053689bd971b36cbcd1ef.jpg')",
                    }}
                ></div>
                {/* Overlay supaya teks tetap jelas */}
                <div className="absolute inset-0 bg-black/50 dark:bg-black/70"></div>

                <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
                    <h1
                        className={`text-5xl md:text-6xl font-extrabold mb-6 leading-tight tracking-tight transform transition-all duration-1000 ${isVisible
                                ? "translate-y-0 opacity-100"
                                : "translate-y-10 opacity-0"
                            }`}
                    >
                        Selamat Datang di{" "}
                        <span className="bg-gradient-to-r from-[#A1E3F9] via-white to-[#A1E3F9] bg-clip-text text-transparent dark:from-[#3674B5] dark:to-[#5682B1]">
                            UKM MAHAPENA
                        </span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-200 dark:text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
                        Wadah pengembangan kreativitas dan inovasi mahasiswa untuk
                        mengeksplorasi potensi diri.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <button
                            onClick={() => {
                                setCurrentPage("Profil"); // Pindah ke halaman Profil
                                window.scrollTo(0, 0); // Scroll ke atas
                            }}
                            className="bg-transparent hover:bg-white/10 dark:hover:bg-[#3674B5]/20 text-white dark:text-[#A1E3F9] font-semibold py-3 px-8 rounded-lg border border-white dark:border-[#A1E3F9] transition-all duration-300 hover:scale-105"
                        >
                            Profil
                        </button>
                    </div>
                </div>

                {/* Wave Divider */}
                <div className="absolute bottom-0 left-0 right-0 overflow-hidden">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 1440 320"
                        preserveAspectRatio="none"
                        className="w-full h-20 text-white dark:text-blue-900 fill-current "
                    >
                        <path d="M0,64L80,106.7C160,149,320,235,480,234.7C640,235,800,149,960,128C1120,107,1280,149,1360,170.7L1440,192L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
                    </svg>
                </div>
            </section>

            {/* Program Unggulan */}
            <section
                className="py-16 h-[35rem] bg-white dark:bg-blue-900"
                data-aos="fade-up"
            >
                <div className="max-w-6xl mx-auto px-6">
                    <h2 className="text-3xl font-bold text-center mb-12 dark:text-white">
                        Program Unggulan
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                title: "Pelatihan Rutin",
                                desc: "Mengasah skill mahasiswa dalam bidang kreativitas dan inovasi.",
                                icon: "🎓",
                            },
                            {
                                title: "Kompetisi",
                                desc: "Ajang kompetisi untuk menguji kemampuan dan kreativitas mahasiswa.",
                                icon: "🏆",
                            },
                            {
                                title: "Pengabdian",
                                desc: "Menerapkan ilmu untuk memberi dampak positif kepada masyarakat.",
                                icon: "🤝",
                            },
                        ].map((item, i) => (
                            <div
                                key={i}
                                className="p-6 border dark:border-white rounded-2xl shadow hover:shadow-lg transition"
                            >
                                <div className="text-4xl mb-4">{item.icon}</div>
                                <h3 className="text-xl font-semibold mb-2  dark:text-white">
                                    {item.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-200">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Upcoming Events */}
            <section className="relative h-[50rem] flex justify-center items-center bg-[#3674B5]">
                {/* Wave atas */}
                <div className="z-20 absolute overflow-hidden top-0 left-0 right-0 leading-none transform -translate-y-20">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 1440 320"
                        preserveAspectRatio="none"
                        className="w-full h-20 text-[#3674B5] fill-current "
                    >
                        <path d="M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,154.7C672,160,768,192,864,192C960,192,1056,160,1152,154.7C1248,149,1344,171,1392,181.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                    </svg>
                </div>
                <div className="z-10 absolute overflow-hidden top-0 left-0 right-0 leading-none transform -translate-y-32">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 1440 320"
                        preserveAspectRatio="none"
                        className="w-full h-32 text-[#3673b59f] fill-current"
                    >
                        <path d="M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,154.7C672,160,768,192,864,192C960,192,1056,160,1152,154.7C1248,149,1344,171,1392,181.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                    </svg>
                </div>

                {/* Content */}
                <div
                    className="py-16 max-w-6xl mx-auto px-6 relative z-10 flex justify-center items-center flex-col"
                    data-aos="fade-up"
                >
                    <h2 className="text-3xl font-bold text-center text-white mb-12">
                        Agenda Mendatang
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {proker.length > 0 ? (
                            getUpcomingProker(proker)
                                .slice(0, 3)
                                .map((item, index) => (
                                    <div
                                        key={index}
                                        className="p-6 bg-white dark:bg-transparent border dark:border-white rounded-lg shadow"
                                    >
                                        <h3 className="text-xl font-semibold mb-2 dark:text-white">
                                            {item.nama}
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-200 mb-3 line-clamp-2">
                                            {item.deskripsi}
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-200">
                                            {new Date(item.tanggal).toLocaleDateString("id-ID", {
                                                day: "2-digit",
                                                month: "long",
                                                year: "numeric",
                                            })}
                                        </p>
                                    </div>
                                ))
                        ) : (
                            <p>Belum ada data proker</p>
                        )}
                    </div>
                    <Link
                        to="/blog"
                        className="mt-9 px-6 py-3 bg-blue-100 text-blue-600 dark:bg-blue-600 dark:text-white font-semibold rounded-lg shadow-xl hover:bg-blue-900 transition inline-block"
                    >
                        Lihat Program Lainnya..
                    </Link>
                </div>

                {/* Wave bawah */}
                <div className="absolute bottom-0 left-0 right-0 transform translate-y-16">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 1440 320"
                        preserveAspectRatio="none"
                        className="w-full h-20 text-[#3674B5] fill-current"
                    >
                        <path d="M0,64L48,74.7C96,85,192,107,288,133.3C384,160,480,192,576,181.3C672,171,768,117,864,117.3C960,117,1056,171,1152,197.3C1248,224,1344,224,1392,224L1440,224L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path>
                    </svg>
                </div>
                <div className="absolute bottom-0 left-0 right-0 transform translate-y-24">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 1440 320"
                        preserveAspectRatio="none"
                        className="w-full h-24 text-[#3673b59f] fill-current"
                    >
                        <path d="M0,64L48,74.7C96,85,192,107,288,133.3C384,160,480,192,576,181.3C672,171,768,117,864,117.3C960,117,1056,171,1152,197.3C1248,224,1344,224,1392,224L1440,224L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path>
                    </svg>
                </div>
            </section>

            {/* Berita Terbaru */}
            <section className="pt-16 bg-white dark:dark:bg-blue-900 h-[50rem] flex items-center justify-center">
                <div
                    className="max-w-6xl mx-auto px-6 flex items-center justify-center flex-col"
                    data-aos="fade-up"
                >
                    <h2 className="text-3xl font-bold text-center mb-12 dark:text-white">
                        Berita Terbaru
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {articles.slice(0, 3).map((article, index) => (
                            <div
                                key={index}
                                className="bg-gray-50 dark:bg-transparent dark:border dark:border-white rounded-lg overflow-hidden shadow hover:shadow-lg transition"
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
                                <div className="p-4">
                                    <h3 className="text-lg dark:text-white font-semibold mb-2">
                                        {article.title}
                                    </h3>
                                    <p className="text-gray-600 dark:text-white text-sm mb-3">
                                        {article.content.replace(/<[^>]+>/g, "").slice(0, 100)}...
                                    </p>
                                    <Link
                                        to={`/blog/${article}`}
                                        className="text-blue-600 dark:text-blue-100 hover:underline text-sm font-medium "
                                    >
                                        Baca selengkapnya →
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                    <Link
                        to="/blog"
                        className="mt-9 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-xl hover:bg-blue-900 transition inline-block"
                    >
                        Lihat Blog Lainnya..
                    </Link>
                </div>
            </section>

            {/* CTA Join */}
            <section className="py-20 bg-[#3674B5] text-white text-center">
                <div className="" data-aos="fade-up">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Hubungi Kami!</h2>
                    <p className="max-w-2xl mx-auto mb-8 text-lg text-blue-100">
                        Mari kembangkan kreativitas, inovasi, dan jejaring bersama kami
                        untuk masa depan yang lebih baik.
                    </p>

                    {/* Wrapper Form */}
                    <div className="max-w-2xl mx-auto bg-white dark:bg-blue-900 text-gray-800 rounded-xl shadow-lg p-8">
                        <form
                            action="https://formsubmit.co/slimekenyal123@gmail.com" // ganti sesuai endpoint email-mu
                            method="POST"
                            className="space-y-4"
                        >
                            {/* Nama Lengkap */}
                            <div className="text-left">
                                <label className="block font-semibold mb-1 dark:text-blue-100">
                                    Nama Lengkap
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Masukkan nama lengkap"
                                    required
                                    className="w-full px-4 py-3 border dark:border-white rounded-lg placeholder:text-gray-400  placeholder:dark:text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                            </div>

                            {/* Email */}
                            <div className="text-left">
                                <label className="block font-semibold mb-1 dark:text-blue-100">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Masukkan alamat email"
                                    required
                                    className="w-full px-4 py-3 border dark:border-white rounded-lg placeholder:text-gray-400  placeholder:dark:text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                            </div>

                            {/* Pesan */}
                            <div className="text-left">
                                <label className="block font-semibold mb-1 dark:text-blue-100">
                                    Pesan
                                </label>
                                <textarea
                                    name="message"
                                    rows="5"
                                    placeholder="Tulis pesan Anda..."
                                    required
                                    className="w-full px-4 py-3 border dark:border-white rounded-lg placeholder:text-gray-400  placeholder:dark:text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                            </div>

                            {/* Tombol Kirim */}
                            <div className="text-center">
                                <button
                                    type="submit"
                                    className="px-6 py-3 bg-[#3674B5] text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition"
                                >
                                    Kirim Pesan
                                </button>
                            </div>
                        </form>
                    </div>
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

export default Beranda;
