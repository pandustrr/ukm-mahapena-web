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
  Eye,
  MessageSquare,
  Star,
  Award,
  PlusCircle,
  ArrowUpRight,
  BarChart3,
} from "lucide-react";

// Dashboard Content Component
function DashboardContent() {
  // Mock data - dalam implementasi nyata, data ini akan diambil dari API
  const stats = [
    {
      title: "Total Pengurus",
      value: "24",
      change: "+2",
      icon: Users,
      color: "blue",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      borderColor: "border-blue-200"
    },
    {
      title: "Total Alumni",
      value: "156",
      change: "+12",
      icon: GraduationCap,
      color: "emerald",
      bgColor: "bg-emerald-50",
      iconColor: "text-emerald-600",
      borderColor: "border-emerald-200"
    },
    {
      title: "Merchandise Aktif",
      value: "8",
      change: "+1",
      icon: ShoppingBag,
      color: "purple",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
      borderColor: "border-purple-200"
    },
    {
      title: "Portofolio",
      value: "32",
      change: "+5",
      icon: Briefcase,
      color: "orange",
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600",
      borderColor: "border-orange-200"
    }
  ];

  const recentActivities = [
    {
      id: 1,
      action: "Menambahkan pengurus baru",
      user: "Admin",
      item: "John Doe - Divisi IT",
      time: "2 jam yang lalu",
      type: "create",
      icon: Users
    },
    {
      id: 2,
      action: "Memperbarui merchandise",
      user: "Admin",
      item: "T-Shirt Organisasi 2024",
      time: "4 jam yang lalu",
      type: "update",
      icon: ShoppingBag
    },
    {
      id: 3,
      action: "Upload portofolio baru",
      user: "Admin",
      item: "Website E-Commerce",
      time: "1 hari yang lalu",
      type: "create",
      icon: Briefcase
    },
    {
      id: 4,
      action: "Menambahkan alumni",
      user: "Admin",
      item: "Sarah Wilson - Angkatan 2022",
      time: "2 hari yang lalu",
      type: "create",
      icon: GraduationCap
    }
  ];

  const quickActions = [
    {
      title: "Tambah Pengurus",
      description: "Daftarkan pengurus baru",
      icon: Users,
      action: "pengurus",
      color: "blue"
    },
    {
      title: "Tambah Merchandise",
      description: "Upload produk baru",
      icon: ShoppingBag,
      action: "merchandise", 
      color: "purple"
    },
    {
      title: "Tambah Portofolio",
      description: "Showcase project terbaru",
      icon: Briefcase,
      action: "portofolio",
      color: "orange"
    },
    {
      title: "Tambah Alumni",
      description: "Daftarkan alumni baru",
      icon: GraduationCap,
      action: "alumni",
      color: "emerald"
    }
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
                  <span className="text-xs font-medium text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full">
                    {stat.change}
                  </span>
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
                    <p className="text-sm font-medium text-slate-800">
                      {activity.action}
                    </p>
                    <p className="text-sm text-slate-600 truncate">
                      {activity.item}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {activity.time}
                    </p>
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
                      <p className="text-sm font-medium text-slate-800">
                        {action.title}
                      </p>
                      <p className="text-xs text-slate-600">
                        {action.description}
                      </p>
                    </div>
                    <ArrowUpRight size={16} className="text-slate-400 group-hover:text-slate-600" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* System Status */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <BarChart3 size={20} className="text-purple-600" />
            Status Sistem
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg border border-emerald-200">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <span className="text-sm font-medium text-slate-700">Server Status</span>
              </div>
              <span className="text-sm text-emerald-600 font-medium">Online</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium text-slate-700">Database</span>
              </div>
              <span className="text-sm text-blue-600 font-medium">Terhubung</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-sm font-medium text-slate-700">Backup</span>
              </div>
              <span className="text-sm text-yellow-600 font-medium">Terjadwal</span>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <TrendingUp size={20} className="text-indigo-600" />
            Ringkasan Bulan Ini
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Pengurus Baru</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-800">3 orang</span>
                <span className="text-xs text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full">+50%</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Alumni Terdaftar</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-800">8 orang</span>
                <span className="text-xs text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full">+12%</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Portofolio Upload</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-800">5 project</span>
                <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">+25%</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Merchandise Baru</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-800">2 item</span>
                <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded-full">+100%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

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
        {activePage === "proker" && <ManajemenProker   />}
        {activePage === "blog" && <ManajemenBlog />}
        {/* {activePage === "proker" && (
          <div className="bg-white rounded-lg border border-slate-200 p-8 text-center">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText size={32} className="text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800 mb-2">
              Manajemen Program Kerja
            </h1>
            <p className="text-slate-600">
              Fitur ini sedang dalam tahap pengembangan. Segera hadir!
            </p>
          </div>
        )}

        {activePage === "blog" && (
          <div className="bg-white rounded-lg border border-slate-200 p-8 text-center">
            <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText size={32} className="text-orange-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800 mb-2">
              Manajemen Blog
            </h1>
            <p className="text-slate-600">
              Fitur ini sedang dalam tahap pengembangan. Segera hadir!
            </p>
          </div>
        )} */}
      </main>
    </div>
  );
}

export default AdminDashboard;