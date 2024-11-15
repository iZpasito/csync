import Tareas from '../Models/ModelTask';

class TaskController {
  static addTask(title, description, status, time, callback) {
    Tareas.createTask(title, description, status, time, callback);
  }

  static fetchTasks(callback) {
    Tareas.getTasks(callback);
  }

  static modifyTask(id, title, description, status, time, callback) {
    Tareas.updateTask(id, title, description, status, time, callback);
  }

  static removeTask(id, callback) {
    Tareas.deleteTask(id, callback);
  }

  static addUser(username, email, password, isPremium, callback) {
    Tareas.createUser(username, email, password, isPremium, callback);
  }

  static fetchUsers(callback) {
    Tareas.getUsers(callback);
  }

  static modifyUser(id, username, email, password, isPremium, callback) {
    Tareas.updateUser(id, username, email, password, isPremium, callback);
  }

  static removeUser(id, callback) {
    Tareas.deleteUser(id, callback);
  }
}

export default TaskController;
