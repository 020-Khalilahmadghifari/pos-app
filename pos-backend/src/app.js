import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoute from "./routes/authRoute.js";

import productRoute from "./routes/productRoute.js";
import transactionRoute from "./routes/transactionRoute.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoute);

app.use("/api/products", productRoute);
app.use("/api/transactions", transactionRoute);

app.listen(process.env.PORT || 3001, () => console.log(`Server running on port ${process.env.PORT}`));
