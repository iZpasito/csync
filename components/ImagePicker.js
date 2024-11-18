import React, { useState } from 'react';
import { View, Button, Image, Alert, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const ImagePickerComponent = ({ onImageSelected }) => {
  const [pickedImage, setPickedImage] = useState();

  const verifyPermissions = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permisos Insuficientes',
        'Necesitas otorgar permisos de cámara para usar esta funcionalidad.',
        [{ text: 'Ok' }]
      );
      return false;
    }
    return true;
  };

  const takeImageHandler = async () => {
    const hasPermission = await verifyPermissions();
    if (!hasPermission) {
      return;
    }

    try {
      const image = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

      if (!image.canceled ) {
        setPickedImage(image.assets[0].uri);
        onImageSelected(image.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Hubo un problema al tomar la foto. Por favor intenta nuevamente.');
    }
  };

  const pickImageHandler = async () => {
    try {
      const image = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.5,
      });
      if (!image.canceled) {
        setPickedImage(image.assets[0].uri);
        onImageSelected(image.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Hubo un problema al seleccionar la foto. Por favor intenta nuevamente.');
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Tomar Foto" onPress={takeImageHandler} />
      <Button title="Elegir desde la Galería" onPress={pickImageHandler} />
      {pickedImage && (
        <View style={styles.imagePreview}>
          <Image style={styles.image} source={{ uri:pickedImage}} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export default ImagePickerComponent;
