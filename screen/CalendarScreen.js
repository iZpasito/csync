import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Button,
  Modal,
  TextInput,
  Image,
} from "react-native";
import { Agenda } from "react-native-calendars";
import DateTimePicker from "@react-native-community/datetimepicker";
import { PlaceContext } from "../controller/taskController";
import ImagePickerComponent from "../components/ImagePicker";

const CalendarScreen = () => {
  const { tasks, loadTasks, addTask, updateTask } = useContext(PlaceContext);
  const [selectedDate, setSelectedDate] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [time, setTime] = useState(new Date());
  const [imageUri, setImageUri] = useState(null);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const [agendaItems, setAgendaItems] = useState({});

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    formatTasksForAgenda();
  }, [tasks]);

  const formatTasksForAgenda = () => {
    const items = {};
    tasks.forEach((task) => {
      if (!items[task.date]) {
        items[task.date] = [];
      }
      items[task.date].push({
        name: task.title,
        description: task.description,
        time: task.time,
        imageUri: task.imageUri,
        id: task.id,
        date: task.date,
      });
    });
    setAgendaItems(items);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setTitle(task.name); // Cargar el título desde el nombre de la tarea
    setDescription(task.description);
    setTime(new Date(task.time || new Date()));
    setImageUri(task.imageUri);
    setSelectedDate(task.date); // Asegúrate de seleccionar la fecha correspondiente
    setModalVisible(true);
  };

  const handleAddTask = () => {
    setEditingTask(null);
    setTitle("");
    setDescription("");
    setTime(new Date());
    setImageUri(null);
    setModalVisible(true);
  };

  const handleSaveTask = async () => {
    if (!title.trim() || !description.trim()) {
      alert("Por favor completa todos los campos.");
      return;
    }

    const taskData = {
      title,
      description,
      time: time.toLocaleTimeString("es-ES", { hour12: false }),
      date: selectedDate,
      imageUri,
    };

    try {
      if (editingTask) {
        await updateTask(editingTask.id, { ...editingTask, ...taskData });
      } else {
        await addTask(taskData);
      }
      setModalVisible(false);
      setEditingTask(null);
      loadTasks();
    } catch (error) {
      console.error("Error al guardar la tarea:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Agenda
        items={agendaItems}
        renderItem={(item) => (
          <View style={styles.taskContainer}>
            <Text style={styles.taskTitle}>{item.name}</Text>
            <Text>{item.description}</Text>
            <Text>{item.time}</Text>
            {item.imageUri && (
              <Image source={{ uri: item.imageUri }} style={styles.image} />
            )}
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => handleEditTask(item)}
            >
              <Text style={styles.editText}>Editar</Text>
            </TouchableOpacity>
          </View>
        )}
        renderEmptyDate={() => (
          <View style={styles.emptyDate}>
            <Text>No hay tareas para este día</Text>
          </View>
        )}
        onDayPress={(day) => setSelectedDate(day.dateString)}
        selected={selectedDate}
      />
      <Button title="Agregar Tarea" onPress={handleAddTask} />
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              {editingTask ? "Editar Tarea" : "Agregar Tarea"}
            </Text>
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
                onChange={(event, selectedTime) => {
                  setShowTimePicker(false);
                  setTime(selectedTime || time);
                }}
              />
            )}
            <Text style={styles.timeLabel}>
              Hora seleccionada: {time.toLocaleTimeString("es-ES", { hour12: false })}
            </Text>
            <ImagePickerComponent onImageSelected={setImageUri} />
            {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
            <View style={styles.buttonRow}>
              <Button title="Guardar" onPress={handleSaveTask} />
              <Button title="Cancelar" color="red" onPress={() => setModalVisible(false)} />
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
  taskContainer: {
    backgroundColor: "#e0f7fa",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  editButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  editText: {
    color: "#fff",
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  timeLabel: {
    fontSize: 16,
    marginTop: 10,
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
    width: "100%",
    marginTop: 10,
  },
  emptyDate: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default CalendarScreen;
