import { useEffect, useState, useContext } from "react";
import api from "../api";
import { AuthContext } from "../context/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [nama_barang, setNamaBarang] = useState("");
  const [harga, setHarga] = useState("");
  const [stock, setStock] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const { user } = useContext(AuthContext);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");
      setProducts(res.data);
    } catch {
      toast.error("Gagal load produk");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nama_barang || !harga || !stock) return toast.warn("Isi semua field!");

    try {
      const payload = { nama_barang, harga: parseInt(harga), stock: parseInt(stock) };
      if (editingProduct) {
        await api.put(`/products/${editingProduct.id}`, payload);
        toast.success("Produk berhasil diupdate!");
      } else {
        await api.post("/products", payload);
        toast.success("Produk berhasil ditambahkan!");
      }
      setNamaBarang(""); setHarga(""); setStock(""); setEditingProduct(null);
      fetchProducts();
    } catch {
      toast.error("Gagal simpan produk");
    }
  };

  const handleEdit = (p) => {
    setEditingProduct(p);
    setNamaBarang(p.nama_barang);
    setHarga(p.harga);
    setStock(p.stock);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingProduct(null);
    setNamaBarang(""); setHarga(""); setStock("");
  };

  const deleteProduct = async (id) => {
    if (!confirm("Hapus produk ini?")) return;
    try {
      await api.delete(`/products/${id}`);
      toast.info("Produk dihapus!");
      fetchProducts();
    } catch {
      toast.error("Gagal hapus produk");
    }
  };

  return (
    <div className="p-6">
      <ToastContainer position="top-right" autoClose={2000} />
      <h2 className="text-2xl font-bold mb-4">Manajemen Produk</h2>

      {user.role === "admin" && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded shadow-md space-y-3 bg-white">
          <h3 className="font-bold text-lg">{editingProduct ? "Edit Produk" : "Tambah Produk Baru"}</h3>
          <input type="text" placeholder="Nama Barang" className="border p-2 w-full rounded" value={nama_barang} onChange={e => setNamaBarang(e.target.value)} />
          <input type="number" placeholder="Harga" className="border p-2 w-full rounded" value={harga} onChange={e => setHarga(e.target.value)} />
          <input type="number" placeholder="Stock" className="border p-2 w-full rounded" value={stock} onChange={e => setStock(e.target.value)} />

          <div className="flex gap-2">
            <button type="submit" className={`flex-1 text-white px-4 py-2 rounded font-bold ${editingProduct ? "bg-blue-500 hover:bg-blue-600" : "bg-yellow-400 text-stone-900 hover:bg-yellow-500"}`}>
              {editingProduct ? "Update Produk" : "Tambah Produk"}
            </button>
            {editingProduct && (
              <button type="button" onClick={cancelEdit} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
                Batal
              </button>
            )}
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {products.map(p => (
          <div key={p.id} className="border rounded-lg p-4 shadow hover:shadow-lg transition bg-white flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-lg text-[#009687]">{p.nama_barang}</h3>
              <p className="text-gray-600 font-semibold">Rp {p.harga.toLocaleString()}</p>
              <p className="text-sm text-gray-500">Stock: {p.stock}</p>
            </div>
            {user.role === "admin" && (
              <div className="mt-4 flex gap-2 border-t pt-2">
                <button onClick={() => handleEdit(p)} className="flex-1 bg-blue-500 text-white py-1 rounded text-sm hover:bg-blue-600">Edit</button>
                <button onClick={() => deleteProduct(p.id)} className="flex-1 bg-red-500 text-white py-1 rounded text-sm hover:bg-red-600">Hapus</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
