import { ScriptAnalysisResult } from "../types/uave";
import { UNICODE_RANGES } from "../constants/unicodeRanges";

export class HomographSecurityScanner {

  public static analyzeScriptConsistency(text: string): ScriptAnalysisResult {
    const scripts = new Set<string>();
    const cleanedText = text.replace(/[\s@.]/g, "");

    for (const char of cleanedText) {
      const codePoint = char.codePointAt(0);
      if (!codePoint) continue;

      let matched = false;
      for (const [scriptName, [start, end]] of Object.entries(UNICODE_RANGES)) {
        if (codePoint >= start && codePoint <= end) {
          scripts.add(scriptName);
          matched = true;
          break;
        }
      }

      if (!matched) scripts.add("Common");
    }

    const detectedScripts = Array.from(scripts);
    const primaryScripts  = detectedScripts.filter(s => s !== "Common");
    const primaryScript   = primaryScripts.length > 0 ? primaryScripts[0] : "Common";
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
