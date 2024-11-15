import * as SQLite from 'expo-sqlite/next';

class Task {
  static db = null;

  // Initialize the database
  static async initDB() {
    if (Task.db === null) {
      Task.db = await SQLite.openDatabaseAsync('CsyncDB.db');
    }
  }

  // Create a new task
  static async createTask(title, description, status, time) {
    await Task.initDB();
    const createdAt = new Date().toISOString();
    const statement = await Task.db.prepareAsync(
      'INSERT INTO tasks (title, description, status, time, created_at) VALUES ($title, $description, $status, $time, $createdAt)'
    );
    try {
      const result = await statement.executeAsync({
        $title: title,
        $description: description,
        $status: status,
        $time: time,
        $createdAt: createdAt,
      });
      console.log('Task created:', result.lastInsertRowId);
    } finally {
      await statement.finalizeAsync();
    }
  }

  // Get all tasks
  static async getTasks() {
    await Task.initDB();
    const statement = await Task.db.prepareAsync('SELECT * FROM tasks');
    try {
      const result = await statement.executeAsync();
      const allRows = await result.getAllAsync();
      return allRows;
    } finally {
      await statement.finalizeAsync();
    }
  }

  // Update an existing task
  static async updateTask(id, title, description, status, time) {
    await Task.initDB();
    const statement = await Task.db.prepareAsync(
      'UPDATE tasks SET title = $title, description = $description, status = $status, time = $time WHERE id = $id'
    );
    try {
      const result = await statement.executeAsync({
        $title: title,
        $description: description,
        $status: status,
        $time: time,
        $id: id,
      });
      console.log('Rows updated:', result.changes);
    } finally {
      await statement.finalizeAsync();
    }
  }

  // Delete a task
  static async deleteTask(id) {
    await Task.initDB();
    const statement = await Task.db.prepareAsync('DELETE FROM tasks WHERE id = $id');
    try {
      const result = await statement.executeAsync({ $id: id });
      console.log('Rows deleted:', result.changes);
    } finally {
      await statement.finalizeAsync();
    }
  }

  // Create sample test tasks
  static async createTestTasks() {
    const testTasks = [
      { title: 'Project Meeting', description: 'Team meeting to discuss project updates.', status: 'pending', time: '10:00:00' },
      { title: 'Study for Exam', description: 'Study for the mathematics exam.', status: 'in progress', time: '15:00:00' },
      { title: 'Grocery Shopping', description: 'Go to the supermarket to buy groceries.', status: 'pending', time: '18:30:00' },
      { title: 'Gym Workout', description: 'Leg day workout at the gym.', status: 'completed', time: '20:00:00' },
    ];

    for (const task of testTasks) {
      await Task.createTask(task.title, task.description, task.status, task.time);
    }
  }
}

export default Task;
