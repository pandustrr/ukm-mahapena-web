import { useState, useEffect } from "react";
import axios from "axios";
import { X, Loader } from "lucide-react";
import { API_URL, STORAGE_URL } from "../config/api";

const Proker = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [proker, setProker] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProker, setSelectedProker] = useState(null);

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
        setProker(res.data); // BUKAN res.data.data

        setProker(res.data || []);
      } catch (err) {
        console.error("Gagal mengambil data proker:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProker();
  }, []);

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="pt-28 pb-20 md:pt-36 md:pb-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#3674B5] via-[#5682B1] to-[#A1E3F9]"></div>
        <div className="absolute inset-0 bg-black/20"></div>

        <div
          className="absolute inset-0 bg-cover"
          style={{
            backgroundImage: `url(/img/bg-2.jpg)`,
            backgroundPosition: "center 62%",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#000000]/80 to-[#000000]/60 dark:from-[#000000]/90 dark:to-[#113F67]/70"></div>
          <div className="absolute inset-0 bg-noise opacity-10 dark:opacity-20"></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1
            className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white transform transition-all duration-1000 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            Program{" "}
            <span className="bg-gradient-to-r from-[#A1E3F9] to-white bg-clip-text text-transparent">
              Kerja
            </span>
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-10 max-w-3xl mx-auto leading-relaxed">
            Beberapa program kerja kami untuk peningkatan pengetahuan dan
            keterampilan mahasiswa
          </p>
        </div>
      </section>

      {/* Program Kerja Section */}
      <section className="py-16 bg-gradient-to-br from-slate-50 via-white to-blue-50/20 dark:from-slate-900 dark:via-slate-800 dark:to-slate-800 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#A1E3F9]/20 to-[#3674B5]/10 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-[#5682B1]/15 to-[#3674B5]/10 rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3"></div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Program Kerja Kami */}
          <div className="space-y-16">
            {/* Section Header */}
            <div className="text-center slide-in-left">
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#3674B5] to-[#5682B1] bg-clip-text text-transparent mb-4">
                Program Kerja Kami
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-[#3674B5] to-[#A1E3F9] mx-auto rounded-full mb-6"></div>
              <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
                Jelajahi program kerja Mahapena dan temukan berbagai kegiatan
                seru dan inspiratif
              </p>
            </div>

            {/* Loading State */}
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-[#3674B5] to-[#5682B1] rounded-full flex items-center justify-center shadow-lg animate-pulse">
                    <Loader className="animate-spin w-8 h-8 text-white" />
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">
                    Memuat program kerja...
                  </p>
                </div>
              </div>
            ) : proker.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-[#3674B5] to-[#5682B1] rounded-full flex items-center justify-center shadow-lg">
                  <svg
                    className="w-10 h-10 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    ></path>
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Belum Ada Program Kerja
                </h4>
                <p className="text-gray-500 dark:text-gray-400">
                  Program kerja akan segera tersedia
                </p>
              </div>
            ) : (
              /* Grid program kerja */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {proker.map((item, index) => (
                  <div
                    key={index}
                    className="zoom-in group cursor-pointer"
                    style={{ transitionDelay: `${index * 100}ms` }}
                    onClick={() => {
                      setSelectedProker({
                        ...item,
                        gambar: item.featured_image,
                      });
                    }}
                  >
                    <div className="relative bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-500 border border-gray-100 dark:border-slate-700 overflow-hidden group-hover:scale-105 group-hover:-translate-y-2">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#3674B5]/5 to-[#A1E3F9]/5 dark:from-[#3674B5]/10 dark:to-[#A1E3F9]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                      <div className="relative z-10 text-center">
                        {/* Program Image/Icon */}
                        <div className="w-16 h-16 mx-auto mb-4 rounded-xl overflow-hidden bg-gradient-to-br from-[#3674B5]/10 to-[#A1E3F9]/10 flex items-center justify-center group-hover:from-[#3674B5]/20 group-hover:to-[#A1E3F9]/20 transition-all duration-300">
                          {item.featured_image ? (
                            <img
                              src={`${STORAGE_URL}/${item.featured_image}`}
                              alt={item.nama}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.style.display = "none";
                                e.target.nextSibling.style.display = "flex";
                              }}
                            />
                          ) : null}
                          <div className="w-full h-full hidden items-center justify-center bg-gradient-to-br from-[#3674B5] to-[#5682B1] text-white font-bold text-2xl">
                            {item.nama.charAt(0).toUpperCase()}
                          </div>
                        </div>

                        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-3 group-hover:text-[#3674B5] dark:group-hover:text-[#A1E3F9] transition-colors duration-300">
                          {item.nama}
                        </h3>

                        {/* Date Badge */}
                        <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#3674B5]/10 to-[#A1E3F9]/10 dark:from-[#3674B5]/20 dark:to-[#A1E3F9]/20 rounded-full border border-[#3674B5]/20 dark:border-[#A1E3F9]/30 mb-3">
                          <span className="text-sm font-semibold text-[#3674B5] dark:text-[#A1E3F9]">
                            {new Date(item.tanggal).toLocaleDateString(
                              "id-ID",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              }
                            )}
                          </span>
                        </div>

                        {/* Description Preview */}
                        <div
                          className="text-xs text-gray-500 dark:text-gray-400 mb-3 line-clamp-2"
                          dangerouslySetInnerHTML={{
                            __html:
                              item.deskripsi
                                ?.replace(/<[^>]+>/g, "")
                                .slice(0, 60) + "..." || "Tidak ada deskripsi",
                          }}
                        />

                        <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                            Klik untuk detail →
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Modal Detail Proker */}
      {selectedProker && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm rounded-2xl shadow-2xl max-w-2xl w-full relative overflow-y-auto max-h-[90vh] border border-gray-200 dark:border-slate-600">
            {/* Tombol Close */}
            <button
              className="absolute top-4 right-4 z-10 p-2 bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm rounded-full hover:bg-gray-100 dark:hover:bg-slate-600 transition-all duration-300 hover:scale-110 shadow-lg"
              onClick={() => setSelectedProker(null)}
            >
              <X size={18} className="text-gray-600 dark:text-gray-300" />
            </button>

            {/* Isi Modal */}
            <div className="p-6">
              {/* Image */}
              {selectedProker.gambar ? (
                <img
                  src={`${STORAGE_URL}/${selectedProker.gambar}`}
                  alt={selectedProker.nama}
                  className="w-full h-64 object-cover rounded-xl mb-6 shadow-lg"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
              ) : null}
              <div className="w-full h-64 hidden items-center justify-center bg-gradient-to-r from-[#3674B5] to-[#5682B1] text-white font-bold text-6xl rounded-xl mb-6 shadow-lg">
                {selectedProker.nama.charAt(0).toUpperCase()}
              </div>

              {/* Title */}
              <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#3674B5] to-[#5682B1] bg-clip-text text-transparent mb-4">
                {selectedProker.nama}
              </h2>

              {/* Date Badge */}
              <div className="inline-flex items-center mb-6">
                <span className="px-4 py-2 text-sm font-semibold text-[#3674B5] dark:text-[#A1E3F9] bg-[#3674B5]/10 dark:bg-[#A1E3F9]/10 rounded-full border border-[#3674B5]/20 dark:border-[#A1E3F9]/20">
                  {new Date(selectedProker.tanggal).toLocaleDateString(
                    "id-ID",
                    {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    }
                  )}
                </span>
              </div>

              {/* Description */}
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <div
                  className="text-base text-gray-700 dark:text-gray-300 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: selectedProker.deskripsi }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
                .fade-in, .slide-in-left, .zoom-in {
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
                .fade-in.visible, .slide-in-left.visible, .zoom-in.visible {
                    opacity: 1;
                    transform: translateY(0);
                }
                .slide-in-left.visible {
                    transform: translateX(0);
                }
                .zoom-in.visible {
                    transform: scale(1);
                }
                .line-clamp-2 {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
            `}</style>
    </div>
  );
};

export default Proker;
