import React, { useState } from 'react';
import { View, Text, Button, TextInput, FlatList, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { DatePickerModal } from 'react-native-paper-dates';

const AgendaWithPhotoReminder = ({ navigation }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState({});
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [time, setTime] = useState('');
  const [open, setOpen] = useState(false);

  const addEvent = () => {
    if (!title || !selectedDate) return alert('Faltan datos para agregar el evento.');

    const newEvent = { title, description, time };
    setEvents((prevEvents) => ({
      ...prevEvents,
      [selectedDate.toISOString().split('T')[0]]: prevEvents[selectedDate.toISOString().split('T')[0]]
        ? [...prevEvents[selectedDate.toISOString().split('T')[0]], newEvent]
        : [newEvent],
    }));
    setTitle('');
    setDescription('');
    setTime('');
  };

  const onConfirm = (params) => {
    setSelectedDate(params.startDate);  // Solo se usa la fecha de inicio
    setOpen(false);
  };

  return (
    <View style={styles.container}>
      <Button title="Seleccionar Rango de Fechas" onPress={() => setOpen(true)} />
      <DatePickerModal
        mode="range"
        visible={open}
        onDismiss={() => setOpen(false)}
        onConfirm={onConfirm}
        startDate={selectedDate}
      />

      <Text style={styles.dateText}>
        Fecha seleccionada: {selectedDate ? selectedDate.toLocaleDateString() : 'Ninguna'}
      </Text>

      <View style={styles.eventInput}>
        <TextInput
          style={styles.input}
          placeholder="Título del evento"
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={styles.input}
          placeholder="Descripción"
          value={description}
          onChangeText={setDescription}
        />
        <TextInput
          style={styles.input}
          placeholder="Hora"
          value={time}
          onChangeText={setTime}
        />
        <Button title="Guardar Evento y Agregar Foto" onPress={() => navigation.navigate('PhotoScreen')} />
      </View>

      <FlatList
        data={events[selectedDate ? selectedDate.toISOString().split('T')[0] : ''] || []}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.eventItem}>
            <Text style={styles.eventTitle}>{item.title}</Text>
            <Text>{item.description}</Text>
            <Text>{item.time}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.noEvents}>No hay eventos para esta fecha</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  eventInput: {
    marginVertical: 20,
  },
  dateText: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 8,
    marginBottom: 10,
  },
  eventItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  eventTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  noEvents: {
    textAlign: 'center',
    color: 'gray',
    marginVertical: 20,
  },
});

export default AgendaWithPhotoReminder;
