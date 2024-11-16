import { View, Text, StyleSheet, FlatList, TouchableOpacity, Button, TextInput, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { PlaceContext } from '../controller/taskController';
import { useContext, useLayoutEffect } from 'react';


const TasksScreen = () => {
  const TareasCTX = useContext(PlaceContext);
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('pendiente');
  const [time, setTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const { selectedDate } = TareasCTX;

  useLayoutEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const fetchedTasks = await TareasCTX.getTask();
      setTasks(fetchedTasks);
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  const addTask = async () => {
    if (title && description) {
      const formattedTime = time.toLocaleTimeString('es-ES', { hour12: false }); // Formato 'HH:MM:SS'
      try {
        await TareasCTX.createTask(title, description, '', status, formattedTime, selectedDate);
        setTitle('');
        setDescription('');
        setTime(new Date());
        loadTasks();
      } catch (error) {
        console.error('Error adding task:', error);
      }
    } else {
      Alert.alert("Por favor completa todos los campos");
    }
  };

  const deleteTask = async (id) => {
    try {
      await TareasCTX.deleteTask(id);
      loadTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const editTask = async (id) => {
    const updatedTitle = prompt("Nuevo título:");
    const updatedDescription = prompt("Nueva descripción:");
    const updatedStatus = prompt("Nuevo estado:");
    const updatedTime = prompt("Nueva hora:");
    if (updatedTitle && updatedDescription && updatedStatus && updatedTime) {
      try {
        await TareasCTX.modifyTask(id, updatedTitle, updatedDescription, '', updatedStatus, updatedTime);
        loadTasks();
      } catch (error) {
        console.error('Error editing task:', error);
      }
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
      <Button title="Agregar Tarea" onPress={addTask} />
      <Button title="Seleccionar Hora" onPress={() => setShowTimePicker(true)} />
      {showTimePicker && (
        <DateTimePicker
          value={time}
          mode="time"
          display="default"
          onChange={onTimeChange}
        />
      )}
      <Text>Hora seleccionada: {time.toTimeString().split(' ')[0]}</Text>
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