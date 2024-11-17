import React, { useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Image, Alert } from 'react-native';
import { Agenda } from 'react-native-calendars';
import ImagePickerComponent from '../components/ImagePicker';
import { PlaceContext } from '../controller/taskController';

const CalendarScreen = () => {
  const [items, setItems] = useState({});
  const { addTask, tasks, loadTasks } = useContext(PlaceContext);

  useEffect(() => {
    loadTasks();
    const calendarItems = {};
    tasks.forEach((task) => {
      const date = task.date;
      if (!calendarItems[date]) {
        calendarItems[date] = [];
      }
      calendarItems[date].push({
        name: task.title,
        height: 150,
        imageUri: task.imageUri,
      });
    });
    setItems(calendarItems);
  }, [tasks]);

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
    const imageUri = await takeImageWithPicker();
    if (imageUri) {
      addEventWithPhoto(day, imageUri);
    }
  };

  const handlePickImage = async (day) => {
    const imageUri = await pickImageFromLibrary();
    if (imageUri) {
      addEventWithPhoto(day, imageUri);
    }
  };

  const takeImageWithPicker = async () => {
    return new Promise((resolve) => {
      Alert.alert(
        'Tomar Foto',
        'Utiliza el componente de ImagePicker',
        [
          {
            text: 'Cancelar',
            style: 'cancel',
            onPress: () => resolve(null),
          },
          {
            text: 'Tomar Foto',
            onPress: async () => {
              try {
                const hasPermission = await ImagePickerComponent.verifyPermissions();
                if (!hasPermission) {
                  resolve(null);
                  return;
                }

                const image = await ImagePickerComponent.takeImageHandler();
                if (image) {
                  resolve(image);
                } else {
                  resolve(null);
                }
              } catch (error) {
                Alert.alert('Error', 'Hubo un problema al tomar la foto.');
                resolve(null);
              }
            },
          },
        ]
      );
    });
  };

  const pickImageFromLibrary = async () => {
    return new Promise((resolve) => {
      Alert.alert(
        'Adjuntar Foto',
        'Utiliza el componente de ImagePicker',
        [
          {
            text: 'Cancelar',
            style: 'cancel',
            onPress: () => resolve(null),
          },
          {
            text: 'Elegir Foto',
            onPress: async () => {
              try {
                const image = await ImagePickerComponent.pickImageHandler();
                if (image) {
                  resolve(image);
                } else {
                  resolve(null);
                }
              } catch (error) {
                Alert.alert('Error', 'Hubo un problema al adjuntar la foto.');
                resolve(null);
              }
            },
          },
        ]
      );
    });
  };

  const addEventWithPhoto = (day, uri) => {
    const selectedDate = day.dateString;
    const newTask = {
      title: 'Evento con foto',
      description: 'Descripción del evento con foto',
      status: 'pendiente',
      time: '12:00',
      date: selectedDate,
      imageUri: uri,
      created_at: new Date().toISOString(),
    };
    addTask(newTask);
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
