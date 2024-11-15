import db from '../database/db';

class Tareas {
    // Crear una nueva tarea
    static createTask(title, description, status, time, callback) {
      const createdAt = new Date().toISOString();
      db.transaction(tx => {
        tx.executeSql(
          `INSERT INTO tasks (title, description, status, time, created_at) VALUES (?, ?, ?, ?, ?)`,
          [title, description, status, time, createdAt],
          (_, result) => callback(result),
          (_, error) => console.error('Error al crear la tarea:', error)
        );
      });
    }
  
    // Obtener todas las tareas
    static getTasks(callback) {
      db.transaction(tx => {
        tx.executeSql(
          `SELECT * FROM tasks`,
          [],
          (_, { rows }) => callback(rows._array),
          (_, error) => console.error('Error al obtener las tareas:', error)
        );
      });
    }
  
    // Actualizar una tarea existente
    static updateTask(id, title, description, status, time, callback) {
      db.transaction(tx => {
        tx.executeSql(
          `UPDATE tasks SET title = ?, description = ?, status = ?, time = ? WHERE id = ?`,
          [title, description, status, time, id],
          (_, result) => callback(result),
          (_, error) => console.error('Error al actualizar la tarea:', error)
        );
      });
    }
  
    // Eliminar una tarea
    static deleteTask(id, callback) {
      db.transaction(tx => {
        tx.executeSql(
          `DELETE FROM tasks WHERE id = ?`,
          [id],
          (_, result) => callback(result),
          (_, error) => console.error('Error al eliminar la tarea:', error)
        );
      });
    }
  
    // Crear casos de prueba para tareas
    static createTestTasks() {
      const testTasks = [
        { title: 'Reunión de proyecto', description: 'Reunión con el equipo para discutir avances del proyecto.', status: 'pendiente', time: '10:00:00' },
        { title: 'Estudiar para el examen', description: 'Estudiar para el examen de matemáticas.', status: 'en progreso', time: '15:00:00' },
        { title: 'Comprar víveres', description: 'Ir al supermercado para comprar víveres.', status: 'pendiente', time: '18:30:00' },
        { title: 'Entrenamiento en el gimnasio', description: 'Entrenar piernas en el gimnasio.', status: 'completada', time: '20:00:00' },
      ];
  
      testTasks.forEach(task => {
        Tareas.createTask(task.title, task.description, task.status, task.time, (result) => {
          console.log('Tarea de prueba creada:', result);
        });
      });
    }
  
    // Crear un nuevo usuario
    static createUser(username, email, password, isPremium, callback) {
      const createdAt = new Date().toISOString();
      db.transaction(tx => {
        tx.executeSql(
          `INSERT INTO users (username, email, password, is_premium, created_at) VALUES (?, ?, ?, ?, ?)`,
          [username, email, password, isPremium, createdAt],
          (_, result) => callback(result),
          (_, error) => console.error('Error al crear el usuario:', error)
        );
      });
    }
  
    // Obtener todos los usuarios
    static getUsers(callback) {
      db.transaction(tx => {
        tx.executeSql(
          `SELECT * FROM users`,
          [],
          (_, { rows }) => callback(rows._array),
          (_, error) => console.error('Error al obtener los usuarios:', error)
        );
      });
    }
  
    // Actualizar un usuario existente
    static updateUser(id, username, email, password, isPremium, callback) {
      db.transaction(tx => {
        tx.executeSql(
          `UPDATE users SET username = ?, email = ?, password = ?, is_premium = ? WHERE id = ?`,
          [username, email, password, isPremium, id],
          (_, result) => callback(result),
          (_, error) => console.error('Error al actualizar el usuario:', error)
        );
      });
    }
  
    // Eliminar un usuario
    static deleteUser(id, callback) {
      db.transaction(tx => {
        tx.executeSql(
          `DELETE FROM users WHERE id = ?`,
          [id],
          (_, result) => callback(result),
          (_, error) => console.error('Error al eliminar el usuario:', error)
        );
      });
    }
  }
  
  

export default Tareas; 
