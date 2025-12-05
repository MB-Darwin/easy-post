import { createEnv } from '@t3-oss/env-nextjs';
import * as z from 'zod';

export const serverEnv = createEnv({
  server: {
    DATABASE_URL: z.string().min(1),
  },
  shared: {
    NODE_ENV: z.enum(['test', 'development', 'production']).optional(),
  },
  // You need to destructure all the keys manually
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
  },
});
