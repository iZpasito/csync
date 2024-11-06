import React, { useState, useEffect } from 'react';
import { View, Text, Button, Image, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const PhotoScreen = ({ navigation }) => {
  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso Denegado', 'Se necesita permiso para acceder a la cámara.');
      }
    })();
  }, []);

  const selectPhoto = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.cancelled) {
      setPhoto(result);
    }
  };

  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.cancelled) {
      setPhoto(result);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Seleccionar o Tomar Foto</Text>
      <Button title="Seleccionar Foto" onPress={selectPhoto} />
      <Button title="Tomar Foto" onPress={takePhoto} />

      {photo && <Image source={{ uri: photo.uri }} style={styles.image} />}

      <Button
        title="Guardar y Volver"
        onPress={() => navigation.goBack()}
        disabled={!photo}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginTop: 20,
  },
});

export default PhotoScreen;
