"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Load .env FIRST before any other imports that need env vars
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, "../.env") });
const app_1 = __importDefault(require("./app"));
const PORT = process.env.PORT || 5000;
app_1.default.listen(PORT, () => {
    console.log(`[UA-SHOP] Backend server running on http://localhost:${PORT}`);
    console.log(`[UA-SHOP] Database: ${process.env.DATABASE_URL ? "Connected" : "NOT SET"}`);
});
