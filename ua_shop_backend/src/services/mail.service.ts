import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host:   process.env.MAIL_HOST,
  port:   Number(process.env.MAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

export async function sendVerificationEmail(canonicalEmail: string) {
  await transporter.sendMail({
    from:    '"UA-Shop" <noreply@ua-shop.local>',
    to:      canonicalEmail,
    subject: "Welcome to UA-Shop — Identity Verified",
    text:    "Your multilingual identity has been verified. You can now browse and shop on UA-Shop.",
    headers: { "X-UA-Compatible": "SMTPUTF8" }
  });
}

export async function sendOrderConfirmationEmail(
  canonicalEmail: string,
  orderId: string,
  totalAmount: number
) {
  await transporter.sendMail({
    from:    '"UA-Shop" <noreply@ua-shop.local>',
    to:      canonicalEmail,
    subject: `UA-Shop — Order Confirmed #${orderId.slice(0, 8).toUpperCase()}`,
    text:    `Thank you for your order! Order ID: ${orderId.slice(0, 8).toUpperCase()}. Total: $${totalAmount.toFixed(2)}.`,
    headers: { "X-UA-Compatible": "SMTPUTF8" }
  });
}
