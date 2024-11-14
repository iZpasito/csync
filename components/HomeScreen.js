import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tareas destacadas</Text>
      <View style={styles.task}>
        <Text style={styles.taskTitle}>Hora con el Doctor</Text>
        <Text>11:00 - 12:00</Text>
        <Text>Descripción explicativa sobre cómo funciona la tarea destacada.</Text>
      </View>
      <View style={styles.task}>
        <Text style={styles.taskTitle}>Reunión importante</Text>
        <Text>13:30 - 15:00</Text>
        <Text>Descripción explicativa sobre cómo funciona la tarea destacada.</Text>
      </View>
      <Button title="Agregar Tarea" onPress={() => {}} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  task: {
    backgroundColor: '#e0e0e0',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
