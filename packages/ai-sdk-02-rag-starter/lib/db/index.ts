import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { env } from '@/lib/env.mjs';

const client = postgres(env.DATABASE_URL, {
  ssl: {
    rejectUnauthorized: false, // TODO remove this line in production
  },
});
export const db = drizzle(client);
