/**
 * Auth Store
 * Zustand store for authentication state with persistence
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  OAuthTokenResponse,
  AuthenticatedUser,
} from "@/shared/types/oauth.types";

interface AuthState {
  // State
  user: AuthenticatedUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
  isAuthenticated: boolean;

  // Actions
  setAuth: (tokenResponse: OAuthTokenResponse, companyId?: string) => void;
  clearAuth: () => void;
  updateToken: (accessToken: string, expiresIn: number) => void;
  isTokenExpired: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial State
      user: null,
      accessToken: null,
      refreshToken: null,
      expiresAt: null,
      isAuthenticated: false,

      // Set authentication from OAuth response
      setAuth: (tokenResponse, companyId) => {
        const expiresAt = Date.now() + tokenResponse.expires_in * 1000;

        set({
          accessToken: tokenResponse.access_token,
          refreshToken: tokenResponse.refresh_token ?? null,
          expiresAt,
          isAuthenticated: true,
          user: {
            id: "", // Will be populated from user info endpoint
            company_id: companyId ?? "",
            access_token: tokenResponse.access_token,
            expires_at: expiresAt,
          },
        });
      },

      // Clear all authentication state
      clearAuth: () => {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          expiresAt: null,
          isAuthenticated: false,
        });
      },

      // Update access token (e.g., after refresh)
      updateToken: (accessToken, expiresIn) => {
        const expiresAt = Date.now() + expiresIn * 1000;

        set((state) => ({
          accessToken,
          expiresAt,
          user: state.user
            ? {
                ...state.user,
                access_token: accessToken,
                expires_at: expiresAt,
              }
            : null,
        }));
      },

      // Check if token is expired
      isTokenExpired: () => {
        const { expiresAt } = get();
        if (!expiresAt) return true;
        return Date.now() >= expiresAt;
      },
    }),
    {
      name: "auth-storage", // localStorage key
      storage: createJSONStorage(() => localStorage),
      // Only persist these fields
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        expiresAt: state.expiresAt,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
