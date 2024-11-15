import Tareas from '../Models/ModelTask';

class TaskController {
  static async addTask(title, description, status, time) {
    try {
      await Tareas.createTask(title, description, status, time);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  }

  static async fetchTasks() {
    try {
      return await Tareas.getTasks();
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  }

  static async modifyTask(id, title, description, status, time) {
    try {
      await Tareas.updateTask(id, title, description, status, time);
    } catch (error) {
      console.error('Error modifying task:', error);
    }
  }

  static async removeTask(id) {
    try {
      await Tareas.deleteTask(id);
    } catch (error) {
      console.error('Error removing task:', error);
    }
  }
}

export default TaskController;
