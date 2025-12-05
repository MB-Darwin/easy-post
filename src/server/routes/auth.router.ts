/**
 * Auth Router - oRPC procedures for authentication
 */

import { os } from "@orpc/server";
import { z } from "zod";
import { oauthService } from "@/shared/services/auth/oauth.service";

/**
 * Zod Schemas (from contract)
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
 * Auth Router
 * Implements authentication procedures with business logic
 */
export const authRouter = os.router({
  /**
   * Exchange authorization code for access token
   */
  exchangeToken: os
    .input(OAuthTokenRequestSchema)
    .handler(async ({ input }) => {
      const tokenResponse = await oauthService.getToken(input.code);
      return tokenResponse;
    }),

  /**
   * Refresh access token
   */
  refreshToken: os
    .input(RefreshTokenRequestSchema)
    .handler(async ({ input }) => {
      const tokenResponse = await oauthService.refreshToken(
        input.refresh_token
      );
      return tokenResponse;
    }),

  /**
   * Validate OAuth callback parameters
   */
  validateCallback: os
    .input(OAuthCallbackParamsSchema)
    .handler(async ({ input }) => {
      // Build query string from input (excluding hmac for validation)
      const queryParams = new URLSearchParams({
        code: input.code,
        company_id: input.company_id,
        timestamp: input.timestamp,
        hmac: input.hmac,
        ...(input.redirect_to && { redirect_to: input.redirect_to }),
      });

      const queryString = queryParams.toString();

      // Validate HMAC signature and timestamp
      const validation = await oauthService.validateCallback({
        queryString,
        hmac: input.hmac,
        timestamp: input.timestamp,
      });

      if (!validation.valid) {
        throw new Error(validation.error || "Invalid callback");
      }

      // Exchange code for token
      const tokenResponse = await oauthService.getToken(input.code);

      return {
        success: true,
        token: tokenResponse,
        redirect_to: input.redirect_to ?? "/dashboard",
      };
    }),
});

/**
 * Export router type for client
 */
export type AuthRouter = typeof authRouter;
