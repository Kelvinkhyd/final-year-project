import express from "express";
import { handleUserRegistration, getRegisteredUsers } from "../controllers/auth.controller";

const router = express.Router();

router.post("/validate", handleUserRegistration);
router.get("/users",     getRegisteredUsers);

export default router;
