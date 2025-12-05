/**
 * Client-side Auth Sync
 * Syncs httpOnly cookies to Zustand store on client-side
 */

"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/entities/auth/store/use-auth.store";

/**
 * API endpoint to check auth status and get token info
 */
async function fetchAuthStatus() {
  try {
    const response = await fetch("/api/auth/status");
    if (response.ok) {
      return await response.json();
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Component to sync server-side auth cookies with client-side Zustand store
 * Place this in your root layout
 */
export function AuthSync() {
  const setAuth = useAuthStore((state) => state.setAuth);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  useEffect(() => {
    // Check auth status on mount
    fetchAuthStatus().then((authData) => {
      if (authData?.access_token) {
        setAuth(authData, authData.company_id);
      } else {
        clearAuth();
      }
    });
  }, [setAuth, clearAuth]);

  return null; // This component doesn't render anything
}
