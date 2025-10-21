import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL, STORAGE_URL } from "../config/api";

const Merchandise = () => {
  // const tokenAdmin = localStorage.getItem('tokenAdmin');

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  // const [selectedCategory, setSelectedCategory] = useState("all");

  const [isVisible, setIsVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("detail");

  const [showModalTerimakasih, setShowModalTerimakasih] = useState(false);

  const [PenguranganStok, setPenguranganStok] = useState(products); // isi awal dari products

  const [formData, setFormData] = useState({
    nama: "",
    noWa: "",
    alamat: "",
    catatan: "",
    jumlah: 1,
    ukuran: "",
    warna: "",
  });

  const handlePesan = (product) => {
    setSelectedProduct(product);

    setFormData({
      nama: "",
      noWa: "",
      alamat: "",
      catatan: "",
      jumlah: 1,
      ukuran: product.sizes && product.sizes.length > 0 ? product.sizes[0] : "",
      warna:
        product.colors && product.colors.length > 0 ? product.colors[0] : "",
    });

    setActiveTab("detail");
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleJumlahChange = (change) => {
    setFormData((prev) => {
      const newJumlah = prev.jumlah + change;
      if (newJumlah < 1) return { ...prev, jumlah: 1 };
      if (selectedProduct && newJumlah > selectedProduct.stock)
        return { ...prev, jumlah: selectedProduct.stock };
      return { ...prev, jumlah: newJumlah };
    });
  };

  const handleWhatsAppOrder = () => {
    if (!selectedProduct) return;
    setShowModalTerimakasih(true);
  };

  // Fungsi ketika klik OK di modal
  const confirmOrderAndGoWhatsApp = async () => {
    try {
      // 1. Kurangi stok di backend
      const response = await fetch(
        `${API_URL}/merchandise/${selectedProduct.id}/decrease-stock-public`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ jumlah: formData.jumlah }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        setShowModalTerimakasih(false);
        return;
      }

      // 2. Update stok di frontend
      setPenguranganStok((prev) =>
        prev.map((p) =>
          p.id === selectedProduct.id ? { ...p, stock: data.stock } : p
        )
      );

      // 3. Tutup modal
      setShowModalTerimakasih(false);

      // 4. Redirect ke WhatsApp
      const message =
        `Halo, saya ingin memesan merchandise:\n\n` +
        `*Nama Produk:* ${selectedProduct.name}\n` +
        `*Harga:* ${selectedProduct.price}\n` +
        `*Jumlah:* ${formData.jumlah}\n` +
        (formData.ukuran ? `*Ukuran:* ${formData.ukuran}\n` : "") +
        (formData.warna ? `*Warna:* ${formData.warna}\n` : "") +
        `*Total:* ${formData.jumlah * parseFloat(selectedProduct.price)}\n\n` +
        `*Data Pemesan:*\n` +
        `Nama: ${formData.nama}\n` +
        `No. WhatsApp: ${formData.noWa}\n` +
        `Alamat: ${formData.alamat}\n` +
        (formData.catatan ? `Catatan: ${formData.catatan}\n` : "");

      const encodedMessage = encodeURIComponent(message);
      const phoneNumber = "6285133237793";
      window.open(
        `https://wa.me/${phoneNumber}?text=${encodedMessage}`,
        "_blank"
      );
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat memesan.");
      setShowModalTerimakasih(false);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${API_URL}/categories`);
        const categoriesFromApi = res.data;
        setCategories([{ id: "all", name: "Semua" }, ...categoriesFromApi]);
      } catch (err) {
        console.error("Gagal ambil data kategori:", err);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${API_URL}/merchandises`);
        setProducts(res.data);
      } catch (err) {
        console.error("Gagal ambil produk:", err);
      }
    };
    fetchProducts();
  }, []);

  // Filter produk berdasarkan kategori
  const filteredProducts =
    selectedCategory === null
      ? products
      : products.filter(
          (product) => product.category_id === Number(selectedCategory)
        );

  useEffect(() => {
    setIsVisible(true);
    const handleScroll = () => {
      const elements = document.querySelectorAll(
        ".slide-in-left, .slide-in-right, .zoom-in, zoom-out"
      );
      elements.forEach((el) => {
        if (!el.closest(".modal")) {
          const elementTop = el.getBoundingClientRect().top;
          if (elementTop < window.innerHeight - 5) {
            el.classList.add("visible");
          }
        }
      });
    };
    window.addEventListener("scroll", handleScroll);

    // Gunakan setTimeout untuk memastikan DOM sudah ter-render
    setTimeout(() => {
      handleScroll();
    }, 50);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative">
      {/* Floating decorative elements */}
      <div className="fixed top-20 left-10 w-16 h-16 rounded-full bg-[#A1E3F9]/20 blur-xl z-0 animate-pulse-slow dark:bg-[#113F67]/30"></div>
      <div className="fixed top-1/3 right-16 w-20 h-20 rounded-full bg-[#3674B5]/20 blur-xl z-0 animate-pulse-medium dark:bg-[#5682B1]/30"></div>
      <div className="fixed bottom-40 left-1/4 w-24 h-24 rounded-full bg-[#113F67]/10 blur-xl z-0 animate-pulse-slow dark:bg-[#3674B5]/20"></div>

      {/* Header bg */}
      <section className="pt-28 pb-20 md:pt-36 md:pb-28 relative text-white overflow-hidden">
        <div
          className="absolute inset-0 bg-cover"
          style={{
            backgroundImage: `url(/img/bg-3.jpg)`,
            backgroundPosition: "center 82%",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#000000]/80 to-[#000000]/60 dark:from-[#000000]/90 dark:to-[#113F67]/70"></div>
          <div className="absolute inset-0 bg-noise opacity-10 dark:opacity-20"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#A1E3F9] to-[#FFFFFF] dark:from-[#A1E3F9] dark:to-[#5682B1]">
            Mahapena Merchandise
          </h1>
          <p className="mt-6 text-xl md:text-2xl max-w-3xl mx-auto text-[#A1E3F9]/90 dark:text-[#A1E3F9] drop-shadow-sm">
            Dukung kreativitas mahasiswa dengan merchandise eksklusif karya
            anggota UKM Mahapena-FEB UNEJ
          </p>

          {/* Animated scroll indicator */}
          <div className="mt-16 animate-bounce"></div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden">
          <svg
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="w-full h-16 fill-current text-[#FFFFFF] dark:text-slate-800"
          >
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V56.44Z"></path>
          </svg>
        </div>
      </section>

      {/* Kategori & Produk  */}
      <section className="py-20 bg-gradient-to-br from-slate-50 via-white to-blue-50/20 dark:from-slate-900 dark:via-slate-800 dark:to-slate-800 relative overflow-hidden">
        {/* Modern background elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-[#3674B5]/10 to-[#A1E3F9]/15 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-tl from-[#5682B1]/10 to-[#3674B5]/10 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>

        {/* Floating decorative elements */}
        <div className="absolute top-20 left-20 w-4 h-4 bg-[#3674B5]/30 rounded-full animate-pulse"></div>
        <div
          className="absolute bottom-20 right-20 w-6 h-6 bg-[#A1E3F9]/40 rounded-full animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>

        {/* Subtle pattern overlay */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_#3674B5_1px,_transparent_0)] dark:bg-[radial-gradient(circle_at_1px_1px,_#A1E3F9_1px,_transparent_0)] opacity-[0.04] dark:opacity-[0.02]"
            style={{ backgroundSize: "80px 80px" }}
          ></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#3674B5] to-[#5682B1] bg-clip-text text-transparent mb-4 leading-[1.3]">
              Kategori Produk
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-[#3674B5] to-[#A1E3F9] mx-auto rounded-full mb-6"></div>
            <p className="text-gray-600 dark:text-gray-300 text-lg max-w-3xl mx-auto leading-relaxed">
              Jelajahi berbagai kategori merchandise eksklusif kami yang
              dirancang khusus untuk anggota Mahapena
            </p>
          </div>

          {/*  Category Filter */}
          <div className="flex flex-col items-center space-y-8 mb-16">
            {/* Category Pills Container */}
            <div className="relative">
              {/* Background glow effect */}
              <div className="absolute -inset-2 bg-gradient-to-r from-[#3674B5]/20 to-[#A1E3F9]/20 rounded-2xl blur-xl opacity-60"></div>

              <div className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-2 border border-gray-200/50 dark:border-slate-600/50 shadow-xl">
                <div className="flex flex-wrap justify-center gap-2">
                  {/* Semua Button */}
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`relative px-5 py-3 rounded-lg font-medium text-xs transition-all duration-300 transform hover:scale-105
                                            ${
                                              selectedCategory === null
                                                ? "bg-gradient-to-r from-[#3674B5] to-[#5682B1] text-white shadow-md scale-105"
                                                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-[#3674B5] dark:hover:text-[#A1E3F9]"
                                            }`}
                  >
                    {selectedCategory === null && (
                      <div className="absolute inset-0 bg-gradient-to-r from-[#3674B5] to-[#5682B1] rounded-lg blur-sm opacity-50"></div>
                    )}
                    <span className="relative flex items-center space-x-1">
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 11H5m14-4l-4 4m0 0v6m0-6H7"
                        ></path>
                      </svg>
                      <span>Semua</span>
                    </span>
                  </button>

                  {/* Category Buttons */}
                  {categories
                    .filter(
                      (category) => category.name.toLowerCase() !== "semua"
                    )
                    .map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`relative px-4 py-2 rounded-lg font-medium text-xs transition-all duration-300 transform hover:scale-105
          ${
            selectedCategory === category.id
              ? "bg-gradient-to-r from-[#3674B5] to-[#5682B1] text-white shadow-md scale-105"
              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-[#3674B5] dark:hover:text-[#A1E3F9]"
          }`}
                      >
                        {selectedCategory === category.id && (
                          <div className="absolute inset-0 bg-gradient-to-r from-[#3674B5] to-[#5682B1] rounded-lg blur-sm opacity-50"></div>
                        )}
                        <span className="relative">{category.name}</span>
                      </button>
                    ))}
                </div>
              </div>
            </div>

            {/* Modern Progress Indicator */}
            <div className="flex flex-col items-center space-y-3">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-[#3674B5] dark:bg-[#A1E3F9] animate-pulse"></div>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                  {selectedCategory === null
                    ? "Menampilkan semua kategori"
                    : `Kategori: ${
                        categories.find((cat) => cat.id === selectedCategory)
                          ?.name
                      }`}
                </p>
                <div
                  className="w-2 h-2 rounded-full bg-[#3674B5] dark:bg-[#A1E3F9] animate-pulse"
                  style={{ animationDelay: "1s" }}
                ></div>
              </div>

              {/* Enhanced Progress Bar */}
              <div className="relative w-40 h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-slate-700 dark:to-slate-600"></div>

                {/* Progress fill */}
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#3674B5] to-[#A1E3F9] transition-all duration-700 ease-out rounded-full shadow-lg"
                  style={{
                    width: `${
                      selectedCategory === null
                        ? 100
                        : (categories.findIndex(
                            (cat) => cat.id === selectedCategory
                          ) +
                            1) *
                          (100 /
                            (categories.filter(
                              (cat) => cat.name.toLowerCase() !== "semua"
                            ).length +
                              1))
                    }%`,
                  }}
                >
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                </div>

                {/* Progress indicator dot */}
                <div
                  className="absolute top-1/2 transform -translate-y-1/2 w-4 h-4 bg-white border-2 border-[#3674B5] rounded-full shadow-lg transition-all duration-700 ease-out"
                  style={{
                    left: `${
                      selectedCategory === null
                        ? 92
                        : (categories.findIndex(
                            (cat) => cat.id === selectedCategory
                          ) +
                            1) *
                            (100 /
                              (categories.filter(
                                (cat) => cat.name.toLowerCase() !== "semua"
                              ).length +
                                1)) -
                          8
                    }%`,
                  }}
                ></div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            {filteredProducts.map((product, index) => (
              <div
                key={product.id}
                className="zoom-in group relative"
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                {/* Product Card */}
                <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-slate-700 group-hover:scale-105">
                  {/* Background glow effect */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#3674B5]/20 to-[#A1E3F9]/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {/* Image Container */}
                  <div className="relative h-32 md:h-48 overflow-hidden rounded-t-2xl">
                    <img
                      src={`${STORAGE_URL}/${product.image}`}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    {/* Category Badge */}
                    <div className="absolute top-2 right-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm text-[#3674B5] dark:text-[#A1E3F9] px-2 py-1 rounded-lg text-xs font-medium border border-white/20 shadow-sm">
                      {product.category?.name}
                    </div>

                    {/* Stock Badge */}
                    <div
                      className={`absolute top-2 left-2 px-2 py-1 rounded-lg text-xs font-medium shadow-sm backdrop-blur-sm border border-white/20
                                ${
                                  product.stock > 0
                                    ? "bg-green-500/90 text-white"
                                    : "bg-red-500/90 text-white"
                                }`}
                    >
                      {product.stock > 0 ? `${product.stock}` : "Habis"}
                    </div>

                    {/* Quick Action Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <button
                        onClick={() => handlePesan(product)}
                        disabled={product.stock === 0}
                        className={`px-6 py-3 rounded-2xl font-semibold text-sm backdrop-blur-sm border shadow-xl transform scale-90 group-hover:scale-100 transition-all duration-300
                                        ${
                                          product.stock === 0
                                            ? "bg-gray-500/80 text-white border-gray-400/50 cursor-not-allowed"
                                            : "bg-white/95 dark:bg-slate-800/95 text-[#3674B5] dark:text-[#A1E3F9] border-white/50 hover:bg-[#3674B5] hover:text-white hover:border-[#3674B5]/50"
                                        }`}
                      >
                        {product.stock === 0 ? "Stok Habis" : "Lihat Detail"}
                      </button>
                    </div>
                  </div>

                  {/* Content Area */}
                  <div className="p-3 md:p-4 relative">
                    {/* Product Name */}
                    <h3 className="text-sm md:text-lg font-bold text-gray-800 dark:text-white mb-2 group-hover:text-[#3674B5] dark:group-hover:text-[#A1E3F9] transition-colors duration-300 line-clamp-2">
                      {product.name}
                    </h3>

                    {/* Price */}
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-lg md:text-xl font-bold bg-gradient-to-r from-[#3674B5] to-[#5682B1] bg-clip-text text-transparent">
                        {product.price}
                      </p>
                      {product.stock > 0 && (
                        <div className="flex items-center text-green-600 dark:text-green-400 text-xs font-medium">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                          <span className="hidden md:inline">Tersedia</span>
                        </div>
                      )}
                    </div>

                    {/* Stock Progress Bar */}
                    <div className="mb-4">
                      <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-1.5 rounded-full transition-all duration-500 ${
                            product.stock > 10
                              ? "bg-gradient-to-r from-green-400 to-green-600"
                              : product.stock > 5
                              ? "bg-gradient-to-r from-yellow-400 to-orange-500"
                              : "bg-gradient-to-r from-red-400 to-red-600"
                          }`}
                          style={{
                            width:
                              product.stock > 20
                                ? "100%"
                                : `${(product.stock / 20) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <button
                      onClick={() => handlePesan(product)}
                      disabled={product.stock === 0}
                      className={`w-full font-medium py-2.5 md:py-3 px-3 md:px-4 rounded-xl transition-all duration-300 flex items-center justify-center space-x-1 md:space-x-2 text-sm md:text-base
                                    ${
                                      product.stock === 0
                                        ? "bg-gray-400 dark:bg-gray-600 text-gray-200 cursor-not-allowed"
                                        : "bg-gradient-to-r from-[#3674B5] to-[#5682B1] hover:from-[#2c5a9e] hover:to-[#1e4a73] text-white shadow-lg hover:shadow-xl transform hover:scale-105"
                                    }`}
                    >
                      {product.stock === 0 ? (
                        <span className="flex items-center space-x-1">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728"
                            ></path>
                          </svg>
                          <span>Habis</span>
                        </span>
                      ) : (
                        <span className="flex items-center space-x-1 md:space-x-2">
                          <svg
                            className="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.016a9.97 9.97 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.936 9.936 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.864 3.488" />
                          </svg>
                          <span className="hidden md:inline">
                            Pesan Via WhatsApp
                          </span>
                          <span className="md:hidden">Pesan</span>
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredProducts.length === 0 && (
            <div className="text-center py-20 fade-in">
              <div className="relative mx-auto w-32 h-32 mb-8">
                {/* Background circle with gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#3674B5]/20 to-[#A1E3F9]/20 rounded-full"></div>

                {/* Inner content */}
                <div className="relative w-full h-full bg-white dark:bg-slate-800 rounded-full flex items-center justify-center border border-gray-200 dark:border-slate-600 shadow-lg">
                  <svg
                    className="w-12 h-12 text-gray-400 dark:text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    ></path>
                  </svg>
                </div>

                {/* Floating dots */}
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-[#3674B5] rounded-full animate-bounce"></div>
                <div
                  className="absolute -bottom-2 -left-2 w-3 h-3 bg-[#A1E3F9] rounded-full animate-bounce"
                  style={{ animationDelay: "1s" }}
                ></div>
              </div>

              <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-4">
                Tidak ada produk ditemukan
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-lg max-w-md mx-auto leading-relaxed">
                Coba pilih kategori lain atau kembali ke semua kategori untuk
                melihat lebih banyak pilihan produk menarik
              </p>

              {/* Suggestion buttons */}
              <div className="flex flex-wrap justify-center gap-3 mt-8">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="px-6 py-3 bg-gradient-to-r from-[#3674B5] to-[#5682B1] text-white rounded-xl font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                >
                  Lihat Semua Produk
                </button>
                <button className="px-6 py-3 bg-white dark:bg-slate-800 border-2 border-[#3674B5] text-[#3674B5] dark:text-[#A1E3F9] rounded-xl font-medium hover:bg-[#3674B5] hover:text-white dark:hover:bg-[#A1E3F9] dark:hover:text-slate-900 transition-all duration-300">
                  Refresh Halaman
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Modal Pesanan */}
      {showModal && selectedProduct && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white dark:bg-slate-900 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-xl border border-gray-200 dark:border-slate-700 flex flex-col md:flex-row"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Gambar produk di samping untuk tampilan desktop */}
            <div className="md:w-2/5 bg-gray-100 dark:bg-slate-800 p-4 flex items-center justify-center">
              <div className="aspect-square w-full rounded-xl overflow-hidden">
                <img
                  src={`${STORAGE_URL}/${selectedProduct.image}`}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/400?text=No+Image";
                  }}
                />
              </div>
            </div>

            {/* Konten utama */}
            <div className="md:w-3/5 flex flex-col">
              {/* Header yang Lebih Ringkas */}
              <div className="relative p-4 border-b border-gray-100 dark:border-slate-600">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div>
                      <h3 className="text-base font-semibold text-gray-900 dark:text-white line-clamp-1">
                        {selectedProduct.name}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {selectedProduct.category?.name}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowModal(false)}
                    className="w-7 h-7 rounded-full bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 flex items-center justify-center transition-colors"
                  >
                    <svg
                      className="w-3 h-3 text-gray-600 dark:text-gray-300"
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

                {/* Tab Navigation yang Lebih Sederhana */}
                <div className="mt-3 flex bg-gray-100 dark:bg-slate-700 rounded-md p-1">
                  <button
                    onClick={() => setActiveTab("detail")}
                    className={`flex-1 py-1.5 px-2 rounded-md text-xs font-medium transition-all duration-200 ${
                      activeTab === "detail"
                        ? "bg-white dark:bg-slate-600 text-gray-900 dark:text-white shadow-sm"
                        : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                    }`}
                  >
                    Detail
                  </button>
                  <button
                    onClick={() => setActiveTab("pemesanan")}
                    className={`flex-1 py-1.5 px-2 rounded-md text-xs font-medium transition-all duration-200 ${
                      activeTab === "pemesanan"
                        ? "bg-white dark:bg-slate-600 text-gray-900 dark:text-white shadow-sm"
                        : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                    }`}
                  >
                    Pemesanan
                  </button>
                </div>
              </div>

              {/* Confirmation Modal */}
              {showModalTerimakasih && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50">
                  <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-xl w-80 mx-4 border border-gray-100 dark:border-slate-700">
                    <div className="text-center">
                      <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                        <svg
                          className="w-5 h-5 text-green-600 dark:text-green-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
                        Pesanan Berhasil!
                      </h2>
                      <p className="text-xs text-gray-600 dark:text-gray-300 mb-3">
                        Lanjutkan ke WhatsApp untuk menyelesaikan pesanan.
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setShowModalTerimakasih(false)}
                          className="flex-1 px-3 py-1.5 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors text-xs font-medium"
                        >
                          Batal
                        </button>
                        <button
                          onClick={confirmOrderAndGoWhatsApp}
                          className="flex-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-xs font-medium"
                        >
                          Lanjutkan
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Modal Content */}
              <div className="overflow-y-auto flex-1 p-4">
                {activeTab === "detail" ? (
                  <div className="space-y-3">
                    {/* Product Info - untuk mobile, gambar disembunyikan karena sudah ada di samping */}
                    <div className="md:hidden aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-slate-800 mb-3">
                      <img
                        src={`${STORAGE_URL}/${selectedProduct.image}`}
                        alt={selectedProduct.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/400?text=No+Image";
                        }}
                      />
                    </div>

                    {/* Price and Stock */}
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                        {selectedProduct.price}
                      </h4>
                      <div
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          selectedProduct.stock > 10
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            : selectedProduct.stock > 0
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                            : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                        }`}
                      >
                        Stok: {selectedProduct.stock}
                      </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-1">
                      <h5 className="font-medium text-gray-900 dark:text-white text-xs">
                        Deskripsi
                      </h5>
                      <p className="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                        {selectedProduct.description ||
                          "Tidak ada deskripsi untuk produk ini."}
                      </p>
                    </div>

                    {/* Sizes */}
                    {selectedProduct.sizes &&
                      selectedProduct.sizes.length > 0 && (
                        <div className="space-y-1">
                          <h5 className="font-medium text-gray-900 dark:text-white text-xs">
                            Ukuran Tersedia
                          </h5>
                          <div className="flex flex-wrap gap-1">
                            {selectedProduct.sizes.map((size, index) => (
                              <span
                                key={index}
                                className="px-2 py-0.5 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded text-xs font-medium"
                              >
                                {size}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                    {/* Colors */}
                    {selectedProduct.colors &&
                      selectedProduct.colors.length > 0 && (
                        <div className="space-y-1">
                          <h5 className="font-medium text-gray-900 dark:text-white text-xs">
                            Warna Tersedia
                          </h5>
                          <div className="flex flex-wrap gap-1">
                            {selectedProduct.colors.map((color, index) => (
                              <span
                                key={index}
                                className="px-2 py-0.5 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded text-xs font-medium"
                              >
                                {color}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                    {/* CTA Button */}
                    <button
                      onClick={() => setActiveTab("pemesanan")}
                      className="w-full mt-3 py-2 px-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium transition-colors text-sm"
                    >
                      Pesan Sekarang
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* Product Summary Card */}
                    <div className="bg-gray-50 dark:bg-slate-800 rounded-lg p-3 mb-2 border border-gray-200 dark:border-slate-600">
                      <div className="flex items-center space-x-2">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-white dark:bg-slate-700">
                          <img
                            src={`${STORAGE_URL}/${selectedProduct.image}`}
                            alt={selectedProduct.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 dark:text-white text-xs truncate">
                            {selectedProduct.name}
                          </h4>
                          <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
                            {selectedProduct.price}
                          </p>
                          <div className="flex items-center space-x-1 mt-0.5 text-xs text-gray-600 dark:text-gray-300">
                            <span>{selectedProduct.category?.name}</span>
                            <span>•</span>
                            <span className="text-green-600 dark:text-green-400">
                              Stok: {selectedProduct.stock}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Order Form */}
                    <div className="space-y-3">
                      {/* Product Options */}
                      <div className="grid grid-cols-1 gap-3">
                        {/* Quantity */}
                        <div className="space-y-1">
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                            Jumlah
                          </label>
                          <div className="flex items-center bg-gray-50 dark:bg-slate-700 rounded-lg overflow-hidden border border-gray-200 dark:border-slate-600">
                            <button
                              onClick={() => handleJumlahChange(-1)}
                              disabled={formData.jumlah <= 1}
                              className="w-8 h-8 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors text-sm"
                            >
                              −
                            </button>
                            <div className="flex-1 text-center py-1.5 font-medium text-gray-900 dark:text-white bg-white dark:bg-slate-800 border-x border-gray-200 dark:border-slate-600 text-xs">
                              {formData.jumlah}
                            </div>
                            <button
                              onClick={() => handleJumlahChange(1)}
                              disabled={
                                formData.jumlah >= selectedProduct.stock
                              }
                              className="w-8 h-8 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors text-sm"
                            >
                              +
                            </button>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Max: {selectedProduct.stock} pcs
                          </p>
                        </div>
                        {/* Size Selection */}
                        {selectedProduct.sizes &&
                          selectedProduct.sizes.length > 0 && (
                            <div className="space-y-1">
                              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                                Ukuran
                              </label>
                              <div className="flex flex-col gap-1">
                                {" "}
                                {/* Ubah dari grid-cols-2 ke flex-col */}
                                {selectedProduct.sizes.map((size, index) => (
                                  <button
                                    key={index}
                                    type="button"
                                    onClick={() =>
                                      setFormData({ ...formData, ukuran: size })
                                    }
                                    className={`py-1.5 px-2 rounded text-xs font-medium transition-colors text-left ${
                                      formData.ukuran === size
                                        ? "bg-blue-500 text-white"
                                        : "bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600"
                                    }`}
                                  >
                                    {size}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        {/* Color Selection */}
                        {selectedProduct.colors &&
                          selectedProduct.colors.length > 0 && (
                            <div className="space-y-1">
                              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                                Warna
                              </label>
                              <div className="flex flex-col gap-1">
                                {" "}
                                {/* Ubah dari grid-cols-2 ke flex-col */}
                                {selectedProduct.colors.map((color, index) => (
                                  <button
                                    key={index}
                                    type="button"
                                    onClick={() =>
                                      setFormData({ ...formData, warna: color })
                                    }
                                    className={`py-1.5 px-2 rounded text-xs font-medium transition-colors text-left ${
                                      formData.warna === color
                                        ? "bg-blue-500 text-white"
                                        : "bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600"
                                    }`}
                                  >
                                    {color}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}{" "}
                      </div>

                      {/* Customer Information */}
                      <div className="space-y-2 pt-1 border-t border-gray-200 dark:border-slate-700">
                        <div className="space-y-1">
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                            Nama Lengkap
                          </label>
                          <input
                            type="text"
                            name="nama"
                            value={formData.nama}
                            onChange={handleInputChange}
                            className="w-full px-2.5 py-1.5 border border-gray-300 dark:border-slate-600 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all bg-white dark:bg-slate-800 dark:text-white"
                            placeholder="Masukkan nama lengkap"
                            required
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                            Nomor WhatsApp
                          </label>
                          <input
                            type="tel"
                            name="noWa"
                            value={formData.noWa}
                            onChange={handleInputChange}
                            className="w-full px-2.5 py-1.5 border border-gray-300 dark:border-slate-600 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all bg-white dark:bg-slate-800 dark:text-white"
                            placeholder="081234567890"
                            required
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                            Alamat Pengiriman
                          </label>
                          <textarea
                            name="alamat"
                            value={formData.alamat}
                            onChange={handleInputChange}
                            rows="2"
                            className="w-full px-2.5 py-1.5 border border-gray-300 dark:border-slate-600 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all bg-white dark:bg-slate-800 dark:text-white resize-none"
                            placeholder="Masukkan alamat lengkap untuk pengiriman"
                            required
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                            Catatan (Opsional)
                          </label>
                          <textarea
                            name="catatan"
                            value={formData.catatan}
                            onChange={handleInputChange}
                            rows="2"
                            className="w-full px-2.5 py-1.5 border border-gray-300 dark:border-slate-600 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all bg-white dark:bg-slate-800 dark:text-white resize-none"
                            placeholder="Catatan tambahan untuk pesanan"
                          />
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col gap-1.5 pt-2 border-t border-gray-200 dark:border-slate-700">
                        <button
                          onClick={handleWhatsAppOrder}
                          disabled={
                            !formData.nama ||
                            !formData.noWa ||
                            !formData.alamat ||
                            formData.jumlah < 1 ||
                            formData.jumlah > selectedProduct.stock
                          }
                          className="w-full py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-medium text-xs"
                        >
                          <svg
                            className="w-3.5 h-3.5 mr-1.5"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.016a9.97 9.97 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.936 9.936 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.864 3.488" />
                          </svg>
                          Pesan via WhatsApp
                        </button>

                        <button
                          onClick={() => setShowModal(false)}
                          className="w-full py-1.5 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors text-xs font-medium"
                        >
                          Batal
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
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
          0%,
          100% {
            opacity: 0.2;
          }
          50% {
            opacity: 0.4;
          }
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
      `}</style>
    </div>
  );
};

export default Merchandise;
