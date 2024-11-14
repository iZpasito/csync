import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, Image, Alert } from 'react-native';
import { Agenda } from 'react-native-calendars';
import * as ImagePicker from 'expo-image-picker';

const CalendarScreen = () => {
  const [items, setItems] = useState({});

  const handleAddPhoto = async (day) => {
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
          onPress: () => handleTakePhoto(day),
        },
        {
          text: 'Adjuntar Foto',
          onPress: () => handlePickImage(day),
        },
      ]
    );
  };

  const handleTakePhoto = async (day) => {
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
      addEventWithPhoto(day, result.uri);
    }
  };

  const handlePickImage = async (day) => {
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

    if (!result.cancelled) {
      addEventWithPhoto(day, result.uri);
    }
  };

  const addEventWithPhoto = (day, uri) => {
    const selectedDate = day.dateString;
    setItems((prevItems) => {
      const newItems = { ...prevItems };
      if (!newItems[selectedDate]) {
        newItems[selectedDate] = [];
      }
      newItems[selectedDate].push({
        name: 'Evento con foto',
        height: 150,
        imageUri: uri,
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
          // Puedes cargar eventos para el mes si tienes datos externos.
        }}
        onDayPress={(day) => handleAddPhoto(day)}
        selected={new Date().toISOString().split('T')[0]}
        renderItem={renderItem}
      />
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
