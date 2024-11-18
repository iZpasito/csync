import React, { useEffect, useContext, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Button, FlatList, Image } from 'react-native';
import { PlaceContext } from '../controller/taskController';
import { useNavigation } from '@react-navigation/native';
import ImagePickerComponent from '../components/ImagePicker';
import { TouchableOpacity } from 'react-native';

const HomeScreen = () => {
  const navigation = useNavigation();
  const {tasks, addTask} = useContext(PlaceContext);
  const [imageUri, setImageUri] = useState();



  const handleAddTask = () => {
    navigation.navigate('Tareas');
  };

  return (
    <FlatList
      style={styles.container}
      data={tasks}
      keyExtractor={(item) => item.id?.toString() || item.title}
      renderItem={({ item }) => {
        return (
          <TouchableOpacity onPress={() => handleAddTask(item)}>
            <View style={styles.taskContainer}>
              <Text style={styles.taskTitle}>{item.title}</Text>
              <Text style={styles.taskDescription}>{item.description}</Text>
              <Text style={styles.taskStatus}>
                Estado: {item.status !== 1 ? "No Premium" : "Premium"}
              </Text>
              <Text style={styles.taskTime}>Hora: {item.time}</Text>
              {item.imageUri ? (
                <View style={styles.imageContainer}>
                  <Image
                    source={{ uri: item.imageUri }}
                    style={styles.image}
                    onError={(error) =>
                      console.error("Error al cargar la imagen:", error)
                    }
                  />
                </View>
              ) : (
                <Text style={styles.noImageText}>No se adjuntó ninguna imagen</Text>
              )}
            </View>
          </TouchableOpacity>
        );
      }}
      ListHeaderComponent={() => (
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Tareas destacadas</Text>
        </View>
      )}
      ListEmptyComponent={() => (
        <Text style={styles.noTasksText}>No hay tareas disponibles</Text>
      )}
      ListFooterComponent={() => (
        <View style={styles.footerContainer}>
          <Button title="Agregar Tarea" onPress={handleAddTask} />
        </View>
      )}
    />
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#343a40', // Fondo oscuro
  },
  headerContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#f8f9fa', // Color blanco para destacar el título
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
  footerContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  noTasksText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#f8f9fa',
  },
});

export default HomeScreen;