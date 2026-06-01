"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeUaveProcessingPipeline = executeUaveProcessingPipeline;
const uaEngine_1 = require("../utils/uaEngine");
const securityScanner_1 = require("../security/securityScanner");
const email_validator_1 = require("../validators/email.validator");
// Timeout wrapper — kills any step that takes longer than 8 seconds
function withTimeout(promise, ms, label) {
    return Promise.race([
        promise,
        new Promise((_, reject) => setTimeout(() => reject(new Error(`UAVE timeout: ${label} took longer than ${ms}ms`)), ms))
    ]);
}
async function executeUaveProcessingPipeline(rawEmail) {
    // Stage 1: Normalise and split
    const parsed = uaEngine_1.UniversalAcceptanceEngine.normalizeAndParse(rawEmail);
    // Stage 2: Convert domain to ACE — wrapped in timeout to prevent hangs
    const aceDomain = await withTimeout(Promise.resolve(uaEngine_1.UniversalAcceptanceEngine.convertToAce(parsed.domainPart)), 8000, "Punycode conversion");
    // Stage 3: Build canonical email
    const canonicalEmail = `${parsed.localPart}@${aceDomain}`;
    // Stage 4: Validate format — wrapped in timeout
    const isValidFormat = await withTimeout(Promise.resolve((0, email_validator_1.validateEmail)(canonicalEmail)), 5000, "EAI format validation");
    if (!isValidFormat) {
        throw new Error("Invalid EAI format: canonical email failed structure check");
    }
    // Stage 5: Security scan — wrapped in timeout
    const scriptAnalysis = await withTimeout(Promise.resolve(securityScanner_1.HomographSecurityScanner.analyzeScriptConsistency(parsed.fullNormalized)), 5000, "Script consistency check");
    if (scriptAnalysis.possibleHomographAttack) {
        throw new Error("Security: potential homograph spoofing detected. Pipeline halted.");
    }
    return {
        isValid: true,
        localPart: parsed.localPart,
        domainPart: parsed.domainPart,
        normalizedUnicode: parsed.fullNormalized,
        canonicalEmail,
        aceDomain,
        scriptAnalysis
    };
}
