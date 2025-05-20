import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '@shared/schema';

// Créer une connexion PostgreSQL en utilisant les variables d'environnement
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Créer une instance de drizzle avec la connexion et le schéma
export const db = drizzle(pool, { schema });