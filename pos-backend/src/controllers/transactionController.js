import { db } from "../config/db.js";

export const createTransaction = async (req, res) => {
  const { items } = req.body;
  const userId = req.user.id;
  const total = items.reduce((a, b) => a + b.subtotal, 0);

  const [result] = await db.query("INSERT INTO transactions (cashier_id, total) VALUES (?, ?)", [userId, total]);
  const transactionId = result.insertId;

  for (let item of items) {
    await db.query("INSERT INTO transaction_details (transaction_id, product_id, quantity, subtotal) VALUES (?, ?, ?, ?)", [transactionId, item.product_id, item.quantity, item.subtotal]);
    await db.query("UPDATE products SET stock = stock - ? WHERE id=?", [item.quantity, item.product_id]);
  }

  res.json({ message: "Transaction successful" });
};

export const getTransactions = async (req, res) => {
  const { filter } = req.query;
  let query = `
    SELECT t.id, t.cashier_id, t.total, t.created_at,
      td.id as detail_id, td.product_id, p.nama_barang, td.quantity, td.subtotal
    FROM transactions t
    LEFT JOIN transaction_details td ON t.id = td.transaction_id
    LEFT JOIN products p ON td.product_id = p.id
  `;

  if (filter === 'day') {
    query += " WHERE DATE(t.created_at) = CURDATE()";
  } else if (filter === 'month') {
    query += " WHERE MONTH(t.created_at) = MONTH(CURDATE()) AND YEAR(t.created_at) = YEAR(CURDATE())";
  } else if (filter === 'year') {
    query += " WHERE YEAR(t.created_at) = YEAR(CURDATE())";
  }

  query += " ORDER BY t.created_at DESC";

  const [transactions] = await db.query(query);

  // Group by transaction]
  const grouped = [];
  transactions.forEach((t) => {
    let trx = grouped.find(g => g.id === t.id);
    if (!trx) {
      trx = { id: t.id, cashier_id: t.cashier_id, total: t.total, created_at: t.created_at, details: [] };
      grouped.push(trx);
    }
    if (t.detail_id) {
      trx.details.push({ id: t.detail_id, product_id: t.product_id, nama_barang: t.nama_barang, quantity: t.quantity, subtotal: t.subtotal });
    }
  });

  res.json(grouped);
};
