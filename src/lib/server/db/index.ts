import { env } from '$env/dynamic/private';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = env.DATABASE_URL || process.env.DATABASE_URL;

if (!connectionString) throw new Error('DATABASE_URL is not set');

const client = postgres(connectionString);

export const db = drizzle(client, { schema });
