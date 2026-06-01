export interface UaveValidationRequest {
  usernameUnicode: string;
  rawEmail: string;
}

export interface ScriptAnalysisResult {
  primaryScript: string;
  detectedScripts: string[];
  isConsistent: boolean;
  hasMixedScripts: boolean;
  possibleHomographAttack: boolean;
}

export interface UaveValidationResponse {
  isValid: boolean;
  message?: string;
  user?: {
    id: string;
    usernameUnicode: string;
    emailUnicode: string;
    canonicalEmail: string;
    aceDomain: string;
    createdAt: string;
  };
  uaveMetrics?: {
    latencyMs: number;
    scriptAnalysis: ScriptAnalysisResult;
  };
  error?: string;
}
