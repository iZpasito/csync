import React, { createContext, useState, useEffect } from "react";
import * as SQLite from "expo-sqlite";
import { CsyncDB } from "../database/db";

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
    loadUsers();
  }, []);

  const setupDatabase = async () => {
    try {
      await CsyncDB();
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
      console.log(result)
      setTasks(result.rows._array);
    } catch (error) {
      console.error("Failed to load tasks:", error);
    }
  };

  const addTask = async (task) => {
    try {
      const result = await db.execAsync(
        "INSERT INTO tasks (title, description, status, time, created_at) VALUES (?, ?, ?, ?, ?)",
        [task.title, task.description, task.status, task.time, task.created_at]
      );
      setTasks((prevTasks) => [
        ...prevTasks,
        { id: result.insertId, ...task },
      ]);
    } catch (error) {
      console.error("Failed to add task:", error);
    }
  };

  const updateTask = async (id, updatedTask) => {
    try {
      await db.execAsync(
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
  };

  const deleteTask = async (id) => {
    try {
      await db.execAsync(
        "DELETE FROM tasks WHERE id = ?",
        [id]
      );
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const loadUsers = async () => {
    try {
      const result = await db.execAsync(
        "SELECT * FROM users",
        []
      );
      setUsers(result.rows._array);
    } catch (error) {
      console.error("Failed to load users:", error);
    }
  };

  const addUser = async (user) => {
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
  };

  const value = {
    tasks,
    users,
    addTask,
    updateTask,
    deleteTask,
    loadTasks,
    addUser,
    loadUsers,
  };

  return (
    <PlaceContext.Provider value={value}>
      {children}
    </PlaceContext.Provider>
  );
}

export default PlaceContextProvider;
