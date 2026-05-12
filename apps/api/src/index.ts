import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import rateLimit from "express-rate-limit";

import authRoutes from "./modules/auth/auth.routes";
import productRoutes from "./modules/products/products.routes";
import inventoryRoutes from "./modules/inventory/inventory.routes";
import documentsRoutes from "./modules/documents/documents.routes";
import analyticsRoutes from "./modules/analytics/analytics.routes";

import { authMiddleware } from "./middlewares/auth.middleware";

dotenv.config();

const app = express();

app.use(helmet());

app.use(compression());

app.use(morgan("dev"));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  max: 100,
});

app.use(limiter);

app.use(
  cors({
    origin: process.env.FRONTEND_URL,

    credentials: true,
  }),
);
app.use(express.json());

app.get("/", (_, res) => {
  res.json({
    message: "Electronics ERP API Running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/documents", documentsRoutes);
app.use("/api/analytics", analyticsRoutes);

app.get("/api/me", authMiddleware, async (req, res) => {
  res.json({
    user: req.user,
  });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});
