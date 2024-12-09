import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Button,
  Alert,
  Modal,
  TextInput,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";
import ImagePickerComponent from "../components/ImagePicker";
import { PlaceContext } from "../controller/taskController";

const Tareas = () => {
  const {
    tasks,
    deleteTask,
    logoutUser,
    currentUser,
    getAllUsers,
    updateUserPremiumStatus,
    addTask,
    updateTask,
  } = useContext(PlaceContext);

  const navigation = useNavigation();
  const [taskCounts, setTaskCounts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [time, setTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [imageUri, setImageUri] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (currentUser?.is_admin) {
      loadTaskCounts();
    }
  }, [tasks]);

  const loadTaskCounts = async () => {
    setIsLoading(true);
    const users = await getAllUsers();
    const counts = users.map((user) => {
      const userTasks = tasks.filter((task) => task.user_id === user.id);
      return { ...user, taskCount: userTasks.length };
    });
    setTaskCounts(counts);
    setIsLoading(false);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description);
    setTime(new Date(task.time || new Date()));
    setImageUri(task.imageUri);
    setModalVisible(true);
  };

  const handleSaveTask = async () => {
    if (editingTask) {
      const updatedTask = {
        ...editingTask,
        title,
        description,
        time: time.toLocaleTimeString("es-ES", { hour12: false }),
        imageUri,
      };

      await updateTask(editingTask.id, updatedTask);
      setModalVisible(false);
      setEditingTask(null);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro de que deseas cerrar sesión?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Cerrar Sesión",
          style: "destructive",
          onPress: () => {
            logoutUser();
            navigation.navigate("Login");
          },
        },
      ],
      { cancelable: true }
    );
  };

  if (currentUser?.is_admin) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Usuarios y Tareas</Text>
        {isLoading ? (
          <Text>Cargando...</Text>
        ) : (
          <FlatList
            data={taskCounts}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.task}>
                <Text style={styles.taskTitle}>Usuario: {item.nombre_usuario}</Text>
                <Text>Tareas asignadas: {item.taskCount}</Text>
                <Text>Premium: {item.is_premium ? "Sí" : "No"}</Text>
                <Button
                  title={`Hacer ${item.is_premium ? "No Premium" : "Premium"}`}
                  onPress={() =>
                    updateUserPremiumStatus(item.id, item.is_premium ? 0 : 1)
                  }
                />
              </View>
            )}
          />
        )}
        <Button title="Cerrar Sesión" color="red" onPress={handleLogout} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis Tareas</Text>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.task}>
            <Text style={styles.taskTitle}>Título: {item.title}</Text>
            <Text>Fecha: {item.date}</Text>
            <Text>Hora: {item.time}</Text>
            <TouchableOpacity
              onPress={() => handleEditTask(item)}
              style={styles.editButton}
            >
              <Text style={styles.editText}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => deleteTask(item.id)}
              style={styles.deleteButton}
            >
              <Text style={styles.deleteText}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <Button
        title="Agregar Nueva Tarea"
        onPress={() => navigation.navigate("Calendario")}
      />
      <Button title="Cerrar Sesión" color="red" onPress={handleLogout} />

      {/* Modal for Editing Tasks */}
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
            <Button title="Seleccionar Hora" onPress={() => setShowTimePicker(true)} />
            {showTimePicker && (
              <DateTimePicker
                value={time}
                mode="time"
                is24Hour={true}
                display="default"
                onChange={(event, selectedTime) =>
                  setTime(selectedTime || time)
                }
              />
            )}
            <ImagePickerComponent onImageSelected={(uri) => setImageUri(uri)} />
            <Button title="Guardar Cambios" onPress={handleSaveTask} />
            <Button
              title="Cancelar"
              color="red"
              onPress={() => setModalVisible(false)}
            />
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
    backgroundColor: "#e0e0e0",
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  editButton: {
    backgroundColor: "blue",
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  editText: {
    color: "white",
    textAlign: "center",
  },
  deleteButton: {
    backgroundColor: "red",
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  deleteText: {
    color: "white",
    textAlign: "center",
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
});

export default Tareas;
