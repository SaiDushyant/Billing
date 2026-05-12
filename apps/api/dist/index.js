"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const compression_1 = __importDefault(require("compression"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const auth_routes_1 = __importDefault(require("./modules/auth/auth.routes"));
const products_routes_1 = __importDefault(require("./modules/products/products.routes"));
const inventory_routes_1 = __importDefault(require("./modules/inventory/inventory.routes"));
const documents_routes_1 = __importDefault(require("./modules/documents/documents.routes"));
const analytics_routes_1 = __importDefault(require("./modules/analytics/analytics.routes"));
const auth_middleware_1 = require("./middlewares/auth.middleware");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
app.use((0, compression_1.default)());
app.use((0, morgan_1.default)("dev"));
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 100,
});
app.use(limiter);
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));
app.use(express_1.default.json());
app.get("/", (_, res) => {
    res.json({
        message: "Electronics ERP API Running",
    });
});
app.use("/api/auth", auth_routes_1.default);
app.use("/api/products", products_routes_1.default);
app.use("/api/inventory", inventory_routes_1.default);
app.use("/api/documents", documents_routes_1.default);
app.use("/api/analytics", analytics_routes_1.default);
app.get("/api/me", auth_middleware_1.authMiddleware, async (req, res) => {
    res.json({
        user: req.user,
    });
});
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`API running on port ${PORT}`);
});
