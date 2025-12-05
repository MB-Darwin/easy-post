/**
 * oRPC API Route Handler for Next.js
 */

import { onFetch } from "@orpc/next";
import { appRouter } from "@/server/router";

export const { GET, POST, PUT, DELETE, PATCH } = onFetch({
  router: appRouter,
  prefix: "/api/rpc",
});
