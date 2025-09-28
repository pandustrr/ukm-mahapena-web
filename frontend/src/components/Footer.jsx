// File: src/components/Footer.jsx
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

const Footer = () => {
  const navItems = [
    { name: "Beranda", path: "/" },
    { name: "Profil", path: "/profil" },
    { name: "Proker", path: "/proker" },
    { name: "Blog", path: "/blog" },
    { name: "Merchandise", path: "/merchandise" },
  ];

  return (
    <footer className="bg-[#113F67] dark:bg-[#000000] text-white pt-24 pb-6 h-[27rem] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Bagian Atas Footer */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {/* Logo dan Deskripsi */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <img
                src={logo}
                alt="Logo Mahapena"
                className="h-10 w-10 object-contain"
              />
              <span className="text-xl font-bold text-[#FFFFFF]">MAHAPENA</span>
            </div>
            <p className="text-[#5682B1] dark:text-[#5682B1] mb-4 leading-relaxed text-sm">
              Unit Kegiatan Mahasiswa yang berfokus pada pengembangan
              kreativitas, inovasi, dan entrepreneurship di kalangan mahasiswa.
            </p>
            <div className="flex space-x-4">
              {/* Sosial Media */}
              <a
                href="#"
                className="text-[#5682B1] hover:text-[#A1E3F9] transition-colors duration-300"
              >
                <span className="sr-only">Facebook</span>
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a
                href="#"
                className="text-[#5682B1] hover:text-[#A1E3F9] transition-colors duration-300"
              >
                <span className="sr-only">Instagram</span>
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a
                href="#"
                className="text-[#5682B1] hover:text-[#A1E3F9] transition-colors duration-300"
              >
                <span className="sr-only">YouTube</span>
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </div>

          {/* Tautan Navigasi */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#A1E3F9]">
              Navigasi
            </h3>
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className="text-[#5682B1] hover:text-[#FFFFFF] transition-colors duration-300 text-sm block w-full"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kontak Informasi */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#A1E3F9]">
              Kontak Kami
            </h3>
            <ul className="space-y-3 text-sm text-[#5682B1]">
              <li className="flex items-start">
                <svg
                  className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <span>info@mahapena.ac.id</span>
              </li>
              <li className="flex items-start">
                <svg
                  className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <span>(021) 1234-5678</span>
              </li>
              <li className="flex items-start">
                <svg
                  className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Universitas Example, Jl. Example No. 123</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Pembatas */}
        <div className="border-t border-[#3674B5]/30 dark:border-[#3674B5]/50 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-[#5682B1] text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} UKM Mahapena. Hak Cipta Dilindungi.
            </p>
            <div className="flex space-x-6">
              <button className="text-[#5682B1] hover:text-[#FFFFFF] text-sm transition-colors duration-300">
                Kebijakan Privasi
              </button>
              <button className="text-[#5682B1] hover:text-[#FFFFFF] text-sm transition-colors duration-300">
                Syarat & Ketentuan
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Dekorasi Wave */}
      <div className="absolute top-1 left-0 w-full overflow-hidden transform -translate-y-1">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="w-full h-12 text-white dark:text-slate-900 fill-current"
        >
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V56.44Z"></path>
        </svg>
      </div>
    </footer>
  );
};

export default Footer;
