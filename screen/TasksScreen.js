import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Button, TextInput, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { PlaceContext } from '../controller/taskController';

const TasksScreen = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [time, setTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    loadTasks();
  }, []);

  const handleAddTask = async () => {
    if (title && description) {
      const formattedTime = time.toLocaleTimeString('es-ES', { hour12: false });
      const newTask = {
        title:'prueba',
        description:'prueba',
        status:'pendiente',
        time: formattedTime,
        date: new Date().toISOString().split('T')[0],
        created_at: new Date().toISOString(),
      };
      try {
        addTask(newTask);   
      } catch (error) {
        console.error('Error adding task:', error);
      }
    } else {
      Alert.alert("Por favor completa todos los campos");
    }
  };
 
  const handleEditTask = async (task) => {
    const updatedTitle = prompt("Nuevo título:", task.title);
    const updatedDescription = prompt("Nueva descripción:", task.description);
    const updatedStatus = prompt("Nuevo estado:", task.status);
    const updatedTime = prompt("Nueva hora:", task.time);
    if (updatedTitle && updatedDescription && updatedStatus && updatedTime) {
      const updatedTask = {
        title: updatedTitle,
        description: updatedDescription,
        status: updatedStatus,
        time: updatedTime,
        created_at: new Date().toISOString(),
      };
      console.log(updatedTask);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      console.log(id, 'se borro');
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const renderTask = ({ item }) => (
    <View style={styles.task}>
      <Text>{item.title}</Text>
      <Text>{item.description}</Text>
      <Text>{item.status}</Text>
      <Text>Hora: {item.time}</Text>
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => handleEditTask(item)}>
          <Text style={styles.edit}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDeleteTask(item.id)}>
          <Text style={styles.delete}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const onTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || time;
    setShowTimePicker(false);
    setTime(currentTime);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hoy</Text>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderTask}
      />

      <Text style={styles.title}>Agregar Tarea</Text>
      <TextInput
        style={styles.input}
        placeholder="Título"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Descripción"
        value={description}
        onChangeText={setDescription}
      />
      <Button title="Seleccionar Hora" onPress={() => setShowTimePicker(true)} />
      {showTimePicker && (
        <DateTimePicker
          value={time}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={onTimeChange}
        />
      )}
      <Text>Hora seleccionada: {time.toTimeString().split(' ')[0]}</Text>
      <Button title="Agregar Tarea" onPress={handleAddTask} />
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
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  edit: {
    color: 'blue',
  },
  delete: {
    color: 'red',
  },
});

export default TasksScreen;
