/**
 * Auth Hook
 * Convenience hook for accessing auth state
 */

"use client";

// import { useRefreshToken } from "@/features/auth/api/auth.mutations";
import { useEffect } from "react";
import { useAuthStore } from "../store";

/**
 * Hook to get current auth state and automatically refresh tokens
 */
export function useAuth() {
  const auth = useAuthStore();
  // const refreshTokenMutation = useRefreshToken();

  // Auto-refresh token if expired
  useEffect(() => {
    if (auth.isAuthenticated && auth.isTokenExpired() && auth.refreshToken) {
      console.log("Token expired, but auto-refresh is temporarily disabled.");
      // refreshTokenMutation.mutate(auth.refreshToken);
    }
  }, [auth]);

  // Listen for unauthorized events from API client
  useEffect(() => {
    const handleUnauthorized = () => {
      auth.clearAuth();
    };

    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () => {
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
    };
  }, [auth]);

  return {
    user: auth.user,
    accessToken: auth.accessToken,
    isAuthenticated: auth.isAuthenticated,
    isTokenExpired: auth.isTokenExpired(),
    logout: auth.clearAuth,
  };
}
