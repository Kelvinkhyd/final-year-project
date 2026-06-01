import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import emailRoutes   from "./routes/email.routes";
import productRoutes from "./routes/product.routes";
import orderRoutes   from "./routes/order.routes";

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(helmet());
app.use(morgan("dev"));
app.use(express.json({ limit: "1mb" }));

// Routes
app.use("/api/email",    emailRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders",   orderRoutes);

app.get("/", (_req, res) => {
  res.json({ message: "UA-Shop Backend Running", status: "ok" });
});

export default app;
