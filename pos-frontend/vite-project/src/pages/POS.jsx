import { useEffect, useState } from "react";
import api from "../api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function POS() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");

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

  useEffect(() => {
    setTotal(cart.reduce((sum, c) => sum + c.subtotal, 0));
  }, [cart]);

  const addToCart = (p) => {
    if (p.stock <= 0) return toast.warn("Stok habis!");

    const exist = cart.find(c => c.product_id === p.id);
    if (exist) {
      if (exist.quantity >= p.stock) return toast.warn("Stok tidak cukup!");
      setCart(cart.map(c => c.product_id === p.id ? { ...c, quantity: c.quantity + 1, subtotal: (c.quantity + 1) * c.harga } : c));
    } else {
      setCart([...cart, { product_id: p.id, nama_barang: p.nama_barang, harga: p.harga, quantity: 1, subtotal: p.harga, stock: p.stock }]);
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(c => c.product_id !== productId));
  };

  const updateQuantity = (productId, delta) => {
    setCart(cart.map(c => {
      if (c.product_id === productId) {
        const newQty = c.quantity + delta;
        if (newQty < 1) return c;
        if (newQty > c.stock) {
          toast.warn("Mencapai batas stok!");
          return c;
        }
        return { ...c, quantity: newQty, subtotal: newQty * c.harga };
      }
      return c;
    }));
  };

  const checkout = async () => {
    if (cart.length === 0) { toast.warn("Cart kosong!"); return; }
    try {
      await api.post("/transactions", { items: cart });
      toast.success("Transaksi berhasil!");
      printStruk(cart, total);
      setCart([]);
      fetchProducts(); // Refresh stock
    } catch {
      toast.error("Gagal checkout");
    }
  };

  const printStruk = (cart, total) => {
    const date = new Date().toLocaleString();
    let strukHtml = `
      <html>
        <head>
          <title>Struk Belanja</title>
          <style>
            body { font-family: 'Courier New', monospace; width: 300px; margin: 0 auto; padding: 20px; text-align: center; }
            h2 { margin: 0; }
            .meta { font-size: 12px; margin-bottom: 10px; border-bottom: 1px dashed #000; padding-bottom: 5px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 10px; }
            th, td { text-align: left; font-size: 12px; }
            .right { text-align: right; }
            .total { border-top: 1px dashed #000; padding-top: 5px; font-weight: bold; }
            .footer { font-size: 10px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <h2>POS KASIR</h2>
          <div class="meta">
            <p>${date}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th class="right">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${cart.map(item => `
                <tr>
                  <td>${item.nama_barang}</td>
                  <td>${item.quantity}</td>
                  <td class="right">${item.subtotal.toLocaleString()}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="total">
            <div style="display: flex; justify-content: space-between;">
              <span>TOTAL</span>
              <span>Rp ${total.toLocaleString()}</span>
            </div>
          </div>
          <div class="footer">
            Terima Kasih Telah Berbelanja!
          </div>
          <script>window.print();</script>
        </body>
      </html>
    `;
    const printWindow = window.open("", "_blank", "width=400,height=600");
    printWindow.document.write(strukHtml);
    printWindow.document.close();
  }

  const filteredProducts = products.filter(p => p.nama_barang.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-60px)] bg-gray-100">
      <ToastContainer position="top-right" autoClose={2000} />

      {/* Product Grid */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Katalog Produk</h2>
          <input
            type="text"
            placeholder="🔎 Cari produk..."
            className="border p-2 rounded w-64 shadow-sm"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map(p => (
            <div
              key={p.id}
              className={`border bg-white rounded-xl p-4 shadow hover:shadow-lg transition cursor-pointer flex flex-col justify-between ${p.stock <= 0 ? 'opacity-50 grayscale cursor-not-allowed' : ''}`}
              onClick={() => p.stock > 0 && addToCart(p)}
            >
              <div>
                <div className="font-bold text-lg mb-1">{p.nama_barang}</div>
                <div className="text-[#009687] font-semibold">Rp {p.harga.toLocaleString()}</div>
              </div>
              <div className="text-xs text-gray-500 mt-2">Stok: {p.stock}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Cart Sidebar */}
      <div className="w-full md:w-96 bg-white border-l shadow-2xl flex flex-col h-full">
        <div className="p-4 bg-[#009687] text-white">
          <h2 className="text-xl font-bold">Keranjang Belanja</h2>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center text-gray-400 mt-10">Keranjang kosong</div>
          ) : (
            cart.map(item => (
              <div key={item.product_id} className="flex justify-between items-center bg-gray-50 p-3 rounded shadow-sm">
                <div>
                  <div className="font-bold">{item.nama_barang}</div>
                  <div className="text-sm text-gray-500">
                    Rp {item.harga.toLocaleString()} x {item.quantity}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center border rounded bg-white">
                    <button onClick={() => updateQuantity(item.product_id, -1)} className="px-2 py-1 hover:bg-gray-100">-</button>
                    <span className="px-2">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.product_id, 1)} className="px-2 py-1 hover:bg-gray-100">+</button>
                  </div>
                  <button onClick={() => removeFromCart(item.product_id)} className="text-red-500 hover:text-red-700 ml-2">
                    &times;
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-6 bg-gray-50 border-t">
          <div className="flex justify-between text-xl font-bold mb-4">
            <span>Total</span>
            <span>Rp {total.toLocaleString()}</span>
          </div>
          <button
            onClick={checkout}
            disabled={cart.length === 0}
            className={`w-full py-3 rounded-lg font-bold text-white transition ${cart.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-yellow-400 shadow-lg'}`}
          >
            Bayar & Cetak Struk
          </button>
        </div>
      </div>
    </div>
  );
}
