import { useEffect, useState } from "react";
import axios from "axios";

export default function POSPage() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    axios.get("/api/products", { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setProducts(res.data))
      .catch(err => console.log(err));
  }, []);

  const addToCart = (product) => {
    const exist = cart.find(p => p.product_id === product.id);
    if (exist) {
      setCart(cart.map(p => 
        p.product_id === product.id 
          ? { ...p, quantity: p.quantity + 1, subtotal: (p.quantity + 1) * p.harga } 
          : p
      ));
    } else {
      setCart([...cart, { product_id: product.id, nama_barang: product.nama_barang, harga: product.harga, quantity: 1, subtotal: product.harga }]);
    }
  };

  const checkout = () => {
    if(cart.length === 0) return alert("Keranjang kosong");

    const items = cart.map(c => ({
      product_id: c.product_id,
      quantity: c.quantity,
      subtotal: c.subtotal
    }));

    axios.post("/api/transactions", { items }, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        alert(res.data.message);
        setCart([]);
      })
      .catch(err => console.log(err));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">POS Kasir</h1>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {products.map(p => (
          <button 
            key={p.id} 
            onClick={() => addToCart(p)} 
            className="border p-4 rounded hover:bg-gray-100"
          >
            {p.nama_barang} <br /> Rp{p.harga}
          </button>
        ))}
      </div>

      <h2 className="text-xl font-semibold">Keranjang</h2>
      <ul className="mb-4">
        {cart.map(c => (
          <li key={c.product_id}>
            {c.nama_barang} x {c.quantity} = Rp{c.subtotal}
          </li>
        ))}
      </ul>

      <button 
        onClick={checkout} 
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Checkout
      </button>
    </div>
  );
}
