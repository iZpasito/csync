import React, { useState } from "react";
import { View, Button, Image, Alert, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";

const ImagePickerComponent = ({ onImageSelected }) => {
  const [pickedImage, setPickedImage] = useState(null);

  const verifyPermissions = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permisos Insuficientes",
        "Se necesitan permisos para usar la cámara.",
        [{ text: "Ok" }]
      );
      return false;
    }
    return true;
  };

  const pickImageFromGallery = async () => {
    try {
      const imageResult = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

      if (!imageResult.canceled) {
        const selectedUri = imageResult.assets[0].uri;
        setPickedImage(selectedUri);
        onImageSelected(selectedUri);
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo seleccionar la imagen. Intenta de nuevo.");
    }
  };

  const takePhotoHandler = async () => {
    const hasPermission = await verifyPermissions();
    if (!hasPermission) {
      return;
    }

    try {
      const photoResult = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

      if (!photoResult.canceled) {
        const selectedUri = photoResult.assets[0].uri;
        setPickedImage(selectedUri);
        onImageSelected(selectedUri);
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo tomar la foto. Intenta de nuevo.");
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Elegir Imagen de la Galería" onPress={pickImageFromGallery} />
      <Button title="Tomar Foto" onPress={takePhotoHandler} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginBottom: 20,
  },
  imagePreview: {
    width: "100%",
    height: 200,
    marginTop: 10,
  },
});

export default ImagePickerComponent;
