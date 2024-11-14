import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const SidebarMenu = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>LOGO</Text>
      <Button title="Hazte Premium" onPress={() => {}} />
      <Button title="Tareas Importantes" onPress={() => {}} />
      <Button title="Preguntas Frecuentes" onPress={() => {}} />
      <Button title="Ajustes" onPress={() => {}} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#add8e6',
    padding: 20,
  },
  logo: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
  },
});

export default SidebarMenu;
