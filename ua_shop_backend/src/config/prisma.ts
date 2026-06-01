import { PrismaClient } from "@prisma/client";

// DATABASE_URL is already loaded by server.ts before this file is imported
export const prisma = new PrismaClient({
  log: ["error", "warn"],
});
