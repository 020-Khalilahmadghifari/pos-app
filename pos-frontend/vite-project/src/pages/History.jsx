import { useEffect, useState } from "react";
import api from "../api";

export default function History() {
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState("all");

  const fetchTransactions = async () => {
    let url = "/transactions";
    if (filter !== "all") url += `?filter=${filter}`;
    const res = await api.get(url);
    setTransactions(res.data);
  };

  useEffect(() => {
    fetchTransactions();
  }, [filter]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Riwayat Transaksi</h2>
          <select
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="border p-2 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-[#009687]"
          >
            <option value="all">Semua Waktu</option>
            <option value="day">Hari Ini</option>
            <option value="month">Bulan Ini</option>
            <option value="year">Tahun Ini</option>
          </select>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-[#009687] text-white">
              <tr>
                <th className="p-4">ID Transaksi</th>
                <th className="p-4">Tanggal</th>
                <th className="p-4 text-right">Total</th>
                <th className="p-4 text-center">Items</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-gray-500">Belum ada transaksi</td>
                </tr>
              ) : (
                transactions.map(t => (
                  <tr key={t.id} className="hover:bg-gray-50 transition">
                    <td className="p-4 font-mono text-sm text-gray-600">#{t.id}</td>
                    <td className="p-4 text-gray-700">
                      {new Date(t.created_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                    </td>
                    <td className="p-4 text-right font-bold text-gray-900">Rp {t.total.toLocaleString()}</td>
                    <td className="p-4 text-center">
                      <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">
                        {t.details ? t.details.length : 0} items
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
