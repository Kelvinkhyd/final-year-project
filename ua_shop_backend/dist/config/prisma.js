"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_1 = require("@prisma/client");
// DATABASE_URL is already loaded by server.ts before this file is imported
exports.prisma = new client_1.PrismaClient({
    log: ["error", "warn"],
});
