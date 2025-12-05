/**
 * Auth Mutations
 * React Query mutations for authentication using oRPC with Zustand store integration
 */

"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { orpc } from "@/shared/lib/orpc";
import { useAuthStore } from "@/entities/auth/store/use-auth.store";
import type { OAuthCallbackParams } from "@/shared/types/oauth.types";

/**
 * Hook to exchange OAuth authorization code for tokens
 */
export function useExchangeToken() {
  const queryClient = useQueryClient();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: async (code: string) => {
      // @ts-expect-error - oRPC contract types need runtime verification
      return await orpc.auth.exchangeToken({ code });
    },
    onSuccess: (data) => {
      // Store auth data in Zustand
      setAuth(data);
      // Invalidate auth queries
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });
}

/**
 * Hook to validate OAuth callback and exchange token
 */
export function useValidateOAuthCallback() {
  const queryClient = useQueryClient();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: async (params: OAuthCallbackParams) => {
      // @ts-expect-error - oRPC contract types need runtime verification
      return await orpc.auth.validateCallback(params);
    },
    onSuccess: (data) => {
      // Store auth data in Zustand
      setAuth(data.token, data.token.scope);
      // Invalidate auth queries
      queryClient.invalidateQueries({ queryKey: ["auth"] });

      // Redirect to the specified location or dashboard
      if (data.redirect_to) {
        window.location.href = data.redirect_to;
      }
    },
  });
}

/**
 * Hook to refresh access token
 */
export function useRefreshToken() {
  const queryClient = useQueryClient();
  const updateToken = useAuthStore((state) => state.updateToken);

  return useMutation({
    mutationFn: async (refreshToken: string) => {
      // @ts-expect-error - oRPC contract types need runtime verification
      return await orpc.auth.refreshToken({ refresh_token: refreshToken });
    },
    onSuccess: (data) => {
      // Update token in Zustand
      updateToken(data.access_token, data.expires_in);
      // Invalidate auth queries
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });
}

/**
 * Hook to logout
 */
export function useLogout() {
  const queryClient = useQueryClient();
  const clearAuth = useAuthStore((state) => state.clearAuth);

  return useMutation({
    mutationFn: async () => {
      // Clear auth state
      clearAuth();
      // Clear all queries
      queryClient.clear();
    },
  });
}
