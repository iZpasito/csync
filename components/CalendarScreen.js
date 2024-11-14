import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CalendarScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Noviembre 2024</Text>
      <View style={styles.calendar}>
        <Text>[Calendario aquí]</Text>
      </View>
      <Text style={styles.subtitle}>Recordatorios</Text>
      <View style={styles.reminder}>
        <Text>Clases</Text>
        <Text>22:00 - 23:00</Text>
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
    marginBottom: 20,
  },
  calendar: {
    backgroundColor: '#e0e0e0',
    padding: 20,
    marginBottom: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  reminder: {
    backgroundColor: '#e0e0e0',
    padding: 15,
    borderRadius: 10,
  },
});

export default CalendarScreen;
