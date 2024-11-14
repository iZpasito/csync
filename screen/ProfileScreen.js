import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ProfileScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nombre</Text>
      <Text>Plan actual</Text>
      <View style={styles.summary}>
        <Text>30 Tareas Completas</Text>
        <Text>4 Tareas Pendientes</Text>
      </View>
      <View style={styles.chart}>
        <Text>[Gráfica aquí]</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
  },
  summary: {
    marginBottom: 20,
  },
  chart: {
    backgroundColor: '#e0e0e0',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
});

export default ProfileScreen;
