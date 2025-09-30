import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL, STORAGE_URL } from "../config/api";

// Modal Component untuk detail alumni
const AlumniDetailModal = ({ isOpen, onClose, alumni }) => {
  if (!isOpen || !alumni) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative p-6 border-b border-gray-200 dark:border-slate-700">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-all duration-200"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <div className="flex items-center gap-4">
            {/* Foto Alumni */}
            <div className="relative w-20 h-20 rounded-2xl overflow-hidden shadow-lg border-2 border-[#5682B1]">
              {alumni.foto ? (
                <img
                  src={`${STORAGE_URL}/${alumni.foto}`}
                  alt={alumni.nama}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
              ) : null}
              <div
                className={`w-full h-full ${
                  alumni.foto ? "hidden" : "flex"
                } items-center justify-center bg-gradient-to-r from-[#5682B1] to-[#3674B5] text-white font-bold text-2xl`}
              >
                {alumni.nama.charAt(0).toUpperCase()}
              </div>
            </div>

            {/* Info Dasar */}
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">
                {alumni.nama}
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                {alumni.prodi} • Angkatan {alumni.angkatan}
              </p>
              {alumni.pekerjaan && (
                <div className="mt-2">
                  <span className="inline-block px-3 py-1 text-sm font-medium text-[#5682B1] bg-[#5682B1]/10 rounded-full border border-[#5682B1]/20">
                    {alumni.pekerjaan}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Body - Deskripsi */}
        <div className="p-6">
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <svg
              className="w-5 h-5 text-[#5682B1]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Deskripsi
          </h4>

          {alumni.deskripsi ? (
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                {alumni.deskripsi}
              </p>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <p className="text-gray-500 dark:text-gray-400">
                Belum ada deskripsi tersedia untuk alumni ini
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 pt-0">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-gradient-to-r from-[#3674B5] to-[#5682B1] hover:from-[#2d5a94] hover:to-[#4571a0] text-white font-medium rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

// Modal Component untuk Lambang MAHAPENA
const LogoModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-5xl bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative p-6 border-b border-gray-200 dark:border-slate-700 bg-gradient-to-r from-[#3674B5] to-[#5682B1] text-white rounded-t-2xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-all duration-200"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <div className="text-center">
            <h3 className="text-2xl font-bold mb-2">Lambang MAHAPENA</h3>
            <p className="text-white/90">
              Mahasiswa Pecinta Alam Fakultas Ekonomi Universitas Jember
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Logo Section */}
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="w-64 h-64 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-3xl p-6 shadow-2xl">
                  <div className="w-full h-full rounded-2xl flex items-center justify-center">
                    <img
                      src="/logo.png"
                      alt="Logo MAHAPENA"
                      className="w-full h-full object-contain drop-shadow-lg"
                      onError={(e) => {
                        // Fallback jika gambar tidak ditemukan
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                    {/* Fallback content */}
                    <div className="hidden w-full h-full bg-white/20 rounded-2xl items-center justify-center backdrop-blur-sm border border-white/30">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-white mb-2">
                          MAHAPENA
                        </div>
                        <div className="text-xs text-white/90">LOGO</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute -inset-4 bg-gradient-to-r from-[#3674B5]/20 to-[#A1E3F9]/20 rounded-3xl blur-xl"></div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-4 text-center">
                Tahun Berdiri:{" "}
                <span className="font-semibold">14 Maret 1977</span>
              </p>
            </div>

            {/* Description Section */}
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-3 flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-[#5682B1]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Makna Lambang
                </h4>
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    Lambang organisasi <strong>MAHAPENA</strong> Fakultas
                    Ekonomi Universitas Jember berbentuk{" "}
                    <strong>segi enam</strong> dengan makna yang mendalam dalam
                    setiap elemennya.
                  </p>
                </div>
              </div>

              {/* Kode Etik Section */}
              <div className="bg-gray-50 dark:bg-slate-700 rounded-xl p-4">
                <h5 className="font-semibold text-gray-800 dark:text-white mb-3">
                  Kode Etik Pecinta Alam Indonesia
                </h5>
                <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-[#5682B1] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Mengabdi kepada Tuhan Yang Maha Esa
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-[#5682B1] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Mengabdi kepada Bangsa dan Tanah Air
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-[#5682B1] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Menghormati tata kehidupan yang berlaku pada masyarakat
                    sekitarnya
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-[#5682B1] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Berusaha mempererat tali persaudaraan sesama pecinta alam
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-[#5682B1] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Berusaha saling membantu dan saling menghargai dalam
                    pelaksanaan pengabdian
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-[#5682B1] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Memelihara alam beserta isinya serta mempergunakan alam
                    sesuai dengan batas kebutuhan
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Detailed Explanation */}
          <div className="mt-8 space-y-6">
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-[#5682B1]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Penjelasan Detail Elemen Lambang
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Colors Section */}
              <div className="bg-white dark:bg-slate-700 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-slate-600">
                <h5 className="font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                  <div className="w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded mr-2"></div>
                  Makna Warna
                </h5>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <div className="w-4 h-4 bg-yellow-400 rounded-full mt-1 mr-3 flex-shrink-0"></div>
                    <div>
                      <span className="font-medium">Kuning:</span> Warna lambang
                      bendera Fakultas Ekonomi Universitas Jember
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-4 h-4 bg-orange-500 rounded-full mt-1 mr-3 flex-shrink-0"></div>
                    <div>
                      <span className="font-medium">Oranye:</span> Kehangatan,
                      melenyapkan perasaan tertekan, menimbulkan rasa gembira
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-4 h-4 bg-blue-800 rounded-full mt-1 mr-3 flex-shrink-0"></div>
                    <div>
                      <span className="font-medium">Biru Tua:</span>{" "}
                      Ketenteraman
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-4 h-4 bg-blue-400 rounded-full mt-1 mr-3 flex-shrink-0"></div>
                    <div>
                      <span className="font-medium">Biru Muda:</span> Keluasan,
                      mengurangi ketegangan, kesucian
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-4 h-4 bg-red-600 rounded-full mt-1 mr-3 flex-shrink-0"></div>
                    <div>
                      <span className="font-medium">Merah:</span> Keberanian,
                      semangat kerja
                    </div>
                  </div>
                </div>
              </div>

              {/* Symbols Section */}
              <div className="bg-white dark:bg-slate-700 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-slate-600">
                <h5 className="font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                  <svg
                    className="w-4 h-4 mr-2 text-[#5682B1]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 3l14 9-14 9V3z"
                    />
                  </svg>
                  Makna Simbol
                </h5>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="font-medium">
                      Lingkaran Tertutup Gunung:
                    </span>{" "}
                    Matahari, Bulan, atau Bintang (tata surya)
                  </div>
                  <div>
                    <span className="font-medium">Dua Gunung:</span> Sikap tegak
                    dari alam yang terbentang luas
                  </div>
                  <div>
                    <span className="font-medium">Tiga Puncak:</span> Bulan
                    berdirinya MAHAPENA (Maret)
                  </div>
                  <div>
                    <span className="font-medium">Burung Camar:</span> Lambang
                    utama MAHAPENA
                  </div>
                  <div>
                    <span className="font-medium">Kepala Menghadap Kanan:</span>{" "}
                    Aktivitas menuju kebaikan
                  </div>
                </div>
              </div>

              {/* Numbers Section */}
              <div className="bg-white dark:bg-slate-700 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-slate-600">
                <h5 className="font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                  <svg
                    className="w-4 h-4 mr-2 text-[#5682B1]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                    />
                  </svg>
                  Makna Angka
                </h5>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center">
                    <span className="bg-[#5682B1] text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3">
                      7
                    </span>
                    <div>Sayap Kanan & Kiri (7-7): Tahun berdiri 1977</div>
                  </div>
                  <div className="flex items-center">
                    <span className="bg-[#3674B5] text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3">
                      14
                    </span>
                    <div>Total sayap (14): Tanggal berdiri (14 Maret)</div>
                  </div>
                  <div className="flex items-center">
                    <span className="bg-[#A1E3F9] text-slate-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3">
                      5
                    </span>
                    <div>Ekor (5): Melambangkan Pancasila</div>
                  </div>
                </div>
              </div>

              {/* History Section */}
              <div className="bg-gradient-to-br from-[#3674B5]/5 to-[#A1E3F9]/5 dark:from-[#3674B5]/10 dark:to-[#A1E3F9]/10 rounded-xl p-6 border border-[#3674B5]/20 dark:border-[#A1E3F9]/30">
                <h5 className="font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                  <svg
                    className="w-4 h-4 mr-2 text-[#5682B1]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Sejarah Singkat
                </h5>
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  <p className="mb-2">
                    <strong>MAHAPENA</strong> merupakan singkatan dari{" "}
                    <strong>
                      Mahasiswa Pecinta Alam Fakultas Ekonomi Universitas Jember
                    </strong>
                  </p>
                  <p>
                    Didirikan khusus untuk Mahasiswa Fakultas Ekonomi
                    Universitas Jember pada <strong>14 Maret 1977</strong>,
                    dengan komitmen untuk mengembangkan karakter mahasiswa
                    melalui kegiatan pecinta alam.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 pt-0 border-t border-gray-200 dark:border-slate-700">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-gradient-to-r from-[#3674B5] to-[#5682B1] hover:from-[#2d5a94] hover:to-[#4571a0] text-white font-medium rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

const Profil = () => {
  const [isVisible, setIsVisible] = useState(false);

  const [divisi, setDivisi] = useState([]);
  const [selectedDivisi, setSelectedDivisi] = useState(null);

  // Data manajemen pengurus
  const [periodes, setPeriodes] = useState([]);
  const [selectedPeriode, setSelectedPeriode] = useState("");
  const [divisisPengurus, setDivisisPengurus] = useState([]);
  const [selectedDivisiPengurus, setSelectedDivisiPengurus] = useState("Semua");
  const [pengurus, setPengurus] = useState([]);

  const [alumni, setAlumni] = useState([]);

  // State untuk modal alumni
  const [isAlumniModalOpen, setIsAlumniModalOpen] = useState(false);
  const [selectedAlumni, setSelectedAlumni] = useState(null);

  // State untuk modal logo
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);

  // Fungsi untuk handle click alumni
  const handleAlumniClick = (alumniData) => {
    setSelectedAlumni(alumniData);
    setIsAlumniModalOpen(true);
  };

  // Fungsi untuk menutup modal alumni
  const closeAlumniModal = () => {
    setIsAlumniModalOpen(false);
    setSelectedAlumni(null);
  };

  // Fungsi untuk handle click logo
  const handleLogoClick = () => {
    setIsLogoModalOpen(true);
  };

  // Fungsi untuk menutup modal logo
  const closeLogoModal = () => {
    setIsLogoModalOpen(false);
  };

  // Animasi fade-in
  useEffect(() => {
    setIsVisible(true);
    const handleScroll = () => {
      const elements = document.querySelectorAll(
        ".slide-in-left, .slide-in-right, .zoom-in"
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

  // Fetch data divisi dari API Laravel
  useEffect(() => {
    const fetchDivisi = async () => {
      try {
        const res = await fetch(`${API_URL}/divisi`);
        const data = await res.json();
        setDivisi(data);
      } catch (error) {
        console.error("Gagal fetch divisi:", error);
      }
    };
    fetchDivisi();
  }, []);

  // Fetch periode publik
  useEffect(() => {
    const fetchPeriodes = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/periodes-with-pengurus-public`
        );
        setPeriodes(res.data);

        if (res.data.length > 0) {
          setSelectedPeriode(res.data[res.data.length - 1].id);
        }
      } catch (err) {
        console.error("Gagal ambil periode:", err);
      }
    };
    fetchPeriodes();
  }, []);

  // Ambil divisi per periode publik
  useEffect(() => {
    const fetchDivisis = async () => {
      if (!selectedPeriode) return;
      try {
        const res = await axios.get(
          `${API_URL}/divisi/periode/${selectedPeriode}`
        );
        setDivisisPengurus(res.data);

        if (res.data.length > 0) {
          setSelectedDivisiPengurus(res.data[res.data.length - 1].id);
        } else {
          setSelectedDivisiPengurus("Semua");
        }
      } catch (err) {
        console.error("Gagal ambil divisi:", err);
      }
    };
    fetchDivisis();
  }, [selectedPeriode]);

  // Ambil pengurus publik berdasarkan periode & divisi
  useEffect(() => {
    const fetchPengurus = async () => {
      if (!selectedPeriode) return;
      try {
        const params = { periode_id: selectedPeriode };
        if (selectedDivisiPengurus !== "Semua")
          params.divisi_id = selectedDivisiPengurus;

        const res = await axios.get(
          `${API_URL}/pengurus-public`,
          { params }
        );
        setPengurus(res.data);
      } catch (err) {
        console.error("Gagal ambil pengurus:", err);
      }
    };
    fetchPengurus();
  }, [selectedPeriode, selectedDivisiPengurus]);

  // Fetch data alumni dari API publik
  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        const res = await axios.get(`${API_URL}/alumni`);
        setAlumni(res.data);
      } catch (err) {
        console.error("Gagal ambil alumni:", err);
      }
    };
    fetchAlumni();
  }, []);

  return (
    <div className="relative">
      {/* Floating decorative elements */}
      <div className="fixed top-20 left-10 w-16 h-16 rounded-full bg-[#A1E3F9]/20 blur-xl z-0 animate-pulse-slow dark:bg-[#113F67]/30"></div>
      <div className="fixed top-1/3 right-16 w-20 h-20 rounded-full bg-[#3674B5]/20 blur-xl z-0 animate-pulse-medium dark:bg-[#5682B1]/30"></div>
      <div className="fixed bottom-40 left-1/4 w-24 h-24 rounded-full bg-[#113F67]/10 blur-xl z-0 animate-pulse-slow dark:bg-[#3674B5]/20"></div>

      {/* Header */}
      <section className="pt-28 pb-20 md:pt-36 md:pb-28 relative text-white overflow-hidden">
        <div
          className="absolute inset-0 bg-contain bg-center"
          style={{
            backgroundImage: `url(img/bg-1.jpg)`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#000000]/80 to-[#000000]/60 dark:from-[#000000]/90 dark:to-[#113F67]/70"></div>
          <div className="absolute inset-0 bg-noise opacity-10 dark:opacity-20"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#A1E3F9] to-[#FFFFFF] dark:from-[#A1E3F9] dark:to-[#5682B1]">
            Profil Mahapena
          </h1>
          <p className="mt-6 text-xl md:text-xl max-w-3xl mx-auto text-[#A1E3F9]/90 dark:text-[#A1E3F9] drop-shadow-sm">
            Mengenal lebih dekat UKM Mahapena dan berbagai divisi yang membangun
            kreativitas mahasiswa
          </p>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 via-white to-blue-50/20 dark:from-slate-900 dark:via-slate-800 dark:to-slate-800 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#A1E3F9]/20 to-[#3674B5]/10 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-[#5682B1]/15 to-[#3674B5]/10 rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3"></div>
          <div
            className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_#3674B5_1px,_transparent_0)] dark:bg-[radial-gradient(circle_at_1px_1px,_#A1E3F9_1px,_transparent_0)] opacity-[0.08] dark:opacity-[0.05]"
            style={{ backgroundSize: "50px 50px" }}
          ></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-32">
          {/* Tentang Kami */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Section Header */}
            <div className="lg:col-span-2 text-center mb-8 slide-in-left">
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#3674B5] to-[#5682B1] bg-clip-text text-transparent mb-4">
                Tentang Kami
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-[#3674B5] to-[#A1E3F9] mx-auto rounded-full mb-6"></div>
              <p className="text-gray-600 dark:text-gray-300 text-lg max-w-3xl mx-auto leading-relaxed">
                Mahapena merupakan salah satu Unit Kegiatan Mahasiswa tingkat
                fakultas yang berdiri sejak 14 Maret 1977. Mahapena merupakan
                wadah bagi mahasiswa S1 Fakultas Ekonomi dan Bisnis Universitas
                Jember untuk berkegiatan di alam bebas, berkontribusi bagi
                masyarakat, serta peduli terhadap pelestarian lingkungan.
              </p>
            </div>

            {/* Content Side */}
            <div className="slide-in-right space-y-8">
              {/* Stats Cards */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-slate-700 text-center transform hover:scale-105 transition-all duration-300">
                  <div className="text-2xl font-bold bg-gradient-to-r from-[#3674B5] to-[#5682B1] bg-clip-text text-transparent mb-2">
                    1977
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm font-medium">
                    Tahun Berdiri
                  </p>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-slate-700 text-center transform hover:scale-105 transition-all duration-300">
                  <div className="text-2xl font-bold bg-gradient-to-r from-[#3674B5] to-[#5682B1] bg-clip-text text-transparent mb-2">
                    600+
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm font-medium">
                    Alumni
                  </p>
                </div>
              </div>

              {/* Main Content */}
              <div className="space-y-6">
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-slate-700 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#3674B5] to-[#A1E3F9]"></div>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-xl1 pl-6">
                    Mahasiswa-FEB Unej didirikan pada tanggal 14 Maret 1977 yang
                    diprakarsai M. Istiqlal (M. 010001) dan kawan kawan. Latar
                    belakang pendirian Mahapena adalah mewadahai bakat minat
                    mahasiwa FEB Unej yang pada waktu itu memiliki hobi
                    jalan-jalan dan kepecintaalaman yang tinggi.
                  </p>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-slate-700 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#5682B1] to-[#3674B5]"></div>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-xl1 pl-6">
                    Dengan kepercayaan tinggi, keberanian, dan semangat sebagai
                    ujung tombaknya, Mahapena terus berkontribusi menciptakan
                    mahasiswa yang akademis, pecinta lingkungan, dan terus
                    berkontribusi terhadap masyarakat sekitar. Melalui program
                    dan kegiatannya dirancang untuk mengasah kemampuan soft
                    skill dan hard skill yang dibutuhkan di dunia profesional
                    dimasa mendatang.
                  </p>
                </div>
              </div>

              {/* Feature highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  {
                    icon: "🎨",
                    title: "Persaudaraan",
                    desc: "Mrnjunjung tinggi nilai persaudaraan",
                  },
                  {
                    icon: "🚀",
                    title: "Pengetahuan",
                    desc: "Meningkatkan pengetahuan mahasiswa",
                  },
                  {
                    icon: "💼",
                    title: "Keterampilan",
                    desc: "Membentuk keterampilan mahasiswa",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-md border border-gray-100 dark:border-slate-700 text-center group hover:shadow-lg transition-all duration-300"
                  >
                    <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-300">
                      {item.icon}
                    </div>
                    <h4 className="font-semibold text-gray-800 dark:text-white text-sm mb-1">
                      {item.title}
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-300">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Logo Side */}
            <div className="zoom-in relative">
              <div
                className="relative group cursor-pointer"
                onClick={handleLogoClick}
              >
                <div className="relative bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-2xl">
                  <div className="w-full h-80 bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform duration-500 shadow-inner">
                    <img
                      src="/logo.png"
                      alt="Logo MAHAPENA"
                      className="w-64 h-64 object-contain drop-shadow-2xl group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        // Fallback jika gambar tidak ditemukan
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                    {/* Fallback content */}
                    <div className="hidden w-full h-full items-center justify-center text-white">
                      <div className="text-center">
                        <div className="text-4xl font-bold mb-4">MAHAPENA</div>
                        <div className="text-lg">Fakultas Ekonomi</div>
                        <div className="text-sm mt-2">Universitas Jember</div>
                        <div className="text-xs mt-4 opacity-75">Est. 1977</div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute bottom-6 left-6 right-6 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm rounded-xl p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-sm font-medium text-gray-800 dark:text-white">
                      Logo MAHAPENA
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-300">
                      Klik untuk melihat makna lambang
                    </p>
                  </div>
                </div>
                <div className="absolute -top-6 -right-6 w-12 h-12 bg-yellow-400 rounded-full opacity-60 animate-pulse"></div>
                <div
                  className="absolute -bottom-4 -left-4 w-8 h-8 bg-orange-500 rounded-full opacity-40 animate-pulse"
                  style={{ animationDelay: "1s" }}
                ></div>

                {/* Click indicator */}
                <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Dasar & Tujuan */}
          <div className="space-y-16">
            {/* Section Header */}
            <div className="text-center zoom-in">
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#3674B5] to-[#5682B1] bg-clip-text text-transparent mb-4">
                Dasar & Tujuan
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-[#3674B5] to-[#A1E3F9] mx-auto rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Dasar Card */}
              <div className="zoom-in group">
                <div className="relative bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-slate-700 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#3674B5]/5 to-[#A1E3F9]/5 dark:from-[#3674B5]/10 dark:to-[#A1E3F9]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  <div className="relative z-10 flex items-center mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#3674B5] to-[#5682B1] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <svg
                        className="w-8 h-8 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                        Dasar
                      </h3>
                    </div>
                  </div>

                  <div className="relative z-10">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                      Organisasi ini berdasarkan persaudaraan serta kecintaan
                      terhadap terciptanya kelestarian alam semesta sebagai
                      pencerminan mahasiswa yang taqwa terhadap Tuhan Yang Maha
                      Pencipta.
                    </p>
                  </div>
                </div>
              </div>

              {/* Tujuan Card */}
              <div
                className="zoom-in group"
                style={{ transitionDelay: "200ms" }}
              >
                <div className="relative bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-slate-700 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#5682B1]/5 to-[#3674B5]/5 dark:from-[#5682B1]/10 dark:to-[#3674B5]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  <div className="relative z-10 flex items-center mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#5682B1] to-[#3674B5] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <svg
                        className="w-8 h-8 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                        Tujuan
                      </h3>
                    </div>
                  </div>

                  <div className="relative z-10">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                      Terbinanya mahasiswa akademis, pecinta, pengabdi kepada
                      bumi Indonesia beserta lingkungannya untuk lebih
                      mendekatkan diri kepada Penciptanya.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Divisi Kami */}
          <div className="space-y-16">
            {/* Section Header */}
            <div className="text-center slide-in-left">
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#3674B5] to-[#5682B1] bg-clip-text text-transparent mb-4">
                Divisi Kami
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-[#3674B5] to-[#A1E3F9] mx-auto rounded-full mb-6"></div>
              <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
                Jelajahi berbagai divisi yang membentuk Pengetahuan dan
                Keterampilan Anggota
              </p>
            </div>

            {/* Grid divisi */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {divisi.map((d, index) => (
                <div
                  key={d.id}
                  className="zoom-in group cursor-pointer"
                  style={{ transitionDelay: `${index * 100}ms` }}
                  onClick={() => setSelectedDivisi(d)}
                >
                  <div className="relative bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-500 border border-gray-100 dark:border-slate-700 overflow-hidden group-hover:scale-105 group-hover:-translate-y-2">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#3674B5]/5 to-[#A1E3F9]/5 dark:from-[#3674B5]/10 dark:to-[#A1E3F9]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    <div className="relative z-10 text-center">
                      <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-3 group-hover:text-[#3674B5] dark:group-hover:text-[#A1E3F9] transition-colors duration-300">
                        {d.nama}
                      </h3>

                      <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#3674B5]/10 to-[#A1E3F9]/10 dark:from-[#3674B5]/20 dark:to-[#A1E3F9]/20 rounded-full border border-[#3674B5]/20 dark:border-[#A1E3F9]/30">
                        <span className="text-sm font-semibold text-[#3674B5] dark:text-[#A1E3F9]">
                          {d.singkatan}
                        </span>
                      </div>

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
          </div>
        </div>
      </section>

      {/* Modal detail divisi */}
      {selectedDivisi && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <div
            className="bg-white dark:bg-slate-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-gray-200 dark:border-slate-600 animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Modal */}
            <div className="relative p-6 bg-gray-50 dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
              <div className="flex justify-between items-start">
                <div className="flex-1 text-center">
                  <h3 className="text-2xl font-semibold mb-2 text-gray-800 dark:text-white">
                    {selectedDivisi.nama_divisi || selectedDivisi.nama}
                  </h3>
                  <div className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-[#3674B5]/10 to-[#A1E3F9]/10 dark:from-[#3674B5]/20 dark:to-[#A1E3F9]/20 rounded-full border border-[#3674B5]/20 dark:border-[#A1E3F9]/30">
                    <span className="text-sm font-medium text-[#3674B5] dark:text-[#A1E3F9]">
                      {selectedDivisi.singkatan_divisi ||
                        selectedDivisi.singkatan}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedDivisi(null)}
                  className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 transition-all duration-200 border border-gray-200 dark:border-slate-600 hover:scale-110"
                >
                  <svg
                    className="w-4 h-4 text-gray-600 dark:text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Konten Modal */}
            <div className="p-6 dark:bg-slate-800 dark:text-white bg-gradient-to-b from-gray-50/50 to-white dark:from-slate-700/50 dark:to-slate-800 rounded-b-2xl max-h-[70vh] overflow-y-auto">
              <div className="space-y-6">
                {/* Pengertian Section - Hanya tampil jika ada data baru */}
                {selectedDivisi.pengertian && (
                  <div className="relative">
                    <div className="absolute -top-2 left-0 w-10 h-0.5 bg-gradient-to-r from-[#3674B5] to-[#A1E3F9] rounded-full"></div>
                    <div className="pt-3">
                      <h4 className="text-base font-medium text-gray-800 dark:text-white mb-3 flex items-center">
                        <svg
                          className="w-4 h-4 mr-2 text-[#3674B5]"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                          />
                        </svg>
                        Pengertian
                      </h4>
                      <div className="prose max-w-none dark:prose-invert">
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm font-light whitespace-pre-line">
                          {selectedDivisi.pengertian}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Judul Deskripsi Section - Hanya tampil jika ada data baru */}
                {selectedDivisi.judul_deskripsi && (
                  <div className="relative">
                    <div className="absolute -top-2 left-0 w-10 h-0.5 bg-gradient-to-r from-[#5682B1] to-[#A1E3F9] rounded-full"></div>
                    <div className="pt-3">
                      <h4 className="text-base font-medium text-gray-800 dark:text-white mb-3 flex items-center">
                        <svg
                          className="w-4 h-4 mr-2 text-[#5682B1]"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                          />
                        </svg>
                        {selectedDivisi.judul_deskripsi}
                      </h4>
                    </div>
                  </div>
                )}

                {/* Section Tugas dan Fungsi */}
                <div className="relative">
                  <div className="absolute -top-4 left-0 w-10 h-0.5 bg-gradient-to-r from-[#3674B5] to-[#A1E3F9] rounded-full"></div>
                  <div className="pt-3">
                    <div className="prose max-w-none dark:prose-invert">
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm font-light whitespace-pre-line">
                        {selectedDivisi.deskripsi}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pengurus & Alumni Section */}
      <section className="py-16 bg-gradient-to-br from-slate-50 via-white to-blue-50/20 dark:from-slate-900 dark:via-slate-800 dark:to-slate-800 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#A1E3F9]/20 to-[#3674B5]/10 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-[#5682B1]/15 to-[#3674B5]/10 rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3"></div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
          {/* Pengurus Section */}
          <div className="space-y-8">
            {/* Section Header */}
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#3674B5] to-[#5682B1] bg-clip-text text-transparent mb-4">
                Struktur Pengurus
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-[#3674B5] to-[#A1E3F9] mx-auto rounded-full mb-6"></div>
              <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
                Kenali para pengurus UKM Mahapena-FEB Unej yang berdedikasi
                dalam mengembangkan Pengetahuan dan Keterampilan mahasiswa
              </p>
            </div>

            {/* Filter Controls */}
            <div className="bg-white/80 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-slate-700 mb-8">
              <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                {/* Periode Select */}
                <div className="flex-1 w-full">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Periode
                  </label>
                  <div className="relative">
                    <select
                      className="w-full border border-gray-200 dark:border-slate-600 rounded-xl p-3 bg-white dark:bg-slate-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-[#3674B5] focus:border-transparent transition-all duration-300 pl-4 pr-10 appearance-none shadow-sm"
                      value={selectedPeriode}
                      onChange={(e) => setSelectedPeriode(e.target.value)}
                    >
                      {periodes.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.nama_periode}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        ></path>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Divisi Filter */}
                <div className="flex-1 w-full">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Divisi
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 shadow-sm ${
                        selectedDivisiPengurus === "Semua"
                          ? "bg-gradient-to-r from-[#3674B5] to-[#5682B1] text-white shadow-md transform scale-105"
                          : "bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600 hover:scale-105"
                      }`}
                      onClick={() => setSelectedDivisiPengurus("Semua")}
                    >
                      Semua
                    </button>
                    {divisisPengurus.map((d) => (
                      <button
                        key={d.id}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 shadow-sm ${
                          selectedDivisiPengurus === d.id
                            ? "bg-gradient-to-r from-[#3674B5] to-[#5682B1] text-white shadow-md transform scale-105"
                            : "bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600 hover:scale-105"
                        }`}
                        onClick={() => setSelectedDivisiPengurus(d.id)}
                      >
                        {d.nama}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Pengurus List */}
            <div className="bg-white/80 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-slate-700">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                  Daftar Pengurus
                </h3>
                <div className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-slate-700 px-3 py-1 rounded-full">
                  {pengurus.length} anggota
                </div>
              </div>

              {pengurus.length === 0 ? (
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
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                      ></path>
                    </svg>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Tidak Ada Pengurus
                  </h4>
                  <p className="text-gray-500 dark:text-gray-400">
                    Tidak ada pengurus untuk filter yang dipilih
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                  {pengurus.map((p) => (
                    <div
                      key={p.id}
                      className="group bg-white/70 dark:bg-slate-700/80 backdrop-blur-sm rounded-2xl p-3 lg:p-6 border border-gray-200 dark:border-slate-600 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 hover:scale-105"
                    >
                      {/* Foto Pengurus - Portrait dengan Overlay */}
                      <div className="relative mb-3 lg:mb-4">
                        <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden shadow-lg border-3 border-[#5682B1] group-hover:border-[#A1E3F9] transition-all duration-300">
                          {p.foto ? (
                            <>
                              <img
                                src={`${STORAGE_URL}/${p.foto}`}
                                alt={p.nama}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                onError={(e) => {
                                  e.target.style.display = "none";
                                  e.target.nextSibling.style.display = "flex";
                                }}
                              />
                              <div className="w-full h-full hidden items-center justify-center bg-gradient-to-r from-[#3674B5] to-[#5682B1] text-white font-bold text-4xl lg:text-6xl">
                                {p.nama.charAt(0).toUpperCase()}
                              </div>
                            </>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-[#3674B5] to-[#5682B1] text-white font-bold text-4xl lg:text-6xl group-hover:from-[#A1E3F9] group-hover:to-[#3674B5] transition-all duration-300">
                              {p.nama.charAt(0).toUpperCase()}
                            </div>
                          )}

                          {/* Badge Divisi di pojok kanan atas */}
                          {p.divisi && (
                            <div className="absolute top-2 lg:top-3 right-2 lg:right-3">
                              <span className="px-2 lg:px-3 py-1 text-xs font-semibold text-white bg-[#5682B1]/80 rounded-full shadow-md border border-[#5682B1]/30">
                                {p.divisi.nama_divisi}
                              </span>
                            </div>
                          )}

                          {/* Overlay gradient */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

                          {/* Nama & Prodi overlay */}
                          <div className="absolute bottom-0 left-0 right-0 p-2 lg:p-4">
                            <h5 className="font-bold text-sm lg:text-lg text-white drop-shadow-lg">
                              {p.nama}
                            </h5>
                            <p className="text-xs lg:text-sm text-white/90 font-medium drop-shadow-md">
                              {p.prodi} ({p.angkatan})
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Jabatan - Clean centered layout */}
                      <div className="text-center">
                        <div className="inline-block">
                          <span className="px-3 lg:px-4 py-1 lg:py-2 text-xs lg:text-sm font-semibold text-[#3674B5] dark:text-[#A1E3F9] bg-[#3674B5]/10 dark:bg-[#A1E3F9]/10 rounded-full border border-[#3674B5]/20 dark:border-[#A1E3F9]/20 group-hover:bg-[#3674B5] group-hover:text-white dark:group-hover:bg-[#A1E3F9] dark:group-hover:text-slate-800 transition-all duration-300">
                            {p.jabatan}
                          </span>
                        </div>
                      </div>

                      {/* Decorative element */}
                      <div className="absolute top-4 right-4 w-2 h-2 bg-gradient-to-r from-[#3674B5] to-[#A1E3F9] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Alumni Section */}
          <div className="space-y-8">
            {/* Section Header */}
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#3674B5] to-[#5682B1] bg-clip-text text-transparent mb-4">
                Alumni Mahapena
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-[#3674B5] to-[#A1E3F9] mx-auto rounded-full mb-6"></div>
              <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
                Kenali para alumni Anggota luar biasa yang telah berkontribusi
                dan melanjutkan perjalanan kreatif mereka
              </p>
            </div>

            {/* Alumni List */}
            <div className="bg-white/80 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-slate-700">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                  Daftar Alumni
                </h3>
                <div className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-slate-700 px-3 py-1 rounded-full">
                  {alumni.length} alumni
                </div>
              </div>

              {alumni.length === 0 ? (
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
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Belum Ada Alumni
                  </h4>
                  <p className="text-gray-500 dark:text-gray-400">
                    Data alumni akan segera tersedia
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                  {alumni.map((a) => (
                    <div
                      key={a.id}
                      onClick={() => handleAlumniClick(a)}
                      className="group bg-white/70 dark:bg-slate-700/80 backdrop-blur-sm rounded-2xl p-3 lg:p-6 border border-gray-200 dark:border-slate-600 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 hover:scale-105 cursor-pointer"
                    >
                      {/* Foto Alumni - Portrait dengan Overlay */}
                      <div className="relative mb-3 lg:mb-4">
                        <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden shadow-lg border-3 border-[#5682B1] group-hover:border-[#A1E3F9] transition-all duration-300">
                          {a.foto ? (
                            <>
                              <img
                                src={`${STORAGE_URL}/${a.foto}`}
                                alt={a.nama}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                onError={(e) => {
                                  e.target.style.display = "none";
                                  e.target.nextSibling.style.display = "flex";
                                }}
                              />
                              <div className="w-full h-full hidden items-center justify-center bg-gradient-to-r from-[#5682B1] to-[#3674B5] text-white font-bold text-4xl lg:text-6xl">
                                {a.nama.charAt(0).toUpperCase()}
                              </div>
                            </>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-[#5682B1] to-[#3674B5] text-white font-bold text-4xl lg:text-6xl group-hover:from-[#A1E3F9] group-hover:to-[#5682B1] transition-all duration-300">
                              {a.nama.charAt(0).toUpperCase()}
                            </div>
                          )}

                          {/* Badge Pekerjaan di pojok kanan atas */}
                          {a.pekerjaan && (
                            <div className="absolute top-2 lg:top-3 right-2 lg:right-3">
                              <span className="px-2 lg:px-3 py-1 text-xs font-semibold text-white bg-[#5682B1]/80 rounded-full shadow-md border border-[#5682B1]/30">
                                {a.pekerjaan}
                              </span>
                            </div>
                          )}

                          {/* Overlay gradient */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

                          {/* Nama & Prodi overlay */}
                          <div className="absolute bottom-0 left-0 right-0 p-2 lg:p-4">
                            <h5 className="font-bold text-sm lg:text-lg text-white drop-shadow-lg">
                              {a.nama}
                            </h5>
                            <p className="text-xs lg:text-sm text-white/90 font-medium drop-shadow-md">
                              {a.prodi} ({a.angkatan})
                            </p>
                          </div>

                          {/* Click indicator */}
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20">
                            <div className="bg-white/90 rounded-full p-3 transform scale-75 group-hover:scale-100 transition-transform duration-300">
                              <svg
                                className="w-6 h-6 text-[#5682B1]"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Deskripsi Preview - hanya jika ada dan singkat */}
                      {a.deskripsi && (
                        <div className="text-center mt-2">
                          <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                            {a.deskripsi}
                          </p>
                        </div>
                      )}

                      {/* Decorative element */}
                      <div className="absolute top-4 right-4 w-2 h-2 bg-gradient-to-r from-[#5682B1] to-[#A1E3F9] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Modal Alumni Detail */}
      <AlumniDetailModal
        isOpen={isAlumniModalOpen}
        onClose={closeAlumniModal}
        alumni={selectedAlumni}
      />

      {/* Modal Logo MAHAPENA */}
      <LogoModal isOpen={isLogoModalOpen} onClose={closeLogoModal} />

      <style>{`
                .slide-in-left {
                    opacity: 0;
                    transform: translateX(-30px);
                    transition: opacity 0.8s ease, transform 0.8s ease;
                }
                
                .slide-in-left.visible {
                    opacity: 1;
                    transform: translateX(0);
                }
                
                .slide-in-right {
                    opacity: 0;
                    transform: translateX(30px);
                    transition: opacity 0.8s ease, transform 0.8s ease;
                }
                
                .slide-in-right.visible {
                    opacity: 1;
                    transform: translateX(0);
                }
                
                .zoom-in {
                    opacity: 0;
                    transform: scale(0.95);
                    transition: opacity 0.5s ease, transform 0.5s ease;
                }
                
                .zoom-in.visible {
                    opacity: 1;
                    transform: scale(1);
                }
                
                .bg-noise {
                    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
                }
                
                @keyframes pulse {
                    0%, 100% { opacity: 0.2; }
                    50% { opacity: 0.4; }
                }
                
                .animate-pulse-slow {
                    animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
                
                .animate-pulse-medium {
                    animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
                
                .pattern-dots {
                    background-image: radial-gradient(currentColor 1px, transparent 1px);
                    background-size: 10px 10px;
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
            `}</style>
    </div>
  );
};

export default Profil;
