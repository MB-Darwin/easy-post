/**
 * Example OAuth Usage
 * This file demonstrates how to use the oRPC procedures for OAuth authentication
 */

import { orpc } from "@/shared/lib/orpc";

// Example 1: Exchange authorization code for token
async function exchangeToken(code: string) {
  try {
    const result = await orpc({ code });
    console.log("Token received:", result);
    return result;
  } catch (error) {
    console.error("Token exchange failed:", error);
    throw error;
  }
}

// Example 2: Validate OAuth callback
async function validateCallback(params: {
  code: string;
  company_id: string;
  timestamp: string;
  hmac: string;
  redirect_to?: string;
}) {
  try {
    const result = await orpc(params);
    console.log("Callback validated:", result);
    return result;
  } catch (error) {
    console.error("Callback validation failed:", error);
    throw error;
  }
}

// Example 3: Refresh token
async function refreshToken(refreshToken: string) {
  try {
    const result = await orpc({ refresh_token: refreshToken });
    console.log("Token refreshed:", result);
    return result;
  } catch (error) {
    console.error("Token refresh failed:", error);
    throw error;
  }
}

export { exchangeToken, validateCallback, refreshToken };
