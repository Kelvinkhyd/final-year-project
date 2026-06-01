"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleUserRegistration = handleUserRegistration;
exports.getRegisteredUsers = getRegisteredUsers;
const prisma_1 = require("../config/prisma");
const uave_service_1 = require("../services/uave.service");
const user_service_1 = require("../services/user.service");
const mail_service_1 = require("../services/mail.service");
async function handleUserRegistration(req, res) {
    const startTime = performance.now();
    try {
        const { usernameUnicode, rawEmail } = req.body;
        if (!usernameUnicode || !rawEmail) {
            return res.status(400).json({
                isValid: false,
                error: "Missing required fields: usernameUnicode and rawEmail are required."
            });
        }
        const uaveResult = await (0, uave_service_1.executeUaveProcessingPipeline)(rawEmail);
        const savedUser = await prisma_1.prisma.$transaction(async (tx) => {
            return (0, user_service_1.createUserInTransaction)({
                usernameUnicode,
                emailUnicode: uaveResult.normalizedUnicode,
                canonicalEmail: uaveResult.canonicalEmail,
                aceDomain: uaveResult.aceDomain
            }, tx);
        });
        try {
            await (0, mail_service_1.sendVerificationEmail)(savedUser.canonicalEmail);
        }
        catch (mailError) {
            console.error("[MAIL] Verification email failed:", mailError);
        }
        const latencyMs = Number((performance.now() - startTime).toFixed(2));
        return res.status(201).json({
            isValid: true,
            message: "Registration successful. Welcome to UA-Shop.",
            user: {
                id: savedUser.id,
                usernameUnicode: savedUser.usernameUnicode,
                emailUnicode: savedUser.emailUnicode,
                canonicalEmail: savedUser.canonicalEmail,
                aceDomain: savedUser.aceDomain,
                createdAt: savedUser.createdAt.toISOString()
            },
            uaveMetrics: {
                latencyMs,
                scriptAnalysis: uaveResult.scriptAnalysis
            }
        });
    }
    catch (error) {
        const err = error;
        if (err.code === "P2002") {
            return res.status(409).json({
                isValid: false,
                error: "This email address is already registered."
            });
        }
        return res.status(500).json({
            isValid: false,
            error: err.message ?? "An unexpected server error occurred."
        });
    }
}
async function getRegisteredUsers(_req, res) {
    try {
        const users = await prisma_1.prisma.user.findMany({
            orderBy: { createdAt: "desc" },
            take: 50
        });
        return res.status(200).json(users);
    }
    catch (error) {
        return res.status(500).json({ error: "Failed to fetch users." });
    }
}
