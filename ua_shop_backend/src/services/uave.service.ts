import { UniversalAcceptanceEngine } from "../utils/uaEngine";
import { HomographSecurityScanner }  from "../security/securityScanner";
import { validateEmail }             from "../validators/email.validator";
import { ScriptAnalysisResult }      from "../types/uave";

interface ProcessingExecutionResult {
  isValid: boolean;
  localPart: string;
  domainPart: string;
  normalizedUnicode: string;
  canonicalEmail: string;
  aceDomain: string;
  scriptAnalysis: ScriptAnalysisResult;
}

// Timeout wrapper — kills any step that takes longer than 8 seconds
function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`UAVE timeout: ${label} took longer than ${ms}ms`)), ms)
    )
  ]);
}

export async function executeUaveProcessingPipeline(
  rawEmail: string
): Promise<ProcessingExecutionResult> {

  // Stage 1: Normalise and split
  const parsed = UniversalAcceptanceEngine.normalizeAndParse(rawEmail);

  // Stage 2: Convert domain to ACE — wrapped in timeout to prevent hangs
  const aceDomain = await withTimeout(
    Promise.resolve(UniversalAcceptanceEngine.convertToAce(parsed.domainPart)),
    8000,
    "Punycode conversion"
  );

  // Stage 3: Build canonical email
  const canonicalEmail = `${parsed.localPart}@${aceDomain}`;

  // Stage 4: Validate format — wrapped in timeout
  const isValidFormat = await withTimeout(
    Promise.resolve(validateEmail(canonicalEmail)),
    5000,
    "EAI format validation"
  );

  if (!isValidFormat) {
    throw new Error("Invalid EAI format: canonical email failed structure check");
  }

  // Stage 5: Security scan — wrapped in timeout
  const scriptAnalysis = await withTimeout(
    Promise.resolve(
      HomographSecurityScanner.analyzeScriptConsistency(parsed.fullNormalized)
    ),
    5000,
    "Script consistency check"
  );

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
