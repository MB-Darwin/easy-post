/**
 * oRPC Router
 * Centralized RPC router for the application


import { os } from "@orpc/server";
import { authRouter } from "./routes/auth.router";

/**
 * Root oRPC router
 * Combines all feature routers

export const appRouter = os.router({
  auth: authRouter,
});


 * Export router type for client inference

export type AppRouter = typeof appRouter;   
*/