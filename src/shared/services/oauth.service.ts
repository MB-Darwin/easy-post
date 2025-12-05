/**
 * OAuth Service
 * Handles OAuth authentication flow with Genuka API using curl
 * Based on official Genuka boilerplate patterns
 */

import { serverEnv } from "@/shared/env/server-env";
import type { OAuthTokenResponse } from "@/shared/types/oauth.types";
import { verifyHmac } from "@/shared/lib/hmac";

interface CompanyInfo {
  id: string;
  name: string;
  handle?: string;
  description?: string;
  logoUrl?: string;
  metadata?: Record<string, unknown>;
}

export class OAuthService {
  /**
   * Exchange authorization code for access token
   * Uses application/x-www-form-urlencoded as per OAuth 2.0 spec
   * @param code - Authorization code from OAuth callback
   * @returns OAuth token response with access_token
   */
  async getToken(code: string): Promise<OAuthTokenResponse> {
    try {
      console.log("Exchanging token with code:", code);
      console.log("API URL:", serverEnv.GENUKA_API_URL);

      // WORKAROUND: Use curl via child_process since fetch times out
      const { exec } = await import("child_process");
      const { promisify } = await import("util");
      const execPromise = promisify(exec);

      const curlCommand = [
        "curl",
        "-X POST",
        `"${serverEnv.GENUKA_API_URL}/oauth/token"`,
        '-H "Content-Type: application/x-www-form-urlencoded"',
        '-H "Accept: application/json"',
        "--data-urlencode",
        `"grant_type=authorization_code"`,
        "--data-urlencode",
        `"code=${code}"`,
        "--data-urlencode",
        `"client_id=${serverEnv.GENUKA_CLIENT_ID}"`,
        "--data-urlencode",
        `"client_secret=${serverEnv.GENUKA_CLIENT_SECRET}"`,
        "--data-urlencode",
        `"redirect_uri=${serverEnv.GENUKA_REDIRECT_URI}"`,
        "--max-time 30",
        "-s", // silent
      ].join(" ");

      console.log("Executing curl command...");

      const { stdout, stderr } = await execPromise(curlCommand);

      if (stderr) {
        console.error("Curl stderr:", stderr);
      }

      if (!stdout || stdout.trim() === "") {
        throw new Error("Empty response from Genuka API");
      }

      const data = JSON.parse(stdout) as OAuthTokenResponse;

      // Check if it's an error response
      if ("error" in data) {
        console.error("Token Exchange Failed:");
        console.error("- Error Data:", data);
        throw new Error(
          (data as any).error_description ||
            (data as any).error ||
            "Token exchange failed"
        );
      }

      console.log("✅ Token Response SUCCESS::", data);
      return data;
    } catch (error) {
      if (error instanceof Error) {
        console.error("❌ Token exchange error:", error.message);
        console.error("Error details:", error);
        throw error;
      }

      console.error("❌ Unknown token exchange error:", error);
      throw new Error("Failed to exchange token");
    }
  }

  /**
   * Refresh access token using refresh token
   * @param refreshToken - Refresh token from previous authentication
   * @returns New OAuth token response
   */
  async refreshToken(refreshToken: string): Promise<OAuthTokenResponse> {
    try {
      const { exec } = await import("child_process");
      const { promisify } = await import("util");
      const execPromise = promisify(exec);

      const curlCommand = [
        "curl",
        "-X POST",
        `"${serverEnv.GENUKA_API_URL}/oauth/refresh"`,
        '-H "Content-Type: application/json"',
        '-H "Accept: application/json"',
        `-d '{"refresh_token":"${refreshToken}","client_id":"${serverEnv.GENUKA_CLIENT_ID}","client_secret":"${serverEnv.GENUKA_CLIENT_SECRET}"}'`,
        "--max-time 30",
        "-s",
      ].join(" ");

      const { stdout, stderr } = await execPromise(curlCommand);

      if (stderr) {
        console.error("Refresh token curl stderr:", stderr);
      }

      if (!stdout || stdout.trim() === "") {
        throw new Error("Empty response from refresh token endpoint");
      }

      const data = JSON.parse(stdout) as OAuthTokenResponse;

      if ("error" in data) {
        throw new Error(
          (data as { error_description?: string; error?: string })
            .error_description ||
            (data as { error?: string }).error ||
            "Token refresh failed"
        );
      }

      return data;
    } catch (error) {
      console.error("Token refresh error:", error);
      throw new Error(
        error instanceof Error ? error.message : "Failed to refresh token"
      );
    }
  }

  /**
   * Validate OAuth callback parameters
   * @param params - Callback parameters to validate
   * @returns True if all required parameters are present
   */
  validateCallbackParams(params: {
    code?: string | null;
    companyId?: string | null;
    timestamp?: string | null;
    hmac?: string | null;
  }): boolean {
    return !!(
      params.code &&
      params.companyId &&
      params.timestamp &&
      params.hmac
    );
  }

  /**
   * Validate HMAC signature and timestamp from OAuth callback
   * @param queryString - Full query string from the callback
   * @param hmac - HMAC signature to validate
   * @param timestamp - Timestamp from callback
   * @returns True if valid
   */
  async validateCallback(params: {
    queryString: string;
    hmac: string;
    timestamp: string;
  }): Promise<{ valid: boolean; error?: string }> {
    // Verify HMAC signature
    const isValidHmac = await verifyHmac(params.queryString, params.hmac);

    if (!isValidHmac) {
      return { valid: false, error: "Invalid HMAC signature" };
    }

    // Check timestamp age (5 minute window)
    const timestampAge = Date.now() - parseInt(params.timestamp) * 1000;
    if (timestampAge > 5 * 60 * 1000) {
      return { valid: false, error: "Request expired" };
    }

    return { valid: true };
  }

  /**
   * Get company information from Genuka API
   * @param companyId - Company ID
   * @param accessToken - Access token for authentication
   * @returns Company information
   */
  async getCompanyInfo(
    companyId: string,
    accessToken: string
  ): Promise<CompanyInfo> {
    try {
      const { exec } = await import("child_process");
      const { promisify } = await import("util");
      const execPromise = promisify(exec);

      const curlCommand = [
        "curl",
        `"${serverEnv.GENUKA_API_URL}/companies/${companyId}"`,
        '-H "Authorization: Bearer ' + accessToken + '"',
        '-H "Content-Type: application/json"',
        '-H "Accept: application/json"',
        "--max-time 15",
        "-s",
      ].join(" ");

      const { stdout, stderr } = await execPromise(curlCommand);

      if (stderr) {
        console.error("Company info curl stderr:", stderr);
      }

      if (!stdout || stdout.trim() === "") {
        throw new Error("Empty response from company info endpoint");
      }

      const data = JSON.parse(stdout) as CompanyInfo;
      return data;
    } catch (error) {
      console.error("Get company info error:", error);
      throw error;
    }
  }
}

/**
 * Singleton OAuth service instance
 */
export const oauthService = new OAuthService();
