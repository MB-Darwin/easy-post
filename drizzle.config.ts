import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './migrations',
  schema: ['./src/shared/db/schemas/first.ts', './src/shared/db/schemas/second.ts'],
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL ?? '',
  },
  verbose: true,
  strict: true,
});
