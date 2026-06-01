"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllProducts = getAllProducts;
exports.getProductById = getProductById;
const prisma_1 = require("../config/prisma");
async function getAllProducts(_req, res) {
    try {
        const products = await prisma_1.prisma.product.findMany({
            orderBy: { createdAt: "asc" }
        });
        return res.status(200).json(products);
    }
    catch (error) {
        return res.status(500).json({ error: "Failed to fetch products." });
    }
}
async function getProductById(req, res) {
    try {
        const { id } = req.params;
        const product = await prisma_1.prisma.product.findUnique({ where: { id } });
        if (!product) {
            return res.status(404).json({ error: "Product not found." });
        }
        return res.status(200).json(product);
    }
    catch (error) {
        return res.status(500).json({ error: "Failed to fetch product." });
    }
}
