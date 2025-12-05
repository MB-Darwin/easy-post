import { createEnv } from '@t3-oss/env-nextjs';
import * as z from 'zod';

export const clientEnv = createEnv({
  client: {
    NEXT_PUBLIC_APP_URL: z.string().optional(),
  },
  // You need to destructure all the keys manually
  runtimeEnv: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },
});
