import React, { useState } from 'react';
import { View, Button, Image, Alert, Text, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const ImagePickerComponent = () => {
  const [pickedImage, setPickedImage] = useState(null);

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
        quality: 0.5,
      });

      if (!image.canceled) {
        setPickedImage(image.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Hubo un problema al tomar la foto. Por favor intenta nuevamente.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.imagePreview}>
        {pickedImage ? (
          <Image
            style={styles.image}
            source={{ uri: pickedImage }}
            onError={() => Alert.alert('Error', 'No se pudo cargar la imagen.')}
          />
        ) : (
          <Text style={styles.noImageText}>No se ha seleccionado ninguna imagen</Text>
        )}
      </View>
      <Button title="Tomar Imagen" onPress={takeImageHandler} />
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
  noImageText: {
    textAlign: 'center',
    color: 'gray',
  },
});

export default ImagePickerComponent;
