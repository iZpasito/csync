import React, { useState } from 'react';
import { View, Button, Image, Alert, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const ImagePickerComponent = () => {
    const [pickedImage, setPickedImage] = useState(null);

    const verifyPermissions = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert(
                'No tienes Permisos Suficientes!',
                'Necesitas Permisos para esta acción',
                [{ text: 'Okay' }]
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

        const image = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [16, 9],
            quality: 0.5,
        });
        
        if (!image.cancelled) {
            setPickedImage(image.uri);
        }
    };

    return (
        <View>
            <View style={{ width: '100%', height: 200, marginBottom: 10 }}>
                {pickedImage ? (
                    <Image
                        style={{ width: '100%', height: '100%' }}
                        source={{ uri: pickedImage }}
                        onError={() => Alert.alert("Error", "No se pudo cargar la imagen.")}
                    />
                ) : (
                    <Text style={{ textAlign: 'center', marginBottom: 10 }}>No se ha seleccionado ninguna imagen</Text>
                )}
            </View>
            <Button title="Take Image" onPress={takeImageHandler} />
        </View>
    );
};

export default ImagePickerComponent;
