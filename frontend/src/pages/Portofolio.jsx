import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL, STORAGE_URL } from "../config/api";

const Portofolio = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [prestasi, setPrestasi] = useState([]);
  const navigate = useNavigate();

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

  // Ambil data prestasi dari backend
  useEffect(() => {
    axios
      .get(`${API_URL}/portofolio`)
      .then((res) => setPrestasi(res.data))
      .catch((err) => console.error("Gagal ambil data portofolio:", err));
  }, []);

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="pt-28 pb-20 md:pt-36 md:pb-28 relative overflow-hidden">
        {/* Background with gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#3674B5] via-[#5682B1] to-[#A1E3F9]"></div>
        <div className="absolute inset-0 bg-black/20"></div>

        <div
          className="absolute inset-0 bg-repeat bg-contain"
          style={{
            backgroundImage: `url(/img/bg-5.jpg)`,
          }}
        >
          {/* Gradient overlay biar teks tetap jelas */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#000000]/80 to-[#000000]/60 dark:from-[#000000]/90 dark:to-[#113F67]/70"></div>

          {/* Noise overlay untuk efek tekstur halus */}
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
            Portofolio{" "}
            <span className="bg-gradient-to-r from-[#A1E3F9] to-white bg-clip-text text-transparent">
              Prestasi
            </span>
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-10 max-w-3xl mx-auto leading-relaxed">
            Dokumentasi pencapaian dan prestasi terbaik UKM Mahapena-FEB UNEJ
          </p>
        </div>
      </section>

      {/* Prestasi Section */}
      <section className="py-16 bg-gradient-to-br from-slate-50 via-white to-blue-50/20 dark:from-slate-900 dark:via-slate-800 dark:to-slate-800 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#A1E3F9]/20 to-[#3674B5]/10 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-[#5682B1]/15 to-[#3674B5]/10 rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3"></div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#3674B5] to-[#5682B1] bg-clip-text text-transparent mb-4">
              Daftar Prestasi
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-[#3674B5] to-[#A1E3F9] mx-auto rounded-full mb-6"></div>
            <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
              Koleksi pencapaian terbaik dari UKM Mahapena-FEB UNEJ
            </p>
          </div>

          {/* Prestasi Cards */}
          <div className="bg-white/80 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-slate-700">
            {prestasi.length === 0 ? (
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
                  Belum Ada Prestasi
                </h4>
                <p className="text-gray-500 dark:text-gray-400">
                  Data prestasi akan segera tersedia
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                {prestasi.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => navigate(`/portofolio/${item.id}`)}
                    className="fade-in group cursor-pointer bg-white/70 dark:bg-slate-700/80 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-slate-600 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 hover:scale-105 overflow-hidden"
                  >
                    {/* Image Container */}
                    <div className="relative overflow-hidden">
                      {item.gambar ? (
                        <div className="relative w-full aspect-[4/3] rounded-t-2xl overflow-hidden">
                          <img
                            src={`${STORAGE_URL}/${item.gambar}`}
                            alt={item.judul}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            onError={(e) => {
                              e.target.style.display = "none";
                              e.target.nextSibling.style.display = "flex";
                            }}
                          />
                          <div className="w-full h-full hidden items-center justify-center bg-gradient-to-r from-[#3674B5] to-[#5682B1] text-white font-bold text-4xl lg:text-6xl">
                            {item.judul.charAt(0).toUpperCase()}
                          </div>
                        </div>
                      ) : (
                        <div className="w-full aspect-[4/3] flex items-center justify-center bg-gradient-to-r from-[#3674B5] to-[#5682B1] text-white font-bold text-4xl lg:text-6xl rounded-t-2xl group-hover:from-[#A1E3F9] group-hover:to-[#3674B5] transition-all duration-300">
                          {item.judul.charAt(0).toUpperCase()}
                        </div>
                      )}

                      {/* Overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>

                    {/* Content */}
                    <div className="p-3 lg:p-4">
                      <h3 className="text-sm lg:text-base font-bold text-gray-800 dark:text-white mb-2 line-clamp-2 group-hover:text-[#3674B5] dark:group-hover:text-[#A1E3F9] transition-colors duration-300">
                        {item.judul}
                      </h3>
                      <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                        {item.deskripsi}
                      </p>

                      {/* Date Info */}
                      <div className="flex justify-between items-end">
                        <div className="text-left">
                          <p className="text-xs text-gray-500 dark:text-gray-400 italic mb-1">
                            Dibuat:
                          </p>
                          <p className="text-xs font-medium text-gray-600 dark:text-gray-300">
                            {new Date(item.created_at).toLocaleDateString(
                              "id-ID",
                              {
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                              }
                            )}{" "}
                            {new Date(item.created_at).toLocaleTimeString(
                              "id-ID",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </p>
                        </div>

                        {/* Arrow Icon */}
                        <svg
                          className="w-4 h-4 text-[#3674B5] dark:text-[#A1E3F9] opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                          ></path>
                        </svg>
                      </div>
                    </div>

                    {/* Decorative element */}
                    <div className="absolute top-3 right-3 w-2 h-2 bg-gradient-to-r from-[#3674B5] to-[#A1E3F9] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                ))}
              </div>
            )}
          </div>
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
      `}</style>
    </div>
  );
};

export default Portofolio;
