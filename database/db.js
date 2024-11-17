
import * as SQLite from 'expo-sqlite';


export async function CsyncDB() {
  const db = SQLite.openDatabaseAsync('tasks.db');
  await db.execAsync('PRAGMA journal_mode = WAL');
  await db.execAsync (`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      Status TEXT,
      time TEXT,
      created_at TEXT);

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      is_premium INTEGER DEFAULT 2,  -- Referencia a premium_status
      created_at TEXT
    );
   
    CREATE TABLE IF NOT EXISTS premium_status (
      id INTEGER PRIMARY KEY,
      description TEXT NOT NULL
    );
    INSERT OR IGNORE INTO premium_status (id, description) VALUES
      (1, 'Es premium'),
      (2, 'No es premium'),
      (3, 'Prueba');`);
  console.log("Tablas creadas o ya existen.");
}

