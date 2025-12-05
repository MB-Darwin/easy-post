/**
 * HMAC Verification Utility
 * Validates HMAC signatures from Genuka OAuth callbacks
 */

import crypto from "crypto";
import { serverEnv } from "@/shared/env/server-env";

/**
 * Verify HMAC signature from Genuka OAuth callback
 * The HMAC is calculated over all query parameters EXCEPT the hmac parameter itself
 * IMPORTANT: Must preserve exact URL encoding (don't decode/re-encode)
 * @param queryString - The RAW query string from the request (exactly as received)
 * @param hmacToVerify - HMAC signature to validate
 * @returns True if signature is valid
 */
export async function verifyHmac(
  queryString: string,
  hmacToVerify: string
): Promise<boolean> {
  try {
    // Manually parse query string WITHOUT decoding to preserve exact encoding
    const params: Array<[string, string]> = [];
    const pairs = queryString.split("&");

    for (const pair of pairs) {
      const eqIndex = pair.indexOf("=");
      if (eqIndex > 0) {
        const key = pair.substring(0, eqIndex);
        const value = pair.substring(eqIndex + 1);

        // Skip the hmac parameter itself
        if (key !== "hmac") {
          params.push([key, value]);
        }
      }
    }

    // Sort alphabetically by key
    params.sort(([a], [b]) => a.localeCompare(b));

    // Build the string with exact encoding preserved
    const sortedParams = params
      .map(([key, value]) => `${key}=${value}`)
      .join("&");

    console.log("HMAC Debug:");
    console.log("- Original query:", queryString);
    console.log("- Sorted params (without hmac):", sortedParams);
    console.log(
      "- Client secret (first 10 chars):",
      serverEnv.GENUKA_CLIENT_SECRET.substring(0, 10) + "..."
    );
    console.log("- Received HMAC:", hmacToVerify);

    // Calculate HMAC using client secret
    const calculatedHmac = crypto
      .createHmac("sha256", serverEnv.GENUKA_CLIENT_SECRET)
      .update(sortedParams)
      .digest("hex");

    console.log("- Calculated HMAC:", calculatedHmac);
    console.log("- Match:", calculatedHmac === hmacToVerify);

    // Constant-time comparison to prevent timing attacks
    return crypto.timingSafeEqual(
      Buffer.from(calculatedHmac, "hex"),
      Buffer.from(hmacToVerify, "hex")
    );
  } catch (error) {
    console.error("HMAC verification error:", error);
    return false;
  }
}
