import express from "express";
import { createTransaction, getTransactions } from "../controllers/transactionController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
const router = express.Router();

router.use(authMiddleware);
router.post("/", createTransaction);
router.get("/", getTransactions);

export default router;
