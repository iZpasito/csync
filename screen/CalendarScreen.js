import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, Button, Image, Alert } from 'react-native';
import { Agenda } from 'react-native-calendars';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { PlaceContext } from '../controller/taskController';

const CalendarScreen = () => {
  const { setSelectedDate } = useContext(PlaceContext);
  const [items, setItems] = useState({});
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedTime, setSelectedTime] = useState(new Date());
  const navigation = useNavigation();

  const handleAddPhoto = async (day) => {
    setSelectedDay(day);
    setShowTimePicker(true);
  };

  const handleTimeChange = (event, time) => {
    setShowTimePicker(false);
    if (time) {
      setSelectedTime(time);
      Alert.alert(
        'Agregar Foto',
        'Elige cómo quieres agregar la foto',
        [
          {
            text: 'Cancelar',
            style: 'cancel',
          },
          {
            text: 'Tomar Foto',
            onPress: () => handleTakePhoto(selectedDay, time),
          },
          {
            text: 'Adjuntar Foto',
            onPress: () => handlePickImage(selectedDay, time),
          },
          {
            text: 'Agregar Tarea',
            onPress: () => {
              setSelectedDate(selectedDay.dateString);
              navigation.navigate('Tasks');
            },
          },
        ]
      );
    }
  };

  const handleTakePhoto = async (day, time) => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permisos Insuficientes', 'Necesitas otorgar permisos de cámara para tomar fotos.', [{ text: 'OK' }]);
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      addEventWithPhoto(day, time, result.assets[0].uri);
    }
  };

  const handlePickImage = async (day, time) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permisos Insuficientes', 'Necesitas otorgar permisos de acceso a la galería para adjuntar fotos.', [{ text: 'OK' }]);
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      addEventWithPhoto(day, time, result.assets[0].uri);
    }
  };

  const addEventWithPhoto = (day, time, uri) => {
    const selectedDate = day.dateString;
    const formattedTime = time.toLocaleTimeString('es-ES', { hour12: false });
    setItems((prevItems) => {
      const newItems = { ...prevItems };
      if (!newItems[selectedDate]) {
        newItems[selectedDate] = [];
      }
      newItems[selectedDate].push({
        name: `Evento con foto a las ${formattedTime}`,
        height: 150,
        imageUri: uri,
        time: formattedTime,
      });
      return newItems;
    });
  };

  const renderItem = (item) => {
    return (
      <View style={styles.item}>
        <Text>{item.name}</Text>
        {item.imageUri && (
          <Image source={{ uri: item.imageUri }} style={styles.image} />
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Agenda
        items={items}
        loadItemsForMonth={(month) => {
          console.log('Cargando items para', month);
        }}
        onDayPress={(day) => handleAddPhoto(day)}
        selected={new Date().toISOString().split('T')[0]}
        renderItem={renderItem}
        theme={{
          agendaDayTextColor: 'blue',
          agendaDayNumColor: 'green',
          agendaTodayColor: 'red',
          agendaKnobColor: 'blue',
        }}
      />
      {showTimePicker && (
        <DateTimePicker
          value={selectedTime}
          mode="time"
          display="default"
          onChange={handleTimeChange}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  item: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 100,
    marginTop: 10,
    borderRadius: 10,
  },
});

export default CalendarScreen;