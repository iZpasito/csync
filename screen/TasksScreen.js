import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Button, TextInput, Alert, Modal } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { PlaceContext } from '../controller/taskController';
import ImagePickerComponent from '../components/ImagePicker';


const TasksScreen = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [Status, SetStatus] = useState('3');
  const [editingTask, setEditingTask] = useState(null);
  const [time, setTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [imageUri, setImageUri] = useState('');
  const [showImagePicker, setShowImagePicker] = useState(false);
  const { addTask, tasks, deleteTask, updateTask } = useContext(PlaceContext);

  useEffect(() => {}, []);

  const handleAddTask = async () => {
    if (title && description) {
      const formattedTime = time.toLocaleTimeString('es-ES', { hour12: false });
      const newTask = {
        title: title,
        description: description,
        status: Status,
        time: formattedTime,
        date: new Date().toISOString().split('T')[0],
        created_at: new Date().toISOString(),
        imageUri: imageUri, // Incluir la URI de la imagen
      };
      try {
        addTask(newTask);
        setTitle(''); // Limpiar campos después de agregar la tarea
        setDescription('');
        setImageUri('');
      } catch (error) {
        console.error('Error adding task:', error);
      }
    } else {
      Alert.alert('Por favor completa todos los campos');
    }
  };

  const onTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || time;
    setShowTimePicker(false);
    setTime(currentTime);
  };

  const handleImageSelected = (uri) => {
    setImageUri(uri);
    setShowImagePicker(false); // Ocultar el modal de ImagePicker después de seleccionar una imagen
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description);
    Alert.alert(
      'Editar Tarea',
      'Edita los detalles de la tarea.',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
          onPress: () => setEditingTask(null),
        },
        {
          text: 'Guardar',
          onPress: () => {
            if (editingTask) {
              const updatedTask = {
                ...editingTask,
                title: title,
                description: description,
              };
              // Actualizar la tarea aquí
              updateTask(id,updatedTask);
              setEditingTask(null);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  // Función para manejar la eliminación de una tarea
  const handleDeleteTask = (id) => {
    console.log("ESTE ES EL ID",id);
    Alert.alert(
      'Eliminar Tarea',
      '¿Estás seguro de que deseas eliminar esta tarea?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            deleteTask(id);
          },
        },
      ],
      { cancelable: true }
    );
  };



  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hoy</Text>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.task}>
          <Text>{item.title}</Text>
          <Text>{item.description}</Text>
          <Text>{item.status}</Text>
          <Text>Hora: {item.time}</Text>
          {item.imageUri && (
            <View style={styles.imageContainer}>
              <Image source={{ uri: item.imageUri }} style={styles.image} />
            </View>
          )}
          <View style={styles.actions}>
            <TouchableOpacity onPress={() => handleEditTask(item.id, item)}>
              <Text style={styles.edit}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDeleteTask(item.id)}>
              <Text style={styles.delete}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        </View>
        )}
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

      <Button title="Adjuntar Imagen" onPress={() => setShowImagePicker(true)} />

      <Modal visible={showImagePicker} animationType="slide">
        <ImagePickerComponent onImageSelected={handleImageSelected} />
        <Button title="Cancelar" onPress={() => setShowImagePicker(false)} />
      </Modal>

      {imageUri && (
        <View style={styles.imagePreview}>
          <Text>Imagen seleccionada:</Text>
          <Image source={{ uri: imageUri }} style={styles.image} />
        </View>
      )}

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
  imagePreview: {
    marginVertical: 10,
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  imageContainer: {
    marginTop: 10,
  },
});

export default TasksScreen;
