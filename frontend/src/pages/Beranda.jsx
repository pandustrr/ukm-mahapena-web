import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  Calendar,
  Clock,
  ArrowRight,
  Users,
  Trophy,
  Heart,
  Loader,
} from "lucide-react";
import { API_URL, STORAGE_URL} from "../config/api"; 


const Beranda = ({ setCurrentPage }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState([]);
  const [proker, setProker] = useState([]);

  useEffect(() => {
    setIsVisible(true);

    const handleScroll = () => {
      const elements = document.querySelectorAll(
        ".fade-in, .slide-in-left, .zoom-in"
      );
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
    const fetchProker = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/public/proker`);
        console.log(res.data);
        setProker(res.data);
      } catch (err) {
        console.error("Gagal mengambil data proker:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProker();
  }, []);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);

        const res = await axios.get(`${API_URL}/blogs`);
        const payload = res.data;
        let list = [];

        if (Array.isArray(payload)) {
          list = payload;
        } else if (Array.isArray(payload.data)) {
          list = payload.data;
        } else if (payload.data && Array.isArray(payload.data.data)) {
          list = payload.data.data;
        } else {
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
    <div className="overflow-hidden bg-white dark:bg-slate-900 scroll-smooth">
      {/* Hero Section */}
      <section className="relative pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden">
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
            className={`text-3xl md:text-4xl lg:text-6xl font-bold mb-6 text-white transform transition-all duration-1000 ${isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
              }`}
          >
            Selamat Datang di{" "}
            <span className="bg-gradient-to-r from-[#A1E3F9] to-[#FFFFFF] bg-clip-text text-transparent">
              UKM MAHAPENA
            </span>
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-10 max-w-3xl mx-auto leading-relaxed capitalize">
            Wadah para Mahasiswa Fakultas Ekonomi dan Bisnis Universitas Jember
            untuk mengekspresikan dirinya dalam ruang lingkup alam bebas maupun
            lingkungan hidup.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/profil">
              <button
                onClick={() => window.scrollTo(0, 0)} // scroll ke atas tetap boleh
                className="group relative overflow-hidden px-8 py-3 rounded-xl font-semibold
                 transition-all duration-300 flex items-center justify-center gap-2
                 backdrop-blur-sm
                 bg-white/10 text-white border border-white/50
                 hover:bg-[#3674B5]/90 hover:text-white hover:border-[#3674B5]
                 dark:bg-white/5 dark:text-[#A1E3F9] dark:border-[#A1E3F9]/50
                 dark:hover:bg-[#3674B5]/80 dark:hover:text-white"
              >
                {/* Efek shine */}
                <span
                  className="absolute inset-0 -translate-x-full 
                   bg-gradient-to-r from-transparent via-white/20 to-transparent
                   transition-transform duration-500 group-hover:translate-x-full"
                ></span>
                Profil
              </button>
            </Link>
          </div>
        </div>
        {/* Smooth Wave Transition */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 120"
            preserveAspectRatio="none"
            className="w-full h-16 fill-slate-50 dark:fill-slate-800"
          >
            <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
          </svg>
        </div>
      </section>

      {/* Program Unggulan */}
      <section className="relative py-16 bg-slate-50 dark:bg-slate-800">
        {/* Subtle Background Elements */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-20 right-10 w-72 h-72 bg-gradient-to-bl from-[#A1E3F9]/20 to-[#3674B5]/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-10 w-64 h-64 bg-gradient-to-tr from-[#5682B1]/15 to-[#3674B5]/10 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16 opacity-0 -translate-x-5 transition-all duration-700 [&.visible]:opacity-100 [&.visible]:translate-x-0 slide-in-left">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white mb-4">
              Program Unggulan
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-[#3674B5] to-[#A1E3F9] mx-auto rounded-full mb-6"></div>
            <p className="text-slate-600 dark:text-slate-300 text-lg max-w-2xl mx-auto capitalize">
              Berbagai program inovatif untuk mengembangkan minat dan bakat
              mahasiswa
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Pelatihan Rutin",
                desc: "Mengasah skill mahasiswa dalam bidang yang diminati.",
                icon: <Users className="w-8 h-8 text-[#3674B5]" />,
                gradient: "from-[#3674B5] to-[#5682B1]",
              },
              {
                title: "Kompetisi",
                desc: "Ajang kompetisi untuk menguji kemampuan dan keterampilan mahasiswa.",
                icon: <Trophy className="w-8 h-8 text-[#5682B1]" />,
                gradient: "from-[#5682B1] to-[#A1E3F9]",
              },
              {
                title: "Pengabdian",
                desc: "Menerapkan ilmu untuk memberi dampak positif kepada masyarakat.",
                icon: <Heart className="w-8 h-8 text-[#A1E3F9]" />,
                gradient: "from-[#A1E3F9] to-[#3674B5]",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="opacity-0 scale-90 transition-all duration-500 [&.visible]:opacity-100 [&.visible]:scale-100 zoom-in group bg-white dark:bg-slate-700 rounded-2xl p-8 shadow-lg hover:shadow-2xl hover:scale-105 hover:-translate-y-2 relative overflow-hidden border border-slate-200/50 dark:border-slate-600/50"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-5 transition-all duration-500`}
                ></div>

                <div className="relative z-10 text-center">
                  <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-600 dark:to-slate-700 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4 group-hover:text-[#3674B5] dark:group-hover:text-[#A1E3F9] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Wave Transition */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 80"
            preserveAspectRatio="none"
            className="w-full h-12 fill-white dark:fill-slate-900"
          >
            <path d="M0,40L80,42.7C160,45,320,51,480,48C640,45,800,33,960,32C1120,31,1280,41,1360,45.3L1440,48L1440,80L1360,80C1280,80,1120,80,960,80C800,80,640,80,480,80C320,80,160,80,80,80L0,80Z"></path>
          </svg>
        </div>
      </section>

      {/* Agenda Mendatang */}
      <section className="py-16 bg-white dark:bg-slate-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 opacity-0 -translate-x-5 transition-all duration-700 [&.visible]:opacity-100 [&.visible]:translate-x-0 slide-in-left">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white mb-4">
              Agenda Mendatang
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-[#3674B5] to-[#A1E3F9] mx-auto rounded-full mb-6"></div>
            <p className="text-slate-600 dark:text-slate-300 text-lg max-w-2xl mx-auto capitalize">
              Program kerja terbaru yang akan segera dilaksanakan
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-32">
              <Loader className=" h-8 w-8 text-[#3674B5] " />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {proker.length > 0 ? (
                getUpcomingProker(proker)
                  .slice(0, 3)
                  .map((item, index) => (
                    <article
                      key={index}
                      className="opacity-0 scale-90 transition-all duration-500 [&.visible]:opacity-100 [&.visible]:scale-100 zoom-in bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-2xl overflow-hidden border border-slate-200/50 dark:border-slate-700/50 group hover:scale-105 hover:-translate-y-1"
                      style={{ transitionDelay: `${index * 100}ms` }}
                    >
                      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-[#3674B5]/10 to-[#A1E3F9]/20">
                        {item.featured_image ? (
                          <img
                            src={`${STORAGE_URL}/${item.featured_image}`}
                            alt={item.nama}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#3674B5] to-[#5682B1] text-white">
                            <Calendar className="w-12 h-12" />
                          </div>
                        )}
                      </div>

                      <div className="p-6">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-3 group-hover:text-[#3674B5] dark:group-hover:text-[#A1E3F9] transition-colors">
                          {item.nama}
                        </h3>

                        <div
                          className="text-slate-600 dark:text-slate-300 mb-4 line-clamp-2 text-sm leading-relaxed"
                          dangerouslySetInnerHTML={{
                            __html:
                              item.deskripsi
                                ?.replace(/<[^>]+>/g, "")
                                .slice(0, 80) + "..." || "Tidak ada deskripsi",
                          }}
                        />

                        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {new Date(item.tanggal).toLocaleDateString(
                              "id-ID",
                              {
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                              }
                            )}
                          </span>
                        </div>
                      </div>
                    </article>
                  ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <Calendar className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-500 dark:text-slate-400">
                    Belum ada agenda mendatang
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              to="/proker"
              className="group relative overflow-hidden inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#3674B5] to-[#5682B1] text-white font-semibold rounded-xl hover:from-[#5682B1] hover:to-[#A1E3F9] transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover:translate-x-full"></span>
              Lihat Program Lainnya
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Berita Terbaru */}
      <section className="relative py-16 bg-slate-50 dark:bg-slate-800">
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-80 h-80 bg-gradient-to-br from-[#A1E3F9]/20 to-[#3674B5]/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-gradient-to-tl from-[#5682B1]/15 to-[#3674B5]/10 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16 opacity-0 -translate-x-5 transition-all duration-700 [&.visible]:opacity-100 [&.visible]:translate-x-0 slide-in-left">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white mb-4">
              Berita Terbaru
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-[#3674B5] to-[#A1E3F9] mx-auto rounded-full mb-6"></div>
            <p className="text-slate-600 dark:text-slate-300 text-lg max-w-2xl mx-auto capitalize">
              Artikel dan informasi terkini seputar kegiatan UKM Mahapena
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {articles.slice(0, 3).map((article, index) => (
              <article
                key={index}
                className="opacity-0 scale-90 transition-all duration-500 [&.visible]:opacity-100 [&.visible]:scale-100 zoom-in bg-white dark:bg-slate-700 rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden border border-slate-200/50 dark:border-slate-600/50 group hover:scale-105 hover:-translate-y-2"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-[#3674B5]/10 to-[#A1E3F9]/20">
                  {article.featured_image ? (
                    <img
                      src={`${STORAGE_URL}/${article.featured_image}`}
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#3674B5] to-[#5682B1] text-white">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                          <svg
                            className="w-6 h-6"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-3 line-clamp-2 group-hover:text-[#3674B5] dark:group-hover:text-[#A1E3F9] transition-colors">
                    {article.title}
                  </h3>

                  <p className="text-slate-600 dark:text-slate-300 mb-4 line-clamp-2 text-sm leading-relaxed">
                    {article.content.replace(/<[^>]+>/g, "").slice(0, 100)}...
                  </p>

                  <Link
                    to={`/blog/detail/${article.id}`}
                    className="inline-flex items-center gap-2 text-[#3674B5] dark:text-[#A1E3F9] font-medium text-sm hover:gap-3 transition-all duration-300 group/link"
                  >
                    Baca Selengkapnya
                    <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/blog"
              className="group relative overflow-hidden inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#3674B5] to-[#5682B1] text-white font-semibold rounded-xl hover:from-[#5682B1] hover:to-[#A1E3F9] transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover:translate-x-full"></span>
              Lihat Blog Lainnya
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Bottom Wave Transition */}
        {/* <div className="absolute bottom-0 left-0 right-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 80"
            preserveAspectRatio="none"
            className="w-full h-12 bg-transparent dark:fill-slate-900"
          >
            <path d="M0,40L80,42.7C160,45,320,51,480,48C640,45,800,33,960,32C1120,31,1280,41,1360,45.3L1440,48L1440,80L1360,80C1280,80,1120,80,960,80C800,80,640,80,480,80C320,80,160,80,80,80L0,80Z"></path>
          </svg>
        </div> */}
      </section>

      <section
        className="relative bg-cover bg-center bg-no-repeat h-[30rem] flex items-center justify-center"
        style={{
          backgroundImage:
            "url('https://images.pexels.com/photos/1884583/pexels-photo-1884583.jpeg')",
        }}
      >
        {/* Overlay gelap agar teks lebih terbaca */}
        <div className="absolute inset-0 bg-black/50"></div>

        {/* Wave atas */}
        <div className="absolute top-0 left-0 right-0 rotate-180 overflow-hidden leading-[0]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 320"
            preserveAspectRatio="none"
            className="w-full h-20 text-slate-50 dark:text-slate-800"
          >
            <path
              className="fill-current"
              d="M0,32L60,37.3C120,43,240,53,360,90.7C480,128,600,192,720,197.3C840,203,960,149,1080,112C1200,75,1320,53,1380,42.7L1440,32L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
            ></path>
          </svg>
        </div>

        {/* Wave bawah untuk menyatu dengan section selanjutnya */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-[0]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 80"
            preserveAspectRatio="none"
            className="w-full h-20"
          >
            <path
              className="fill-current text-white dark:text-slate-900"
              d="M0,40L80,42.7C160,45,320,51,480,48C640,45,800,33,960,32C1120,31,1280,41,1360,45.3L1440,48L1440,80L0,80Z"
            />
          </svg>
        </div>

        {/* Konten hero */}
        <div className="relative z-10 text-center text-white px-4">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg">
            Dukung Kami dengan Merchandise Resmi 🎉
          </h2>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-gray-200 capitalize">
            Dapatkan kaos, totebag, dan merchandise eksklusif. Setiap pembelian
            mendukung perkembangan Kami!
          </p>

          <Link
            to="/merchandise"
            className="group relative overflow-hidden inline-flex items-center gap-2 px-6 py-3 
             bg-gradient-to-r from-yellow-400 to-yellow-500 
             text-slate-900 font-semibold rounded-xl
             hover:from-yellow-500 hover:to-yellow-100 
             transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-500 group-hover:translate-x-full"></span>
            Lihat Semua Merchandise
          </Link>
        </div>
      </section>

      {/* CTA Contact Section */}
      <section className="py-16 bg-white dark:bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 opacity-0 -translate-x-5 transition-all duration-700 [&.visible]:opacity-100 [&.visible]:translate-x-0 slide-in-left">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white mb-4">
              Hubungi Kami!
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-lg max-w-2xl mx-auto capitalize">
              Mari kembangkan kreativitas, inovasi, dan jejaring bersama kami
              untuk masa depan yang lebih baik.
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200/50 dark:border-slate-700/50 p-8 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#3674B5] to-[#A1E3F9] rounded-full blur-3xl"></div>
            </div>

            <form
              action="https://formsubmit.co/mahapena.febunej@gmail.com"
              method="POST"
              className="space-y-6 relative z-10"
            >
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Masukkan nama lengkap"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3674B5] focus:border-transparent transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Masukkan alamat email"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3674B5] focus:border-transparent transition-all duration-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Pesan
                </label>
                <textarea
                  name="message"
                  rows="6"
                  placeholder="Tulis pesan Anda..."
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3674B5] focus:border-transparent transition-all duration-300 resize-none"
                />
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  className="group relative overflow-hidden inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#3674B5] to-[#5682B1] text-white font-semibold rounded-xl hover:from-[#5682B1] hover:to-[#A1E3F9] transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover:translate-x-full"></span>
                  Kirim Pesan
                  <ArrowRight size={16} />
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      <style jsx>{`
        /* Custom animations using Tailwind-compatible CSS */
        .fade-in,
        .slide-in-left,
        .zoom-in {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }

        .slide-in-left {
          transform: translateX(-20px);
        }

        .zoom-in {
          transform: scale(0.9);
        }

        .fade-in.visible,
        .slide-in-left.visible,
        .zoom-in.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .slide-in-left.visible {
          transform: translateX(0);
        }

        .zoom-in.visible {
          transform: scale(1);
        }

        /* Line clamp utility */
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* Staggered animation delays */
        .zoom-in:nth-child(1) {
          transition-delay: 0ms;
        }
        .zoom-in:nth-child(2) {
          transition-delay: 100ms;
        }
        .zoom-in:nth-child(3) {
          transition-delay: 200ms;
        }
        .zoom-in:nth-child(4) {
          transition-delay: 300ms;
        }
        .zoom-in:nth-child(5) {
          transition-delay: 400ms;
        }
        .zoom-in:nth-child(6) {
          transition-delay: 500ms;
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          @apply bg-slate-50 dark:bg-slate-900;
        }
        ::-webkit-scrollbar-thumb {
          @apply bg-slate-300 dark:bg-slate-600 rounded;
        }
        ::-webkit-scrollbar-thumb:hover {
          @apply bg-slate-400 dark:bg-slate-500;
        }

        /* Selection styling */
        ::selection {
          @apply bg-[#A1E3F9]/30 text-inherit;
        }
        .dark ::selection {
          @apply bg-[#3674B5]/40 text-inherit;
        }

        /* Enhanced focus states */
        input:focus,
        textarea:focus,
        button:focus {
          box-shadow: 0 0 0 3px rgba(54, 116, 181, 0.1);
        }

        /* Smooth gradient background animation */
        .bg-gradient-to-r,
        .bg-gradient-to-br {
          background-size: 200% 200%;
        }

        /* Pulse glow animation */
        @keyframes pulse-glow {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        .animate-pulse-glow {
          animation: pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        /* Responsive improvements */
        @media (max-width: 768px) {
          .zoom-in {
            transform: scale(0.95);
          }

          .zoom-in.visible {
            transform: scale(1);
          }
        }

        /* High contrast mode support */
        @media (prefers-contrast: high) {
          .text-slate-600 {
            @apply text-slate-800;
          }

          .dark .text-slate-300 {
            @apply dark:text-slate-100;
          }

          .border-slate-200\/50 {
            @apply border-slate-300;
          }

          .dark .border-slate-700\/50 {
            @apply dark:border-slate-600;
          }
        }

        /* Print styles */
        @media print {
          .shadow-lg,
          .shadow-xl,
          .shadow-2xl {
            box-shadow: none !important;
            @apply border border-slate-300;
          }

          .bg-gradient-to-r,
          .bg-gradient-to-br {
            @apply bg-[#3674B5] text-white;
          }

          .zoom-in,
          .fade-in,
          .slide-in-left {
            opacity: 1 !important;
            transform: none !important;
          }

          .hover\:scale-105:hover,
          .hover\:-translate-y-2:hover {
            transform: none !important;
          }
        }

        /* Reduce motion for accessibility */
        @media (prefers-reduced-motion: reduce) {
          .fade-in,
          .slide-in-left,
          .zoom-in,
          .transition-all,
          .transition-transform,
          .transition-colors {
            transition-duration: 0.01ms !important;
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            scroll-behavior: auto !important;
          }

          .hover\:scale-105:hover,
          .hover\:-translate-y-2:hover,
          .group-hover\:scale-110,
          .group-hover\:translate-x-1 {
            transform: none !important;
          }
        }

        /* Loading skeleton effect */
        @keyframes skeleton {
          0% {
            background-position: -200px 0;
          }
          100% {
            background-position: calc(200px + 100%) 0;
          }
        }

        .skeleton {
          background: linear-gradient(
            90deg,
            #f0f0f0 25%,
            #e0e0e0 50%,
            #f0f0f0 75%
          );
          background-size: 200px 100%;
          animation: skeleton 1.2s ease-in-out infinite;
        }

        .dark .skeleton {
          background: linear-gradient(
            90deg,
            #374151 25%,
            #4b5563 50%,
            #374151 75%
          );
        }

        /* Hover effects enhancement */
        .group:hover .group-hover\:scale-105 {
          transform: scale(1.05);
        }

        .group:hover .group-hover\:translate-x-1 {
          transform: translateX(0.25rem);
        }

        /* Button shimmer effect */
        .shimmer {
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.4),
            transparent
          );
          transform: translateX(-100%);
          transition: transform 0.6s;
        }

        .group:hover .shimmer {
          transform: translateX(100%);
        }

        /* Card hover shadow enhancement */
        .card-hover-shadow {
          transition: box-shadow 0.3s ease;
        }

        .card-hover-shadow:hover {
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }

        .dark .card-hover-shadow:hover {
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }
      `}</style>
    </div>
  );
};

export default Beranda;
