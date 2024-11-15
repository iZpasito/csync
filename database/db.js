import * as SQLite from 'expo-sqlite';

// Abrir la base de datos
const db = SQLite.openDatabase("CsyncDB.db");

// Crear tablas si no existen
db.transaction(tx => {
  // Tabla de Tareas
  tx.executeSql(
    `CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      status TEXT,
      time TEXT,
      created_at TEXT
    );`
  );

  // Tabla de Usuarios con campo is_premium
/*   tx.executeSql(
    `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      is_premium INTEGER DEFAULT 2,  -- Referencia a premium_status
      created_at TEXT
    );`
  );

  // Tabla de Estado de Membresía
  tx.executeSql(
    `CREATE TABLE IF NOT EXISTS premium_status (
      id INTEGER PRIMARY KEY,
      description TEXT NOT NULL
    );`
  );

  // Insertar valores iniciales en la tabla premium_status
  tx.executeSql(
    `INSERT OR IGNORE INTO premium_status (id, description) VALUES
      (1, 'Es premium'),
      (2, 'No es premium'),
      (3, 'Prueba');`
  );
  */
 
});
export default db;
