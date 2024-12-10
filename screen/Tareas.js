import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  Image,
  Button,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";
import ImagePickerComponent from "../components/ImagePicker";
import Icon from "react-native-vector-icons/FontAwesome";
import { PlaceContext } from "../controller/taskController";

const Tareas = () => {
  const { tasks, loadTasks, deleteTask, updateTask } = useContext(PlaceContext);
  const navigation = useNavigation();

  const [editingTask, setEditingTask] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [time, setTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [imageUri, setImageUri] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    loadTasks(); // Cargar las tareas al iniciar
  }, []);

  const handleEditTask = (task) => {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description);
    setTime(new Date(task.time || new Date()));
    setImageUri(task.imageUri);
    setModalVisible(true);
  };

  const handleSaveTask = async () => {
    if (!title.trim() || !description.trim()) {
      Alert.alert("Error", "Por favor completa todos los campos.");
      return;
    }

    const updatedTask = {
      ...editingTask,
      title,
      description,
      time: time.toLocaleTimeString("es-ES", { hour12: false }),
      imageUri,
    };

    try {
      await updateTask(editingTask.id, updatedTask);
      setModalVisible(false);
      setEditingTask(null);
      loadTasks();
    } catch (error) {
      console.error("Error al guardar la tarea:", error);
      Alert.alert("Error", "No se pudo guardar la tarea.");
    }
  };

  const toggleTaskStatus = async (task) => {
    const updatedTask = {
      ...task,
      Status: task.Status === "Pendiente" ? "Completada" : "Pendiente",
    };

    try {
      updateTask(task.id, updatedTask);
      loadTasks(); // Recargar tareas
    } catch (error) {
      console.error("Error al actualizar estado de tarea:", error);
    }
  };

  const handleDeleteTask = (taskId) => {
    Alert.alert(
      "Eliminar Tarea",
      "¿Estás seguro de que deseas eliminar esta tarea?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              deleteTask(taskId);
              loadTasks();
            } catch (error) {
              console.error("Error al eliminar la tarea:", error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis Tareas</Text>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.task}>
            <View style={styles.taskInfo}>
              <Text style={styles.taskTitle}>Título: {item.title}</Text>
              <Text>Estado: {item.Status}</Text>
              <Text>Fecha: {item.date}</Text>
              <Text>Hora: {item.time}</Text>
            </View>
            <View style={styles.iconGroup}>
              <TouchableOpacity
                onPress={() => toggleTaskStatus(item)}
                style={styles.iconButton}
              >
                <Icon
                  name={
                    item.Status === "Pendiente" ? "clock-o" : "check-circle"
                  }
                  size={24}
                  color={item.Status === "Pendiente" ? "blue" : "green"}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleEditTask(item)}
                style={styles.iconButton}
              >
                <Icon name="edit" size={24} color="blue" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleDeleteTask(item.id)}
                style={styles.iconButton}
              >
                <Icon name="trash" size={24} color="red" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Modal para editar tarea */}
      <Modal visible={modalVisible} transparent animationType="slide">
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
            <TouchableOpacity
              onPress={() => setShowTimePicker(true)}
              style={styles.iconButton}
            >
              <Icon name="clock-o" size={24} color="black" />
              <Text style={styles.timeText}>
                {time.toLocaleTimeString("es-ES", { hour12: false })}
              </Text>
            </TouchableOpacity>
            {showTimePicker && (
              <DateTimePicker
                value={time}
                mode="time"
                is24Hour
                display="default"
                onChange={(event, selectedTime) =>
                  setTime(selectedTime || time)
                }
              />
            )}
            <ImagePickerComponent onImageSelected={setImageUri} />
            {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
            <View style={styles.buttonRow}>
              <Button title="Guardar" onPress={handleSaveTask} />
              <Button
                title="Cancelar"
                color="red"
                onPress={() => setModalVisible(false)}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  task: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#e0e0e0",
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  iconGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  iconButton: {
    marginHorizontal: 5,
  },
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
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  timeText: {
    fontSize: 16,
    marginLeft: 10,
  },
});

export default Tareas;
