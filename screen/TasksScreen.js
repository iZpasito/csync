import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TasksScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hoy</Text>
      <View style={styles.task}>
        <Text>Reunión</Text>
        <Text>13:30 - 15:00</Text>
      </View>
      <Text style={styles.title}>Mañana</Text>
      <View style={styles.task}>
        <Text>Clases</Text>
        <Text>10:00 - 11:30</Text>
      </View>
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
    marginBottom: 10,
  },
  task: {
    backgroundColor: '#e0e0e0',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
  },
});

export default TasksScreen;
