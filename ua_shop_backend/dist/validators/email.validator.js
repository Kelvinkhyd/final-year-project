"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEmail = validateEmail;
const validator_1 = __importDefault(require("validator"));
function validateEmail(email) {
    // For EAI emails with non-ASCII local parts, only validate the domain portion
    // The validator library sometimes struggles with Arabic/CJK local parts
    const lastAt = email.lastIndexOf("@");
    if (lastAt === -1)
        return false;
    const localPart = email.substring(0, lastAt);
    const domainPart = email.substring(lastAt + 1);
    // Local part must not be empty
    if (!localPart.trim())
        return false;
    // Domain part must be a valid ASCII domain after Punycode conversion
    // Use validator only on the domain portion
    const testEmail = `test@${domainPart}`;
    try {
        return validator_1.default.isEmail(testEmail, {
            allow_utf8_local_part: false,
            require_tld: true
        });
    }
    catch {
        return false;
    }
}
