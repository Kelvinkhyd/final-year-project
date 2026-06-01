import punycode from "punycode";

export class UniversalAcceptanceEngine {

  public static normalizeAndParse(rawEmail: string): {
    localPart: string;
    domainPart: string;
    fullNormalized: string;
  } {
    if (!rawEmail || !rawEmail.includes("@")) {
      throw new Error("Malformed email: missing @ symbol");
    }

    const normalizedString = rawEmail.trim().normalize("NFC");
    const lastAtIndex = normalizedString.lastIndexOf("@");
    const localPart  = normalizedString.substring(0, lastAtIndex);
    const domainPart = normalizedString.substring(lastAtIndex + 1);

    if (!localPart.trim() || !domainPart.trim()) {
      throw new Error("Malformed email: empty local or domain segment");
    }

    if (domainPart.includes("..")) {
      throw new Error("Malformed domain: consecutive dots detected");
    }

    return { localPart, domainPart, fullNormalized: normalizedString };
  }

  public static convertToAce(domain: string): string {
    try {
      // Normalise Unicode full-stop variants before conversion
      const normalizedDomain = domain
        .toLowerCase()
        .trim()
        .replace(/[\u3002\uff0e\uff61]/g, ".")
        // Remove any zero-width characters that can cause hangs
        .replace(/[\u200B\u200C\u200D\uFEFF]/g, "");

      // Only run Punycode if domain contains non-ASCII
      if (/[^\x00-\x7F]/.test(normalizedDomain)) {
        // Process label by label to avoid full-domain Punycode hang
        const labels = normalizedDomain.split(".");
        const converted = labels.map(label => {
          if (!label) return label;
          if (/[^\x00-\x7F]/.test(label)) {
            try {
              return punycode.toASCII(label);
            } catch {
              throw new Error(`Invalid domain label: ${label}`);
            }
          }
          return label;
        });
        return converted.join(".");
      }

      return normalizedDomain;
    } catch (err: unknown) {
      const e = err as { message?: string };
      throw new Error(`Domain conversion failed: ${e.message ?? "unknown error"}`);
    }
  }
}
