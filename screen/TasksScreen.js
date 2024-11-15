import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Button, TextInput, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import TaskController from '../controller/taskController';

const TasksScreen = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('pendiente');
  const [time, setTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = () => {
    TaskController.fetchTasks(setTasks);
  };

  const addTask = () => {
    if (title && description) {
      const formattedTime = time.toLocaleTimeString('es-ES', { hour12: false }); // Formato 'HH:MM:SS'
      TaskController.addTask(title, description, status, formattedTime, () => {
        setTitle('');           
        setDescription('');     
        setTime(new Date());    
        loadTasks();            
      });
    } else {
      Alert.alert("Por favor completa todos los campos");
    }
  };
  

  const deleteTask = (id) => {
    TaskController.removeTask(id, loadTasks);
  };

  const editTask = (id) => {
    const updatedTitle = prompt("Nuevo título:");
    const updatedDescription = prompt("Nueva descripción:");
    const updatedStatus = prompt("Nuevo estado:");
    const updatedTime = prompt("Nueva hora:");
    if (updatedTitle && updatedDescription && updatedStatus && updatedTime) {
      TaskController.modifyTask(id, updatedTitle, updatedDescription, updatedStatus, updatedTime, loadTasks);
    }
  };

  const renderTask = ({ item }) => (
    <View style={styles.task}>
      <Text>{item.title}</Text>
      <Text>{item.description}</Text>
      <Text>{item.status}</Text>
      <Text>Hora: {item.time}</Text>
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => editTask(item.id)}>
          <Text style={styles.edit}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => deleteTask(item.id)}>
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
      <Button title="Agregar Tarea" onPress={addTask} />
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
