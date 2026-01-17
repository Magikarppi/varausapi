import Database, { Database as DatabaseType } from 'better-sqlite3';
import path from 'path';

const dbPath = process.env.DB_PATH || path.join(__dirname, '..', '..', 'data', 'database.db');

const db: DatabaseType = new Database(dbPath);

db.pragma('journal_mode = WAL');

// Initialize tables immediately so DAOs can prepare statements
db.exec(`
  CREATE TABLE IF NOT EXISTS rooms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    capacity INTEGER,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    room_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    booked_by TEXT NOT NULL,
    start_time TEXT NOT NULL,
    end_time TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
    CHECK (start_time < end_time),
    CHECK (start_time >= datetime('now')),
    CHECK (end_time >= datetime('now'))
  )
`);

db.exec(`
  CREATE INDEX IF NOT EXISTS idx_bookings_room_id ON bookings(room_id)
`);

db.exec(`
  CREATE INDEX IF NOT EXISTS idx_bookings_times ON bookings(start_time, end_time)
`);

export default db;
