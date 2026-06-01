import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import emailRoutes from "./routes/email.routes";
import productRoutes from "./routes/product.routes";
import orderRoutes from "./routes/order.routes";

const app = express();

// IMPORTANT: CORS fix for production + local dev
app.use(cors({
origin: [
"http://localhost:5173",
"https://your-frontend-domain.vercel.app" // replace later
],
credentials: true
}));

app.use(helmet());
app.use(morgan("dev"));
app.use(express.json({ limit: "1mb" }));

// Routes
app.use("/api/email", emailRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

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

export default app;
