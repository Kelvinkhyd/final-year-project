"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserInTransaction = createUserInTransaction;
async function createUserInTransaction(payload, tx) {
    return tx.user.create({
        data: {
            usernameUnicode: payload.usernameUnicode,
            emailUnicode: payload.emailUnicode,
            canonicalEmail: payload.canonicalEmail,
            aceDomain: payload.aceDomain
        }
    });
}
