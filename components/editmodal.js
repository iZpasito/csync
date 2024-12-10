import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TextInput,
  Button,
  StyleSheet,
  Image,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import ImagePickerComponent from "../components/ImagePicker";

const TaskEditModal = ({ visible, task, onSave, onCancel }) => {
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [time, setTime] = useState(task?.time ? new Date(task.time) : new Date());
  const [imageUri, setImageUri] = useState(task?.imageUri || "");
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleSave = () => {
    if (!title.trim() || !description.trim()) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    const updatedTask = {
      ...task,
      title,
      description,
      time: time.toLocaleTimeString("es-ES", { hour12: false }),
      imageUri,
    };
    onSave(updatedTask);
  };

  const onTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || time;
    setShowTimePicker(false);
    setTime(currentTime);
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
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
          <Button title="Seleccionar Hora" onPress={() => setShowTimePicker(true)} />
          {showTimePicker && (
            <DateTimePicker
              value={time}
              mode="time"
              is24Hour
              display="default"
              onChange={onTimeChange}
            />
          )}
          <ImagePickerComponent onImageSelected={setImageUri} />
          {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
          <Button title="Guardar Cambios" onPress={handleSave} />
          <Button title="Cancelar" color="red" onPress={onCancel} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    marginHorizontal: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 10,
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  image: {
    width: "100%",
    height: 150,
    marginBottom: 10,
  },
});

export default TaskEditModal;
