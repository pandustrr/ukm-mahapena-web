import { useState, useEffect } from "react";
import SidebarAdmin from "./SidebarAdmin";
import ManajemenMerchandise from "./ManajemenMerchandise";
import ManajemenDivisi from "./ManajemenDivisi";
import ManajemenPengurus from "./ManajemenPengurus";
import ManajemenPortofolio from "./ManajemenPortofolio";
import ManajemenAlumni from "./ManajemenAlumni";
import ManajemenBlog from "./ManajemenBlog";
import ManajemenProker from "./ManajemenProker";
import UbahProfilAdmin from "./UbahProfilAdmin";

import {
  Layers,
  UserCircle2,
  GraduationCap,
  ClipboardList,
  FileText,
  Briefcase,
  ShoppingBag,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  PlusCircle,
  Settings
} from "lucide-react";

function DashboardContent({ setActivePage }) {
  const [stats, setStats] = useState({
    totalDivisi: 0,
    totalPengurus: 0,
    totalAlumni: 0,
    totalProker: 0,
    totalBlog: 0,
    totalPortofolio: 0,
    totalMerchandise: 0,
    totalSold: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const token = sessionStorage.getItem("adminToken");
        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        };

        const [
          divisiRes,
          pengurusRes,
          alumniRes,
          prokerRes,
          blogRes,
          portofolioRes,
          merchandiseRes,
          salesRes
        ] = await Promise.all([
          fetch("http://localhost:8000/api/admin/divisis", { headers }),
          fetch("http://localhost:8000/api/admin/pengurus", { headers }),
          fetch("http://localhost:8000/api/admin/alumni", { headers }),
          fetch("http://localhost:8000/api/admin/proker", { headers }),
          fetch("http://localhost:8000/api/admin/blogs", { headers }),
          fetch("http://localhost:8000/api/admin/portofolio", { headers }),
          fetch("http://localhost:8000/api/admin/merchandises", { headers }),
          fetch("http://localhost:8000/api/admin/merchandise-sales", { headers })
        ]);

        const divisiData = await divisiRes.json();
        const pengurusData = await pengurusRes.json();
        const alumniData = await alumniRes.json();
        const prokerData = await prokerRes.json();
        const blogData = await blogRes.json();
        const portofolioData = await portofolioRes.json();
        const merchandiseData = await merchandiseRes.json();
        const salesData = await salesRes.json();

        setStats({
          totalDivisi: Array.isArray(divisiData) ? divisiData.length : 0,
          totalPengurus: Array.isArray(pengurusData) ? pengurusData.length : 0,
          totalAlumni: Array.isArray(alumniData) ? alumniData.length : 0,
          totalProker: Array.isArray(prokerData) ? prokerData.length : 0,
          totalBlog: Array.isArray(blogData?.data?.data)
            ? blogData.data.data.length
            : Array.isArray(blogData)
            ? blogData.length
            : 0,
          totalPortofolio: Array.isArray(portofolioData)
            ? portofolioData.length
            : 0,
          totalMerchandise: Array.isArray(merchandiseData)
            ? merchandiseData.length
            : 0,
          totalSold: salesData?.totalSold || 0,
          totalRevenue: salesData?.totalRevenue || 0
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statsConfig = [
    { title: "Total Divisi", value: stats.totalDivisi, icon: Layers, bg: "purple" },
    { title: "Total Pengurus", value: stats.totalPengurus, icon: UserCircle2, bg: "blue" },
    { title: "Total Alumni", value: stats.totalAlumni, icon: GraduationCap, bg: "emerald" },
    { title: "Total Program Kerja", value: stats.totalProker, icon: ClipboardList, bg: "green" },
    { title: "Total Blog", value: stats.totalBlog, icon: FileText, bg: "orange" },
    { title: "Total Portofolio", value: stats.totalPortofolio, icon: Briefcase, bg: "indigo" },
    { title: "Total Merchandise", value: stats.totalMerchandise, icon: ShoppingBag, bg: "pink" },
    { title: "Total Terjual", value: stats.totalSold, icon: ShoppingCart, bg: "cyan" },
    {
      title: "Total Pendapatan",
      value: `${Number(stats.totalRevenue || 0).toLocaleString("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0
      }).replace("IDR", "").trim()}`,
      icon: DollarSign,
      bg: "emerald"
    }
  ];

  const quickActions = [
    { title: "Kelola Divisi", desc: "Atur divisi organisasi", icon: Layers, action: "divisi", bg: "purple" },
    { title: "Kelola Pengurus", desc: "Daftarkan pengurus baru", icon: UserCircle2, action: "pengurus", bg: "blue" },
    { title: "Kelola Alumni", desc: "Daftarkan alumni baru", icon: GraduationCap, action: "alumni", bg: "emerald" },
    { title: "Program Kerja", desc: "Kelola program kerja", icon: ClipboardList, action: "proker", bg: "green" },
    { title: "Kelola Blog", desc: "Tulis artikel & berita", icon: FileText, action: "blog", bg: "orange" },
    { title: "Kelola Merchandise", desc: "Upload produk", icon: ShoppingBag, action: "merchandise", bg: "pink" },
    { title: "Kelola Portofolio", desc: "Showcase project", icon: Briefcase, action: "portofolio", bg: "indigo" },
    { title: "Ubah Profil", desc: "Perbarui informasi admin", icon: Settings, action: "ubah-profil", bg: "yellow" }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Admin</h1>
        <p className="text-sm text-gray-600 mt-1">
          Selamat datang kembali! Berikut ringkasan data sistem.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {statsConfig.map((stat, i) => (
          <div
            key={i}
            onClick={() => {
              if (stat.title.includes("Divisi")) setActivePage("divisi");
              else if (stat.title.includes("Pengurus")) setActivePage("pengurus");
              else if (stat.title.includes("Alumni")) setActivePage("alumni");
              else if (stat.title.includes("Program Kerja")) setActivePage("proker");
              else if (stat.title.includes("Blog")) setActivePage("blog");
              else if (stat.title.includes("Portofolio")) setActivePage("portofolio");
              else if (stat.title.includes("Merchandise") || stat.title.includes("Terjual") || stat.title.includes("Pendapatan"))
                setActivePage("merchandise");
            }}
            className={`bg-${stat.bg}-50 border border-${stat.bg}-200 rounded-lg p-4 hover:shadow-md transition cursor-pointer`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  {loading ? (
                    <div className="animate-pulse h-7 bg-gray-200 rounded w-16"></div>
                  ) : (
                    <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                  )}
                  {(stat.title.includes("Terjual") || stat.title.includes("Pendapatan")) && !loading && (
                    <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full flex items-center gap-1">
                      <TrendingUp size={10} />
                      Sales
                    </span>
                  )}
                </div>
              </div>
              <div className={`text-${stat.bg}-600 p-2 rounded-lg bg-white/60`}>
                <stat.icon size={20} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <PlusCircle size={20} className="text-emerald-600" />
          Aksi Cepat
        </h2>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {quickActions.map((action, i) => (
            <button
              key={i}
              onClick={() => setActivePage(action.action)}
              className={`w-full p-3 text-left rounded-lg border border-${action.bg}-200 bg-${action.bg}-50 hover:shadow-sm transition group`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-white/80 group-hover:bg-white transition">
                  <action.icon size={16} className={`text-${action.bg}-600`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800">{action.title}</p>
                  <p className="text-xs text-gray-600">{action.desc}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function AdminDashboard() {
  const [activePage, setActivePage] = useState("dashboard");

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 bg-white min-h-screen">
        <SidebarAdmin activePage={activePage} setActivePage={setActivePage} />
      </aside>
      <main className="flex-1 p-6">
        {activePage === "dashboard" && <DashboardContent setActivePage={setActivePage} />}
        {activePage === "divisi" && <ManajemenDivisi />}
        {activePage === "pengurus" && <ManajemenPengurus />}
        {activePage === "merchandise" && <ManajemenMerchandise />}
        {activePage === "portofolio" && <ManajemenPortofolio />}
        {activePage === "alumni" && <ManajemenAlumni />}
        {activePage === "proker" && <ManajemenProker />}
        {activePage === "blog" && <ManajemenBlog />}
        {activePage === "ubah-profil" && <UbahProfilAdmin />}
      </main>
    </div>
  );
}

export default AdminDashboard;
