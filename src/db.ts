import Database, { Database as DatabaseType } from 'better-sqlite3';
import path from 'path';

const dbPath = process.env.DB_PATH || path.join(__dirname, '..', 'data', 'database.db');

const db: DatabaseType = new Database(dbPath);

db.pragma('journal_mode = WAL');

export default db;
