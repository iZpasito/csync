import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Button, TextInput, Alert, Modal, Image } from 'react-native';
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
  const [imageUri, setImageUri] = useState();
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);

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
        setImageUri();
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

  const handleImageSelected = (imageUri) => {
    setImageUri(imageUri);
    setShowImagePicker(false); // Ocultar el modal de ImagePicker después de seleccionar una imagen
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description);
    setImageUri(task.imageUri);
    SetStatus(task.status);
    setModalVisible(true); // Mostrar el modal para editar la tarea
  };
  const handleSaveTask = () => {
    if (editingTask) {
      const updatedTask = {
        ...editingTask,
        title,
        description,
        imageUri,
      };

      // Actualizar la tarea en la base de datos
      updateTask(editingTask.id, updatedTask);

      // Cerrar el modal después de guardar
      setModalVisible(false);
      setEditingTask(null);
    }
  };
  const handleDeleteTask = (id) => {
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
          <Text>Titulo: {item.title}</Text>
          <Text>Descripcion{item.description}</Text>
          <Text>Premium: {item.status != 1 ? "No"  : "Si"}</Text>
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
    <Modal
      visible={isModalVisible}
      animationType="slide"
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Editar Tarea</Text>

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

          <View style={styles.modalButtons}>
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveTask}>
              <Text style={styles.buttonText}>Guardar Cambios</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={() => {
              setModalVisible(false);
              setEditingTask(null);
            }}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
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
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo translúcido para el modal
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  saveButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginRight: 10,
  },
  cancelButton: {
    backgroundColor: '#ff4d4d',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
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
