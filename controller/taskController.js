import React, { createContext, useState, useEffect } from "react";
import * as SQLite from "expo-sqlite";

export const PlaceContext = createContext({
  isLoggedIn: false,
  currentUser: null,
  datosUser: null, // Current user data for UI
  loginUser: (nombre_usuario, clave) => {},
  registerUser: (nombre_usuario, clave, is_premium) => {},
  logoutUser: () => {},
  getAllUsers: () => {},
  updateUserPremiumStatus: (userId, is_premium) => {},
  tasks: [],
  loadTasks: () => {},
  loadUserTasks: () => {}, // Fetch tasks for current user
  addTask: (task) => {},
  updateTask: (taskId, updatedTask) => {},
  deleteTask: (id) => {},
});

function PlaceContextProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [refreshFlag, setRefreshFlag] = useState(false);

  // Initial database setup
  async function CsyncDB() {
    const db = await SQLite.openDatabaseAsync("Csync");
    await db.execAsync("PRAGMA journal_mode = WAL");

    // Create users table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre_usuario TEXT UNIQUE,
        clave TEXT,
        is_premium INTEGER DEFAULT 0,
        is_admin INTEGER DEFAULT 0
      );
    `);

    // Create tasks table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS TASKS (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        Status TEXT DEFAULT 'Pendiente',  -- Default status
        time TEXT,
        date TEXT NOT NULL,
        created_at TEXT,
        imageUri TEXT,
        user_id INTEGER NOT NULL
      );
    `);

    // Add admin user if not exists
    await db.runAsync(
      `INSERT OR IGNORE INTO usuarios (nombre_usuario, clave, is_admin) VALUES ('admin', 'admin123', 1);`
    );

    console.log("Database initialized.");
  }

  // User login
  async function loginUser(nombre_usuario, clave) {
    try {
      const db = await SQLite.openDatabaseAsync("Csync");
      const result = await db.getAllAsync(
        `SELECT * FROM usuarios WHERE nombre_usuario = ? AND clave = ?;`,
        [nombre_usuario, clave]
      );
      if (result.length > 0) {
        setCurrentUser(result[0]);
        setIsLoggedIn(true);
        await loadTasks();
        return { success: true };
      } else {
        return { success: false, message: "Invalid username or password." };
      }
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, message: "An error occurred during login." };
    }
  }

  // Derived user data
  const datosUser = {
    nombre_usuario: currentUser?.nombre_usuario || "N/A",
    plan: currentUser?.is_premium ? "Premium" : "Básico",
    ...currentUser,
  };

  // User registration
  async function registerUser(nombre_usuario, clave, is_premium = 0) {
    try {
      const db = await SQLite.openDatabaseAsync("Csync");
      const existingUser = await db.getAllAsync(
        `SELECT * FROM usuarios WHERE nombre_usuario = ?;`,
        [nombre_usuario]
      );
      if (existingUser.length > 0) {
        return { success: false, message: "Username already exists." };
      }
      await db.runAsync(
        `INSERT INTO usuarios (nombre_usuario, clave, is_premium) VALUES (?, ?, ?);`,
        [nombre_usuario, clave, is_premium]
      );
      return { success: true };
    } catch (error) {
      console.error("Registration error:", error);
      return { success: false, message: "An error occurred during registration." };
    }
  }

  // Logout user
  async function logoutUser() {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setTasks([]); // Clear tasks in memory
  }

  // Fetch all users
  async function getAllUsers() {
    if (!currentUser?.is_admin) return [];
    try {
      const db = await SQLite.openDatabaseAsync("Csync");
      const users = await db.getAllAsync(`SELECT * FROM usuarios;`);
      return users;
    } catch (error) {
      console.error("Error fetching users:", error);
      return [];
    }
  }
  async function deleteTask(taskId) {
    if (!currentUser) {
      console.error("Cannot delete task: No user is logged in.");
      return;
    }
    try {
      const db = await SQLite.openDatabaseAsync("Csync");
      await db.runAsync(`DELETE FROM TASKS WHERE id = ? AND user_id = ?;`, [
        taskId,
        currentUser.id,
      ]);
      console.log(`Task with ID ${taskId} deleted successfully.`);
      await loadTasks(); // Refresca las tareas
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  }
  // Update premium status
  async function updateUserPremiumStatus(userId, is_premium) {
    try {
      const db = await SQLite.openDatabaseAsync("Csync");
      await db.runAsync(`UPDATE usuarios SET is_premium = ? WHERE id = ?;`, [
        is_premium,
        userId,
      ]);
      setRefreshFlag((prev) => !prev); // Trigger refresh
      return { success: true, message: "Premium status updated successfully." };
    } catch (error) {
      console.error("Error updating premium status:", error);
      return { success: false, message: "An error occurred updating premium status." };
    }
  }

  // Add new task
  async function addTask(task) {
    if (!currentUser) {
      console.error("Cannot add task: No user is logged in.");
      return;
    }
    try {
      const db = await SQLite.openDatabaseAsync("Csync");
      await db.runAsync(
        `INSERT INTO TASKS (title, description, Status, time, date, created_at, imageUri, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
        [
          task.title,
          task.description || "",
          task.Status || "Pendiente",
          task.time || "12:00",
          task.date || new Date().toISOString().split("T")[0],
          task.created_at || new Date().toISOString(),
          task.imageUri || "",
          currentUser.id,
        ]
      );
      await loadTasks();
    } catch (error) {
      console.error("Error adding task:", error);
    }
  }

  // Update task
  async function updateTask(taskId, updatedTask) {
    if (!currentUser) return;
    try {
      const db = await SQLite.openDatabaseAsync("Csync");
      await db.runAsync(
        `UPDATE TASKS SET title = ?, description = ?, Status = ?, time = ?, date = ?, created_at = ?, imageUri = ? WHERE id = ? AND user_id = ?;`,
        [
          updatedTask.title,
          updatedTask.description || "",
          updatedTask.Status || "Pendiente",
          updatedTask.time || "12:00",
          updatedTask.date || new Date().toISOString().split("T")[0],
          updatedTask.created_at || new Date().toISOString(),
          updatedTask.imageUri || "",
          taskId,
          currentUser.id,
        ]
      );
      await loadTasks();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  }

  // Load tasks
  async function loadTasks() {
    if (!currentUser) return;
    try {
      const db = await SQLite.openDatabaseAsync("Csync");
      const result = await db.getAllAsync(
        `SELECT * FROM TASKS WHERE user_id = ?;`,
        [currentUser.id]
      );
      setTasks(result);
    } catch (error) {
      console.error("Error loading tasks:", error);
    }
  }

  // Load tasks for current user
  async function loadUserTasks() {
    if (!currentUser) return [];
    try {
      const db = await SQLite.openDatabaseAsync("Csync");
      const result = await db.getAllAsync(
        `SELECT * FROM TASKS WHERE user_id = ?;`,
        [currentUser.id]
      );
      return result;
    } catch (error) {
      console.error("Error loading user tasks:", error);
      return [];
    }
  }

  // Initialize database
  useEffect(() => {
    const initialize = async () => {
      await CsyncDB();
    };
    initialize();
  }, []);

  return (
    <PlaceContext.Provider
      value={{
        isLoggedIn,
        currentUser,
        datosUser,
        deleteTask,
        refreshFlag,
        loginUser,
        registerUser,
        logoutUser,
        getAllUsers,
        updateUserPremiumStatus,
        tasks,
        loadTasks,
        loadUserTasks,
        addTask,
        updateTask,
      }}
    >
      {children}
    </PlaceContext.Provider>
  );
}

export default PlaceContextProvider;
