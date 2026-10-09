import Database from 'better-sqlite3';
import path from 'path';

const db = new Database(path.join(process.cwd(), 'outside.db'));

// Optimization for concurrency: Enable WAL mode
db.pragma('journal_mode = WAL');
db.pragma('synchronous = NORMAL');
db.pragma('temp_store = MEMORY');


// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS adventures (
    id TEXT PRIMARY KEY,
    startTime DATETIME DEFAULT CURRENT_TIMESTAMP,
    context TEXT,
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
    isCompleted BOOLEAN DEFAULT 0,
    observation TEXT,
    FOREIGN KEY(adventureId) REFERENCES adventures(id)
  );

  CREATE TABLE IF NOT EXISTS user_profile (
    key TEXT PRIMARY KEY,
    value TEXT
  );
`);

export default db;
