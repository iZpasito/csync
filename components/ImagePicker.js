import React, { useState } from 'react';
   import { View, Button, Image, Alert } from 'react-native';
   import * as ImagePicker from 'expo-image-picker';
   
   const ImagePickerComponent = () => {
       const [pickedImage, setPickedImage] = useState();

       const verifyPermissions = async () => {
           const { status } = await ImagePicker.requestCameraPermissionsAsync();
           if (status !== 'granted') {
               Alert.alert(
                   'Insufficient permissions!',
                   'You need to grant camera permissions to use this app.',
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
                       />
                   ) : (
                       <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                           <Button title="Take Image" onPress={takeImageHandler} />
                       </View>
                   )}
               </View>
           </View>
       );
   };

   export default ImagePickerComponent;