"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrder = createOrder;
exports.getUserOrders = getUserOrders;
const prisma_1 = require("../config/prisma");
const mail_service_1 = require("../services/mail.service");
async function createOrder(req, res) {
    try {
        const { userId, items } = req.body;
        if (!userId || !items || items.length === 0) {
            return res.status(400).json({ error: "userId and items are required." });
        }
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: userId }
        });
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }
        const productIds = items.map((i) => i.productId);
        const products = await prisma_1.prisma.product.findMany({
            where: {
                id: {
                    in: productIds
                }
            }
        });
        if (products.length !== items.length) {
            return res.status(404).json({
                error: "One or more products not found."
            });
        }
        let totalAmount = 0;
        const orderItemsData = items.map((item) => {
            const product = products.find((p) => p.id === item.productId);
            totalAmount += product.price * item.quantity;
            return {
                id: crypto.randomUUID(),
                productId: item.productId,
                quantity: item.quantity,
                price: product.price
            };
        });
        const orderId = crypto.randomUUID();
        const order = await prisma_1.prisma.$transaction(async (tx) => {
            const newOrder = await tx.order.create({
                data: {
                    id: orderId,
                    userId,
                    totalAmount,
                    status: "confirmed"
                }
            });
            await tx.orderItem.createMany({
                data: orderItemsData.map((item) => ({
                    id: item.id,
                    orderId: newOrder.id,
                    productId: item.productId,
                    quantity: item.quantity,
                    price: item.price
                }))
            });
            return newOrder;
        });
        const fullOrder = await prisma_1.prisma.order.findUnique({
            where: { id: order.id },
            include: {
                items: {
                    include: {
                        product: true
                    }
                },
                user: true
            }
        });
        try {
            await (0, mail_service_1.sendOrderConfirmationEmail)(user.canonicalEmail, order.id, totalAmount);
        }
        catch (e) {
            console.error("[MAIL] Order email failed:", e);
        }
        return res.status(201).json({
            success: true,
            message: "Order placed successfully.",
            order: {
                id: fullOrder.id,
                status: fullOrder.status,
                totalAmount: fullOrder.totalAmount,
                createdAt: fullOrder.createdAt.toISOString(),
                items: fullOrder.items.map((i) => ({
                    productName: i.product.name,
                    quantity: i.quantity,
                    price: i.price
                }))
            }
        });
    }
    catch (error) {
        console.error("[ORDER] Error:", error);
        const err = error;
        return res.status(500).json({
            error: err.message ?? "Failed to create order."
        });
    }
}
async function getUserOrders(req, res) {
    try {
        const { userId } = req.params;
        const orders = await prisma_1.prisma.order.findMany({
            where: { userId },
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        });
        return res.status(200).json(orders);
    }
    catch (error) {
        console.error("[ORDERS] Fetch error:", error);
        return res.status(500).json({
            error: "Failed to fetch orders."
        });
    }
}
