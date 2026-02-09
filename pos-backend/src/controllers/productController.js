import { db } from "../config/db.js";

export const getProducts = async (req, res) => {
  const [rows] = await db.query("SELECT * FROM products");
  res.json(rows);
};

export const createProduct = async (req, res) => {
  const { nama_barang, harga, stock } = req.body;
  await db.query("INSERT INTO products (nama_barang, harga, stock) VALUES (?, ?, ?)", [nama_barang, harga, stock]);
  res.json({ message: "Product added" });
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { nama_barang, harga, stock } = req.body;
  await db.query("UPDATE products SET nama_barang=?, harga=?, stock=? WHERE id=?", [nama_barang, harga, stock, id]);
  res.json({ message: "Product updated" });
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  await db.query("DELETE FROM products WHERE id=?", [id]);
  res.json({ message: "Product deleted" });
};
