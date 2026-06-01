import { Request, Response } from "express";
import { prisma }                        from "../config/prisma";
import { executeUaveProcessingPipeline } from "../services/uave.service";
import { createUserInTransaction }       from "../services/user.service";
import { sendVerificationEmail }         from "../services/mail.service";

export async function handleUserRegistration(req: Request, res: Response) {
  const startTime = performance.now();

  try {
    const { usernameUnicode, rawEmail } = req.body;

    if (!usernameUnicode || !rawEmail) {
      return res.status(400).json({
        isValid: false,
        error: "Missing required fields: usernameUnicode and rawEmail are required."
      });
    }

    const uaveResult = await executeUaveProcessingPipeline(rawEmail);

    const savedUser = await prisma.$transaction(async (tx) => {
      return createUserInTransaction({
        usernameUnicode,
        emailUnicode:   uaveResult.normalizedUnicode,
        canonicalEmail: uaveResult.canonicalEmail,
        aceDomain:      uaveResult.aceDomain
      }, tx);
    });

    try {
      await sendVerificationEmail(savedUser.canonicalEmail);
    } catch (mailError) {
      console.error("[MAIL] Verification email failed:", mailError);
    }

    const latencyMs = Number((performance.now() - startTime).toFixed(2));

    return res.status(201).json({
      isValid: true,
      message: "Registration successful. Welcome to UA-Shop.",
      user: {
        id:              savedUser.id,
        usernameUnicode: savedUser.usernameUnicode,
        emailUnicode:    savedUser.emailUnicode,
        canonicalEmail:  savedUser.canonicalEmail,
        aceDomain:       savedUser.aceDomain,
        createdAt:       savedUser.createdAt.toISOString()
      },
      uaveMetrics: {
        latencyMs,
        scriptAnalysis: uaveResult.scriptAnalysis
      }
    });

  } catch (error: unknown) {
    const err = error as { code?: string; message?: string };

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

export async function getRegisteredUsers(_req: Request, res: Response) {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 50
    });
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch users." });
  }
}
