import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

import express from "express";

import compression from "compression";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";

import analyticsRoutes from "./modules/analytics/analytics.routes";
import auditRoutes from "./modules/audit/audit.routes";
import authRoutes from "./modules/auth/auth.routes";
import customersRoutes from "./modules/customers/customers.routes";
import documentsRoutes from "./modules/documents/documents.routes";
import inventoryRoutes from "./modules/inventory/inventory.routes";
import productRoutes from "./modules/products/products.routes";

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

app.use("/api/customers", customersRoutes);

app.use("/api/products", productRoutes);

app.use("/api/inventory", inventoryRoutes);

app.use("/api/documents", documentsRoutes);

app.use("/api/analytics", analyticsRoutes);

app.use("/api/audit", auditRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});
