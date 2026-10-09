import { Pool } from 'pg';
import path from 'path';

const isProduction = process.env.NODE_ENV === 'production';

// If DATABASE_URL is provided (standard for Render/Heroku/Railway), use it.
// Otherwise, fallback to a local SQLite-like environment or a local Postgres.
const connectionString = process.env.DATABASE_URL;

let pool;

if (connectionString) {
  pool = new Pool({
    connectionString,
    ssl: isProduction ? { rejectUnauthorized: false } : false,
  });
} else {
  // Local development fallback
  pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'outside_exe',
    password: 'password',
    port: 5432,
  });
}

export const db = {
  query: (text: string, params?: any[]) => pool.query(text, params),

  // Helper to initialize the database schema
  async init() {
    await this.query(`
      CREATE TABLE IF NOT EXISTS adventures (
        id TEXT PRIMARY KEY,
        startTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        context JSONB,
        status TEXT,
        totalXP INTEGER DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS missions (
        id TEXT PRIMARY KEY,
        adventureId TEXT,
        title TEXT,
        description TEXT,
        goal TEXT,
        xpReward INTEGER,
        isCompleted BOOLEAN DEFAULT false,
        observation TEXT,
        FOREIGN KEY(adventureId) REFERENCES adventures(id)
      );

      CREATE TABLE IF NOT EXISTS user_profile (
        key TEXT PRIMARY KEY,
        value TEXT
      );
    `);
  }
};

// Auto-init on startup
db.init().catch(err => console.error('DB Init Error:', err));
