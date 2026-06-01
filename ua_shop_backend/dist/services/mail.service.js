"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendVerificationEmail = sendVerificationEmail;
exports.sendOrderConfirmationEmail = sendOrderConfirmationEmail;
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT) || 587,
    secure: false,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});
async function sendVerificationEmail(canonicalEmail) {
    await transporter.sendMail({
        from: '"UA-Shop" <noreply@ua-shop.local>',
        to: canonicalEmail,
        subject: "Welcome to UA-Shop — Identity Verified",
        text: "Your multilingual identity has been verified. You can now browse and shop on UA-Shop.",
        headers: { "X-UA-Compatible": "SMTPUTF8" }
    });
}
async function sendOrderConfirmationEmail(canonicalEmail, orderId, totalAmount) {
    await transporter.sendMail({
        from: '"UA-Shop" <noreply@ua-shop.local>',
        to: canonicalEmail,
        subject: `UA-Shop — Order Confirmed #${orderId.slice(0, 8).toUpperCase()}`,
        text: `Thank you for your order! Order ID: ${orderId.slice(0, 8).toUpperCase()}. Total: $${totalAmount.toFixed(2)}.`,
        headers: { "X-UA-Compatible": "SMTPUTF8" }
    });
}
