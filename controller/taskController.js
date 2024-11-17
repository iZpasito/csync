import React, { createContext, useState, useEffect } from "react";
import * as SQLite from "expo-sqlite";

export const PlaceContext = createContext({
  tasks: [],
  addTask: (task) => {},
  loadTasks: (task) => {} 
});

function PlaceContextProvider({ children }) {
  const [tareas, setTasks] = useState([]);

 
  async function CsyncDB() {
    const db = await SQLite.openDatabaseAsync('Csync');
    await db.execAsync('PRAGMA journal_mode = WAL');
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS TASKS (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        Status TEXT,
        time TEXT,
        created_at TEXT);
      CREATE TABLE IF NOT EXISTS premium_status (
        id INTEGER PRIMARY KEY,
        description TEXT NOT NULL
      );`);
}
async function insertarDatos(){
  const db = await SQLite.openDatabaseAsync('Csync');
  await db.runAsync(`INSERT OR IGNORE INTO premium_status (id, description) VALUES
  (1, 'Es premium'),
  (2, 'No es premium'),
  (3, 'Prueba');`)
}
  const loadTasks = async () => {
      const db = await SQLite.openDatabaseAsync('Csync');
      const result = await db.getAllAsync(`SELECT * FROM TASKS`);
      setTasks(result);
  };

  const addTask = async (task) => {
    try {
      const defaultTask = {
        title: "Nueva Tarea",
        description: "Descripción de la tarea",
        Status: "pendiente",
        time: "12:00",
        created_at: new Date().toISOString(),
      };
      const taskToInsert = {
        title: task?.title || defaultTask.title,
        description: task?.description || defaultTask.description,
        Status: task?.status || defaultTask.Status,
        time: task?.time || defaultTask.time,
        created_at: task?.created_at || defaultTask.created_at,
        created_at: task?.imageUri || defaultTask.imageUri,
      };
  
      const db = await SQLite.openDatabaseAsync('Csync'); 
      const result = db.runAsync(
        `INSERT OR IGNORE INTO TASKS (title, description, Status, time, created_at,imageUri) VALUES (?, ?, ?, ?, ?)`,
        taskToInsert.title,
        taskToInsert.description,
        taskToInsert.Status,
        taskToInsert.time,
        taskToInsert.created_at,
        taskToInsert.imageUri);
      setTasks(result);
    } catch (error) {
      console.error("Failed to add task:", error);
    }
  };
  useEffect(() => {
    CsyncDB();
    insertarDatos();
    loadTasks();
  }, []);
  
/*   const updateTask = async (id, updatedTask) => {
    try {
      (await db).execAsync (
        "UPDATE tasks SET title = ?, description = ?, status = ?, time = ?, created_at = ? WHERE id = ?",
        [updatedTask.title, updatedTask.description, updatedTask.status, updatedTask.time, updatedTask.created_at, id]
      );
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === id ? { id, ...updatedTask } : task
        )
      );
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  }; */

 /*  const deleteTask = async (id) => {
    try {
      (await db).execAsync(
        "DELETE FROM tasks WHERE id = ?",
        [id]
      );
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  }; */

  /* const loadUsers = async () => {
    try {
      const result = (await db).execAsync(
        "SELECT * FROM users",
        []
      );
      setUsers(result.rows._array);
    } catch (error) {
      console.error("Failed to load users:", error);
    }
  }; */

 /*  const addUser = async (user) => {
    try {
      const result = (await db).runAsync(
        "INSERT INTO users (username, email, password, is_premium, created_at) VALUES (?, ?, ?, ?, ?)",
        [user.username, user.email, user.password, user.is_premium, user.created_at]
      );
      setUsers((prevUsers) => [
        ...prevUsers,
        { id: result.insertId, ...user },
      ]);
    } catch (error) {
      console.error("Failed to add user:", error);
    }
  }; */

  const value = {
    tasks: tareas,
    addTask,
  };

  return (
    <PlaceContext.Provider value={value}>
      {children}
    </PlaceContext.Provider>
  );
}

export default PlaceContextProvider;
