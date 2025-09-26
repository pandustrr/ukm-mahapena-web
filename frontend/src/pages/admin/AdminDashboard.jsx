import { useState } from "react";
import SidebarAdmin from "./SidebarAdmin";
import ManajemenMerchandise from "./ManajemenMerchandise";
import ManajemenDivisi from "./ManajemenDivisi";
import ManajemenPengurus from "./ManajemenPengurus";
import ManajemenPortofolio from "./ManajemenPortofolio";
import ManajemenAlumni from "./ManajemenAlumni";
import ManajemenBlog from "./ManajemenBlog";
import ManajemenProker from "./ManajemenProker";

import {
  Users,
  ShoppingBag,
  Briefcase,
  GraduationCap,
  FileText,
  TrendingUp,
  Calendar,
  Activity,
  Clock,
  ArrowUpRight,
  BarChart3,
  PlusCircle
} from "lucide-react";

// Dashboard Content Component
function DashboardContent() {
  // Mock data - nanti bisa diganti dengan API
  const stats = [
    { title: "Total Pengurus", value: "24", change: "+2", icon: Users, color: "blue", bgColor: "bg-blue-50", iconColor: "text-blue-600", borderColor: "border-blue-200" },
    { title: "Total Alumni", value: "156", change: "+12", icon: GraduationCap, color: "emerald", bgColor: "bg-emerald-50", iconColor: "text-emerald-600", borderColor: "border-emerald-200" },
    { title: "Merchandise Aktif", value: "8", change: "+1", icon: ShoppingBag, color: "purple", bgColor: "bg-purple-50", iconColor: "text-purple-600", borderColor: "border-purple-200" },
    { title: "Portofolio", value: "32", change: "+5", icon: Briefcase, color: "orange", bgColor: "bg-orange-50", iconColor: "text-orange-600", borderColor: "border-orange-200" }
  ];

  const recentActivities = [
    { id: 1, action: "Menambahkan pengurus baru", user: "Admin", item: "John Doe - Divisi IT", time: "2 jam yang lalu", icon: Users },
    { id: 2, action: "Memperbarui merchandise", user: "Admin", item: "T-Shirt Organisasi 2024", time: "4 jam yang lalu", icon: ShoppingBag },
    { id: 3, action: "Upload portofolio baru", user: "Admin", item: "Website E-Commerce", time: "1 hari yang lalu", icon: Briefcase },
    { id: 4, action: "Menambahkan alumni", user: "Admin", item: "Sarah Wilson - Angkatan 2022", time: "2 hari yang lalu", icon: GraduationCap }
  ];

  const quickActions = [
    { title: "Tambah Pengurus", description: "Daftarkan pengurus baru", icon: Users, action: "pengurus", color: "blue" },
    { title: "Tambah Merchandise", description: "Upload produk baru", icon: ShoppingBag, action: "merchandise", color: "purple" },
    { title: "Tambah Portofolio", description: "Showcase project terbaru", icon: Briefcase, action: "portofolio", color: "orange" },
    { title: "Tambah Alumni", description: "Daftarkan alumni baru", icon: GraduationCap, action: "alumni", color: "emerald" }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard Admin</h1>
          <p className="text-sm text-slate-600 mt-1">
            Selamat datang kembali! Berikut adalah ringkasan aktivitas terbaru.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Clock size={16} />
          <span>Terakhir diperbarui: {new Date().toLocaleDateString('id-ID')}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className={`${stat.bgColor} ${stat.borderColor} border rounded-lg p-4 hover:shadow-md transition-shadow duration-200`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">{stat.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
                  <span className="text-xs font-medium text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full">{stat.change}</span>
                </div>
              </div>
              <div className={`${stat.iconColor} p-2 rounded-lg bg-white/60`}>
                <stat.icon size={20} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <Activity size={20} className="text-blue-600" />
                Aktivitas Terbaru
              </h2>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Lihat Semua
              </button>
            </div>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 hover:bg-slate-50 rounded-lg transition-colors">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <activity.icon size={16} className="text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800">{activity.action}</p>
                    <p className="text-sm text-slate-600 truncate">{activity.item}</p>
                    <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
                  </div>
                  <div className="text-xs text-slate-400">
                    <ArrowUpRight size={16} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <PlusCircle size={20} className="text-emerald-600" />
              Aksi Cepat
            </h2>
            <div className="space-y-3">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  className={`w-full p-4 text-left rounded-lg border border-${action.color}-200 bg-${action.color}-50 hover:bg-${action.color}-100 transition-colors group`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-${action.color}-100 text-${action.color}-600 group-hover:bg-${action.color}-200`}>
                      <action.icon size={16} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-800">{action.title}</p>
                      <p className="text-xs text-slate-600">{action.description}</p>
                    </div>
                    <ArrowUpRight size={16} className="text-slate-400 group-hover:text-slate-600" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Admin Dashboard
function AdminDashboard() {
  const [activePage, setActivePage] = useState("dashboard");

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="w-64 bg-gradient-to-b from-slate-50 via-white to-slate-50 min-h-screen">
        <SidebarAdmin activePage={activePage} setActivePage={setActivePage} />
      </aside>

      <main className="flex-1 p-6">
        {activePage === "dashboard" && <DashboardContent />}
        {activePage === "divisi" && <ManajemenDivisi />}
        {activePage === "pengurus" && <ManajemenPengurus />}
        {activePage === "merchandise" && <ManajemenMerchandise />}
        {activePage === "portofolio" && <ManajemenPortofolio />}
        {activePage === "alumni" && <ManajemenAlumni />}
        {activePage === "proker" && <ManajemenProker />}
        {activePage === "blog" && <ManajemenBlog />}
      </main>
    </div>
  );
}

export default AdminDashboard;
