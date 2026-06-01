"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const email_routes_1 = __importDefault(require("./routes/email.routes"));
const product_routes_1 = __importDefault(require("./routes/product.routes"));
const order_routes_1 = __importDefault(require("./routes/order.routes"));
const app = (0, express_1.default)();
// IMPORTANT: CORS fix for production + local dev
app.use((0, cors_1.default)({
    origin: [
        "http://localhost:5173",
        "https://your-frontend-domain.vercel.app" // replace later
    ],
    credentials: true
}));
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json({ limit: "1mb" }));
// Routes
app.use("/api/email", email_routes_1.default);
app.use("/api/products", product_routes_1.default);
app.use("/api/orders", order_routes_1.default);
// Health check (for Render + testing)
app.get("/health", (_req, res) => {
    res.status(200).json({
        status: "ok",
        message: "UA-Shop Backend is running"
    });
});
// Root route (basic check)
app.get("/", (_req, res) => {
    res.json({
        message: "UA-Shop Backend Running",
        status: "ok"
    });
});
exports.default = app;
