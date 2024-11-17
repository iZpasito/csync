import React, { useContext } from 'react';
import { PlaceContext } from '../controller/taskController';
import { View, Text, StyleSheet } from 'react-native';


const TaskList = () => {
  const { tasks } = useContext(PlaceContext);
  return (
    <View>
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
    </View>
  );
};
const styles = StyleSheet.create({
    container: {
      padding: 20,
    },
    input: {
      borderColor: 'gray',
      borderWidth: 1,
      marginBottom: 10,
      padding: 10,
    },
    noTasksText: {
      fontSize: 16,
      textAlign: 'center',
      marginTop: 20,
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
export default TaskList;
