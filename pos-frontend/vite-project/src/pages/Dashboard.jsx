import { useEffect, useState } from "react";
import api from "../api";

export default function Dashboard() {
    const [stats, setStats] = useState({
        todaySales: 0,
        monthSales: 0,
        totalTransactions: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const todayRes = await api.get("/transactions?filter=day");
                const monthRes = await api.get("/transactions?filter=month");

                const todayTotal = todayRes.data.reduce((acc, curr) => acc + curr.total, 0);
                const monthTotal = monthRes.data.reduce((acc, curr) => acc + curr.total, 0);

                setStats({
                    todaySales: todayTotal,
                    monthSales: monthTotal,
                    totalTransactions: todayRes.data.length
                });
            } catch (err) {
                console.error("Failed to load stats", err);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Card 1 */}
                <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-[#009687]">
                    <div className="text-slate-500 text-sm font-medium uppercase tracking-wide">Hari Ini</div>
                    <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-slate-800">Rp {stats.todaySales.toLocaleString()}</span>
                    </div>
                </div>

                {/* Card 2 */}
                <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500">
                    <div className="text-slate-500 text-sm font-medium uppercase tracking-wide">Bulan Ini</div>
                    <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-slate-800">Rp {stats.monthSales.toLocaleString()}</span>
                    </div>
                </div>

                {/* Card 3 */}
                <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-purple-500">
                    <div className="text-slate-500 text-sm font-medium uppercase tracking-wide">Transaksi Hari Ini</div>
                    <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-slate-800">{stats.totalTransactions}</span>
                        <span className="text-sm text-slate-400">trx</span>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-8 flex items-center justify-center min-h-[300px] text-slate-400">
                <div className="text-center">
                    <div className="text-4xl mb-2">📈</div>
                    <p>Grafik Penjualan akan muncul disini (Next Phase)</p>
                </div>
            </div>
        </div>
    );
}
