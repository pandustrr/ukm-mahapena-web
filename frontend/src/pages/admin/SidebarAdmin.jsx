// File: src/pages/admin/SidebarAdmin.jsx
import { useState, useEffect } from "react";
import {
  BarChart3,
  FileText,
  ShoppingBag,
  Users,
  LogOut,
  ChevronDown,
  ClipboardList,
  Briefcase,
  GraduationCap,
  Layers,
  UserCircle2,
  Settings,
} from "lucide-react";
import {API_URL} from "../../config/api"; 

function SidebarAdmin({ activePage, setActivePage }) {
  const [profilOpen, setProfilOpen] = useState(false);
  const [adminName, setAdminName] = useState("Admin"); // default

  // Ambil nama admin dari API
  useEffect(() => {
    const fetchAdminName = async () => {
      try {
        const token = sessionStorage.getItem("adminToken");
        if (!token) return;

        const res = await fetch(`${API_URL}/admin/dashboard`, {
          headers: {
            Authorization: token,
          },
        });

        const data = await res.json();
        if (res.ok && data.username) {
          setAdminName(data.username);
        } else {
          console.error("Gagal fetch data admin:", data.message || "Tidak ada username");
        }
      } catch (err) {
        console.error("Error fetch admin:", err);
      }
    };

    fetchAdminName();
  }, []);

  const handleLogout = () => {
    if (confirm("Apakah Anda yakin ingin logout?")) {
      sessionStorage.removeItem("adminToken");
      window.location.href = "/admin/login";
    }
  };

  return (
    <div className="flex flex-col h-full bg-white text-gray-700 shadow-lg border-r border-gray-200">
      {/* Header / Logo */}
      <div className="px-6 py-6 border-b border-gray-200">
        <div className="flex items-center justify-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
              <Settings size={16} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-800 tracking-wide">
                {adminName} {/* nama admin dari database */}
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">Management System</p>
            </div>
          </div>
        </div>
      </div>

      {/* Menu navigasi */}
      <nav className="flex-1 p-4 overflow-y-auto custom-scrollbar">
        <ul className="space-y-2">
          {/* Dashboard */}
          <li>
            <button
              onClick={() => setActivePage("dashboard")}
              className={`group w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 ${
                activePage === "dashboard"
                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                  : "hover:bg-gray-50 hover:text-gray-700 text-gray-600"
              }`}
            >
              <div
                className={`p-1.5 rounded-md transition-colors ${
                  activePage === "dashboard"
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-500 group-hover:bg-gray-100 group-hover:text-gray-600"
                }`}
              >
                <BarChart3 size={16} />
              </div>
              <span className="text-sm font-medium">Dashboard</span>
            </button>
          </li>

          {/* Profil (submenu) */}
          <li>
            <button
              onClick={() => setProfilOpen(!profilOpen)}
              className={`group w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-all duration-200 ${
                ["divisi", "pengurus", "alumni"].includes(activePage)
                  ? "bg-purple-50 text-purple-700 border border-purple-200"
                  : "hover:bg-gray-50 hover:text-gray-700 text-gray-600"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-1.5 rounded-md transition-colors ${
                    ["divisi", "pengurus", "alumni"].includes(activePage)
                      ? "bg-purple-100 text-purple-700"
                      : "text-gray-500 group-hover:bg-gray-100 group-hover:text-gray-600"
                  }`}
                >
                  <Users size={16} />
                </div>
                <span className="text-sm font-medium">Profil</span>
              </div>
              <div className={`transition-transform duration-200 ${profilOpen ? "rotate-180" : ""}`}>
                <ChevronDown size={14} className="text-gray-400" />
              </div>
            </button>

            <div className={`overflow-hidden transition-all duration-200 ${
              profilOpen ? "max-h-48 opacity-100 mt-2" : "max-h-0 opacity-0"
            }`}>
              <ul className="ml-6 space-y-1 border-l border-gray-200 pl-3">
                <li>
                  <button
                    onClick={() => setActivePage("divisi")}
                    className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-left transition-all duration-200 ${
                      activePage === "divisi"
                        ? "bg-blue-50 text-blue-700"
                        : "hover:bg-gray-50 hover:text-gray-700 text-gray-500"
                    }`}
                  >
                    <Layers size={14} />
                    <span className="text-sm">Divisi</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActivePage("pengurus")}
                    className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-left transition-all duration-200 ${
                      activePage === "pengurus"
                        ? "bg-blue-50 text-blue-700"
                        : "hover:bg-gray-50 hover:text-gray-700 text-gray-500"
                    }`}
                  >
                    <UserCircle2 size={14} />
                    <span className="text-sm">Pengurus</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActivePage("alumni")}
                    className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-left transition-all duration-200 ${
                      activePage === "alumni"
                        ? "bg-blue-50 text-blue-700"
                        : "hover:bg-gray-50 hover:text-gray-700 text-gray-500"
                    }`}
                  >
                    <GraduationCap size={14} />
                    <span className="text-sm">Alumni</span>
                  </button>
                </li>
              </ul>
            </div>
          </li>

          {/* Proker */}
          <li>
            <button
              onClick={() => setActivePage("proker")}
              className={`group w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 ${
                activePage === "proker"
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "hover:bg-gray-50 hover:text-gray-700 text-gray-600"
              }`}
            >
              <div
                className={`p-1.5 rounded-md transition-colors ${
                  activePage === "proker"
                    ? "bg-emerald-100 text-emerald-700"
                    : "text-gray-500 group-hover:bg-gray-100 group-hover:text-gray-600"
                }`}
              >
                <ClipboardList size={16} />
              </div>
              <span className="text-sm font-medium">Proker</span>
            </button>
          </li>

          {/* Blog */}
          <li>
            <button
              onClick={() => setActivePage("blog")}
              className={`group w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 ${
                activePage === "blog"
                  ? "bg-orange-50 text-orange-700 border border-orange-200"
                  : "hover:bg-gray-50 hover:text-gray-700 text-gray-600"
              }`}
            >
              <div
                className={`p-1.5 rounded-md transition-colors ${
                  activePage === "blog"
                    ? "bg-orange-100 text-orange-700"
                    : "text-gray-500 group-hover:bg-gray-100 group-hover:text-gray-600"
                }`}
              >
                <FileText size={16} />
              </div>
              <span className="text-sm font-medium">Blog</span>
            </button>
          </li>

          {/* Merchandise */}
          <li>
            <button
              onClick={() => setActivePage("merchandise")}
              className={`group w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 ${
                activePage === "merchandise"
                  ? "bg-pink-50 text-pink-700 border border-pink-200"
                  : "hover:bg-gray-50 hover:text-gray-700 text-gray-600"
              }`}
            >
              <div
                className={`p-1.5 rounded-md transition-colors ${
                  activePage === "merchandise"
                    ? "bg-pink-100 text-pink-700"
                    : "text-gray-500 group-hover:bg-gray-100 group-hover:text-gray-600"
                }`}
              >
                <ShoppingBag size={16} />
              </div>
              <span className="text-sm font-medium">Merchandise</span>
            </button>
          </li>

          {/* Portofolio */}
          <li>
            <button
              onClick={() => setActivePage("portofolio")}
              className={`group w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 ${
                activePage === "portofolio"
                  ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                  : "hover:bg-gray-50 hover:text-gray-700 text-gray-600"
              }`}
            >
              <div
                className={`p-1.5 rounded-md transition-colors ${
                  activePage === "portofolio"
                    ? "bg-indigo-100 text-indigo-700"
                    : "text-gray-500 group-hover:bg-gray-100 group-hover:text-gray-600"
                }`}
              >
                <Briefcase size={16} />
              </div>
              <span className="text-sm font-medium">Portofolio</span>
            </button>
          </li>

          {/* Ubah Profil */}
          <li>
            <button
              onClick={() => setActivePage("ubah-profil")}
              className={`group w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 ${
                activePage === "ubah-profil"
                  ? "bg-yellow-50 text-yellow-700 border border-yellow-200"
                  : "hover:bg-gray-50 hover:text-gray-700 text-gray-600"
              }`}
            >
              <div
                className={`p-1.5 rounded-md transition-colors ${
                  activePage === "ubah-profil"
                    ? "bg-yellow-100 text-yellow-700"
                    : "text-gray-500 group-hover:bg-gray-100 group-hover:text-gray-600"
                }`}
              >
                <Settings size={16} />
              </div>
              <span className="text-sm font-medium">Ubah Profil</span>
            </button>
          </li>
        </ul>
      </nav>

      {/* Tombol Logout */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="group w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200"
        >
          <div className="p-1.5 rounded-md transition-colors text-red-500 group-hover:bg-red-100 group-hover:text-red-600">
            <LogOut size={16} />
          </div>
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgb(243 244 246);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgb(156 163 175);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgb(107 114 128);
        }
      `}</style>
    </div>
  );
}

export default SidebarAdmin;
