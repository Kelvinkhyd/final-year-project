import dotenv from "dotenv";
import path from "path";

// Load .env FIRST before any other imports that need env vars
dotenv.config({ path: path.resolve(__dirname, "../.env") });

import app from "./app";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`[UA-SHOP] Backend server running on http://localhost:${PORT}`);
  console.log(`[UA-SHOP] Database: ${process.env.DATABASE_URL ? "Connected" : "NOT SET"}`);
});
