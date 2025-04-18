
import dotenv from 'dotenv';
dotenv.config(); // puts info into process.env
    
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as dbSchema from './schema';

const neondbClient = neon(process.env.DATABASE_URL!);
export const db = drizzle(neondbClient, {schema: dbSchema});
