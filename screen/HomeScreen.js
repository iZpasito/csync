import React, { useEffect, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, Button } from 'react-native';
import { PlaceContext } from '../controller/taskController';

const HomeScreen = () => {
  const { tasks, loadTasks, addTask } = useContext(PlaceContext);

  useEffect(() => {
    loadTasks();
  }, []);

  const handleAddTask = () => {
    const newTask = {
      title: "Nueva Tarea",
      description: "Descripción de la tarea",
      Status: "pendiente",
      time: "12:00",
      created_at: new Date().toISOString(),
    };
    addTask(newTask);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Tareas destacadas</Text>

      {tasks.map((task, index) => (
        <View key={index} style={styles.task}>
          <Text style={styles.taskTitle}>{task.title}</Text>
          <Text style={styles.taskTime}>{task.time}</Text>
          <Text style={styles.taskDescription}>{task.description}</Text>
        </View>
      ))}

      <Button title="Agregar Tarea" onPress={handleAddTask} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#343a40', // Fondo oscuro
  },
  title: {
    fontSize: 26,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#f8f9fa', // Color blanco para destacar el título
  },
  task: {
    backgroundColor: '#495057', // Fondo más oscuro para cada tarea
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#ffffff',
  },
  taskTime: {
    fontSize: 16,
    color: '#ced4da',
    marginBottom: 5,
  },
  taskDescription: {
    fontSize: 14,
    color: '#adb5bd',
  },
});

export default HomeScreen;
