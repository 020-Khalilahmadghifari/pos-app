import { useContext } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function AdminLayout() {
    const { user, logout } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();

    const isActive = (path) => location.pathname === path;

    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-white flex flex-col shadow-xl">
                <div className="p-6 border-b border-slate-700 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#009687] flex items-center justify-center font-bold text-xl">
                        POS
                    </div>
                    <h1 className="text-2xl font-bold tracking-wider">Backoffice</h1>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <Link
                        to="/admin/dashboard"
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive('/admin/dashboard') ? 'bg-[#009687] text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
                    >
                        <span>📊</span> Dashboard
                    </Link>
                    <Link
                        to="/admin/products"
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive('/admin/products') ? 'bg-[#009687] shadow-md text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
                    >
                        <span>📦</span> Products
                    </Link>
                    <Link
                        to="/admin/history"
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive('/admin/history') ? 'bg-[#009687] shadow-md text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
                    >
                        <span>📜</span> History
                    </Link>
                </nav>

                <div className="p-4 border-t border-slate-700">
                    <div className="flex items-center gap-3 mb-4 px-2">
                        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
                            👤
                        </div>
                        <div>
                            <div className="text-sm font-medium">{user?.username || 'Admin'}</div>
                            <div className="text-xs text-slate-400 capitalize">{user?.role}</div>
                        </div>
                    </div>
                    <button
                        onClick={() => { logout(); navigate('/login'); }}
                        className="w-full bg-red-600/90 hover:bg-red-600 text-white py-2 rounded-lg transition shadow-sm flex items-center justify-center gap-2"
                    >
                        <span>🚪</span> Logout
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white shadow-sm h-16 flex items-center justify-between px-6 z-10">
                    <h2 className="text-xl font-semibold text-slate-800 capitalize">
                        {location.pathname.split('/').pop()}
                    </h2>
                    <Link to="/" className="text-sm text-[#009687] font-medium hover:underline">
                        Go to POS Machine &rarr;
                    </Link>
                </header>

                <main className="flex-1 overflow-auto p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
