import React, { useEffect, useContext, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Button, FlatList } from 'react-native';
import { PlaceContext } from '../controller/taskController';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const navigation = useNavigation();
  const {tasks, addTask} = useContext(PlaceContext);


  const handleAddTask = () => {
    navigation.navigate('Tareas');
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Tareas destacadas</Text>
      {tasks.length === 0 ? (
        <Text style={styles.noTasksText}>No hay tareas disponibles</Text>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id?.toString() || item.title}
          renderItem={({ item }) => (
            <View style={styles.taskContainer}>
              <Text style={styles.taskTitle}>{item.title}</Text>
              <Text style={styles.taskDescription}>{item.description}</Text>
              <Text style={styles.taskStatus}>Estado: {item.Status}</Text>
              <Text style={styles.taskTime}>Hora: {item.time}</Text>
            </View>
          )}
        />
      )}
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
  taskContainer: {
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#f8f8f8',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  taskDescription: {
    fontSize: 14,
    marginTop: 5,
  },
  taskStatus: {
    fontSize: 14,
    color: '#555',
    marginTop: 5,
  },
  taskTime: {
    fontSize: 14,
    color: '#777',
    marginTop: 5,
  },
});

export default HomeScreen;
