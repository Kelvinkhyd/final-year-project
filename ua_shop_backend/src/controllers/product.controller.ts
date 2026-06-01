import { Request, Response } from "express";
import { prisma } from "../config/prisma";

export async function getAllProducts(_req: Request, res: Response) {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "asc" }
    });
    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch products." });
  }
}

export async function getProductById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      return res.status(404).json({ error: "Product not found." });
    }
    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch product." });
  }
}
