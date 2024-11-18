import React, { createContext, useState, useEffect } from "react";
import * as SQLite from "expo-sqlite";

export const PlaceContext = createContext({
  tasks:'',
  addTask: (task) => {},
  loadTasks: (task) => {},
  deleteTask: (id) =>{},
  updateTask: (id,task) =>{}
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
      console.log("LA TAREA",task)
      const defaultTask = {
        title: task.title,
        description: task.description,
        Status: task.Status,
        time: task.time,
        created_at: new Date().toISOString(),
        imageUri: task?.imageUri  !== undefined ? task.imageUri : "",
      };
      const taskToInsert = {
        title: task?.title || defaultTask.title,
        description: task?.description || defaultTask.description,
        Status: task?.status || defaultTask.Status,
        time: task?.time || defaultTask.time,
        created_at: task?.created_at || defaultTask.created_at,
        imageUri: task?.imageUri || defaultTask.imageUri,
      };
  
      const db = await SQLite.openDatabaseAsync('Csync'); 
      const result = db.runAsync(
        `INSERT OR IGNORE INTO TASKS (title, description, Status, time, created_at, imageUri) VALUES (?, ?, ?, ?, ?, ?)`,
        taskToInsert.title,
        taskToInsert.description,
        taskToInsert.Status,
        taskToInsert.time,
        taskToInsert.created_at,
        taskToInsert.imageUri);
      setTasks(result);
      loadTasks();
      console.log("Tarea Agregada Exitosamente!");
    } catch (error) {
      console.error("Failed to add task:", error);
    }
  };
  useEffect(() => {
    CsyncDB();
    insertarDatos();
    loadTasks();
  }, []);
  
  const updateTask = async (id, updatedTask) => {
    try {
      const db = await SQLite.openDatabaseAsync('Csync'); 
      await db.execAsync (
        `UPDATE TASKS SET title = ?, description = ?, Status = ?, time = ?, created_at = ?, imageUri = ? WHERE id = ?`,
      updatedTask.title, updatedTask.description, updatedTask.Status, updatedTask.time, updatedTask.created_at, updateTask.imageUri, id
      );
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === id ? { id, ...updatedTask } : task
        )
      );
      console.log('Datos modificados');
    } catch (error) {
      console.error("Problema al editar los datos", error);
    }
  }; 

const deleteTask = async (id) => {
    try {
      const db = await SQLite.openDatabaseAsync('Csync'); 
      await db.runAsync(`DELETE FROM TASKS WHERE id = ?`,id);
      console.log("Elemento eliminado con exito")
      loadTasks();
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  }; 
  const value = {
    tasks: tareas,
    addTask,
    deleteTask,
    updateTask
  };

  return (
    <PlaceContext.Provider value={value}>
      {children}
    </PlaceContext.Provider>
  );
}

export default PlaceContextProvider;
