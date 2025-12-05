/**
 * Genuka API Axios Client
 * Pre-configured Axios instance with Genuka credentials and Bearer token
 */

import axios, { type AxiosInstance, type AxiosError } from "axios";
import { serverEnv } from "@/shared/env/server-env";

/**
 * Get access token from auth store (client-side) or cookies (server-side)
 */
async function getAccessToken(): Promise<string | null> {
  // Server-side: read from cookies
  if (typeof window === "undefined") {
    try {
      const { cookies } = await import("next/headers");
      const cookieStore = await cookies();
      return cookieStore.get("auth_token")?.value ?? null;
    } catch {
      return null;
    }
  }

  // Client-side: read from localStorage (Zustand persist)
  try {
    const authStorage = localStorage.getItem("auth-storage");
    if (!authStorage) return null;

    const { state } = JSON.parse(authStorage);
    return state?.accessToken ?? null;
  } catch {
    return null;
  }
}

/**
 * Create Genuka API Axios instance
 * This client is configured with Genuka API credentials and base URL
 */
export const createGenukaClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: serverEnv.GENUKA_API_URL,
    timeout: 30000,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  // Request interceptor - Add client credentials and Bearer token
  client.interceptors.request.use(
    async (config) => {
      // Add client credentials to request
      // Some APIs expect these in headers, others in body - adjust as needed
      config.headers["X-Client-ID"] = serverEnv.GENUKA_CLIENT_ID;
      config.headers["X-Client-Secret"] = serverEnv.GENUKA_CLIENT_SECRET;

      // Add Bearer token if available (for authenticated requests)
      const accessToken = await getAccessToken();
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor - Handle errors and token refresh
  client.interceptors.response.use(
    (response) => {
      return response;
    },
    (error: AxiosError) => {
      // Enhanced error handling
      if (error.response) {
        // Server responded with error status
        const status = error.response.status;
        const data = error.response.data;

        // Handle 401 Unauthorized - token expired
        if (status === 401) {
          // Clear auth state on unauthorized
          if (typeof window !== "undefined") {
            const event = new CustomEvent("auth:unauthorized");
            window.dispatchEvent(event);
          }
        }

        console.error(`Genuka API Error [${status}]:`, data);
      } else if (error.request) {
        // Request made but no response received
        console.error("Genuka API - No response received:", error.message);
      } else {
        // Error in request setup
        console.error("Genuka API - Request setup error:", error.message);
      }

      return Promise.reject(error);
    }
  );

  return client;
};

/**
 * Singleton Genuka API client instance
 */
export const genukaClient = createGenukaClient();
