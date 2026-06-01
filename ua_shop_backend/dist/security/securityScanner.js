"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomographSecurityScanner = void 0;
const unicodeRanges_1 = require("../constants/unicodeRanges");
class HomographSecurityScanner {
    static analyzeScriptConsistency(text) {
        const scripts = new Set();
        const cleanedText = text.replace(/[\s@.]/g, "");
        for (const char of cleanedText) {
            const codePoint = char.codePointAt(0);
            if (!codePoint)
                continue;
            let matched = false;
            for (const [scriptName, [start, end]] of Object.entries(unicodeRanges_1.UNICODE_RANGES)) {
                if (codePoint >= start && codePoint <= end) {
                    scripts.add(scriptName);
                    matched = true;
                    break;
                }
            }
            if (!matched)
                scripts.add("Common");
        }
        const detectedScripts = Array.from(scripts);
        const primaryScripts = detectedScripts.filter(s => s !== "Common");
        const primaryScript = primaryScripts.length > 0 ? primaryScripts[0] : "Common";
        const hasMixedScripts = primaryScripts.length > 1;
        return {
            primaryScript,
            detectedScripts,
            isConsistent: !hasMixedScripts,
            hasMixedScripts,
            possibleHomographAttack: hasMixedScripts && primaryScripts.includes("Latin")
        };
    }
}
exports.HomographSecurityScanner = HomographSecurityScanner;
