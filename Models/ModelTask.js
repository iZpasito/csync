import * as SQLite from 'expo-sqlite';

class Tareas {
  static db = null;

  // Inicializar la base de datos
  static async initDB() {
    if (Tareas.db === null) {
      Tareas.db = SQLite.openDatabase('CsyncDB.db');
    }
  }

  // Crear una nueva tarea
  static async createTask(title, description, status, time) {
    await Tareas.initDB();
    const createdAt = new Date().toISOString();
    await new Promise((resolve, reject) => {
      Tareas.db.transaction(tx => {
        tx.executeSql(
          `INSERT INTO tasks (title, description, status, time, created_at) VALUES (?, ?, ?, ?, ?)`,
          [title, description, status, time, createdAt],
          () => resolve(),
          (_, error) => reject(error)
        );
      });
    });
  }

  // Obtener todas las tareas
  static async getTasks() {
    await Tareas.initDB();
    return await new Promise((resolve, reject) => {
      Tareas.db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM tasks',
          [],
          (_, { rows }) => resolve(rows._array),
          (_, error) => reject(error)
        );
      });
    });
  }

  // Actualizar una tarea existente
  static async updateTask(id, title, description, status, time) {
    await Tareas.initDB();
    await new Promise((resolve, reject) => {
      Tareas.db.transaction(tx => {
        tx.executeSql(
          'UPDATE tasks SET title = ?, description = ?, status = ?, time = ? WHERE id = ?',
          [title, description, status, time, id],
          () => resolve(),
          (_, error) => reject(error)
        );
      });
    });
  }

  // Eliminar una tarea
  static async deleteTask(id) {
    await Tareas.initDB();
    await new Promise((resolve, reject) => {
      Tareas.db.transaction(tx => {
        tx.executeSql(
          'DELETE FROM tasks WHERE id = ?',
          [id],
          () => resolve(),
          (_, error) => reject(error)
        );
      });
    });
  }

  static async createTestTasks() {
    const testTasks = [
      { title: 'Reunión de proyecto', description: 'Reunión con el equipo para discutir avances del proyecto.', status: 'pendiente', time: '10:00:00' },
      { title: 'Estudiar para el examen', description: 'Estudiar para el examen de matemáticas.', status: 'en progreso', time: '15:00:00' },
      { title: 'Comprar víveres', description: 'Ir al supermercado para comprar víveres.', status: 'pendiente', time: '18:30:00' },
      { title: 'Entrenamiento en el gimnasio', description: 'Entrenar piernas en el gimnasio.', status: 'completada', time: '20:00:00' },
    ];

    for (const task of testTasks) {
      await Tareas.createTask(task.title, task.description, task.status, task.time);
    }
  }
}

export default Tareas;
