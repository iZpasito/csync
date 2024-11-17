import React, { createContext, useState, useEffect } from "react";
import { CsyncDB, insertarDatos } from "../database/db";
import * as SQLite from 'expo-sqlite';

// Crear una instancia de la base de datos que se usará en todas las funciones
const db = SQLite.openDatabaseAsync('tasks.db');

export const PlaceContext = createContext({
  tasks: [],
  users: [],
  addTask: (task) => {},
  updateTask: (id, updatedTask) => {},
  deleteTask: (id) => {},
  loadTasks: () => {},
  addUser: (user) => {},
  loadUsers: () => {},
});

function PlaceContextProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    setupDatabase();
    loadTasks();
  }, []);

  const setupDatabase = async () => {
    try {
      await CsyncDB(); // Configura la base de datos y crea las tablas si no existen
      await insertarDatos(); // Inserta datos iniciales
      console.log("Tablas creadas o ya existen.");
    } catch (error) {
      console.error("Error al configurar la base de datos:", error);
    }
  };

  const loadTasks = async () => {
    try {
      const result = await db.execAsync(
        "SELECT * FROM tasks",
        []
      );
      setTasks(result.rows._array);
    } catch (error) {
      console.error("Failed to load tasks:", error);
    }
  };

  const addTask = async (task) => {
    try {
      const result = await db.runAsync(
        "INSERT INTO tasks (title, description, Status, time, created_at) VALUES (?, ?, ?, ?, ?)"
        ,task.title, task.description, task.Status, task.time, task.created_at);
/*       setTasks((prevTasks) => [
        ...prevTasks,
        { id: result.insertId, ...task },
      ]); */
    } catch (error) {
      console.error("Failed to add task:", error);
    }
  };

  /* const loadUsers = async () => {
    try {
      const result = await db.execAsync(
        "SELECT * FROM users",
        []
      );
      setUsers(result.rows._array);
    } catch (error) {
      console.error("Failed to load users:", error);
    }
  }; */

/*   const addUser = async (user) => {
    try {
      const result = await db.runAsync(
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
    tasks,
    addTask,
    updateTask: () => {}, // Puedes añadir la lógica para actualizar tareas
    deleteTask: () => {}, // Puedes añadir la lógica para eliminar tareas
    loadTasks,
  };

  return (
    <PlaceContext.Provider value={value}>
      {children}
    </PlaceContext.Provider>
  );
}

export default PlaceContextProvider;
