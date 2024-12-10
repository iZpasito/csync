import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Button,
} from "react-native";
import { Agenda } from "react-native-calendars";
import { PlaceContext } from "../controller/taskController";
import TaskEditModal from "../components/editmodal";

const CalendarScreen = () => {
  const { tasks, loadTasks, addTask, updateTask } = useContext(PlaceContext);
  const [selectedDate, setSelectedDate] = useState(null);
  const [dayTasks, setDayTasks] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    if (selectedDate) {
      filterTasksByDate();
    }
  }, [tasks, selectedDate]);

  const filterTasksByDate = () => {
    const filteredTasks = tasks.filter((task) => task.date === selectedDate);
    setDayTasks(filteredTasks);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setModalVisible(true);
  };

  const handleAddTask = () => {
    const newTask = {
      title: "",
      description: "",
      time: new Date().toLocaleTimeString("es-ES", { hour12: false }),
      date: selectedDate,
      imageUri: null,
    };
    setEditingTask(newTask); // Prepare the modal for a new task
    setModalVisible(true);
  };

  const handleSaveTask = async (updatedTask) => {
    try {
      if (updatedTask.id) {
        updateTask(updatedTask.id, updatedTask);
      } else {
        addTask(updatedTask);
      }
      setModalVisible(false);
      setEditingTask(null);
      loadTasks(); // Recarga las tareas
    } catch (error) {
      console.error("Error al guardar tarea:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Agenda
        items={{}}
        onDayPress={(day) => setSelectedDate(day.dateString)}
        selected={selectedDate}
      />
      <Text style={styles.label}>
        Tareas del día: {selectedDate || "Seleccione un día"}
      </Text>
      <FlatList
        data={dayTasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.taskContainer}>
            <Text style={styles.taskTitle}>Título: {item.title}</Text>
            <Text>Descripción: {item.description}</Text>
            <Text>Hora: {item.time}</Text>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => handleEditTask(item)}
            >
              <Text style={styles.editText}>Editar</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <Button title="Agregar Tarea" onPress={handleAddTask} />
      <TaskEditModal
        visible={modalVisible}
        task={editingTask}
        onSave={handleSaveTask}
        onCancel={() => setModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
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
});

export default CalendarScreen;
