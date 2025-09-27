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
  Users,
  ShoppingBag,
  Briefcase,
  GraduationCap,
  Activity,
  Clock,
  ArrowUpRight,
  PlusCircle,
  FileText,
  ClipboardList,
  Layers,
  UserCircle2,
  Settings,
  TrendingUp
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
    // totalSales: 0   // 👈 tambahan

  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const token = sessionStorage.getItem("adminToken");
        const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        };

        // Fetch all data concurrently
        const [
          divisiRes,
          pengurusRes,
          alumniRes,
          prokerRes,
          blogRes,
          portofolioRes,
          merchandiseRes,
          salesRes // 👈 tambahan

        ] = await Promise.all([
          fetch('http://localhost:8000/api/admin/divisis', { headers }),
          fetch('http://localhost:8000/api/admin/pengurus', { headers }),
          fetch('http://localhost:8000/api/admin/alumni', { headers }),
          fetch('http://localhost:8000/api/admin/proker', { headers }),
          fetch('http://localhost:8000/api/admin/blogs', { headers }),
          fetch('http://localhost:8000/api/admin/portofolio', { headers }),
          fetch('http://localhost:8000/api/admin/merchandises', { headers }),
          // fetch('http://localhost:8000/api/admin/merchandise-sales', { headers }) // 👈 tambahan

        ]);

        // Parse responses
        const divisiData = await divisiRes.json();
        const pengurusData = await pengurusRes.json();
        const alumniData = await alumniRes.json();
        const prokerData = await prokerRes.json();
        const blogData = await blogRes.json();
        const portofolioData = await portofolioRes.json();
        const merchandiseData = await merchandiseRes.json();

        // Update stats
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
          totalPortofolio: Array.isArray(portofolioData) ? portofolioData.length : 0,
          totalMerchandise: Array.isArray(merchandiseData) ? merchandiseData.length : 0,
          // totalSales: salesData?.totalSales || 0   // 👈 tambahan

        });
      } catch (error) {
        console.error('Error fetching stats:', error);
        // Keep default values if error
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statsConfig = [
    {
      title: "Total Divisi",
      value: stats.totalDivisi.toString(),
      icon: Layers,
      color: "purple",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
      borderColor: "border-purple-200"
    },
    {
      title: "Total Pengurus",
      value: stats.totalPengurus.toString(),
      icon: UserCircle2,
      color: "blue",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      borderColor: "border-blue-200"
    },
    {
      title: "Total Alumni",
      value: stats.totalAlumni.toString(),
      icon: GraduationCap,
      color: "emerald",
      bgColor: "bg-emerald-50",
      iconColor: "text-emerald-600",
      borderColor: "border-emerald-200"
    },
    {
      title: "Total Program Kerja",
      value: stats.totalProker.toString(),
      icon: ClipboardList,
      color: "green",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
      borderColor: "border-green-200"
    },
    {
      title: "Total Blog",
      value: stats.totalBlog.toString(),
      icon: FileText,
      color: "orange",
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600",
      borderColor: "border-orange-200"
    },
    {
      title: "Total Portofolio",
      value: stats.totalPortofolio.toString(),
      icon: Briefcase,
      color: "indigo",
      bgColor: "bg-indigo-50",
      iconColor: "text-indigo-600",
      borderColor: "border-indigo-200"
    },
    {
      title: "Total Merchandise",
      value: stats.totalMerchandise.toString(),
      icon: ShoppingBag,
      color: "pink",
      bgColor: "bg-pink-50",
      iconColor: "text-pink-600",
      borderColor: "border-pink-200"
    },

    { title: "Ubah Profil", description: "Perbarui informasi admin", icon: Settings, action: "ubah-profil", color: "yellow", bgColor: "bg-yellow-50", borderColor: "border-yellow-200" }

  ];

  const recentActivities = [
    { id: 1, action: "Menambahkan pengurus baru", user: "Admin", item: "John Doe - Divisi IT", time: "2 jam yang lalu", icon: Users },
    { id: 2, action: "Memperbarui merchandise", user: "Admin", item: "T-Shirt Organisasi 2024", time: "4 jam yang lalu", icon: ShoppingBag },
    { id: 3, action: "Upload portofolio baru", user: "Admin", item: "Website E-Commerce", time: "1 hari yang lalu", icon: Briefcase },
    { id: 4, action: "Menambahkan alumni", user: "Admin", item: "Sarah Wilson - Angkatan 2022", time: "2 hari yang lalu", icon: GraduationCap }
  ];

  const quickActions = [
    // Profil Section
    { title: "Kelola Divisi", description: "Atur dan tambah divisi organisasi", icon: Layers, action: "divisi", color: "purple", bgColor: "bg-purple-50", borderColor: "border-purple-200" },
    { title: "Kelola Pengurus", description: "Daftarkan pengurus baru", icon: UserCircle2, action: "pengurus", color: "blue", bgColor: "bg-blue-50", borderColor: "border-blue-200" },
    { title: "Kelola Alumni", description: "Daftarkan alumni baru", icon: GraduationCap, action: "alumni", color: "emerald", bgColor: "bg-emerald-50", borderColor: "border-emerald-200" },

    // Content Management
    { title: "Program Kerja", description: "Kelola program kerja organisasi", icon: ClipboardList, action: "proker", color: "green", bgColor: "bg-green-50", borderColor: "border-green-200" },
    { title: "Kelola Blog", description: "Tulis artikel dan berita terbaru", icon: FileText, action: "blog", color: "orange", bgColor: "bg-orange-50", borderColor: "border-orange-200" },
    { title: "Kelola Merchandise", description: "Upload produk merchandise", icon: ShoppingBag, action: "merchandise", color: "pink", bgColor: "bg-pink-50", borderColor: "border-pink-200" },
    { title: "Kelola Portofolio", description: "Showcase project terbaru", icon: Briefcase, action: "portofolio", color: "indigo", bgColor: "bg-indigo-50", borderColor: "border-indigo-200" },

    // Settings
    { title: "Ubah Profil", description: "Perbarui informasi admin", icon: Settings, action: "ubah-profil", color: "yellow", bgColor: "bg-yellow-50", borderColor: "border-yellow-200" }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard Admin</h1>
          <p className="text-sm text-gray-600 mt-1">
            Selamat datang kembali! Berikut adalah ringkasan data sistem.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {statsConfig.map((stat, index) => (
          <div key={index} className={`${stat.bgColor} ${stat.borderColor} border rounded-lg p-4 hover:shadow-md transition-all duration-200 cursor-pointer`}
            onClick={() => {
              // Navigate to respective page based on stat
              if (stat.title.includes('Divisi')) setActivePage('divisi');
              else if (stat.title.includes('Pengurus')) setActivePage('pengurus');
              else if (stat.title.includes('Alumni')) setActivePage('alumni');
              else if (stat.title.includes('Program Kerja')) setActivePage('proker');
              else if (stat.title.includes('Blog')) setActivePage('blog');
              else if (stat.title.includes('Portofolio')) setActivePage('portofolio');
              else if (stat.title.includes('Merchandise')) setActivePage('merchandise');
            }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  {loading ? (
                    <div className="animate-pulse">
                      <div className="h-7 bg-gray-200 rounded w-12"></div>
                    </div>
                  ) : (
                    <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                  )}
                  {/* <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full flex items-center gap-1">
                    <TrendingUp size={10} />
                    Aktif
                  </span> */}
                </div>
              </div>
              <div className={`${stat.iconColor} p-2 rounded-lg bg-white/60`}>
                <stat.icon size={20} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activities & Quick Actions */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Activity size={20} className="text-blue-600" />
              Aktivitas Terbaru
            </h2>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">Lihat Semua</button>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <activity.icon size={16} className="text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800">{activity.action}</p>
                  <p className="text-sm text-gray-600 truncate">{activity.item}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
                <div className="text-xs text-gray-400">
                  <ArrowUpRight size={16} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <PlusCircle size={20} className="text-emerald-600" />
            Aksi Cepat
          </h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {quickActions.map((action, index) => (
              <button
                key={index}
                className={`w-full p-3 text-left rounded-lg border ${action.borderColor} ${action.bgColor} hover:shadow-sm transition-all duration-200 group`}
                onClick={() => setActivePage(action.action)}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-white/80 group-hover:bg-white transition-colors`}>
                    <action.icon size={16} className={action.iconColor} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{action.title}</p>
                    <p className="text-xs text-gray-600 truncate">{action.description}</p>
                  </div>
                  <ArrowUpRight size={14} className="text-gray-400 group-hover:text-gray-600 transition-colors flex-shrink-0" />
                </div>
              </button>
            ))}
          </div>
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