import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tareas destacadas</Text>

      <View style={styles.task}>
        <Text style={styles.taskTitle}>Hora con el Doctor</Text>
        <Text style={styles.taskTime}>11:00 - 12:00</Text>
        <Text style={styles.taskDescription}>Descripción explicativa sobre cómo funciona la tarea destacada.</Text>
      </View>

      <View style={styles.task}>
        <Text style={styles.taskTitle}>Reunión importante</Text>
        <Text style={styles.taskTime}>13:30 - 15:00</Text>
        <Text style={styles.taskDescription}>Descripción explicativa sobre cómo funciona la tarea destacada.</Text>
      </View>

      <Button title="Agregar Tarea" onPress={() => navigation.navigate('Tasks')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  task: {
    backgroundColor: '#ffffff',
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
  },
  taskTime: {
    fontSize: 16,
    color: '#6c757d',
    marginBottom: 5,
  },
  taskDescription: {
    fontSize: 14,
    color: '#495057',
  },
});

export default HomeScreen;
