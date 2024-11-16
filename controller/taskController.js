import React, { createContext, useState, useLayoutEffect } from 'react';
import { Alert } from 'react-native';



export const PlaceContext = createContext({
  imageUri: '',
  title: '',
  tasks: [],
  selectedDate: '',
  ModificarImagen: (image) => {},
  modifyTitle: (title) => {},
  createTask: (title, description, imageUri, status, time, date) => {},
  getTask: () => {},
  modifyTask: (id, title, description, imageUri, status, time, date) => {},
  deleteTask: (id) => {},
  setSelectedDate: (date) => {},
});

function PlaceContextProvider({ children }) {
  const [imageUri, setImageUri] = useState('');
  const [title, setTitle] = useState('');
  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');

  useLayoutEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    try {
      const result = await db.execAsync(
        [
          {
            sql: 'SELECT * FROM tasks;',
            args: []
          }
        ],
        false
      );
      setTasks(result[0].rows);
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  }

  function ModificarImagen(image) {
    if (image) {
      setImageUri(image);
    } else {
      console.error('Error: image is undefined');
    }
  }

  function modifyTitle(title) {
    setTitle(title);
  }

  async function createTask(title, description, imageUri, status, time, date) {
    try {
      await db.execAsync(
        [
          {
            sql: 'INSERT INTO tasks (title, description, imageUri, status, time, date) VALUES (?, ?, ?, ?, ?, ?)',
            args: [title, description, imageUri, status, time, date]
          }
        ],
        false
      );
      Alert.alert('Success', 'Tarea Creada!');
      loadTasks();
    } catch (error) {
      console.error('Error creating task:', error);
    }
  }

  async function getTask(id) {
    try {
      const result = await db.execAsync(
        [
          {
            sql: 'SELECT * FROM tasks WHERE id = ?;',
            args: [id]
          }
        ],
        false
      );
      return result[0].rows[0];
    } catch (error) {
      console.error('Error getting task:', error);
    }
  }

  async function modifyTask(id, title, description, imageUri, status, time, date) {
    try {
      await db.execAsync(
        [
          {
            sql: 'UPDATE tasks SET title = ?, description = ?, imageUri = ?, status = ?, time = ?, date = ? WHERE id = ?;',
            args: [title, description, imageUri, status, time, date, id]
          }
        ],
        false
      );
      Alert.alert('Success', 'Task updated successfully!');
      loadTasks();
    } catch (error) {
      console.error('Error modifying task:', error);
    }
  }

  async function deleteTask(id) {
    try {
      await db.execAsync(
        [
          {
            sql: 'DELETE FROM tasks WHERE id = ?;',
            args: [id]
          }
        ],
        false
      );
      Alert.alert('Success', 'Task deleted successfully!');
      loadTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  }

  const value = {
    imageUri,
    title,
    tasks,
    selectedDate,
    ModificarImagen,
    modifyTitle,
    createTask,
    getTask,
    modifyTask,
    deleteTask,
    setSelectedDate,
  };

  return (
    <PlaceContext.Provider value={value}>
      {children}
    </PlaceContext.Provider>
  );
}

export default PlaceContextProvider;