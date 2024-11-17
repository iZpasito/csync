import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Button, TextInput, Alert, Modal } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { PlaceContext } from '../controller/taskController';
import ImagePickerComponent from '../components/ImagePicker';


const TasksScreen = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [time, setTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [imageUri, setImageUri] = useState(null);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const { addTask, tasks } = useContext(PlaceContext);

  useEffect(() => {}, []);

  const handleAddTask = async () => {
    if (title && description) {
      const formattedTime = time.toLocaleTimeString('es-ES', { hour12: false });
      const newTask = {
        title: title,
        description: description,
        status: 'pendiente',
        time: formattedTime,
        date: new Date().toISOString().split('T')[0],
        created_at: new Date().toISOString(),
        imageUri: imageUri, // Incluir la URI de la imagen
      };
      try {
        addTask(newTask);
        setTitle(''); // Limpiar campos después de agregar la tarea
        setDescription('');
        setImageUri(null);
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

  const renderTask = ({ item }) => (
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
        <TouchableOpacity onPress={() => handleEditTask(item)}>
          <Text style={styles.edit}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDeleteTask(item.id)}>
          <Text style={styles.delete}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

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

      {/* Botón para abrir el ImagePicker */}
      <Button title="Adjuntar Imagen" onPress={() => setShowImagePicker(true)} />

      {/* Modal para mostrar el ImagePickerComponent */}
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
