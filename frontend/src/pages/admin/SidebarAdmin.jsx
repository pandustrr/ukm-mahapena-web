// File: src/pages/admin/SidebarAdmin.jsx
import { useState } from "react";
import {
  BarChart3,
  FileText,
  ShoppingBag,
  Users,
  LogOut,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  Briefcase,
  GraduationCap,
  Layers,
  UserCircle2,
  Settings,
} from "lucide-react";

function SidebarAdmin({ activePage, setActivePage }) {
  const [profilOpen, setProfilOpen] = useState(false);

  const handleLogout = () => {
    if (confirm("Apakah Anda yakin ingin logout?")) {
      sessionStorage.removeItem("adminToken");
      window.location.href = "/admin/login";
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-700 shadow-lg border-r border-slate-200">
      {/* Header / Logo */}
      <div className="relative px-6 py-6 border-b border-slate-200">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-purple-50/50"></div>
        <div className="relative flex items-center justify-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-sm">
              <Settings size={16} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-slate-800 tracking-wide">
                Admin Panel
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">Management System</p>
            </div>
          </div>
        </div>
      </div>

      {/* Menu navigasi */}
      <nav className="flex-1 p-4 overflow-y-auto custom-scrollbar">
        <ul className="space-y-3">
          {/* Dashboard */}
          <li>
            <button
              onClick={() => setActivePage("dashboard")}
              className={`group w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-300 ${
                activePage === "dashboard"
                  ? "bg-blue-50 text-blue-700 shadow-sm border border-blue-200"
                  : "hover:bg-slate-50 hover:text-slate-700 text-slate-600 border border-transparent"
              }`}
            >
              <div className={`p-1.5 rounded-md transition-colors ${
                activePage === "dashboard" 
                  ? "bg-blue-100 text-blue-700" 
                  : "text-slate-500 group-hover:bg-slate-100 group-hover:text-slate-600"
              }`}>
                <BarChart3 size={16} />
              </div>
              <span className="text-sm font-medium">Dashboard</span>
            </button>
          </li>

          {/* Profil (submenu) */}
          <li>
            <button
              onClick={() => setProfilOpen(!profilOpen)}
              className={`group w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-all duration-300 ${
                ["divisi", "pengurus", "alumni"].includes(activePage)
                  ? "bg-purple-50 text-purple-700 shadow-sm border border-purple-200"
                  : "hover:bg-slate-50 hover:text-slate-700 text-slate-600 border border-transparent"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-1.5 rounded-md transition-colors ${
                  ["divisi", "pengurus", "alumni"].includes(activePage) 
                    ? "bg-purple-100 text-purple-700" 
                    : "text-slate-500 group-hover:bg-slate-100 group-hover:text-slate-600"
                }`}>
                  <Users size={16} />
                </div>
                <span className="text-sm font-medium">Profil</span>
              </div>
              <div className={`p-1 rounded-md transition-all duration-300 ${
                profilOpen ? "rotate-180 bg-slate-100" : "group-hover:bg-slate-100"
              }`}>
                <ChevronDown size={14} className="text-slate-400" />
              </div>
            </button>

            <div className={`overflow-hidden transition-all duration-300 ${
              profilOpen ? "max-h-48 opacity-100 mt-2" : "max-h-0 opacity-0"
            }`}>
              <ul className="ml-6 space-y-1 border-l border-slate-200 pl-3">
                {/* Divisi */}
                <li>
                  <button
                    onClick={() => setActivePage("divisi")}
                    className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-left transition-all duration-200 ${
                      activePage === "divisi"
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : "hover:bg-slate-50 hover:text-slate-700 text-slate-500"
                    }`}
                  >
                    <Layers size={14} />
                    <span className="text-sm">Divisi</span>
                  </button>
                </li>

                {/* Pengurus */}
                <li>
                  <button
                    onClick={() => setActivePage("pengurus")}
                    className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-left transition-all duration-200 ${
                      activePage === "pengurus"
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : "hover:bg-slate-50 hover:text-slate-700 text-slate-500"
                    }`}
                  >
                    <UserCircle2 size={14} />
                    <span className="text-sm">Pengurus</span>
                  </button>
                </li>

                {/* Alumni */}
                <li>
                  <button
                    onClick={() => setActivePage("alumni")}
                    className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-left transition-all duration-200 ${
                      activePage === "alumni"
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : "hover:bg-slate-50 hover:text-slate-700 text-slate-500"
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
              className={`group w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-300 ${
                activePage === "proker"
                  ? "bg-emerald-50 text-emerald-700 shadow-sm border border-emerald-200"
                  : "hover:bg-slate-50 hover:text-slate-700 text-slate-600 border border-transparent"
              }`}
            >
              <div className={`p-1.5 rounded-md transition-colors ${
                activePage === "proker" 
                  ? "bg-emerald-100 text-emerald-700" 
                  : "text-slate-500 group-hover:bg-slate-100 group-hover:text-slate-600"
              }`}>
                <ClipboardList size={16} />
              </div>
              <span className="text-sm font-medium">Proker</span>
            </button>
          </li>

          {/* Blog */}
          <li>
            <button
              onClick={() => setActivePage("blog")}
              className={`group w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-300 ${
                activePage === "blog"
                  ? "bg-orange-50 text-orange-700 shadow-sm border border-orange-200"
                  : "hover:bg-slate-50 hover:text-slate-700 text-slate-600 border border-transparent"
              }`}
            >
              <div className={`p-1.5 rounded-md transition-colors ${
                activePage === "blog" 
                  ? "bg-orange-100 text-orange-700" 
                  : "text-slate-500 group-hover:bg-slate-100 group-hover:text-slate-600"
              }`}>
                <FileText size={16} />
              </div>
              <span className="text-sm font-medium">Blog</span>
            </button>
          </li>

          {/* Merchandise */}
          <li>
            <button
              onClick={() => setActivePage("merchandise")}
              className={`group w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-300 ${
                activePage === "merchandise"
                  ? "bg-pink-50 text-pink-700 shadow-sm border border-pink-200"
                  : "hover:bg-slate-50 hover:text-slate-700 text-slate-600 border border-transparent"
              }`}
            >
              <div className={`p-1.5 rounded-md transition-colors ${
                activePage === "merchandise" 
                  ? "bg-pink-100 text-pink-700" 
                  : "text-slate-500 group-hover:bg-slate-100 group-hover:text-slate-600"
              }`}>
                <ShoppingBag size={16} />
              </div>
              <span className="text-sm font-medium">Merchandise</span>
            </button>
          </li>

          {/* Portofolio */}
          <li>
            <button
              onClick={() => setActivePage("portofolio")}
              className={`group w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-300 ${
                activePage === "portofolio"
                  ? "bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-200"
                  : "hover:bg-slate-50 hover:text-slate-700 text-slate-600 border border-transparent"
              }`}
            >
              <div className={`p-1.5 rounded-md transition-colors ${
                activePage === "portofolio" 
                  ? "bg-indigo-100 text-indigo-700" 
                  : "text-slate-500 group-hover:bg-slate-100 group-hover:text-slate-600"
              }`}>
                <Briefcase size={16} />
              </div>
              <span className="text-sm font-medium">Portofolio</span>
            </button>
          </li>
        </ul>
      </nav>

      {/* Tombol Logout */}
      <div className="p-4 border-t border-slate-200 bg-slate-50/50">
        <button
          onClick={handleLogout}
          className="group w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-300 border border-transparent hover:border-red-200"
        >
          <div className="p-1.5 rounded-md transition-colors text-red-500 group-hover:bg-red-100 group-hover:text-red-600">
            <LogOut size={16} />
          </div>
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(148, 163, 184, 0.1);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(148, 163, 184, 0.3);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(148, 163, 184, 0.5);
        }
      `}</style>
    </div>
  );
}

export default SidebarAdmin;