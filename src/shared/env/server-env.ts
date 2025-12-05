import { createEnv } from "@t3-oss/env-nextjs";
import * as z from "zod";

export const serverEnv = createEnv({
  server: {
    DATABASE_URL: z.url(),
    GENUKA_API_URL: z.url(),
    GENUKA_CLIENT_SECRET: z.string().min(1),
    GENUKA_CLIENT_ID: z.string().min(1),
    GENUKA_REDIRECT_URI: z.string().min(1),
  },
  shared: {
    NODE_ENV: z.enum(["test", "development", "production"]).optional(),
  },
  // You need to destructure all the keys manually
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    GENUKA_API_URL: process.env.GENUKA_API_URL,
    GENUKA_CLIENT_ID: process.env.GENUKA_CLIENT_ID,
    GENUKA_CLIENT_SECRET: process.env.GENUKA_CLIENT_SECRET,
    GENUKA_REDIRECT_URI: process.env.GENUKA_REDIRECT_URI,
  },
});
