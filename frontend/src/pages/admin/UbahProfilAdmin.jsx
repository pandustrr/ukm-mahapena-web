import { useState, useEffect } from "react";
import { Save, Lock, User, Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react";

function UbahProfilAdmin() {
    const [currentUsername, setCurrentUsername] = useState(""); // Username saat ini
    const [username, setUsername] = useState(""); // Username baru (opsional)
    const [passwordLama, setPasswordLama] = useState("");
    const [passwordBaru, setPasswordBaru] = useState("");
    const [konfirmasiPassword, setKonfirmasiPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [pesan, setPesan] = useState(null);

    const [showPasswordLama, setShowPasswordLama] = useState(false);
    const [showPasswordBaru, setShowPasswordBaru] = useState(false);
    const [showKonfirmasiPassword, setShowKonfirmasiPassword] = useState(false);



    // Ambil username dari sessionStorage saat component mount
    useEffect(() => {
        const fetchAdmin = async () => {
            try {
                const token = sessionStorage.getItem("adminToken");
                const res = await fetch("http://localhost:8000/api/admin/profile", {
                    headers: { Authorization: token },
                });
                const data = await res.json();
                if (res.ok) {
                    setCurrentUsername(data.username);
                    setUsername(data.username); // prefill
                } else {
                    console.error(data.message || "Gagal ambil data admin");
                }
            } catch (err) {
                console.error("Terjadi kesalahan saat fetch admin:", err);
            }
        };
        fetchAdmin();
    }, []);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setPesan(null);

        if (passwordBaru && passwordBaru !== konfirmasiPassword) {
            setPesan({ type: "error", text: "Password baru dan konfirmasi tidak sama!" });
            setLoading(false);
            return;
        }

        try {
            const token = sessionStorage.getItem("adminToken");
            const res = await fetch("http://localhost:8000/api/admin/update-profile", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token,
                },
                body: JSON.stringify({
                    username: username || currentUsername,
                    old_password: passwordLama,
                    new_password: passwordBaru,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                // Pesan sukses
                setPesan({ type: "success", text: data.message || "Profil berhasil diperbarui!" });

                // Hapus session token supaya logout otomatis
                sessionStorage.removeItem("adminToken");
                sessionStorage.removeItem("adminData");

                // Redirect ke login
                setTimeout(() => {
                    window.location.href = "/admin/login";
                }, 1500); // delay 1 detik biar pesan sukses sempat muncul
            } else {
                setPesan({ type: "error", text: data.message || "Gagal memperbarui profil" });
            }
        } catch (err) {
            setPesan({ type: "error", text: "Terjadi kesalahan, coba lagi." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                <User className="w-4 h-4 text-blue-600" />
                            </div>
                            <h1 className="text-2xl font-bold text-gray-800">
                                Ubah Profil Admin
                            </h1>
                        </div>
                        <p className="text-gray-600">
                            Perbarui informasi akun administrator Anda
                        </p>
                    </div>
                </div>

                {/* Message */}
                {pesan && (
                    <div className={`mb-4 p-4 rounded-lg border flex items-center gap-3 ${pesan.type === "success"
                        ? "bg-green-50 border-green-200 text-green-700"
                        : "bg-red-50 border-red-200 text-red-700"
                        }`}>
                        {pesan.type === "success" ? (
                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                        ) : (
                            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                        )}
                        <span className="text-sm font-medium">{pesan.text}</span>
                    </div>
                )}

                {/* Form */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Username */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Username (Opsional)
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                                    placeholder={currentUsername || "Masukkan username baru"}
                                />
                            </div>
                            {currentUsername && (
                                <p className="text-sm text-gray-500 mt-1">Username saat ini: {currentUsername}</p>
                            )}
                        </div>

                        {/* Password Lama */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password Lama
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type={showPasswordLama ? "text" : "password"}
                                    value={passwordLama}
                                    onChange={(e) => setPasswordLama(e.target.value)}
                                    className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                                    placeholder="Masukkan password lama"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPasswordLama(!showPasswordLama)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                                >
                                    {showPasswordLama ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        {/* Password Baru */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password Baru
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type={showPasswordBaru ? "text" : "password"}
                                    value={passwordBaru}
                                    onChange={(e) => setPasswordBaru(e.target.value)}
                                    className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                                    placeholder="Masukkan password baru"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPasswordBaru(!showPasswordBaru)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                                >
                                    {showPasswordBaru ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        {/* Konfirmasi Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Konfirmasi Password Baru
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type={showKonfirmasiPassword ? "text" : "password"}
                                    value={konfirmasiPassword}
                                    onChange={(e) => setKonfirmasiPassword(e.target.value)}
                                    className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                                    placeholder="Ulangi password baru"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowKonfirmasiPassword(!showKonfirmasiPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                                >
                                    {showKonfirmasiPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        {/* Password Match Indicator */}
                        {konfirmasiPassword && (
                            <div className={`text-sm flex items-center gap-2 ${passwordBaru === konfirmasiPassword
                                ? 'text-green-600'
                                : 'text-red-600'
                                }`}>
                                {passwordBaru === konfirmasiPassword ? (
                                    <CheckCircle size={16} />
                                ) : (
                                    <AlertCircle size={16} />
                                )}
                                {passwordBaru === konfirmasiPassword
                                    ? 'Password cocok'
                                    : 'Password tidak cocok'
                                }
                            </div>
                        )}

                        {/* Submit Button */}
                        <div className="pt-4 border-t border-gray-200">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                                        </svg>
                                        Menyimpan...
                                    </>
                                ) : (
                                    <>
                                        <Save size={16} />
                                        Simpan Perubahan
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default UbahProfilAdmin;
