/**
 * oRPC Clients
 * Client-side oRPC client for making RPC calls to the server
 */

"use client";

import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";

/**
 * Client-side oRPC client
 * Use this for browser-to-server procedure calls
 */
export const clientOrpcClient = createORPCClient(
  new RPCLink({
    url: "/api/rpc",
  })
);
