import React, { createContext, useState, useEffect } from "react";
import * as SQLite from "expo-sqlite";

export const PlaceContext = createContext({
  isLoggedIn: false,
  currentUser: null,
  loginUser: (nombre_usuario, clave) => {},
  registerUser: (nombre_usuario, clave) => {},
  logoutUser: () => {},
  getAllUsers: () => {},
  updateUserPremiumStatus: (userId, is_premium) => {},
  tasks: [],
  loadTasks: () => {},
  addTask: (task) => {},
  deleteTask: (id) => {},
});

function PlaceContextProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [tasks, setTasks] = useState([]);

  async function CsyncDB() {
    const db = await SQLite.openDatabaseAsync("Csync");
    await db.execAsync("PRAGMA journal_mode = WAL");
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre_usuario TEXT UNIQUE,
        clave TEXT,
        is_premium INTEGER DEFAULT 0,
        is_admin INTEGER DEFAULT 0
      );
      CREATE TABLE IF NOT EXISTS TASKS (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        Status TEXT,
        time TEXT,
        date TEXT NOT NULL,
        created_at TEXT,
        imageUri TEXT,
        user_id INTEGER NOT NULL
      );
    `);

    // Add admin user if it doesn't exist
    await db.runAsync(
      `INSERT OR IGNORE INTO usuarios (nombre_usuario, clave, is_admin) VALUES ('admin', 'admin123', 1);`
    );
  }

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
        await loadTasks(); // Load tasks for the logged-in user
        console.log("Login successful:", result[0]);
        return { success: true };
      } else {
        return { success: false, message: "Invalid username or password." };
      }
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, message: "An error occurred during login." };
    }
  }

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
      console.log("User registered successfully!");
      return { success: true };
    } catch (error) {
      console.error("Registration error:", error);
      return { success: false, message: "An error occurred during registration." };
    }
  }

  async function logoutUser() {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setTasks([]); // Clear tasks in memory
    console.log("User logged out.");
  }

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

  async function updateUserPremiumStatus(userId, is_premium) {
    try {
      const db = await SQLite.openDatabaseAsync("Csync");
      await db.runAsync(`UPDATE usuarios SET is_premium = ? WHERE id = ?;`, [
        is_premium,
        userId,
      ]);
      console.log("Premium status updated.");
      return { success: true, message: "Premium status updated successfully." };
    } catch (error) {
      console.error("Error updating premium status:", error);
      return { success: false, message: "An error occurred updating premium status." };
    }
  }

  async function loadTasks() {
    if (!currentUser) return;
    try {
      const db = await SQLite.openDatabaseAsync("Csync");
      const result = await db.getAllAsync(
        `SELECT * FROM TASKS WHERE user_id = ?;`,
        [currentUser.id]
      );
      setTasks(result);
      console.log("Tasks loaded:", result);
    } catch (error) {
      console.error("Error loading tasks:", error);
    }
  }

  async function addTask(task) {
    if (!currentUser) return;
    try {
      const db = await SQLite.openDatabaseAsync("Csync");
      await db.runAsync(
        `INSERT INTO TASKS (title, description, Status, time, date, created_at, imageUri, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
        [
          task.title,
          task.description,
          task.Status || "pendiente",
          task.time || "12:00",
          task.date || new Date().toISOString().split("T")[0],
          task.created_at || new Date().toISOString(),
          task.imageUri || "",
          currentUser.id,
        ]
      );
      console.log("Task added successfully!");
      await loadTasks();
    } catch (error) {
      console.error("Error adding task:", error);
    }
  }

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
        loginUser,
        registerUser,
        logoutUser,
        getAllUsers,
        updateUserPremiumStatus,
        tasks,
        loadTasks,
        addTask,
      }}
    >
      {children}
    </PlaceContext.Provider>
  );
}

export default PlaceContextProvider;
