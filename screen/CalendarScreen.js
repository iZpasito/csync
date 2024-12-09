import React, { useContext, useState } from "react";
import {
  View,
  Text,
  Button,
  Alert,
  StyleSheet,
  Image,
  TextInput,
} from "react-native";
import { Agenda } from "react-native-calendars";
import DateTimePicker from "@react-native-community/datetimepicker";
import { PlaceContext } from "../controller/taskController";
import ImagePickerComponent from "../components/ImagePicker";

const CalendarScreen = ({ navigation }) => {
  const { addTask } = useContext(PlaceContext);
  const [selectedDate, setSelectedDate] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [time, setTime] = useState(new Date());
  const [imageUri, setImageUri] = useState();
  const [showTimePicker, setShowTimePicker] = useState(false);

  const onTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || time;
    setShowTimePicker(false);
    setTime(currentTime);
  };

  const handleAddTask = async () => {
    if (!selectedDate || !title.trim() || !description.trim()) {
      Alert.alert("Error", "Por favor completa todos los campos requeridos.");
      return;
    }

    const newTask = {
      title,
      description,
      time: time.toLocaleTimeString("es-ES", { hour12: false }),
      date: selectedDate,
      imageUri,
    };

    try {
      await addTask(newTask);
      Alert.alert("Éxito", "Tarea agregada correctamente.");
      navigation.navigate("Tareas");
    } catch (error) {
      console.error("Error al agregar tarea:", error);
      Alert.alert("Error", "No se pudo agregar la tarea.");
    }
  };

  return (
    <View style={styles.container}>
      <Agenda
        items={{}}
        onDayPress={(day) => setSelectedDate(day.dateString)}
        selected={selectedDate}
      />
      <Text style={styles.label}>Título:</Text>
      <TextInput
        style={styles.input}
        placeholder="Título"
        value={title}
        onChangeText={setTitle}
      />
      <Text style={styles.label}>Descripción:</Text>
      <TextInput
        style={styles.input}
        placeholder="Descripción"
        value={description}
        onChangeText={setDescription}
      />
      <Text style={styles.label}>Imagen:</Text>
      <ImagePickerComponent onImageSelected={setImageUri} />
      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
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
      <Text style={styles.timeLabel}>
        Hora seleccionada: {time.toLocaleTimeString("es-ES", { hour12: false })}
      </Text>
      <Button title="Agregar Tarea" onPress={handleAddTask} />
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
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  image: {
    width: "100%",
    height: 150,
    marginVertical: 10,
  },
  timeLabel: {
    fontSize: 16,
    marginTop: 10,
  },
});

export default CalendarScreen;
