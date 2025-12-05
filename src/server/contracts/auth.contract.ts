/**
 * Auth Contract
 * oRPC contract definitions for authentication procedures
 */

import { oc } from "@orpc/contract";
import { z } from "zod";

/**
 * Input Schemas
 */
const OAuthTokenRequestSchema = z.object({
  code: z.string().min(1, "Authorization code is required"),
});

const OAuthCallbackParamsSchema = z.object({
  code: z.string().min(1),
  company_id: z.string().min(1),
  timestamp: z.string().min(1),
  hmac: z.string().min(1),
  redirect_to: z.string().optional(),
});

const RefreshTokenRequestSchema = z.object({
  refresh_token: z.string().min(1, "Refresh token is required"),
});

/**
 * Output Schemas
 */
const OAuthTokenResponseSchema = z.object({
  access_token: z.string(),
  token_type: z.string(),
  expires_in: z.number(),
  refresh_token: z.string().optional(),
  scope: z.string().optional(),
});

const ValidateCallbackResponseSchema = z.object({
  success: z.boolean(),
  token: OAuthTokenResponseSchema,
  redirect_to: z.string(),
});

/**
 * Auth Contract
 * Defines the interface for auth procedures
 */
export const authContract = oc.router({
  /**
   * Exchange authorization code for access token
   */
  exchangeToken: oc
    .input(OAuthTokenRequestSchema)
    .output(OAuthTokenResponseSchema),

  /**
   * Refresh access token
   */
  refreshToken: oc
    .input(RefreshTokenRequestSchema)
    .output(OAuthTokenResponseSchema),

  /**
   * Validate OAuth callback and exchange token
   */
  validateCallback: oc
    .input(OAuthCallbackParamsSchema)
    .output(ValidateCallbackResponseSchema),
});
