import * as SQLite from 'expo-sqlite';

async function setupDatabase() {
  // Abre o crea la base de datos de forma asincrónica
  const db = await SQLite.openDatabaseAsync('CsyncDB.db');

  // Crea las tablas si no existen usando execAsync
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      status TEXT,
      time TEXT,
      created_at TEXT
    );
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
      (3, 'Prueba');
  `);

  console.log("Tablas creadas o ya existen.");
}

// Llama a la función para configurar la base de datos
setupDatabase().catch(error => {
  console.error("Error al configurar la base de datos:", error);
});
